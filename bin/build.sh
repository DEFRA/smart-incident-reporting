#!/bin/sh
rm -rf server/public
npm run copy:static
npm run build:css
