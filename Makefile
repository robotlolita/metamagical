.PHONY: help
help:
	@echo "--[ CONFIGURATION ]------------------------------------------"
	@echo "You may configure the build with the following environment"
	@echo "variables:"
	@echo ""
	@echo "  MM_EXPERIMENTAL_PACKAGES ..... Include experimental packages"
	@echo ""
	@echo ""
	@echo "--[ AVAILABLE TASKS ]----------------------------------------"
	@echo ""
	@echo "  install .............. Installs all dependencies"
	@echo "  lint ................. Lints selected packages"
	@echo "  build ................ Builds selected packages"
	@echo "  test ................. Tests selected packages"
	@echo "  clean-test ........... Re-installs, re-builds, and runs tests"
	@echo "  clean ................ Removes build artifacts from selected packages"
	@echo ""


# ----------------------------------------------------------------------
bin     := $(shell npm bin)
babel   := $(bin)/babel
eslint  := $(bin)/eslint
mocha   := $(bin)/mocha


# -- [ CONFIGURATION ] -------------------------------------------------
ifndef MM_PACKAGES
ifeq ($(MM_EXPERIMENTAL_PACKAGES),true)
  export MM_PACKAGES = $(wildcard packages/* experimental/*)
else
  export MM_PACKAGES = $(wildcard packages/*)
endif
endif


# -- [ TASKS ] ---------------------------------------------------------
.PHONY: lint
lint:
	./Scripts/run.sh lint "$$MM_PACKAGES"

.PHONY: build
build:
	./Scripts/run.sh build "$$MM_PACKAGES"

.PHONY: test
test:
	$(MAKE) build
	./Scripts/run.sh test "$$MM_PACKAGES"

.PHONY: clean-test
clean-test:
	./Scripts/run.sh clean-test "$$MM_PACKAGES"

.PHONY: clean
clean:
	./Scripts/run.sh clean "$$MM_PACKAGES"

.PHONY: install
install:
	npm install
	./Scripts/run.sh install "$$MM_PACKAGES"
