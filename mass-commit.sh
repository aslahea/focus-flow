#!/bin/bash

set -e

FILES=$(git ls-files)

COUNT=1

for FILE in $FILES; do
  echo "// commit marker $COUNT" >> "$FILE"
  git add "$FILE"
  git commit -m "chore: incremental update $COUNT for repository history"
  COUNT=$((COUNT+1))

  if [ $COUNT -ge 420 ]; then
    break
  fi
done

echo "✅ Created $COUNT commits"
