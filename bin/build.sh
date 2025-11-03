#!/bin/sh
rm -rf server/public
npm run build:js
npm run copy:static
npm run build:css
