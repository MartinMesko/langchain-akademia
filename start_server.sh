#!/bin/bash
# ============================================================================
# start_server.sh — robustný launcher pre LangChain Akadémiu
# Naštartuje lokálny web server (kvôli SPOĽAHLIVÉMU ukladaniu postupu —
# localStorage funguje len na pravom origine, nie cez file://) a otvorí
# aplikáciu v predvolenom prehliadači. Volá ho ikona na ploche.
#
# DÔLEŽITÉ (origin): appku otváraj VŽDY cez túto ikonu (http://127.0.0.1:8765).
# Nikdy nedvojklikaj index.html (file://) — localStorage je viazaný na origin
# a postup by sa javil ako stratený.
# ============================================================================
set -u
umask 077

# --- Absolútne cesty (PATH z 'do shell script' je minimálny: /usr/bin:/bin) ---
PYTHON="/usr/bin/python3"
CURL="/usr/bin/curl"
[ -x "$PYTHON" ] || PYTHON="$(/usr/bin/command -v python3 2>/dev/null || true)"
[ -x "$CURL" ]   || CURL="$(/usr/bin/command -v curl 2>/dev/null || true)"
OPEN="/usr/bin/open"
LSOF="/usr/sbin/lsof"
[ -x "$LSOF" ] || LSOF="$(/usr/bin/command -v lsof 2>/dev/null || true)"

DIR="/Users/martin/Desktop/Study/Langchain_5"
PORT=8765
HOST="127.0.0.1"
URL="http://${HOST}:${PORT}/index.html"
MARKER="LangChain Akadémia"   # tento titulok servuje len NAŠA appka
LOG="${DIR}/.server.log"
LOCK="${DIR}/.server.lock"    # atomický mkdir-zámok proti súbežnému dvojkliku

# --- GUI chybový helper — zlyhanie je vždy viditeľné, nikdy ticho ---
fail() {
  /usr/bin/osascript -e "display alert \"LangChain Akadémia\" message \"$1\" as critical giving up after 20" >/dev/null 2>&1 || true
  echo "ERROR: $1" >&2
  exit 1
}

# --- Predpoklady ---
[ -n "$PYTHON" ] && [ -x "$PYTHON" ] || fail "python3 sa nenašiel (skúšané /usr/bin/python3 aj PATH)."
[ -n "$CURL" ]   && [ -x "$CURL" ]   || fail "curl sa nenašiel."
[ -d "$DIR" ]                        || fail "Priečinok neexistuje: $DIR"
[ -f "${DIR}/index.html" ]           || fail "Chýba index.html v: $DIR"

# 0 = na porte odpovedá NÁŠ server (index obsahuje marker)
ours_is_answering() {
  "$CURL" -s -L --max-time 2 "$URL" 2>/dev/null | /usr/bin/grep -q "$MARKER"
}

# --- 1) Náš server už beží? Len znova otvor (idempotentné). ---
if ours_is_answering; then
  "$OPEN" "$URL"
  exit 0
fi

# --- 2) Port drží CUDZÍ proces (HTTP-ale-iný alebo nie-HTTP daemon)? ---
if [ -n "$LSOF" ] && "$LSOF" -nP -iTCP:"${PORT}" -sTCP:LISTEN >/dev/null 2>&1; then
  fail "Port ${PORT} je obsadený iným programom. Zatvor ho, alebo v terminále spusti:  lsof -ti tcp:${PORT} | xargs kill"
fi

# --- 3) Zámok proti dvom rýchlym dvojklikom (nech nebindujú port dvakrát) ---
if ! /bin/mkdir "$LOCK" 2>/dev/null; then
  j=0
  while [ "$j" -lt 30 ]; do
    ours_is_answering && { "$OPEN" "$URL"; exit 0; }
    /bin/sleep 0.2
    j=$((j + 1))
  done
  /bin/rmdir "$LOCK" 2>/dev/null || true
  /bin/mkdir "$LOCK" 2>/dev/null || true
fi
trap '/bin/rmdir "$LOCK" 2>/dev/null || true' EXIT

# --- 4) Štart servera PLNE odpojený, aby 'do shell script' okamžite vrátil ---
: > "$LOG" 2>/dev/null || true
nohup "$PYTHON" -m http.server "$PORT" --bind "$HOST" --directory "$DIR" \
  </dev/null >"$LOG" 2>&1 &
SERVER_PID=$!
disown 2>/dev/null || true

# --- 5) Čakaj, kým NÁŠ server odpovie (max ~5 s); detekuj skorý pád ---
i=0
while [ "$i" -lt 25 ]; do
  if ours_is_answering; then
    "$OPEN" "$URL"
    exit 0
  fi
  if ! /bin/kill -0 "$SERVER_PID" 2>/dev/null; then
    fail "HTTP server sa nepodarilo spustiť na ${HOST}:${PORT}. Posledný log:\n$(/usr/bin/tail -n 3 "$LOG" 2>/dev/null)"
  fi
  /bin/sleep 0.2
  i=$((i + 1))
done

# --- 6) Timeout: neotváraj rozbitú stránku ticho ---
fail "Server neodpovedal do 5 sekúnd. Pozri ${LOG}. Posledný log:\n$(/usr/bin/tail -n 5 "$LOG" 2>/dev/null)"
