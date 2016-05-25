bin   := ../../node_modules/.bin
babel := $(bin)/babel
lint  := $(bin)/eslint
mocha := $(bin)/mocha

.DEFAULT_GOAL: build

build:
	@echo "-- Compiling Babel plugin: metamagical-comments"
	$(babel) src/ --source-map inline \
	              --out-dir lib \
	              $$BABEL_OPTIONS

clean:
	rm -rf lib/

lint:
	$(eslint) .

test: build
	exit 0

publish: clean-test
	npm publish

install:
	npm install

clean-test:
	$(MAKE) clean
	rm -rf node_modules
	npm install
	$(MAKE) test

.PHONY: build clean lint test clean-test install publish
