/* ============================================================
   Python syntax highlighter (PyCharm Darcula farby) + utility
   ============================================================ */
(function () {
  'use strict';

  const KEYWORDS = new Set([
    'False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await', 'break',
    'class', 'continue', 'def', 'del', 'elif', 'else', 'except', 'finally',
    'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda', 'nonlocal',
    'not', 'or', 'pass', 'raise', 'return', 'try', 'while', 'with', 'yield'
  ]);

  const BUILTINS = new Set([
    'print', 'len', 'range', 'str', 'int', 'float', 'list', 'dict', 'set',
    'tuple', 'open', 'input', 'type', 'isinstance', 'enumerate', 'zip', 'map',
    'filter', 'sum', 'min', 'max', 'abs', 'round', 'sorted', 'super', 'exit'
  ]);

  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // Jednoprechodový tokenizér — žiadne dvojité nahrádzanie
  const MASTER = new RegExp(
    [
      '("""[\\s\\S]*?"""|\'\'\'[\\s\\S]*?\'\'\')',              // 1 triple string
      '(#[^\\n]*)',                                              // 2 komentár
      '([rbuf]{0,2}"(?:\\\\.|[^"\\\\\\n])*"|[rbuf]{0,2}\'(?:\\\\.|[^\'\\\\\\n])*\')', // 3 string
      '(@[A-Za-z_][\\w.]*)',                                     // 4 dekorátor
      '(\\b\\d+(?:\\.\\d+)?\\b)',                                // 5 číslo
      '(\\b[A-Za-z_]\\w*\\b)'                                    // 6 identifikátor
    ].join('|'),
    'g'
  );

  function highlightPython(code) {
    let out = '';
    let last = 0;
    let m;
    MASTER.lastIndex = 0;
    while ((m = MASTER.exec(code)) !== null) {
      out += escapeHtml(code.slice(last, m.index));
      const [full, triple, comment, str, dec, num, ident] = m;
      if (triple) {
        out += '<span class="str">' + escapeHtml(triple) + '</span>';
      } else if (comment) {
        out += '<span class="com">' + escapeHtml(comment) + '</span>';
      } else if (str) {
        // zvýrazni {placeholdery} vo f-stringoch jemne
        const esc = escapeHtml(str);
        out += '<span class="str">' + esc.replace(/(\{[^}]*\})/g, '<span class="fstr">$1</span>') + '</span>';
      } else if (dec) {
        out += '<span class="dec">' + escapeHtml(dec) + '</span>';
      } else if (num) {
        out += '<span class="num">' + escapeHtml(num) + '</span>';
      } else if (ident) {
        if (KEYWORDS.has(ident)) {
          out += '<span class="kw">' + ident + '</span>';
        } else if (BUILTINS.has(ident)) {
          out += '<span class="builtin">' + ident + '</span>';
        } else if (ident === 'self' || ident === 'cls') {
          out += '<span class="self">' + ident + '</span>';
        } else {
          // názov funkcie pri volaní → žltá (pozri čo nasleduje)
          const rest = code.slice(m.index + full.length);
          const prev = code.slice(0, m.index);
          if (/^\s*\(/.test(rest) && !/\b(def|class)\s+$/.test(prev)) {
            out += '<span class="fn">' + ident + '</span>';
          } else if (/\b(def|class)\s+$/.test(prev)) {
            out += '<span class="fn">' + ident + '</span>';
          } else {
            out += ident;
          }
        }
      }
      last = m.index + full.length;
    }
    out += escapeHtml(code.slice(last));
    return out;
  }

  // Zvýrazni kód s ⟦n⟧ placeholdrami — segmenty zvýrazni samostatne
  function highlightWithBlanks(code, inputBuilder) {
    const parts = code.split(/⟦(\d+)⟧/g);
    let out = '';
    for (let i = 0; i < parts.length; i++) {
      if (i % 2 === 0) {
        out += highlightPython(parts[i]);
      } else {
        out += inputBuilder(parseInt(parts[i], 10));
      }
    }
    return out;
  }

  window.PyHL = { highlightPython, highlightWithBlanks, escapeHtml };
})();
