/* ============================================================
   OBSAH KURZU — Lekcie 13–19
   ============================================================ */

/* ============================================================
   LEKCIA 13 — Embeddings
   ============================================================ */
window.COURSE.lessons.l13 = {
  id: 'l13', num: 13, section: 's2', icon: '🧭', duration: '6 min',
  title: 'Embedding — z textu na vektory',
  intro: 'Ako počítač zistí, že „dovolenka" a „voľno" znamenajú takmer to isté? Premení text na vektor — zoznam čísel zachytávajúci VÝZNAM. Embeddingy sú matematické srdce celého RAG.',
  goals: [
    'Pochopiť, čo je embedding a prečo zachytáva význam textu',
    'Vytvoriť embeddingy cez OpenAIEmbeddings (text-embedding-3-small)',
    'Rozlíšiť embed_query a embed_documents',
    'Pochopiť kosínusovú podobnosť — ako sa meria „blízkosť" významov'
  ],
  blocks: [
    { t: 'h', x: 'Význam ako súradnice' },
    { t: 'p', x: 'Embedding model premení text na <strong>vektor</strong> — zoznam stoviek až tisícov desatinných čísel. Geniálne na tom je: <strong>texty s podobným významom dostanú podobné vektory</strong>. Predstav si mapu, kde každý text má svoje GPS súradnice — „dovolenka" leží blízko „voľna", ale ďaleko od „faktúry". Vyhľadávanie podľa významu je potom len hľadanie najbližších bodov na mape.' },
    { t: 'box', kind: 'key', title: 'Sémantické vs. kľúčové slová', x: 'Klasické vyhľadávanie nájde len presné slová: na otázku „koľko dní voľna mám?" dokument so slovom „dovolenka" nenájde. Embeddingy hľadajú <strong>podľa významu</strong> — „voľno" a „dovolenka" sú si vo vektorovom priestore blízko. Presne preto RAG funguje.' },
    { t: 'pycharm', title: 'main.py — prvý embedding', files: [
      { name: 'main.py', active: true, code: `from dotenv import load_dotenv
from langchain_openai import OpenAIEmbeddings

load_dotenv()

embeddings = OpenAIEmbeddings(model="text-embedding-3-small")

vektor = embeddings.embed_query("Koľko dní dovolenky mám nárok?")

print("Dĺžka vektora:", len(vektor))
print("Prvých 5 čísel:", [round(x, 4) for x in vektor[:5]])` }
    ], output: `Dĺžka vektora: 1536
Prvých 5 čísel: [-0.0119, 0.0273, -0.0082, 0.0341, -0.0156]`,
      note: '<b>text-embedding-3-small</b> vracia 1536-rozmerný vektor a stojí ~0,02 $ za MILIÓN tokenov — embedovanie celej knihy vyjde na centy.' },
    { t: 'h', x: 'embed_query vs. embed_documents' },
    { t: 'table', head: ['Metóda', 'Vstup', 'Výstup', 'Kedy'], rows: [
      ['<code>embed_query(text)</code>', 'jeden string', 'jeden vektor', 'Otázka používateľa pri vyhľadávaní'],
      ['<code>embed_documents([t1, t2…])</code>', 'zoznam stringov', 'zoznam vektorov', 'Hromadné indexovanie chunkov']
    ] },
    { t: 'h', x: 'Meranie podobnosti: kosínus' },
    { t: 'p', x: 'Podobnosť dvoch vektorov sa meria <strong>kosínusovou podobnosťou</strong> — kosínusom uhla medzi nimi. Hodnota sa pohybuje od -1 do 1: čím bližšie k 1, tým podobnejší význam. Vyskúšajme, či to naozaj funguje:' },
    { t: 'pycharm', title: 'main.py — podobnosť významov v praxi', files: [
      { name: 'main.py', active: true, code: `from dotenv import load_dotenv
from langchain_openai import OpenAIEmbeddings
import math

load_dotenv()
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")

def kosinus(a: list[float], b: list[float]) -> float:
    skalarny = sum(x * y for x, y in zip(a, b))
    norma_a = math.sqrt(sum(x * x for x in a))
    norma_b = math.sqrt(sum(x * x for x in b))
    return skalarny / (norma_a * norma_b)

vety = [
    "Zamestnanec má nárok na 25 dní dovolenky.",   # o dovolenke
    "Koľko dní voľna si môžem vziať?",              # o dovolenke (inak!)
    "Faktúru uhraďte do 14 dní od vystavenia.",     # o faktúrach
]

vektory = embeddings.embed_documents(vety)

print("dovolenka vs. voľno:  ", round(kosinus(vektory[0], vektory[1]), 3))
print("dovolenka vs. faktúra:", round(kosinus(vektory[0], vektory[2]), 3))` }
    ], output: `dovolenka vs. voľno:   0.712
dovolenka vs. faktúra: 0.231`,
      note: 'Vety o dovolenke sú si výrazne bližšie (0.712), hoci nezdieľajú takmer žiadne slová! Veta o faktúre je ďaleko — presne takto retriever pozná, čo je relevantné.' },
    { t: 'box', kind: 'warn', title: 'Jedno zlaté pravidlo', x: 'Na indexovanie dokumentov aj na embedovanie otázok musíš použiť <strong>ten istý embedding model</strong>. Vektory z rôznych modelov sú vzájomne neporovnateľné — ako GPS súradnice z dvoch rôznych planét.' },
    { t: 'box', kind: 'info', title: 'Nemusíš to robiť ručne', x: 'Kosínus sme si napísali len pre pochopenie. V praxi výpočty podobnosti rieši <strong>vektorová databáza</strong> — a presne o nej je nasledujúca lekcia.' }
  ],
  quiz: [
    { q: 'Čo je embedding?',
      opts: ['Komprimovaný text', 'Vektor čísel zachytávajúci význam textu', 'Šifrovaná verzia dokumentu', 'Zoznam kľúčových slov'],
      correct: 1, explain: 'Embedding je číselná reprezentácia významu — texty s podobným významom majú podobné vektory, čo umožňuje sémantické vyhľadávanie.' },
    { q: 'Prečo embeddingy nájdu dokument o „dovolenke" aj pri otázke o „voľne"?',
      opts: ['Obsahujú slovník synoným', 'Významovo podobné texty majú blízke vektory — hľadá sa podľa významu, nie slov', 'OpenAI prekladá otázky', 'Náhoda'],
      correct: 1, explain: 'Embedding model sa naučil význam z obrovského množstva textov — „dovolenka" a „voľno" sa používajú v podobných kontextoch, preto majú blízke vektory.' },
    { q: 'Akú metódu použiješ na embedovanie 500 chunkov naraz?',
      opts: ['embed_query v cykle', 'embed_documents(zoznam_textov)', 'embed_all()', 'vectorize()'],
      correct: 1, explain: 'embed_documents() prijme zoznam textov a vráti zoznam vektorov — efektívnejšie než volať embed_query 500-krát.' },
    { q: 'Kosínusová podobnosť 0.95 medzi dvoma textami znamená:',
      opts: ['Texty sú takmer totožné významom', 'Texty nemajú nič spoločné', 'Jeden text je dlhší', 'Nastala chyba'],
      correct: 0, explain: 'Hodnoty blízke 1 = veľmi podobný význam. Okolo 0 = nesúvisiace texty.' },
    { q: 'Prečo musíš na otázky aj dokumenty použiť rovnaký embedding model?',
      opts: ['Kvôli licencii', 'Vektory rôznych modelov sú neporovnateľné — žijú v iných priestoroch', 'Rovnaký model je lacnejší', 'Nemusíš, modely sú kompatibilné'],
      correct: 1, explain: 'Každý model má vlastný vektorový priestor (inú „mapu"). Porovnávať vektor z modelu A s vektorom z modelu B nedáva zmysel.' }
  ],
  exercises: [
    { t: 'blanks', title: 'Embeduj otázku aj dokumenty', xp: 20,
      intro: 'Doplň správne triedy a metódy pre embedovanie.',
      code: `from langchain_openai import ⟦0⟧

embeddings = OpenAIEmbeddings(model="⟦1⟧")

# jedna otázka → jeden vektor
v_otazka = embeddings.⟦2⟧("Aká je otváracia doba?")

# veľa chunkov → veľa vektorov
v_chunky = embeddings.⟦3⟧(["text 1", "text 2", "text 3"])

print(len(v_otazka), len(v_chunky))`,
      blanks: [['OpenAIEmbeddings'], ['text-embedding-3-small'], ['embed_query'], ['embed_documents']],
      hint: 'Trieda OpenAIEmbeddings, model text-embedding-3-small. Jeden text = embed_query, zoznam textov = embed_documents.' },
    { t: 'order', title: 'Sémantická blízkosť', xp: 20,
      intro: 'Vetu „Aký je nárok na dovolenku?" porovnávame s ostatnými. Zoraď vety od NAJPODOBNEJŠEJ (najvyšší kosínus) po najvzdialenejšiu.',
      items: [
        '„Zamestnanec má právo na 25 dní voľna ročne."',
        '„Žiadosť o voľno podaj 14 dní vopred."',
        '„Služobné cesty schvaľuje manažér."',
        '„Recept na palacinky: múka, mlieko, vajcia."' ] },
    { t: 'write', title: 'Porovnávač viet', xp: 30,
      intro: 'Over si sémantickú podobnosť na vlastných vetách.',
      task: 'Vytvor <code>OpenAIEmbeddings</code> s modelom <code>text-embedding-3-small</code>, cez <code>embed_documents</code> embeduj dve ľubovoľné vety a vypíš dĺžku prvého vektora cez <code>len()</code>.',
      starter: `from dotenv import load_dotenv
from langchain_openai import OpenAIEmbeddings

load_dotenv()
# tvoj kód...`,
      must: [['OpenAIEmbeddings'], ['text-embedding-3-small'], ['embed_documents'], ['len(']],
      hint: 'embeddings = OpenAIEmbeddings(model="text-embedding-3-small") → vektory = embeddings.embed_documents(["veta A", "veta B"]) → print(len(vektory[0])).',
      solution: `from dotenv import load_dotenv
from langchain_openai import OpenAIEmbeddings

load_dotenv()

embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
vektory = embeddings.embed_documents([
    "Milujem programovanie v Pythone.",
    "Kódenie v Pythone ma baví."
])
print("Rozmer vektora:", len(vektory[0]))` }
  ]
};

