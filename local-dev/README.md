Built from
[Create React App](https://github.com/facebookincubator/create-react-app)

# Local Development

Local development happens in the `/local-dev` folder. Run ye olde
`npm install` to pull down the giant dependency stack we're all totally
comfortable with these days.

Run `npm run start` to spin up a development server at `localhost:3000`.

When you are finished making updates to the app, run `npm run build` to package
it all up for deployment. This will create a `/local-dev/build` directory with
the minified/concatenated final code.

If you want to test the build, first copy `status.yml` from `/local-dev` into
`/local-dev/build`. Then `cd` into `/local-dev/build`, run
`python -m SimpleHTTPServer`, and open up `localhost:8000` in a browser.

After verifying the build, `cd` back to `/local-dev` and run `npm run finalize`.
This will move the build from `/local-dev/build` to the `/docs` folder, then
remove the (now empty) `/local-dev/build` folder.

Note that **the `finalize` script will remove all files in the `/docs` folder**
except for the following:

- .gitignore
- CNAME
- status.yml

(To alter this ignore list, modify the `blessedFiles` array in
`/local-dev/scripts/finalize.js`.)

All *folders* in the `/docs` directory are ignored by the `finalize` script.

If you copied `status.yml` into `/local-dev/build`, it will *not* be moved into
the `/docs` folder.

If you like double-checking things, spin up that simple Python server in the
`/docs` directory to verify the moved build is (still) in good shape.

Assuming all is well, make your commit and push it on up to GitHub.
