ENV = NODE_ENV=test DEBUG=carcass:*,kenhq:*
MOCHA = ./node_modules/.bin/_mocha
MOCHA_OPTS = -b --timeout 5000 --reporter spec
TESTS = test/*.test.js
ISTANBUL = ./node_modules/.bin/istanbul
COVERALLS = ./node_modules/.bin/coveralls
NODE_BIN = ./node_modules/.bin

lint:
	@echo "Linting..."
	@$(NODE_BIN)/jscs server
test: lint
	@echo "Testing..."
	@$(ENV) $(MOCHA) $(MOCHA_OPTS) $(TESTS)
test-cov: lint
	@echo "Testing..."
	@$(ENV) $(ISTANBUL) cover $(MOCHA) -- $(MOCHA_OPTS) $(TESTS)
test-coveralls: test-cov
	@cat ./coverage/lcov.info | $(COVERALLS) --verbose
.PHONY: lint test test-cov test-coveralls

start-dev: lint
	@NODE_ENV=development DEBUG=carcass:*,kenhq:* node .
install-dev: lint
	@NODE_ENV=development DEBUG=carcass:*,kenhq:* node ./server/install.js
.PHONY: start-dev install-dev
