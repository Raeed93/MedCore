import os
import chromadb
from sentence_transformers import SentenceTransformer

QUERIES = {
    "ON-TOPIC": [
        "fever, cough and difficulty breathing for three days",
        "chest pain and shortness of breath",
    ],
    "ADJACENT (medical, likely outside corpus)": [
        "pulled hamstring after sprinting, pain in back of thigh",
        "sprained ankle playing football, swollen and bruised",
    ],
    "OFF-TOPIC (should be rejected)": [
        "how do I change the oil in my car",
        "best way to cook risotto",
    ],
}

path = os.getenv("CHROMA_PERSIST_DIRECTORY", "./chroma_db")
name = os.getenv("CHROMA_COLLECTION_NAME", "medical_documents")
model = os.getenv("EMBEDDING_MODEL", "sentence-transformers/all-MiniLM-L6-v2")

col = chromadb.PersistentClient(path=path).get_or_create_collection(name=name)
print("\nChunks indexed:", col.count())
print("Metric:", (col.metadata or {}).get("hnsw:space", "l2 (default)"))

emb = SentenceTransformer(model)

for label, queries in QUERIES.items():
    print("\n" + "=" * 60)
    print(label)
    print("=" * 60)
    for q in queries:
        vec = emb.encode([q])[0].tolist()
        res = col.query(query_embeddings=[vec], n_results=3)
        print(f'\n  "{q}"')
        dists = res["distances"][0] if res["distances"] else []
        metas = res["metadatas"][0] if res["metadatas"] else []
        for d, m in zip(dists, metas):
            print(f"    {d:7.4f}   {m.get('filename', 'unknown')}")
print()
