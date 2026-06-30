import os
import shutil
import stat
import time
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import GitLoader 
from fastapi import HTTPException
from config.qdrant import vectorstore, client
from qdrant_client.models import Filter, FieldCondition, MatchValue

def force_delete_repo(path):
    def handle_permission_error(func, path, exc_info):
        os.chmod(path, stat.S_IWRITE)
        func(path)
    if os.path.exists(path):
        shutil.rmtree(path, onexc=handle_permission_error)


EXTENSION_TO_LANGUAGE = {
    ".py": "python",
    ".js": "js", ".jsx": "js",
    ".ts": "ts", ".tsx": "ts",
    ".java": "java",
    ".c": "c", ".cpp": "cpp", ".h": "c",
    ".go": "go", ".rs": "rust",
    ".sh": "bash",
    ".html": None, ".css": None, ".md": None,
    ".txt": None, ".json": None, ".yml": None, ".yaml": None,
}

ALLOWED_EXTENSIONS = set(EXTENSION_TO_LANGUAGE.keys())


def build_rag_index(repo_url: str, MongoId: str):
    local_dir = "./content/repo_" + MongoId
    force_delete_repo(local_dir)

    try:
        start = time.time()
        loader = GitLoader(
            clone_url=repo_url,
            repo_path=local_dir,
            branch="main",
            file_filter=lambda path: any(path.endswith(ext) for ext in ALLOWED_EXTENSIONS)
        )
        docs = loader.load()
        print("Load:", time.time() - start)

        for doc in docs:
            file_type = doc.metadata.get("file_type")
            doc.metadata["MongoId"] = MongoId
            doc.metadata["language"] = EXTENSION_TO_LANGUAGE.get(file_type)

        all_chunks = []
        start = time.time()

        for doc in docs:
            language = doc.metadata.get("language")
            if language:
                splitter = RecursiveCharacterTextSplitter.from_language(
                    language=language,
                    chunk_size=2500,
                    chunk_overlap=400
                )
            else:
                splitter = RecursiveCharacterTextSplitter(
                    chunk_size=2500,
                    chunk_overlap=400
                )
            chunks = splitter.split_documents([doc])
            for chunk in chunks:
                filepath = chunk.metadata.get("source", "")
                chunk.page_content = f"// File: {filepath}\n{chunk.page_content}"
            all_chunks.extend(chunks)

        print("Chunk:", time.time() - start)

        start = time.time()
        vectorstore.add_documents(all_chunks)
        print("Upload:", time.time() - start)

        del loader
        return "Index built successfully"

    except Exception as e:
        client.delete(
            collection_name="github_rag",
            points_selector=Filter(
                must=[
                    FieldCondition(
                        key="metadata.MongoId",
                        match=MatchValue(value=MongoId)
                    )
                ]
            )
        )
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        force_delete_repo(local_dir)