/* ============================================================
   LEKCIA 14 — Vector Stores
   ============================================================ */
window.COURSE.lessons.l14 = {
  id: 'l14', num: 14, section: 's2', icon: '🗄️', duration: '7 min',
  title: 'Vector Stores — vektorové databázy',
  intro: 'Máš tisíce chunkov a ich vektory — kam s nimi? Vektorová databáza ich uloží a bleskovo v nich nájde najpodobnejšie k otázke. My použijeme Chroma: open-source, beží lokálne a ukladá sa na disk.',
  goals: [
    'Pochopiť úlohu vektorovej databázy v RAG',
    'Vytvoriť Chroma databázu z dokumentov jediným príkazom from_documents',
    'Vyhľadávať cez similarity_search a similarity_search_with_score',
    'Uložiť databázu na disk (persist_directory) a znovu ju načítať'
  ],
  blocks: [
    { t: 'h', x: 'Čo robí vektorová databáza' },
    { t: 'p', x: 'Vector store robí tri veci: <strong>uloží</strong> chunky spolu s ich vektormi, <strong>zaindexuje</strong> ich pre rýchle hľadanie a na požiadanie <strong>nájde k najpodobnejších</strong> chunkov k vektoru otázky. To, čo sme v minulej lekcii počítali ručne cez kosínus, robí databáza optimalizovane nad miliónmi vektorov za milisekundy.' },
    { t: 'table', head: ['Databáza', 'Typ', 'Kedy zvoliť'], rows: [
      ['<code>Chroma</code>', 'lokálna, open-source, ukladá na disk', 'Vývoj, menšie projekty, tento kurz ✅'],
      ['<code>FAISS</code>', 'lokálna knižnica (Meta), in-memory', 'Rýchle experimenty, veľké dáta bez servera'],
      ['<code>Pinecone</code>', 'cloudová služba', 'Produkcia bez správy infraštruktúry'],
      ['<code>pgvector</code>', 'rozšírenie PostgreSQL', 'Keď už máš Postgres a DevOps tím']
    ] },
    { t: 'h', x: 'Chroma: od chunkov k databáze jedným riadkom' },
    { t: 'p', x: 'Metóda <code>Chroma.from_documents()</code> urobí celú indexačnú fázu naraz: každý chunk prežene embedding modelom a vektor uloží. Parameter <code>persist_directory</code> zabezpečí uloženie na disk — databázu tak vytvoríš <strong>raz</strong> a používaš opakovane:' },
    { t: 'pycharm', title: 'indexuj.py — vytvorenie databázy', files: [
      { name: 'indexuj.py', active: true, code: `from dotenv import load_dotenv
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma

load_dotenv()

# 1) Načítaj a rozsekaj (lekcie 11 + 12)
dokumenty = TextLoader("smernica.txt", encoding="utf-8").load()
splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=80)
chunky = splitter.split_documents(dokumenty)

# 2) Embeduj a ulož do Chroma (lekcia 13 + 14)
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")

db = Chroma.from_documents(
    documents=chunky,
    embedding=embeddings,
    persist_directory="./chroma_db",
)

print(f"Zaindexovaných {len(chunky)} chunkov do ./chroma_db")` }
    ], output: `Zaindexovaných 12 chunkov do ./chroma_db`,
      note: 'Balík: <b>pip install langchain-chroma</b>. V priečinku projektu pribudne ./chroma_db — celá databáza ako obyčajné súbory.' },
    { t: 'h', x: 'Vyhľadávanie podľa významu' },
    { t: 'p', x: 'A teraz výplata za všetku prácu — <code>similarity_search()</code>. Otázku napíšeš ľudskou rečou, databáza ju embedne a vráti k najpodobnejších chunkov:' },
    { t: 'pycharm', title: 'hladaj.py — similarity search', files: [
      { name: 'hladaj.py', active: true, code: `from dotenv import load_dotenv
from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma

load_dotenv()

embeddings = OpenAIEmbeddings(model="text-embedding-3-small")

# Načítanie EXISTUJÚCEJ databázy z disku — žiadne nové indexovanie
db = Chroma(persist_directory="./chroma_db", embedding_function=embeddings)

vysledky = db.similarity_search("Koľko dní voľna si môžem vziať?", k=2)

for doc in vysledky:
    print("•", doc.page_content[:70], "…")

# Variant so skóre podobnosti (nižšie = bližšie)
so_skore = db.similarity_search_with_score("voľno", k=1)
doc, skore = so_skore[0]
print("Skóre najlepšieho:", round(skore, 3))` }
    ], output: `• Každý zamestnanec má nárok na 25 dní dovolenky ročne. Žiadosť sa pod …
• Nevyčerpané dni dovolenky sa prenášajú maximálne do 31. marca nasledu …
Skóre najlepšieho: 0.287`,
      note: 'Otázka „voľno" našla chunky o „dovolenke" — sémantika v akcii! Pri Chrome platí: skóre = vzdialenosť, takže <b>nižšie číslo = vyššia podobnosť</b>.' },
    { t: 'box', kind: 'key', title: 'Dva režimy Chromy', x: '<strong>Vytvorenie:</strong> <code>Chroma.from_documents(chunky, embeddings, persist_directory=...)</code> — spúšťaš raz (alebo pri zmene dát). <strong>Načítanie:</strong> <code>Chroma(persist_directory=..., embedding_function=embeddings)</code> — používaš v aplikácii. Nezamieňaj — opakované from_documents by dáta zaindexovalo (a zaplatilo) znova!' },
    { t: 'box', kind: 'tip', title: 'Pridávanie nových dokumentov', x: 'Do existujúcej databázy pridáš dáta cez <code>db.add_documents(nove_chunky)</code> — netreba indexovať odznova. Presne takto sa rieši „firma pridala novú smernicu".' }
  ],
  quiz: [
    { q: 'Čo robí Chroma.from_documents(chunky, embeddings, persist_directory="./db")?',
      opts: ['Len uloží texty do súboru', 'Embedne všetky chunky a uloží texty + vektory do databázy na disku', 'Vytvorí PDF z chunkov', 'Pošle dokumenty do OpenAI na tréning'],
      correct: 1, explain: 'from_documents = celé indexovanie naraz: každý chunk dostane vektor cez embedding model a uloží sa do perzistentnej databázy.' },
    { q: 'Ako načítaš už existujúcu Chroma databázu z disku?',
      opts: ['Chroma.from_documents() znova', 'Chroma(persist_directory="./db", embedding_function=embeddings)', 'Chroma.load("./db")', 'open("./db")'],
      correct: 1, explain: 'Konštruktor s persist_directory a embedding_function databázu len otvorí — bez nového (plateného) indexovania.' },
    { q: 'Čo vráti db.similarity_search("otázka", k=3)?',
      opts: ['3 náhodné dokumenty', '3 chunky s najpodobnejším významom k otázke', 'Prvé 3 dokumenty v databáze', 'Odpoveď modelu'],
      correct: 1, explain: 'similarity_search embedne otázku a vráti k najbližších chunkov vo vektorovom priestore — základ retrievalu.' },
    { q: 'Pri similarity_search_with_score v Chrome platí:',
      opts: ['Vyššie skóre = podobnejší dokument', 'Nižšie skóre (vzdialenosť) = podobnejší dokument', 'Skóre je vždy 0 alebo 1', 'Skóre udáva počet slov'],
      correct: 1, explain: 'Chroma vracia vzdialenosť — čím menšia, tým bližší význam. Pozor, niektoré iné databázy vracajú podobnosť (opačne)!' },
    { q: 'Firma pridala novú smernicu. Najefektívnejší postup?',
      opts: ['Zmazať databázu a indexovať všetko odznova', 'db.add_documents(nove_chunky) — pridať len nové', 'Fine-tuning modelu', 'Vložiť smernicu do system promptu'],
      correct: 1, explain: 'add_documents pridá nové chunky do existujúceho indexu — rýchle a lacné. Reindexovať všetko netreba.' }
  ],
  exercises: [
    { t: 'blanks', title: 'Postav vektorovú databázu', xp: 20,
      intro: 'Doplň vytvorenie Chroma databázy s ukladaním na disk.',
      code: `from langchain_chroma import Chroma
from langchain_openai import OpenAIEmbeddings

embeddings = OpenAIEmbeddings(model="text-embedding-3-small")

db = Chroma.⟦0⟧(
    documents=chunky,
    ⟦1⟧=embeddings,
    ⟦2⟧="./chroma_db",
)

vysledky = db.⟦3⟧("Aké sú podmienky vrátenia tovaru?", k=3)`,
      blanks: [['from_documents'], ['embedding'], ['persist_directory'], ['similarity_search']],
      hint: 'Tvorba databázy: from_documents s parametrami embedding a persist_directory. Hľadanie: similarity_search.' },
    { t: 'order', title: 'Životný cyklus vektorovej DB', xp: 20,
      intro: 'Zoraď kroky práce s Chromou od nuly po vyhľadávanie v bežiacej aplikácii.',
      items: [
        'Priprav chunky (loader + splitter)',
        'Vytvor OpenAIEmbeddings',
        'Chroma.from_documents(...) — jednorazové indexovanie na disk',
        'V aplikácii: Chroma(persist_directory=..., embedding_function=...)',
        'db.similarity_search(otázka, k=3) pri každom dopyte' ] },
    { t: 'write', title: 'Kompletná indexačná pipeline', xp: 30,
      intro: 'Veľká syntéza sekcie: loader → splitter → embeddings → databáza → hľadanie.',
      task: 'Napíš skript, ktorý: načíta <code>"faq.txt"</code> cez <code>TextLoader</code>, rozseká ho (<code>chunk_size=400</code>, <code>chunk_overlap=60</code>), vytvorí <code>Chroma.from_documents</code> s <code>OpenAIEmbeddings</code> a <code>persist_directory="./faq_db"</code> a nakoniec cez <code>similarity_search</code> nájde 2 chunky k otázke „Ako vrátim tovar?".',
      starter: `from dotenv import load_dotenv
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma

load_dotenv()
# tvoj kód...`,
      must: [['TextLoader('], ['chunk_size=400'], ['from_documents'], ['persist_directory'], ['similarity_search'], ['k=2']],
      hint: 'Postupuj po vrstvách presne ako v lekcii: load() → split_documents() → from_documents(...) → similarity_search("Ako vrátim tovar?", k=2).',
      solution: `from dotenv import load_dotenv
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma

load_dotenv()

dokumenty = TextLoader("faq.txt", encoding="utf-8").load()
splitter = RecursiveCharacterTextSplitter(chunk_size=400, chunk_overlap=60)
chunky = splitter.split_documents(dokumenty)

embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
db = Chroma.from_documents(chunky, embedding=embeddings, persist_directory="./faq_db")

for doc in db.similarity_search("Ako vrátim tovar?", k=2):
    print("•", doc.page_content[:80])` }
  ]
};

