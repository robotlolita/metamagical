bin   := ../../node_modules/.bin
babel := $(bin)/babel
lint  := $(bin)/eslint
mocha := $(bin)/mocha

.DEFAULT_GOAL: build

build:
	@echo "-- Compiling metamagical-interface"
	$(babel) src/ --source-map inline \
	              --out-dir lib \
	              $$BABEL_OPTIONS

clean:
	rm -rf lib/

lint:
	$(eslint) .

test: build
	$(babel) test/src --source-map inline --out-dir test/spec
	$(mocha) --reporter spec --uid bdd test/spec

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
