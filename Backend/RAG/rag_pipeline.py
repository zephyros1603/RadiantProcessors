from langchain_community.document_loaders import DirectoryLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import SentenceTransformerEmbeddings

import os

# === Config ===
directory = "./data"  # your folder with notes/files
embedding_model = "all-MiniLM-L6-v2"  # fast and small SentenceTransformer

# === Step 1: Load Documents ===
loader = DirectoryLoader(directory , glob="**/*.txt",show_progress=True)  # adjust glob pattern as needed
documents = loader.load()
print(f"Loaded {len(documents)} document(s).\n")

# === Step 2: Split Documents ===
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50,
)
docs = text_splitter.split_documents(documents)
print(f"Split into {len(docs)} chunks.\n")

# === Print Chunks for Debugging ===
for i, doc in enumerate(docs[:5]):  # print first 5
    print(f"Chunk #{i + 1}:\n{doc.page_content}\n{'-' * 50}")

# === Step 3: Initialize Embeddings ===
embedding_function = SentenceTransformerEmbeddings(model_name=embedding_model)

# === Step 4: Create Vector Store ===
db = Chroma.from_documents(
    documents=docs,
    embedding=embedding_function,
    persist_directory="./chromadb_test"
)

# === Step 5: Print Vector Embeddings ===
print("\nVector Embeddings (sample):")
for i in range(3):  # print vectors for first 3 chunks
    embedding = embedding_function.embed_query(docs[i].page_content)
    print(f"Vector for Chunk #{i + 1} (len={len(embedding)}):")
    print(embedding[:10], "...")  # print first 10 values for brevity
    print('-' * 50)