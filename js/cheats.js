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

  l32: [
    ['Ideme nasadzovať — čo prejsť?', 'OWASP Top 10 for LLM Apps 2025 (LLM01–LLM10) ako checklist: ku každému bodu jedna veta „ako to riešim".'],
    ['Vstup prepíše moje inštrukcie', 'LLM01 Prompt Injection — riziko č. 1, celá lekcia 34.'],
    ['Agent má práva, čo nepotrebuje', 'LLM06 Excessive Agency → least privilege + human-in-the-loop.'],
    ['Výstup modelu ide do SQL/HTML/shellu', 'LLM05 Improper Output Handling — ber ho ako nedôveryhodný vstup.'],
    ['Ktokoľvek môže nahrať dokument do RAG', 'LLM04 + LLM08 — sanitácia, metadáta, izolácia (lekcia 36).'],
    ['Niekto mi môže vyžrať kredit', 'LLM10 Unbounded Consumption → rate limit, max_tokens, rozpočet.'],
  ],

  l33: [
    ['Staviam agenta, nie chatbota', 'Použi rebríček ASI01–ASI10 (OWASP for Agentic Applications) — agent koná, nie len odpovedá.'],
    ['Agent má trvalú pamäť', 'ASI06 Memory Poisoning — pamäť rieš ako typované dáta: allowlist kľúčov, limit dĺžky, značka pôvodu.'],
    ['Nástroj vie spraviť nezvratnú škodu', 'ASI02 Tool Misuse → human-in-the-loop (LangGraph interrupt) + allowlist.'],
    ['Kedy interrupt ÁNO', 'Mazanie, platby, e-maily, produkčné dáta, prvý beh nového nástroja.'],
    ['Kedy interrupt NIE', 'Čítanie, vyhľadávanie, výpočty — inak si ľudia zvyknú klikať naslepo (ASI09).'],
    ['Agenti si posielajú správy', 'ASI07 — over identitu a obsah; jeden agent môže klamať druhému.'],
  ],

  l34: [
    ['Dá sa injection úplne opraviť?', 'Nie — model má jeden kanál pre dáta aj inštrukcie. Rieši sa OBMEDZENÍM DOSAHU.'],
    ['Appka číta cudzí obsah (PDF, web)', 'Nepriama injection — ohranič obsah značkami, označ ako dáta, zakáž vykonávať pokyny z neho.'],
    ['Kam NEDÁVAŤ načítaný text', 'Nikdy do system správy — tam patria len tvoje pravidlá.'],
    ['Lacná prvá vrstva', 'Moderation API + heuristika vzorov; potom LLM klasifikátor (max_tokens=3).'],
    ['Keď filter zlyhá', 'Rozhoduje dosah: least privilege, allowlist, izolácia dát, kontrola výstupu.'],
    ['Ako viem, že obrana funguje?', 'Sada útočných promptov ako regresný test — po každej zmene promptu.'],
  ],

  l35: [
    ['Tri princípy LangChainu', 'Limit permissions · Anticipate misuse · Defense in depth.'],
    ['Argumenty nástroja od modelu', 'Ber ich ako vstup z internetu: Pydantic <code>args_schema</code> + <code>field_validator</code>.'],
    ['Nástroj číta súbory', 'Allowlist prípon, zákaz <code>..</code> a <code>/</code>, kontrola <code>is_relative_to</code>, strop dĺžky výstupu.'],
    ['Model má spúšťať kód', 'Najlepšie vôbec. Ak áno → sandbox (Docker bez siete, gVisor/Firecracker, hosťovaný sandbox), nikdy <code>exec</code> v hlavnom procese. Pozor na CVE-2025-68613 (REPL RCE).'],
    ['Kde presadiť allowlist a limity', 'V kóde, ktorý nástroje spúšťa — nie v prompte. Model nástroje nespúšťa, spúšťa ich tvoj dispatcher.'],
    ['Nový nástroj do agenta', 'Otázka: aký je blast radius pri 100 zlých volaniach?'],
  ],

  l36: [
    ['Indexujem cudzie dokumenty', 'Sanitizuj vzory pokynov, doplň metadáta (source, tenant, dôvera), oddeľ kolekcie podľa dôvery.'],
    ['Viac zákazníkov v jednej DB', 'Metadata filter <code>{"tenant": …}</code> — tenant ber z overenej session, NIKDY z promptu.'],
    ['Pripájam MCP server', 'Prečítaj popisy nástrojov (tool poisoning) a ulož ich odtlačok — zmena = rug pull.'],
    ['Ako detegovať rug pull', 'Hash mena+popisu+schémy pri štarte a porovnanie s uloženým stavom.'],
    ['Dodávateľský reťazec', 'Pripnuté verzie (<code>==</code>), minimum závislostí, izolované MCP servery, sledovanie CVE.'],
    ['Koľko chunkov do promptu', 'Aj <code>k</code> je bezpečnostný parameter — viac kontextu = väčší povrch na únik a injection.'],
  ],

  l37: [
    ['Kam s kľúčmi', 'Prostredie/secret manager; mimo gitu a Docker image; oddelený dev/prod; rotácia.'],
    ['Tracing v produkcii', 'Posiela obsah promptov von — pri PII maskuj, vzorkuj alebo vypni.'],
    ['Ochrana rozpočtu', 'Rate limit na používateľa + denný strop + limit dĺžky vstupu + <code>max_tokens</code>.'],
    ['Čo logovať pri agentoch', 'Audit rozhodnutí: ktoré nástroje, aké argumenty, čo vrátili, čo bolo zamietnuté (bez PII).'],
    ['Ako často testovať bezpečnosť', 'Bezpečnostná eval sada v CI — pri poklese skóre sa nasadenie zastaví.'],
    ['Uniknul kľúč — prvý krok', 'Okamžite rotovať, až potom vyšetrovať rozsah z logov.'],
  ],

  l38: [
    ['Firma chce dáta v EÚ a SLA', 'Azure OpenAI — rovnaké modely, iná prevádzka: región, SLA, VNet, žiadny tréning na tvojich dátach.'],
    ['Prepínam kód na Azure', '<code>AzureChatOpenAI(azure_deployment=…, api_version=…)</code> — zvyšok appky sa nemení.'],
    ['DeploymentNotFound', 'Do <code>azure_deployment</code> patrí TVOJE meno nasadenia z portálu, nie názov modelu.'],
    ['Kam nasadiť kontajner (rýchly štart)', 'Serverless: Azure Container Apps / AWS App Runner / GCP Cloud Run — škáluje aj na nulu.'],
    ['Tajomstvá v cloude', 'Key Vault / Secrets Manager / Secret Manager — nie .env súbor na serveri.'],
    ['Dev vs prod konfigurácia', '12-factor: jeden image, rozdiely len v env premenných.'],
  ],

  l39: [
    ['Viac LLM volaní naraz', '<code>await asyncio.gather(*[model.ainvoke(o) for o in otazky])</code> — čas ≈ najpomalší dopyt.'],
    ['Sync vs async metódy', 'invoke/batch/stream → <code>ainvoke</code>/<code>abatch</code>/<code>astream</code> (s await v async def).'],
    ['Hromadné spracovanie bez rate limitu', '<code>abatch(vstupy, config={"max_concurrency": 5})</code>.'],
    ['Odpoveď po kúskoch', '<code>async for kusok in chain.astream(...)</code> — vnímaná rýchlosť ↑.'],
    ['Kedy async NEpomôže', 'Pri CPU výpočtoch — event loop je jedno vlákno; pomôžu procesy.'],
    ['Úloha na minúty', 'Nie HTTP čakanie — fronta + worker + job_id, klient sa pýta na stav.'],
  ],

  l40: [
    ['Ktorá DB na čo', 'Postgres = zdroj pravdy (+pgvector vektory), Redis = rýchla pominuteľná vrstva, Elasticsearch = fulltext/hybrid, MongoDB = JSON bez schémy.'],
    ['Vektory bez nového systému', '<code>PGVector(embeddings=…, collection_name=…, connection=…)</code> — jedna záloha, transakcie, JOIN s biznis dátami.'],
    ['LLM cache zadarmo', '<code>set_llm_cache(RedisCache(redis.Redis(…)))</code> — identický prompt druhýkrát = 0 tokenov.'],
    ['Rate limit pre viac serverov', 'Redis <code>incr</code> + <code>expire</code> — atomický čítač zdieľaný všetkými kópiami appky. Je to <b>pevné okno</b> (na hranici pustí 2× limit); posuvné okno = sorted set.'],
    ['Presné kódy produktov v RAG', 'Hybrid: BM25 + vektory (Elasticsearch natívne, alebo EnsembleRetriever).'],
    ['Smiem to stratiť?', 'Áno → Redis. Nie → PostgreSQL. To je celé rozhodovanie.'],
  ],

  l41: [
    ['Kde žije pipeline', 'GitHub: <code>.github/workflows/*.yml</code> · GitLab: <code>.gitlab-ci.yml</code>.'],
    ['Poradie jobov', '<code>needs: testy</code> — zlyhanie zastaví reťaz (testy → eval → deploy).'],
    ['Kľúče v CI', 'GitHub Secrets a vo workflow <code>secrets.OPENAI_API_KEY</code> — nikdy kľúč priamo do YAML.'],
    ['Tag image', 'Podľa commitu (<code>github.sha</code>) — rollback = nasadenie starého tagu.'],
    ['Prompt sa zmenil', 'Eval ako brána v pipeline — pri poklese skóre build nezbehne.'],
    ['Produkcia s ľudským klikom', '<code>environment: production</code> + required reviewers.'],
    ['Po nasadení', 'Smoke test na /health — neprejde → rollback.'],
  ],

  l42: [
    ['Appka vo viacerých kópiách', 'Stateless: všetok stav v Postgres/Redis. Test: „môžem kópiu kedykoľvek zabiť?"'],
    ['LLM API padá', 'Kaskáda: timeout → retry s backoffom+jitterom → fallback model → circuit breaker.'],
    ['Backoff vzorec', '<code>2 ** pokus + random.random()</code> — exponenciálne + jitter proti thundering herd.'],
    ['Klient poslal požiadavku 2×', 'Idempotency-Key — rovnaký kľúč = akcia prebehne len raz.'],
    ['Streaming do prehliadača', 'SSE: <code>StreamingResponse(..., media_type="text/event-stream")</code>, riadky „data: …".'],
    ['API zmluva', 'Verzuj od prvého dňa (/v1/…), 429 s Retry-After, kľúč v hlavičke (nie v URL).'],
    ['Čo merať', 'p95 latenciu, chybovosť, cenu/deň — alerty na symptómy používateľa, nie CPU.'],
  ],

  l43: [
    ['LangChain vs LlamaIndex', 'LangChain = orchestrácia (chainy, agenti, LangGraph); LlamaIndex = dátová/RAG vrstva (indexy, retrieval).'],
    ['RAG na 5 riadkov', '<code>SimpleDirectoryReader → VectorStoreIndex.from_documents → as_query_engine → query</code>.'],
    ['Citácie zdrojov', '<code>odpoved.source_nodes</code> — súbor aj skóre máš automaticky.'],
    ['Oba naraz', 'LlamaIndex engine zabalený ako <code>@tool</code> v LangChain agentovi.'],
    ['Neplatiť embeddingy 2×', '<code>index.storage_context.persist(persist_dir=…)</code>.'],
    ['Firma už má jeden framework', 'Použi ten — konzistencia tímu > osobná preferencia.'],
  ],

  l44: [
    ['Rozhodnutie medzi technológiami', 'Explicitný trade-off: čo získam, čo obetujem — v NAŠOM kontexte. Bez mínusov je to len názor.'],
    ['Prečo sme to tak spravili?', 'ADR (pol strany): kontext → možnosti → rozhodnutie s + aj − → dôsledky. Do repa, review ako kód.'],
    ['Vysvetlenie stakeholderovi', 'Pravidlo dôsledku: technická vec → dopad v peniazoch, čase alebo riziku.'],
    ['Hotové = ?', 'DoD pre AI featuru: testy prešli A eval skóre ≥ prah na golden datasete.'],
    ['AI úloha v šprinte', 'Time-box experimentu — rozpočet času namiesto presného odhadu.'],
    ['Mentoring', 'Otázky namiesto odpovedí („čo sa stane pri 100 dokumentoch?"), bezpečné zlyhanie na stagingu, kontext namiesto príkazov.'],
  ],

  l45: [
    ['Obraz vs kontajner', 'Obraz = trieda (nemenná šablóna), kontajner = inštancia (bežiaci proces). Z jedného obrazu ľubovoľne veľa kontajnerov.'],
    ['Kontajner hneď skončil', '<code>docker ps -a</code> (naozaj spadol?) → <code>docker logs &lt;meno&gt;</code> (prečo?). Rieši 9 z 10 problémov.'],
    ['Zmizol mi po Ctrl+C', 'Bežal v popredí — chýbalo <code>-d</code>.'],
    ['Mapovanie portu', '<code>-p HOSŤ:KONTAJNER</code>, teda „zvonku:zvnútra" (<code>-p 8080:80</code>).'],
    ['Konfigurácia kontajnera', '<code>-e KLUC=hodnota</code> pri <code>docker run</code>.'],
    ['Rýchle upratanie', '<code>docker rm -f &lt;meno&gt;</code> (stop+rm) · <code>docker system prune -f</code> = kontajnery + <b>visiace</b> obrazy · <code>-a</code> navyše aj otagované nepoužité obrazy.'],
  ],

  l46: [
    ['Základný obraz', 'Vždy konkrétna verzia: <code>FROM python:3.12-slim</code>. Nikdy <code>:latest</code>.'],
    ['Build je pomalý', 'Zlé poradie — <code>COPY requirements.txt</code> + <code>RUN pip install</code> PRED <code>COPY . .</code>.'],
    ['Obraz je obrovský', 'slim/alpine základ, <code>.dockerignore</code>, multi-stage build (<code>COPY --from=build</code>).'],
    ['EXPOSE vs -p', 'EXPOSE len dokumentuje; port reálne otvorí až <code>-p</code> pri <code>docker run</code>.'],
    ['Kam s API kľúčmi', 'NIKDY do <code>ENV</code> v Dockerfile — ostanú v obraze. Až pri spustení cez <code>-e</code> alebo secret manager.'],
    ['Bezpečný beh', '<code>RUN useradd -m appka</code> + <code>USER appka</code> — proces nebeží ako root.'],
    ['Čo je tá bodka', '<code>docker build -t meno:tag .</code> — bodka je kontext (adresár posielaný Dockeru).'],
  ],

  l47: [
    ['Dáta prežijú kontajner?', 'Len vo volume: <code>-v dbdata:/var/lib/postgresql/data</code>.'],
    ['Volume vs bind mount', 'Pomenovaný volume = produkčné dáta (spravuje Docker); bind mount <code>-v ./kod:/app</code> = vývoj, vidíš zmeny hneď.'],
    ['Kontajnery sa nevidia', 'Predvolený bridge nemá DNS podľa mena — vytvor vlastnú sieť a pripoj oba cez <code>--network</code>.'],
    ['Adresa druhej služby', 'Meno kontajnera/služby ako hostname: <code>redis://cache:6379</code>.'],
    ['Celý stack naraz', '<code>docker compose up -d</code> · stav <code>ps</code> · logy <code>logs -f</code> · zhodenie <code>down</code>.'],
    ['depends_on nestačí', 'Rieši len poradie štartu, nie pripravenosť — appka musí vedieť zopakovať pripojenie.'],
    ['Čo púšťať von', 'Iba <code>ports:</code> pri API. Databáza a cache bez portov = zvonku neviditeľné.'],
  ],

  l31: [
    ['Portfólio', '3 vyleštené NASADENÉ projekty s príbehovým README > 30 tutoriálových klonov.'],
    ['CV formulka', 'Výsledok + technológie: „Postavil som X (LangChain + Chroma + FastAPI), nasadené v Dockeri" — nie zoznam pojmov.'],
    ['Odpoveď na praktickú otázku', 'STAR: Situácia → Úloha → Akcia → Výsledok s ČÍSLOM (eval 60 % → 90 %).'],
    ['Kľúčové slová pre recruiterov', 'LLM, LangChain, LangGraph, RAG, vector DB, AI agents, FastAPI, Docker — pravdivo a s dôkazmi.'],
    ['Najsilnejšia stratégia', 'Stavaj verejne + buď vidieť (GitHub, LinkedIn, komunita). Konzistentnosť poráža talent.'],
  ],
};
