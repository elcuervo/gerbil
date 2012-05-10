var Gerbil = function Gerbil(description, tests) {
  this.success = 0;
  this.pending = 0;
  this.failures = 0;
  this.count = 0;
  this.config = new Gerbil.Config(Gerbil.globalConfig );
  this.timeout = 0;
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
    this.scope = scope;
    try {
      test.fn.call(scope, test);
    } catch(exception) {
      test.fails(exception);
    } finally {
      if(!test.isAsync) this.results.push(test);
    }
  };

  this.ok = function(test) {
    this.success++;
    var message = Gerbil.format("{0} ({1} assertions)", [
      test.name, test.assertions
    ]);

    test.scenario.config.formatter.ok(message);
  };

  this.fail = function(test) {
    this.failures++;
    var message = Gerbil.format("{0} - assertion number {1} failed - {2}", [
        test.name, test.assertions + 1, test.message
    ]);

    test.scenario.config.formatter.fail(message);
  };

  this.postergate = function(test) {
    this.pending++;
    test.scenario.config.formatter.pending(test.message);
  };

  this.enqueue = function() {
    var configFn = this.extractTest("config");
    configFn(this.config);

    this.setup = this.extractTest("setup");
    this.before = this.extractTest("before");
    this.after  = this.extractTest("after");
    this.cleanup = this.extractTest("cleanup");

    for (var key in this.tests) {
      this.queue.push(new Gerbil.Test(key, this.tests[key], this));
      this.count++;
    }
    return this;
  };

  this.check = function(scenario) {
    if(scenario.count !== scenario.results.length()) {
      scenario.timeout += 100;
      setTimeout(scenario.check, scenario.timeout, scenario);
    } else {
      scenario.summary();
    }
  };

  this.run = function() {
    var test = false;
    var scope = {};

    if(typeof this.config.start == 'function') {
      var object = {
        description: this.description,
        numberOfTests: this.queue.length()
      };
      this.config.start(object);
    }

    try {
      this.setup.call(scope);
      do {
        test = this.queue.pull();
        if(test) {
          this.before.call(scope, test);

          test.measure();
          this.execute(test, scope);
          test.measure();

          this.after.call(scope, test);
        }
      } while(test);
      this.cleanup.call(scope);
    } catch(exception) {
      throw Gerbil.Error({ message: exception });
    } finally {
      setTimeout(this.check, this.timeout, this);
    }

    return this;
  };

  this.summary = function() {
    var result = false;
    var assertions = 0;
    var elapsedTime = 0;

    this.config.formatter.scenario(this.description);

    do {
      test = this.results.pull();
      if(test) {
        if(test.isPending) {
          this.postergate(test);
        } else {
          assertions += test.assertions;
          elapsedTime += test.time;
          test.failed ? this.fail(test) : this.ok(test);
        }
      }
    } while(test);

    var results = {
      description: this.description,
      pass:        this.success,
      fail:        this.failures,
      pending:     this.pending,
      total:       this.count,
      assertions:  assertions,
      time:        elapsedTime
    };

    this.config.formatter.summary(results);

    typeof this.config.finish == 'function' && this.config.finish(results);
  };

  this.enqueue();
};

Gerbil.IS_NODE = !!(typeof module !== 'undefined' && module.exports);

Gerbil.format = function(s, args) {
  var re = /\{([^}]+)\}/g;
  return s.replace(re, function(_, match){ return args[match]; });
};

Gerbil.Error = function GerbilError(options) {
  if(options.args) {
    options.message = Gerbil.format(options.message, options.args);
  }
  var error = new Error(options.message);
  if(options.stack) error.stack = options.stack;

  return error;
};

Gerbil.Queue = function GerbilQueue() {
  this.queue = [];
  this.offset = 0;

  this.length = function() {
    return this.queue.length - this.offset;
  };

  this.push = function(item) {
    this.queue.push(item);
  };

  this.pull = function() {
    if (this.queue.length === 0) return false;
    var item = this.queue[this.offset];

    if (++this.offset * 2 >= this.queue.length) {
      this.queue = this.queue.slice(this.offset);
      this.offset = 0;
    }
    return item;
  };
};

Gerbil.Test = function GerbilTest(name, test, scenario) {
  this.name = name;
  this.scenario = scenario;
  this.fn = test;
  this.assertions = 0;
  this.failed = false;
  this.isAsync = false;
  this.isPending = false;
  this.message = null;
  this.time = null;

  this.fails = function(exception) {
    this.failed = true;
    this.message = exception.stack;
  };

  this.measure = function() {
    var milliseconds = new Date().getTime()/1000;
    this.time = this.time === null ? milliseconds : milliseconds - this.time;
  };
};

