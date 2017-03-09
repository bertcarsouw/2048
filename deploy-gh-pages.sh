#!/bin/bash

npm install
grunt
mkdir ../2048-build/
cp -r dist/* ../2048-build/
git checkout .
git checkout gh-pages
rm -rf *
cp -r ../2048-build/* .
git add .
git commit -m "gh-pages update"
git push
rm -rf ../2048-build
git checkout master
git checkout .
npm install
grunt