/* ============================================================
   LEKCIA 15 — Retrievers
   ============================================================ */
window.COURSE.lessons.l15 = {
  id: 'l15', num: 15, section: 's2', icon: '🎣', duration: '7 min',
  title: 'Retrievers — extrakcia dokumentov',
  intro: 'Posledný diel RAG skladačky. Retriever je jednotné rozhranie „daj mi relevantné dokumenty" — a pretože je to Runnable, zapojíš ho priamo do chainu. Na konci lekcie máš funkčný systém otázok a odpovedí nad vlastnými dokumentmi.',
  goals: [
    'Premeniť vektorovú databázu na retriever cez as_retriever()',
    'Nastaviť typ vyhľadávania: similarity, MMR, score_threshold',
    'Postaviť kompletný RAG chain: create_stuff_documents_chain + create_retrieval_chain',
    'Vedieť, čo obsahuje odpoveď RAG chainu (answer + context)'
  ],
  blocks: [
    { t: 'h', x: 'Z databázy retriever' },
    { t: 'p', x: 'Retriever vznikne z databázy jediným volaním <code>as_retriever()</code>. Prečo nový pojem, keď máme similarity_search? Lebo retriever je <strong>Runnable</strong> — má invoke() a dá sa zapojiť do chainu cez <code>|</code>. Navyše abstrahuje zdroj: chain nemusí vedieť, či dokumenty tečú z Chromy, Pinecone alebo z webu.' },
    { t: 'pycharm', title: 'main.py — retriever v akcii', files: [
      { name: 'main.py', active: true, code: `from dotenv import load_dotenv
from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma

load_dotenv()
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
db = Chroma(persist_directory="./chroma_db", embedding_function=embeddings)

retriever = db.as_retriever(search_kwargs={"k": 3})

# Retriever je Runnable — volá sa cez invoke()
dokumenty = retriever.invoke("prenos dovolenky do ďalšieho roka")

for d in dokumenty:
    print("•", d.page_content[:60], "…")` }
    ], output: `• Nevyčerpané dni dovolenky sa prenášajú maximálne do 31. mar …
• Každý zamestnanec má nárok na 25 dní dovolenky ročne. Žiado …
• O výnimkách z prenosu rozhoduje priamy nadriadený po dohode …` },
    { t: 'h', x: 'Režimy vyhľadávania' },
    { t: 'table', head: ['search_type', 'Čo robí', 'Kedy'], rows: [
      ['<code>"similarity"</code> (default)', 'Vráti k najpodobnejších chunkov', 'Štandard — začni vždy týmto'],
      ['<code>"mmr"</code>', 'Maximal Marginal Relevance — podobné, ale navzájom RÔZNORODÉ chunky', 'Keď similarity vracia 3× ten istý odsek z rôznych verzií dokumentu'],
      ['<code>"similarity_score_threshold"</code>', 'Len chunky nad prahom podobnosti', 'Radšej žiadny kontext než nerelevantný — proti halucináciám']
    ] },
    { t: 'p', x: 'Príklad prísnejšieho retrievera: <code>db.as_retriever(search_type="similarity_score_threshold", search_kwargs={"score_threshold": 0.5, "k": 4})</code> — ak nič neprekoná prah, vráti prázdny zoznam a model môže čestne povedať „v dokumentoch to nie je".' },
    { t: 'h', x: 'Kompletný RAG chain' },
    { t: 'p', x: 'Teraz všetko spojíme. LangChain na to má dvojicu hotových staviteľov: <code>create_stuff_documents_chain</code> („stuff" = napchaj dokumenty do promptu, do premennej <code>{context}</code>) a <code>create_retrieval_chain</code> (pred neho zapojí retriever). Vstupom je <code>{input}</code>, výstupom slovník s odpoveďou aj použitým kontextom:' },
    { t: 'pycharm', title: 'rag.py — otázky a odpovede nad dokumentmi', files: [
      { name: 'rag.py', active: true, code: `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_chroma import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains import create_retrieval_chain

load_dotenv()

embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
db = Chroma(persist_directory="./chroma_db", embedding_function=embeddings)
retriever = db.as_retriever(search_kwargs={"k": 3})

model = ChatOpenAI(model="gpt-4o-mini", temperature=0)

prompt = ChatPromptTemplate.from_messages([
    ("system", "Odpovedaj IBA na základe kontextu. Ak odpoveď "
               "v kontexte nie je, povedz to.\\n\\nKontext:\\n{context}"),
    ("human", "{input}"),
])

dokumentovy_chain = create_stuff_documents_chain(model, prompt)
rag_chain = create_retrieval_chain(retriever, dokumentovy_chain)

vysledok = rag_chain.invoke({"input": "Dokedy môžem preniesť dovolenku?"})

print("ODPOVEĎ:", vysledok["answer"])
print("Zdroje:", [d.metadata["source"] for d in vysledok["context"]])` }
    ], output: `ODPOVEĎ: Nevyčerpané dni dovolenky si môžeš preniesť maximálne do 31. marca nasledujúceho roka.
Zdroje: ['smernica.txt', 'smernica.txt', 'smernica.txt']`,
      note: 'Slovník výsledku obsahuje <b>answer</b> (odpoveď) aj <b>context</b> (použité chunky s metadátami) — máš teda odpoveď AJ jej dôkazy. Toto je jadro každej RAG aplikácie.' },
    { t: 'flow', steps: ['❓ {input}', '🎣 Retriever<br><small>nájde k chunkov</small>', '📝 Prompt<br><small>{context} + {input}</small>', '🧠 Model<br><small>odpovie z kontextu</small>', '📦 {answer, context}'] },
    { t: 'box', kind: 'key', title: 'Magické názvy premenných', x: 'create_retrieval_chain očakáva vstup pod kľúčom <code>input</code>, kontext vkladá do premennej <code>context</code> a odpoveď vracia pod kľúčom <code>answer</code>. Tieto tri názvy si zapamätaj — sú pevne dané.' },
    { t: 'box', kind: 'tip', title: 'System prompt proti halucináciám', x: 'Veta „Odpovedaj IBA na základe kontextu, inak povedz, že nevieš" je najlacnejšia poistka proti vymýšľaniu. V kombinácii so score_threshold retrieverom máš solídnu obranu.' }
  ],
  quiz: [
    { q: 'Ako z Chroma databázy vyrobíš retriever?',
      opts: ['Retriever(db)', 'db.as_retriever(search_kwargs={"k": 3})', 'db.to_retriever()', 'create_retriever(db)'],
      correct: 1, explain: 'as_retriever() obalí databázu jednotným Runnable rozhraním; v search_kwargs nastavíš napr. počet vrátených chunkov k.' },
    { q: 'Kedy siahneš po search_type="mmr"?',
      opts: ['Keď chceš najrýchlejšie vyhľadávanie', 'Keď similarity vracia príliš podobné/duplicitné chunky a chceš rôznorodosť', 'Keď nemáš embeddingy', 'MMR je default'],
      correct: 1, explain: 'MMR vyvažuje relevanciu s rôznorodosťou — penalizuje chunky príliš podobné už vybraným. Ideálne pri duplicitnom obsahu.' },
    { q: 'Čo robí create_stuff_documents_chain?',
      opts: ['Ukladá dokumenty na disk', 'Vytvorí chain, ktorý nájdené dokumenty „napchá" do {context} v prompte a zavolá model', 'Sťahuje dokumenty z webu', 'Maže staré dokumenty'],
      correct: 1, explain: '„Stuff" stratégia = všetky nájdené chunky sa vložia do jednej premennej {context} v prompte. Jednoduchá a pre RAG najbežnejšia.' },
    { q: 'Aké kľúče má slovník, ktorý vráti create_retrieval_chain?',
      opts: ['output a sources', 'answer a context (plus input)', 'text a docs', 'result a links'],
      correct: 1, explain: 'rag_chain.invoke({"input": ...}) vráti slovník s "answer" (odpoveď modelu) a "context" (zoznam použitých Documentov).' },
    { q: 'Retriever s score_threshold nevrátil žiadny chunk. Dobrá RAG aplikácia by mala:',
      opts: ['Nechať model odpovedať z vlastnej pamäte', 'Povedať používateľovi, že odpoveď v dokumentoch nie je', 'Vyhodiť výnimku', 'Zopakovať otázku trikrát'],
      correct: 1, explain: 'Prázdny kontext + inštrukcia v system prompte = čestné „v dokumentoch sa to nenachádza". To je presne želané správanie proti halucináciám.' }
  ],
  exercises: [
    { t: 'blanks', title: 'Zlož RAG chain', xp: 20,
      intro: 'Doplň finálnu montáž RAG systému.',
      code: `retriever = db.⟦0⟧(search_kwargs={"k": 3})

prompt = ChatPromptTemplate.from_messages([
    ("system", "Odpovedaj len z kontextu:\\n{⟦1⟧}"),
    ("human", "{input}"),
])

dokumentovy_chain = ⟦2⟧(model, prompt)
rag_chain = ⟦3⟧(retriever, dokumentovy_chain)

vysledok = rag_chain.invoke({"input": "Aká je záručná doba?"})
print(vysledok["⟦4⟧"])`,
      blanks: [['as_retriever'], ['context'], ['create_stuff_documents_chain'], ['create_retrieval_chain'], ['answer']],
      hint: 'as_retriever → premenná {context} v prompte → create_stuff_documents_chain → create_retrieval_chain → odpoveď je pod kľúčom "answer".' },
    { t: 'order', title: 'Cesta otázky RAG chainom', xp: 20,
      intro: 'Zoraď, čo sa stane po rag_chain.invoke({"input": "…"}).',
      items: [
        'Retriever embedne otázku a nájde k najpodobnejších chunkov',
        'Chunky sa vložia do premennej {context} v prompte',
        'Otázka sa vloží do {input} v human správe',
        'Model vygeneruje odpoveď opretú o kontext',
        'Chain vráti slovník {"answer": …, "context": […]}' ] },
    { t: 'write', title: 'RAG s citáciou zdrojov', xp: 30,
      intro: 'Rozšír RAG o transparentnosť — používateľ chce vidieť zdroje.',
      task: 'Vytvor retriever z databázy <code>db</code> (k=2), RAG chain cez <code>create_stuff_documents_chain</code> + <code>create_retrieval_chain</code>, polož otázku a vypíš <code>answer</code> aj <code>metadata["source"]</code> každého dokumentu z <code>context</code>.',
      starter: `# db, model a prompt už existujú z lekcie
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains import create_retrieval_chain

# tvoj kód...`,
      must: [['as_retriever'], ['create_stuff_documents_chain'], ['create_retrieval_chain'], ['["answer"]'], ['metadata']],
      hint: 'Po invoke prejdi cyklom vysledok["context"] a vypíš d.metadata["source"] pre každý dokument d.',
      solution: `from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains import create_retrieval_chain

retriever = db.as_retriever(search_kwargs={"k": 2})

dokumentovy_chain = create_stuff_documents_chain(model, prompt)
rag_chain = create_retrieval_chain(retriever, dokumentovy_chain)

vysledok = rag_chain.invoke({"input": "Aká je záručná doba?"})

print("Odpoveď:", vysledok["answer"])
for d in vysledok["context"]:
    print("Zdroj:", d.metadata["source"])` }
  ]
};

