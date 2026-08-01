/* ============================================================
   KLIKACÍ KÓD — cvičenia s výberom zo 4 možností
   Predvyplnený kód, v ktorom sú skryté kľúčové časti lekcie.
   Namiesto písania vyberáš z ponuky (1 správna + 3 rozptylovače).
   Generuje sa z existujúcich „Doplň kód" cvičení a z riešení
   „Napíš kód" — 10 cvičení na lekciu, deterministicky (stále
   rovnaké poradie možností pre daného používateľa).
   ============================================================ */
(function () {
  'use strict';

  /* ── Skupiny zámeniteľných pojmov: z nich sa berú rozptylovače ── */
  const POOLS = [
    ['SystemMessage', 'HumanMessage', 'AIMessage', 'ToolMessage', 'ChatMessage'],
    ['system', 'human', 'ai', 'assistant', 'user', 'tool'],
    ['content', 'text', 'body', 'value'],
    ['StrOutputParser', 'JsonOutputParser', 'CommaSeparatedListOutputParser', 'PydanticOutputParser', 'XMLOutputParser'],
    ['ChatPromptTemplate', 'PromptTemplate', 'MessagesPlaceholder', 'FewShotPromptTemplate', 'PipelinePromptTemplate'],
    ['ChatOpenAI', 'OpenAI', 'ChatOllama', 'ChatAnthropic', 'AzureChatOpenAI'],
    ['OpenAIEmbeddings', 'OllamaEmbeddings', 'HuggingFaceEmbeddings', 'CohereEmbeddings'],
    ['Chroma', 'FAISS', 'Pinecone', 'Qdrant', 'Weaviate'],
    ['TextLoader', 'PyPDFLoader', 'CSVLoader', 'WebBaseLoader', 'DirectoryLoader', 'JSONLoader'],
    ['RecursiveCharacterTextSplitter', 'CharacterTextSplitter', 'TokenTextSplitter', 'MarkdownHeaderTextSplitter'],
    ['RunnableParallel', 'RunnableLambda', 'RunnablePassthrough', 'RunnableBranch', 'RunnableSequence'],
    ['create_tool_calling_agent', 'create_react_agent', 'initialize_agent', 'create_openai_functions_agent'],
    ['AgentExecutor', 'AgentRunner', 'ToolExecutor', 'ChainExecutor'],
    ['create_retrieval_chain', 'create_stuff_documents_chain', 'create_history_aware_retriever', 'load_qa_chain'],
    ['BM25Retriever', 'EnsembleRetriever', 'MultiQueryRetriever', 'ParentDocumentRetriever'],
    ['MemorySaver', 'SqliteSaver', 'PostgresSaver', 'RedisSaver'],
    ['StateGraph', 'MessageGraph', 'FlowGraph', 'ChainGraph'],
    ['InMemoryCache', 'SQLiteCache', 'RedisCache', 'FileCache'],
    ['BaseModel', 'BaseSchema', 'DataModel', 'TypedModel'],
    ['FastAPI', 'Flask', 'Django', 'Starlette'],
    ['RemoteRunnable', 'RemoteChain', 'HttpRunnable', 'ClientRunnable'],
    // metódy a funkcie
    ['invoke', 'run', 'call', 'execute'],
    ['batch', 'invoke_all', 'multi', 'parallel'],
    ['stream', 'flow', 'yield_all', 'iterate'],
    ['from_messages', 'from_template', 'from_strings', 'from_prompts'],
    ['from_documents', 'from_texts', 'from_chunks', 'from_files'],
    ['split_documents', 'split_text', 'chunk_documents', 'divide_documents'],
    ['embed_query', 'embed_documents', 'embed_text', 'vectorize'],
    ['as_retriever', 'to_retriever', 'get_retriever', 'make_retriever'],
    ['similarity_search', 'similarity_search_with_score', 'keyword_search', 'vector_search'],
    ['add_documents', 'insert_documents', 'push_documents', 'append_documents'],
    ['bind_tools', 'add_tools', 'with_tools', 'attach_tools'],
    ['get_format_instructions', 'get_instructions', 'format_help', 'describe_format'],
    ['load_dotenv', 'read_dotenv', 'load_env', 'init_env'],
    ['add_routes', 'add_endpoints', 'serve_chain', 'mount_chain'],
    ['set_llm_cache', 'enable_cache', 'use_cache', 'init_cache'],
    ['add_node', 'add_step', 'add_stage', 'register_node'],
    ['add_edge', 'add_link', 'connect', 'add_path'],
    ['add_conditional_edges', 'add_branch', 'add_router', 'add_switch'],
    ['field_validator', 'validator', 'check_field', 'validate_field'],
    ['append', 'extend', 'insert', 'add'],
    ['len', 'count', 'size', 'length'],
    ['sum', 'total', 'add_all', 'accumulate'],
    ['max', 'top', 'highest', 'peak'],
    ['sorted', 'order', 'arrange', 'rank'],
    ['enumerate', 'index_of', 'with_index', 'pairs'],
    ['zip', 'pair', 'merge', 'combine'],
    ['join', 'concat', 'merge_text', 'glue'],
    ['lower', 'upper', 'casefold', 'small'],
    ['strip', 'trim', 'clean', 'cut'],
    ['split', 'divide', 'cut', 'partition'],
    ['any', 'all', 'some', 'exists'],
    ['getenv', 'get_env', 'read_env', 'env'],
    ['sub', 'replace_all', 'gsub', 'swap'],
    ['dumps', 'to_json', 'encode', 'serialize'],
    ['now', 'today', 'current', 'time_now'],
    ['sha256', 'md5', 'sha1', 'blake2'],
    // parametre
    ['temperature', 'creativity', 'randomness', 'variance'],
    ['max_tokens', 'token_limit', 'max_length', 'output_limit'],
    ['chunk_size', 'block_size', 'part_size', 'segment_size'],
    ['chunk_overlap', 'overlap_size', 'chunk_margin', 'shared_size'],
    ['persist_directory', 'save_path', 'storage_dir', 'db_folder'],
    ['embedding_function', 'embedding', 'embed_fn', 'vectorizer'],
    ['search_kwargs', 'search_args', 'query_params', 'search_options'],
    ['search_type', 'query_type', 'mode', 'strategy'],
    ['verbose', 'debug', 'trace', 'logging'],
    ['checkpointer', 'saver', 'memory_store', 'state_saver'],
    ['thread_id', 'session_id', 'conversation_id', 'user_key'],
    ['args_schema', 'schema', 'input_schema', 'params_schema'],
    ['weights', 'ratios', 'scores', 'priorities'],
    ['loader_cls', 'loader_class', 'reader', 'parser_cls'],
    // kľúče slovníkov / názvy premenných v LangChaine
    ['input', 'query', 'question', 'prompt'],
    ['answer', 'result', 'output', 'response'],
    ['context', 'documents', 'sources', 'chunks'],
    ['chat_history', 'history', 'memory', 'messages_log'],
    ['messages', 'chat', 'dialog', 'conversation'],
    ['agent_scratchpad', 'scratchpad', 'agent_notes', 'work_log'],
    ['tool_calls', 'calls', 'tool_requests', 'actions'],
    ['page_content', 'content', 'text', 'body'],
    ['metadata', 'meta', 'info', 'attributes'],
    ['source', 'origin', 'file', 'path'],
    ['token_usage', 'usage', 'tokens', 'consumption'],
    ['prompt_tokens', 'input_tokens', 'request_tokens', 'in_tokens'],
    ['completion_tokens', 'output_tokens', 'response_tokens', 'out_tokens'],
    ['total_tokens', 'sum_tokens', 'all_tokens', 'tokens_total'],
    ['session_state', 'app_state', 'store', 'cache_state'],
    ['chat_input', 'text_input', 'user_input', 'prompt_input'],
    ['chat_message', 'message_box', 'bubble', 'chat_bubble'],
    ['response_metadata', 'meta_data', 'extra', 'details'],
    // Python kľúčové slová a konštrukty
    ['while', 'until', 'loop', 'repeat'],
    ['break', 'stop', 'exit', 'end'],
    ['continue', 'skip', 'next', 'pass'],
    ['return', 'yield', 'give', 'output'],
    ['def', 'func', 'function', 'fn'],
    ['class', 'type', 'struct', 'object'],
    ['import', 'include', 'require', 'use'],
    ['lambda', 'anon', 'inline', 'func'],
    ['True', 'False', 'None', 'Null'],
    ['if', 'when', 'case', 'check'],
    ['else', 'otherwise', 'orelse', 'default'],
    ['tuple', 'list', 'dict', 'set'],
    ['str', 'int', 'float', 'bool'],
    // pojmy a prepínače
    ['RAG', 'fine-tuning', 'few-shot', 'prompt engineering'],
    ['AI', 'ML', 'NLP', 'LLM'],
    ['--no-cache-dir', '--no-cache', '--skip-cache', '--cache-off'],
    // frameworky (odpovede typu „čo použiť")
    ['LlamaIndex', 'LangChain', 'Haystack', 'Semantic Kernel'],
    ['LangChain + LangGraph', 'LlamaIndex + LangGraph', 'LangChain + CrewAI', 'LangGraph + AutoGen'],
    ['Redis', 'Memcached', 'Valkey', 'KeyDB'],
    ['PostgreSQL', 'MySQL', 'MariaDB', 'SQLite'],
    ['Elasticsearch', 'OpenSearch', 'Solr', 'Typesense'],
    ['MongoDB', 'CouchDB', 'DynamoDB', 'Firestore'],
    // async svet
    ['ainvoke', 'abatch', 'astream', 'arun'],
    ['gather', 'wait', 'collect', 'join_all'],
    ['wait_for', 'timeout_after', 'deadline', 'limit_time'],
    ['sleep', 'delay', 'pause', 'idle'],
    ['Semaphore', 'Lock', 'Barrier', 'Event'],
    ['TimeoutError', 'CancelledError', 'TimeoutException', 'DeadlineError'],
    ['max_concurrency', 'concurrency', 'max_parallel', 'parallel_limit'],
    // Azure
    ['AzureChatOpenAI', 'AzureOpenAIChat', 'ChatAzureOpenAI', 'AzureGPT'],
    ['AzureOpenAIEmbeddings', 'AzureEmbeddings', 'OpenAIAzureEmbeddings', 'AzureVectorizer'],
    ['azure_deployment', 'deployment', 'deployment_name', 'azure_model'],
    ['api_version', 'azure_version', 'api_ver', 'version'],
    // databázy
    ['PGVector', 'PostgresVector', 'PgVectorStore', 'VectorPG'],
    ['RedisCache', 'RedisStore', 'CacheRedis', 'MemoryCache'],
    ['incr', 'increment', 'bump', 'add_one'],
    ['expire', 'ttl', 'expires_in', 'set_ttl'],
    ['setex', 'set_ex', 'put_ex', 'store_ttl'],
    ['decode', 'to_str', 'parse', 'unpack'],
    ['collection_name', 'collection', 'table_name', 'index_name'],
    ['connection', 'conn', 'dsn', 'connection_url'],
    ['DATABASE_URL', 'DB_URL', 'POSTGRES_URL', 'DATABASE_DSN'],
    // FastAPI a web
    ['StreamingResponse', 'EventResponse', 'SSEResponse', 'ChunkedResponse'],
    ['HTTPException', 'HttpError', 'APIException', 'RequestError'],
    ['status_code', 'code', 'http_status', 'response_code'],
    ['media_type', 'content_type', 'mime_type', 'response_type'],
    ['Header', 'Cookie', 'Query', 'Body'],
    // LlamaIndex
    ['VectorStoreIndex', 'VectorIndex', 'StoreIndex', 'EmbeddingIndex'],
    ['SimpleDirectoryReader', 'DirectoryReader', 'FolderLoader', 'FileReader'],
    ['load_data', 'read_data', 'fetch_data', 'get_data'],
    ['as_query_engine', 'as_engine', 'to_query_engine', 'make_engine'],
    ['source_nodes', 'sources', 'citations', 'origin_nodes'],
    ['similarity_top_k', 'top_k', 'k_results', 'max_nodes'],
    ['response_mode', 'answer_mode', 'synth_mode', 'reply_mode'],
    ['SentenceSplitter', 'TokenSplitter', 'WordSplitter', 'ParagraphSplitter'],
    ['node_parser', 'parser', 'splitter', 'chunker'],
    ['storage_context', 'context', 'storage', 'store_ctx'],
    ['persist', 'save', 'dump', 'flush'],
    ['persist_dir', 'save_dir', 'storage_dir', 'output_dir'],
    ['retrieve', 'search', 'fetch', 'lookup'],
    // moduly / cesty
    ['document_loaders', 'loaders', 'file_loaders', 'readers'],
    ['text_splitters', 'splitters', 'chunkers', 'dividers'],
    ['output_parsers', 'parsers', 'formatters', 'extractors'],
    ['prompts', 'templates', 'prompt_templates', 'messages'],
    ['runnables', 'chains', 'pipelines', 'components'],
    ['text-embedding-3-small', 'text-embedding-3-large', 'gpt-4o-mini-embed', 'embedding-ada-002'],
    ['gpt-4o-mini', 'gpt-4o', 'gpt-3.5-turbo', 'o1-mini'],
    ['llama3.2', 'mistral', 'phi3', 'gemma2'],
    ['nomic-embed-text', 'all-minilm', 'mxbai-embed', 'bge-small'],
    // bezpečnostné pojmy
    ['LLM01', 'LLM03', 'LLM06', 'LLM10'],
    ['ANO', 'NIE', 'MOŽNO', 'NEVIEM'],
    ['PASS', 'FAIL', 'OK', 'ERROR'],
    ['MATIKA', 'DOKUMENTY', 'PREKLAD', 'OSTATNE'],
  ];

  /* ── Deterministická náhodnosť (rovnaké poradie pri každom načítaní) ── */
  function hashStr(s) {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function rng(seedStr) {
    let seed = hashStr(seedStr);
    return function () {
      seed = (seed + 0x6D2B79F5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function shuffleDet(arr, seedStr) {
    const r = rng(seedStr);
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(r() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  /* ── Rozptylovače: 3 nesprávne, ale pravdepodobné možnosti ── */
  const VSETKY = POOLS.flat();

  function jadro(tok) {
    // odstráni obalové znaky, nech sa dá porovnať so slovníkom
    // (aj koncové "(", "=" a "," — tokeny typu `PGVector(` či `collection_name=`)
    return tok.replace(/^[\s."'({[]+|[\s."'):}\]=(,]+$/g, '');
  }

  function mutacieMena(meno) {
    // vierohodné varianty mena: async↔sync dvojičky, prefixy, plurál
    const m = [];
    if (/^a[a-z]/.test(meno)) m.push(meno.slice(1));          // ainvoke -> invoke
    else m.push('a' + meno);                                   // invoke -> ainvoke
    if (meno.startsWith('get_')) m.push(meno.slice(4));
    else m.push('get_' + meno);
    m.push(meno + '_all', meno + 's', meno.replace(/_/g, ''));
    return m.filter(x => x && x !== meno);
  }

  function obal(tok, hodnota) {
    // vráti rozptylovač v rovnakom „obale" ako správna odpoveď
    const j = jadro(tok);
    if (!j || j === tok) return hodnota;
    return tok.replace(j, hodnota);
  }

  function distractors(correct, alternatives, seedStr) {
    const zakazane = new Set((alternatives || [correct]).map(a => a.trim()));
    const out = [];
    const j = jadro(correct);

    // 1) rovnaká pojmová skupina
    const pool = POOLS.find(p => p.includes(j));
    if (pool) {
      shuffleDet(pool.filter(x => x !== j), seedStr + ':p').forEach(x => {
        const kandidat = obal(correct, x);
        if (out.length < 3 && !zakazane.has(kandidat.trim())) out.push(kandidat);
      });
    }

    // 2) čísla → susedné hodnoty
    if (out.length < 3 && /^-?\d+(\.\d+)?$/.test(j)) {
      const n = parseFloat(j);
      [n + 1, n - 1 || n + 2, n === 0 ? 1 : n * 2, n + 10].forEach(v => {
        const kandidat = obal(correct, String(Number.isInteger(n) ? Math.round(v) : v));
        if (out.length < 3 && !zakazane.has(kandidat.trim()) && !out.includes(kandidat)) out.push(kandidat);
      });
    }

    // 2b) parameter s číselnou hodnotou (temperature=1.2, k=4): mení sa hodnota
    if (out.length < 3) {
      const mHodnota = /^(.+=)(-?\d+(?:\.\d+)?)(\W*)$/.exec(correct);
      if (mHodnota) {
        const [, pred, cis, po] = mHodnota;
        const n = parseFloat(cis);
        const des = cis.includes('.');
        [n + (des ? 0.5 : 1), n === 0 ? (des ? 0.5 : 1) : n * 2, Math.max(0, n - (des ? 0.5 : 1))]
          .forEach(v => {
            const kandidat = pred + (des ? v.toFixed(1) : Math.round(v)) + po;
            if (out.length < 3 && !zakazane.has(kandidat.trim()) && !out.includes(kandidat)) out.push(kandidat);
          });
      }
    }

    // 3) operátory a drobné znaky
    if (out.length < 3) {
      const OPER = { '|': ['&', '>>', '+'], '+': ['-', '*', '&'], '..': ['.', '~', '//'],
                     'f': ['r', 'b', 'u'], '-1': ['0', '1', '-2'], '0': ['1', '-1', '2'],
                     '==': ['=', '>=', '~='], '>=': ['==', '<=', '=>'], '<=': ['>=', '==', '=<'],
                     '+=': ['=+', '++', '=='], ':=': ['=', '==', '->'], '!=': ['=/=', '==', '<>'] };
      (OPER[j] || []).forEach(v => {
        const kandidat = obal(correct, v);
        if (out.length < 3 && !zakazane.has(kandidat.trim()) && !out.includes(kandidat)) out.push(kandidat);
      });
    }

    // 3a2) tokeny s reťazcovým literálom (os.getenv("DATABASE_URL"):
    //      mení sa obsah literálu, nie okolitý kód
    const sLiteralom = /^(.*["'])([A-Za-z_][\w./-]*)(["']?.*)$/.exec(correct);
    if (out.length < 3 && sLiteralom) {
      const [, pred, obsah, po] = sLiteralom;
      const poolL = POOLS.find(p => p.includes(obsah));
      const kandidati = poolL ? poolL.filter(x => x !== obsah) : mutacieMena(obsah);
      shuffleDet(kandidati, seedStr + ':l').forEach(x => {
        const kandidat = pred + x + po;
        if (out.length < 3 && !zakazane.has(kandidat.trim()) && !out.includes(kandidat)) out.push(kandidat);
      });
    }

    // 3b) zložené tokeny s bodkou (model.ainvoke·, asyncio.gather·):
    //     mení sa IBA časť za poslednou bodkou — rozptylovač ostane vierohodný
    const sBodkou = /^(.*\.)([A-Za-z_]\w*)(\W*)$/.exec(correct);
    if (out.length < 3 && sBodkou) {
      const [, pred, meno, po] = sBodkou;
      const poolM = POOLS.find(p => p.includes(meno));
      const kandidati = poolM ? poolM.filter(x => x !== meno) : mutacieMena(meno);
      shuffleDet(kandidati, seedStr + ':d').forEach(x => {
        const kandidat = pred + x + po;
        if (out.length < 3 && !zakazane.has(kandidat.trim()) && !out.includes(kandidat)) out.push(kandidat);
      });
    }

    // 3c) viacslovné tokeny (async def …, class X(…)): mení sa kľúčové slovo
    if (out.length < 3 && /\s/.test(correct.trim())) {
      const KLUCE = {
        'async def': ['def', 'await def', 'async func'],
        'await': ['async', 'yield', 'return'],
        'async': ['await', 'sync', 'defer'],
        'def': ['func', 'fn', 'define'],
        'class': ['type', 'struct', 'object'],
        'for': ['while', 'each', 'loop'],
        'return': ['yield', 'give', 'output'],
        'import': ['include', 'require', 'use'],
        'not in': ['in', 'is not', 'not is'],
        'is not': ['not is', 'is', '!='],
      };
      const t = correct.trim();
      const kluc = Object.keys(KLUCE)
        .filter(k => t === k || t.startsWith(k + ' '))
        .sort((a, b) => b.length - a.length)[0];      // najdlhšia zhoda ("async def" pred "async")
      if (kluc) {
        KLUCE[kluc].forEach(nahrada => {
          const kandidat = correct.replace(kluc, nahrada);
          if (out.length < 3 && !zakazane.has(kandidat.trim()) && !out.includes(kandidat)) out.push(kandidat);
        });
      }
    }

    // 4) tvarovo podobné pojmy z celého slovníka (len pre jednoduché tokeny)
    if (out.length < 3 && !/\s/.test(correct.trim()) && !sBodkou) {
      const camel = /^[A-Z]/.test(j);
      const snake = /_/.test(j);
      const podobne = VSETKY.filter(x =>
        x !== j && (/^[A-Z]/.test(x) === camel) && (/_/.test(x) === snake) &&
        Math.abs(x.length - j.length) <= 12);
      shuffleDet(podobne, seedStr + ':s').forEach(x => {
        const kandidat = obal(correct, x);
        if (out.length < 3 && !zakazane.has(kandidat.trim()) && !out.includes(kandidat)) out.push(kandidat);
      });
    }

    // 4b) doplnenie mutáciami tej istej „hlavy" — vždy tvarovo blízke originálu
    if (out.length < 3) {
      const cielM = sBodkou ? sBodkou[2] : j;
      const obalPred = sBodkou ? sBodkou[1] : '';
      const obalPo = sBodkou ? sBodkou[3] : '';
      mutacieMena(cielM).forEach(x => {
        const kandidat = sBodkou ? obalPred + x + obalPo : obal(correct, x);
        if (out.length < 3 && !zakazane.has(kandidat.trim()) && !out.includes(kandidat)) out.push(kandidat);
      });
    }

    // 5) núdzové mutácie správnej odpovede
    if (out.length < 3) {
      const mut = [j + '_v2', j.replace(/_/g, ''), j.toUpperCase(), 'get_' + j, j + 's'];
      mut.forEach(x => {
        const kandidat = obal(correct, x);
        if (out.length < 3 && !zakazane.has(kandidat.trim()) && !out.includes(kandidat)) out.push(kandidat);
      });
    }
    return out.slice(0, 3);
  }

  /* ── Pomocné: bezpečné vloženie medzier ⟦n⟧ do kódu ── */
  function vlozMedzery(kod, tokeny) {
    let vystup = kod;
    const pouzite = [];
    tokeny.forEach(tok => {
      if (pouzite.length >= 4) return;
      const idx = vystup.indexOf(tok);
      if (idx === -1) return;
      // nesmie padnúť do už vloženej značky ⟦n⟧
      const pred = vystup.slice(0, idx);
      if ((pred.match(/⟦/g) || []).length !== (pred.match(/⟧/g) || []).length) return;
      vystup = vystup.slice(0, idx) + `⟦${pouzite.length}⟧` + vystup.slice(idx + tok.length);
      pouzite.push(tok);
    });
    return { kod: vystup, tokeny: pouzite };
  }

  function jeVhodnyToken(tok) {
    if (!tok || tok.includes('\n')) return false;
    const t = tok.trim();
    if (t.length < 2 || t.length > 30) return false;
    if (!/[A-Za-z_]/.test(t)) return false;          // musí obsahovať písmeno
    if (/^(import|from|print|the|and)$/.test(t)) return false;
    return true;
  }

  /* ── Hlavný generátor: 10 cvičení pre jednu lekciu ── */
  function buildForLesson(lessonId, lesson) {
    const hotove = [];
    const pridaj = (nazov, kod, tokeny, hint, zdroj) => {
      if (hotove.length >= 10 || !tokeny.length) return;
      const gaps = tokeny.map((t, i) => {
        const alts = Array.isArray(t) ? t : [t];
        const spravna = alts[0];
        const seed = `${lessonId}:${hotove.length}:${i}:${spravna}`;
        const moznosti = shuffleDet([spravna, ...distractors(spravna, alts, seed)], seed + ':o');
        return { spravna, alts, moznosti };
      });
      hotove.push({ nazov, kod, gaps, hint, zdroj });
    };

    // JEDINÝ ZDROJ: cvičenia „Napíš kód" — z ich riešení skryjeme
    // kľúčové prvky, ktoré daná lekcia učí (podľa must tokenov).
    const write = [...(lesson.exercises || []).filter(e => e.t === 'write'),
                   ...((window.EXTRA_WRITE || {})[lessonId] || [])];
    write.forEach(ex => {
      if (hotove.length >= 10 || !ex.solution) return;
      const kandidati = (ex.must || [])
        .map(alts => (Array.isArray(alts) ? alts[0] : alts))
        .map(t => String(t).replace(/^#\d+:/, ''))
        // dlhé tokeny (celé volania) skráť na názov funkcie pred zátvorkou
        .map(t => (t.length > 30 && t.includes('(') ? t.slice(0, t.indexOf('(')) : t))
        .filter(jeVhodnyToken)
        .filter(t => ex.solution.includes(t));
      if (!kandidati.length) return;
      const { kod, tokeny } = vlozMedzery(ex.solution, kandidati.slice(0, 4));
      pridaj(ex.title, kod, tokeny, ex.hint, 'napíš');
    });

    return hotove.slice(0, 10);
  }

  window.CHOICE = { buildForLesson };
})();
