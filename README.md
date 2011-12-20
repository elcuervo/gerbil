# Gerbil

![Gerbil!](http://www.petsworld.co.uk/images/gerbil.jpg)

_n_. Gerbils: Inquisitive, friendly animals that rarely bite, TDD for the rest of us

Gerbil attemps to be an uber simple and minimalistic testing framework for javascript.
It's written in coffeescript so be nice with me

## Now with npm

```bash
$ npm install gerbil
```

You can now execute the tests with node without to depend on the browser

```javascript
var scenario = require('gerbil').scenario;

scenario("Testing with node", {
  "should work in a terminal": function(g){
    g.assert(true);
  }
});
```

![Console Errors](http://elcuervo.co/images/posts/gerbil-tdd-for-the-rest-of-us/console-output.png)

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
    g.assert_equal(this.validName, 'Gerbil');
  },

  'in the future': function(g) {
    this.time = new Date().getTime();

    g.setTimeout(function() {
      g.assert(new Date().getTime() > this.time);
    }, 1000);
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
    g.assert_equal(this.someThing.length, 1);
  },

  "MagicThing should be valid": function(g) {
    g.assert(this.someThing.valid);
  }
});
```

## Custom logger

```javascript
var myCoolLogger = {
  "warn":   function(msg){},
  "log":    function(msg){},
  "info":   function(msg){},
  "error":  function(msg){
    alert(msg);
  },
};

scenario("Fancy scenario", {
  "somewhere over the rainbow": function(g) {
    g.assert(false);
  }
}, myCoolLogger);
```

## What's the catch?

The results are only shown in the console, the one from console.log if you use
it in a browser.
Run it with an open inspector or define a custom logger if you want prettier
results.
And in the bottom you will find the summary

![Browser tests](http://elcuervo.co/images/posts/gerbil-tdd-for-the-rest-of-us/browser-output.png)

## TODO
  1. Get a gerbil as a pet

## Contributors
  * [Daniel Cadenas](https://github.com/dcadenas)
