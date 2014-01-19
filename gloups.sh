#!/bin/bash

DATECURRENT="$(date '+%Y-%m-%d')"
GLOUPSPATH="$(pwd)"
APPPATH=$GLOUPSPATH/src/js
VIEWSPATH=$GLOUPSPATH/src/js/views
PARTIALSPATH=$GLOUPSPATH/src/partials
ROUTER="$GLOUPSPATH/src/js/routers/router.js"
ROUTER="$(cat $ROUTERFILE)"
BUILDPATH=$GLOUPSPATH/.generator

TPL="$(cat $BUILDPATH/view.js)"
LOWER="$(echo $1 | tr '[:upper:]' '[:lower:]')"

# Create the main view
# sed -e "s/==view==/$1/g"  -e "s/==viewlower==/$LOWER/g" <<< "$TPL" > "$VIEWSPATH/$LOWER.js"

# echo "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Delectus, earum, laudantium, commodi harum illum dolore sed voluptatum possimus qui odit reprehenderit vero ducimus veritatis voluptatem quidem? Ab necessitatibus repellendus perferendis." > "$PARTIALSPATH/$LOWER.html"

sed -e "s/'home': 'home'/'home': 'home',\n\t'$1': '$1'/g" <<< "$ROUTER"