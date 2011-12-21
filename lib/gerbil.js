var Gerbil = function(description, tests, logger) {
  this.success = 0;
  this.failures = 0;
  this.count = 0;
  this.timeout = 0;
  this.logger = typeof logger == 'object' ? logger : Gerbil.logger;
  this.queue = new Gerbil.Queue;
  this.results = new Gerbil.Queue;
  this.description = description;
  this.tests = tests;

  this.extractTest = function(key) {
    var test = this.tests[key];
    delete this.tests[key];
    return test || function() {};
  };

  this.execute = function(test, scope) {
    try {
      test.fn.call(scope, test);
    } catch(exception) {
      test.fails(exception);
    } finally {
      this.results.push(test);
    }
  };

  this.ok = function(test) {
    this.success++;
    test.scenario.logger.log("   * " + test.name + " (" + test.assertions + " assertions)");
  };

  this.fail = function(test) {
    this.failures++;
    test.scenario.logger.error("   x " + test.name + " - assertion number " + (test.assertions + 1) + " failed - "  + test.message);
  };

  this.postergate = function(test) {
    test.scenario.logger.warn("   ! " + test.message);
  };

  this.enqueue = function() {
    this.setup = this.extractTest("setup");
    this.before = this.extractTest("before");
    this.after  = this.extractTest("after");
    this.cleanup = this.extractTest("cleanup");

    for (var key in this.tests) {
      this.queue.push(new Gerbil.Test(key, this.tests[key], this));
      this.count++;
    };
    return this;
  };

  this.run = function() {
    var test = false;
    var scope = {};

    try {
      this.setup.call(scope)
      while (test = this.queue.pull()) {
        this.before.call(scope, test);
        this.execute(test, scope);
        this.after.call(scope, test);
      }
      this.cleanup.call(scope);
    } catch(exception) {
      throw Gerbil.Error(exception);
    } finally {
      setTimeout(function(scenario) {
        scenario.summary();
      }, this.timeout, this);
    }
  };

  this.summary = function() {
    var result = false;
    var assertions = 0;

    this.logger.info("== Running " + this.description + " ==");

    while(test = this.results.pull()) {
      if(test.isPending) {
        this.postergate(test);
      } else {
        assertions += test.assertions;
        test.failed ? this.fail(test) : this.ok(test);
      }
    }
    this.logger.warn("All tests completed for " + this.description + ": " + this.success + " passed, " + this.failures + " failed of " + this.count + " tests (" + assertions + " assertions executed)");
    this.logger.info("");
  };

  this.enqueue();
};

Gerbil.IS_NODE = !!(typeof module !== 'undefined' && module.exports);

Gerbil.Error = function(message) {
  var error = new Error(message);
  return error.stack || error.message;
};

Gerbil.Queue = function() {
  this.queue = [];
  this.offset = 0;

  this.length = function() {
    return this.queue.length - this.offset;
  };

  this.push = function(item) {
    this.queue.push(item);
  };

  this.pull = function() {
    if (this.queue.length === 0) return;
    var item = this.queue[this.offset];

    if (++this.offset * 2 >= this.queue.length) {
      this.queue = this.queue.slice(this.offset);
      this.offset = 0;
    }
    return item;
  };
};

Gerbil.Test = function(name, test, scenario) {
  this.name = name;
  this.scenario = scenario;
  this.fn = test;
  this.assertions = 0;
  this.failed = false;
  this.isPending = false;
  this.message = null;
  this.time = new Date().getTime();

  this.fails = function(exception) {
    this.failed = true;
    this.message = exception;
  };
};

Gerbil.Test.prototype = {

  setTimeout: function(fn, milliseconds) {
    var context = this;
    this.scenario.timeout += milliseconds;

    return setTimeout(function() {
      fn.apply(context);
    }, milliseconds);
  },

  pending: function(message) {
    this.isPending = true;
    this.message = message;
  },

  assert: function(expectation) {
    if(!expectation) {
      throw Gerbil.Error("Assertion Failed");
    } else {
      this.assertions++;
    }
  },

  assert_throw: function(expected_error, fn) {
    this.assertions++;
    var error_message = false;
    try {
      fn();
      error_message = expected_error.name + " was expected but not raised."
    } catch (exception) {
      if (typeof exception  == typeof expected_error)
        error_message = expected_error.name + " was expected but " + exception.name + " was raised."
    }
    if (error_message) throw Gerbil.Error(error_message)
  },

  assert_equal: function(first, second) {
    if (first == undefined || second == undefined) throw Gerbil.Error("attr1 = " + first + " (" + typeof first + ") " + "and attr2 = " + second + " (" + typeof second + ")");
    if ( typeof(first) != typeof(second) ) throw Gerbil.Error("Different type " + typeof first + " vs " + typeof second);

    this.assertions++;

    switch(first.constructor) {
      case Array:
        if (first.length != second.length )
          throw Gerbil.Error("Different Lengths");
        for (var i = 0; i < first.length; i++) {
          if (first[i] != second[i]) throw Gerbil.Error("Items not equal " + first[i]  + " != " + second[i]);
        }
        break;
      case String, Number:
        if (first != second) throw Gerbil.Error("Not equal " + first + " != " + second);
        break;
    }
  },
};

Gerbil.Logger = {
  pretty: {
    log: function(msg) { return console.log("\033[32m" + msg + "\033[0m"); },
    info: function(msg) { return console.info("\033[34m" + msg + "\033[0m"); },
    warn: function(msg) { return console.warn("\033[33m" + msg + "\033[0m"); },
    error: function(msg) { return console.error("\033[31m" + msg + "\033[0m"); }
  },

  simple: console
}

Gerbil.logger = Gerbil.IS_NODE ? Gerbil.Logger.pretty : Gerbil.Logger.simple;

Gerbil.scenario = function(description, tests, logger) {
  new Gerbil(description, tests, logger).run();
};

if(Gerbil.IS_NODE) {
  module.exports = Gerbil;
} else {
  var scenario = Gerbil.scenario;
}
