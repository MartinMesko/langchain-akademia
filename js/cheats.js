/* ============================================================
   ŤAHÁK „KEDY ČO POUŽIŤ" — záchytné body ku každej lekcii
   Formát: LESSON_CHEATS[lekcia] = [[situácia, riešenie], …]
   Vykresľuje sa na stránke #/cheatsheet nad kódovými snippetmi.
   ============================================================ */
window.LESSON_CHEATS = {

  lA: [
    ['Ukladám text', 'Do úvodzoviek: <code>meno = "Martin"</code>. Číslo bez úvodzoviek, desatinné s bodkou (<code>0.7</code>).'],
    ['Záleží na poradí položiek (história, chunky)', 'Zoznam <code>[ ]</code> — prístup indexom od 0, pridávanie <code>.append()</code>.'],
    ['Pristupujem k hodnotám menovkou', 'Slovník <code>{"kľúč": hodnota}</code> — presne to žerie <code>invoke({...})</code> a vracia RAG chain.'],
    ['Skladám text z premenných HNEĎ', '<code>f"Ahoj {meno}"</code> — f-string dosadí okamžite.'],
    ['Text s {okienkami} na NESKÔR', 'Šablóna LangChainu — bez <code>f</code>! Dosadí až <code>invoke()</code>.'],
  ],

  lB: [
    ['Kód sa opakuje / chcem ho pomenovať', '<code>def funkcia(parametre):</code> — výsledok vracia <code>return</code> (print len zobrazuje!).'],
    ['Potrebujem celú knižnicu', '<code>import os</code> → voláš s predponou <code>os.getenv()</code>.'],
    ['Potrebujem jednu konkrétnu vec', '<code>from dotenv import load_dotenv</code> → voláš priamo. V kurze najčastejší zápis.'],
    ['Program má čakať na vstupy dokola', '<code>while True</code> + <code>input()</code> + <code>break</code> — kostra každého chatbota.'],
    ['Vidím bodku: <code>objekt.niečo</code>', 'So zátvorkami = metóda (akcia): <code>model.invoke()</code>. Bez = atribút (hodnota): <code>odpoved.content</code>.'],
  ],

  l1: [
    ['Kam s API kľúčom?', 'VŽDY do <code>.env</code> + <code>load_dotenv()</code>. Nikdy do kódu, nikdy do gitu.'],
    ['Nový projekt', 'Vlastný venv + <code>pip install langchain langchain-openai python-dotenv</code>.'],
    ['Premenná prostredia môže chýbať', '<code>os.getenv()</code> vráti <code>None</code> → over cez <code>if api_key:</code>.'],
    ['Chcem ukázať kľúč v logu', 'Len začiatok: <code>kluc[:8] + "…"</code> — nikdy celý.'],
  ],

  l2: [
    ['Ktorú triedu na model?', '<code>ChatOpenAI</code> — vždy (moderné chatmodely). <code>OpenAI</code> je legacy textový LLM.'],
    ['Fakty, extrakcia, RAG', '<code>temperature=0</code> — deterministické, opakovateľné.'],
    ['Kreatíva (slogany, príbehy)', '<code>temperature=0.7–1.2</code>.'],
    ['Celá odpoveď naraz vs. po kúskoch', '<code>invoke()</code> na spracovanie, <code>stream()</code> na UX ako ChatGPT.'],
    ['Kde je text a kde cena?', 'Text: <code>.content</code>. Tokeny/cena: <code>.response_metadata["token_usage"]</code>.'],
    ['Bojím sa dlhej (drahej) odpovede', '<code>max_tokens=…</code> — tvrdý strop výstupu.'],
  ],

  l3: [
    ['PromptTemplate vs. ChatPromptTemplate?', '<code>PromptTemplate</code> = jeden čistý text (jednoduché úlohy). <code>ChatPromptTemplate</code> = správy s rolami — štandard pre chatmodely, ber ho ako default.'],
    ['Jedna správa vs. viac správ', '<code>from_template("…")</code> pre jednu human správu; <code>from_messages([("system",…),("human",…)])</code> keď treba rolu/pravidlá.'],
    ['Časť hodnôt poznám vopred', '<code>.partial(jazyk="nemčina")</code> — pri invoke posielaš už len zvyšok.'],
    ['V prompte potrebujem literálne { }', 'Zdvoj ich: <code>{{"pole": "…"}}</code> — inak ich šablóna zje ako premennú.'],
    ['KeyError pri invoke', 'Kľúče slovníka ≠ názvy premenných v šablóne — musia sedieť na znak presne.'],
  ],

  l4: [
    ['Trvalé pravidlá, rola, tón', '<code>SystemMessage</code> — vždy PRVÁ v zozname. „Pracovná zmluva" modelu.'],
    ['Vstup používateľa', '<code>HumanMessage</code>.'],
    ['Odpoveď modelu / ukážky / história', '<code>AIMessage</code> — модель ju vracia, ale vkladáš ju aj ty (few-shot, pamäť).'],
    ['Výsledok nástroja späť modelu', '<code>ToolMessage(content=…, tool_call_id=…)</code>.'],
    ['Tuple ("system", "…") vs. trieda SystemMessage?', 'V šablónach tuple (kratšie); triedy keď správy skladáš dynamicky v kóde.'],
    ['Model má trafiť formát bez pravidiel', 'Few-shot: 2–5 ukážkových dvojíc Human→AI (pridaj aj negatívnu ukážku!).'],
  ],

  l5: [
    ['Kroky idú vždy v rovnakom poradí', 'Chain cez <code>|</code>: <code>prompt | model | parser</code>.'],
    ['Čo posielam do chain.invoke()?', 'Slovník — kľúče = premenné šablóny (prvého článku).'],
    ['Chcem string, nie AIMessage', 'Pridaj na koniec <code>StrOutputParser()</code>.'],
    ['Výstup chainu 1 → vstup chainu 2', 'Medzikus <code>(lambda x: {"premenna": x})</code> — prebalí string na slovník.'],
    ['V tutoriáli vidím LLMChain', 'Starý kód — v hlave prepíš na <code>prompt | model</code>.'],
  ],

  l6: [
    ['Stačí mi text', '<code>StrOutputParser</code> — default na koniec každého chat chainu.'],
    ['Chcem Python zoznam', '<code>CommaSeparatedListOutputParser</code>.'],
    ['Chcem slovník (extrakcia polí)', '<code>JsonOutputParser</code> — rýchle prototypy.'],
    ['Produkcia — na štruktúre záleží', '<code>PydanticOutputParser</code> + trieda <code>BaseModel</code> — validácia typov zadarmo.'],
    ['Ako sa model dozvie formát?', 'VŽDY vlož <code>parser.get_format_instructions()</code> do promptu (cez <code>.partial</code>).'],
  ],

  l7: [
    ['1 vstup / N vstupov / postupný výstup', '<code>invoke()</code> / <code>batch([…])</code> (beží paralelne!) / <code>stream()</code>.'],
    ['Z jedného vstupu viac výstupov naraz', '<code>RunnableParallel(vtip=…, fakt=…)</code> → slovník výsledkov.'],
    ['Vlastná funkcia uprostred rúry', '<code>RunnableLambda(moja_funkcia)</code>.'],
    ['Chain volateľný obyčajným stringom', 'Mapa na začiatku: <code>{"text": RunnablePassthrough()} | prompt | …</code>'],
  ],

  l8: [
    ['Model má počítať / čítať dáta / konať', 'Nástroj: <code>@tool</code> nad funkciou s typmi a docstringom.'],
    ['Podľa čoho model nástroj vyberá?', 'IBA podľa názvu a docstringu — píš doň ČO robí a KEDY ho použiť.'],
    ['bind_tools vs. agent?', '<code>bind_tools</code> = tool_calls spracúvaš ručne (učenie, plná kontrola). Agent = automatická slučka (ďalšia lekcia).'],
    ['Model nástroj „zavolal" — a teraz?', 'Model NIKDY nespúšťa — spusti ho ty: <code>nastroj.invoke(call["args"])</code> a výsledok vráť ako <code>ToolMessage</code>.'],
  ],

  l9: [
    ['Chain či agent?', 'Postup známy vopred → chain (lacnejší, predvídateľný). Model má rozhodovať o krokoch/nástrojoch → agent.'],
    ['Čo NESMIE chýbať v prompte agenta', '<code>MessagesPlaceholder("agent_scratchpad")</code> — zápisník krokov.'],
    ['Stavba moderného agenta', '<code>create_tool_calling_agent(model, tools, prompt)</code> + <code>AgentExecutor</code>.'],
    ['Ladenie vs. produkcia', 'Ladenie: <code>verbose=True</code>. Produkcia: <code>max_iterations</code> + <code>handle_parsing_errors=True</code> (+ LangSmith).'],
    ['Agent je drahý?', 'Áno — každá iterácia = volanie modelu. Ak vieš tok napísať pevne, napíš chain.'],
  ],

  l10: [
    ['Model má niečo VEDIEŤ (fakty, dokumenty)', 'RAG — 90 % firemných prípadov.'],
    ['Model sa má nejako SPRÁVAŤ (štýl, tón)', 'Fine-tuning.'],
    ['Dáta sa často menia', 'Jednoznačne RAG — aktualizácia = preindexovanie dokumentu za sekundy.'],
    ['Dve fázy RAG', 'Indexovanie RAZ (load→split→embed→store), dopytovanie VEĽAKRÁT (retrieve→prompt→LLM).'],
  ],

  l11: [
    ['.txt/.md / PDF / CSV / web / priečinok', '<code>TextLoader</code> / <code>PyPDFLoader</code> (strana = Document) / <code>CSVLoader</code> (riadok = Document) / <code>WebBaseLoader</code> / <code>DirectoryLoader</code> s glob maskou.'],
    ['Slovenská diakritika sa rozsypala', 'Zabudol si <code>encoding="utf-8"</code>.'],
    ['Načo sú metadata?', 'Zdroj/strana → bot vie CITOVAŤ, odkiaľ odpoveď má. Nezahadzuj ich.'],
  ],

  l12: [
    ['Ktorý splitter?', '<code>RecursiveCharacterTextSplitter</code> — default na bežný text (reže na hraniciach odsekov/viet).'],
    ['Aký chunk_size?', 'FAQ 200–400 · bežné dokumenty 500–1000 · právne texty 1000–1500 znakov.'],
    ['Aký overlap?', '~10–20 % z chunk_size — proti rozseknutej myšlienke.'],
    ['split_documents vs. split_text', 'Documenty (dedí metadáta!) vs. obyčajný string.'],
    ['RAG odpovedá zle', 'PRVÉ laď chunk_size — nie model.'],
  ],

  l13: [
    ['1 otázka vs. veľa chunkov', '<code>embed_query(text)</code> vs. <code>embed_documents([texty])</code> (hromadne = lacnejšie).'],
    ['Zlaté pravidlo', 'Na indexovanie aj otázky TEN ISTÝ embedding model — inak vektory nesedia.'],
    ['Ako čítať kosínus', '~1 = rovnaký význam, ~0 = nesúvisí. Práve preto „voľno" nájde „dovolenku".'],
    ['Ktorý model?', '<code>text-embedding-3-small</code> — lacný default (1536 rozmerov).'],
  ],

  l14: [
    ['VYTVOR vs. OTVOR databázu', '<code>Chroma.from_documents(…)</code> = indexuj RAZ (platíš embeddingy). <code>Chroma(persist_directory=…, embedding_function=…)</code> = len otvor (appka).'],
    ['Pribudol nový dokument', '<code>db.add_documents(nove_chunky)</code> — žiadne preindexovanie všetkého.'],
    ['Chroma skóre mätie', 'Je to VZDIALENOSŤ: menšie číslo = lepšia zhoda.'],
    ['Ktorú databázu?', 'Chroma dev/malé projekty · Pinecone/pgvector produkcia s infra.'],
  ],

  l15: [
    ['Prečo retriever a nie similarity_search?', '<code>as_retriever()</code> je Runnable → zapojíš ho do chainu cez <code>|</code> a staviteľov.'],
    ['Ktorý search_type?', '<code>similarity</code> default · <code>mmr</code> keď sa výsledky opakujú · <code>similarity_score_threshold</code> radšej nič než balast.'],
    ['Hotový RAG za 2 riadky', '<code>create_stuff_documents_chain</code> + <code>create_retrieval_chain</code>.'],
    ['Povinné názvy', 'Vstup <code>input</code>, kontext <code>{context}</code>, odpoveď <code>result["answer"]</code>, dokumenty <code>result["context"]</code>.'],
    ['Proti halucináciám', 'System: „Odpovedaj IBA z kontextu, inak povedz že nevieš."'],
  ],

  l16: [
    ['Kostra konzolového bota', '<code>while True</code> → <code>input()</code> → kontrola „koniec" + <code>break</code> → <code>chain.invoke</code>.'],
    ['Kde zložiť chain?', 'PRED slučkou — raz. V slučke len invoke.'],
    ['Prázdny Enter', '<code>if not otazka: continue</code> — nepáľ peniaze na prázdno.'],
    ['Osobnosť bota', 'Do system správy: rola + tón + pravidlá + (malé) dáta ako menu.'],
  ],

  l17: [
    ['Prečo si bot nič nepamätá?', 'Modely sú bezstavové — históriu musíš posielať TY pri každom volaní.'],
    ['Ako na pamäť', '<code>MessagesPlaceholder("chat_history")</code> v prompte + po každej výmene <code>append</code> Human aj AI správy.'],
    ['Konverzácia rastie (cena!)', 'Okno <code>historia[-10:]</code> alebo sumarizuj staršie.'],
    ['Viac používateľov naraz', '<code>RunnableWithMessageHistory</code> + <code>session_id</code>.'],
  ],

  l18: [
    ['Architektúra RAG bota', 'RAG chain (lekcia 15) + slučka (lekcia 16). Indexovanie v SAMOSTATNOM skripte!'],
    ['Citácie zdrojov', '<code>{d.metadata["source"] for d in result["context"]}</code> — set zruší duplicity.'],
    ['Bot nevie odpoveď', 'Poistka v prompte → čestné „nenašiel som" + loguj otázku do missing.txt (tak rastie FAQ).'],
    ['„A môžem si ich preniesť?" zlyháva', 'Retriever nevidí históriu — potrebuješ lekciu 19.'],
  ],

  l19: [
    ['Nadväzujúce otázky (zámená)', '<code>create_history_aware_retriever</code> — model otázku najprv preformuluje, až potom sa hľadá.'],
    ['Prečo história 2×?', 'V preformulovacom prompte (rozviaže „ich") AJ v QA prompte (plynulá odpoveď).'],
    ['Čo posielam do invoke?', 'OBOJE: <code>{"input": otázka, "chat_history": historia}</code>.'],
    ['Pozor pri appende', 'Odpoveď je v <code>result["answer"]</code> — RAG chain vracia slovník.'],
  ],

  l20: [
    ['Mentálny model Streamlitu', 'KAŽDÁ interakcia = celý skript beží odznova zhora nadol.'],
    ['Prečo mi mizne história?', 'Obyčajné premenné sa nulujú — všetko trvalé do <code>st.session_state</code> (inicializuj cez <code>if "x" not in …</code>).'],
    ['Chat komponenty', '<code>st.chat_input</code> (s walrusom <code>:=</code>) + <code>with st.chat_message("user"/"assistant")</code>.'],
    ['Streaming ako ChatGPT', '<code>st.write_stream(chain.stream({…}))</code>.'],
    ['Ako spustiť', '<code>streamlit run app.py</code> — NIE zeleným ▶.'],
  ],

  l21: [
    ['Kedy lokálny model?', 'Súkromie (dáta neodídu) · offline · nulové náklady · experimenty.'],
    ['Kedy cloud?', 'Maximálna kvalita (GPT-4o) · žiadne HW nároky · škálovanie.'],
    ['Ako prepnúť', '<code>ChatOllama(model="llama3.2")</code> namiesto ChatOpenAI — zvyšok kódu BEZ ZMENY.'],
    ['RAG celý offline', 'Aj embeddingy lokálne: <code>OllamaEmbeddings(model="nomic-embed-text")</code>.'],
    ['Nezabudni', 'Najprv <code>ollama pull model</code> v termináli.'],
  ],

  l22: [
    ['Ako zapnúť tracing', 'Len .env: <code>LANGCHAIN_TRACING_V2=true</code> + API_KEY + PROJECT. Kód sa NEMENÍ.'],
    ['RAG odpovedá zle — kde začať?', 'Otvor trace → pozri, ČO našiel retriever. Zlé chunky = laď retrieval, dobré chunky = laď prompt.'],
    ['Experimenty', 'Samostatný LANGCHAIN_PROJECT pre každý beh (rag-v1, rag-v2) → čisté porovnanie.'],
  ],

  l23: [
    ['Chain ako API', '<code>add_routes(app, chain, path="/x")</code> → automaticky /invoke /batch /stream /playground.'],
    ['Klient v Pythone', '<code>RemoteRunnable("http://…/x/")</code> — rovnaké invoke/batch/stream ako lokálne.'],
    ['Prečo if __name__ == "__main__"?', 'Server štartuje len pri PRIAMOM spustení súboru, nie pri importe.'],
    ['Rýchle demo klientovi', '<code>/x/playground/</code> — hotové webové UI zadarmo.'],
  ],

  l24: [
    ['AgentExecutor vs. LangGraph?', 'Jednoduchá tool slučka → AgentExecutor. Vetvenie / schvaľovanie / návraty / trvalý stav → LangGraph.'],
    ['Rýchly agent', '<code>create_react_agent(model, tools)</code> — vstup/výstup cez <code>{"messages": […]}</code>, odpoveď <code>[-1].content</code>.'],
    ['Pamäť používateľov', '<code>checkpointer=MemorySaver()</code> + <code>{"configurable": {"thread_id": "…"}}</code> (produkcia: SqliteSaver).'],
    ['Vlastný tok', '<code>StateGraph(TypedDict stav)</code>: uzly vracajú ZMENY stavu, router v <code>add_conditional_edges</code> vracia MENO uzla.'],
  ],

  l25: [
    ['Jeden agent či tím?', 'Jedna doména / do ~10 nástrojov = jeden agent. Viac domén / veľa nástrojov = supervisor + špecialisti.'],
    ['Najjednoduchší supervisor', 'Klasifikačný chain („odpovedz IBA slovom X/Y") + <code>.strip()</code> + slovník agentov s <code>.get()</code>.'],
    ['Zásada pre nástroje', 'Sady špecialistov sa NEPREKRÝVAJÚ — jasné hranice = predvídateľné pridelenie.'],
    ['Zlaté pravidlo eskalácie', 'Chain → agent → tím agentov. Každé povýšenie si obháj (cena, latencia).'],
  ],

  l26: [
    ['Používatelia formulujú inak než dokumenty', '<code>MultiQueryRetriever</code> — LLM vyrobí viac verzií otázky.'],
    ['Kódy, čísla, presné názvy (E-405)', 'Hybrid: <code>BM25Retriever</code> + vektory cez <code>EnsembleRetriever(weights=…)</code>.'],
    ['Správny chunk je na 7. mieste', 'Reranking: vytiahni k≈20, presnejší model vyberie TOP 3.'],
    ['Odpovede útržkovité', 'Parent-document — hľadaj v malom, posielaj celý odsek.'],
    ['Verzie/oddelenia dokumentov', '<code>similarity_search(…, filter={"rok": 2026})</code>.'],
    ['Poradie ladenia', 'Zmeraj → chunk_size → multi-query → hybrid → rerank. Od najlacnejšieho!'],
  ],

  l27: [
    ['Prečo nie assert?', 'LLM formuluje zakaždým inak — porovnávaj VÝZNAM cez LLM-as-judge.'],
    ['Základ evaluácie', 'Golden dataset 15–30 otázok s očakávanými faktami + NEGATÍVNE testy („má povedať neviem").'],
    ['Nastavenie sudcu', '<code>temperature=0</code> + jasné kritériá + JSON verdikt (PASS/FAIL + dôvod).'],
    ['Kedy spúšťať', 'Pred KAŽDOU zmenou baseline, po zmene znova → porovnaj čísla, FAIL si prejdi očami.'],
  ],

  l28: [
    ['Základné pravidlo bezpečnosti', 'Vstup používateľa (aj text z dokumentov!) = DÁTA, nikdy nie príkazy pre model.'],
    ['Vrstvy obrany (defense in depth)', 'Vstupný filter → obranný system prompt → výstupný filter → rate limit + logy.'],
    ['Lacná prvá vrstva', 'Moderation API (zadarmo) + keyword heuristika PRED drahým volaním.'],
    ['Poistky kreditu', '<code>max_tokens</code>, limit dĺžky vstupu, rate limiting na používateľa.'],
    ['Tajomstvá', 'Len .env / secret manager. Výstupný filter maskuje kľúče a PII (regex).'],
  ],

  l29: [
    ['Za čo platím?', 'Vstupné + výstupné tokeny — výstup je 3–4× drahší. Účet si odhadni VOPRED (cena × dopyty × 30).'],
    ['Ktorý model?', '<code>gpt-4o-mini</code> na ~90 % úloh; <code>gpt-4o</code> len kde mini preukázateľne nestačí (~15× drahší).'],
    ['Opakované dopyty', '<code>set_llm_cache(InMemoryCache())</code> — druhýkrát zadarmo (rovnaký vstup + T=0).'],
    ['Najčastejší tichý žrút', 'Dlhý kontext: priveľa chunkov, neorezaná história.'],
    ['Poradie zásahov pri drahej appke', 'Zmeraj → zlacni model → zapni cache → skráť kontext → nastav limity.'],
  ],

  l30: [
    ['Prečo Docker?', '„U mňa to funguje" → image beží rovnako všade (kód + prostredie v jednom balíku).'],
    ['Poradie v Dockerfile', 'requirements.txt PRED kódom — cache vrstiev = build za sekundy.'],
    ['Server v kontajneri nevidno', 'Chýba <code>--host 0.0.0.0</code> v CMD.'],
    ['Kľúče a konfig', 'NIKDY do image — <code>--env-file .env</code> / secret manager; čítaj cez <code>os.getenv(…, default)</code>.'],
    ['Minimum produkcie', '<code>/health</code> endpoint + štruktúrované logy bez PII + zafixované verzie (==).'],
  ],

  l31: [
    ['Portfólio', '3 vyleštené NASADENÉ projekty s príbehovým README > 30 tutoriálových klonov.'],
    ['CV formulka', 'Výsledok + technológie: „Postavil som X (LangChain + Chroma + FastAPI), nasadené v Dockeri" — nie zoznam pojmov.'],
    ['Odpoveď na praktickú otázku', 'STAR: Situácia → Úloha → Akcia → Výsledok s ČÍSLOM (eval 60 % → 90 %).'],
    ['Kľúčové slová pre recruiterov', 'LLM, LangChain, LangGraph, RAG, vector DB, AI agents, FastAPI, Docker — pravdivo a s dôkazmi.'],
    ['Najsilnejšia stratégia', 'Stavaj verejne + buď vidieť (GitHub, LinkedIn, komunita). Konzistentnosť poráža talent.'],
  ],
};
