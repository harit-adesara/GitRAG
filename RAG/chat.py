import os
from dotenv import load_dotenv
from typing import Annotated
from typing_extensions import TypedDict
from langchain_core.messages import BaseMessage,SystemMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langgraph.checkpoint.postgres import PostgresSaver
from langgraph.graph.message import RemoveMessage
from psycopg_pool import ConnectionPool
from langsmith import traceable


load_dotenv()


GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

DB_URI=os.getenv("DB_URI")

pool = ConnectionPool(
    conninfo=DB_URI,
    max_size=20,
    kwargs={"autocommit": True, "prepare_threshold": 0},
    open=True,
)

checkpointer = PostgresSaver(pool)
checkpointer.setup()


llm = ChatGoogleGenerativeAI(
    model="gemini-3.1-flash-lite"
)

class State(TypedDict):
    messages: Annotated[list[BaseMessage], add_messages]
    summary: str
    context: str
    input_blocked: bool
    output_blocked: bool

from guadrails.input import input_guardrail
from guadrails.output import output_guardrail
from guadrails.routing import route_after_input

MAX_MESSAGES = 10
SUMMARY_THRESHOLD = 20

traceable(name="Chatbot")
def chatbot(state: State):
    messages = state["messages"]
    summary = state.get("summary", "")
    rag_context = state["context"]

    remove_messages = []

    if len(messages) > SUMMARY_THRESHOLD:

        old_messages = messages[:-MAX_MESSAGES]
        recent_messages = messages[-MAX_MESSAGES:]

        summary_prompt = f"""
Current Summary:
{summary}

Update the summary using the following conversation.

Conversation:
{old_messages}

Return ONLY the updated summary.
"""

        summary = llm.invoke(summary_prompt).content

        remove_messages = [
            RemoveMessage(id=m.id)
            for m in old_messages
        ]

    else:
        recent_messages = messages

    context = []

    if summary:
        context.append(
            SystemMessage(
                content=f"""
    Conversation Summary:

    {summary}
    """
            )
        )

    context.append(
        SystemMessage(
            content=f"""
    Repository Context:

    {rag_context}

    Answer ONLY using this repository context.

    If the answer isn't in the repository,
    say "Not found in repository."
    """
        )
    )

    context.extend(recent_messages)

    response = llm.invoke(context)

    return {
        "messages": remove_messages + [response],
        "summary": summary
    }

builder = StateGraph(State)

builder.add_node("chatbot", chatbot)
builder.add_node("input_checker",input_guardrail)
builder.add_node("output_checker",output_guardrail)

builder.add_edge(START, "input_checker")
builder.add_conditional_edges("input_checker",route_after_input,{
    "continue":"chatbot",
    "blocked":END
})
builder.add_edge("chatbot","output_checker")
builder.add_edge("output_checker",END)


graph = builder.compile(
    checkpointer=checkpointer
)