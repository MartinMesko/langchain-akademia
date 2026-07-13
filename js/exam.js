/* ============================================================
   ZÁVEREČNÝ TEST + ZÁVEREČNÝ PROJEKT + ŤAHÁK
   ============================================================ */

window.EXAM = {
  passScore: 80,   // % na absolvovanie
  badgeScore: 90,  // % na odznak Skúškový majster
  questions: [
    { q: 'Kam patrí OpenAI API kľúč v správne nastavenom projekte?',
      opts: ['Priamo do kódu ako konštanta', 'Do súboru .env načítaného cez load_dotenv()', 'Do názvu virtuálneho prostredia', 'Do komentára v main.py'], correct: 1 },
    { q: 'Aký objekt vráti ChatOpenAI po zavolaní invoke()?',
      opts: ['str', 'AIMessage', 'dict', 'PromptValue'], correct: 1 },
    { q: 'Nastavenie temperature=0 spôsobí, že model…',
      opts: ['odpovedá kreatívnejšie', 'odpovedá deterministicky a vecne', 'odpovedá pomalšie', 'použije menej tokenov'], correct: 1 },
    { q: 'Ako sa označujú premenné v šablónach promptov?',
      opts: ['<premenna>', '{premenna}', '$premenna', '[premenna]'], correct: 1 },
    { q: 'Ktorá správa nastavuje rolu a pravidlá správania modelu?',
      opts: ['HumanMessage', 'AIMessage', 'SystemMessage', 'ToolMessage'], correct: 2 },
    { q: 'Prečo si chatbot „pamätá" konverzáciu?',
      opts: ['Model má trvalú pamäť', 'Pri každom volaní mu posielame celú históriu správ', 'OpenAI ukladá session', 'Pamäť zabezpečuje Python automaticky'], correct: 1 },
    { q: 'Čo vytvorí zápis prompt | model | parser?',
      opts: ['Logický súčet', 'Chain (RunnableSequence) — výstup článku tečie do ďalšieho', 'Paralelné spustenie', 'Chybu syntaxe'], correct: 1 },
    { q: 'Ktorý parser vráti validovaný objekt s typovanými poľami?',
      opts: ['StrOutputParser', 'CommaSeparatedListOutputParser', 'JsonOutputParser', 'PydanticOutputParser'], correct: 3 },
    { q: 'Ktoré tri metódy garantuje rozhranie Runnable?',
      opts: ['run, stop, reset', 'invoke, batch, stream', 'get, set, del', 'load, save, run'], correct: 1 },
    { q: 'Model sa pri tool callingu rozhoduje o použití nástroja podľa…',
      opts: ['poradia v zozname', 'názvu a docstringu nástroja', 'dĺžky kódu funkcie', 'náhody'], correct: 1 },
    { q: 'Aký je hlavný rozdiel medzi chainom a agentom?',
      opts: ['Agent je lacnejší', 'Chain má pevný postup; agent sám rozhoduje o krokoch a nástrojoch', 'Chain nepoužíva LLM', 'Žiadny'], correct: 1 },
    { q: 'Čo MUSÍ obsahovať prompt agenta?',
      opts: ['MessagesPlaceholder("agent_scratchpad")', 'aspoň 3 system správy', 'JSON schému', 'API kľúč'], correct: 0 },
    { q: 'RAG rieši problém…',
      opts: ['pomalého internetu', 'zastaraných znalostí, neznalosti vlastných dát a halucinácií', 'vysokej spotreby RAM', 'zlej syntaxe promptov'], correct: 1 },
    { q: 'Správne poradie indexovacej fázy RAG je…',
      opts: ['split → load → store → embed', 'load → split → embed → store', 'embed → load → split → store', 'store → embed → split → load'], correct: 1 },
    { q: 'Čo robí chunk_overlap pri delení dokumentov?',
      opts: ['Vynecháva časti textu', 'Susedné chunky zdieľajú časť textu, aby sa nerozsekla myšlienka', 'Obmedzuje počet chunkov', 'Zrýchľuje embedovanie'], correct: 1 },
    { q: 'Embedding je…',
      opts: ['komprimovaný súbor', 'vektor čísel zachytávajúci význam textu', 'šifrovaný text', 'zoznam kľúčových slov'], correct: 1 },
    { q: 'Ako otvoríš existujúcu Chroma databázu bez nového indexovania?',
      opts: ['Chroma.from_documents(...) znova', 'Chroma(persist_directory=..., embedding_function=...)', 'Chroma.open()', 'load_chroma()'], correct: 1 },
    { q: 'create_retrieval_chain vracia slovník s kľúčmi…',
      opts: ['output a docs', 'answer a context', 'result a sources', 'text a data'], correct: 1 },
    { q: 'Prečo obyčajný RAG zlyhá na otázke „A môžem si ich preniesť?"',
      opts: ['Otázka je príliš krátka', 'Retriever bez histórie nevie, čo znamená „ich" — nájde zlé chunky', 'Chroma nepodporuje zámená', 'Model otázku odmietne'], correct: 1 },
    { q: 'Čo robí create_history_aware_retriever?',
      opts: ['Ukladá históriu na disk', 'Pred vyhľadávaním preformuluje otázku podľa histórie na samostatnú', 'Maže staré chunky', 'Zrýchľuje databázu'], correct: 1 },
    { q: 'Prečo Streamlit appka potrebuje st.session_state?',
      opts: ['Pre krajší dizajn', 'Skript sa pri každej interakcii spúšťa odznova — obyčajné premenné sa vynulujú', 'Kvôli bezpečnosti', 'Vyžaduje to FastAPI'], correct: 1 },
    { q: 'Výmena ChatOpenAI za lokálnu ChatOllama vyžaduje…',
      opts: ['prepísanie celej aplikácie', 'zmenu jedného riadku — zvyšok kódu funguje vďaka spoločnému rozhraniu', 'iný programovací jazyk', 'platený účet'], correct: 1 },
    { q: 'LangSmith tracing zapneš…',
      opts: ['dekorátorom @langsmith', 'premennými prostredia (LANGCHAIN_TRACING_V2=true + API kľúč)', 'špeciálnym importom', 'len v platenej verzii'], correct: 1 },
    { q: 'add_routes(app, chain, path="/x") automaticky vytvorí endpointy…',
      opts: ['/x/run a /x/test', '/x/invoke, /x/batch, /x/stream a /x/playground', 'len /x', '/x/get a /x/post'], correct: 1 }
  ]
};

