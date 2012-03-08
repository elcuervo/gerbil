# Gerbil

[![Build Status](https://secure.travis-ci.org/elcuervo/gerbil.png?branch=master)](http://travis-ci.org/elcuervo/gerbil)

![Gerbil!](http://www.petsworld.co.uk/images/gerbil.jpg)

_n_. Gerbils: Inquisitive, friendly animals that rarely bite, TDD for the rest of us

Gerbil attemps to be an uber simple and minimalistic testing framework for javascript.

## Now with npm

```bash
$ npm install gerbil
```

Or just include the .js and run tests within a normal browser.

You can now execute the tests with node without to depend on the browser

```javascript
var scenario = require('gerbil').scenario;

scenario("Testing with node", {
  "should work in a terminal": function(g){
    g.assert(true);
  }
});

// Or if you want to access some global Gerbil stuff

var Gerbil = require('gerbil');
var scenario = Gerbil.scenario;
```
---

## What it's included?

### assert
Good ol' assert, checks boolean.

### assertEqual
Just like assert but checks types AND value.

### assertThrow
Asserts the throw of an exception.

### pending
Mark the test as pending.

### setTimeout
Run the test within a time.

### async
Run async code. Eg. callbacks, timers.

---

## Example output

![Console Errors](http://elcuervo.co/images/posts/gerbil-tdd-for-the-rest-of-us/console-output.png?1)

![Console Errors](http://elcuervo.co/images/posts/gerbil-tdd-for-the-rest-of-us/error-output.png?2)

## Walkthrough

```javascript
// Name the scenario you want to test and pass an object with your tests.
scenario("Some usefull stuff that needs to work", {
  // Reserved names are 'setup', 'before', 'after' and 'cleanup'. They define
  // the steps to be executed.
  //
  // Every test gets one parameter, this is the test suite itself.
  // Modifying 'this' will affect the context in the tests, it's useful when
  // using 'setup' to initialize some state.
  'setup': function(g) {
    this.validName = 'Gerbil';
  },
  // Within the test 'this' gets the config defined in 'setup'
  'should get the correct name': function(g) {
    g.assertEqual(this.validName, 'Gerbil');
  },

  // Test in the feature, usefull to test future events or timers.
  'in the future': function(g) {
    this.time = new Date().getTime();

    g.setTimeout(function() {
      g.assert(new Date().getTime() > this.time);
    }, 1000);
  },

  // Test async code.
  //
  // Using the async function you can control the status of the test. This is
  // really usefull when you are testing callbacks.
  // But remember, it's your responsability to end() the test.
  'should be able to test asyncronous code': function(g) {
    var asyncStuff = function() {
      this.callback = null;
    };

    asyncStuff.prototype = {
      eventually: function(fn) {
        this.callback = fn;
      },

      exec: function() {
        setTimeout(function(c) {
          c.callback();
        }, 500, this);
      }
    };

    g.async(function() {
      var async = new asyncStuff;
      async.eventually(function() {
        g.assert(true);
        // end() will end the current scenario and trigger a summary
        g.end();
      });
      async.exec();
    });
  }

});
```

## Example

```javascript
scenario("This is my scenario", {
  "setup":  function() {
    // When scenario starts
    this.someThing = new Thing;
  },
  "before": function() {
    // Before every test
    this.someThing.magic_magic();
  },
  "after":  function() {
    // After every test
    this.someThing.clean();
  },
  "cleanup": function() {
    // When the scenario ends
    this.someThing = false;
  },

  "MagicThing should have a length": function(g) {
    this.someThing.add(1);
    g.assertEqual(this.someThing.length, 1);
  },

  "MagicThing should be valid": function(g) {
    g.assert(this.someThing.valid);
  }
});
```
---

## Scenario config and global config.

```javascript
var myCoolFormatter = {
  // Passing tests
  "ok": function(msg) {},

  // Failing tests
  "fail": function(msg) {},

  // Pending tests
  "pending": function(msg) {},

  // The start of a scenario
  "scenario": function(msg) {},

  // Report at the end of a scenario
  "summary": function(msg) {}
};

scenario("Fancy scenario", {
  "config": function(c) {
    c.formatter = myCoolFormatter;
  },
  "somewhere over the rainbow": function(g) {
    g.assert(false);
  }
});

// Or if you want to affect every gerbil scenario

Gerbil.globalConfig = {
  formatter: myCoolFormatter
}
```

### Callbacks

Withing the config object you can add two types of callbacks, 'start' and
'finish'. This can help you to trigger events after the scenario finished or a
nice sand clock when starts.

```javascript
scenario('configuration', {
  'config': function(c) {
    c.start = function(object) {};
    c.finish = function(results) {};
  }
});

// Ofcourse you can define then globally:

Gerbil.globalConfig = {
  start: function(object) {},
  finish: function(results) {}
};
```

## What's the catch?

The results are only shown in the console, the one from console.log if you use
it in a browser.
Run it with an open inspector or define a custom formatter if you want prettier
results.
And in the bottom you will find the summary

![Browser tests](http://elcuervo.co/images/posts/gerbil-tdd-for-the-rest-of-us/browser-output.png?1)

## TODO
  1. Get a gerbil as a pet

## Contributors
  * [foca](https://github.com/foca)
  * [Daniel Cadenas](https://github.com/dcadenas)
