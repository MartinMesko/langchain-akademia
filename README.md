# 🦜🔗 LangChain Akadémia

Interaktívna výučbová aplikácia pokrývajúca **kompletný obsah kurzu
„LangChain: Inteligentné aplikácie s ChatGPT"** (Skillmea, Marek Kučák) —
všetkých 23 kapitol v 4 sekciách.

## Spustenie

**Dvojklik na ikonu „LangChain Akadémia" na ploche.** 🦜
Spustí malý lokálny server a otvorí akadémiu v prehliadači na `http://127.0.0.1:8765`.

> **Prečo server a nie len otvorenie súboru?** Tvoj postup (XP, dokončené lekcie, odznaky…)
> sa ukladá do `localStorage` prehliadača. Cez `file://` (dvojklik priamo na `index.html`)
> ho Safari neukladá medzi spusteniami — preto appku otváraj **vždy cez ikonu**, ktorá
> beží na stabilnom `http://127.0.0.1:8765`. Tam sa postup ukladá spoľahlivo.

Pri prvom spustení môže macOS raz spýtať, či chceš appku otvoriť (lebo nemá podpis od
overeného vývojára) — daj **pravý klik → Open → Open**. Server beží potichu na pozadí;
ďalšie kliknutie na ikonu už len otvorí appku.

**Záložné spustenia** (keby ikona niekedy nešla):
- dvojklik na `Spustit-LangChain-Akademia.command` v priečinku projektu (otvorí Terminál), alebo
- ručne: `cd Langchain_5 && python3 -m http.server 8765` a otvor `http://127.0.0.1:8765`.

### Záloha postupu
V bočnom menu sú tlačidlá **💾 Exportovať postup** (stiahne `langchain-akademia-postup.json`)
a **⬆️ Importovať postup** (načíta zálohu späť) — hodí sa pri prenose na iný počítač alebo
ako poistka. Ak by úložisko niekedy nebolo dostupné, appka nespadne a upozorní ťa.

## Čo vnútri nájdeš

| | |
|---|---|
| 📖 **23 lekcií + 🐍 Python rýchlokurz** | podrobná teória v slovenčine: modely, prompty, chainy, LCEL, tools, agenty, RAG (loaders → splitters → embeddingy → Chroma → retrievery), chatboty s pamäťou, Streamlit, Ollama, LangSmith, LangServe — plus 2 prípravné lekcie Pythonu pre úplných nováčikov |
| 🤖 **Bonus: Kariéra v AI (8 lekcií)** | nadstavba pre zamestnateľnosť: LangGraph, multi-agentové systémy, pokročilý RAG (multi-query, hybrid search, reranking), evaluácia (LLM-as-judge), bezpečnosť a guardrails, optimalizácia nákladov, produkčné nasadenie s Dockerom a kariérna príprava (portfólio, CV, pohovor) |
| 🔍 **Rozbory kódu riadok po riadku** | ku kľúčovému príkladu každej lekcie karta, ktorá ľudskou rečou vysvetlí každý dôležitý riadok — pre menej znalých Pythonu |
| 🐍 **Python okienka** | fialové boxy vysvetľujúce jazykové koncepty (slovníky, lambda, dekorátory, `\|` operátor, walrus…) presne tam, kde sa prvýkrát objavia |
| 🖥️ **40 PyCharm simulácií** | editor s Darcula témou, project tree, taby, syntax highlighting a **spustiteľná Run konzola** so streamovaným výstupom (zelené ▶) |
| 🧠 **97 kvízových otázok** | s okamžitým vysvetlením |
| 🏋️ **66 cvičení** | dopĺňanie kódu, zoraďovanie pipeline, písanie vlastného kódu s validáciou, pomôckami a riešeniami |
| 🏁 **Záverečný test** | 24 otázok, potrebných 80 % |
| 🏗️ **Záverečný projekt** | Firemný AI asistent v 8 krokoch (RAG + pamäť + Streamlit + LangSmith + LangServe) |
| 💼 **30 tréningových projektov** | praktické zadania od ⭐ (prvý chain, ~20 min) po ⭐⭐⭐ (nasadený RAG systém s API) — s požiadavkami, pomôckami, bonusmi a XP za dokončenie |
| 📋 **Ťahák** | 12 kariet s kľúčovými snippetmi na kopírovanie |
| 🎮 **Gamifikácia** | XP, 7 levelov, 12 odznakov, konfety, progress ringy — všetko sa ukladá do localStorage |

## Ovládanie

- **←/→** — predchádzajúca/nasledujúca lekcia
- **Enter** v doplňovacom políčku — skontrolovať odpoveď
- Klik na bežiacu konzolu — preskočiť animáciu výpisu
- 🔍 v bočnom paneli — filtrovanie lekcií

Postup sa ukladá automaticky v prehliadači (localStorage).
