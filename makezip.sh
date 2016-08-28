#!/bin/bash
set -e

CURRENT_DIR=`pwd`
TMP_DIR=`mktemp -d`
GIT_SHA=`git rev-parse HEAD`
ENVIRONMENT=${ENVIRONMENT:-staging}
ZIP_FILENAME="${CURRENT_DIR}/lambda-${ENVIRONMENT}.zip"

rm -f ${ZIP_FILENAME}
pushd ${TMP_DIR}
pip install -r ${CURRENT_DIR}/requirements.txt -t .
cp -ra ${CURRENT_DIR}/app/* .
cp -rp ${CURRENT_DIR}/app/.env.${ENVIRONMENT} .env
echo GIT_SHA=${GIT_SHA} >> .env
find . -name \*.pyc -delete
zip -r ${ZIP_FILENAME} .
popd
rm -rf ${TMP_DIR}
