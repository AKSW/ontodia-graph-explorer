#!/bin/bash
set -eu

t=/usr/local/apache2/tpl
d=/usr/local/apache2/htdocs

make_instance() {
    local path="$1"
    local endpoint="$2"
    local lucene="$3"
    local creds="$4"
    local ldv="$5"
    local g="$6"
    local i
    local fetch_credentials
    local title_prefix

    path="${path#/}"

    if [ "$g" -gt 0 ] && [ "$lucene" = redirect ]; then
	if [ -z "$path" ]; then
	    path=index
	fi
	echo "<html>
  <meta http-equiv='refresh' content='0; url=$endpoint' />
</html>" > "$d/$path.html"
	if [ "$path" = index ]; then
	    path=
	fi
	echo "
Entry $g:
PATH          = /$path
Redirect to   : $endpoint
"
	return 1
    fi

    if [ "$lucene" = yes ]; then
	i=fuseki-lucene
    elif [ "$lucene" = no ]; then
	i=fuseki-regexsearch
    else
	if [ "$g" -eq 0 ]; then
	    echo "LUCENE_SEARCH is set to \`${lucene}' but must be yes or no"
	else
	    echo "Entry $g (/$path): third option (lucene) is set to \`${lucene}' but must be yes or no"
	fi
	exit 1
    fi

    if [ "$creds" = yes ]; then
	fetch_credentials=include
    elif [ "$creds" = no ]; then
	fetch_credentials=same-origin
    else
	if [ "$g" -eq 0 ]; then
	    echo "USE_CREDS is set to \`${creds}' but must be yes or no"
	else
	    echo "Entry $g (/$path): fourth option (creds) is set to \`${creds}' but must be yes or no"
	fi
	exit 1
    fi

    if [ -z "$endpoint" ]; then
	if [ "$g" -eq 0 ]; then
	    echo "ENDPOINT_URL not set"
	else
	    echo "Entry $g (/$path): second option (endpoint) not set"
	fi
	exit 1
    fi

    if [ -z "$path" ]; then
	path=index
    fi

    if [ "$path" = index ]; then
	title_prefix=""
    else
	title_prefix="$path - "
    fi

    env -i \
	ENDPOINT_URL="$endpoint" \
	WEB_PATH="$path" \
	FETCH_CREDENTIALS="$fetch_credentials" \
	LUCENE_SEARCH="$lucene" \
	TITLE_PREFIX="$title_prefix" \
	LDV_URL="$ldv" \
	perl -p -e 's|@([A-Z_]{3,})@|$ENV{$1}//$&|ge' "$t/$i.bundle.js" > "$d/$path.bundle.js"

    env -i \
	ENDPOINT_URL="$endpoint" \
	WEB_PATH="$path" \
	FETCH_CREDENTIALS="$fetch_credentials" \
	LUCENE_SEARCH="$lucene" \
	TITLE_PREFIX="$title_prefix" \
	LDV_URL="$ldv" \
	perl -p -e 's|@([A-Z_]{3,})@|$ENV{$1}//$&|ge;s|'"$i"'|'"$path"'|g' "$t/$i.bundle.js.map" > "$d/$path.bundle.js.map"

    env -i \
	ENDPOINT_URL="$endpoint" \
	WEB_PATH="$path" \
	FETCH_CREDENTIALS="$fetch_credentials" \
	LUCENE_SEARCH="$lucene" \
	TITLE_PREFIX="$title_prefix" \
	LDV_URL="$ldv" \
	perl -p -e 's|"explorer\.bundle\.js\??[^"]*"|"'"$path.bundle.js"'?'"$(openssl dgst -binary "$d/$path.bundle.js" | basenc --base64url --wrap=0)"'"|;s|@([A-Z_]{3,})@|$ENV{$1}//$&|ge;' \
	"$t/index.html" > "$d/$path.html"

    if [ "$path" = index ]; then
	path=
    fi

    if [ "$g" -eq 0 ]; then
	echo "
"
    else
	echo "
Entry $g:"
    fi
    echo "PATH          = /$path
ENDPOINT_URL  = $endpoint
USE_CREDS     = $creds
LUCENE_SEARCH = $lucene
LDV_URL       = $ldv
"
}

has_instance=0
if [ "${ENDPOINT_MAP+x}" = x ]; then
    g=0
    while IFS='|' read path endpoint lucene creds ldv x; do
	let g=g+1
	valid=0
	if [ -n "$path$endpoint$lucene$creds$ldv$x" ]; then
	    make_instance "$path" "$endpoint" "${lucene:-yes}" "${creds:-yes}" "$ldv" "$g" "$x" || valid=$?
	    if [ "$valid" -eq 0 ]; then
		has_instance=1
	    fi
	fi
    done <<<"$ENDPOINT_MAP"
fi

if [ "${ENDPOINT_URL+x}" = x ]; then
    make_instance "index" "$ENDPOINT_URL" "${LUCENE_SEARCH-yes}" "${USE_CREDS-yes}" "${LDV_URL-}" "0" ""
    has_instance=1
fi

if [ "$has_instance" -eq 0 ]; then
    echo "ENDPOINT_URL not set"
    exit 1
fi

exec httpd-foreground
