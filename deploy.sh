#!/usr/bin/env sh

set -e

npm run docs:build

cd docs/.vitepress/dist

echo 'www.zwd.zyx' > CNAME

git init
git add -A
git commit -m 'deploy'

git push -f git@github.com:hojas/fe-stack.git main:gh-pages

cd -
