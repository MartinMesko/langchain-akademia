/* ============================================================
   SPRÍSNENÉ KONTROLY „NAPÍŠ KÓD" CVIČENÍ
   Dopĺňa must-tokeny cvičeniam, kde zadanie vyžaduje VIACNÁSOBNÉ
   výskyty (dve otázky, tri položky…) — pôvodná kontrola ich
   nevedela vynútiť. Formát tokenu: "#N:kus_kódu" = aspoň N-krát.
   Kľúč: "idLekcie|Titul cvičenia". app.js ich zlúči v allExercises().
   ============================================================ */
window.STRICT_MUSTS = {
  /* — základné (data súbory) — */
  'l4|Few-shot prekladač emoji':        [['#3:HumanMessage('], ['#2:AIMessage(']],
  'l7|Paralelný prekladač':             [['en='], ['de=']],
  'l29|Zapni caching':                  [['#2:.invoke(']],

  /* — extra (practice súbory) — */
  'lA|Prvé premenné':                   [['#2:print(']],
  'lA|Zoznam slovníkov':                [['#2:"meno"', "#2:'meno'"]],
  'l1|Kontrolný výpis':                 [['#2:print(']],
  'l2|Dve otázky za sebou':             [['#2:.invoke(']],
  'l2|Súboj teplôt':                    [['#2:.invoke(']],
  'l2|Funkcia opytaj()':                [['#3:opytaj(']],
  'l3|Funkcia vyrob_prompt()':          [['#3:vyrob_prompt(']],
  'l4|Pirát na dve otázky':             [['#2:model.invoke(']],
  'l4|Formátové pravidlo':              [['#2:HumanMessage('], ['#2:model.invoke(']],
  'l5|S parserom vs. bez':              [['#2:.invoke(']],
  'l5|Továreň na chainy':               [['#3:vyrob_chain(']],
  'l6|Produkt s popismi polí':          [['#2:Field(description=']],
  'l7|Batch tri naraz':                 [['#3:"pojem"', "#3:'pojem'"]],
  'l8|Bezpečné delenie':                [['#2:.invoke(']],
  'l9|Sleduj uvažovanie':               [['#2:.invoke(']],
  'l12|Duel veľkostí':                  [['#2:split_text(']],
  'l13|Funkcia kosinus()':              [['#3:kosinus(']],
  'l15|k=1 vs. k=4':                    [['#2:.invoke(']],
  'l15|Funkcia opytaj_dokumenty()':     [['#3:opytaj_dokumenty(']],
  'l17|Pamäťový test bez slučky':       [['#2:chain.invoke(']],
  'l18|Experiment s k':                 [['#2:create_retrieval_chain('], ['#2:.invoke(']],
  'l18|Funkcia podpora()':              [['#3:podpora(']],
  'l21|Cloud vs. lokál duel':           [['#2:.invoke(']],
  'l21|Prepínač modelov':               [['#3:vyber_model(']],
  'l23|Dve služby na jednom serveri':   [['#2:add_routes(']],
  'l23|Batch cez sieť':                 [['#3:"otazka"', "#3:'otazka'"]],
  'l24|Zapni pamäť vlákien':            [['#2:agent.invoke(']],
  'l24|Dve oddelené vlákna':            [['#2:.invoke(']],
  'l24|Graf s križovatkou':             [['#2:app.invoke(']],
  'l25|Klasifikačný router':            [['#2:router.invoke(']],
  'l25|Dvaja špecialisti':              [['#2:create_react_agent(']],
  'l26|Base vs. multi-query duel':      [['#2:.invoke(']],
  'l27|Golden dataset':                 [['#3:"otazka"', "#3:'otazka'"]],
  'l29|Zapni cache':                    [['#2:model.invoke(']],
  'l29|Dokáž to stopkami':              [['#4:time.time()']],
  'l31|Portfólio ako dáta':             [['#3:"nazov"', "#3:'nazov'"]],
};
