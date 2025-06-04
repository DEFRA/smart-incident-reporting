#!/bin/sh

node-sass --output-style=expanded \
  --output=server/public/build/stylesheets \
  client/sass
