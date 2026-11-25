#!/bin/bash
set -euo pipefail

BASE_URL="https://t.nil.ninja/iosdc-japan/2025/code-battle"

fetch() {
  curl -fsS --create-dirs -o "frontend/$2" "$BASE_URL/$1"
}

# Icons
fetch files/img/KeisukeSakata/icon.png  public/files/img/KeisukeSakata/icon.png
fetch files/img/WorldDownTown/icon.jpg  public/files/img/WorldDownTown/icon.jpg
fetch files/img/kagaffy/icon.jpg        public/files/img/kagaffy/icon.jpg
fetch files/img/kazuya/icon.jpg         public/files/img/kazuya/icon.jpg
fetch files/img/kntkymt/icon.jpg        public/files/img/kntkymt/icon.jpg
fetch files/img/log5/icon.jpg           public/files/img/log5/icon.jpg

# API
fetch api/games                          data/games.json
fetch api/games/8                        data/games/8.json
fetch api/games/9                        data/games/9.json
fetch api/games/10                       data/games/10.json
fetch api/games/11                       data/games/11.json
fetch api/games/12                       data/games/12.json
fetch api/games/8/watch/ranking          data/games/8/watch/ranking.json
fetch api/games/9/watch/ranking          data/games/9/watch/ranking.json
fetch api/games/10/watch/ranking         data/games/10/watch/ranking.json
fetch api/games/11/watch/ranking         data/games/11/watch/ranking.json
fetch api/games/12/watch/ranking         data/games/12/watch/ranking.json
fetch api/games/8/watch/latest_states    data/games/8/watch/latest_states.json
fetch api/games/9/watch/latest_states    data/games/9/watch/latest_states.json
fetch api/games/10/watch/latest_states   data/games/10/watch/latest_states.json
fetch api/games/11/watch/latest_states   data/games/11/watch/latest_states.json
fetch api/games/12/watch/latest_states   data/games/12/watch/latest_states.json
fetch 'api/tournament?game1=8&game2=9&game3=10&game4=11&game5=12' data/tournament.json

# Rewrite labels of tournament participants
#
#   user_id: 9=log5 10=kntkymt 13=kagaffy 14=kazuya 17=KeisukeSakata 19=WorldDownTown
grep -rlE '"user_id":(9|10|13|14|17|19),' frontend/data | sort | while read -r f; do
  jq -c '
    {"10": "優勝", "14": "準優勝", "13": "ベスト4", "9": "ベスト4", "17": "ベスト6", "19": "ベスト6"} as $labels
    | walk(
        if type == "object" and has("user_id") and has("label")
        then .label = ($labels[.user_id | tostring] // .label)
        else . end)
  ' "$f" > "$f.tmp"
  mv "$f.tmp" "$f"
done
