# Backspace website

The Backspace website code and development tooling.

This is a static website hosted on github and managed using the built-in Jekyll
support in Github. Some javascript tooling is used to help with making local
development and production builds.

## Development

To run local development builds follow these steps:

1. run `gem install jekyll`: installs jekyll which so you can generate the site locally 
2. run `npm install`: this should install all dependencies
3. run `gulp`: this should build the js and open a, livereload, dev environment

## Deployment

The static site is hosted on Github. Simply push the master branch to release a
new version of the website.

1. `git push origin master`