/* ============================================================
   ZÁVEREČNÝ PROJEKT — Firemný AI asistent
   ============================================================ */
window.CAPSTONE = {
  title: 'Záverečný projekt: Firemný AI asistent',
  intro: 'Postav od nuly kompletnú aplikáciu, ktorá spája VŠETKO z kurzu: RAG chatbot s pamäťou nad firemnými dokumentmi, webové rozhranie v Streamlite, monitoring cez LangSmith. Presne takéto zadanie dostaneš v praxi — a po tomto projekte ho zvládneš.',
  steps: [
    { title: 'Založ projekt a prostredie',
      desc: 'Vytvor v PyCharme nový projekt <code>firemny_asistent</code> s venv. Nainštaluj: <code>langchain langchain-openai langchain-community langchain-chroma langchain-text-splitters python-dotenv pypdf streamlit</code>. Vytvor <code>.env</code> s OpenAI kľúčom a over načítanie cez <code>load_dotenv()</code>.',
      check: 'Skript vypíše „kľúč načítaný" a žiadny import nepadá.',
      code: `# overenie.py
import os
from dotenv import load_dotenv

load_dotenv()
print("Kľúč načítaný!" if os.getenv("OPENAI_API_KEY") else "Chýba kľúč!")` },
    { title: 'Priprav firemné dokumenty',
      desc: 'Vytvor priečinok <code>dokumenty/</code> a vlož doň 2–3 súbory: napríklad <code>smernica_dovolenky.txt</code>, <code>benefity.txt</code> a ľubovoľné PDF. Pokojne si obsah vymysli — dôležité je, aby obsahoval konkrétne fakty (čísla, lehoty, pravidlá), na ktoré sa budeš pýtať.',
      check: 'Priečinok dokumenty/ obsahuje aspoň 2 súbory s faktickým obsahom.',
      code: `# dokumenty/benefity.txt — príklad obsahu
FIREMNÉ BENEFITY
- Multisport karta: plne hradená firmou
- Home office: max. 3 dni v týždni po dohode s manažérom
- Vzdelávací budget: 500 € ročne na kurzy a knihy
- Sick days: 5 dní ročne bez potvrdenia od lekára` },
    { title: 'Indexovací skript (load → split → embed → store)',
      desc: 'Vytvor <code>indexuj.py</code>: cez <code>DirectoryLoader</code> načítaj všetky súbory, rozsekaj ich <code>RecursiveCharacterTextSplitter</code>-om (začni s chunk_size=600, overlap=100) a ulož do Chroma s <code>persist_directory="./firma_db"</code>. Spusti ho RAZ a over počet chunkov.',
      check: 'Po spustení existuje priečinok ./firma_db a skript vypísal počet zaindexovaných chunkov.',
      code: `# indexuj.py
from dotenv import load_dotenv
from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma

load_dotenv()

loader = DirectoryLoader("dokumenty/", glob="**/*.txt", loader_cls=TextLoader,
                         loader_kwargs={"encoding": "utf-8"})
dokumenty = loader.load()

splitter = RecursiveCharacterTextSplitter(chunk_size=600, chunk_overlap=100)
chunky = splitter.split_documents(dokumenty)

embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
Chroma.from_documents(chunky, embedding=embeddings, persist_directory="./firma_db")
print(f"Zaindexované: {len(chunky)} chunkov z {len(dokumenty)} dokumentov")` },
    { title: 'Over vyhľadávanie',
      desc: 'Než postavíš celý chain, over si retrieval samostatne (profesionálny návyk!): otvor databázu, vytvor retriever s k=3 a polož 3 testovacie otázky. Skontroluj, či nájdené chunky NAOZAJ obsahujú odpovede. Ak nie, uprav chunk_size a preindexuj.',
      check: 'Na každú z 3 testovacích otázok retriever vracia chunk s odpoveďou.',
      code: `# test_retrieval.py
from dotenv import load_dotenv
from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma

load_dotenv()
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
db = Chroma(persist_directory="./firma_db", embedding_function=embeddings)
retriever = db.as_retriever(search_kwargs={"k": 3})

for otazka in ["Koľko sick days mám?", "Koľko dní home office môžem mať?",
               "Aký je vzdelávací budget?"]:
    print("OTÁZKA:", otazka)
    for d in retriever.invoke(otazka):
        print("  •", d.page_content[:70])` },
    { title: 'RAG chain s pamäťou (architektúra z lekcie 19)',
      desc: 'Vytvor <code>chain.py</code> s funkciou <code>vytvor_chain()</code>: history-aware retriever (preformulovací prompt s históriou), QA prompt s pravidlom „odpovedaj IBA z kontextu" + históriou, spojené cez <code>create_retrieval_chain</code>. Vyskúšaj v konzole nadväzujúcu otázku!',
      check: 'Bot správne odpovie na „Koľko sick days mám?" aj nadväzujúce „A potrebujem na ne potvrdenie?".',
      code: `# chain.py
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_chroma import Chroma
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains import create_retrieval_chain, create_history_aware_retriever

def vytvor_chain():
    embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
    db = Chroma(persist_directory="./firma_db", embedding_function=embeddings)
    retriever = db.as_retriever(search_kwargs={"k": 3})
    model = ChatOpenAI(model="gpt-4o-mini", temperature=0)

    preformuluj = ChatPromptTemplate.from_messages([
        MessagesPlaceholder("chat_history"),
        ("human", "{input}"),
        ("human", "Preformuluj otázku na samostatnú. Iba otázku."),
    ])
    ha_retriever = create_history_aware_retriever(model, retriever, preformuluj)

    qa = ChatPromptTemplate.from_messages([
        ("system", "Si firemný HR asistent. Odpovedaj IBA z kontextu. "
                   "Ak odpoveď nie je v kontexte, povedz to.\\n\\n{context}"),
        MessagesPlaceholder("chat_history"),
        ("human", "{input}"),
    ])
    return create_retrieval_chain(ha_retriever,
                                  create_stuff_documents_chain(model, qa))` },
    { title: 'Streamlit rozhranie',
      desc: 'Vytvor <code>app.py</code>: titulok, história v <code>st.session_state</code>, <code>st.chat_input</code> / <code>st.chat_message</code>, volanie chainu z kroku 5 a pod odpoveďou <code>st.caption</code> so zdrojmi z <code>context</code>. Spusti cez <code>streamlit run app.py</code>.',
      check: 'V prehliadači beží chat, odpovedá z tvojich dokumentov a zobrazuje zdroje.',
      code: `# app.py
import streamlit as st
from dotenv import load_dotenv
from langchain_core.messages import HumanMessage, AIMessage
from chain import vytvor_chain

load_dotenv()
st.title("🏢 Firemný AI asistent")

if "historia" not in st.session_state:
    st.session_state.historia = []
if "chain" not in st.session_state:
    st.session_state.chain = vytvor_chain()

for s in st.session_state.historia:
    rola = "user" if isinstance(s, HumanMessage) else "assistant"
    with st.chat_message(rola):
        st.write(s.content)

if otazka := st.chat_input("Spýtaj sa na smernice a benefity…"):
    with st.chat_message("user"):
        st.write(otazka)
    with st.spinner("Hľadám v dokumentoch…"):
        v = st.session_state.chain.invoke(
            {"input": otazka, "chat_history": st.session_state.historia})
    with st.chat_message("assistant"):
        st.write(v["answer"])
        zdroje = {d.metadata["source"] for d in v["context"]}
        st.caption("📎 " + ", ".join(zdroje))
    st.session_state.historia.append(HumanMessage(content=otazka))
    st.session_state.historia.append(AIMessage(content=v["answer"]))` },
    { title: 'Zapni LangSmith monitoring',
      desc: 'Pridaj do <code>.env</code> premenné <code>LANGCHAIN_TRACING_V2=true</code>, <code>LANGCHAIN_API_KEY</code> a <code>LANGCHAIN_PROJECT=firemny-asistent</code>. Polož botovi 3 otázky a na smith.langchain.com si prejdi trace: nájdi preformulovanú otázku, nájdené chunky a finálny prompt.',
      check: 'V projekte firemny-asistent na smith.langchain.com vidíš traces svojich otázok.',
      code: `# .env — pridaj:
LANGCHAIN_TRACING_V2=true
LANGCHAIN_API_KEY=lsv2_pt_...
LANGCHAIN_PROJECT=firemny-asistent

# Žiadna zmena kódu nie je potrebná — load_dotenv() to zariadi.` },
    { title: 'BONUS: Nasaď API cez LangServe',
      desc: 'Vytvor <code>server.py</code>, ktorý chain z kroku 5 vystaví cez <code>add_routes(app, chain, path="/asistent")</code> a spusti uvicorn na porte 8000. Otestuj playground a skús volanie cez <code>RemoteRunnable</code>. Tým je tvoja aplikácia pripravená pre ďalšie systémy.',
      check: 'http://localhost:8000/asistent/playground/ funguje a odpovedá z dokumentov.',
      code: `# server.py
from dotenv import load_dotenv
from fastapi import FastAPI
from langserve import add_routes
import uvicorn
from chain import vytvor_chain

load_dotenv()

app = FastAPI(title="Firemný asistent API")
add_routes(app, vytvor_chain(), path="/asistent")

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)` }
  ]
};

