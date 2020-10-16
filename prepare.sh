#!/bin/bash
if [ $? = 0 ]; then
  rm -fr dist
  npx babel src --out-dir dist
else
  echo 'Code cant be verify, plz check ~'
fi