/* ============================================================
   LEKCIA 16 — Základy ChatBotov
   ============================================================ */
window.COURSE.lessons.l16 = {
  id: 'l16', num: 16, section: 's3', icon: '🗨️', duration: '2 min',
  title: 'Základy ChatBotov',
  intro: 'Začína sa tretia sekcia — staviame chatbota. Prvá verzia je prekvapivo jednoduchá: nekonečná slučka, ktorá číta otázky a vypisuje odpovede. O pár lekcií z nej bude RAG chatbot s pamäťou.',
  goals: [
    'Postaviť konverzačnú slučku while True s príkazom na ukončenie',
    'Zapojiť chain s osobnosťou bota do slučky',
    'Pochopiť limity bota bez pamäte'
  ],
  blocks: [
    { t: 'h', x: 'Anatómia najjednoduchšieho chatbota' },
    { t: 'p', x: 'Chatbot v konzole = tri ingrediencie: <strong>slučka</strong> (<code>while True</code>), <strong>vstup</strong> (<code>input()</code>) a <strong>chain</strong>, ktorý vygeneruje odpoveď. Pridáme ukončovací príkaz a osobnosť cez system správu:' },
    { t: 'pycharm', title: 'chatbot.py — prvý chatbot', files: [
      { name: 'chatbot.py', active: true, code: `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

load_dotenv()

prompt = ChatPromptTemplate.from_messages([
    ("system", "Si priateľský asistent Bistra u Jozefa. "
               "Odpovedáš stručne a po slovensky."),
    ("human", "{otazka}"),
])

chain = prompt | ChatOpenAI(model="gpt-4o-mini") | StrOutputParser()

print("Bot: Vitaj! Napíš 'koniec' pre ukončenie.")
while True:
    otazka = input("Ty: ")
    if otazka.lower() in ("koniec", "exit", "quit"):
        print("Bot: Maj sa!")
        break
    odpoved = chain.invoke({"otazka": otazka})
    print("Bot:", odpoved)` }
    ], output: `Bot: Vitaj! Napíš 'koniec' pre ukončenie.
Ty: Aké máte dnes menu?
Bot: Dnes odporúčam domácu šošovicovú polievku a vyprážaný syr s hranolkami!
Ty: A máte aj niečo sladké?
Bot: Áno, čerstvý jablkový závin a palacinky s tvarohom.
Ty: koniec
Bot: Maj sa!`,
      note: 'V PyCharme píšeš vstupy priamo do Run konzoly. Slučka beží, kým nenapíšeš „koniec".' },
    { t: 'box', kind: 'warn', title: 'Tento bot má sklerózu', x: 'Polož mu dve nadväzujúce otázky: „Volám sa Martin" a potom „Ako sa volám?" — odpovie, že nevie. Každý invoke() je <strong>úplne nové</strong> volanie bez histórie. Spomeň si na lekciu o messages: pamäť = posielanie histórie. Presne to opravíme v nasledujúcej lekcii.' }
  ],
  quiz: [
    { q: 'Prečo si jednoduchý chatbot nepamätá predchádzajúce správy?',
      opts: ['Model má malú pamäť RAM', 'Každý invoke() posiela len aktuálnu otázku — bez histórie', 'OpenAI maže konverzácie', 'Slučka while resetuje model'],
      correct: 1, explain: 'Chain dostáva vždy len {otazka}. Model je bezstavový — históriu by sme mu museli poslať my (ďalšia lekcia!).' },
    { q: 'Ako sa slučka chatbota správne ukončí?',
      opts: ['Stlačením Ctrl+S', 'Podmienkou na vstup (napr. „koniec") a príkazom break', 'Automaticky po 10 otázkach', 'Zavolaním chain.stop()'],
      correct: 1, explain: 'Pred volaním chainu skontrolujeme vstup — ak je to ukončovací príkaz, break vyskočí zo slučky while True.' },
    { q: 'Kam patrí „osobnosť" chatbota (tón, rola, jazyk)?',
      opts: ['Do názvu súboru', 'Do system správy v prompte', 'Do parametra personality', 'Do .env'],
      correct: 1, explain: 'System správa platí pre každú odpoveď — definuje rolu, tón a pravidlá bota na jednom mieste.' }
  ],
  exercises: [
    { t: 'blanks', title: 'Oprav slučku bota', xp: 20,
      intro: 'Doplň konverzačnú slučku s ukončením.',
      code: `print("Bot: Pýtaj sa, alebo napíš 'koniec'.")
⟦0⟧ True:
    otazka = ⟦1⟧("Ty: ")
    if otazka.lower() == "koniec":
        ⟦2⟧
    odpoved = chain.⟦3⟧({"otazka": otazka})
    print("Bot:", odpoved)`,
      blanks: [['while'], ['input'], ['break'], ['invoke']],
      hint: 'Nekonečná slučka = while True. Vstup číta input(). Slučku ukončí break a chain spúšťa invoke().' },
    { t: 'write', title: 'Bot kníhkupectva', xp: 30,
      intro: 'Postav vlastného konzolového bota od začiatku.',
      task: 'Napíš chatbota pre kníhkupectvo: system správa určí rolu („Si knihomoľ-poradca…"), slučka <code>while True</code> číta vstup, na „koniec" sa ukončí cez <code>break</code>, inak zavolá chain a vypíše odpoveď.',
      starter: `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

load_dotenv()
# tvoj kód...`,
      must: [['("system"', "('system'"], ['while True'], ['input('], ['break'], ['.invoke(']],
      hint: 'Prompt so system + human {otazka}, chain = prompt | model | parser, potom slučka presne ako v lekcii.',
      solution: `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

load_dotenv()

prompt = ChatPromptTemplate.from_messages([
    ("system", "Si knihomoľ-poradca v kníhkupectve. Odporúčaš knihy stručne."),
    ("human", "{otazka}"),
])
chain = prompt | ChatOpenAI(model="gpt-4o-mini") | StrOutputParser()

while True:
    otazka = input("Ty: ")
    if otazka.lower() == "koniec":
        break
    print("Bot:", chain.invoke({"otazka": otazka}))` }
  ]
};

