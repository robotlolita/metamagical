help:
	@echo ""
	@echo "AVAILABLE TASKS"
	@echo ""
	@echo "  compile ................ Compiles the project."
	@echo "  clean .................. Removes build artifacts."
	@echo "  test ................... Runs the tests for the project."
	@echo "  test-watch ............. Runs the tests on every change."
	@echo "  lint ................... Lints all source files."
	@echo ""


# ----------------------------------------------------------------------
bin     := $(shell npm bin)
babel   := $(bin)/babel
eslint  := $(bin)/eslint
mocha   := $(bin)/mocha

# -- [ CONFIGURATION ] -------------------------------------------------
ifndef PACKAGES
	export PACKAGES = $(wildcard packages/*)
endif

# -- [ TASKS ] ---------------------------------------------------------
.PHONY: help compile compile-test clean test lint test-watch

node_modules: package.json
	npm install

compile:
	./Scripts/compile.sh "$$PACKAGES" "$(babel)" "$$BABEL_OPTIONS"
	
compile-assertion-comments:
	PACKAGES=packages/babel-plugin-assertion-comments $(MAKE) compile
	
compile-metamagical-comments:
	PACKAGES=packages/babel-plugin-metamagical-comments $(MAKE) compile
	
compile-interface:
	PACKAGES=packages/interface $(MAKE) compile

compile-mocha-bridge:
	PACKAGES=packages/mocha-bridge $(MAKE) compile

clean:
	rm -r packages/**/lib

lint:
	$(eslint) .
