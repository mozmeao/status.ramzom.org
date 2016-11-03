var fs = require('fs-extra');
var path = require('path');

var buildPath = path.join(__dirname, '../build');
var deployPath = __dirname.replace('/local-dev/scripts', '/docs');

// files to be ignored when finalizing build into /docs directory
var blessedFiles = ['.gitignore', '.gitkeep', 'CNAME', 'status.yml'];

// make sure /build directory exists
fs.exists(buildPath, exists => {
    'use strict';

    if (exists) {
        // clear out /docs directory, ignoring directories and blessed files
        // as of create-react-app 0.7.0 (10/22/16), this removes:
        // - docs/index.html
        // - docs/asset-manifest.json
        console.log('# Removing files from deploy path...');

        fs.readdir(deployPath, (err, items) => {
            // iterate over each item in deployPath
            for (let item of items) {
                // get stats on each item
                fs.stat(deployPath + '/' + item, (err, stats) => {
                    // if no error and stats are available
                    if (!err && stats && stats.isFile()) {
                        if (blessedFiles.indexOf(item) === -1) {
                            fs.remove(deployPath + '/' + item, err => {
                                if (!err) {
                                    console.log('🗑 Removed: ' + item);
                                } else {
                                    console.error('❗️ Error removing ' + item);
                                    console.error(err);
                                }
                            });
                        }
                        // be verbose about what *isn't* being removed from the build directory
                        else {
                            console.log('🙈 Ignored removing ' + item + '...');
                        }
                    }
                });
            }

            // remove /docs/static directory, which contains all compressed/built
            // JS, CSS, and images
            fs.exists(deployPath + '/static', exists => {
                if (exists) {
                    fs.remove(deployPath + '/static', err => {
                        if (!err) {
                            console.log('🗑 Removed: /static directory');
                        } else {
                            console.error('❗️ Error removing /static directory');
                            console.error(err);
                        }
                    });
                }
            });

            // walk /build and move each file into /docs
            console.log('# Copying items from build path to deploy path...');

            fs.walk(buildPath).
                on('data', item => {
                    // moves all files and subfolders from buildPath to deployPath
                    // does not overwrite any existing files (e.g. status.yml)
                    if (item.stats.isFile()) {
                        var filePath = item.path.replace(__dirname.replace('/scripts', '/build'), '');

                        fs.move(item.path, deployPath + filePath, { clobber: false }, err => {
                            // status.yml will exist in /build
                            // don't throw an error if we can't move that file
                            if (err && !(err.code === 'EEXIST' && item.path.indexOf('status.yml') > -1)) {
                                console.error('❗ ️Error moving: ' + filePath);
                                console.error(err);
                            } else {
                                console.log('✅ Moved: ' + filePath);
                            }
                        });
                    }
                }).on('end', () => {
                    // finally, get rid of /build directory
                    fs.remove(buildPath, err => {
                        if (err) {
                            console.error('❗️ Error removing /build directory:');
                            console.error(err);
                        } else {
                            console.log('🗑 Removed /build directory');
                        }
                    });
                }).on('error', (err) => {
                    console.error('❗️ Error walking the /build directory:');
                    console.error(err);
                });
        });
    } else {
        console.log('❗ No /build directory found!');
        console.log('💡 Run `npm run build` first.');
    }
});