/* ============================================================
   ŤAHÁK — najdôležitejšie snippety kurzu
   ============================================================ */
window.CHEATSHEET = [
  { icon: '🛠️', title: 'Setup projektu', code: `pip install langchain langchain-openai python-dotenv

# .env
OPENAI_API_KEY=sk-proj-...

# main.py
from dotenv import load_dotenv
load_dotenv()` },
  { icon: '🧠', title: 'Chatmodel', code: `from langchain_openai import ChatOpenAI

model = ChatOpenAI(model="gpt-4o-mini",
                   temperature=0)
odpoved = model.invoke("Ahoj!")
print(odpoved.content)

for ch in model.stream("Báseň o mori"):
    print(ch.content, end="")` },
  { icon: '📝', title: 'Prompt + chain (LCEL)', code: `from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

prompt = ChatPromptTemplate.from_messages([
    ("system", "Si expert na {tema}."),
    ("human", "{otazka}"),
])
chain = prompt | model | StrOutputParser()
chain.invoke({"tema": "AI", "otazka": "..."})` },
  { icon: '📦', title: 'Output parsery', code: `from langchain_core.output_parsers import (
    StrOutputParser,            # -> str
    CommaSeparatedListOutputParser,  # -> list
    JsonOutputParser,           # -> dict
    PydanticOutputParser,       # -> objekt
)
# inštrukcie pre model:
parser.get_format_instructions()` },
  { icon: '🧰', title: 'Tools + Agent', code: `from langchain_core.tools import tool
from langchain.agents import (
    create_tool_calling_agent, AgentExecutor)

@tool
def scitaj(a: float, b: float) -> float:
    """Sčíta dve čísla."""
    return a + b

# prompt musí mať:
# MessagesPlaceholder("agent_scratchpad")
agent = create_tool_calling_agent(model, tools, prompt)
ex = AgentExecutor(agent=agent, tools=tools,
                   verbose=True)
ex.invoke({"input": "..."})["output"]` },
  { icon: '📚', title: 'RAG: indexovanie', code: `from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma

docs = TextLoader("subor.txt").load()
chunky = RecursiveCharacterTextSplitter(
    chunk_size=600, chunk_overlap=100
).split_documents(docs)

db = Chroma.from_documents(chunky,
    embedding=OpenAIEmbeddings(model="text-embedding-3-small"),
    persist_directory="./db")` },
  { icon: '🎣', title: 'RAG: dopytovanie', code: `db = Chroma(persist_directory="./db",
            embedding_function=embeddings)
retriever = db.as_retriever(search_kwargs={"k": 3})

from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains import create_retrieval_chain

# prompt obsahuje {context} a {input}
rag = create_retrieval_chain(retriever,
    create_stuff_documents_chain(model, prompt))
v = rag.invoke({"input": "..."})
v["answer"]; v["context"]` },
  { icon: '🧠', title: 'Pamäť chatbota', code: `from langchain_core.prompts import MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage

prompt = ChatPromptTemplate.from_messages([
    ("system", "..."),
    MessagesPlaceholder("chat_history"),
    ("human", "{otazka}"),
])
historia = []
# po každej výmene:
historia.append(HumanMessage(content=otazka))
historia.append(AIMessage(content=odpoved))` },
  { icon: '🚀', title: 'RAG + pamäť (lekcia 19)', code: `from langchain.chains import (
    create_history_aware_retriever)

ha = create_history_aware_retriever(
    model, retriever, preformuluj_prompt)
rag = create_retrieval_chain(ha, qa_chain)

rag.invoke({"input": otazka,
            "chat_history": historia})` },
  { icon: '🖥️', title: 'Streamlit chat', code: `import streamlit as st
# spustenie: streamlit run app.py

if "h" not in st.session_state:
    st.session_state.h = []

if q := st.chat_input("Správa…"):
    with st.chat_message("user"):
        st.write(q)
    with st.chat_message("assistant"):
        st.write(odpoved)` },
  { icon: '💻', title: 'Lokálny model (Ollama)', code: `# terminál:
# ollama pull llama3.2
# pip install langchain-ollama

from langchain_ollama import ChatOllama
model = ChatOllama(model="llama3.2")
# zvyšok kódu BEZ ZMENY` },
  { icon: '🔍', title: 'LangSmith + LangServe', code: `# .env — monitoring:
LANGCHAIN_TRACING_V2=true
LANGCHAIN_API_KEY=lsv2_...
LANGCHAIN_PROJECT=moj-projekt

# server.py — REST API:
from langserve import add_routes
add_routes(app, chain, path="/sluzba")
# endpointy: /invoke /batch /stream
#            /playground` }
];
