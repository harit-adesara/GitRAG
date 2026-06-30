# from qdrant_client.models import Filter, FieldCondition, MatchValue
# from langchain_groq import ChatGroq
# from dotenv import load_dotenv
# from config.qdrant import client,vectorstore

# load_dotenv()

# from pydantic import BaseModel

# from fastapi import FastAPI,HTTPException
# from model1 import build_rag_index

# app = FastAPI()

# llm=ChatGroq(model="llama-3.1-8b-instant")


# class MessageRequest(BaseModel):
#     query: str
#     mongo_id: str

# class PullRepoRequest(BaseModel):
#     repo_url: str
#     mongo_id: str

# class RepoRequest(BaseModel):
#     repo_url: str
#     mongo_id: str

# @app.post("/initialize-repo")
# def initialize_repo(payload: RepoRequest):

#     try:
#         result = build_rag_index(
#             repo_url=payload.repo_url,
#             MongoId=payload.mongo_id
#         )

#         return {"status": "success", "message": result}

#     except Exception as e:
#         raise HTTPException(
#             status_code=500,
#             detail=str(e)
#         )

# @app.post("/pull-repo")
# def pull_repo(payload: PullRepoRequest):
#     try:

#         client.delete(
#             collection_name="github_rag",
#             points_selector=Filter(
#                 must=[
#                     FieldCondition(
#                         key="metadata.MongoId",
#                         match=MatchValue(value=payload.mongo_id)
#                     )
#                 ]
#             )
#         )

#         result = build_rag_index(
#             repo_url=payload.repo_url,
#             MongoId=payload.mongo_id
#         )
        
#         return {"message": "Pulled successfully"}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))



# @app.post("/message")
# def message(payload: MessageRequest):
#     try:

#         results = vectorstore.similarity_search(
#             payload.query,
#             k=10,
#             filter=Filter(
#                 must=[
#                     FieldCondition(
#                         key="metadata.MongoId",
#                         match=MatchValue(value=payload.mongo_id)
#                     )
#                 ]
#             )
#         )

#         # base_retriever = vectorstore.as_retriever(
#         #     search_type="mmr",
#         #     search_kwargs={
#         #         "k": 10,
#         #         "fetch_k": 30,
#         #         "lambda_mult": 0.5,
#         #         "filter": Filter(
#         #             must=[
#         #                 FieldCondition(
#         #                     key="metadata.MongoId",
#         #                     match=MatchValue(value=payload.mongo_id)
#         #                 )
#         #             ]
#         #         )
#         #     }
#         # )

#         # retriever = MultiQueryRetriever.from_llm(
#         #     retriever=base_retriever,
#         #     llm=llm
#         # )

#         # docs = retriever.get_relevant_documents(payload.query)

#         context = "\n\n".join(
#             doc.page_content
#             for doc in results
#         )

#         prompt =f"""
#         Answer using only the repository context.

#         Context:
#         {context}

#         Question:
#         {payload.query}
#         """

#         response = llm.invoke(prompt)

#         return {
#             "status": "success",
#             "query": payload.query,
#             "results": response.content
#         }

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

from qdrant_client.models import Filter, FieldCondition, MatchValue
from langchain_groq import ChatGroq
from langchain_classic.retrievers.document_compressors.cohere_rerank import CohereRerank
from fastapi.middleware.cors import CORSMiddleware 
from typing import List, Dict
from dotenv import load_dotenv
import os
from config.qdrant import client, vectorstore

load_dotenv()

from pydantic import BaseModel
from fastapi import FastAPI, HTTPException
from model1 import build_rag_index

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],     
    allow_credentials=True,
    allow_methods=["*"],       
    allow_headers=["*"],
)

llm = ChatGroq(model="llama-3.1-8b-instant")
reranker = CohereRerank(cohere_api_key=os.getenv("COHERE_API_KEY"), top_n=8, model="rerank-v3.5")

class DeleteRepo(BaseModel):
    mongo_id:str

class MessageRequest(BaseModel):
    query: str
    mongo_id: str
    history:List[Dict[str, str]]=[]

class PullRepoRequest(BaseModel):
    repo_url: str
    mongo_id: str

class RepoRequest(BaseModel):
    repo_url: str
    mongo_id: str


@app.post("/initialize-repo")
def initialize_repo(payload: RepoRequest):
    try:
        result = build_rag_index(
            repo_url=payload.repo_url,
            MongoId=payload.mongo_id
        )
        return {"status": "success", "message": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/pull-repo")
def pull_repo(payload: PullRepoRequest):
    try:
        client.delete(
            collection_name="github_rag",
            points_selector=Filter(
                must=[
                    FieldCondition(
                        key="metadata.MongoId",
                        match=MatchValue(value=payload.mongo_id)
                    )
                ]
            )
        )
        result = build_rag_index(
            repo_url=payload.repo_url,
            MongoId=payload.mongo_id
        )
        return {"message": "Pulled successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/message")
def message(payload: MessageRequest):
    try:
        # Step 1: broad similarity search — cast wide net
        docs = vectorstore.similarity_search(
            payload.query,
            k=20,
            filter=Filter(
                must=[
                    FieldCondition(
                        key="metadata.MongoId",
                        match=MatchValue(value=payload.mongo_id)
                    )
                ]
            )
        )

        # Step 2: rerank — score all 15 against query, keep top 3
        reranked_docs = reranker.compress_documents(docs, payload.query)

        # Step 3: build context from top 3 reranked docs
        context = "\n\n".join(
            f"FILE: {doc.metadata.get('source', 'unknown')}\n{doc.page_content}"
            for doc in reranked_docs
        )

        print(payload.history)
        print(len(payload.history))

        formatted_history = "\n".join(
            f"{msg['role'].upper()}: {msg['content']}"
            for msg in payload.history
        )

        
        prompt = f"""
            You are a senior codebase assistant. Answer concisely.

            RULES:
            - Use ONLY the provided repository files
            - Keep answers under 300 words unless the user asks for detail
            - Use short inline code (backticks) only for function/variable names
            - Do NOT paste full code blocks unless the user explicitly asks
            - If nothing relevant exists, say "Not found in repository"
            -If you only have partial code (e.g. a function is cut off), explicitly say 
            "I only have a partial snippet of this — the chunk may be incomplete" 
            instead of silently omitting it

            FILES:
            {context}

            CHAT HISTORY:
            {formatted_history}

            QUESTION:
            {payload.query}
            """

        response = llm.invoke(prompt)

        return {
            "status": "success",
            "query": payload.query,
            "results": response.content
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



@app.post("/delete-repo")
def message(payload: DeleteRepo):
    try:
        client.delete(
            collection_name="github_rag",
            points_selector=Filter(
                must=[
                    FieldCondition(
                        key="metadata.MongoId",
                        match=MatchValue(value=payload.mongo_id)
                    )
                ]
            )
        )

        return {
            "status": "success",
            "results": "Deleted successfully"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))