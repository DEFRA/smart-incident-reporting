SERVICE_NAME=smart-incident-reporting
VERSION=$(shell git rev-parse --short HEAD)
NODE_VERSION=$(cat .nvmrc)

.PHONY: install start backend-up backend-down build-image install-nodejs-version use-nodejs-version

APPS=nvm

all: install

install:
	brew install ${APPS}
	npm i
	npm rebuild node-sass # this is needed if it runs in osx since sass is a very old lib it needs rebuiling
	npm run build

install-nodejs-version:
	NVM_DIR="$${HOME}/.nvm" && . "$${NVM_DIR}/nvm.sh" && nvm install ${NODE_VERSION}

use-nodejs-version:
	NVM_DIR="$${HOME}/.nvm" && . "$${NVM_DIR}/nvm.sh" && nvm use ${NODE_VERSION}

start:
	$(MAKE) backend-up
	
	npm run build
	npm run dev

build-image:
	docker build -t $(SERVICE_NAME):latest .
	docker tag $(SERVICE_NAME):latest \
		$(SERVICE_NAME):$(VERSION)
	docker images | grep $(SERVICE_NAME)

backend-up:
	docker-compose up -d

backend-down:
	docker-compose down