Gerbil.Test.prototype = {
  constructor: Gerbil.Test,

  setTimeout: function(fn, milliseconds) {
    var context = this.scenario.scope;
    this.scenario.timeout += milliseconds;

    return setTimeout(function() {
      fn.apply(context);
    }, milliseconds);
  },

  pending: function(message) {
    this.isPending = true;
    this.message = this.name;
    if(message) this.message += ' (' + message + ')';
  },

  async: function(fn) {
    this.isAsync = true;
    try {
      fn.call(this.scenario.scope);
    } catch(exception) {
      this.fails(exception);
      this.end();
    }
  },

  end: function() {
    if(this.isAsync) this.scenario.results.push(this);
  },

  assert: function(expectation) {
    if(!expectation) {
      throw Gerbil.Error({ message: "Assertion Failed" });
    } else {
      this.assertions++;
    }
  },

  assertThrow: function(expectedError, fn) {
    this.assertions++;
    var errorMessage = false;
    try {
      fn();
      errorMessage = expectedError.name + " was expected but not raised.";
    } catch(exception) {
      if (typeof exception == typeof expectedError) {
        errorMessage = expectedError.name + " was expected but " + exception.name + " was raised.";
      }
    }
    if (errorMessage) throw Gerbil.Error({message: errorMessage});
  },

  assertType: function(type, object) {
    this.assertions++;
    if(object.constructor != type) {
      var message = 'Expected to be ' + type.name + ' but ' + object.constructor.name + ' was found.';
      throw Gerbil.Error({ message: message });
    }
  },

  assertEqual: function(first, second) {
    if(first == undefined || second == undefined) {
      throw Gerbil.Error({
        message: "attr2 = {0} ({1}) and attr2 = {2} ({3})",
        args: [first, typeof first, second, typeof second]
      });
    }

    if(typeof first  != typeof second) {
      throw Gerbil.Error({
        message: "Different type {0} vs {1}",
        args: [typeof first,  typeof second]
      });
    }

    this.assertions++;
    var errorMessage = "Not equal {0} != {1}";

    switch(first.constructor) {
      case Array:
        if (first.length != second.length) {
          throw Gerbil.Error({ message:"Different Lengths" });
        }
        for (var i = 0; i < first.length; i++) {
          if (first[i] != second[i]) {
            throw Gerbil.Error({
              message: errorMessage,
              args: [first[i],  second[i]]
            });
          }
        }
        break;
      case String:
      case Number:
        if (first != second) {
          throw Gerbil.Error({
            message: errorMessage,
            args: [first, second]
          });
        }
        break;
      default:
        break;
    }
  }
};

Gerbil.Console = {
  pretty: {
    log: function(msg) { return console.log("\033[32m" + msg + "\033[0m"); },
    info: function(msg) { return console.info("\033[34m" + msg + "\033[0m"); },
    warn: function(msg) { return console.warn("\033[33m" + msg + "\033[0m"); },
    error: function(msg) { return console.error("\033[31m" + msg + "\033[0m"); }
  },

  simple: console
};

Gerbil.console = Gerbil.IS_NODE ? Gerbil.Console.pretty : Gerbil.Console.simple;

Gerbil.formatter = {
  ok: function(msg) {
    Gerbil.console.log("   * " + msg);
  },
  fail: function(msg) {
    Gerbil.console.error("   x " + msg);
  },
  pending: function(msg) {
    Gerbil.console.warn("   ! " + msg);
  },
  scenario: function(msg) {
    Gerbil.console.info("== Running " + msg + " ==");
  },
  summary: function(summary) {
    var summaryString = Gerbil.format("All tests completed for {0}: {1} passed, {2} failed, {3} pending, of {4} tests ({5} assertions) in {6} s", [
      summary.description,
      summary.pass,
      summary.fail,
      summary.pending,
      summary.total,
      summary.assertions,
      summary.time
    ]);
    Gerbil.console.warn(summaryString);
    Gerbil.console.info("");
  }
};

Gerbil.Config = function(globalConfig) {
  this.formatter = Gerbil.formatter;
  this.prototype = globalConfig;
};

Gerbil.scenario = function scenario(description, tests) {
  return new Gerbil(description, tests).run();
};

if(Gerbil.IS_NODE) {
  module.exports = Gerbil;
} else {
  var scenario = Gerbil.scenario;
}
