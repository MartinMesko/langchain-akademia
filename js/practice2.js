/* ============================================================
   EXTRA „NAPÍŠ KÓD" CVIČENIA — časť 2 (l10–l20)
   ============================================================ */
(function () {
  const W = (title, task, starter, must, hint, solution) =>
    ({ t: 'write', title, task, starter, must, hint, solution });

  window.EXTRA_WRITE = window.EXTRA_WRITE || {};

  /* ── l10: RAG koncept (čistý Python, bez API) ── */
  window.EXTRA_WRITE.l10 = [
    W('Pipeline ako zoznam',
      'Vytvor zoznam <code>pipeline</code> s krokmi indexovania („načítaj", „rozdeľ", „embeduj", „ulož") a cyklom ich vypíš očíslované cez <code>enumerate</code>.',
      `# tvoj kód...`,
      [['pipeline = ['], ['enumerate('], ['for ']],
      'for i, krok in enumerate(pipeline, start=1): print(f"{i}. {krok}").',
      `pipeline = ["načítaj", "rozdeľ", "embeduj", "ulož"]
for i, krok in enumerate(pipeline, start=1):
    print(f"{i}. {krok}")`),
    W('Dve fázy v slovníku',
      'Vytvor slovník <code>fazy</code> s kľúčmi <code>"indexovanie"</code> a <code>"dopyt"</code> — hodnoty sú zoznamy krokov. Vypíš kroky oboch fáz cyklom cez <code>.items()</code>.',
      `# tvoj kód...`,
      [['fazy = {'], ['"indexovanie"', "'indexovanie'"], ['.items()'], ['for ']],
      'for nazov, kroky in fazy.items(): print(nazov, kroky).',
      `fazy = {
    "indexovanie": ["načítaj", "rozdeľ", "embeduj", "ulož"],
    "dopyt": ["otázka", "vyhľadaj", "prompt", "odpoveď"],
}
for nazov, kroky in fazy.items():
    print(f"{nazov}: {kroky}")`),
    W('RAG či fine-tuning?',
      'Napíš funkciu <code>co_pouzit(poziadavka)</code>: ak text obsahuje „štýl" alebo „tón", vráť „fine-tuning", inak „RAG". Otestuj na dvoch požiadavkách.',
      `# tvoj kód...`,
      [['def co_pouzit'], ['in poziadavka'], ['return "fine-tuning"', "return 'fine-tuning'"], ['return "RAG"', "return 'RAG'"]],
      'if "štýl" in poziadavka or "tón" in poziadavka: → fine-tuning. Znalosti = RAG, správanie = fine-tuning.',
      `def co_pouzit(poziadavka):
    if "štýl" in poziadavka or "tón" in poziadavka:
        return "fine-tuning"
    return "RAG"

print(co_pouzit("bot má odpovedať z našich smerníc"))
print(co_pouzit("bot má písať v štýle našej značky"))`),
    W('Mini retriever',
      'Napíš funkciu <code>najdi(otazka, dokumenty)</code>, ktorá vráti zoznam dokumentov obsahujúcich aspoň jedno slovo z otázky (case-insensitive cez <code>.lower()</code>).',
      `dokumenty = [
    "Dovolenka je 25 dní ročne.",
    "Faktúry sa platia do 14 dní.",
    "Home office max 3 dni v týždni.",
]
# tvoj kód...`,
      [['def najdi'], ['.lower()'], ['for '], ['.append(', ' if ']],
      'Rozbi otázku na slová (.split()), pre každý dokument over, či niektoré slovo je v texte.',
      `dokumenty = [
    "Dovolenka je 25 dní ročne.",
    "Faktúry sa platia do 14 dní.",
    "Home office max 3 dni v týždni.",
]

def najdi(otazka, dokumenty):
    slova = otazka.lower().split()
    vysledky = []
    for d in dokumenty:
        if any(slovo in d.lower() for slovo in slova):
            vysledky.append(d)
    return vysledky

print(najdi("koľko dovolenka", dokumenty))`),
    W('RAG šablóna',
      'Zostav <code>ChatPromptTemplate</code> presne v RAG tvare: system s okienkom <code>{context}</code> („Odpovedaj IBA z kontextu: {context}") a human s <code>{input}</code>. Vypíš vyplnenú verziu.',
      `from langchain_core.prompts import ChatPromptTemplate
# tvoj kód...`,
      [['{context}'], ['{input}'], ['.invoke(']],
      'invoke({"context": "…", "input": "…"}) — presne tieto dva kľúče používa create_retrieval_chain.',
      `from langchain_core.prompts import ChatPromptTemplate

prompt = ChatPromptTemplate.from_messages([
    ("system", "Odpovedaj IBA z kontextu: {context}"),
    ("human", "{input}"),
])
print(prompt.invoke({
    "context": "Dovolenka je 25 dní.",
    "input": "Koľko mám dovolenky?",
}))`),
    W('Zlepenie kontextu',
      'Zoznam <code>najdene</code> obsahuje 3 texty. Zlep ich do jedného kontextu cez <code>"\\n\\n".join(najdene)</code> a vypíš.',
      `najdene = [
    "Dovolenka je 25 dní ročne.",
    "Prenos dovolenky do 31. marca.",
    "Sick days: 5 dní.",
]
# tvoj kód...`,
      [['.join(najdene)', '.join( najdene'], ['print(']],
      'kontext = "\\n\\n".join(najdene) — presne toto robí „stuff" stratégia v RAG chaine.',
      `najdene = [
    "Dovolenka je 25 dní ročne.",
    "Prenos dovolenky do 31. marca.",
    "Sick days: 5 dní.",
]
kontext = "\\n\\n".join(najdene)
print(kontext)`),
    W('Simulovaný RAG dopyt',
      'Spoj kúsky: <code>najdi()</code> nájde dokumenty, <code>join</code> ich zlepí do kontextu a f-string poskladá finálny prompt „Kontext: … Otázka: …". Vypíš ho.',
      `dokumenty = [
    "Dovolenka je 25 dní ročne.",
    "Faktúry sa platia do 14 dní.",
]
def najdi(otazka, dokumenty):
    slova = otazka.lower().split()
    return [d for d in dokumenty if any(s in d.lower() for s in slova)]
# tvoj kód...`,
      [['najdi('], ['.join('], ['Kontext'], ['Otázka', 'Otazka']],
      'najdene = najdi(...) → kontext = "\\n".join(najdene) → prompt = f"Kontext: {kontext}\\nOtázka: {otazka}".',
      `dokumenty = [
    "Dovolenka je 25 dní ročne.",
    "Faktúry sa platia do 14 dní.",
]
def najdi(otazka, dokumenty):
    slova = otazka.lower().split()
    return [d for d in dokumenty if any(s in d.lower() for s in slova)]

otazka = "koľko dovolenka"
najdene = najdi(otazka, dokumenty)
kontext = "\\n".join(najdene)
prompt = f"Kontext: {kontext}\\nOtázka: {otazka}"
print(prompt)`),
    W('Poistka proti halucinácii',
      'Rozšír simuláciu: ak <code>najdi()</code> nič nenájde (prázdny zoznam), vypíš „V dokumentoch sa to nenachádza." namiesto skladania promptu.',
      `dokumenty = ["Dovolenka je 25 dní ročne."]
def najdi(otazka, dokumenty):
    slova = otazka.lower().split()
    return [d for d in dokumenty if any(s in d.lower() for s in slova)]
# tvoj kód...`,
      [['najdi('], ['if not ', 'len('], ['nenachádza', 'nenachadza']],
      'if not najdene: print("V dokumentoch sa to nenachádza.") — prázdny zoznam je v if nepravda.',
      `dokumenty = ["Dovolenka je 25 dní ročne."]
def najdi(otazka, dokumenty):
    slova = otazka.lower().split()
    return [d for d in dokumenty if any(s in d.lower() for s in slova)]

otazka = "parkovanie vesmírnych lodí"
najdene = najdi(otazka, dokumenty)
if not najdene:
    print("V dokumentoch sa to nenachádza.")
else:
    print("Kontext:", "\\n".join(najdene))`),
    W('Celá mini pipeline',
      'Poskladaj kompletnú simuláciu: „načítaj" text zo stringu, „rozsekaj" ho na kúsky po 40 znakov (výrezy v slučke <code>while</code> alebo cez range), „vyhľadaj" kúsky so slovom z otázky a vypíš report (počet kúskov + nájdené).',
      `text = ("Dovolenka je 25 dní ročne. Prenos do 31. marca. "
        "Faktúry sa platia do 14 dní. Home office 3 dni v týždni.")
# tvoj kód...`,
      [['range('], ['[i:i + 40]', '[i:i+40]'], ['for '], ['len(']],
      'chunky = [text[i:i+40] for i in range(0, len(text), 40)] — a potom filter cez in.',
      `text = ("Dovolenka je 25 dní ročne. Prenos do 31. marca. "
        "Faktúry sa platia do 14 dní. Home office 3 dni v týždni.")

chunky = [text[i:i + 40] for i in range(0, len(text), 40)]
print("Počet kúskov:", len(chunky))

otazka = "faktúry"
najdene = [ch for ch in chunky if otazka in ch.lower()]
print("Nájdené:", najdene)`),
  ];

  /* ── l11: loaders ── */
  window.EXTRA_WRITE.l11 = [
    W('Načítaj a spočítaj',
      'Cez <code>TextLoader</code> načítaj súbor <code>"poznamky.txt"</code> a vypíš počet dokumentov cez <code>len()</code>.',
      `from langchain_community.document_loaders import TextLoader
# tvoj kód...`,
      [['TextLoader('], ['encoding="utf-8"', "encoding='utf-8'"], ['.load()'], ['len(']],
      'loader = TextLoader("poznamky.txt", encoding="utf-8") → dokumenty = loader.load() → print(len(dokumenty)).',
      `from langchain_community.document_loaders import TextLoader

loader = TextLoader("poznamky.txt", encoding="utf-8")
dokumenty = loader.load()
print(len(dokumenty))`),
    W('Ukážka obsahu',
      'Načítaj súbor a vypíš prvých 100 znakov obsahu prvého dokumentu (<code>page_content[:100]</code>).',
      `from langchain_community.document_loaders import TextLoader

dokumenty = TextLoader("poznamky.txt", encoding="utf-8").load()
# tvoj kód...`,
      [['page_content'], ['[:100]']],
      'print(dokumenty[0].page_content[:100]) — výrez chráni konzolu pred záplavou textu.',
      `from langchain_community.document_loaders import TextLoader

dokumenty = TextLoader("poznamky.txt", encoding="utf-8").load()
print(dokumenty[0].page_content[:100])`),
    W('Štítok dokumentu',
      'Vypíš <code>metadata</code> prvého dokumentu a ZVLÁŠŤ hodnotu pod kľúčom <code>"source"</code>.',
      `from langchain_community.document_loaders import TextLoader

dokumenty = TextLoader("poznamky.txt", encoding="utf-8").load()
# tvoj kód...`,
      [['.metadata'], ['["source"]', "['source']"]],
      'metadata je obyčajný slovník: dokumenty[0].metadata["source"].',
      `from langchain_community.document_loaders import TextLoader

dokumenty = TextLoader("poznamky.txt", encoding="utf-8").load()
print(dokumenty[0].metadata)
print(dokumenty[0].metadata["source"])`),
    W('Vyrob a načítaj',
      'Najprv VYTVOR súbor <code>"test.txt"</code> cez <code>open(..., "w", encoding="utf-8")</code> s ľubovoľným textom — a hneď ho načítaj TextLoaderom a vypíš obsah.',
      `from langchain_community.document_loaders import TextLoader
# tvoj kód...`,
      [['open('], ['"w"', "'w'"], ['.write('], ['TextLoader('], ['page_content']],
      'with open("test.txt", "w", encoding="utf-8") as f: f.write("...") → potom klasicky loader.',
      `from langchain_community.document_loaders import TextLoader

with open("test.txt", "w", encoding="utf-8") as f:
    f.write("LangChain sa učím v akadémii. Ide mi to skvele!")

dokumenty = TextLoader("test.txt", encoding="utf-8").load()
print(dokumenty[0].page_content)`),
    W('Celý priečinok naraz',
      'Cez <code>DirectoryLoader</code> načítaj všetky <code>.txt</code> súbory z priečinka <code>"poznamky/"</code> (glob <code>**/*.txt</code>) a vypíš počet + zdroje.',
      `from langchain_community.document_loaders import DirectoryLoader, TextLoader
# tvoj kód...`,
      [['DirectoryLoader('], ['glob="**/*.txt"', "glob='**/*.txt'"], ['loader_cls=TextLoader'], ['for ']],
      'DirectoryLoader("poznamky/", glob="**/*.txt", loader_cls=TextLoader, loader_kwargs={"encoding": "utf-8"}).',
      `from langchain_community.document_loaders import DirectoryLoader, TextLoader

loader = DirectoryLoader("poznamky/", glob="**/*.txt",
                         loader_cls=TextLoader,
                         loader_kwargs={"encoding": "utf-8"})
dokumenty = loader.load()
print("Dokumentov:", len(dokumenty))
for d in dokumenty:
    print("•", d.metadata["source"])`),
    W('Súčet znakov knižnice',
      'Nad načítanými dokumentmi spočítaj CELKOVÝ počet znakov cez <code>sum()</code> s generátorom <code>len(d.page_content) for d in dokumenty</code>.',
      `# dokumenty máš načítané z predošlého cvičenia
# tvoj kód...`,
      [['sum('], ['len(d.page_content)'], ['for d in dokumenty']],
      'spolu = sum(len(d.page_content) for d in dokumenty) — cyklus priamo vo funkcii sum.',
      `spolu = sum(len(d.page_content) for d in dokumenty)
print(f"Knižnica má spolu {spolu} znakov")`),
    W('PDF so stranami',
      'Načítaj <code>"manual.pdf"</code> cez <code>PyPDFLoader</code>, vypíš počet strán a pri PRVEJ strane číslo strany z metadát (<code>metadata["page"]</code>).',
      `from langchain_community.document_loaders import PyPDFLoader
# tvoj kód...`,
      [['PyPDFLoader('], ['.load()'], ['["page"]', "['page']"]],
      'strany = PyPDFLoader("manual.pdf").load() → strany[0].metadata["page"] (čísluje od 0!).',
      `from langchain_community.document_loaders import PyPDFLoader

strany = PyPDFLoader("manual.pdf").load()
print("Strán:", len(strany))
print("Prvá strana má v metadátach page =", strany[0].metadata["page"])`),
    W('Web ako dokument',
      'Cez <code>WebBaseLoader</code> stiahni jednu URL a vypíš počet znakov stiahnutého textu.',
      `from langchain_community.document_loaders import WebBaseLoader
# tvoj kód...`,
      [['WebBaseLoader('], ['.load()'], ['len('], ['page_content']],
      'clanky = WebBaseLoader("https://...").load() → len(clanky[0].page_content).',
      `from langchain_community.document_loaders import WebBaseLoader

clanky = WebBaseLoader("https://blog.langchain.dev").load()
print("Znakov z webu:", len(clanky[0].page_content))`),
    W('Funkcia nacitaj_kniznicu()',
      'Napíš funkciu <code>nacitaj_kniznicu(priecinok)</code>: načíta .txt súbory DirectoryLoaderom, vypíše report (počet dokumentov + spolu znakov + najdlhší súbor cez <code>max</code> s <code>key=lambda</code>) a dokumenty vráti.',
      `from langchain_community.document_loaders import DirectoryLoader, TextLoader
# tvoj kód...`,
      [['def nacitaj_kniznicu'], ['DirectoryLoader('], ['sum('], ['max('], ['key=lambda'], ['return']],
      'najdlhsi = max(dokumenty, key=lambda d: len(d.page_content)) → jeho metadata["source"] do reportu.',
      `from langchain_community.document_loaders import DirectoryLoader, TextLoader

def nacitaj_kniznicu(priecinok):
    loader = DirectoryLoader(priecinok, glob="**/*.txt",
                             loader_cls=TextLoader,
                             loader_kwargs={"encoding": "utf-8"})
    dokumenty = loader.load()
    spolu = sum(len(d.page_content) for d in dokumenty)
    najdlhsi = max(dokumenty, key=lambda d: len(d.page_content))
    print(f"Dokumentov: {len(dokumenty)} | Znakov: {spolu}")
    print("Najdlhší:", najdlhsi.metadata["source"])
    return dokumenty

dokumenty = nacitaj_kniznicu("poznamky/")`),
  ];

  /* ── l12: splitters ── */
  window.EXTRA_WRITE.l12 = [
    W('Vyrob sekáčik',
      'Vytvor <code>RecursiveCharacterTextSplitter</code> s <code>chunk_size=300</code> a <code>chunk_overlap=50</code> a vypíš potvrdenie.',
      `from langchain_text_splitters import RecursiveCharacterTextSplitter
# tvoj kód...`,
      [['RecursiveCharacterTextSplitter('], ['chunk_size=300'], ['chunk_overlap=50']],
      'Dva pomenované parametre pri vytváraní — nič viac netreba.',
      `from langchain_text_splitters import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(chunk_size=300, chunk_overlap=50)
print("Sekáčik pripravený:", splitter)`),
    W('Rozsekaj dokumenty',
      'Načítané <code>dokumenty</code> rozsekaj cez <code>split_documents()</code> a vypíš, koľko chunkov vzniklo.',
      `from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

dokumenty = TextLoader("clanok.txt", encoding="utf-8").load()
splitter = RecursiveCharacterTextSplitter(chunk_size=300, chunk_overlap=50)
# tvoj kód...`,
      [['split_documents(dokumenty)', 'split_documents( dokumenty'], ['len(']],
      'chunky = splitter.split_documents(dokumenty) → print(len(chunky)).',
      `from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

dokumenty = TextLoader("clanok.txt", encoding="utf-8").load()
splitter = RecursiveCharacterTextSplitter(chunk_size=300, chunk_overlap=50)
chunky = splitter.split_documents(dokumenty)
print("Chunkov:", len(chunky))`),
    W('Sekanie stringu',
      'Rozsekaj OBYČAJNÝ string (nie Document) cez <code>split_text()</code> a vypíš výsledný zoznam.',
      `from langchain_text_splitters import RecursiveCharacterTextSplitter

text = "Prvý odsek o RAGu. " * 10 + "Druhý odsek o chunkoch. " * 10
splitter = RecursiveCharacterTextSplitter(chunk_size=100, chunk_overlap=20)
# tvoj kód...`,
      [['split_text(text)', 'split_text( text'], ['print(']],
      'kusky = splitter.split_text(text) — vráti zoznam STRINGOV (nie Documentov).',
      `from langchain_text_splitters import RecursiveCharacterTextSplitter

text = "Prvý odsek o RAGu. " * 10 + "Druhý odsek o chunkoch. " * 10
splitter = RecursiveCharacterTextSplitter(chunk_size=100, chunk_overlap=20)
kusky = splitter.split_text(text)
print(kusky)`),
    W('Prvé dva chunky s dĺžkami',
      'Vypíš prvé DVA chunky — každý s poradovým číslom a dĺžkou v znakoch (f-string + <code>len</code>).',
      `# chunky máš z predošlého cvičenia
# tvoj kód...`,
      [['chunky[:2]', 'chunky[0]'], ['len('], ['enumerate(', 'chunky[1]']],
      'for i, ch in enumerate(chunky[:2]): print(f"chunk {i} ({len(ch.page_content)} znakov)") — pri split_text bez .page_content.',
      `for i, ch in enumerate(chunky[:2]):
    print(f"--- chunk {i} ({len(ch)} znakov) ---")
    print(ch)`),
    W('Duel veľkostí',
      'Rozsekaj ten istý text DVOMA splittermi (200 vs. 800) a vypíš porovnanie počtu chunkov vedľa seba.',
      `from langchain_text_splitters import RecursiveCharacterTextSplitter

text = "Veta o umelej inteligencii a jej využití v praxi. " * 40
# tvoj kód...`,
      [['chunk_size=200'], ['chunk_size=800'], ['split_text('], ['len(']],
      'Dva splittery, dva split_text, dva printy — menší chunk_size = viac kúskov.',
      `from langchain_text_splitters import RecursiveCharacterTextSplitter

text = "Veta o umelej inteligencii a jej využití v praxi. " * 40

male = RecursiveCharacterTextSplitter(chunk_size=200, chunk_overlap=30).split_text(text)
velke = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=120).split_text(text)

print("chunk_size=200 →", len(male), "chunkov")
print("chunk_size=800 →", len(velke), "chunkov")`),
    W('Uvidieť prekrytie',
      'Vypíš posledných 50 znakov chunku č. 0 a prvých 50 znakov chunku č. 1 — prekrývajúci sa text uvidíš na vlastné oči.',
      `# kusky (zo split_text) máš z predošlých cvičení
# tvoj kód...`,
      [['[-50:]'], ['[:50]'], ['kusky[0]', 'chunky[0]']],
      'kusky[0][-50:] = koniec prvého; kusky[1][:50] = začiatok druhého. Spoločná časť = overlap.',
      `print("KONIEC chunku 0:  …", kusky[0][-50:])
print("ZAČIATOK chunku 1:", kusky[1][:50], "…")`),
    W('Priemerná dĺžka',
      'Spočítaj priemernú dĺžku chunku: <code>sum()</code> dĺžok delené <code>len()</code> počtu — zaokrúhli cez <code>round()</code>.',
      `# kusky máš z predošlých cvičení
# tvoj kód...`,
      [['sum('], ['len('], ['round(']],
      'priemer = round(sum(len(k) for k in kusky) / len(kusky)).',
      `priemer = round(sum(len(k) for k in kusky) / len(kusky))
print(f"Priemerná dĺžka chunku: {priemer} znakov")`),
    W('Funkcia rozsekaj()',
      'Napíš funkciu <code>rozsekaj(text, velkost)</code>: vytvorí splitter (overlap = 15 % veľkosti cez <code>int(velkost * 0.15)</code>), rozseká text a vráti kúsky. Otestuj s veľkosťou 250.',
      `from langchain_text_splitters import RecursiveCharacterTextSplitter
# tvoj kód...`,
      [['def rozsekaj'], ['int(velkost * 0.15)', 'int(velkost*0.15)'], ['split_text('], ['return']],
      'chunk_overlap=int(velkost * 0.15) — pravidlo 15 % z lekcie priamo v kóde.',
      `from langchain_text_splitters import RecursiveCharacterTextSplitter

def rozsekaj(text, velkost):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=velkost,
        chunk_overlap=int(velkost * 0.15),
    )
    return splitter.split_text(text)

kusky = rozsekaj("Dlhý text o RAGu. " * 60, 250)
print("Kúskov:", len(kusky))`),
    W('Tabuľka troch nastavení',
      'Cyklom cez zoznam <code>[200, 500, 1000]</code> rozsekaj ten istý text a vypíš riadok tabuľky: veľkosť → počet chunkov → priemerná dĺžka. Použi funkciu <code>rozsekaj</code>.',
      `# funkciu rozsekaj(text, velkost) máš z predošlého cvičenia
text = "Umelá inteligencia mení svet softvéru. " * 80
# tvoj kód...`,
      [['for '], ['[200, 500, 1000]'], ['rozsekaj('], ['sum('], ['round(']],
      'for v in [200, 500, 1000]: kusky = rozsekaj(text, v) → počet + priemer do f-stringu.',
      `text = "Umelá inteligencia mení svet softvéru. " * 80

print("veľkosť | chunkov | priemer")
for v in [200, 500, 1000]:
    kusky = rozsekaj(text, v)
    priemer = round(sum(len(k) for k in kusky) / len(kusky))
    print(f"{v:7} | {len(kusky):7} | {priemer:7}")`),
  ];

  /* ── l13: embeddings ── */
  window.EXTRA_WRITE.l13 = [
    W('Prvý vektor',
      'Vytvor <code>OpenAIEmbeddings</code> s modelom <code>text-embedding-3-small</code>, embedni jednu otázku cez <code>embed_query</code> a vypíš dĺžku vektora.',
      `from dotenv import load_dotenv
from langchain_openai import OpenAIEmbeddings

load_dotenv()
# tvoj kód...`,
      [['OpenAIEmbeddings('], ['text-embedding-3-small'], ['embed_query('], ['len(']],
      'vektor = embeddings.embed_query("...") → print(len(vektor)) → 1536.',
      `from dotenv import load_dotenv
from langchain_openai import OpenAIEmbeddings

load_dotenv()
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
vektor = embeddings.embed_query("Koľko dní dovolenky mám?")
print(len(vektor))`),
    W('Nakukni do vektora',
      'Embedni text a vypíš prvých 5 čísel vektora, zaokrúhlených na 4 miesta (list comprehension s <code>round</code>).',
      `# embeddings máš z predošlého cvičenia
# tvoj kód...`,
      [['embed_query('], ['[:5]'], ['round(']],
      'print([round(x, 4) for x in vektor[:5]]) — výrez + zaokrúhlenie.',
      `vektor = embeddings.embed_query("LangChain je super.")
print([round(x, 4) for x in vektor[:5]])`),
    W('Hromadné embedovanie',
      'Cez <code>embed_documents</code> embedni zoznam TROCH viet a vypíš, koľko vektorov sa vrátilo a akú majú dĺžku.',
      `# embeddings máš pripravené
vety = ["Pes šteká.", "Mačka mňauká.", "Auto trúbi."]
# tvoj kód...`,
      [['embed_documents(vety)', 'embed_documents( vety'], ['len(vektory)'], ['len(vektory[0])']],
      'vektory = embeddings.embed_documents(vety) → len(vektory) = 3, len(vektory[0]) = 1536.',
      `vety = ["Pes šteká.", "Mačka mňauká.", "Auto trúbi."]
vektory = embeddings.embed_documents(vety)
print("Vektorov:", len(vektory))
print("Rozmer:", len(vektory[0]))`),
    W('Funkcia kosinus()',
      'Napíš funkciu <code>kosinus(a, b)</code>: skalárny súčin cez <code>zip</code> + <code>sum</code>, delený súčinom dĺžok (<code>math.sqrt</code>). Otestuj na dvoch malých zoznamoch.',
      `import math
# tvoj kód...`,
      [['def kosinus'], ['zip(a, b)', 'zip(a,b)'], ['math.sqrt('], ['return']],
      'sum(x * y for x, y in zip(a, b)) / (sqrt(sum(x*x…)) * sqrt(sum(y*y…))).',
      `import math

def kosinus(a, b):
    skalarny = sum(x * y for x, y in zip(a, b))
    return skalarny / (math.sqrt(sum(x * x for x in a)) * math.sqrt(sum(y * y for y in b)))

print(kosinus([1, 0], [1, 0]))   # 1.0 — rovnaký smer
print(kosinus([1, 0], [0, 1]))   # 0.0 — kolmé`),
    W('Podobné či nie?',
      'Embedni dve vety s rovnakým významom inými slovami a vypíš ich kosínusovú podobnosť zaokrúhlenú na 3 miesta.',
      `# embeddings a kosinus() máš pripravené
# tvoj kód...`,
      [['embed_documents(', 'embed_query('], ['kosinus('], ['round(']],
      'v = embeddings.embed_documents(["Auto je rýchle.", "Vozidlo má vysokú rýchlosť."]) → kosinus(v[0], v[1]).',
      `v = embeddings.embed_documents([
    "Auto je rýchle.",
    "Vozidlo má vysokú rýchlosť.",
])
print(round(kosinus(v[0], v[1]), 3))`),
    W('Tabuľka podobností',
      'Embedni otázku a TRI vety. Cyklom vypíš podobnosť otázky s každou vetou (veta + skóre).',
      `# embeddings a kosinus() máš pripravené
otazka = "Aké zviera chová mlieko?"
vety = ["Krava dáva mlieko.", "Bicykel má dve kolesá.", "Kozy sa doja ráno."]
# tvoj kód...`,
      [['embed_query(otazka)', 'embed_query( otazka'], ['embed_documents(vety)', 'embed_documents( vety'], ['for '], ['zip(']],
      'v_o = embed_query(otazka); v_v = embed_documents(vety); for veta, v in zip(vety, v_v): kosinus(v_o, v).',
      `otazka = "Aké zviera dáva mlieko?"
vety = ["Krava dáva mlieko.", "Bicykel má dve kolesá.", "Kozy sa doja ráno."]

v_otazka = embeddings.embed_query(otazka)
v_vety = embeddings.embed_documents(vety)

for veta, v in zip(vety, v_vety):
    print(f"{round(kosinus(v_otazka, v), 3)}  {veta}")`),
    W('Víťazná veta',
      'Nájdi k otázke NAJPODOBNEJŠIU vetu — cez <code>max()</code> nad dvojicami (skóre, veta) alebo s <code>key=</code>. Vypíš ju aj so skóre.',
      `# v_otazka, v_vety, vety a kosinus() máš z predošlého cvičenia
# tvoj kód...`,
      [['max('], ['kosinus(']],
      'dvojice = [(kosinus(v_otazka, v), veta) for v, veta in zip(v_vety, vety)] → max(dvojice).',
      `dvojice = [(kosinus(v_otazka, v), veta) for v, veta in zip(v_vety, vety)]
skore, vitaz = max(dvojice)
print(f"Najpodobnejšia ({round(skore, 3)}): {vitaz}")`),
    W('Rebríček zhora nadol',
      'Zoraď všetky vety podľa podobnosti ZOSTUPNE cez <code>sorted(..., reverse=True)</code> a vypíš celý rebríček s medailami 🥇🥈🥉.',
      `# dvojice (skóre, veta) máš z predošlého cvičenia
# tvoj kód...`,
      [['sorted('], ['reverse=True'], ['for ']],
      'for medaila, (skore, veta) in zip(["🥇","🥈","🥉"], sorted(dvojice, reverse=True)).',
      `rebricek = sorted(dvojice, reverse=True)
for medaila, (skore, veta) in zip(["🥇", "🥈", "🥉"], rebricek):
    print(f"{medaila} {round(skore, 3)}  {veta}")`),
    W('Funkcia najdi_top()',
      'Zabaľ všetko do funkcie <code>najdi_top(otazka, vety, k=2)</code>: embedne otázku aj vety, spočíta podobnosti, zoradí a vráti TOP k viet. Otestuj na 5 vetách.',
      `# embeddings a kosinus() máš pripravené
# tvoj kód...`,
      [['def najdi_top'], ['k=2'], ['sorted('], ['reverse=True'], ['return'], ['[:k]']],
      'return [veta for skore, veta in sorted(dvojice, reverse=True)[:k]] — vlastný mini-retriever!',
      `def najdi_top(otazka, vety, k=2):
    v_otazka = embeddings.embed_query(otazka)
    v_vety = embeddings.embed_documents(vety)
    dvojice = [(kosinus(v_otazka, v), veta) for v, veta in zip(v_vety, vety)]
    return [veta for skore, veta in sorted(dvojice, reverse=True)[:k]]

vety = ["Krava dáva mlieko.", "Bicykel má kolesá.", "Kozy sa doja ráno.",
        "Slnko svieti.", "Mliečne výrobky sú z farmy."]
print(najdi_top("zvieratá a mlieko", vety))`),
  ];

  /* ── l14: vector stores ── */
  window.EXTRA_WRITE.l14 = [
    W('Databáza jedným volaním',
      'Vytvor Chroma databázu z pripravených <code>chunky</code> cez <code>from_documents</code> s <code>persist_directory="./moja_db"</code> a vypíš potvrdenie s počtom chunkov.',
      `from dotenv import load_dotenv
from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma

load_dotenv()
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
# chunky máš pripravené z lekcie 12
# tvoj kód...`,
      [['Chroma.from_documents('], ['embedding=embeddings'], ['persist_directory=']],
      'db = Chroma.from_documents(documents=chunky, embedding=embeddings, persist_directory="./moja_db").',
      `from dotenv import load_dotenv
from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma

load_dotenv()
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")

db = Chroma.from_documents(
    documents=chunky,
    embedding=embeddings,
    persist_directory="./moja_db",
)
print(f"Zaindexovaných {len(chunky)} chunkov")`),
    W('Hľadaj podľa významu',
      'Nad databázou spusti <code>similarity_search</code> s <code>k=2</code> a nájdené texty vypíš cyklom (prvých 60 znakov).',
      `# db máš vytvorenú z predošlého cvičenia
# tvoj kód...`,
      [['similarity_search('], ['k=2'], ['for '], ['[:60]']],
      'for doc in db.similarity_search("otázka", k=2): print(doc.page_content[:60]).',
      `vysledky = db.similarity_search("Koľko dní dovolenky mám?", k=2)
for doc in vysledky:
    print("•", doc.page_content[:60], "…")`),
    W('Skóre pod lupou',
      'Použi <code>similarity_search_with_score</code> a vypíš skóre + text prvého výsledku. Pamätaj: nižšie = bližšie!',
      `# db máš vytvorenú
# tvoj kód...`,
      [['similarity_search_with_score('], ['round(']],
      'doc, skore = vysledky[0] — vracia dvojice (dokument, vzdialenosť).',
      `vysledky = db.similarity_search_with_score("dovolenka", k=1)
doc, skore = vysledky[0]
print(f"Skóre (vzdialenosť): {round(skore, 3)}")
print(doc.page_content[:60])`),
    W('Otvor bez indexovania',
      'Napíš skript, ktorý EXISTUJÚCU databázu len OTVORÍ (konštruktor s <code>persist_directory</code> a <code>embedding_function</code>) a otestuje ju jedným vyhľadaním.',
      `from dotenv import load_dotenv
from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma

load_dotenv()
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
# tvoj kód...`,
      [['Chroma(persist_directory=', 'Chroma( persist_directory='], ['embedding_function=embeddings'], ['similarity_search(']],
      'db = Chroma(persist_directory="./moja_db", embedding_function=embeddings) — POZOR: embedding_function, nie embedding!',
      `from dotenv import load_dotenv
from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma

load_dotenv()
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")

db = Chroma(persist_directory="./moja_db", embedding_function=embeddings)
print(db.similarity_search("dovolenka", k=1)[0].page_content[:60])`),
    W('Pridaj nový dokument',
      'Do otvorenej databázy pridaj NOVÝ <code>Document</code> (importuj ho z <code>langchain_core.documents</code>) cez <code>add_documents</code> a over vyhľadaním, že sa našiel.',
      `from langchain_core.documents import Document
# db máš otvorenú
# tvoj kód...`,
      [['Document(page_content='], ['metadata='], ['add_documents([', 'add_documents( ['], ['similarity_search(']],
      'novy = Document(page_content="…", metadata={"source": "nova_smernica.txt"}) → db.add_documents([novy]).',
      `from langchain_core.documents import Document

novy = Document(
    page_content="Multisport karta je plne hradená firmou.",
    metadata={"source": "benefity.txt"},
)
db.add_documents([novy])

print(db.similarity_search("multisport", k=1)[0].page_content)`),
    W('Odkiaľ odpoveď pochádza',
      'Vyhľadaj k=3 a vypíš pre každý výsledok LEN zdroj z metadát — bez duplikátov (použi <code>set</code>).',
      `# db máš otvorenú
# tvoj kód...`,
      [['similarity_search('], ['metadata["source"]', "metadata['source']"], ['set', '{d.metadata']],
      'zdroje = {d.metadata["source"] for d in vysledky} — množina duplikáty zahodí sama.',
      `vysledky = db.similarity_search("dovolenka a voľno", k=3)
zdroje = {d.metadata["source"] for d in vysledky}
print("Zdroje:", ", ".join(zdroje))`),
    W('Vyhľadávacia slučka',
      'Postav slučku <code>while True</code>: otázka cez input, „koniec" ukončí, inak vypíš 2 najpodobnejšie chunky. Konzolový vyhľadávač hotový!',
      `# db máš otvorenú
# tvoj kód...`,
      [['while True'], ['input('], ['break'], ['similarity_search(']],
      'V slučke len similarity_search(otazka, k=2) + výpis — bez LLM, čisté vyhľadávanie.',
      `while True:
    otazka = input("Hľadaj: ")
    if otazka == "koniec":
        break
    for doc in db.similarity_search(otazka, k=2):
        print("•", doc.page_content[:70])`),
    W('Funkcia indexuj()',
      'Napíš funkciu <code>indexuj(subor, cesta_db)</code>: načíta súbor, rozseká (500/80), uloží do Chromy na zadanú cestu a vráti počet chunkov. Zavolaj ju.',
      `from dotenv import load_dotenv
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma

load_dotenv()
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
# tvoj kód...`,
      [['def indexuj'], ['TextLoader('], ['split_documents('], ['from_documents('], ['return len(', 'return  len(']],
      'Celá indexačná pipeline v jednej funkcii: load → split → from_documents → return len(chunky).',
      `from dotenv import load_dotenv
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma

load_dotenv()
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")

def indexuj(subor, cesta_db):
    dokumenty = TextLoader(subor, encoding="utf-8").load()
    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=80)
    chunky = splitter.split_documents(dokumenty)
    Chroma.from_documents(chunky, embedding=embeddings, persist_directory=cesta_db)
    return len(chunky)

print("Zaindexované chunky:", indexuj("smernica.txt", "./smernice_db"))`),
    W('Mini knižnica komplet',
      'Poskladaj celý workflow: funkciou <code>indexuj()</code> zaindexuj súbor, potom databázu OTVOR konštruktorom a spusti vyhľadávaciu slučku so zdrojmi. Tri vrstvy v jednom skripte.',
      `# indexuj() a embeddings máš z predošlého cvičenia
# tvoj kód...`,
      [['indexuj('], ['Chroma(persist_directory='], ['while True'], ['metadata["source"]', "metadata['source']"]],
      'indexuj → otvor → slučka. Presne vzor „indexuj raz, pýtaj sa veľakrát".',
      `indexuj("smernica.txt", "./smernice_db")

db = Chroma(persist_directory="./smernice_db", embedding_function=embeddings)

while True:
    otazka = input("Hľadaj: ")
    if otazka == "koniec":
        break
    for doc in db.similarity_search(otazka, k=2):
        print(f"[{doc.metadata['source']}] {doc.page_content[:60]}…")`),
  ];

  /* ── l15: retrievers ── */
  window.EXTRA_WRITE.l15 = [
    W('Z databázy retriever',
      'Vyrob z databázy retriever cez <code>as_retriever</code> s <code>k=3</code> a zavolaj ho cez <code>invoke()</code> — vypíš počet nájdených dokumentov.',
      `# db máš otvorenú z lekcie 14
# tvoj kód...`,
      [['as_retriever('], ['search_kwargs={"k": 3}', "search_kwargs={'k': 3}"], ['.invoke('], ['len(']],
      'retriever = db.as_retriever(search_kwargs={"k": 3}) → dokumenty = retriever.invoke("otázka").',
      `retriever = db.as_retriever(search_kwargs={"k": 3})
dokumenty = retriever.invoke("prenos dovolenky")
print("Nájdených:", len(dokumenty))`),
    W('k=1 vs. k=4',
      'Vyrob DVA retrievery s rôznym <code>k</code> (1 a 4), polož obom rovnakú otázku a porovnaj počty nájdených dokumentov.',
      `# db máš otvorenú
# tvoj kód...`,
      [['{"k": 1}', "{'k': 1}"], ['{"k": 4}', "{'k': 4}"], ['.invoke(']],
      'Dva as_retriever s rôznym search_kwargs — k priamo riadi, koľko kontextu potečie do promptu.',
      `maly = db.as_retriever(search_kwargs={"k": 1})
velky = db.as_retriever(search_kwargs={"k": 4})

otazka = "dovolenka"
print("k=1 →", len(maly.invoke(otazka)), "dokument")
print("k=4 →", len(velky.invoke(otazka)), "dokumenty")`),
    W('Rôznorodosť cez MMR',
      'Vyrob retriever so <code>search_type="mmr"</code> a k=3, zavolaj ho a vypíš nájdené texty — MMR potláča duplicitné výsledky.',
      `# db máš otvorenú
# tvoj kód...`,
      [['search_type="mmr"', "search_type='mmr'"], ['.invoke('], ['for ']],
      'db.as_retriever(search_type="mmr", search_kwargs={"k": 3}) — zvyšok je rovnaký.',
      `mmr = db.as_retriever(search_type="mmr", search_kwargs={"k": 3})
for d in mmr.invoke("pravidlá dovolenky"):
    print("•", d.page_content[:60])`),
    W('Prah proti balastu',
      'Vyrob prísny retriever so <code>search_type="similarity_score_threshold"</code> a <code>score_threshold: 0.5</code>. Otestuj otázkou ÚPLNE mimo tém — má vrátiť prázdny zoznam.',
      `# db máš otvorenú
# tvoj kód...`,
      [['similarity_score_threshold'], ['score_threshold'], ['.invoke(']],
      'search_kwargs={"score_threshold": 0.5, "k": 4}. Prázdny výsledok pri nezmyselnej otázke = poistka funguje.',
      `prisny = db.as_retriever(
    search_type="similarity_score_threshold",
    search_kwargs={"score_threshold": 0.5, "k": 4},
)
vysledok = prisny.invoke("recept na palacinky s marmeládou")
print("Nájdených:", len(vysledok))  # očakávam 0 — otázka je mimo tém`),
    W('Dokumentový chain',
      'Zostav <code>create_stuff_documents_chain(model, prompt)</code> — prompt musí mať <code>{context}</code> v system a <code>{input}</code> v human správe.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains.combine_documents import create_stuff_documents_chain

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini", temperature=0)
# tvoj kód...`,
      [['{context}'], ['{input}'], ['create_stuff_documents_chain(model, prompt)', 'create_stuff_documents_chain(']],
      'Názvy context a input sú POVINNÉ — očakáva ich staviteľ chainu.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains.combine_documents import create_stuff_documents_chain

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini", temperature=0)

prompt = ChatPromptTemplate.from_messages([
    ("system", "Odpovedaj IBA na základe kontextu:\\n{context}"),
    ("human", "{input}"),
])
dokumentovy_chain = create_stuff_documents_chain(model, prompt)
print("Dokumentový chain pripravený")`),
    W('Kompletný RAG chain',
      'Spoj retriever s dokumentovým chainom cez <code>create_retrieval_chain</code>, polož otázku a vypíš odpoveď z kľúča <code>"answer"</code>.',
      `from langchain.chains import create_retrieval_chain
# retriever a dokumentovy_chain máš pripravené
# tvoj kód...`,
      [['create_retrieval_chain(retriever, dokumentovy_chain)', 'create_retrieval_chain('], ['{"input"', "{'input'"], ['["answer"]', "['answer']"]],
      'rag = create_retrieval_chain(retriever, dokumentovy_chain) → rag.invoke({"input": "…"})["answer"].',
      `from langchain.chains import create_retrieval_chain

rag_chain = create_retrieval_chain(retriever, dokumentovy_chain)
vysledok = rag_chain.invoke({"input": "Dokedy môžem preniesť dovolenku?"})
print(vysledok["answer"])`),
    W('Odpoveď s dôkazmi',
      'Po invoke vypíš odpoveď AJ zoznam zdrojov: prejdi <code>vysledok["context"]</code> a vypíš <code>metadata["source"]</code> každého dokumentu.',
      `# rag_chain máš pripravený
# tvoj kód...`,
      [['["answer"]', "['answer']"], ['["context"]', "['context']"], ['metadata["source"]', "metadata['source']"]],
      'context obsahuje reálne použité Documenty — každý má source v metadátach.',
      `vysledok = rag_chain.invoke({"input": "Koľko dní dovolenky mám?"})
print("Odpoveď:", vysledok["answer"])
for d in vysledok["context"]:
    print("  zdroj:", d.metadata["source"])`),
    W('Test čestnosti',
      'Polož RAG chainu otázku, na ktorú dokumenty NEMAJÚ odpoveď, a vypíš, čo odpovedal. Ak si vymýšľa, sprísni system prompt („Ak odpoveď nie je v kontexte, povedz to.") a spusti znova.',
      `# rag_chain máš pripravený
# tvoj kód...`,
      [['.invoke('], ['["answer"]', "['answer']"]],
      'Otázka typu „Aká je politika parkovania vesmírnych lodí?" — správna odpoveď je priznané „neviem".',
      `vysledok = rag_chain.invoke(
    {"input": "Aká je firemná politika parkovania vesmírnych lodí?"})
print(vysledok["answer"])
# Očakávam niečo ako: "Táto informácia sa v kontexte nenachádza."`),
    W('Funkcia opytaj_dokumenty()',
      'Zabaľ RAG do funkcie <code>opytaj_dokumenty(otazka)</code>, ktorá vráti slovník <code>{"odpoved": ..., "zdroje": [...]}</code> (zdroje bez duplikátov cez set + list). Otestuj dvomi otázkami.',
      `# rag_chain máš pripravený
# tvoj kód...`,
      [['def opytaj_dokumenty'], ['["answer"]', "['answer']"], ['set(', '{d.metadata'], ['return {', 'return{']],
      'return {"odpoved": v["answer"], "zdroje": list({d.metadata["source"] for d in v["context"]})}.',
      `def opytaj_dokumenty(otazka):
    v = rag_chain.invoke({"input": otazka})
    zdroje = list({d.metadata["source"] for d in v["context"]})
    return {"odpoved": v["answer"], "zdroje": zdroje}

print(opytaj_dokumenty("Koľko dní dovolenky mám?"))
print(opytaj_dokumenty("Dokedy sa prenáša nevyčerpaná dovolenka?"))`),
  ];

  /* ── l16: chatbot basics ── */
  window.EXTRA_WRITE.l16 = [
    W('Echo základ',
      'Postav najjednoduchšiu slučku: <code>while True</code>, <code>input("Ty: ")</code>, pri „koniec" <code>break</code>, inak vstup zopakuj s prefixom „Bot:".',
      `# tvoj kód...`,
      [['while True'], ['input('], ['break'], ['print(']],
      'Presná kostra každého konzolového bota — ešte bez AI.',
      `while True:
    veta = input("Ty: ")
    if veta == "koniec":
        break
    print("Bot:", veta)`),
    W('Viac únikových slov',
      'Uprav ukončenie tak, aby fungovalo na „koniec", „exit" AJ „quit" — cez operátor <code>in</code> nad trojicou a <code>.lower()</code>.',
      `# tvoj kód...`,
      [['.lower()'], ['in ("koniec", "exit", "quit")', "in ('koniec', 'exit', 'quit')"], ['break']],
      'if veta.lower() in ("koniec", "exit", "quit"): break — jeden riadok, tri únikové cesty.',
      `while True:
    veta = input("Ty: ")
    if veta.lower() in ("koniec", "exit", "quit"):
        break
    print("Bot:", veta)`),
    W('AI namiesto echa',
      'Vymeň echo za skutočný chain: pred slučkou zlož <code>prompt | model | parser</code> a v slučke volaj <code>chain.invoke({"otazka": ...})</code>.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

load_dotenv()
# tvoj kód...`,
      [['| model |', '| ChatOpenAI'], ['while True'], ['.invoke({"otazka"', ".invoke({'otazka'"]],
      'Chain zlož RAZ pred slučkou — v slučke už len invoke.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini")
prompt = ChatPromptTemplate.from_messages([
    ("system", "Si stručný asistent."),
    ("human", "{otazka}"),
])
chain = prompt | model | StrOutputParser()

while True:
    otazka = input("Ty: ")
    if otazka.lower() == "koniec":
        break
    print("Bot:", chain.invoke({"otazka": otazka}))`),
    W('Bot s osobnosťou',
      'Daj botovi system správou výraznú osobnosť (napr. nadšený tréner fitka, ktorý všetko prirovnáva k cvičeniu) a otestuj v slučke.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini", temperature=0.8)
# tvoj kód...`,
      [['("system"', "('system'"], ['while True'], ['break'], ['.invoke(']],
      'Osobnosť = detailná system správa: kto je, ako hovorí, čo má rád.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini", temperature=0.8)
prompt = ChatPromptTemplate.from_messages([
    ("system", "Si nadšený fitness tréner Rasťo. Všetko prirovnávaš "
               "k cvičeniu a motivuješ. Odpovedáš stručne."),
    ("human", "{otazka}"),
])
chain = prompt | model | StrOutputParser()

while True:
    otazka = input("Ty: ")
    if otazka.lower() == "koniec":
        break
    print("Rasťo:", chain.invoke({"otazka": otazka}))`),
    W('Privítanie a rozlúčka',
      'Pridaj botovi uvítaciu správu PRED slučkou a rozlúčkovú správu PRED <code>break</code> — malé UX detaily, veľký rozdiel.',
      `# chain máš pripravený
# tvoj kód...`,
      [['print('], ['while True'], ['break']],
      'print("Bot: Vitaj!...") pred while; print("Bot: Maj sa!") tesne pred break.',
      `print("Bot: Vitaj! Som tu pre teba. ('koniec' ma vypne)")
while True:
    otazka = input("Ty: ")
    if otazka.lower() == "koniec":
        print("Bot: Maj sa, rád som pomohol! 👋")
        break
    print("Bot:", chain.invoke({"otazka": otazka}))`),
    W('Ignoruj prázdny vstup',
      'Ošetri prázdny vstup: ak používateľ len stlačí Enter, preskoč kolo cez <code>continue</code> (bez volania modelu — šetríš peniaze!).',
      `# chain máš pripravený
# tvoj kód...`,
      [['if not otazka', 'otazka == ""', "otazka == ''"], ['continue']],
      'if not otazka: continue — prázdny string je nepravda, continue skočí na začiatok slučky.',
      `while True:
    otazka = input("Ty: ")
    if otazka.lower() == "koniec":
        break
    if not otazka:
        continue
    print("Bot:", chain.invoke({"otazka": otazka}))`),
    W('Počítadlo otázok',
      'Pridaj počítadlo: premenná <code>pocet = 0</code> pred slučkou, <code>pocet += 1</code> pri každej otázke a po skončení vypíš „Zodpovedaných otázok: X".',
      `# chain máš pripravený
# tvoj kód...`,
      [['pocet = 0'], ['pocet += 1'], ['break'], ['print(f"', "print(f'"]],
      'Súčtový vzor: inicializuj pred slučkou, zvyšuj vnútri, vypíš po break-u.',
      `pocet = 0
while True:
    otazka = input("Ty: ")
    if otazka.lower() == "koniec":
        break
    if not otazka:
        continue
    print("Bot:", chain.invoke({"otazka": otazka}))
    pocet += 1

print(f"Zodpovedaných otázok: {pocet}")`),
    W('Streamovaný bot',
      'Vylepši UX: namiesto <code>invoke</code> použi <code>chain.stream()</code>, aby odpoveď nabiehala postupne (chunky + <code>end=""</code>). Po streame nezabudni prázdny <code>print()</code> pre nový riadok.',
      `# chain máš pripravený
# tvoj kód...`,
      [['.stream('], ['end=""', "end=''"], ['flush=True'], ['print()']],
      'for chunk in chain.stream({...}): print(chunk, end="", flush=True) → nakoniec print().',
      `while True:
    otazka = input("Ty: ")
    if otazka.lower() == "koniec":
        break
    print("Bot: ", end="")
    for chunk in chain.stream({"otazka": otazka}):
        print(chunk, end="", flush=True)
    print()`),
    W('Bot s príkazmi',
      'Pridaj príkazový systém: „pomoc" vypíše zoznam príkazov, „koniec" ukončí — všetko OSTATNÉ ide do chainu. Použi if/elif/else v slučke.',
      `# chain máš pripravený
# tvoj kód...`,
      [['elif'], ['pomoc'], ['else'], ['.invoke(', '.stream(']],
      'if otazka == "koniec": break / elif otazka == "pomoc": print(...) / else: chain.',
      `print("Bot: Píš otázky. Príkazy: pomoc, koniec")
while True:
    otazka = input("Ty: ").lower()
    if otazka == "koniec":
        break
    elif otazka == "pomoc":
        print("Bot: Príkazy → pomoc (toto), koniec (vypnutie). Inak sa pýtaj!")
    else:
        print("Bot:", chain.invoke({"otazka": otazka}))`),
  ];

  /* ── l17: pamäť ── */
  window.EXTRA_WRITE.l17 = [
    W('Prompt so zásuvkou',
      'Zostav prompt s pamäťou: system správa, <code>MessagesPlaceholder("chat_history")</code> a human <code>{otazka}</code>.',
      `from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
# tvoj kód...`,
      [['MessagesPlaceholder("chat_history")', "MessagesPlaceholder('chat_history')"], ['{otazka}'], ['from_messages']],
      'Placeholder ide MEDZI system a human — tam sa vysype história.',
      `from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

prompt = ChatPromptTemplate.from_messages([
    ("system", "Si stručný asistent."),
    MessagesPlaceholder("chat_history"),
    ("human", "{otazka}"),
])
print("Prompt s pamäťou pripravený")`),
    W('Prvý zápis do pamäte',
      'Vytvor prázdny zoznam <code>historia</code>, zavolaj chain s prázdnou históriou a po odpovedi pridaj OBE správy (<code>HumanMessage</code> + <code>AIMessage</code>).',
      `from langchain_core.messages import HumanMessage, AIMessage
# chain s placeholderom máš pripravený
# tvoj kód...`,
      [['historia = []'], ['"chat_history": historia', "'chat_history': historia"], ['.append(HumanMessage'], ['.append(AIMessage']],
      'invoke({"chat_history": historia, "otazka": ...}) → dva appendy.',
      `from langchain_core.messages import HumanMessage, AIMessage

historia = []
otazka = "Volám sa Martin a mám rád hory."
odpoved = chain.invoke({"chat_history": historia, "otazka": otazka})
print(odpoved)

historia.append(HumanMessage(content=otazka))
historia.append(AIMessage(content=odpoved))
print("Správ v pamäti:", len(historia))`),
    W('Pamäťový test bez slučky',
      'Napevno polož DVE otázky za sebou: „Volám sa Martin." a „Ako sa volám?" — s appendmi medzi nimi. Druhá odpoveď MUSÍ obsahovať meno.',
      `from langchain_core.messages import HumanMessage, AIMessage
# chain máš pripravený
historia = []
# tvoj kód...`,
      [['Volám sa Martin', 'volám sa Martin'], ['Ako sa volám'], ['.append(HumanMessage'], ['.append(AIMessage']],
      'Medzi otázkami MUSIA byť appendy — inak druhé volanie históriu neuvidí.',
      `from langchain_core.messages import HumanMessage, AIMessage

historia = []

o1 = "Volám sa Martin."
a1 = chain.invoke({"chat_history": historia, "otazka": o1})
historia.append(HumanMessage(content=o1))
historia.append(AIMessage(content=a1))

o2 = "Ako sa volám?"
a2 = chain.invoke({"chat_history": historia, "otazka": o2})
print(a2)  # ...Martin!`),
    W('Slučka s pamäťou',
      'Zlož celého pamätlivého bota: slučka + invoke s históriou + appendy po každej výmene.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage
from langchain_core.output_parsers import StrOutputParser

load_dotenv()
# tvoj kód...`,
      [['MessagesPlaceholder("chat_history")', "MessagesPlaceholder('chat_history')"], ['while True'], ['break'], ['.append(HumanMessage'], ['.append(AIMessage']],
      'Kompletná kostra z lekcie 17 — appendy až PO print-e odpovede.',
      `from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage
from langchain_core.output_parsers import StrOutputParser

load_dotenv()
prompt = ChatPromptTemplate.from_messages([
    ("system", "Si priateľský asistent."),
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
    historia.append(AIMessage(content=odpoved))`),
    W('Merač pamäte',
      'Po každej výmene vypíš aj počet správ v pamäti: „(v pamäti: X správ)" — sleduj, ako rastie o 2 každé kolo.',
      `# bot s pamäťou z predošlého cvičenia
# tvoj kód (uprav slučku)...`,
      [['len(historia)'], ['.append(']],
      'print(f"(v pamäti: {len(historia)} správ)") hneď za appendmi.',
      `historia = []
while True:
    otazka = input("Ty: ")
    if otazka.lower() == "koniec":
        break
    odpoved = chain.invoke({"chat_history": historia, "otazka": otazka})
    print("Bot:", odpoved)
    historia.append(HumanMessage(content=otazka))
    historia.append(AIMessage(content=odpoved))
    print(f"(v pamäti: {len(historia)} správ)")`),
    W('Okno posledných N',
      'Obmedz pamäť: do invoke posielaj len posledných 6 správ cez výrez <code>historia[-6:]</code> — appenduj ale stále všetko.',
      `# bot s pamäťou máš pripravený
# tvoj kód (uprav invoke)...`,
      [['historia[-6:]']],
      '"chat_history": historia[-6:] — model vidí len okno, plná história ostáva u teba.',
      `odpoved = chain.invoke({
    "chat_history": historia[-6:],
    "otazka": otazka,
})`),
    W('Príkaz reset',
      'Pridaj do slučky príkaz „reset", ktorý pamäť vymaže cez <code>historia.clear()</code> a oznámi to — bez ukončenia bota.',
      `# bot s pamäťou máš pripravený
# tvoj kód (uprav slučku)...`,
      [['elif', 'reset'], ['historia.clear()'], ['continue']],
      'elif otazka == "reset": historia.clear(); print("Pamäť vymazaná"); continue.',
      `while True:
    otazka = input("Ty: ")
    if otazka.lower() == "koniec":
        break
    elif otazka.lower() == "reset":
        historia.clear()
        print("Bot: Pamäť vymazaná — začíname odznova.")
        continue
    odpoved = chain.invoke({"chat_history": historia, "otazka": otazka})
    print("Bot:", odpoved)
    historia.append(HumanMessage(content=otazka))
    historia.append(AIMessage(content=odpoved))`),
    W('Ulož konverzáciu',
      'Po ukončení bota zapíš celú históriu do súboru <code>konverzacia.txt</code>: každý riadok v tvare „ROLA: text" (typ zisti cez <code>isinstance(s, HumanMessage)</code>).',
      `# historia je naplnená po behu bota
from langchain_core.messages import HumanMessage
# tvoj kód...`,
      [['open('], ['"w"', "'w'"], ['isinstance('], ['for '], ['.write(']],
      'rola = "TY" if isinstance(s, HumanMessage) else "BOT" → f.write(f"{rola}: {s.content}\\n").',
      `from langchain_core.messages import HumanMessage

with open("konverzacia.txt", "w", encoding="utf-8") as f:
    for s in historia:
        rola = "TY" if isinstance(s, HumanMessage) else "BOT"
        f.write(f"{rola}: {s.content}\\n")
print("Konverzácia uložená do konverzacia.txt")`),
    W('Zhrnutie na rozlúčku',
      'Pri „koniec" nechaj DRUHÝ chain zhrnúť celú konverzáciu do 2 viet: históriu zlep do textu cez <code>join</code> a pošli sumarizačnému chainu. Zhrnutie vypíš pred break-om.',
      `# chain a historia máš pripravené; model tiež
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
# tvoj kód...`,
      [['{rozhovor}'], ['.join('], ['s.content'], ['break']],
      'text = "\\n".join(s.content for s in historia) → sumar.invoke({"rozhovor": text}) → print → break.',
      `from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

sumar = ChatPromptTemplate.from_template(
    "Zhrň konverzáciu do 2 viet:\\n{rozhovor}"
) | model | StrOutputParser()

while True:
    otazka = input("Ty: ")
    if otazka.lower() == "koniec":
        text = "\\n".join(s.content for s in historia)
        print("Zhrnutie:", sumar.invoke({"rozhovor": text}))
        break
    odpoved = chain.invoke({"chat_history": historia, "otazka": otazka})
    print("Bot:", odpoved)
    historia.append(HumanMessage(content=otazka))
    historia.append(AIMessage(content=odpoved))`),
  ];

  /* ── l18: RAG chatbot ── */
  window.EXTRA_WRITE.l18 = [
    W('Jedna RAG otázka',
      'Zavolaj pripravený <code>rag_chain</code> s jednou otázkou a vypíš odpoveď — rozcvička pred slučkou.',
      `# rag_chain máš zostavený podľa lekcie
# tvoj kód...`,
      [['rag_chain.invoke('], ['{"input"', "{'input'"], ['["answer"]', "['answer']"]],
      'print(rag_chain.invoke({"input": "…"})["answer"]).',
      `vysledok = rag_chain.invoke({"input": "Koľko dní dovolenky mám?"})
print(vysledok["answer"])`),
    W('RAG v slučke',
      'Obal RAG chain konverzačnou slučkou: input → invoke → answer, „koniec" ukončí.',
      `# rag_chain máš zostavený
# tvoj kód...`,
      [['while True'], ['input('], ['break'], ['["answer"]', "['answer']"]],
      'Kombinácia lekcií 15 + 16 — chain je hotový, slučka okolo.',
      `print("HR Bot: Pýtaj sa na smernice. ('koniec' = stop)")
while True:
    otazka = input("Ty: ")
    if otazka.lower() == "koniec":
        break
    vysledok = rag_chain.invoke({"input": otazka})
    print("Bot:", vysledok["answer"])`),
    W('Zdroje pod odpoveďou',
      'Rozšír slučku o citácie: po odpovedi vypíš unikátne zdroje z <code>context</code> (set + join) na riadku „📎 zdroje: …".',
      `# rag_chain a slučku máš pripravené
# tvoj kód (uprav slučku)...`,
      [['["context"]', "['context']"], ['metadata["source"]', "metadata['source']"], ['.join(']],
      'zdroje = {d.metadata["source"] for d in vysledok["context"]} → ", ".join(zdroje).',
      `while True:
    otazka = input("Ty: ")
    if otazka.lower() == "koniec":
        break
    vysledok = rag_chain.invoke({"input": otazka})
    print("Bot:", vysledok["answer"])
    zdroje = {d.metadata["source"] for d in vysledok["context"]}
    print("   📎 zdroje:", ", ".join(zdroje))`),
    W('Overený pesimista',
      'Otestuj poistku: polož v slučke otázku mimo dokumentov a over, že bot odpovie „nenašiel som" (ak nie, dopln do system promptu pravidlo a reštartuj).',
      `# rag_chain máš pripravený
# tvoj kód...`,
      [['.invoke('], ['["answer"]', "['answer']"]],
      'System prompt musí obsahovať: „Ak odpoveď nie je v kontexte, povedz: V dokumentoch som to nenašiel."',
      `vysledok = rag_chain.invoke({"input": "Aká je politika firemných jednorožcov?"})
print(vysledok["answer"])
# Očakávané: "V dokumentoch som to nenašiel." — žiadne vymýšľanie!`),
    W('Log nezodpovedaných',
      'Keď odpoveď obsahuje „nenašiel", zapíš otázku do súboru <code>missing.txt</code> v režime append (<code>"a"</code>) — presne takto rastie FAQ v praxi.',
      `# slučku s RAG máš pripravenú
# tvoj kód (uprav slučku)...`,
      [['nenašiel', 'nenasiel'], ['open('], ['"a"', "'a'"], ['.write(']],
      'if "nenašiel" in vysledok["answer"].lower(): with open("missing.txt", "a", encoding="utf-8") as f: f.write(otazka + "\\n").',
      `while True:
    otazka = input("Ty: ")
    if otazka.lower() == "koniec":
        break
    vysledok = rag_chain.invoke({"input": otazka})
    print("Bot:", vysledok["answer"])
    if "nenašiel" in vysledok["answer"].lower():
        with open("missing.txt", "a", encoding="utf-8") as f:
            f.write(otazka + "\\n")`),
    W('Počítadlo úspešnosti',
      'Pridaj dve počítadlá: <code>zodpovedane</code> a <code>nezodpovedane</code>. Po skončení vypíš mini štatistiku bota.',
      `# slučku s RAG máš pripravenú
# tvoj kód...`,
      [['zodpovedane = 0'], ['nezodpovedane', '+= 1'], ['break'], ['print(f"', "print(f'"]],
      'if „nenašiel" in answer → nezodpovedane += 1, inak zodpovedane += 1. Výpis po break.',
      `zodpovedane = 0
nezodpovedane = 0
while True:
    otazka = input("Ty: ")
    if otazka.lower() == "koniec":
        break
    vysledok = rag_chain.invoke({"input": otazka})
    print("Bot:", vysledok["answer"])
    if "nenašiel" in vysledok["answer"].lower():
        nezodpovedane += 1
    else:
        zodpovedane += 1

print(f"Štatistika: {zodpovedane} zodpovedaných, {nezodpovedane} bez odpovede")`),
    W('Experiment s k',
      'Postav DVA rag chainy s rôznym k (1 a 5), polož obom tú istú širokú otázku a porovnaj kvalitu odpovedí vedľa seba.',
      `# db, model, prompt a create_* staviteľov máš pripravené
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains import create_retrieval_chain
# tvoj kód...`,
      [['{"k": 1}', "{'k': 1}"], ['{"k": 5}', "{'k': 5}"], ['create_retrieval_chain(']],
      'Dva retrievery → dva chainy → rovnaká otázka → porovnaj. k=1 často odpovie neúplne.',
      `from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains import create_retrieval_chain

dok_chain = create_stuff_documents_chain(model, prompt)
uzky = create_retrieval_chain(db.as_retriever(search_kwargs={"k": 1}), dok_chain)
siroky = create_retrieval_chain(db.as_retriever(search_kwargs={"k": 5}), dok_chain)

otazka = "Zhrň všetky pravidlá o dovolenke."
print("k=1:", uzky.invoke({"input": otazka})["answer"])
print("k=5:", siroky.invoke({"input": otazka})["answer"])`),
    W('Krajší výstup',
      'Naformátuj odpoveď bota: oddeľovač <code>"─" * 40</code>, odpoveď, prázdny riadok, zdroje — všetko v pomocnej funkcii <code>vypis(vysledok)</code>.',
      `# rag_chain máš pripravený
# tvoj kód...`,
      [['def vypis'], ['"─" * 40', "'─' * 40", '"-" * 40'], ['["answer"]', "['answer']"], ['metadata["source"]', "metadata['source']"]],
      'Funkcia na výpis = jedno miesto, kde ladíš vzhľad. Násobenie stringu vyrobí čiaru.',
      `def vypis(vysledok):
    print("─" * 40)
    print(vysledok["answer"])
    print()
    zdroje = {d.metadata["source"] for d in vysledok["context"]}
    print("📎", ", ".join(zdroje))

vypis(rag_chain.invoke({"input": "Koľko sick days mám?"}))`),
    W('Funkcia podpora()',
      'Zabaľ celého bota do funkcie <code>podpora(otazka)</code>, ktorá vráti slovník <code>{"odpoved", "zdroje", "nasiel"}</code> (<code>nasiel</code> je bool — či odpoveď NIE JE „nenašiel"). Otestuj oba prípady.',
      `# rag_chain máš pripravený
# tvoj kód...`,
      [['def podpora'], ['return {', 'return{'], ['"nasiel"', "'nasiel'"], ['not in', '"nenašiel" in', "'nenašiel' in"]],
      '"nasiel": "nenašiel" not in v["answer"].lower() — negácia podmienky priamo v slovníku.',
      `def podpora(otazka):
    v = rag_chain.invoke({"input": otazka})
    return {
        "odpoved": v["answer"],
        "zdroje": list({d.metadata["source"] for d in v["context"]}),
        "nasiel": "nenašiel" not in v["answer"].lower(),
    }

print(podpora("Koľko dní dovolenky mám?"))
print(podpora("Aké sú pravidlá pre chov dinosaurov?"))`),
  ];

  /* ── l19: history-aware RAG ── */
  window.EXTRA_WRITE.l19 = [
    W('Preformulovací prompt',
      'Zostav prompt pre preformulovanie: <code>MessagesPlaceholder("chat_history")</code>, human <code>{input}</code> a human inštrukcia „Preformuluj otázku vyššie na samostatnú. Iba otázku."',
      `from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
# tvoj kód...`,
      [['MessagesPlaceholder("chat_history")', "MessagesPlaceholder('chat_history')"], ['{input}'], ['Preformuluj']],
      'Tri položky: placeholder, ("human", "{input}"), ("human", "Preformuluj…").',
      `from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

preformuluj_prompt = ChatPromptTemplate.from_messages([
    MessagesPlaceholder("chat_history"),
    ("human", "{input}"),
    ("human", "Preformuluj otázku vyššie na samostatnú otázku, "
              "ktorá dáva zmysel bez histórie. Iba otázku."),
])
print("Preformulovací prompt pripravený")`),
    W('Retriever s pamäťou',
      'Vytvor <code>create_history_aware_retriever(model, retriever, preformuluj_prompt)</code> — retriever, ktorý najprv rozviaže zámená.',
      `from langchain.chains import create_history_aware_retriever
# model, retriever a preformuluj_prompt máš pripravené
# tvoj kód...`,
      [['create_history_aware_retriever(model, retriever, preformuluj_prompt)', 'create_history_aware_retriever(']],
      'Tri argumenty v poradí: model, retriever, prompt.',
      `from langchain.chains import create_history_aware_retriever

ha_retriever = create_history_aware_retriever(model, retriever, preformuluj_prompt)
print("History-aware retriever pripravený")`),
    W('QA prompt s históriou',
      'Zostav odpovedací prompt: system s <code>{context}</code> a pravidlom „IBA z kontextu", <code>MessagesPlaceholder("chat_history")</code> a human <code>{input}</code>.',
      `from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
# tvoj kód...`,
      [['{context}'], ['MessagesPlaceholder("chat_history")', "MessagesPlaceholder('chat_history')"], ['{input}']],
      'História je tu DRUHÝKRÁT — kvôli nadväznosti odpovede (prvýkrát bola v preformulovacom).',
      `from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

qa_prompt = ChatPromptTemplate.from_messages([
    ("system", "Si HR asistent. Odpovedaj IBA z kontextu.\\n\\n{context}"),
    MessagesPlaceholder("chat_history"),
    ("human", "{input}"),
])
print("QA prompt pripravený")`),
    W('Zlož celú架 architektúru',
      'Spoj všetko: <code>create_retrieval_chain(ha_retriever, create_stuff_documents_chain(model, qa_prompt))</code> a vypíš potvrdenie.',
      `from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
# ha_retriever a qa_prompt máš pripravené
# tvoj kód...`,
      [['create_retrieval_chain(ha_retriever', 'create_retrieval_chain( ha_retriever'], ['create_stuff_documents_chain(model, qa_prompt)', 'create_stuff_documents_chain(']],
      'Rovnaká stavba ako v lekcii 18 — len namiesto obyčajného retrievera sedí ha_retriever.',
      `from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain

rag_chain = create_retrieval_chain(
    ha_retriever, create_stuff_documents_chain(model, qa_prompt)
)
print("RAG s pamäťou zložený!")`),
    W('Invoke s dvomi kľúčmi',
      'Zavolaj chain s otázkou AJ históriou: <code>invoke({"input": ..., "chat_history": historia})</code> a vypíš odpoveď.',
      `# rag_chain máš zložený
historia = []
# tvoj kód...`,
      [['"input"', "'input'"], ['"chat_history": historia', "'chat_history': historia"], ['["answer"]', "['answer']"]],
      'Chain s pamäťou potrebuje OBA kľúče — chat_history aj pri prázdnej histórii.',
      `historia = []
vysledok = rag_chain.invoke({
    "input": "Koľko dní dovolenky mám?",
    "chat_history": historia,
})
print(vysledok["answer"])`),
    W('Test nadväznosti napevno',
      'Bez slučky over kľúčovú schopnosť: polož „Koľko dní dovolenky mám?", appendni výmenu a potom „A môžem si ich preniesť?" — druhá odpoveď musí byť o dovolenke!',
      `from langchain_core.messages import HumanMessage, AIMessage
# rag_chain máš zložený
historia = []
# tvoj kód...`,
      [['A môžem si ich preniesť', 'môžem si ich preniesť'], ['.append(HumanMessage'], ['.append(AIMessage'], ['["answer"]', "['answer']"]],
      'Medzi otázkami appendni HumanMessage(otázka) aj AIMessage(v["answer"]) — inak druhé kolo históriu nemá.',
      `from langchain_core.messages import HumanMessage, AIMessage

historia = []

o1 = "Koľko dní dovolenky mám?"
v1 = rag_chain.invoke({"input": o1, "chat_history": historia})
print("1:", v1["answer"])
historia.append(HumanMessage(content=o1))
historia.append(AIMessage(content=v1["answer"]))

o2 = "A môžem si ich preniesť?"
v2 = rag_chain.invoke({"input": o2, "chat_history": historia})
print("2:", v2["answer"])`),
    W('Plná konverzačná slučka',
      'Zlož finálneho bota: slučka + rag_chain s históriou + appendy z <code>vysledok["answer"]</code> (nie z objektu!).',
      `from langchain_core.messages import HumanMessage, AIMessage
# rag_chain máš zložený
# tvoj kód...`,
      [['while True'], ['break'], ['"chat_history": historia', "'chat_history': historia"], ['AIMessage(content=vysledok["answer"]', "AIMessage(content=vysledok['answer']"]],
      'Pozor na detail: do AIMessage ide vysledok["answer"] — RAG chain vracia slovník.',
      `from langchain_core.messages import HumanMessage, AIMessage

historia = []
print("Bot: Pýtaj sa na smernice. ('koniec' = stop)")
while True:
    otazka = input("Ty: ")
    if otazka.lower() == "koniec":
        break
    vysledok = rag_chain.invoke({"input": otazka, "chat_history": historia})
    print("Bot:", vysledok["answer"])
    historia.append(HumanMessage(content=otazka))
    historia.append(AIMessage(content=vysledok["answer"]))`),
    W('Slučka so zdrojmi aj oknom',
      'Vylepši slučku: zdroje pod odpoveďou (set) a pamäťové okno <code>historia[-8:]</code> v invoke — produkčné návyky v jednom.',
      `# plnú slučku máš z predošlého cvičenia
# tvoj kód (uprav)...`,
      [['historia[-8:]'], ['metadata["source"]', "metadata['source']"], ['.join(']],
      '"chat_history": historia[-8:] + výpis zdrojov ako v lekcii 18.',
      `while True:
    otazka = input("Ty: ")
    if otazka.lower() == "koniec":
        break
    vysledok = rag_chain.invoke({"input": otazka, "chat_history": historia[-8:]})
    print("Bot:", vysledok["answer"])
    zdroje = {d.metadata["source"] for d in vysledok["context"]}
    print("   📎", ", ".join(zdroje))
    historia.append(HumanMessage(content=otazka))
    historia.append(AIMessage(content=vysledok["answer"]))`),
    W('Funkcia spusti_konverzaciu()',
      'Napíš funkciu <code>spusti_konverzaciu(otazky)</code>: dostane ZOZNAM otázok, prejde ich cyklom s udržiavanou históriou a vráti zoznam odpovedí. Otestuj trojicou nadväzujúcich otázok.',
      `from langchain_core.messages import HumanMessage, AIMessage
# rag_chain máš zložený
# tvoj kód...`,
      [['def spusti_konverzaciu'], ['for '], ['.append(HumanMessage'], ['.append(AIMessage'], ['return']],
      'Vnútri: historia = [], odpovede = [] → cyklus s invoke + appendmi → return odpovede. Ideálne na testovanie!',
      `from langchain_core.messages import HumanMessage, AIMessage

def spusti_konverzaciu(otazky):
    historia = []
    odpovede = []
    for otazka in otazky:
        v = rag_chain.invoke({"input": otazka, "chat_history": historia})
        odpovede.append(v["answer"])
        historia.append(HumanMessage(content=otazka))
        historia.append(AIMessage(content=v["answer"]))
    return odpovede

for o in spusti_konverzaciu([
    "Aká je záručná doba?",
    "A dá sa predĺžiť?",
    "Koľko to stojí?",
]):
    print("•", o)`),
  ];

  /* ── l20: streamlit ── */
  window.EXTRA_WRITE.l20 = [
    W('Prvá stránka',
      'Napíš minimálnu Streamlit appku: <code>st.title</code> s názvom a <code>st.write</code> s uvítaním. (Spúšťa sa cez streamlit run app.py.)',
      `import streamlit as st
# tvoj kód...`,
      [['st.title('], ['st.write(']],
      'Dva riadky — a máš webstránku. Streamlit ju vykreslí zhora nadol.',
      `import streamlit as st

st.title("🦜 Moja prvá AI appka")
st.write("Vitaj! Toto je Streamlit v akcii.")`),
    W('Echo s walrusom',
      'Pridaj <code>st.chat_input</code> s mrožím operátorom <code>:=</code> — čo používateľ napíše, vypíš cez <code>st.write</code>.',
      `import streamlit as st

st.title("Echo appka")
# tvoj kód...`,
      [['st.chat_input('], [':='], ['st.write(']],
      'if sprava := st.chat_input("Napíš…"): st.write(f"Napísal si: {sprava}").',
      `import streamlit as st

st.title("Echo appka")

if sprava := st.chat_input("Napíš niečo…"):
    st.write(f"Napísal si: {sprava}")`),
    W('Chatové bubliny',
      'Vykresli vstup v bubline používateľa a odpoveď (zatiaľ echo) v bubline asistenta — cez <code>with st.chat_message(...)</code> bloky.',
      `import streamlit as st

st.title("Bublinkový chat")
# tvoj kód...`,
      [['st.chat_message("user")', "st.chat_message('user')"], ['st.chat_message("assistant")', "st.chat_message('assistant')"], ['with ']],
      'with st.chat_message("user"): st.write(sprava) — blok kreslí do bubliny s avatarom.',
      `import streamlit as st

st.title("Bublinkový chat")

if sprava := st.chat_input("Napíš…"):
    with st.chat_message("user"):
        st.write(sprava)
    with st.chat_message("assistant"):
        st.write(f"Echo: {sprava}")`),
    W('Pamäť, ktorá prežije rerun',
      'Inicializuj históriu v <code>st.session_state</code> vzorom <code>if "historia" not in st.session_state:</code> a vypíš počet správ v nej.',
      `import streamlit as st
# tvoj kód...`,
      [['if "historia" not in st.session_state', "if 'historia' not in st.session_state"], ['st.session_state.historia = []'], ['len(']],
      'Inicializácia prebehne len raz — pri rerunoch už kľúč existuje.',
      `import streamlit as st

if "historia" not in st.session_state:
    st.session_state.historia = []

st.write(f"Správ v pamäti: {len(st.session_state.historia)}")`),
    W('Vykresli históriu',
      'Po inicializácii vykresli CELÚ históriu cyklom — pre každú uloženú dvojicu <code>(rola, text)</code> bublinu správneho typu.',
      `import streamlit as st

if "historia" not in st.session_state:
    st.session_state.historia = []
# tvoj kód...`,
      [['for '], ['in st.session_state.historia'], ['st.chat_message(']],
      'for rola, text in st.session_state.historia: with st.chat_message(rola): st.write(text).',
      `import streamlit as st

if "historia" not in st.session_state:
    st.session_state.historia = []

for rola, text in st.session_state.historia:
    with st.chat_message(rola):
        st.write(text)`),
    W('Napoj AI model',
      'Spoj všetko: vstup → bublina user → <code>model.invoke</code> → bublina assistant → APPEND oboch správ do session_state (ako dvojice).',
      `import streamlit as st
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI

load_dotenv()
model = ChatOpenAI(model="gpt-4o-mini")

if "historia" not in st.session_state:
    st.session_state.historia = []

for rola, text in st.session_state.historia:
    with st.chat_message(rola):
        st.write(text)
# tvoj kód...`,
      [[':='], ['model.invoke('], ['.append(("user"', ".append(('user'"], ['.append(("assistant"', ".append(('assistant'"]],
      'Append dvojíc: ("user", otazka) a ("assistant", odpoved) — pri rerune sa z nich vykreslí história.',
      `if otazka := st.chat_input("Napíš správu…"):
    with st.chat_message("user"):
        st.write(otazka)
    odpoved = model.invoke(otazka).content
    with st.chat_message("assistant"):
        st.write(odpoved)
    st.session_state.historia.append(("user", otazka))
    st.session_state.historia.append(("assistant", odpoved))`),
    W('Spinner počas čakania',
      'Obal volanie modelu do <code>with st.spinner("Premýšľam…"):</code> — používateľ vidí, že sa niečo deje.',
      `# appku z predošlého cvičenia máš pripravenú
# tvoj kód (uprav volanie)...`,
      [['st.spinner('], ['model.invoke(']],
      'with st.spinner("Premýšľam…"): odpoved = model.invoke(otazka).content — invoke MUSÍ byť v bloku.',
      `if otazka := st.chat_input("Napíš správu…"):
    with st.chat_message("user"):
        st.write(otazka)
    with st.spinner("Premýšľam…"):
        odpoved = model.invoke(otazka).content
    with st.chat_message("assistant"):
        st.write(odpoved)`),
    W('Bočný panel s osobnosťou',
      'Pridaj <code>st.sidebar</code> so <code>st.selectbox</code> („Osobnosť": Formálny / Kamarát / Pirát) a vybranú osobnosť vlož do system správy modelu.',
      `import streamlit as st
# tvoj kód...`,
      [['st.sidebar'], ['st.selectbox(', 'selectbox('], ['Pirát', 'pirát']],
      'with st.sidebar: osobnost = st.selectbox("Osobnosť", [...]) — a osobnost použi v prompte.',
      `import streamlit as st

with st.sidebar:
    osobnost = st.selectbox("Osobnosť bota", ["Formálny", "Kamarát", "Pirát"])
    st.write(f"Aktívna: {osobnost}")

system_spravy = {
    "Formálny": "Odpovedáš formálne a vecne.",
    "Kamarát": "Odpovedáš uvoľnene a tykáš.",
    "Pirát": "Odpovedáš ako pirát, arrr!",
}
st.write("System správa:", system_spravy[osobnost])`),
    W('Tlačidlo novej konverzácie',
      'Pridaj do sidebaru <code>st.button("🗑️ Nová konverzácia")</code>: po kliknutí vyčisti históriu v session_state a zavolaj <code>st.rerun()</code>.',
      `import streamlit as st

if "historia" not in st.session_state:
    st.session_state.historia = []
# tvoj kód...`,
      [['st.button('], ['st.session_state.historia = []', '.historia.clear()'], ['st.rerun()']],
      'if st.button(...): st.session_state.historia = [] → st.rerun() prekreslí stránku načisto.',
      `import streamlit as st

if "historia" not in st.session_state:
    st.session_state.historia = []

with st.sidebar:
    st.write(f"Správ: {len(st.session_state.historia)}")
    if st.button("🗑️ Nová konverzácia"):
        st.session_state.historia = []
        st.rerun()`),
  ];
})();
