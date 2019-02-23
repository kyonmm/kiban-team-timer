#! /bin/sh

if [ -n "$(git status --porcelain)" ]; then
  exit 1
fi

cd kiban-team-timer
yarn build

cd ..
rm -rf docs
mkdir docs
cp -r kiban-team-timer/dist/* docs

git add -A
git commit -m "execute ./gen-docs.sh"
