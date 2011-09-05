(function() {
  var GerbilOptions;
  this.Gerbil = (function() {
    Gerbil.prototype.success = 0;
    Gerbil.prototype.fail = 0;
    Gerbil.prototype.count = 0;
    Gerbil.prototype.assertions = 0;
    function Gerbil(description, tests, logger) {
      this.description = description;
      this.tests = tests;
      this.logger = logger != null ? logger : GerbilOptions.logger;
    }
    Gerbil.prototype.extract = function(key, from) {
      var value;
      value = from[key] || (function() {});
      delete from[key];
      return value;
    };
    Gerbil.prototype.run = function() {
      var key, value, _ref;
      this.logger.log(this.description);
      this.setup = this.extract("setup", this.tests);
      this.before = this.extract("before", this.tests);
      this.after = this.extract("after", this.tests);
      this.cleanup = this.extract("cleanup", this.tests);
      this.setup();
      _ref = this.tests;
      for (key in _ref) {
        value = _ref[key];
        this.exec(key, value);
      }
      this.cleanup();
      return this.logger.warn("Results for " + this.description + " " + this.success + "/" + this.count + " tests. " + this.assertions + " assertions");
    };
    Gerbil.prototype.assert_equal = function(obj1, obj2) {
      var error, key, value;
      if (!obj1 || !obj2) {
        throw new Error("obj1 is " + obj1 + " and obj2 is " + obj2);
      }
      if (obj1.constructor !== obj2.constructor) {
        throw new Error("types are different obj1: " + obj1.constructor + ", obj2: " + obj2.constructor);
      }
      error = new Error("expected " + obj2 + " got " + obj1);
      switch (obj1.constructor) {
        case Array:
          if (!(function() {
            var _results;
            if (obj1.length === obj2.length) {
              _results = [];
              for (key in obj1) {
                value = obj1[key];
                _results.push(value === obj2[key]);
              }
              return _results;
            }
          })()) {
            throw error;
          }
          break;
        case Number:
        case String:
          if (obj1 !== obj2) {
            throw error;
          }
      }
      return current_scenario.assertions += 1;
    };
    Gerbil.prototype.assert = function(expectation) {
      current_scenario.assertions += 1;
      if (!expectation) {
        throw new Error("assertion failed");
      }
    };
    Gerbil.prototype.exec = function(test_name, test) {
      var initial_assertions;
      this.before();
      try {
        initial_assertions = this.assertions;
        test.apply(this);
        this.success += 1;
        return this.logger.log(" |-- " + test_name + " SUCCESS (" + (this.assertions - initial_assertions) + " assertions)");
      } catch (error) {
        this.fail += 1;
        return this.logger.error(" |-- " + error + ": " + test_name + " FAILED");
      } finally {
        this.after();
        this.count += 1;
      }
    };
    return Gerbil;
  })();
  GerbilOptions = {
    logger: console
  };
  this.scenario = function(description, tests, logger) {
    this.current_scenario = new Gerbil(description, tests, logger);
    this.assert = this.current_scenario.assert;
    this.assert_equal = this.current_scenario.assert_equal;
    return this.current_scenario.run();
  };
}).call(this);