/* ============================================================
   LEKCIA 17 — ChatBot s pamäťou
   ============================================================ */
window.COURSE.lessons.l17 = {
  id: 'l17', num: 17, section: 's3', icon: '🧠', duration: '2 min',
  title: 'ChatBot s pamäťou',
  intro: 'Liečime sklerózu z minulej lekcie. Princíp poznáš z lekcie o messages: histórii konverzácie vedieme zoznam a pri každej otázke ju celú pošleme modelu. Kľúčom je MessagesPlaceholder.',
  goals: [
    'Vložiť históriu do promptu cez MessagesPlaceholder',
    'Po každej výmene pridať HumanMessage a AIMessage do histórie',
    'Overiť, že bot si pamätá kontext konverzácie'
  ],
  blocks: [
    { t: 'h', x: 'MessagesPlaceholder — diera na históriu' },
    { t: 'p', x: '<code>MessagesPlaceholder("chat_history")</code> je rezervované miesto v prompte, kam sa pri invoke() vloží <strong>celý zoznam správ</strong>. Prompt tak má tri časti: systémové pravidlá, doterajšiu konverzáciu a novú otázku:' },
    { t: 'pycharm', title: 'chatbot.py — bot s pamäťou', files: [
      { name: 'chatbot.py', active: true, code: `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage
from langchain_core.output_parsers import StrOutputParser

load_dotenv()

prompt = ChatPromptTemplate.from_messages([
    ("system", "Si priateľský asistent. Odpovedáš stručne."),
    MessagesPlaceholder("chat_history"),
    ("human", "{otazka}"),
])

chain = prompt | ChatOpenAI(model="gpt-4o-mini") | StrOutputParser()

historia = []  # tu žije pamäť bota

while True:
    otazka = input("Ty: ")
    if otazka.lower() == "koniec":
        break

    odpoved = chain.invoke({"chat_history": historia, "otazka": otazka})
    print("Bot:", odpoved)

    # zapíš výmenu do pamäte
    historia.append(HumanMessage(content=otazka))
    historia.append(AIMessage(content=odpoved))` }
    ], output: `Ty: Volám sa Martin a mám rád horské bicykle.
Bot: Teší ma, Martin! Horské bicykle sú skvelý koníček.
Ty: Ako sa volám a čo mám rád?
Bot: Voláš sa Martin a máš rád horské bicykle. 🚵
Ty: koniec`,
      note: 'Funguje! Pri druhej otázke model dostal v chat_history celú prvú výmenu — preto pozná meno aj koníček.' },
    { t: 'flow', steps: ['❓ Nová otázka', '📚 historia<br><small>všetky doterajšie správy</small>', '📝 Prompt<br><small>system + história + otázka</small>', '🧠 Model', '💾 append<br><small>Human + AI do histórie</small>'] },
    { t: 'box', kind: 'warn', title: 'História rastie — a s ňou cena', x: 'Každá výmena pridá správy a tie sa posielajú <strong>pri každom volaní</strong>. Dlhá konverzácia = veľa tokenov = vyššia cena a riziko prekročenia kontextu. Riešenia z praxe: posielať len posledných N správ (<code>historia[-10:]</code>), alebo staršie správy zosumarizovať.' },
    { t: 'box', kind: 'info', title: 'Pre viac používateľov: RunnableWithMessageHistory', x: 'Globálny zoznam stačí pre konzolu. V reálnej aplikácii s viacerými používateľmi LangChain ponúka <code>RunnableWithMessageHistory</code> — históriu vedie automaticky podľa <code>session_id</code>. Stretneš sa s ním v lekcii 19.' }
  ],
  quiz: [
    { q: 'Čo robí MessagesPlaceholder("chat_history") v prompte?',
      opts: ['Maže históriu', 'Rezervuje miesto, kam sa pri invoke() vloží zoznam správ histórie', 'Ukladá históriu na disk', 'Obmedzuje dĺžku odpovede'],
      correct: 1, explain: 'Placeholder sa pri volaní nahradí správami zo zoznamu, ktorý pošleš pod jeho názvom — model tak vidí celú konverzáciu.' },
    { q: 'Čo treba urobiť po každej výmene otázka–odpoveď?',
      opts: ['Reštartovať chain', 'Pridať HumanMessage(otázka) a AIMessage(odpoveď) do histórie', 'Zavolať model.save()', 'Vymazať starý prompt'],
      correct: 1, explain: 'Históriu si vedieme sami: append oboch správ zabezpečí, že ďalšie volanie uvidí aj túto výmenu.' },
    { q: 'Prečo môže byť veľmi dlhá konverzácia problém?',
      opts: ['Python nezvládne dlhý zoznam', 'Celá história sa posiela pri každom volaní — rastie cena aj riziko prekročenia kontextu', 'Model si pamätá maximálne 5 správ', 'História sa po hodine maže'],
      correct: 1, explain: 'Tokeny histórie platíš pri každom volaní znova. Bežné riešenie: okno posledných N správ alebo sumarizácia starších.' }
  ],
  exercises: [
    { t: 'blanks', title: 'Pridaj botovi pamäť', xp: 20,
      intro: 'Doplň pamäťové časti chatbota.',
      code: `prompt = ChatPromptTemplate.from_messages([
    ("system", "Si asistent."),
    ⟦0⟧("chat_history"),
    ("human", "{otazka}"),
])

historia = []

odpoved = chain.invoke({"⟦1⟧": historia, "otazka": otazka})

historia.append(⟦2⟧(content=otazka))
historia.append(⟦3⟧(content=odpoved))`,
      blanks: [['MessagesPlaceholder'], ['chat_history'], ['HumanMessage'], ['AIMessage']],
      hint: 'Miesto na históriu rezervuje MessagesPlaceholder. Kľúč v invoke musí sedieť s jeho názvom. Otázka = HumanMessage, odpoveď = AIMessage.' },
    { t: 'order', title: 'Jeden obeh bota s pamäťou', xp: 20,
      intro: 'Zoraď kroky jednej výmeny v slučke chatbota s pamäťou.',
      items: [
        'input() prečíta novú otázku',
        'chain.invoke dostane chat_history aj otázku',
        'Prompt poskladá: system + história + nová otázka',
        'Model odpovie so znalosťou celej konverzácie',
        'Do histórie sa pridá HumanMessage aj AIMessage' ] },
    { t: 'write', title: 'Pamätlivý bot — celý kód', xp: 30,
      intro: 'Posklad celého chatbota s pamäťou bez pozerania na lekciu.',
      task: 'Napíš chatbota: prompt so system správou, <code>MessagesPlaceholder("chat_history")</code> a human <code>{otazka}</code>; prázdny zoznam <code>historia</code>; slučka <code>while True</code> s ukončením na „koniec"; po každej odpovedi <code>append</code> oboch správ.',
      starter: `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage
from langchain_core.output_parsers import StrOutputParser

load_dotenv()
# tvoj kód...`,
      must: [['MessagesPlaceholder'], ['chat_history'], ['while True'], ['HumanMessage(content='], ['AIMessage(content='], ['append']],
      hint: 'Skopíruj štruktúru z lekcie: prompt s placeholderom → chain → historia = [] → slučka: invoke s oboma kľúčmi → dva appendy.',
      solution: `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage
from langchain_core.output_parsers import StrOutputParser

load_dotenv()

prompt = ChatPromptTemplate.from_messages([
    ("system", "Si stručný asistent."),
    MessagesPlaceholder("chat_history"),
    ("human", "{otazka}"),
])
chain = prompt | ChatOpenAI(model="gpt-4o-mini") | StrOutputParser()

historia = []
while True:
    otazka = input("Ty: ")
    if otazka.lower() == "koniec":
        break
    odpoved = chain.invoke({"chat_history": historia, "otazka": otazka})
    print("Bot:", odpoved)
    historia.append(HumanMessage(content=otazka))
    historia.append(AIMessage(content=odpoved))` }
  ]
};

