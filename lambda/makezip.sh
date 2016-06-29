#!/bin/bash
set -e

CURRENT_DIR=`pwd`
TMP_DIR=`mktemp -d`

pushd $TMP_DIR
pip install -r $CURRENT_DIR/requirements.txt -t .
cp -ra $CURRENT_DIR/app/. .
zip -r $CURRENT_DIR/lambda.zip .
popd
rm -rf $TMP_DIR
