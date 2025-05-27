#!/bin/bash

git init

git add . 

git commit -m "init"

echo "Enter Your Repo URL"
read git_url 

git remote add origin "$git_url"

git branch -M main 

git push origin main 

echo "Code Pushed Success"