/* ============================================================
   LEKCIA 18 — RAG ChatBot
   ============================================================ */
window.COURSE.lessons.l18 = {
  id: 'l18', num: 18, section: 's3', icon: '📖', duration: '6 min',
  title: 'RAG ChatBot — rozhovor o dokumentoch',
  intro: 'Spojme dve veľké témy kurzu: chatovaciu slučku zo sekcie 3 a RAG chain zo sekcie 2. Výsledok? Bot, ktorý odpovedá na otázky z TVOJICH dokumentov — najžiadanejšia AI aplikácia vo firmách.',
  goals: [
    'Zapojiť create_retrieval_chain do konverzačnej slučky',
    'Vypísať odpoveď aj zdrojové dokumenty',
    'Ošetriť otázky, na ktoré dokumenty nemajú odpoveď'
  ],
  blocks: [
    { t: 'h', x: 'Architektúra: slučka okolo RAG chainu' },
    { t: 'p', x: 'Všetko už poznáš — len to poskladáme. Pred slučkou pripravíme databázu, retriever a RAG chain (lekcia 15). V slučke potom každú otázku posielame do <code>rag_chain.invoke({"input": ...})</code> a vypíšeme <code>answer</code> aj zdroje z <code>context</code>:' },
    { t: 'pycharm', title: 'rag_chatbot.py — bot nad smernicami', files: [
      { name: 'rag_chatbot.py', active: true, code: `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_chroma import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains import create_retrieval_chain

load_dotenv()

# 1) RAG zostava (lekcie 14 + 15)
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
db = Chroma(persist_directory="./chroma_db", embedding_function=embeddings)
retriever = db.as_retriever(search_kwargs={"k": 3})

model = ChatOpenAI(model="gpt-4o-mini", temperature=0)
prompt = ChatPromptTemplate.from_messages([
    ("system", "Si HR asistent. Odpovedaj IBA z kontextu. Ak odpoveď "
               "nie je v kontexte, povedz: 'V smerniciach som to nenašiel.'"
               "\\n\\nKontext:\\n{context}"),
    ("human", "{input}"),
])

rag_chain = create_retrieval_chain(
    retriever, create_stuff_documents_chain(model, prompt)
)

# 2) Chatovacia slučka (lekcia 16)
print("HR Bot: Pýtaj sa na firemné smernice. ('koniec' = ukončenie)")
while True:
    otazka = input("Ty: ")
    if otazka.lower() == "koniec":
        break
    vysledok = rag_chain.invoke({"input": otazka})
    print("Bot:", vysledok["answer"])
    zdroje = {d.metadata["source"] for d in vysledok["context"]}
    print("   📎 zdroje:", ", ".join(zdroje))` }
    ], output: `HR Bot: Pýtaj sa na firemné smernice. ('koniec' = ukončenie)
Ty: Koľko dní dovolenky mám?
Bot: Máš nárok na 25 dní dovolenky ročne.
   📎 zdroje: smernica.txt
Ty: Aká je politika home office?
Bot: V smerniciach som to nenašiel.
   📎 zdroje: smernica.txt
Ty: koniec`,
      note: 'Všimni si druhú otázku: dokumenty o home office nič nemajú a bot to vďaka system promptu čestne priznal — nehalucinoval. Zdroje vypisujeme zo setu, aby sa neopakovali.' },
    { t: 'box', kind: 'key', title: 'Vzor „indexuj raz, pýtaj sa veľakrát"', x: 'Indexovanie (vytvorenie ./chroma_db) má bežať v <strong>samostatnom skripte</strong>, nie pri každom štarte bota. Bot databázu len otvára — štart je okamžitý a neplatíš za opakované embedovanie.' },
    { t: 'box', kind: 'warn', title: 'Tento bot stále nemá pamäť!', x: 'Skús: „Koľko dní dovolenky mám?" → „25" → <strong>„A môžem si ich preniesť?"</strong> — retriever dostane len „A môžem si ich preniesť?" bez kontextu, že reč je o dovolenke. Nájde zlé chunky. Riešenie tohto záludného problému je obsahom nasledujúcej lekcie.' }
  ],
  quiz: [
    { q: 'Z ktorých dvoch častí sa skladá RAG chatbot?',
      opts: ['Agent + nástroje', 'RAG chain (retriever + dokumentový chain) + konverzačná slučka', 'Dva modely', 'Databáza + frontend'],
      correct: 1, explain: 'Pred slučkou postavíš RAG chain, v slučke ho voláš s každou otázkou. Architektúry z lekcií 15 a 16 sa jednoducho spoja.' },
    { q: 'Prečo má indexovanie bežať oddelene od bota?',
      opts: ['Inak Chroma nefunguje', 'Bot len otvára hotovú databázu — štart je rýchly a neplatíš opakované embedovanie', 'Kvôli bezpečnosti', 'Indexovanie vyžaduje iný Python'],
      correct: 1, explain: 'from_documents (indexovanie) spusti raz v samostatnom skripte. Bot používa Chroma(persist_directory=...) — len otvorenie z disku.' },
    { q: 'Ako bot zistí, že odpoveď v dokumentoch nie je?',
      opts: ['Retriever vráti chybu', 'Nájdený kontext otázke nezodpovedá a system prompt prikazuje priznať „nenašiel som"', 'OpenAI to zakáže', 'Bot to nezistí nikdy'],
      correct: 1, explain: 'Inštrukcia „odpovedaj IBA z kontextu, inak povedz že nevieš" + irelevantný kontext = čestná odpoveď namiesto halucinácie.' },
    { q: 'Odkiaľ vezmeš zoznam zdrojov pre citácie?',
      opts: ['Z vysledok["sources"]', 'Z metadát dokumentov vo vysledok["context"]', 'Z odpovede modelu', 'Zo súboru log.txt'],
      correct: 1, explain: 'create_retrieval_chain vracia použité Documenty v "context" — každý nesie metadata["source"] z loadera.' }
  ],
  exercises: [
    { t: 'blanks', title: 'Slučka RAG bota', xp: 20,
      intro: 'Doplň konverzačnú slučku nad RAG chainom s výpisom zdrojov.',
      code: `while True:
    otazka = input("Ty: ")
    if otazka.lower() == "koniec":
        break

    vysledok = rag_chain.⟦0⟧({"⟦1⟧": otazka})

    print("Bot:", vysledok["⟦2⟧"])
    for d in vysledok["⟦3⟧"]:
        print("   zdroj:", d.metadata["source"])`,
      blanks: [['invoke'], ['input'], ['answer'], ['context']],
      hint: 'RAG chain má pevné kľúče: vstup "input", odpoveď "answer", dokumenty "context".' },
    { t: 'order', title: 'Štart RAG chatbota', xp: 20,
      intro: 'Zoraď inicializáciu aplikácie od importov po slučku.',
      items: [
        'Načítaj .env a vytvor OpenAIEmbeddings',
        'Otvor existujúcu Chroma databázu z disku',
        'Vyrob retriever cez as_retriever',
        'Postav prompt s {context} a {input}',
        'Zlož rag_chain (stuff + retrieval chain)',
        'Spusti while True slučku s invoke' ] },
    { t: 'write', title: 'Bot zákazníckej podpory', xp: 30,
      intro: 'Finálna mini aplikácia tejto lekcie.',
      task: 'Napíš RAG chatbota podpory e-shopu: otvor databázu <code>./eshop_db</code>, retriever s <code>k=3</code>, system prompt s pravidlom „odpovedaj len z kontextu", RAG chain a slučku, ktorá vypisuje <code>answer</code>.',
      starter: `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_chroma import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains import create_retrieval_chain

load_dotenv()
# tvoj kód...`,
      must: [['persist_directory'], ['as_retriever'], ['{context}'], ['create_retrieval_chain'], ['while True'], ['["answer"]']],
      hint: 'db = Chroma(persist_directory="./eshop_db", embedding_function=embeddings) → retriever → prompt → chainy → slučka s invoke({"input": otazka}).',
      solution: `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_chroma import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains import create_retrieval_chain

load_dotenv()

embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
db = Chroma(persist_directory="./eshop_db", embedding_function=embeddings)
retriever = db.as_retriever(search_kwargs={"k": 3})

model = ChatOpenAI(model="gpt-4o-mini", temperature=0)
prompt = ChatPromptTemplate.from_messages([
    ("system", "Si podpora e-shopu. Odpovedaj len z kontextu:\\n{context}"),
    ("human", "{input}"),
])
rag_chain = create_retrieval_chain(
    retriever, create_stuff_documents_chain(model, prompt)
)

while True:
    otazka = input("Ty: ")
    if otazka.lower() == "koniec":
        break
    print("Bot:", rag_chain.invoke({"input": otazka})["answer"])` }
  ]
};

