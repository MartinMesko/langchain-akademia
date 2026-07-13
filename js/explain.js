/* ============================================================
   ROZBORY KÓDU + PYTHON OKIENKA
   Pre menej znalých Pythonu: ku kľúčovému PyCharm príkladu každej
   lekcie sa vloží karta „Rozbor kódu riadok po riadku" a fialové
   „Python okienko" vysvetľujúce jazykový koncept na mieste výskytu.
   Formát: CODE_EXPLAIN[lekcia] = { pc: <poradie PyCharm bloku od 0>,
   rows: [[kúsok kódu, vysvetlenie], …] }.
   app.js tieto dáta injektuje do lekcie pri vykreslení.
   ============================================================ */

window.CODE_EXPLAIN = {

  l1: { pc: 1, rows: [
    ['import os', 'Požičaj si celú knižnicu <code>os</code> (práca s operačným systémom). Jej funkcie potom voláš s predponou: <code>os.getenv(...)</code>.'],
    ['from dotenv import load_dotenv', 'Z knižnice <code>dotenv</code> (ktorú sme nainštalovali cez pip) vytiahni jednu konkrétnu funkciu — <code>load_dotenv</code>. Vďaka „from" ju voláme priamo, bez predpony.'],
    ['load_dotenv()', 'Zavolaj tú funkciu (zátvorky = vykonaj!). Prečíta súbor <code>.env</code> a jeho riadky KEY=hodnota sprístupní programu ako „premenné prostredia".'],
    ['api_key = os.getenv("OPENAI_API_KEY")', 'Do škatuľky <code>api_key</code> ulož hodnotu premennej prostredia s týmto menom. Ak neexistuje, uloží sa <code>None</code> („nič").'],
    ['if api_key:', 'Rozhodovanie: ak v škatuľke NIEČO je (nie je None ani prázdny text), vykonaj odsadený blok pod tým. Prázdno sa v podmienke počíta ako „nepravda".'],
    ['api_key[:10] + "..."', 'Hranaté zátvorky s dvojbodkou = „výrez": prvých 10 znakov textu. Plus <code>+</code> texty zlepí dokopy — kľúč tak vypíšeme bezpečne, len jeho začiatok.'],
    ['else:', '„Inak" — vetva, ktorá sa vykoná, keď podmienka v <code>if</code> neplatila (kľúč sa nenašiel).']
  ]},

  l2: { pc: 0, rows: [
    ['from langchain_openai import ChatOpenAI', 'Z knižnice <code>langchain_openai</code> vytiahni triedu <code>ChatOpenAI</code> — „výrobnú formu" na modely OpenAI. Triedy spoznáš podľa VeľkýchPísmen.'],
    ['load_dotenv()', 'Načítaj .env súbor — LangChain si z prostredia potom sám vezme tvoj <code>OPENAI_API_KEY</code>. Preto ho v kóde nikde nevidíš!'],
    ['model = ChatOpenAI(model="gpt-4o-mini")', 'Vyrob z formy jeden konkrétny objekt a ulož ho do škatuľky <code>model</code>. V zátvorkách je „pomenovaný parameter": nastavenie <code>model</code> dostane hodnotu <code>"gpt-4o-mini"</code>.'],
    ['odpoved = model.invoke("Vysvetli...")', 'Bodka = siahni do objektu; <code>invoke(...)</code> = stlač tlačidlo „spýtaj sa". Program tu POČKÁ, kým zo serverov OpenAI nepríde celá odpoveď, a uloží ju do <code>odpoved</code>.'],
    ['print(odpoved.content)', '<code>odpoved</code> nie je obyčajný text, ale objekt AIMessage. Samotný text odpovede je na jeho „displeji" <code>.content</code> — bez zátvoriek, lebo len čítame hodnotu.']
  ]},

  l3: { pc: 1, rows: [
    ['from langchain_core.prompts import ChatPromptTemplate', 'Šablóny bývajú v balíku <code>langchain_core</code> — jadre LangChainu. Vyťahujeme triedu na chatové šablóny.'],
    ['ChatPromptTemplate.from_messages([...])', 'Volanie „vyrábacej" metódy priamo na triede: zo zoznamu správ (všimni si hranaté zátvorky = zoznam!) vyrobí šablónu.'],
    ['("system", "Si skúsený učiteľ... {styl}...")', 'Dvojica v okrúhlych zátvorkách (tzv. tuple): prvá hodnota je rola správy, druhá jej text. <code>{styl}</code> je okienko — NIE f-string! Hodnota sa dosadí až pri invoke().'],
    ['prompt = sablona.invoke({ ... })', 'Šablóne pošleš slovník: kľúč <code>"styl"</code> naplní okienko <code>{styl}</code>, kľúč <code>"tema"</code> okienko <code>{tema}</code>. Mená musia sedieť na znak presne.'],
    ['odpoved = model.invoke(prompt)', 'Hotový prompt (objekt PromptValue) pošleš rovno modelu. Dva kroky — šablóna a model — v ďalšej lekcii spojíme do jedného chainu.']
  ]},

  l4: { pc: 1, rows: [
    ['from langchain_core.messages import SystemMessage, HumanMessage, AIMessage', 'Jedným riadkom vytiahneš z knižnice viac vecí naraz — oddeľujú sa čiarkami. Tri triedy = tri druhy správ.'],
    ['historia = [', 'Začiatok ZOZNAMU (hranatá zátvorka). Python číta ďalej, kým zoznam neuzavrieš — pokojne cez viac riadkov.'],
    ['SystemMessage(content="Si stručný asistent.")', 'Vyrob objekt správy. <code>content=</code> je pomenovaný parameter — text správy. System správa = pravidlá hry pre model.'],
    ['HumanMessage(...), AIMessage(...)', 'Striedanie: čo povedal človek, čo odpovedala AI. Tieto objekty ukladáme do zoznamu presne v poradí konverzácie.'],
    ['odpoved = model.invoke(historia)', 'Modelu tentoraz nepošleš text, ale CELÝ zoznam správ. Len vďaka tomu „vie", ako sa voláš — z histórie, nie z pamäte.']
  ]},

  l5: { pc: 0, rows: [
    ['from langchain_core.output_parsers import StrOutputParser', 'Parser = „vybaľovač": z objektu AIMessage vytiahne čistý text. Str = string.'],
    ['prompt = ChatPromptTemplate.from_messages([...])', 'Prvý článok reťaze: šablóna s okienkami <code>{firma}</code> a <code>{produkt}</code>.'],
    ['parser = StrOutputParser()', 'Vyrob objekt parsera — zátvorky sú prázdne, lebo nič nenastavujeme. Aj tak ich treba: bez nich by si mal len „formu", nie výrobok.'],
    ['chain = prompt | model | parser', 'Hviezda večera: zvislá čiara <code>|</code> zlepí tri objekty do jednej rúry. Výstup ľavého tečie ako vstup pravého: slovník → správy → AIMessage → čistý text.'],
    ['slogan = chain.invoke({"firma": ..., "produkt": ...})', 'Celú rúru spustíš JEDNÝM volaním. Slovník naplní okienka šablóny a na konci vypadne hotový string — žiadne .content už netreba, to vybavil parser.']
  ]},

  l6: { pc: 0, rows: [
    ['parser = CommaSeparatedListOutputParser()', 'Parser, ktorý text „a, b, c" rozseká na skutočný Python zoznam <code>["a", "b", "c"]</code>.'],
    ['("system", "Odpovedáš presne podľa formátu: {format_instructions}")', 'Do system správy vložíme okienko na inštrukcie o formáte — model sa musí dozvedieť, AKO má odpovedať.'],
    ['.partial(format_instructions=parser.get_format_instructions())', 'Reťazenie bodiek číta sa zľava: zo šablóny urob verziu s VOPRED dosadeným okienkom. <code>get_format_instructions()</code> vygeneruje text typu „odpovedz hodnotami oddelenými čiarkami".'],
    ['chain = prompt | model | parser', 'Rúra ako v minulej lekcii — len na konci sedí iný parser, takže z nej vypadne zoznam.'],
    ['ingrediencie = chain.invoke({"jedlo": "palacinky"})', 'Posielame už len <code>{jedlo}</code> — format_instructions sme „predvyplnili" cez partial.'],
    ['len(ingrediencie), ingrediencie[0]', 'Dôkaz, že máme ozajstný zoznam: vieme ho spočítať a siahnuť na prvú položku indexom [0].']
  ]},

  l7: { pc: 1, rows: [
    ['from langchain_core.runnables import RunnableParallel, RunnableLambda', 'Dve pomôcky LCEL: paralelné vetvenie a obal na vlastné funkcie.'],
    ['chain_vtip = ChatPromptTemplate.from_template(...) | model | parser', 'Celý chain vyrobený „na jeden nádych" — šablónu netreba ukladať do premennej, rovno ju zapojíš do rúry.'],
    ['paralel = RunnableParallel(vtip=chain_vtip, fakt=chain_fakt)', 'Dva pomenované parametre = dve vetvy. Obe dostanú TEN ISTÝ vstup a pobežia naraz. Mená parametrov (vtip, fakt) si volíš sám.'],
    ['vysledok["vtip"]', 'Paralel vracia slovník — hodnoty vytiahneš kľúčmi, ktoré si zvolil o riadok vyššie.'],
    ['na_velke = RunnableLambda(lambda text: text.upper())', '<code>lambda</code> = mini-funkcia bez mena: „dostaneš text, vráť ho veľkými písmenami". RunnableLambda ju obalí, aby sa dala zapojiť do rúry cez |.'],
    ['chain_krik = chain_vtip | na_velke', 'A dôkaz skladačky: hotový chain + vlastná funkcia = nový chain. Všetko, čo má invoke, sa dá reťaziť.']
  ]},

  l8: { pc: 1, rows: [
    ['@tool', 'Dekorátor — „nálepka" nad definíciou funkcie. Hovorí: obal túto funkciu a sprav z nej nástroj, ktorému bude AI rozumieť (bude mať meno, popis, zoznam argumentov).'],
    ['def vynasob(a: float, b: float) -> float:', 'Obyčajná funkcia s typovými anotáciami. <code>float</code> = desatinné číslo. Z anotácií LangChain zistí, AKÉ argumenty má model posielať.'],
    ['"""Presne vynásobí dve čísla a a b."""', 'Docstring = návod pre MODEL. Podľa tohto popisu sa AI rozhodne, kedy nástroj použiť. Píš ho poctivo!'],
    ['model_s_nastrojmi = model.bind_tools([vynasob])', '„Prilep" modelu zoznam nástrojov (hranaté zátvorky = zoznam, aj keď je nástroj len jeden). Vznikne NOVÝ objekt modelu — pôvodný sa nemení.'],
    ['odpoved.tool_calls', 'Namiesto textovej odpovede model vrátil ŽIADOSŤ: „zavolajte nástroj vynasob s a=25, b=17". Je to zoznam slovníkov — model totiž môže chcieť aj viac nástrojov naraz.'],
    ['volanie = odpoved.tool_calls[0]', 'Vyber prvú (index 0) žiadosť zo zoznamu.'],
    ['vynasob.invoke(volanie["args"])', 'Spusti nástroj s argumentmi od modelu — <code>volanie["args"]</code> je slovník <code>{"a": 25, "b": 17}</code>. Model si NIKDY nespúšťa nástroje sám; robíme to my.']
  ]},

  l9: { pc: 0, rows: [
    ['@tool + def aktualny_datum() -> str:', 'Nástroj č. 1 — funkcia bez parametrov (prázdne zátvorky), vracia text. Docstring hovorí modelu: „použi pri otázkach o dnešku".'],
    ['nastroje = [aktualny_datum, vynasob]', 'Zoznam nástrojov. Všimni si: BEZ zátvoriek! Neodovzdávame výsledky funkcií, ale funkcie samotné — ako keby si podal kolegovi celé náradie, nie výrobok.'],
    ['MessagesPlaceholder("agent_scratchpad")', 'Rezervované miesto v prompte — „zápisník" agenta. Sem si executor priebežne zapisuje, ktoré nástroje agent skúsil a čo z nich vypadlo.'],
    ['agent = create_tool_calling_agent(model, nastroje, prompt)', 'Zlep dokopy mozog agenta: model + nástroje + prompt. Toto ešte nič nespúšťa — je to len plán.'],
    ['executor = AgentExecutor(agent=agent, tools=nastroje, verbose=True)', 'Telo agenta: točí slučku mysli→konaj→pozoruj, reálne spúšťa nástroje. <code>verbose=True</code> = vypisuj každý krok do konzoly (skvelé na učenie!).'],
    ['vysledok = executor.invoke({"input": "..."})', 'Otázka ide do slovníka pod kľúč <code>"input"</code> — presne ten čaká prompt v okienku <code>{input}</code>.'],
    ['vysledok["output"]', 'Executor vracia slovník; finálna odpoveď agenta je pod kľúčom <code>"output"</code>.']
  ]},

  l11: { pc: 0, rows: [
    ['from langchain_community.document_loaders import TextLoader', 'Loadery bývajú v „komunitnom" balíku — inštaluje sa zvlášť: <code>pip install langchain-community</code>.'],
    ['loader = TextLoader("smernica.txt", encoding="utf-8")', 'Vyrob loader pre konkrétny súbor. <code>encoding="utf-8"</code> zaručí správne načítanie diakritiky (ľščťž) — bez toho môžu byť znaky rozsypané.'],
    ['dokumenty = loader.load()', 'Až <code>.load()</code> súbor skutočne prečíta. Vráti ZOZNAM objektov Document — preto ďalej pracujeme s <code>dokumenty[0]</code>.'],
    ['dokumenty[0].metadata', 'Prvý dokument zo zoznamu (index 0) a jeho „štítok" — slovník s informáciou o zdroji. Vďaka nemu vie bot neskôr citovať, ODKIAĽ odpoveď má.'],
    ['dokumenty[0].page_content[:80]', 'Samotný text dokumentu, orezaný výrezom <code>[:80]</code> na prvých 80 znakov — nech výpis nezaplaví konzolu.']
  ]},

  l12: { pc: 0, rows: [
    ['splitter = RecursiveCharacterTextSplitter(', 'Vyrábame „sekáčik" textov. Nastavenia mu dávame ako pomenované parametre — kód sa vďaka menám číta sám.'],
    ['chunk_size=300,', 'Maximálna dĺžka jedného kúsku: 300 ZNAKOV (nie slov!).'],
    ['chunk_overlap=50,', 'Susedné kúsky sa prekryjú o ~50 znakov — koniec jedného sa zopakuje na začiatku ďalšieho, aby sa myšlienka nerozsekla napoly.'],
    ['chunky = splitter.split_documents(dokumenty)', 'Zožer zoznam Documentov, vráť zoznam MENŠÍCH Documentov. Metadáta (zdroj) sa automaticky skopírujú do každého kúska.'],
    ['for i, ch in enumerate(chunky[:3]):', 'Cyklus cez prvé tri kúsky. <code>enumerate</code> ti popri položke dáva aj jej poradové číslo — preto dve premenné: <code>i</code> (číslo) a <code>ch</code> (kúsok).'],
    ['f"--- chunk {i} ({len(ch.page_content)} znakov) ---"', 'f-string s dvoma okienkami: číslo kúska a jeho dĺžka. Okienko zvládne aj volanie funkcie ako len().']
  ]},

  l13: { pc: 1, rows: [
    ['def kosinus(a: list[float], b: list[float]) -> float:', 'Vlastná funkcia na podobnosť dvoch vektorov. Anotácia <code>list[float]</code> = zoznam desatinných čísel.'],
    ['sum(x * y for x, y in zip(a, b))', 'Tri veci naraz: <code>zip(a, b)</code> spáruje čísla z oboch zoznamov (prvé s prvým, druhé s druhým…), <code>x * y</code> ich vynásobí a <code>sum()</code> súčiny sčíta. Matematicky: skalárny súčin.'],
    ['math.sqrt(sum(x * x for x in a))', 'Druhá odmocnina súčtu štvorcov = „dĺžka" vektora. <code>math.sqrt</code> je odmocnina z knižnice math.'],
    ['vektory = embeddings.embed_documents(vety)', 'Pošli VŠETKY vety naraz — vráti sa zoznam vektorov v rovnakom poradí. Lacnejšie a rýchlejšie než volať embed_query trikrát.'],
    ['round(kosinus(vektory[0], vektory[1]), 3)', 'Porovnaj prvý a druhý vektor a výsledok zaokrúhli na 3 desatinné miesta — <code>round(číslo, počet_miest)</code>.']
  ]},

  l14: { pc: 0, rows: [
    ['dokumenty = TextLoader(...).load()', 'Skratka reťazením: vyrob loader a HNEĎ zavolaj load — bez ukladania loadera do premennej. Číta sa zľava doprava.'],
    ['chunky = splitter.split_documents(dokumenty)', 'Krok 2 pipeline: dokumenty → kúsky (lekcia 12).'],
    ['embeddings = OpenAIEmbeddings(model="text-embedding-3-small")', 'Objekt, ktorý bude texty prevádzať na vektory. Iný model než chat — tento „nerozpráva", len meria význam.'],
    ['db = Chroma.from_documents(', 'Jedno volanie = celé indexovanie: každý chunk sa embedne a uloží aj s vektorom do databázy.'],
    ['documents=chunky, embedding=embeddings,', 'Pomenované parametre: ČO uložiť a ČÍM to previesť na vektory.'],
    ['persist_directory="./chroma_db",', 'Kam na disk databázu uložiť. <code>./</code> znamená „v aktuálnom priečinku projektu". Vďaka tomu prežije vypnutie programu.'],
    ['f"Zaindexovaných {len(chunky)} chunkov..."', 'Kontrolný výpis — vždy si over, koľko kúskov sa reálne uložilo.']
  ]},

  l15: { pc: 1, rows: [
    ['retriever = db.as_retriever(search_kwargs={"k": 3})', 'Z databázy vyrob „podávača dokumentov". Slovník <code>search_kwargs</code> nesie nastavenia hľadania; <code>"k": 3</code> = vracaj vždy 3 najpodobnejšie kúsky.'],
    ['("system", "Odpovedaj IBA na základe kontextu... {context}")', 'System správa s okienkom <code>{context}</code> — sem chain automaticky vloží nájdené dokumenty. Inštrukcia „IBA z kontextu" je poistka proti vymýšľaniu.'],
    ['("human", "{input}")', 'Okienko na otázku používateľa. Mená context a input NIE SÚ ľubovoľné — očakávajú ich funkcie nižšie.'],
    ['dokumentovy_chain = create_stuff_documents_chain(model, prompt)', 'Hotový staviteľ: vyrobí chain, ktorý dokumenty „napchá" (stuff) do {context} a zavolá model.'],
    ['rag_chain = create_retrieval_chain(retriever, dokumentovy_chain)', 'Druhý staviteľ zapojí pred to retriever: otázka → nájdi kúsky → odpovedz z nich. Celý RAG v jednom objekte.'],
    ['vysledok["answer"]', 'Výstup je slovník: pod <code>"answer"</code> je odpoveď…'],
    ['[d.metadata["source"] for d in vysledok["context"]]', '…a pod <code>"context"</code> použité dokumenty. Tento zápis (list comprehension) vyrobí zoznam zdrojov — vysvetlenie v okienku nižšie.']
  ]},

  l16: { pc: 0, rows: [
    ['chain = prompt | ChatOpenAI(...) | StrOutputParser()', 'Chain pripravíme RAZ, pred slučkou. Vyrábať ho v každom kole by bolo zbytočné plytvanie.'],
    ['while True:', 'Nekonečná slučka — bot čaká na otázky, kým ho neukončíš. Detailný rozbor v prípravnej lekcii B!'],
    ['otazka = input("Ty: ")', 'Zastav a čakaj, kým používateľ napíše text a stlačí Enter.'],
    ['if otazka.lower() in ("koniec", "exit", "quit"):', 'Šikovný trik: <code>in</code> skontroluje, či je text JEDNÝM z viacerých ukončovacích slov. <code>.lower()</code> zabezpečí, že zaberie aj „KONIEC".'],
    ['break', 'Vyskoč zo slučky — jediná cesta von z while True.'],
    ['odpoved = chain.invoke({"otazka": otazka})', 'Každé kolo = nové volanie chainu. Kľúč slovníka sedí s okienkom {otazka} v šablóne.']
  ]},

  l17: { pc: 0, rows: [
    ['MessagesPlaceholder("chat_history")', 'Do prostriedku šablóny vložíme „zásuvku" — pri každom volaní sa do nej vysype celý zoznam doterajších správ.'],
    ['historia = []', 'Prázdny zoznam = čistá pamäť bota. Vytvára sa RAZ, pred slučkou — keby bol vnútri, každé kolo by pamäť vymazalo!'],
    ['chain.invoke({"chat_history": historia, "otazka": otazka})', 'Slovník s DVOMA kľúčmi: zoznam správ pre zásuvku + aktuálna otázka pre okienko. Model tak vidí celú konverzáciu.'],
    ['historia.append(HumanMessage(content=otazka))', 'Po odpovedi zapíš do pamäte, čo povedal človek… (<code>.append</code> pridáva na koniec zoznamu — lekcia A!)'],
    ['historia.append(AIMessage(content=odpoved))', '…aj čo odpovedal bot. V ďalšom kole to už model uvidí v zásuvke — presne takto vzniká „pamäť".']
  ]},

  l18: { pc: 0, rows: [
    ['db = Chroma(persist_directory="./chroma_db", embedding_function=embeddings)', 'OTVOR existujúcu databázu z disku (žiadne nové indexovanie, žiadne poplatky). Porovnaj s from_documents — to je VYTVOR.'],
    ['("system", "... Ak odpoveď nie je v kontexte, povedz: \'V smerniciach som to nenašiel.\'...")', 'Poistka proti halucináciám priamo v pravidlách: bot dostal povolené priznať „neviem". Bez tejto vety by si radšej vymýšľal.'],
    ['rag_chain = create_retrieval_chain(retriever, create_stuff_documents_chain(model, prompt))', 'Dva staviteľské kroky z lekcie 15 vnorené do seba — vnútorné volanie sa vyhodnotí prvé.'],
    ['zdroje = {d.metadata["source"] for d in vysledok["context"]}', 'Zložené zátvorky s for = SET (množina): ako zoznam, ale bez duplikátov. Tri chunky z jedného súboru → súbor sa vypíše len raz.'],
    ['", ".join(zdroje)', 'Zlep položky množiny do jedného textu s čiarkami medzi nimi. Číta sa: „lepidlom čiarka-medzera spoj zdroje".']
  ]},

  l19: { pc: 0, rows: [
    ['preformuluj_prompt = ChatPromptTemplate.from_messages([...])', 'Prvý prompt NEODPOVEDÁ na otázku! Jeho jediná úloha: z „A môžem si ich preniesť?" + histórie vyrobiť samostatnú otázku „Môžem si preniesť dni dovolenky?".'],
    ['ha_retriever = create_history_aware_retriever(model, retriever, preformuluj_prompt)', '„Retriever s pamäťou": najprv nechá model otázku preformulovať, AŽ POTOM hľadá v databáze. Rieši zámená ako „ich", „to", „tam".'],
    ['qa_prompt = ... ("system", "...{context}"), MessagesPlaceholder("chat_history"), ("human", "{input}")', 'Druhý prompt skladá finálnu odpoveď — dostane nájdené dokumenty AJ históriu AJ otázku. História je tu druhýkrát zámerne: kvôli plynulej nadväznosti odpovede.'],
    ['rag_chain = create_retrieval_chain(ha_retriever, create_stuff_documents_chain(model, qa_prompt))', 'Rovnaká stavba ako v lekcii 18 — len na mieste obyčajného retrievera sedí ten „s pamäťou".'],
    ['rag_chain.invoke({"input": otazka, "chat_history": historia})', 'Chain potrebuje oboje: otázku aj históriu. Históriu po každom kole dopĺňame appendom — ako v lekcii 17.'],
    ['historia.append(AIMessage(content=vysledok["answer"]))', 'Pozor na detail: odpoveď berieme zo slovníka pod kľúčom "answer", nie priamo — RAG chain vracia slovník.']
  ]},

  l20: { pc: 0, rows: [
    ['import streamlit as st', '„as st" = prezývka: knižnicu budeme volať krátko <code>st</code> namiesto dlhého streamlit. Bežná konvencia.'],
    ['if "historia" not in st.session_state:', 'Session_state je slovník, ktorý PREŽÍVA reruny stránky. Podmienka „ak tam ešte nie je kľúč historia" zabezpečí, že pamäť sa založí len pri PRVOM spustení.'],
    ['for sprava in st.session_state.historia:', 'Streamlit prekresľuje stránku celú odznova — preto musíme pri každom rerune nakresliť celú doterajšiu konverzáciu z pamäte.'],
    ['rola = "user" if isinstance(sprava, HumanMessage) else "assistant"', 'Jednoriadkový if: „user", AK je správa od človeka, INAK „assistant". <code>isinstance</code> = „je tento objekt daného typu?".'],
    ['if otazka := st.chat_input("Napíš správu…"):', 'Operátor <code>:=</code> (mrož 🦭): priraď A ZÁROVEŇ otestuj v jednej podmienke. Blok sa vykoná, len keď používateľ niečo odoslal.'],
    ['with st.chat_message("user"):', '<code>with</code> blok = „všetko odsadené vnútri kresli do tejto bubliny". Rola určuje avatar a zarovnanie.'],
    ['st.session_state.historia.append(...)', 'Nové správy pridaj do PREŽÍVAJÚCEJ pamäte — do obyčajnej premennej by sa pri ďalšom rerune stratili.']
  ]},

  l21: { pc: 1, rows: [
    ['from langchain_ollama import ChatOllama', 'Iná integrácia, rovnaká filozofia: každý poskytovateľ modelov má svoj balíček (langchain_openai, langchain_ollama…).'],
    ['model = ChatOllama(model="llama3.2", temperature=0.7)', 'Jediný riadok, ktorý sa mení oproti OpenAI verzii! Objekt má rovnaké „tlačidlá" (invoke, stream), tak zvyšok kódu funguje bez zmeny.'],
    ['# Žiadny API kľúč, žiadny load_dotenv!', 'Model beží u teba — nie je koho žiadať o prístup ani komu platiť. Preto v kóde chýba celá .env mašinéria.'],
    ['chain = prompt | model | StrOutputParser()', 'Presne tá istá rúra ako pri OpenAI. Toto je sila spoločného rozhrania: vymeníš súčiastku, rúra ostáva.']
  ]},

  l22: { pc: 0, rows: [
    ['LANGCHAIN_TRACING_V2=true', 'Riadok v .env (nie Python!). Hlavný vypínač: „posielaj záznamy o behu do LangSmith".'],
    ['LANGCHAIN_API_KEY=lsv2_pt_...', 'Tvoj kľúč zo smith.langchain.com — iný než OpenAI kľúč! Identifikuje TVOJ účet, kam sa záznamy ukladajú.'],
    ['LANGCHAIN_PROJECT=rag-chatbot-dev', 'Meno „priečinka" pre záznamy. Oddelíš si vývoj od produkcie alebo rôzne aplikácie.'],
    ['load_dotenv()  # načíta aj LangSmith premenné', 'Kúzlo je v tom, že v Python kóde NIE JE ŽIADNA zmena. LangChain si pri štarte prečíta prostredie, uvidí vypínač a začne logovať sám.']
  ]},

  l23: { pc: 0, rows: [
    ['from fastapi import FastAPI', 'FastAPI = populárny Python framework na webové API. LangServe na ňom stavia.'],
    ['app = FastAPI(title="Prekladač API", version="1.0")', 'Vyrob webovú aplikáciu. Title a version sa zobrazia v automatickej dokumentácii na /docs.'],
    ['add_routes(app, chain, path="/prekladac")', 'Jediný riadok od LangServe: k aplikácii pripoj chain na adrese /prekladac. Automaticky vzniknú /invoke, /batch, /stream aj testovacie UI /playground.'],
    ['if __name__ == "__main__":', 'Python idióm: „vykonaj len ak tento súbor SPÚŠŤAM priamo (nie importujem)". Chráni pred nechceným štartom servera pri importe — vysvetlenie v okienku nižšie.'],
    ['uvicorn.run(app, host="localhost", port=8000)', 'Uvicorn = webový server, ktorý appku reálne rozbehne. Port 8000 → API žije na http://localhost:8000.']
  ]}
};

