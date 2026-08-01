/* ============================================================
   EXTRA „NAPÍŠ KÓD" CVIČENIA — časť 5
   Sekcia s7 Produkčný backend a cloud (l38–l44): 9 cvičení
   na lekciu (10. je priamo v lekcii). Slúžia aj ako zdroj
   pre Klikací kód.
   ============================================================ */
(function () {
  const W = (title, task, starter, must, hint, solution) =>
    ({ t: 'write', title, task, starter, must, hint, solution });

  window.EXTRA_WRITE = window.EXTRA_WRITE || {};
  const pridaj = (lid, zoznam) => {
    window.EXTRA_WRITE[lid] = (window.EXTRA_WRITE[lid] || []).concat(zoznam);
  };

  /* ── l38: Azure OpenAI a cloud ── */
  pridaj('l38', [
    W('Prvé volanie cez Azure',
      'Vytvor <code>AzureChatOpenAI</code> s parametrami <code>azure_deployment="firemny-gpt4o"</code>, <code>api_version="2024-10-21"</code> a <code>temperature=0</code>, zavolaj <code>invoke</code> s krátkou otázkou a vypíš <code>.content</code>.',
      `from dotenv import load_dotenv
from langchain_openai import AzureChatOpenAI

load_dotenv()
# tvoj kód...`,
      [['AzureChatOpenAI('], ['azure_deployment='], ['api_version='], ['.invoke('], ['.content']],
      'Endpoint a kľúč si trieda prečíta z prostredia (AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_API_KEY) — v kóde zadávaš len nasadenie a verziu API.',
      `from dotenv import load_dotenv
from langchain_openai import AzureChatOpenAI

load_dotenv()

model = AzureChatOpenAI(
    azure_deployment="firemny-gpt4o",
    api_version="2024-10-21",
    temperature=0,
)
print(model.invoke("Povedz ahoj jednou vetou.").content)`),

    W('Kontrola konfigurácie pred štartom',
      'Napíš funkciu <code>over_azure_konfig()</code>, ktorá cez <code>os.getenv</code> skontroluje, že existujú <code>AZURE_OPENAI_ENDPOINT</code> aj <code>AZURE_OPENAI_API_KEY</code>. Chýbajúce názvy zbieraj do zoznamu <code>chybaju</code>; ak nie je prázdny, vráť hlášku so zoznamom, inak <code>"OK"</code>.',
      `import os

# tvoj kód...`,
      [['def over_azure_konfig'], ['os.getenv('], ['AZURE_OPENAI_ENDPOINT'], ['chybaju'], ['return']],
      'Fail-fast pri štarte: appka má spadnúť so zrozumiteľnou hláškou hneď, nie až pri prvom volaní modelu. Kontroluj if not os.getenv(nazov).',
      `import os

def over_azure_konfig():
    """Fail-fast: chýbajúca konfigurácia sa má prejaviť pri štarte."""
    chybaju = []
    for nazov in ["AZURE_OPENAI_ENDPOINT", "AZURE_OPENAI_API_KEY"]:
        if not os.getenv(nazov):
            chybaju.append(nazov)
    if chybaju:
        return f"Chýba konfigurácia: {chybaju}"
    return "OK"

print(over_azure_konfig())`),

    W('Azure embeddingy',
      'Vytvor <code>AzureOpenAIEmbeddings</code> s <code>azure_deployment="firemne-embeddingy"</code>, zavolaj <code>embed_query</code> na krátky text a vypíš dĺžku vektora cez <code>len()</code>.',
      `from dotenv import load_dotenv
from langchain_openai import AzureOpenAIEmbeddings

load_dotenv()
# tvoj kód...`,
      [['AzureOpenAIEmbeddings('], ['azure_deployment='], ['embed_query('], ['len(']],
      'Aj embeddingy majú na Azure vlastné nasadenie. Rozhranie (embed_query, embed_documents) je rovnaké ako pri OpenAIEmbeddings.',
      `from dotenv import load_dotenv
from langchain_openai import AzureOpenAIEmbeddings

load_dotenv()

emb = AzureOpenAIEmbeddings(azure_deployment="firemne-embeddingy")
vektor = emb.embed_query("Aká je záručná doba?")
print(len(vektor))`),

    W('Ošetri DeploymentNotFound',
      'Napíš funkciu <code>bezpecne_zavolaj(model, otazka)</code>, ktorá volanie obalí do <code>try</code>/<code>except Exception as e</code> a pri chybe vráti hlášku obsahujúcu <code>type(e).__name__</code> a radu „over názov nasadenia v Azure portáli".',
      `# tvoj kód...`,
      [['def bezpecne_zavolaj'], ['try'], ['except Exception as e'], ['__name__'], ['return']],
      'Najčastejšia Azure chyba je zlé meno nasadenia. Chybová hláška má používateľovi rovno poradiť, kde hľadať.',
      `def bezpecne_zavolaj(model, otazka):
    """Zrozumiteľná hláška namiesto surového traceback-u."""
    try:
        return model.invoke(otazka).content
    except Exception as e:
        return (f"Volanie zlyhalo ({type(e).__name__}) — "
                "over názov nasadenia v Azure portáli.")

print(bezpecne_zavolaj(model, "Ahoj!"))`),

    W('Konfigurácia z prostredia',
      'Vytvor slovník <code>KONFIG</code> naplnený z prostredia: <code>provider</code> (<code>LLM_PROVIDER</code>, default <code>"openai"</code>), <code>nasadenie</code> (<code>AZURE_DEPLOYMENT</code>, default <code>"firemny-gpt4o"</code>) a <code>api_verzia</code> (<code>AZURE_API_VERSION</code>, default <code>"2024-10-21"</code>). Vypíš ho.',
      `import os

# tvoj kód...`,
      [['KONFIG'], ['#3:os.getenv('], ['LLM_PROVIDER'], ['print(']],
      '12-factor: všetky hodnoty, ktoré sa líšia medzi prostrediami, čítaj z env s rozumným defaultom pre lokálny vývoj.',
      `import os

KONFIG = {
    "provider": os.getenv("LLM_PROVIDER", "openai"),
    "nasadenie": os.getenv("AZURE_DEPLOYMENT", "firemny-gpt4o"),
    "api_verzia": os.getenv("AZURE_API_VERSION", "2024-10-21"),
}
print(KONFIG)`),

    W('Chain s Azure modelom',
      'Postav LCEL reťaz: <code>ChatPromptTemplate.from_template</code> („Vysvetli jednou vetou: {tema}") | <code>AzureChatOpenAI</code> | <code>StrOutputParser()</code>. Zavolaj <code>invoke</code> a výsledok vypíš — presne ako s ChatOpenAI, len iný model.',
      `from dotenv import load_dotenv
from langchain_openai import AzureChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

load_dotenv()
# tvoj kód...`,
      [['from_template('], ['{tema}'], ['AzureChatOpenAI('], ['StrOutputParser()'], ['.invoke(']],
      'Celý zvyšok LangChainu je rovnaký — reťaz sa skladá pipe operátorom | a o Azure „nevie".',
      `from dotenv import load_dotenv
from langchain_openai import AzureChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

load_dotenv()

chain = (
    ChatPromptTemplate.from_template("Vysvetli jednou vetou: {tema}")
    | AzureChatOpenAI(azure_deployment="firemny-gpt4o",
                      api_version="2024-10-21", temperature=0)
    | StrOutputParser()
)
print(chain.invoke({"tema": "RAG"}))`),

    W('Mapa cloud služieb',
      'Vytvor slovník <code>SLUZBY</code>, kde kľúč je úloha (<code>"serverless kontajner"</code>, <code>"registry"</code>, <code>"tajomstva"</code>) a hodnota je slovník s kľúčmi <code>"azure"</code>, <code>"aws"</code>, <code>"gcp"</code>. Napíš funkciu <code>kde(uloha, cloud)</code>, ktorá vráti názov služby, a otestuj ju.',
      `# tvoj kód...`,
      [['SLUZBY'], ['azure'], ['gcp'], ['def kde'], ['print(']],
      'Napr. serverless kontajner: Container Apps / App Runner / Cloud Run. Funkcia je len SLUZBY[uloha][cloud].',
      `SLUZBY = {
    "serverless kontajner": {"azure": "Container Apps",
                              "aws": "App Runner", "gcp": "Cloud Run"},
    "registry": {"azure": "ACR", "aws": "ECR", "gcp": "Artifact Registry"},
    "tajomstva": {"azure": "Key Vault", "aws": "Secrets Manager",
                   "gcp": "Secret Manager"},
}

def kde(uloha, cloud):
    return SLUZBY[uloha][cloud]

print(kde("serverless kontajner", "gcp"))`),

    W('Maskovanie kľúča vo výpise',
      'Napíš funkciu <code>zamaskuj_kluc(kluc)</code>, ktorá vráti prvé 4 znaky, tri bodky a posledné 2 znaky (výrezy <code>[:4]</code> a <code>[-2:]</code>); pre kľúč kratší než 8 znakov vráť <code>"***"</code>. Otestuj na ukážkovom kľúči.',
      `# tvoj kód...`,
      [['def zamaskuj_kluc'], ['[:4]'], ['[-2:]'], ['len('], ['print(']],
      'Do logov a diagnostiky nikdy celý kľúč — ale prvé znaky pomôžu rozoznať, KTORÝ kľúč je nastavený (dev vs prod).',
      `def zamaskuj_kluc(kluc):
    """Bezpečný výpis: rozoznáš kľúč, ale neunikne."""
    if len(kluc) < 8:
        return "***"
    return kluc[:4] + "..." + kluc[-2:]

print(zamaskuj_kluc("az-9f3k2m1x8q7w"))`),

    W('Prepínač prostredí',
      'Napíš funkciu <code>vyrob_konfig(prostredie)</code>: pre <code>"prod"</code> vráti slovník s <code>"nasadenie": "prod-gpt4o"</code> a <code>"max_tokens": 500</code>, pre čokoľvek iné <code>"nasadenie": "dev-gpt4o-mini"</code> a <code>"max_tokens": 200</code>. Vypíš konfig pre obe prostredia.',
      `# tvoj kód...`,
      [['def vyrob_konfig'], ['prod-gpt4o'], ['dev-gpt4o-mini'], ['max_tokens'], ['#2:print(']],
      'Dev prostredie má lacnejší model a nižšie limity — chyby vo vývoji nemajú stáť peniaze. Kód je rovnaký, líši sa len konfigurácia.',
      `def vyrob_konfig(prostredie):
    """Rovnaký kód, iná konfigurácia — 12-factor v praxi."""
    if prostredie == "prod":
        return {"nasadenie": "prod-gpt4o", "max_tokens": 500}
    return {"nasadenie": "dev-gpt4o-mini", "max_tokens": 200}

print(vyrob_konfig("prod"))
print(vyrob_konfig("dev"))`),
  ]);

  /* ── l39: async ── */
  pridaj('l39', [
    W('Prvá korutina',
      'Napíš <code>async def opytaj(otazka)</code>, ktorá vráti <code>await model.ainvoke(otazka)</code> (jeho <code>.content</code>), a spusti ju cez <code>asyncio.run</code>. Výsledok vypíš.',
      `import asyncio
from langchain_openai import ChatOpenAI

model = ChatOpenAI(model="gpt-4o-mini", temperature=0)
# tvoj kód...`,
      [['async def opytaj'], ['await model.ainvoke('], ['asyncio.run('], ['print(']],
      'Korutinu nespustíš obyčajným zavolaním — opytaj("...") vráti coroutine objekt. Vstupnou bránou je asyncio.run(opytaj("...")).',
      `import asyncio
from langchain_openai import ChatOpenAI

model = ChatOpenAI(model="gpt-4o-mini", temperature=0)

async def opytaj(otazka):
    odpoved = await model.ainvoke(otazka)
    return odpoved.content

vysledok = asyncio.run(opytaj("Čo je embedding?"))
print(vysledok[:60])`),

    W('Dve reťaze naraz',
      'Máš <code>chain_sumar</code> a <code>chain_preklad</code>. Napíš <code>async def spracuj(text)</code>, ktorá obe reťaze spustí súčasne cez <code>await asyncio.gather(...)</code> s <code>ainvoke</code> a vráti dvojicu výsledkov. Spusti a vypíš oba.',
      `import asyncio

# chain_sumar a chain_preklad máš pripravené
# tvoj kód...`,
      [['async def spracuj'], ['#2:.ainvoke('], ['await asyncio.gather('], ['asyncio.run('], ['#2:print(']],
      'gather zoberie korutiny priamo ako argumenty: await asyncio.gather(chain_sumar.ainvoke(...), chain_preklad.ainvoke(...)).',
      `import asyncio

async def spracuj(text):
    sumar, preklad = await asyncio.gather(
        chain_sumar.ainvoke({"text": text}),
        chain_preklad.ainvoke({"text": text}),
    )
    return sumar, preklad

sumar, preklad = asyncio.run(spracuj("LangChain je framework..."))
print(sumar[:50])
print(preklad[:50])`),

    W('Dávka s limitom súbežnosti',
      'Napíš <code>async def spracuj_davku(vstupy)</code>, ktorá zavolá <code>await model.abatch(vstupy, config={"max_concurrency": 5})</code> a vráti zoznam <code>.content</code> odpovedí. Spusti ju na zozname troch otázok a vypíš počet odpovedí.',
      `import asyncio
from langchain_openai import ChatOpenAI

model = ChatOpenAI(model="gpt-4o-mini", temperature=0)
# tvoj kód...`,
      [['async def spracuj_davku'], ['await model.abatch('], ['max_concurrency'], ['asyncio.run('], ['len(']],
      'abatch spracuje celý zoznam, max_concurrency drží počet súčasne letiacich dopytov — ochrana pred rate limitom.',
      `import asyncio
from langchain_openai import ChatOpenAI

model = ChatOpenAI(model="gpt-4o-mini", temperature=0)

async def spracuj_davku(vstupy):
    odpovede = await model.abatch(vstupy, config={"max_concurrency": 5})
    return [o.content for o in odpovede]

otazky = ["Čo je RAG?", "Čo je agent?", "Čo je embedding?"]
vysledky = asyncio.run(spracuj_davku(otazky))
print(len(vysledky))`),

    W('Streamuj po kúskoch',
      'Napíš <code>async def streamuj(tema)</code>, ktorá cez <code>async for kusok in chain.astream(...)</code> vypisuje kúsky cez <code>print(kusok, end="", flush=True)</code>. Spusti cez <code>asyncio.run</code>.',
      `import asyncio

# chain (prompt | model | StrOutputParser) máš pripravený
# tvoj kód...`,
      [['async def streamuj'], ['async for'], ['.astream('], ['end=""', "end=''"], ['asyncio.run(']],
      'astream vracia asynchrónny generátor — preto async for. flush=True vytlačí kúsok okamžite, bez čakania na newline.',
      `import asyncio

async def streamuj(tema):
    async for kusok in chain.astream({"tema": tema}):
        print(kusok, end="", flush=True)
    print()

asyncio.run(streamuj("vektorová databáza"))`),

    W('Zmeraj zrýchlenie',
      'Simuluj tri I/O úlohy cez <code>asyncio.sleep(1)</code>: napíš <code>async def uloha()</code> a <code>async def vsetky()</code>, ktorá ich spustí naraz cez <code>gather</code>. Zmeraj čas cez <code>time.time()</code> a vypíš ho — má byť ~1 s, nie 3 s.',
      `import asyncio
import time

# tvoj kód...`,
      [['async def uloha'], ['await asyncio.sleep(1)'], ['asyncio.gather('], ['time.time()'], ['print(']],
      'asyncio.sleep je async čakanie (simulácia siete) — tri súčasné čakania sa prekryjú. time.sleep by ich naopak sčítal!',
      `import asyncio
import time

async def uloha():
    await asyncio.sleep(1)     # simulácia čakania na API
    return "hotovo"

async def vsetky():
    return await asyncio.gather(uloha(), uloha(), uloha())

start = time.time()
vysledky = asyncio.run(vsetky())
print(f"{len(vysledky)} úlohy za {time.time() - start:.1f} s")`),

    W('Semafor proti preťaženiu',
      'Vytvor <code>sem = asyncio.Semaphore(2)</code> a <code>async def s_limitom(i)</code>, ktorá vnútri <code>async with sem:</code> počká <code>asyncio.sleep(0.1)</code> a vráti <code>i</code>. Spusti 5 úloh cez <code>gather</code> — naraz pobežia max 2. Vypíš výsledky.',
      `import asyncio

# tvoj kód...`,
      [['asyncio.Semaphore(2)'], ['async def s_limitom'], ['async with sem'], ['asyncio.gather('], ['print(']],
      'Semafor je ručná verzia max_concurrency — hodí sa, keď limituješ vlastný kód, nie LangChain metódu.',
      `import asyncio

sem = asyncio.Semaphore(2)

async def s_limitom(i):
    async with sem:                  # dnu naraz max 2 úlohy
        await asyncio.sleep(0.1)
        return i

async def hlavna():
    return await asyncio.gather(*[s_limitom(i) for i in range(5)])

print(asyncio.run(hlavna()))`),

    W('Async endpoint vo FastAPI',
      'Napíš FastAPI endpoint <code>@app.post("/chat")</code> ako <code>async def</code>, ktorý prijme Pydantic model <code>Otazka</code> (pole <code>text: str</code>) a vráti slovník s odpoveďou z <code>await chain.ainvoke(...)</code>.',
      `from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()
# chain máš pripravený
# tvoj kód...`,
      [['class Otazka(BaseModel)'], ['text: str'], ['@app.post("/chat")', "@app.post('/chat')"], ['async def'], ['await chain.ainvoke(']],
      'async def endpoint + await vnútri = server počas čakania na LLM obsluhuje ďalšie požiadavky. Sync def by vlákno blokoval.',
      `from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Otazka(BaseModel):
    text: str

@app.post("/chat")
async def chat(otazka: Otazka):
    odpoved = await chain.ainvoke({"otazka": otazka.text})
    return {"odpoved": odpoved}`),

    W('Fronta úloh s job_id',
      'Simuluj frontu: slovník <code>ULOHY</code>, funkcia <code>zaraď(text)</code> vytvorí id z <code>len(ULOHY) + 1</code>, uloží <code>{"stav": "caka", "text": text}</code> a vráti id; funkcia <code>stav(job_id)</code> vráti stav cez <code>.get</code>. Otestuj oboje.',
      `ULOHY = {}

# tvoj kód...`,
      [['def zaraď', 'def zarad'], ['len(ULOHY)'], ['caka'], ['def stav'], ['.get(']],
      'Presne takto funguje vzor fronta+worker z lekcie: POST vráti job_id hneď, GET /stav sa pýta neskôr. Worker by stav menil na „hotovo".',
      `ULOHY = {}

def zaraď(text):
    """Prijmi úlohu a hneď vráť job_id — spracuje ju worker."""
    job_id = len(ULOHY) + 1
    ULOHY[job_id] = {"stav": "caka", "text": text}
    return job_id

def stav(job_id):
    return ULOHY.get(job_id, {"stav": "neexistuje"})

jid = zaraď("analyzuj 300-stranové PDF")
print(jid, stav(jid))`),

    W('Timeout pre pomalú úlohu',
      'Napíš <code>async def s_timeoutom()</code>, ktorá cez <code>await asyncio.wait_for(pomala(), timeout=1)</code> obmedzí čakanie a v <code>except asyncio.TimeoutError</code> vráti „Vypršal čas". Funkcia <code>pomala()</code> nech spí 5 sekúnd.',
      `import asyncio

# tvoj kód...`,
      [['async def pomala'], ['asyncio.sleep(5)'], ['asyncio.wait_for('], ['timeout=1'], ['TimeoutError']],
      'wait_for zabalí korutinu a po limite vyhodí asyncio.TimeoutError — async obdoba timeout parametra modelu.',
      `import asyncio

async def pomala():
    await asyncio.sleep(5)
    return "dokončené"

async def s_timeoutom():
    try:
        return await asyncio.wait_for(pomala(), timeout=1)
    except asyncio.TimeoutError:
        return "Vypršal čas — úloha zrušená."

print(asyncio.run(s_timeoutom()))`),
  ]);

  /* ── l40: databázy ── */
  pridaj('l40', [
    W('Dokumenty do PGVectora',
      'Vytvor <code>PGVector</code> store (<code>embeddings</code>, <code>collection_name="dokumenty"</code>, <code>connection</code> z <code>os.getenv("DATABASE_URL")</code>), pridaj doň zoznam dokumentov cez <code>add_documents</code> a vypíš potvrdenie.',
      `import os
from langchain_openai import OpenAIEmbeddings
from langchain_postgres import PGVector

emb = OpenAIEmbeddings(model="text-embedding-3-small")
# dokumenty máš pripravené
# tvoj kód...`,
      [['PGVector('], ['collection_name='], ['DATABASE_URL'], ['add_documents('], ['print(']],
      'Rovnaké API ako Chroma — add_documents spočíta embeddingy a uloží ich do Postgresu. Connection string vždy z prostredia.',
      `import os
from langchain_openai import OpenAIEmbeddings
from langchain_postgres import PGVector

emb = OpenAIEmbeddings(model="text-embedding-3-small")

db = PGVector(
    embeddings=emb,
    collection_name="dokumenty",
    connection=os.getenv("DATABASE_URL"),
)
db.add_documents(dokumenty)
print(f"Uložených {len(dokumenty)} dokumentov")`),

    W('História chatu v Postgrese',
      'Napíš funkciu <code>uloz_spravu(spravy, session_id, rola, obsah)</code>, ktorá do zoznamu (simulácia tabuľky) pridá slovník so <code>session_id</code>, <code>rola</code>, <code>obsah</code> a časom cez <code>datetime.now().isoformat()</code>. A funkciu <code>historia(spravy, session_id)</code>, ktorá vráti len správy danej session.',
      `from datetime import datetime

# tvoj kód...`,
      [['def uloz_spravu'], ['.append('], ['isoformat()'], ['def historia'], ['session_id']],
      'História patrí do zdroja pravdy (Postgres), nie do RAM. Filtrovanie: [s for s in spravy if s["session_id"] == session_id].',
      `from datetime import datetime

def uloz_spravu(spravy, session_id, rola, obsah):
    spravy.append({
        "session_id": session_id,
        "rola": rola,
        "obsah": obsah,
        "cas": datetime.now().isoformat(),
    })

def historia(spravy, session_id):
    return [s for s in spravy if s["session_id"] == session_id]

spravy = []
uloz_spravu(spravy, "s1", "human", "Aká je záruka?")
uloz_spravu(spravy, "s2", "human", "Iná session")
print(len(historia(spravy, "s1")))`),

    W('Zapni Redis LLM cache',
      'Pripoj sa na Redis cez <code>redis.Redis(host="localhost", port=6379)</code> a zapni globálnu LLM cache cez <code>set_llm_cache(RedisCache(r))</code>. Do komentára napíš, čo sa stane pri druhom rovnakom prompte.',
      `import redis
from langchain_community.cache import RedisCache
from langchain_core.globals import set_llm_cache

# tvoj kód...`,
      [['redis.Redis('], ['port=6379'], ['set_llm_cache('], ['RedisCache(']],
      'Po zapnutí sa každé invoke najprv pozrie do Redis — identický prompt druhýkrát nejde na API vôbec (0 tokenov, milisekundy).',
      `import redis
from langchain_community.cache import RedisCache
from langchain_core.globals import set_llm_cache

r = redis.Redis(host="localhost", port=6379)
set_llm_cache(RedisCache(r))

# Druhý identický prompt sa vráti z cache: žiadne API volanie,
# žiadne tokeny, odpoveď za milisekundy.
print("LLM cache zapnutá")`),

    W('Rate limit cez INCR',
      'Napíš funkciu <code>povoleny_dopyt(pouzivatel, limit=10)</code>: zvýš čítač <code>r.incr(kluc)</code>, pri prvom volaní nastav <code>r.expire(kluc, 60)</code> a vráť <code>pocet <= limit</code>. Kľúč skladaj ako <code>f"rl:{pouzivatel}"</code>.',
      `import redis

r = redis.Redis(host="localhost", port=6379)
# tvoj kód...`,
      [['def povoleny_dopyt'], ['r.incr('], ['== 1'], ['r.expire('], ['<= limit']],
      'incr je atomický — funguje aj pri 10 kópiách appky. expire pri prvom volaní vytvorí 60-sekundové okno, ktoré sa samo zmaže.',
      `import redis

r = redis.Redis(host="localhost", port=6379)

def povoleny_dopyt(pouzivatel, limit=10):
    kluc = f"rl:{pouzivatel}"
    pocet = r.incr(kluc)
    if pocet == 1:
        r.expire(kluc, 60)
    return pocet <= limit

print(povoleny_dopyt("user-1"))`),

    W('Get-or-compute cache',
      'Napíš funkciu <code>z_cache(kluc, vypocet, ttl=300)</code>: ak <code>r.get(kluc)</code> niečo vráti, dekóduj a vráť to; inak zavolaj <code>vypocet()</code>, ulož cez <code>r.setex(kluc, ttl, vysledok)</code> a vráť ho.',
      `import redis

r = redis.Redis(host="localhost", port=6379)
# tvoj kód...`,
      [['def z_cache'], ['r.get('], ['.decode('], ['vypocet()'], ['r.setex(']],
      'Klasický vzor: skús cache, pri miss vypočítaj a ulož s TTL. setex = set + expire v jednom atomickom kroku.',
      `import redis

r = redis.Redis(host="localhost", port=6379)

def z_cache(kluc, vypocet, ttl=300):
    """Get-or-compute: drahý výpočet max. raz za TTL."""
    ulozene = r.get(kluc)
    if ulozene is not None:
        return ulozene.decode("utf-8")
    vysledok = vypocet()
    r.setex(kluc, ttl, vysledok)
    return vysledok

print(z_cache("sumar:doc1", lambda: "Zhrnutie dokumentu..."))`),

    W('Ktorá databáza na čo',
      'Vytvor slovník <code>VYBER</code> mapujúci úlohu na databázu: história chatov → PostgreSQL, cache a limity → Redis, fulltext s kódmi produktov → Elasticsearch, JSON bez schémy → MongoDB. Funkcia <code>odporuc_db(uloha)</code> vráti odpoveď cez <code>.get</code> s defaultom <code>"PostgreSQL"</code>.',
      `# tvoj kód...`,
      [['VYBER'], ['PostgreSQL'], ['Elasticsearch'], ['def odporuc_db'], ['.get(']],
      'Default PostgreSQL nie je náhoda — keď váhaš, začni Postgresom a špecializované DB pridávaj, až keď na ich problém narazíš.',
      `VYBER = {
    "historia chatov": "PostgreSQL",
    "cache a limity": "Redis",
    "fulltext s kodmi produktov": "Elasticsearch",
    "json bez schemy": "MongoDB",
}

def odporuc_db(uloha):
    return VYBER.get(uloha, "PostgreSQL")

print(odporuc_db("cache a limity"))
print(odporuc_db("nieco nove"))`),

    W('Hybridné skóre',
      'Napíš funkciu <code>hybridne_skore(bm25, vektor, vaha=0.5)</code>, ktorá vráti vážený súčet <code>vaha * bm25 + (1 - vaha) * vektor</code>. Zoradenie dokumentov podľa skóre urob cez <code>sorted(..., key=..., reverse=True)</code> a vypíš najlepší.',
      `DOKUMENTY = [
    {"nazov": "faq.pdf", "bm25": 0.9, "vektor": 0.4},
    {"nazov": "zmluva.pdf", "bm25": 0.3, "vektor": 0.8},
]

# tvoj kód...`,
      [['def hybridne_skore'], ['1 - vaha', '1-vaha'], ['sorted('], ['reverse=True'], ['print(']],
      'Presne toto robí Elasticsearch hybrid search a EnsembleRetriever z lekcie 26 — kombinuje presnosť BM25 s významom embeddingov.',
      `DOKUMENTY = [
    {"nazov": "faq.pdf", "bm25": 0.9, "vektor": 0.4},
    {"nazov": "zmluva.pdf", "bm25": 0.3, "vektor": 0.8},
]

def hybridne_skore(bm25, vektor, vaha=0.5):
    return vaha * bm25 + (1 - vaha) * vektor

zoradene = sorted(DOKUMENTY,
                  key=lambda d: hybridne_skore(d["bm25"], d["vektor"]),
                  reverse=True)
print(zoradene[0]["nazov"])`),

    W('Dokument do MongoDB',
      'Simuluj MongoDB kolekciu zoznamom: funkcia <code>vloz(kolekcia, dokument)</code> doplní dokumentu <code>"_id"</code> (z <code>len(kolekcia) + 1</code>) a pridá ho; funkcia <code>najdi(kolekcia, pole, hodnota)</code> vráti dokumenty, kde sa pole rovná hodnote — dokumenty môžu mať RÔZNE polia, použi <code>.get(pole)</code>.',
      `# tvoj kód...`,
      [['def vloz'], ['_id'], ['.append('], ['def najdi'], ['.get(pole)']],
      'Pointa dokumentovej DB: dokumenty nemusia mať rovnakú štruktúru — preto bezpečné čítanie cez .get, nie hranaté zátvorky.',
      `def vloz(kolekcia, dokument):
    dokument["_id"] = len(kolekcia) + 1
    kolekcia.append(dokument)
    return dokument["_id"]

def najdi(kolekcia, pole, hodnota):
    return [d for d in kolekcia if d.get(pole) == hodnota]

db = []
vloz(db, {"typ": "formular", "meno": "Jana"})
vloz(db, {"typ": "scrap", "url": "example.com"})
print(najdi(db, "typ", "formular"))`),

    W('Zdroj pravdy vs cache',
      'Napíš funkciu <code>kam_ulozit(data)</code>: ak je <code>data["nahraditelne"]</code> True, vráť <code>"Redis"</code>, inak <code>"PostgreSQL"</code>. Otestuj na cache odpovede (nahraditeľná) a histórii chatu (nenahraditeľná).',
      `# tvoj kód...`,
      [['def kam_ulozit'], ['nahraditelne'], ['Redis'], ['PostgreSQL'], ['#2:print(']],
      'Jediná otázka: prežije appka stratu týchto dát? Áno → Redis (rýchlosť). Nie → Postgres (transakcie, záloha).',
      `def kam_ulozit(data):
    """Nahraditeľné dáta do RAM, zdroj pravdy do relačnej DB."""
    if data["nahraditelne"]:
        return "Redis"
    return "PostgreSQL"

print(kam_ulozit({"typ": "cache odpovede", "nahraditelne": True}))
print(kam_ulozit({"typ": "historia chatu", "nahraditelne": False}))`),
  ]);

  /* ── l41: CI/CD ── */
  pridaj('l41', [
    W('Workflow od nuly',
      'Napíš YAML workflow: názov, spúšťanie <code>on: push</code> do vetvy main, jeden job <code>testy</code> s krokmi <code>uses: actions/checkout@v4</code>, inštalácia závislostí a <code>pytest</code>.',
      `# .github/workflows/ci.yml
# tvoj kód...`,
      [['on:'], ['branches: [main]'], ['runs-on: ubuntu-latest'], ['uses: actions/checkout@v4'], ['pytest']],
      'Minimálna kostra: name, on (udalosť), jobs → testy → runs-on + steps. Checkout musí byť prvý krok — bez neho je stroj prázdny.',
      `name: CI

on:
  push:
    branches: [main]

jobs:
  testy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: "3.12" }
      - run: pip install -r requirements.txt
      - run: pytest tests/ -q`),

    W('Test pre CI',
      'Napíš pytest test <code>test_bezpecnostne_skore()</code>, ktorý overí funkciu <code>bezpecnostne_skore</code>: pre <code>[True, True]</code> má vrátiť 100 a pre <code>[True, False]</code> hodnotu 50. Použi <code>assert</code> s <code>==</code>.',
      `def bezpecnostne_skore(vysledky):
    return sum(vysledky) / len(vysledky) * 100

# tvoj kód...`,
      [['def test_bezpecnostne_skore'], ['#2:assert'], ['== 100'], ['== 50']],
      'Pytest nájde funkcie začínajúce test_ a spustí ich. Assert s porovnaním je celý test — žiadna registrácia netreba.',
      `def bezpecnostne_skore(vysledky):
    return sum(vysledky) / len(vysledky) * 100

def test_bezpecnostne_skore():
    assert bezpecnostne_skore([True, True]) == 100
    assert bezpecnostne_skore([True, False]) == 50

print("Testy pripravené pre pytest")`),

    W('Tag podľa commitu',
      'Napíš funkciu <code>tag_image(nazov, sha)</code>, ktorá vráti f-string <code>"{nazov}:{sha[:7]}"</code> (skrátený hash), a funkciu <code>rollback_prikaz(nazov, stary_sha)</code>, ktorá vráti deploy príkaz pre predchádzajúci tag. Obe otestuj.',
      `# tvoj kód...`,
      [['def tag_image'], ['sha[:7]'], ['def rollback_prikaz'], ['#2:print(']],
      'Tag z commitu = dohľadateľnosť (ktorý kód beží) + rollback = nasadenie starého tagu jedným príkazom.',
      `def tag_image(nazov, sha):
    """Tag podľa commitu — vždy vieš, čo beží v produkcii."""
    return f"{nazov}:{sha[:7]}"

def rollback_prikaz(nazov, stary_sha):
    return f"deploy {tag_image(nazov, stary_sha)}"

print(tag_image("moja-appka", "e4f2a91bc3d874650912"))
print(rollback_prikaz("moja-appka", "b1c9d3e7f2a4865examp"))`),

    W('Porovnanie so baseline',
      'Napíš funkciu <code>je_regresia(nove_skore, baseline, tolerancia=2)</code>, ktorá vráti <code>True</code>, ak nové skóre kleslo o viac než toleranciu (<code>baseline - nove_skore > tolerancia</code>). Pri regresii vypíš varovanie a <code>sys.exit(1)</code>.',
      `import sys

# tvoj kód...`,
      [['def je_regresia'], ['baseline - nove_skore'], ['tolerancia'], ['sys.exit(1)']],
      'Eval gate v praxi neporovnáva so 100 %, ale s posledným známym dobrým skóre — malé kolísanie toleruje, prepad zastaví.',
      `import sys

def je_regresia(nove_skore, baseline, tolerancia=2):
    """Prepad oproti baseline nad toleranciu = stop pipeline."""
    return baseline - nove_skore > tolerancia

nove, baseline = 91, 96
print(f"Nové: {nove} %, baseline: {baseline} %")
if je_regresia(nove, baseline):
    print("⛔ Regresia kvality — build zastavený.")
    sys.exit(1)`),

    W('Maskovanie tajomstiev v logu',
      'Napíš funkciu <code>bezpecny_log(sprava, tajomstva)</code>, ktorá v správe nahradí každé tajomstvo zo zoznamu reťazcom <code>"***"</code> (cyklom cez <code>.replace</code>) a vráti výsledok. Otestuj na správe s kľúčom.',
      `# tvoj kód...`,
      [['def bezpecny_log'], ['for '], ['.replace('], ['***'], ['return']],
      'GitHub Actions maskuje secrets automaticky, ale vlastné logy si musíš ochrániť sám — napríklad pri výpise konfigurácie.',
      `def bezpecny_log(sprava, tajomstva):
    """Tajomstvá sa do logov nesmú dostať ani omylom."""
    for t in tajomstva:
        sprava = sprava.replace(t, "***")
    return sprava

print(bezpecny_log("Pripájam sa s kľúčom sk-abc123",
                   ["sk-abc123"]))`),

    W('GitLab verzia pipeline',
      'Napíš <code>.gitlab-ci.yml</code>: definuj <code>stages</code> (test, deploy), job <code>testy</code> so <code>stage: test</code> a <code>script</code> s pytestom, job <code>nasadenie</code> so <code>stage: deploy</code>.',
      `# .gitlab-ci.yml
# tvoj kód...`,
      [['stages:'], ['stage: test'], ['script:'], ['pytest'], ['stage: deploy']],
      'GitLab radí joby do stages — poradie stages určuje poradie behu (obdoba needs). Kroky sú v script: zozname.',
      `stages:
  - test
  - deploy

testy:
  stage: test
  script:
    - pip install -r requirements.txt
    - pytest tests/ -q

nasadenie:
  stage: deploy
  script:
    - ./deploy.sh`),

    W('Smoke test po nasadení',
      'Napíš funkciu <code>smoke_test(url)</code>, ktorá cez <code>requests.get(url, timeout=5)</code> zavolá <code>/health</code> endpoint a vráti <code>True</code>, len ak je <code>status_code == 200</code>. Pri neúspechu vypíš „Rollback!" a <code>sys.exit(1)</code>.',
      `import sys
import requests

# tvoj kód...`,
      [['def smoke_test'], ['requests.get('], ['timeout=5'], ['status_code == 200'], ['sys.exit(1)']],
      'Posledný krok pipeline: over, že nová verzia ŽIJE. Ak health check neprejde, deploy sa vyhlási za neúspešný a nasadí sa starý tag.',
      `import sys
import requests

def smoke_test(url):
    """Nasadenie je hotové, až keď nová verzia odpovedá."""
    try:
        odpoved = requests.get(url, timeout=5)
        return odpoved.status_code == 200
    except Exception:
        return False

if not smoke_test("https://appka.firma.sk/health"):
    print("⛔ Smoke test zlyhal — Rollback!")
    sys.exit(1)
print("✅ Nová verzia beží.")`),

    W('Nočný eval (schedule)',
      'Napíš workflow, ktorý beží každý deň o 3:00 cez <code>schedule</code> s <code>cron: "0 3 * * *"</code> a spúšťa <code>python security_eval.py</code> s kľúčom zo <code>secrets</code>.',
      `# .github/workflows/nocny-eval.yml
# tvoj kód...`,
      [['schedule:'], ['cron:'], ['0 3 * * *'], ['security_eval.py'], ['secrets.']],
      'Nočné behy chytia drift: API modelu sa mení aj bez tvojho zásahu, takže eval nemá bežať len pri pushi.',
      `name: Nočný bezpečnostný eval

on:
  schedule:
    - cron: "0 3 * * *"

jobs:
  eval:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: "3.12" }
      - run: pip install -r requirements.txt
      - run: python security_eval.py
        env:
          OPENAI_API_KEY: \${{ secrets.OPENAI_API_KEY }}`),

    W('Manuálne schválenie produkcie',
      'Napíš job <code>produkcia</code>, ktorý má <code>needs: staging</code>, beží v prostredí <code>environment: production</code> (ak má prostredie v Settings → Environments zapnuté <em>Required reviewers</em>, pipeline sa zastaví a počká na schválenie) a spúšťa deploy skript.',
      `# pokračovanie deploy.yml
# tvoj kód...`,
      [['produkcia:'], ['needs: staging'], ['environment: production'], ['run:']],
      'environment: production + required reviewers v nastaveniach repa = pipeline sa zastaví a čaká na ľudský klik. Automatizuj všetko, schvaľuj to dôležité.',
      `  produkcia:
    needs: staging
    runs-on: ubuntu-latest
    environment: production      # brána: vyžaduje Required reviewers v Settings → Environments
    steps:
      - uses: actions/checkout@v4
      - run: ./deploy.sh production`),
  ]);

  /* ── l42: architektúra a resilience ── */
  pridaj('l42', [
    W('Retry s backoffom a jitterom',
      'Napíš funkciu <code>s_opakovanim(funkcia, max_pokusov=3)</code>: v cykle skús <code>funkcia()</code>, pri výnimke na poslednom pokuse <code>raise</code>, inak čakaj <code>2 ** pokus + random.random()</code> sekúnd cez <code>time.sleep</code>.',
      `import time
import random

# tvoj kód...`,
      [['def s_opakovanim'], ['for pokus in range('], ['raise'], ['2 ** pokus'], ['random.random()']],
      'Exponenciálny backoff (2, 4, 8 s) dá preťaženému API vydýchnuť; jitter zabráni, aby všetky servery udreli znova naraz.',
      `import time
import random

def s_opakovanim(funkcia, max_pokusov=3):
    """Retry s exponenciálnym backoffom a jitterom."""
    for pokus in range(1, max_pokusov + 1):
        try:
            return funkcia()
        except Exception:
            if pokus == max_pokusov:
                raise
            cakanie = 2 ** pokus + random.random()
            time.sleep(cakanie)

print(s_opakovanim(lambda: "úspech"))`),

    W('Jednoduchý circuit breaker',
      'Vytvor slovník <code>BREAKER = {"zlyhania": 0, "otvoreny": False}</code> a funkcie: <code>zaznamenaj_zlyhanie()</code> zvýši čítač a pri 5+ nastaví <code>otvoreny = True</code>; <code>smie_volat()</code> vráti opak <code>otvoreny</code>; <code>reset()</code> vynuluje. Otestuj: po 5 zlyhaniach má smie_volat vrátiť False.',
      `BREAKER = {"zlyhania": 0, "otvoreny": False}

# tvoj kód...`,
      [['def zaznamenaj_zlyhanie'], ['>= 5'], ['def smie_volat'], ['not BREAKER'], ['def reset']],
      'Poistka: po sérii zlyhaní prestaň volať chorú službu úplne — každé ďalšie retry by len plytvalo časom a preťažovalo ju.',
      `BREAKER = {"zlyhania": 0, "otvoreny": False}

def zaznamenaj_zlyhanie():
    BREAKER["zlyhania"] += 1
    if BREAKER["zlyhania"] >= 5:
        BREAKER["otvoreny"] = True

def smie_volat():
    return not BREAKER["otvoreny"]

def reset():
    BREAKER["zlyhania"] = 0
    BREAKER["otvoreny"] = False

for _ in range(5):
    zaznamenaj_zlyhanie()
print(smie_volat())`),

    W('Idempotentné spracovanie',
      'Napíš funkciu <code>spracuj(kluc, akcia, spracovane)</code>: ak je <code>kluc</code> už v množine <code>spracovane</code>, vráť „už spracované" bez vykonania; inak vykonaj <code>akcia()</code>, pridaj kľúč do množiny a vráť výsledok. Otestuj dvojitým volaním s rovnakým kľúčom.',
      `# tvoj kód...`,
      [['def spracuj'], ['in spracovane'], ['akcia()'], ['.add('], ['#2:print(']],
      'Klient po timeoute pošle požiadavku znova — Idempotency-Key zaručí, že platbu nevykonáš dvakrát. Množina si pamätá, čo už prebehlo.',
      `def spracuj(kluc, akcia, spracovane):
    """Rovnaký Idempotency-Key = akcia prebehne len raz."""
    if kluc in spracovane:
        return "už spracované"
    vysledok = akcia()
    spracovane.add(kluc)
    return vysledok

spracovane = set()
print(spracuj("obj-123", lambda: "platba vykonaná", spracovane))
print(spracuj("obj-123", lambda: "platba vykonaná", spracovane))`),

    W('SSE streaming endpoint',
      'Napíš FastAPI endpoint <code>@app.post("/v1/chat")</code> s async generátorom <code>generuj()</code>, ktorý cez <code>async for</code> číta <code>chain.astream(...)</code> a yielduje kúsky vo formáte <code>f"data: {kusok}\\n\\n"</code>. Vráť <code>StreamingResponse</code> s <code>media_type="text/event-stream"</code>.',
      `from fastapi import FastAPI
from fastapi.responses import StreamingResponse

app = FastAPI()
# chain máš pripravený
# tvoj kód...`,
      [['@app.post("/v1/chat")', "@app.post('/v1/chat')"], ['async def'], ['.astream('], ['yield'], ['StreamingResponse(']],
      'SSE formát: každá udalosť je riadok „data: …" a prázdny riadok. Prehliadač ich číta cez EventSource — žiadne WebSockety netreba.',
      `from fastapi import FastAPI
from fastapi.responses import StreamingResponse

app = FastAPI()

@app.post("/v1/chat")
async def chat(otazka: dict):
    async def generuj():
        async for kusok in chain.astream({"otazka": otazka["text"]}):
            yield f"data: {kusok}\\n\\n"

    return StreamingResponse(generuj(), media_type="text/event-stream")`),

    W('Odpoveď 429 s Retry-After',
      'Napíš funkciu <code>obsluz(pouzivatel)</code>: ak <code>povoleny_dopyt(pouzivatel)</code> vráti False, vyhoď <code>HTTPException(status_code=429, headers={"Retry-After": "60"})</code>; inak vráť odpoveď reťaze.',
      `from fastapi import HTTPException

# povoleny_dopyt a chain máš pripravené
# tvoj kód...`,
      [['def obsluz'], ['povoleny_dopyt('], ['HTTPException('], ['429'], ['Retry-After']],
      '429 + Retry-After je zmluva s klientom: „spomaľ a skús o minútu". Slušný klient sa podľa hlavičky zariadi — a ty máš pokoj.',
      `from fastapi import HTTPException

def obsluz(pouzivatel, otazka):
    if not povoleny_dopyt(pouzivatel):
        raise HTTPException(
            status_code=429,
            detail="Príliš veľa dopytov.",
            headers={"Retry-After": "60"},
        )
    return chain.invoke({"otazka": otazka})

print("Endpoint s rate limitom pripravený")`),

    W('Latencia p95',
      'Napíš funkciu <code>p95(latencie)</code>: zoraď hodnoty cez <code>sorted</code>, vypočítaj index <code>int(len(...) * 0.95)</code> (ohranič cez <code>min</code> na posledný index) a vráť hodnotu. Otestuj na zozname s jednou extrémnou hodnotou.',
      `# tvoj kód...`,
      [['def p95'], ['sorted('], ['0.95'], ['min('], ['print(']],
      'Priemer klame — jedna 20-sekundová odpoveď sa v ňom stratí. p95 hovorí: „95 % používateľov čakalo NAJVIAC toľkoto".',
      `def p95(latencie):
    """95. percentil — metrika, na ktorú sa nastavujú alerty."""
    zoradene = sorted(latencie)
    idx = min(int(len(zoradene) * 0.95), len(zoradene) - 1)
    return zoradene[idx]

merania = [0.8, 0.9, 1.1, 1.2, 0.7, 1.0, 0.9, 1.3, 0.8, 21.0]
print(f"p95: {p95(merania)} s")`),

    W('Health a readiness',
      'Napíš dva FastAPI endpointy: <code>@app.get("/health")</code> vráti <code>{"status": "ok"}</code> (proces žije) a <code>@app.get("/ready")</code> skontroluje závislosti cez funkciu <code>db_dostupna()</code> — ak vráti False, vyhoď <code>HTTPException(status_code=503)</code>.',
      `from fastapi import FastAPI, HTTPException

app = FastAPI()
# db_dostupna() máš pripravenú
# tvoj kód...`,
      [['@app.get("/health")', "@app.get('/health')"], ['@app.get("/ready")', "@app.get('/ready')"], ['db_dostupna()'], ['503']],
      'Health = „proces beží", readiness = „smiem dostávať premávku" (DB a závislosti fungujú). Orchestrátory ich používajú rôzne — preto dva endpointy.',
      `from fastapi import FastAPI, HTTPException

app = FastAPI()

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/ready")
def ready():
    if not db_dostupna():
        raise HTTPException(status_code=503, detail="DB nedostupná")
    return {"status": "ready"}`),

    W('Štruktúrovaný log požiadavky',
      'Napíš funkciu <code>zaloguj_poziadavku(dopyt_id, latencia_s, model, cena)</code>, ktorá vypíše JEDEN riadok JSON cez <code>json.dumps</code> so všetkými štyrmi poľami plus <code>"cas"</code> z <code>datetime.now().isoformat()</code>.',
      `import json
from datetime import datetime

# tvoj kód...`,
      [['def zaloguj_poziadavku'], ['json.dumps('], ['latencia_s'], ['isoformat()'], ['print(']],
      'Štruktúrované logy (JSON riadky) vie monitoring parsovať a agregovať — z „textu pre ľudí" sa stanú metriky a alerty.',
      `import json
from datetime import datetime

def zaloguj_poziadavku(dopyt_id, latencia_s, model, cena):
    zaznam = {
        "id": dopyt_id,
        "latencia_s": round(latencia_s, 3),
        "model": model,
        "cena_usd": round(cena, 5),
        "cas": datetime.now().isoformat(),
    }
    print(json.dumps(zaznam, ensure_ascii=False))

zaloguj_poziadavku("d-42", 1.234, "gpt-4o-mini", 0.00021)`),

    W('Graceful degradation reťaz',
      'Napíš funkciu <code>odpovedz_odolne(otazka)</code> s tromi úrovňami: 1) skús <code>hlavny.invoke</code>, 2) pri výnimke skús <code>zalozny.invoke</code>, 3) ak zlyhá aj ten, vráť statickú hlášku „Služba je preťažená, skúste o chvíľu." — appka NIKDY nevráti traceback.',
      `# hlavny a zalozny model máš pripravené
# tvoj kód...`,
      [['def odpovedz_odolne'], ['#2:try'], ['hlavny.invoke('], ['zalozny.invoke('], ['#2:except']],
      'Vnorené try/except: každá vrstva chytí zlyhanie tej predchádzajúcej. Posledná záchrana je statický text — horšie už to nebude.',
      `def odpovedz_odolne(otazka):
    """Tri úrovne: hlavný model → záložný → statická hláška."""
    try:
        return hlavny.invoke(otazka).content
    except Exception:
        try:
            return zalozny.invoke(otazka).content + " (záložný model)"
        except Exception:
            return "Služba je preťažená, skúste o chvíľu."

print(odpovedz_odolne("Čo je RAG?"))`),
  ]);

  /* ── l43: LlamaIndex ── */
  pridaj('l43', [
    W('RAG na päť riadkov',
      'Postav celý LlamaIndex RAG: <code>SimpleDirectoryReader("data").load_data()</code> → <code>VectorStoreIndex.from_documents</code> → <code>as_query_engine()</code> → <code>engine.query</code> a odpoveď vypíš.',
      `from dotenv import load_dotenv
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader

load_dotenv()
# tvoj kód...`,
      [['SimpleDirectoryReader('], ['load_data()'], ['VectorStoreIndex.from_documents('], ['as_query_engine('], ['.query(']],
      'Tri riadky robia to, čo v LangChaine loader + splitter + embeddings + store + retriever + chain. Defaulty sú rozumné.',
      `from dotenv import load_dotenv
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader

load_dotenv()

dokumenty = SimpleDirectoryReader("data").load_data()
index = VectorStoreIndex.from_documents(dokumenty)
engine = index.as_query_engine()

print(engine.query("Aká je záručná doba?"))`),

    W('Zdroje odpovede',
      'Zavolaj <code>engine.query</code>, ulož odpoveď a vypíš: text odpovede a potom cyklom pre každý uzol z <code>odpoved.source_nodes</code> jeho <code>metadata["file_name"]</code> a skóre <code>node.score</code> zaokrúhlené na 2 miesta.',
      `# engine máš pripravený
# tvoj kód...`,
      [['.query('], ['source_nodes'], ['file_name'], ['round('], ['for ']],
      'source_nodes sú chunky, z ktorých odpoveď vznikla — citácie máš zadarmo, aj s podobnostným skóre.',
      `odpoved = engine.query("Aká je záručná doba?")
print(odpoved)

for node in odpoved.source_nodes:
    print(f"- {node.metadata['file_name']} (skóre {round(node.score, 2)})")`),

    W('Top-k a režim odpovede',
      'Vytvor query engine s <code>similarity_top_k=6</code> a <code>response_mode="compact"</code>, polož otázku a vypíš odpoveď. Do komentára napíš, čo top_k ovplyvňuje.',
      `# index máš pripravený
# tvoj kód...`,
      [['as_query_engine('], ['similarity_top_k=6'], ['response_mode='], ['.query(']],
      'similarity_top_k = „k" z LangChainu (koľko chunkov). response_mode riadi syntézu — compact zlepí chunky do menšieho počtu LLM volaní.',
      `# similarity_top_k určuje, koľko chunkov sa načíta do kontextu
engine = index.as_query_engine(
    similarity_top_k=6,
    response_mode="compact",
)

print(engine.query("Ako si uplatním reklamáciu?"))`),

    W('LlamaIndex ako retriever',
      'Vytvor z indexu čistý retriever cez <code>index.as_retriever(similarity_top_k=4)</code>, zavolaj <code>retrieve("otázka")</code> a vypíš počet uzlov a text prvého cez <code>.text[:60]</code>.',
      `# index máš pripravený
# tvoj kód...`,
      [['as_retriever('], ['similarity_top_k=4'], ['.retrieve('], ['len('], ['.text']],
      'as_retriever vracia len uzly bez syntézy odpovede — presne to, čo potrebuješ, keď generovanie rieši iný framework (LangChain).',
      `retriever = index.as_retriever(similarity_top_k=4)

uzly = retriever.retrieve("Aká je záručná doba?")
print(f"Nájdených {len(uzly)} uzlov")
print(uzly[0].text[:60])`),

    W('LlamaIndex nástroj pre LangChain agenta',
      'Zabaľ LlamaIndex engine do LangChain nástroja: <code>@tool</code> funkcia <code>hladaj_v_dokumentoch(otazka: str)</code> s docstringom, ktorá vráti <code>str(engine.query(otazka))</code>. Vypíš <code>.name</code> nástroja.',
      `from langchain_core.tools import tool

# engine máš pripravený
# tvoj kód...`,
      [['@tool'], ['def hladaj_v_dokumentoch'], ['"""'], ['engine.query('], ['.name']],
      'Toto je tá kombinácia z lekcie: orchestráciu robí LangChain/LangGraph agent, dátovú vrstvu LlamaIndex. Nástroj je obyčajná funkcia.',
      `from langchain_core.tools import tool

@tool
def hladaj_v_dokumentoch(otazka: str) -> str:
    """Vyhľadá odpoveď vo firemných dokumentoch."""
    return str(engine.query(otazka))

print(hladaj_v_dokumentoch.name)`),

    W('Vlastné delenie na chunky',
      'Nastav vlastný splitter: <code>SentenceSplitter(chunk_size=512, chunk_overlap=50)</code>, priraď ho do <code>Settings.node_parser</code> a potom postav index — od tej chvíle platí pre všetky dokumenty.',
      `from llama_index.core import VectorStoreIndex, Settings
from llama_index.core.node_parser import SentenceSplitter

# dokumenty máš pripravené
# tvoj kód...`,
      [['SentenceSplitter('], ['chunk_size=512'], ['chunk_overlap=50'], ['Settings.node_parser'], ['from_documents(']],
      'Settings je globálna konfigurácia LlamaIndexu (obdoba defaultov). chunk_size/overlap poznáš z lekcie 13 — princíp je rovnaký.',
      `from llama_index.core import VectorStoreIndex, Settings
from llama_index.core.node_parser import SentenceSplitter

Settings.node_parser = SentenceSplitter(chunk_size=512, chunk_overlap=50)

index = VectorStoreIndex.from_documents(dokumenty)
print("Index s vlastným delením hotový")`),

    W('Porovnávacia tabuľka frameworkov',
      'Vytvor slovník <code>POROVNANIE</code> s kľúčmi <code>"orchestracia"</code>, <code>"agenti"</code>, <code>"cisty_rag"</code>, <code>"datove_indexy"</code>, kde hodnota je <code>"LangChain"</code> alebo <code>"LlamaIndex"</code>. Funkcia <code>kto_vyhrava(oblast)</code> vráti hodnotu cez <code>.get</code> s defaultom <code>"oba"</code>. Otestuj dvakrát.',
      `# tvoj kód...`,
      [['POROVNANIE'], ['orchestracia'], ['cisty_rag'], ['def kto_vyhrava'], ['.get(']],
      'Orchestrácia a agenti = LangChain; čistý RAG a dátové indexy = LlamaIndex. Presne táto mapa je odpoveď na pohovorovú otázku.',
      `POROVNANIE = {
    "orchestracia": "LangChain",
    "agenti": "LangChain",
    "cisty_rag": "LlamaIndex",
    "datove_indexy": "LlamaIndex",
}

def kto_vyhrava(oblast):
    return POROVNANIE.get(oblast, "oba")

print(kto_vyhrava("agenti"))
print(kto_vyhrava("cisty_rag"))`),

    W('Perzistencia indexu',
      'Ulož index na disk cez <code>index.storage_context.persist(persist_dir="./ulozisko")</code> a do komentára napíš, prečo sa index neoplatí stavať pri každom štarte (embeddingy stoja peniaze).',
      `# index máš pripravený
# tvoj kód...`,
      [['storage_context'], ['persist('], ['persist_dir=']],
      'from_documents počíta embeddingy VŽDY nanovo — pri každom štarte by si platil za tie isté vektory. Persist ich uloží, load_index_from_storage načíta.',
      `# Bez uloženia by sa embeddingy počítali pri každom štarte —
# rovnaké vektory, nové peniaze. Preto index perzistuj:
index.storage_context.persist(persist_dir="./ulozisko")
print("Index uložený do ./ulozisko")`),

    W('Rozhodovací strom pre framework',
      'Napíš funkciu <code>rozhodni(ma_agentov, je_cisty_rag, tim_pouziva)</code>: ak <code>tim_pouziva</code> nie je None, vráť ho (konzistencia tímu!); ak <code>ma_agentov</code>, vráť „LangChain + LangGraph"; ak <code>je_cisty_rag</code>, vráť „LlamaIndex"; inak „LangChain". Otestuj aspoň dvakrát.',
      `# tvoj kód...`,
      [['def rozhodni'], ['is not None'], ['LangChain + LangGraph'], ['LlamaIndex'], ['#2:print(']],
      'Poradie podmienok je posolstvo: existujúci stack tímu bije osobné preferencie — to je seniorský rozmer rozhodnutia.',
      `def rozhodni(ma_agentov, je_cisty_rag, tim_pouziva=None):
    """Konzistencia tímu > typ úlohy > default."""
    if tim_pouziva is not None:
        return tim_pouziva
    if ma_agentov:
        return "LangChain + LangGraph"
    if je_cisty_rag:
        return "LlamaIndex"
    return "LangChain"

print(rozhodni(True, False))
print(rozhodni(False, True, tim_pouziva="LangChain"))`),
  ]);

  /* ── l44: líderstvo ── */
  pridaj('l44', [
    W('ADR ako dáta',
      'Vytvor slovník <code>ADR</code> s kľúčmi <code>"nazov"</code>, <code>"stav"</code>, <code>"kontext"</code>, <code>"moznosti"</code> (zoznam), <code>"rozhodnutie"</code>, <code>"minusy"</code> (zoznam!). Funkcia <code>je_uplny(adr)</code> vráti True, len ak sú vyplnené všetky polia A zoznam mínusov nie je prázdny.',
      `# tvoj kód...`,
      [['ADR'], ['minusy'], ['def je_uplny'], ['all('], ['print(']],
      'ADR bez mínusov je marketing — preto ich kontrola. all() overí, že žiadne pole nie je prázdne.',
      `ADR = {
    "nazov": "ADR-001: pgvector ako vektorový store",
    "stav": "prijaté",
    "kontext": "50k dokumentov, tím bez DevOps, Postgres už beží",
    "moznosti": ["pgvector", "Pinecone", "Chroma"],
    "rozhodnutie": "pgvector",
    "minusy": ["migrácia pri >10M vektorov"],
}

def je_uplny(adr):
    """ADR bez priznaných mínusov je len názor."""
    return all(adr.values()) and len(adr["minusy"]) > 0

print(je_uplny(ADR))`),

    W('Preklad do jazyka dôsledkov',
      'Vytvor slovník <code>PREKLADY</code> s aspoň tromi technickými vecami (napr. <code>"redis_cache"</code>, <code>"eval_pipeline"</code>, <code>"rate_limit"</code>) a ich biznis dôsledkami. Funkcia <code>pre_biznis(vec)</code> vráti preklad cez <code>.get</code> s defaultnou vetou. Otestuj známou aj neznámou vecou.',
      `# tvoj kód...`,
      [['PREKLADY'], ['redis_cache'], ['def pre_biznis'], ['.get('], ['#2:print(']],
      'Vzorec prekladu: technická vec → dopad v peniazoch, čase alebo riziku. „Ušetríme 30 %" počuje každý; „in-memory store" nikto.',
      `PREKLADY = {
    "redis_cache": "Opakované otázky budú zadarmo — ušetríme ~30 % nákladov.",
    "eval_pipeline": "Poistka, že zmeny bota nezhoršia odpovede zákazníkom.",
    "rate_limit": "Jeden zákazník nám nevyčerpá celý mesačný rozpočet.",
}

def pre_biznis(vec):
    return PREKLADY.get(vec, "Rád vysvetlím dopad na náklady a riziko osobne.")

print(pre_biznis("redis_cache"))
print(pre_biznis("kubernetes"))`),

    W('Definition of Done pre AI featuru',
      'Napíš funkciu <code>je_hotove(testy_presli, eval_skore, prah=90)</code>, ktorá vráti True, len ak <code>testy_presli</code> je True A ZÁROVEŇ <code>eval_skore >= prah</code>. Otestuj prípad, kde testy prešli, ale eval je pod prahom.',
      `# tvoj kód...`,
      [['def je_hotove'], ['testy_presli'], ['eval_skore >= prah'], ['and'], ['#2:print(']],
      'Klasické DoD (testy) + AI rozmer (merateľná kvalita na golden datasete). Bez druhej podmienky sa „doladím prompt" nikdy neskončí.',
      `def je_hotove(testy_presli, eval_skore, prah=90):
    """DoD pre AI featuru: testy AJ merateľná kvalita."""
    return testy_presli and eval_skore >= prah

print(je_hotove(True, 94))
print(je_hotove(True, 82))`),

    W('Priorizácia backlogu',
      'Každá položka backlogu má <code>"nazov"</code>, <code>"hodnota"</code> a <code>"pracnost"</code>. Napíš funkciu <code>priorizuj(backlog)</code>, ktorá zoradí položky podľa pomeru <code>hodnota / pracnost</code> zostupne cez <code>sorted(..., key=..., reverse=True)</code>, a vypíš prvú.',
      `BACKLOG = [
    {"nazov": "prepis UI", "hodnota": 3, "pracnost": 8},
    {"nazov": "redis cache", "hodnota": 8, "pracnost": 2},
    {"nazov": "novy model", "hodnota": 5, "pracnost": 5},
]

# tvoj kód...`,
      [['def priorizuj'], ['sorted('], ['hodnota'], ['pracnost'], ['reverse=True']],
      'Hodnota/prácnosť (WSJF zjednodušene) — lean priorizácia: najprv veci s najväčším dopadom na jednotku námahy.',
      `BACKLOG = [
    {"nazov": "prepis UI", "hodnota": 3, "pracnost": 8},
    {"nazov": "redis cache", "hodnota": 8, "pracnost": 2},
    {"nazov": "novy model", "hodnota": 5, "pracnost": 5},
]

def priorizuj(backlog):
    return sorted(backlog,
                  key=lambda p: p["hodnota"] / p["pracnost"],
                  reverse=True)

print(priorizuj(BACKLOG)[0]["nazov"])`),

    W('Time-box experimentu',
      'Napíš funkciu <code>vyhodnot_experiment(strávené_h, limit_h, funguje)</code>: ak <code>funguje</code>, vráť „pokračovať"; ak nie a strávený čas prekročil limit, vráť „stop — zapíš poznatky a skús iný prístup"; inak „pokračovať v experimente".',
      `# tvoj kód...`,
      [['def vyhodnot_experiment'], ['funguje'], ['limit_h'], ['#3:return']],
      'AI úlohy sa nedajú odhadnúť presne — dá sa ale ohraničiť čas. Time-box chráni šprint pred „ešte deň a už to bude".',
      `def vyhodnot_experiment(stravene_h, limit_h, funguje):
    """Experiment má rozpočet času, nie záruku výsledku."""
    if funguje:
        return "pokračovať"
    if stravene_h >= limit_h:
        return "stop — zapíš poznatky a skús iný prístup"
    return "pokračovať v experimente"

print(vyhodnot_experiment(6, 8, False))
print(vyhodnot_experiment(9, 8, False))`),

    W('Mentoringová otázka namiesto odpovede',
      'Vytvor slovník <code>OTAZKY</code> mapujúci problém v kóde na vodiacu otázku (aspoň 3: „sekvencne_volania", „bez_timeoutu", „kluc_v_kode"). Funkcia <code>reaguj(problem)</code> vráti otázku cez <code>.get</code>, s defaultom „Ako by si to otestoval?". Otestuj.',
      `# tvoj kód...`,
      [['OTAZKY'], ['sekvencne_volania'], ['def reaguj'], ['.get('], ['print(']],
      'Napr. sekvenčné volania → „Čo sa stane pri 100 dokumentoch naraz?". Otázka vedie k riešeniu; hotová odpoveď vedie k závislosti.',
      `OTAZKY = {
    "sekvencne_volania": "Čo sa stane, keď príde 100 dokumentov naraz?",
    "bez_timeoutu": "Ako dlho bude visieť požiadavka, keď API neodpovie?",
    "kluc_v_kode": "Kto všetko uvidí tento súbor v gite o rok?",
}

def reaguj(problem):
    return OTAZKY.get(problem, "Ako by si to otestoval?")

print(reaguj("sekvencne_volania"))`),

    W('Standup update',
      'Napíš funkciu <code>standup(vcera, dnes, blokery)</code>, ktorá vráti trojriadkový f-string „Včera: …", „Dnes: …", „Blokery: …" — a ak je zoznam blokerov prázdny, napíše „žiadne". Vypíš ukážku.',
      `# tvoj kód...`,
      [['def standup'], ['f"', "f'"], ['blokery'], ['žiadne'], ['print(']],
      'Formát standupov zo Scrumu: čo bolo, čo bude, čo blokuje. Blokery sú najdôležitejší riadok — tam tím môže pomôcť.',
      `def standup(vcera, dnes, blokery):
    b = ", ".join(blokery) if blokery else "žiadne"
    return (f"Včera: {vcera}\\n"
            f"Dnes: {dnes}\\n"
            f"Blokery: {b}")

print(standup("eval pipeline v CI",
              "napojenie Redis cache",
              []))`),

    W('Retro: hlasovanie o akciách',
      'Máš zoznam návrhov z retrospektívy. Napíš funkciu <code>top_akcie(hlasy, n=2)</code>, ktorá slovník {návrh: počet hlasov} zoradí cez <code>sorted(hlasy.items(), key=..., reverse=True)</code> a vráti prvých <code>n</code> návrhov. Vypíš ich.',
      `HLASY = {
    "zaviesť eval gate": 5,
    "párové programovanie na agentoch": 3,
    "kratšie standupy": 1,
}

# tvoj kód...`,
      [['def top_akcie'], ['sorted('], ['.items()'], ['reverse=True'], ['[:n]']],
      'Retro bez akcií je terapia, nie proces. Max 2–3 akcie na šprint — viac sa aj tak nestihne.',
      `HLASY = {
    "zaviesť eval gate": 5,
    "párové programovanie na agentoch": 3,
    "kratšie standupy": 1,
}

def top_akcie(hlasy, n=2):
    zoradene = sorted(hlasy.items(), key=lambda p: p[1], reverse=True)
    return [nazov for nazov, _ in zoradene[:n]]

print(top_akcie(HLASY))`),

    W('Tri príbehy na pohovor',
      'Vytvor zoznam <code>PRIBEHY</code> s tromi slovníkmi: každý má <code>"tema"</code> (trade-off / zmena názoru / mentoring) a <code>"situacia"</code>, <code>"akcia"</code>, <code>"vysledok"</code> (STAR metóda). Cyklom vypíš témy s číslovaním cez <code>enumerate</code>.',
      `# tvoj kód...`,
      [['PRIBEHY'], ['tema'], ['#3:situacia', '#3:"situacia"'], ['enumerate('], ['print(']],
      'STAR: situácia → akcia → výsledok. Tri pripravené príbehy (obhájený trade-off, zmenený názor, vytiahnutý junior) pokryjú väčšinu behaviorálnych otázok.',
      `PRIBEHY = [
    {"tema": "trade-off", "situacia": "výber vektorovej DB",
     "akcia": "ADR s pgvector + úniková cesta", "vysledok": "migrácia nebola nutná"},
    {"tema": "zmena názoru", "situacia": "trval som na fine-tuningu",
     "akcia": "eval ukázal, že RAG stačí", "vysledok": "ušetrené 3 týždne"},
    {"tema": "mentoring", "situacia": "junior a pomalé dávky",
     "akcia": "otázka o 100 dokumentoch naraz", "vysledok": "sám našiel abatch"},
]

for i, p in enumerate(PRIBEHY, start=1):
    print(f"{i}. {p['tema']}: {p['situacia']} → {p['vysledok']}")`),
  ]);
})();
