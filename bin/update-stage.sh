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

# Git configuration
git config --global user.email "statusbot@mozmar.org"
git config --global user.name "mozmar-statusbot"


# Build site
pushd ./local-dev
npm run build
npm run finalize
popd

git add -f docs
git commit -m "Automatic npm build."

# Push to develop only if there are commit changes.
if [[ $? == 0 ]];
then
    echo "Pushing to ${DEVELOP_REPOSITORY}"
    git remote add develop-rw https://${GITHUB_AUTH_TOKEN}@github.com/${DEVELOP_REPOSITORY}.git
    git push -f develop-rw develop 2> /dev/null
fi

TMPDIR=$(mktemp -d)
pushd ${TMPDIR}
git clone https://github.com/${STAGING_REPOSITORY}.git .

TMP=$(mktemp)

# Tar the files to be preserved
tar cf $TMP ${PRESERVE_FILES}

# Delete everything except .git directory
find . -maxdepth 1 -not -path "./.git" -not -path '.' -exec rm -rf {} \;
popd

# Copy everything except git directory
find . -maxdepth 1  -not -path './.git' -not -path '.' -exec cp -r {} ${TMPDIR} \;
pushd ${TMPDIR}

# Restore preserved files
tar xf ${TMP}

# Commit to staging repository
git add .
git commit -m "Site update"



# Push to staging only if there are commit changes.
if [[ $? == 0 ]];
then
    echo "Pushing to ${STAGING_REPOSITORY}"
    git remote add staging-rw https://${GITHUB_AUTH_TOKEN}@github.com/${STAGING_REPOSITORY}.git
    git push -f staging-rw master 2> /dev/null
fi
