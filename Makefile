SERVICE_NAME=smart-incident-reporting
VERSION=$(shell git rev-parse --short HEAD)

.PHONY: install start backend-up backend-down build-image

all: install

install:
	npm i
	npm rebuild node-sass
	npm run build

start:
	$(MAKE) backend-up
	
	npm start

build-image:
	docker build -t $(SERVICE_NAME):latest .
	docker tag $(SERVICE_NAME):latest \
		$(SERVICE_NAME):$(VERSION)
	docker images | grep $(SERVICE_NAME)

backend-up:
	docker-compose -f docker-compose-dev.yml up -d

backend-down:
	docker-compose down

