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
bin    := $(shell npm bin)
babel  := $(bin)/babel
eslint := $(bin)/eslint
mocha  := $(bin)/mocha


# -- [ CONFIGURATION ] -------------------------------------------------
PACKAGES := $(wildcard packages/*)


# -- [ TASKS ] ---------------------------------------------------------
.PHONY: help compile compile-test clean test lint test-watch

node_modules: package.json
	npm install

compile: $(PACKAGES)
	for package in $(PACKAGES); do \
	  if [ -d $$package/src ]; then\
	    $(babel) $$package/src --source-map inline \
	                           --out-dir    $$package/lib \
	                           $(BABEL_OPTIONS); \
	  fi; \
	done; \

# compile-test:
# 	$(babel) test/src --source-map inline \
# 	                  --out-dir    test/spec \
# 	                  $(BABEL_OPTIONS)
# 
# clean:
# 	rm -rf lib test/spec
# 
# test: compile compile-test
# 	$(mocha) test/spec --reporter spec \
# 	                   --ui       bdd
# 
# test-watch: compile compile-test
# 	BABEL_OPTIONS=--watch $(MAKE) compile &
# 	BABEL_OPTIONS=--watch $(MAKE) compile-test &
# 	$(mocha) test/spec --reporter min \
# 	                   --ui       bdd \
# 	                   --watch

lint:
	$(eslint) .
