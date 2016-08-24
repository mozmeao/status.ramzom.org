#!/bin/bash
set -e

if [[ -z "${DEVELOP_REPOSITORY}" ]]; then
    echo "Set DEVELOP_REPOSITORY"
    exit 1;
fi

if [[ -z "${GITHUB_AUTH_TOKEN}" ]]; then
    echo "Set GITHUB_AUTH_TOKEN"
    exit 1;
fi

git clone https://github.com/${DEVELOP_REPOSITORY} ~/develop


# Delete all files from develop repo except from the git dir
pushd ~/develop
find . -maxdepth 1  -not -path './.git' -not -path '.' -exec rm -rf {} \;
popd
find . -maxdepth 1  -not -path './.git' -not -path '.' -exec cp -r {} ~/develop \;
pushd ~/develop

# Add CNAME file for GitHub pages.
CNAME_PATH=${CNAME_PATH:-./docs/CNAME}
mkdir -p $(dirname ${CNAME_PATH})
echo ${CNAME} > ${CNAME_PATH}

git config --global user.email "statusbot@mozmar.org"
git config --global user.name "mozmar-statusbot"
git add .
git commit -m "Site update"
git remote add origin-rw https://${GITHUB_AUTH_TOKEN}@github.com/${DEVELOP_REPOSITORY}
git push -f origin-rw master
