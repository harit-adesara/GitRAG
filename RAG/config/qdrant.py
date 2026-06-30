from langchain_qdrant import QdrantVectorStore
from qdrant_client import QdrantClient
from qdrant_client.models import PayloadSchemaType
from config.jinaa import embeddings
from qdrant_client.models import VectorParams,Distance
import os
from dotenv import load_dotenv

load_dotenv()

client = QdrantClient(
    url=os.getenv("QDRANT_URL"),
    api_key=os.getenv("QDRANT_API_KEY")
)

if not client.collection_exists("github_rag"):
    client.create_collection(
        collection_name="github_rag",
        vectors_config=VectorParams(
            size=768,
            distance=Distance.COSINE
        )
    )

client.create_payload_index(
    collection_name="github_rag",
    field_name="metadata.MongoId",
    field_schema=PayloadSchemaType.KEYWORD
)

vectorstore = QdrantVectorStore.from_existing_collection(
    embedding=embeddings,
    url=os.getenv("QDRANT_URL"),
    api_key=os.getenv("QDRANT_API_KEY"),
    collection_name="github_rag",
)