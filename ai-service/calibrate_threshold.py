"""
Calibration for the RAG relevance threshold.

Re-run this after ANY significant change to the document set. The correct cutoff
is a property of the corpus, not a constant — a value tuned to 34 chunks of
sports-injury text is not necessarily right for 612 chunks across nine areas.

    docker compose exec ai-service python calibrate_threshold.py
"""

import os
import chromadb
from sentence_transformers import SentenceTransformer

# Conditions the corpus genuinely covers, phrased the way someone describes
# symptoms rather than the way a document titles them. That gap is the thing
# being measured — if a plain-language complaint cannot find its own document,
# the problem is chunking or the embedding model, not the threshold.
ON_TOPIC = [
    "burning chest pain and sour taste after eating",          # GERD
    "thirsty all the time and urinating frequently",           # diabetes
    "throbbing headache with nausea and light sensitivity",    # migraine
    "wheezing and tight chest when I exercise",                # asthma
    "snoring loudly and waking up gasping",                    # sleep apnea
    "lower back pain after lifting something heavy",           # back pain
    "stiff aching knees worse in the morning",                 # osteoarthritis
    "fever, body aches and a dry cough",                       # flu
]

# Real complaints the corpus has no documents for. These are the ones that
# matter — plausible enough to retrieve something, wrong enough to mislead.
ADJACENT = [
    "ringing in my ears that will not stop",
    "toothache on the lower left side for two days",
    "blurry vision when reading up close",
    "pain and burning when urinating",
]

# Should be rejected by any working threshold.
OFF_TOPIC = [
    "how do I change the oil in my car",
    "best way to cook risotto",
    "what is the capital of France",
]


def main():
    path = os.getenv("CHROMA_PERSIST_DIRECTORY", "./chroma_db")
    name = os.getenv("CHROMA_COLLECTION_NAME", "medical_documents")
    model = os.getenv("EMBEDDING_MODEL", "sentence-transformers/all-MiniLM-L6-v2")
    current = float(os.getenv("RAG_MAX_DISTANCE", "1.25"))

    col = chromadb.PersistentClient(path=path).get_or_create_collection(name=name)
    print(f"\nChunks indexed: {col.count()}")
    print(f"Current RAG_MAX_DISTANCE: {current}")

    emb = SentenceTransformer(model)

    def probe(label, queries):
        print("\n" + "=" * 70)
        print(label)
        print("=" * 70)
        best = []
        for q in queries:
            vec = emb.encode([q])[0].tolist()
            res = col.query(query_embeddings=[vec], n_results=3)
            dists = res["distances"][0] if res["distances"] else []
            metas = res["metadatas"][0] if res["metadatas"] else []
            if not dists:
                print(f'\n  "{q}"\n    no results')
                continue
            best.append(dists[0])
            kept = sum(1 for d in dists if d <= current)
            print(f'\n  "{q}"   [{kept}/3 pass at {current}]')
            for d, m in zip(dists, metas):
                mark = "PASS" if d <= current else "drop"
                print(f"    {mark}  {d:7.4f}  {m.get('filename', 'unknown')}")
        return best

    on = probe("ON-TOPIC — must be retrieved", ON_TOPIC)
    adj = probe("ADJACENT — real complaints, no documents for them", ADJACENT)
    off = probe("OFF-TOPIC — must be rejected", OFF_TOPIC)

    print("\n" + "=" * 70)
    print("SUMMARY (best distance per query)")
    print("=" * 70)
    for label, vals in (("on-topic", on), ("adjacent", adj), ("off-topic", off)):
        if vals:
            print(f"  {label:10} min={min(vals):7.4f}  max={max(vals):7.4f}  "
                  f"avg={sum(vals)/len(vals):7.4f}")

    if on and adj:
        worst_on, best_adj = max(on), min(adj)
        print(f"\n  Worst on-topic:  {worst_on:.4f}   (must be accepted)")
        print(f"  Best adjacent:   {best_adj:.4f}   (should be rejected)")

        if best_adj > worst_on:
            print(f"\n  Clean separation. Suggested cutoff = {(worst_on + best_adj) / 2:.2f}")
        else:
            print("\n  Overlap: some out-of-corpus queries score closer than some")
            print("  in-corpus ones, so no single cutoff separates them cleanly.")
            print("  Prefer a value that accepts every on-topic query and let a few")
            print("  adjacent ones through. A wrongly rejected query still gets a")
            print("  useful general-knowledge answer; a wrongly rejected valid one")
            print("  loses the citation that makes the tool worth using.")
    print()


if __name__ == "__main__":
    main()