/* ============================================================
   LEKCIA 19 — RAG ChatBot s pamäťou
   ============================================================ */
window.COURSE.lessons.l19 = {
  id: 'l19', num: 19, section: 's3', icon: '🚀', duration: '12 min',
  title: 'RAG ChatBot s pamäťou',
  intro: 'Najdlhšia a najdôležitejšia lekcia kurzu. Vyriešime záludný problém nadväzujúcich otázok („A môžem si ich preniesť?") a postavíme plnohodnotného chatbota: pamätá si konverzáciu A odpovedá z dokumentov. Toto je architektúra skutočných produkčných botov.',
  goals: [
    'Pochopiť problém nadväzujúcich otázok pri RAG',
    'Použiť create_history_aware_retriever na preformulovanie otázky',
    'Spojiť históriu, retriever a dokumentový chain do jednej architektúry',
    'Postaviť kompletného produkčného RAG chatbota s pamäťou'
  ],
  blocks: [
    { t: 'h', x: 'Problém: retriever nevidí históriu' },
    { t: 'p', x: 'Konverzácia: <em>„Koľko dní dovolenky mám?"</em> → bot odpovie → <em>„A môžem si ich preniesť?"</em>. Druhá otázka putuje do retrievera — lenže ten v nej nevidí slovo „dovolenka"! Slovo „ich" je pre vektorové vyhľadávanie bezcenné. Retriever nájde nesprávne chunky a bot odpovie od veci.' },
    { t: 'box', kind: 'key', title: 'Riešenie: preformuluj otázku PRED vyhľadávaním', x: 'Pred retrieval krokom požiadame model: „Tu je história konverzácie a nová otázka. <strong>Preformuluj ju na samostatnú otázku</strong>, ktorá dáva zmysel bez histórie." Z „A môžem si ich preniesť?" vznikne „Môžem si preniesť nevyčerpané dni dovolenky?" — a tá už nájde správne chunky. Presne toto robí <code>create_history_aware_retriever</code>.' },
    { t: 'flow', steps: ['❓ „A môžem si ich preniesť?"', '🧠 LLM + história<br><small>preformulovanie</small>', '🔁 „Môžem si preniesť dni dovolenky?"', '🎣 Retriever<br><small>nájde správne chunky</small>', '📝 Prompt<br><small>kontext + história + otázka</small>', '✅ Odpoveď'] },
    { t: 'h', x: 'Kompletná aplikácia' },
    { t: 'p', x: 'Architektúra má tri vrstvy: <strong>(1)</strong> history-aware retriever (preformulovanie + vyhľadanie), <strong>(2)</strong> dokumentový chain s históriou v prompte, <strong>(3)</strong> slučka, ktorá vedie históriu. Tu je celý kód — ber ho ako vzor pre vlastné projekty:' },
    { t: 'pycharm', title: 'rag_memory_bot.py — produkčná architektúra', files: [
      { name: 'rag_memory_bot.py', active: true, code: `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_chroma import Chroma
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains import create_retrieval_chain, create_history_aware_retriever

load_dotenv()

embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
db = Chroma(persist_directory="./chroma_db", embedding_function=embeddings)
retriever = db.as_retriever(search_kwargs={"k": 3})
model = ChatOpenAI(model="gpt-4o-mini", temperature=0)

# ── 1) History-aware retriever: preformuluje otázku podľa histórie
preformuluj_prompt = ChatPromptTemplate.from_messages([
    MessagesPlaceholder("chat_history"),
    ("human", "{input}"),
    ("human", "Preformuluj otázku vyššie na samostatnú otázku, "
              "ktorá dáva zmysel bez histórie. Iba otázku, nič viac."),
])
ha_retriever = create_history_aware_retriever(model, retriever, preformuluj_prompt)

# ── 2) Dokumentový chain: odpovedá z kontextu + vidí históriu
qa_prompt = ChatPromptTemplate.from_messages([
    ("system", "Si HR asistent. Odpovedaj IBA z kontextu.\\n\\n{context}"),
    MessagesPlaceholder("chat_history"),
    ("human", "{input}"),
])
rag_chain = create_retrieval_chain(
    ha_retriever, create_stuff_documents_chain(model, qa_prompt)
)

# ── 3) Slučka s históriou
historia = []
print("Bot: Pýtaj sa na smernice. ('koniec' = ukončenie)")
while True:
    otazka = input("Ty: ")
    if otazka.lower() == "koniec":
        break

    vysledok = rag_chain.invoke({"input": otazka, "chat_history": historia})
    print("Bot:", vysledok["answer"])

    historia.append(HumanMessage(content=otazka))
    historia.append(AIMessage(content=vysledok["answer"]))` }
    ], output: `Bot: Pýtaj sa na smernice. ('koniec' = ukončenie)
Ty: Koľko dní dovolenky mám?
Bot: Máš nárok na 25 dní dovolenky ročne.
Ty: A môžem si ich preniesť do ďalšieho roka?
Bot: Áno, nevyčerpané dni si môžeš preniesť, maximálne však do 31. marca nasledujúceho roka.
Ty: koniec`,
      note: 'Druhá otázka „A môžem si ich preniesť?" zafungovala dokonale — history-aware retriever ju interne preformuloval, našiel chunky o prenose dovolenky a model odpovedal presne. Toto je tá mágia!' },
    { t: 'h', x: 'Prečo história figuruje na DVOCH miestach?' },
    { t: 'ul', items: [
      '<strong>V preformulovacom prompte</strong> — aby model pochopil, na čo sa „ich" odkazuje, a vyrobil samostatnú otázku pre vyhľadávanie.',
      '<strong>V QA prompte</strong> — aby finálna odpoveď nadväzovala na konverzáciu (tón, súvislosti, „ako som vravel…").'
    ]},
    { t: 'box', kind: 'info', title: 'Škálovanie: RunnableWithMessageHistory', x: 'Pre web aplikáciu s mnohými používateľmi zabal chain do <code>RunnableWithMessageHistory</code> — históriu spravuje automaticky podľa <code>session_id</code> (každý používateľ má vlastnú). Princíp je rovnaký, len zoznam histórie nedržíš ručne.' },
    { t: 'box', kind: 'tip', title: 'Gratulujem — toto je vrchol kurzu', x: 'Architektúru z tejto lekcie (loader → splitter → embeddingy → Chroma → history-aware retriever → QA chain → slučka) používajú reálne firemné aplikácie. V záverečnom projekte si ju postavíš celú sám a v lekcii 20 jej dáme webové rozhranie.' }
  ],
  quiz: [
    { q: 'Prečo otázka „A môžem si ich preniesť?" rozbije obyčajný RAG?',
      opts: ['Je príliš krátka', 'Retriever bez histórie nevie, na čo sa „ich" odkazuje — nájde nesprávne chunky', 'Obsahuje zakázané slovo', 'Model nerozumie slovenčine'],
      correct: 1, explain: 'Vektorové vyhľadávanie vidí len text otázky. Zámeno „ich" bez kontextu histórie nemá význam — podobnosť nájde úplne iné dokumenty.' },
    { q: 'Čo robí create_history_aware_retriever?',
      opts: ['Ukladá históriu do databázy', 'Pred vyhľadávaním nechá model preformulovať otázku podľa histórie na samostatnú', 'Maže staré dokumenty', 'Zrýchľuje retrieval'],
      correct: 1, explain: 'Je to retriever s predkrokom: LLM dostane históriu + novú otázku a vráti samostatnú formuláciu; až tá ide do vektorového vyhľadávania.' },
    { q: 'Prečo je história v dvoch promptoch (preformulovacom aj QA)?',
      opts: ['Je to chyba v kóde', 'Prvý ju potrebuje na preformulovanie otázky, druhý na plynulú nadväznosť odpovede', 'Kvôli zálohe', 'História musí byť všade'],
      correct: 1, explain: 'Preformulovací prompt rieši vyhľadávanie (rozviazanie zámen), QA prompt rieši kvalitu konverzácie (model vie, čo už zaznelo).' },
    { q: 'Čo posielaš do rag_chain.invoke() pri bote s pamäťou?',
      opts: ['Len {"input": otázka}', '{"input": otázka, "chat_history": historia}', '{"question": otázka}', 'Celú databázu'],
      correct: 1, explain: 'Chain potrebuje oboje: input pre aktuálnu otázku a chat_history pre preformulovanie aj nadväznosť.' },
    { q: 'Na čo slúži RunnableWithMessageHistory?',
      opts: ['Na výpis histórie do konzoly', 'Automaticky spravuje históriu podľa session_id — pre aplikácie s viacerými používateľmi', 'Maže históriu po každej správe', 'Šifruje konverzácie'],
      correct: 1, explain: 'Namiesto ručného zoznamu vedie históriu úložisko podľa session_id — každý používateľ má oddelenú konverzáciu.' }
  ],
  exercises: [
    { t: 'blanks', title: 'History-aware retriever', xp: 20,
      intro: 'Doplň srdce dnešnej architektúry.',
      code: `preformuluj_prompt = ChatPromptTemplate.from_messages([
    MessagesPlaceholder("⟦0⟧"),
    ("human", "{input}"),
    ("human", "Preformuluj otázku na samostatnú."),
])

ha_retriever = ⟦1⟧(model, retriever, preformuluj_prompt)

rag_chain = create_retrieval_chain(
    ⟦2⟧, create_stuff_documents_chain(model, qa_prompt)
)

vysledok = rag_chain.invoke({"input": otazka, "⟦3⟧": historia})`,
      blanks: [['chat_history'], ['create_history_aware_retriever'], ['ha_retriever'], ['chat_history']],
      hint: 'Placeholder aj kľúč v invoke sa volajú chat_history. Staviteľ je create_history_aware_retriever a do retrieval chainu vstupuje hotový ha_retriever.' },
    { t: 'order', title: 'Celý tok otázky s pamäťou', xp: 20,
      intro: 'Zoraď, čo sa deje s nadväzujúcou otázkou „A môžem si ich preniesť?".',
      items: [
        'Používateľ napíše nadväzujúcu otázku so zámenom',
        'Model dostane históriu a otázku preformuluje na samostatnú',
        'Retriever nájde chunky k preformulovanej otázke',
        'QA prompt dostane kontext + históriu + pôvodnú otázku',
        'Model vygeneruje nadväzujúcu odpoveď z kontextu',
        'Výmena sa pridá do histórie pre ďalšie kolo' ] },
    { t: 'write', title: 'Mini verzia produkčného bota', xp: 30,
      intro: 'Zlatý klinec sekcie — over si, že architektúru vieš poskladať.',
      task: 'Napíš jadro RAG bota s pamäťou: preformulovací prompt (placeholder <code>chat_history</code> + <code>{input}</code>), <code>create_history_aware_retriever</code>, QA prompt s <code>{context}</code> + históriou, <code>create_retrieval_chain</code> a jedno volanie <code>invoke</code> s otázkou aj históriou.',
      starter: `# model, retriever a importy už máš k dispozícii
from langchain.chains import create_retrieval_chain, create_history_aware_retriever
from langchain.chains.combine_documents import create_stuff_documents_chain

historia = []
# tvoj kód...`,
      must: [['MessagesPlaceholder'], ['create_history_aware_retriever'], ['{context}'], ['create_retrieval_chain'], ['chat_history']],
      hint: 'Dva prompty (preformulovací a QA), oba s MessagesPlaceholder("chat_history"). ha_retriever vlož ako prvý argument create_retrieval_chain.',
      solution: `from langchain.chains import create_retrieval_chain, create_history_aware_retriever
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

historia = []

preformuluj = ChatPromptTemplate.from_messages([
    MessagesPlaceholder("chat_history"),
    ("human", "{input}"),
    ("human", "Preformuluj otázku na samostatnú. Iba otázku."),
])
ha_retriever = create_history_aware_retriever(model, retriever, preformuluj)

qa_prompt = ChatPromptTemplate.from_messages([
    ("system", "Odpovedaj iba z kontextu:\\n{context}"),
    MessagesPlaceholder("chat_history"),
    ("human", "{input}"),
])
rag_chain = create_retrieval_chain(
    ha_retriever, create_stuff_documents_chain(model, qa_prompt)
)

vysledok = rag_chain.invoke({"input": "A môžem si ich preniesť?",
                             "chat_history": historia})
print(vysledok["answer"])` }
  ]
};