/* ============================================================
   PYTHON OKIENKA — jazykové koncepty na mieste prvého výskytu
   ============================================================ */
window.PY_NOTES = {
  l1: [{ pc: 1, title: 'import vs. from-import', x: 'Dva zápisy požičiavania kódu: <code>import os</code> berie CELÚ knižnicu (funkcie voláš s predponou <code>os.getenv</code>), <code>from dotenv import load_dotenv</code> vytiahne JEDNU vec, ktorú voláš priamo. A pozor: <code>pip install</code> (inštalácia do počítača) a <code>import</code> (načítanie do programu) sú dva rôzne kroky — najprv nainštaluj, potom importuj.' }],
  l2: [{ pc: 0, title: 'Objekt, metóda, atribút', x: '<code>ChatOpenAI(...)</code> vyrobí OBJEKT — mysli na spotrebič. Bodkou siahaš dovnútra: <code>model.invoke("...")</code> so zátvorkami = stlač tlačidlo (METÓDA, akcia), <code>odpoved.content</code> bez zátvoriek = prečítaj displej (ATRIBÚT, hodnota). Toto pravidlo ti rozlúskne väčšinu LangChain kódu.' }],
  l3: [{ pc: 1, title: 'Slovník ako vstup', x: '<code>invoke({"styl": ..., "tema": ...})</code> — zložené zátvorky sú SLOVNÍK (lekcia A): dvojice kľúč→hodnota. Každý kľúč musí sedieť s okienkom v šablóne na znak presne. A rozdiel oproti f-stringu: šablóna nemá <code>f</code> pred úvodzovkou, lebo hodnoty sa dosádzajú AŽ pri invoke, nie hneď.' }],
  l4: [{ pc: 1, title: 'Zoznam objektov', x: '<code>historia = [SystemMessage(...), HumanMessage(...)]</code> — zoznam (hranaté zátvorky) nemusí obsahovať len texty či čísla; pokojne drží celé objekty správ. Poradie v zozname = poradie konverzácie, a <code>.append()</code> pridáva nové správy na koniec.' }],
  l5: [{ pc: 0, title: 'Ako môže | spájať chainy?', x: 'V bežnom Pythone je <code>|</code> operátor „alebo" pre čísla. Python ale dovoľuje triedam predefinovať si operátory (tzv. operator overloading) — a LangChain naučil svoje objekty, že <code>|</code> znamená „zreťaz ma s ďalším". Preto <code>prompt | model</code> nie je mágia, len šikovne využitá vlastnosť jazyka.' }],
  l6: [{ pc: 2, title: 'Trieda ako formulár (Pydantic)', x: '<code>class Recept(BaseModel):</code> definuje vlastný TYP dát — ako prázdny formulár s kolónkami (nazov: str, porcie: int…). Zápis <code>(BaseModel)</code> znamená „zdedí schopnosti od BaseModel" — a tie schopnosti sú práve kontrola vyplnenia: zlý typ v kolónke = okamžitá chyba. Preto je Pydantic parser taký spoľahlivý.' }],
  l7: [{ pc: 1, title: 'lambda — funkcia na jeden riadok', x: '<code>lambda text: text.upper()</code> je skratka za: <code>def bezmena(text): return text.upper()</code>. Pred dvojbodkou parametre, za ňou výraz, ktorý sa vráti. Používa sa na drobné jednorazové úpravy — na čokoľvek väčšie napíš poriadnu funkciu s def.' }],
  l8: [{ pc: 0, title: 'Dekorátor @ — nálepka nad funkciou', x: 'Riadok <code>@tool</code> tesne nad <code>def</code> funkciu „obalí": vezme ju a vráti vylepšenú verziu (tu: nástroj s menom, popisom a schémou argumentov). Preto má potom <code>vynasob.name</code> a <code>vynasob.invoke()</code> — obyčajná funkcia by ich nemala. Dekorátory sú v Pythone bežné; stačí vedieť, že „@ = obal a vylepši".' }],
  l12: [{ pc: 0, title: 'Výrezy [:3] a enumerate', x: '<code>chunky[:3]</code> je VÝREZ (slice): „daj mi prvé tri položky" — nič sa nemaže, len sa pozeráš na časť zoznamu. A <code>for i, ch in enumerate(...)</code> ti v cykle dáva DVE premenné naraz: poradové číslo aj samotnú položku.' }],
  l13: [{ pc: 1, title: 'zip a sum v jednom riadku', x: '<code>sum(x * y for x, y in zip(a, b))</code> — čítaj zvnútra: <code>zip</code> spáruje zoznamy ako zips na bunde (1. s 1., 2. s 2.…), <code>x * y</code> každý pár vynásobí a <code>sum</code> všetko sčíta. Python dovoľuje cyklus napísať priamo do funkcie — volá sa to generátorový výraz.' }],
  l15: [{ pc: 1, title: 'List comprehension', x: '<code>[d.metadata["source"] for d in vysledok["context"]]</code> = „vyrob NOVÝ zoznam: pre každý dokument d vezmi jeho zdroj". Je to skratka za trojriadkový for cyklus s .append(). Číta sa odzadu: for d in … → čo s každým d urobiť je vpredu.' }],
  l16: [{ pc: 0, title: 'while True, input(), break', x: 'Trojica z prípravnej lekcie B v ostrom nasadení: <code>while True</code> opakuje donekonečna, <code>input()</code> zastaví program a čaká na text od používateľa, <code>break</code> je jediná cesta von. Ak si lekciu B preskočil a toto ťa mätie — vráť sa k nej, je to 5 minút.' }],
  l18: [{ pc: 0, title: 'Množina { } a .join()', x: '<code>{d.metadata["source"] for d in ...}</code> vyzerá ako slovník, ale bez dvojbodiek je to MNOŽINA (set) — zoznam bez duplikátov. Ideálne na zdroje: tri chunky z jedného súboru = jeden zdroj. <code>", ".join(zdroje)</code> potom položky zlepí do textu — lepidlo (čiarka) sa píše PRED .join, čo býva prekvapenie.' }],
  l20: [{ pc: 0, title: 'Mrož := a blok with', x: 'Dve novinky naraz: <code>if otazka := st.chat_input(...)</code> priradí hodnotu A HNEĎ ju otestuje (operátor sa volá walrus — mrož, lebo := vyzerá ako očká a kly 🦭). A <code>with st.chat_message("user"):</code> otvára blok — všetko odsadené vnútri sa nakreslí do tej bubliny.' }],
  l23: [{ pc: 0, title: 'if __name__ == "__main__"', x: 'Každý Python súbor má skrytú premennú <code>__name__</code>. Keď súbor SPUSTÍŠ priamo (zeleným ▶), má hodnotu <code>"__main__"</code>; keď ho niekto IMPORTUJE, má meno súboru. Táto podmienka teda znamená: „server naštartuj len pri priamom spustení" — pri importe (napr. v testoch) sa nič nespustí.' }]
};
