# 🚀 GitRAG — Chat With Any GitHub Repository

GitRAG is a full-stack Retrieval-Augmented Generation (RAG) platform that turns any GitHub repository into a queryable knowledge base. It clones the repo, chunks and embeds the code, stores it in a vector database, and lets you ask natural-language questions answered with real code context.

<p align="center">
  <a href="https://git-rag-omega.vercel.app"><b>🌐 Live App</b></a>
</p>
<p align="center">
  <a href="https://git-rag-omega.vercel.app"><b>https://git-rag-omega.vercel.app</b></a> 
</p>

---

## ✨ Features

- 🔎 **Chat with any GitHub repo** — ask questions in plain English, get answers grounded in the actual codebase
- 🧠 **Context-aware retrieval** — semantic search + reranking surfaces the most relevant code before the LLM answers
- 📂 **Automated indexing pipeline** — clone → chunk → embed → store, fully automated
- 🔁 **Re-index on demand** — pull the latest commits and refresh the vector store anytime
- 💬 **Persistent chat history** — pick up conversations where you left off
- 🗑️ **Clean repo deletion** — removes metadata and vector embeddings together, no orphaned data
- 🔐 **Authenticated sessions** — JWT-based auth protects user data and chats

---

## 🏗️ Architecture

```
┌──────────────────┐      ┌───────────────────┐      ┌────────────────────┐
│  React + Vite UI  │ ───▶ │  Node.js Backend   │ ───▶ │  FastAPI RAG Engine │
└──────────────────┘      │  (Express + JWT)   │      │  (LangChain)        │
                           └────────┬───────────┘      └─────────┬──────────┘
                                    │                             │
                                    ▼                             ▼
                             ┌────────────┐              ┌────────────────┐
                             │  MongoDB   │              │  Qdrant Vector │
                             │ (metadata, │              │     Store      │
                             │  chat logs)│              └────────┬───────┘
                             └────────────┘                       │
                                                                   ▼
                                                          ┌──────────────────┐
                                                          │      Gemini      │
                                                          │ + Cohere Rerank  │
                                                          └──────────────────┘
```

**Request flow:**

1. User submits a GitHub repo URL.
2. Node backend persists repo metadata in MongoDB and forwards the request to the FastAPI service.
3. FastAPI clones the repo, chunks the source files, generates embeddings, and stores them in Qdrant.
4. On a user query, the pipeline retrieves the most relevant chunks, reranks them with Cohere, and passes them to Gemini model.
5. The model returns a grounded, context-aware answer back through the chain to the user.

---

## 🧰 Tech Stack

| Layer            | Technologies                                      |
| ---------------- | ------------------------------------------------- |
| **Frontend**     | React (Vite), Tailwind CSS, Axios                 |
| **Backend**      | Node.js, Express.js, MongoDB + Mongoose, JWT Auth |
| **RAG Service**  | FastAPI, LangChain, Python                        |
| **Vector Store** | Qdrant                                            |
| **LLM**          | Gemini                                            |
| **Reranking**    | Cohere                                            |
| **Deployment**   | Vercel (frontend), Render (backend + RAG service) |

---

## 📡 API Reference

### Node.js Backend

| Method | Endpoint              | Description                           |
| ------ | --------------------- | ------------------------------------- |
| `POST` | `/gitrag/create-repo` | Register and index a new repository   |
| `GET`  | `/gitrag/get-repos`   | List indexed repositories             |
| `POST` | `/gitrag/pull-repo`   | Pull latest changes and re-index      |
| `POST` | `/gitrag/delete-repo` | Delete repository and its vector data |
| `POST` | `/gitrag/message`     | Send a chat query against a repo      |

### FastAPI RAG Service

| Method | Endpoint           | Description                                |
| ------ | ------------------ | ------------------------------------------ |
| `POST` | `/initialize-repo` | Clone, chunk, and embed a repository       |
| `POST` | `/pull-repo`       | Refresh embeddings with latest commits     |
| `POST` | `/message`         | Run retrieval + LLM generation for a query |
| `POST` | `/delete-repo`     | Remove vectors and cleanup storage         |

---

## 🔄 RAG Pipeline

```
GitHub Repo
   │
   ▼
Code Chunking (LangChain)
   │
   ▼
Embedding Generation
   │
   ▼
Qdrant Vector Storage
   │
   ▼
User Query ──▶ Similarity Search ──▶ Cohere Reranking
                                          │
                                          ▼
                                     Gemini model
                                          │
                                          ▼
                                    Final Answer
```

---

## 🚀 Deployment

| Service             | Platform | URL                                                          |
| ------------------- | -------- | ------------------------------------------------------------ |
| Frontend            | Vercel   | [git-rag-omega.vercel.app](https://git-rag-omega.vercel.app) |
| Node Backend        | Render   | [gitrag-awh4.onrender.com](https://gitrag-awh4.onrender.com) |
| FastAPI RAG Service | Render   | [gitrag-1.onrender.com](https://gitrag-1.onrender.com)       |

---

## ⚙️ Environment Variables

**Node Backend** (`.env`)

```env
MONGO_URI=
JWT_SECRET=
FASTAPI_URL=https://gitrag-1.onrender.com
```

**FastAPI Service** (`.env`)

```env
COHERE_API_KEY=
GEMINI_API_KEY=
QDRANT_URL=
```

---

## 🛠️ Local Setup

```bash
# Clone the repo
git clone https://github.com/<your-username>/GitRAG.git
cd GitRAG

# Frontend
cd frontend
npm install
npm run dev

# Node backend
cd ../backend
npm install
npm run dev

# FastAPI RAG service
cd ../rag-service
pip install -r requirements.txt
uvicorn main:app --reload
```

---

## ⚠️ Troubleshooting

| Issue                           | Likely Cause                                                        |
| ------------------------------- | ------------------------------------------------------------------- |
| CORS errors                     | Frontend (Vercel) domain not whitelisted on backend                 |
| Backend can't reach RAG service | `FASTAPI_URL` misconfigured or service is asleep (Render free tier) |
| `404` on delete-repo            | Route or HTTP method mismatch between client and server             |
| `500` errors                    | Backend crash, missing payload field, or invalid env variable       |

---

## 📈 Roadmap

- [ ] Role-based access control
- [ ] Repository analytics dashboard
- [ ] Streaming LLM responses
- [ ] Multi-repo chat context
- [ ] Persistent chat memory with LangGraph

---

## 👨‍💻 Author

**Harit Adesara**
Focus: AI/ML systems, Retrieval-Augmented Generation, Web Development

---

<p align="center">⭐ If you find this project useful, consider giving it a star!</p>
