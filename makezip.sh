#!/bin/bash
set -e

CURRENT_DIR=`pwd`
TMP_DIR=`mktemp -d`
GIT_SHA=`git rev-parse HEAD`
rm -f $CURRENT_DIR/lambda.zip

pushd $TMP_DIR
pip install -r $CURRENT_DIR/requirements.txt -t .
cp -ra $CURRENT_DIR/app/* .
cp -rp $CURRENT_DIR/app/.env.production .env
echo GIT_SHA=$GIT_SHA >> .env
find . -name \*.pyc -delete
zip -r $CURRENT_DIR/lambda.zip .
popd
rm -rf $TMP_DIR
