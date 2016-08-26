#!/bin/bash
set -e

if [[ -z "${STAGING_REPOSITORY}" ]]; then
    echo "Set STAGING_REPOSITORY"
    exit 1;
fi

if [[ -z "${GITHUB_AUTH_TOKEN}" ]]; then
    echo "Set GITHUB_AUTH_TOKEN"
    exit 1;
fi

PRESERVE_FILES="./docs/CNAME ./docs/status.yml"

git clone https://github.com/${STAGING_REPOSITORY} ~/develop

# Delete all files from develop repo except from the git dir
pushd ~/develop
TMP=$(mktemp)

# Tar the files to be preserved
tar cf $TMP ${PRESERVE_FILES}

# Delete everything except .git directory
find . -maxdepth 1 -not -path "./.git" -not -path '.' -exec rm -rf {} \;
popd

# Copy everything except git directory
find . -maxdepth 1  -not -path './.git' -not -path '.' -exec cp -r {} ~/develop \;
pushd ~/develop

# Restore preserved files
tar xf ${TMP}

# Commit to staging repository
git config --global user.email "statusbot@mozmar.org"
git config --global user.name "mozmar-statusbot"
git add .
git commit -m "Site update"
git remote add origin-rw https://${GITHUB_AUTH_TOKEN}@github.com/${STAGING_REPOSITORY}
git push -f origin-rw master
