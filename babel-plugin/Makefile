.DEFAULT_GOAL = help

bin    := ../node_modules/.bin
babel  := $(bin)/babel
eslint := $(bin)/eslint


# -- [ CONFIGURATION ] -------------------------------------------------
SRC_DIR := src
SRC := $(shell find $(SRC_DIR)/ -name '*.js')
TGT := ${SRC:$(SRC_DIR)/%.js=%.js}


# -- [ TASKS ] ---------------------------------------------------------
help:
	@echo ""
	@echo "AVAILABLE TASKS"
	@echo ""
	@echo "  compile .................... Compiles the project"
	@echo "  clean ...................... Removes build artifacts"
	@echo "  lint ....................... Lints all source files"
	@echo ""


node_modules: package.json
	npm install

compile: node_modules $(SRC)
	$(babel) src --source-map inline --out-dir .

lint:
	$(eslint)

.PHONY: help compile clean lint
