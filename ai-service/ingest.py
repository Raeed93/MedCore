import sys, os, glob
from document_processor import DocumentProcessor
from rag_engine import RAGEngine

def main(doc_dir):
    # Groq's client rejects an empty key, but ingestion never calls the LLM —
    # only the local SentenceTransformers embedder. A placeholder is fine.
    key = os.getenv("GROQ_API_KEY") or "placeholder-not-used-during-ingest"
    engine = RAGEngine(groq_api_key=key)
    processor = DocumentProcessor()

    files = sorted(glob.glob(os.path.join(doc_dir, "*.pdf")) +
                   glob.glob(os.path.join(doc_dir, "*.docx")))
    if not files:
        sys.exit(f"No documents found in {doc_dir}")

    print(f"Found {len(files)} document(s). Starting count: {engine.collection.count()}")

    for path in files:
        name = os.path.basename(path)
        print(f"\n=== {name} ===")
        metadata = processor.process_document(path, name)
        chunks = processor.extract_chunks(path)
        print(f"{metadata.get('pages','?')} pages -> {len(chunks)} chunks")
        engine.add_documents(chunks, metadata)

    print(f"\nDone. Total chunks: {engine.collection.count()}")

if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "/documents")