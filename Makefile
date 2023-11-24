SERVICE_NAME=smart-incident-reporting
VERSION=$(shell git rev-parse --short HEAD)
NODE_VERSION=$(cat .nvmrc)

.PHONY: install start backend-up backend-down build-image

APPS=nvm

all: install

install:
	brew install ${APPS}
	NVM_DIR="$${HOME}/.nvm" && . "$${NVM_DIR}/nvm.sh" && nvm install ${NODE_VERSION}
	NVM_DIR="$${HOME}/.nvm" && . "$${NVM_DIR}/nvm.sh" && nvm use ${NODE_VERSION}
	npm i
	npm rebuild node-sass
	npm run build

start:
	$(MAKE) backend-up
	
	npm run build
	npm run dev

restart:
	kill -9 $(lsof -t -i:8000)
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

