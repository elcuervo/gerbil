# Gerbil

![Gerbil!](http://www.petsworld.co.uk/images/gerbil.jpg)

_n_. Gerbils: Inquisitive, friendly animals that rarely bite, TDD for the rest of us

Gerbil attemps to be an uber simple and minimalistic testing framework for javascript.
It's written in coffeescript so be nice with me

## Example

```javascript
scenario("This is my scenario", {
  "setup":  function(){
    // When scenario starts
    window.some_class = new MagicClass;
  },
  "before": function(){
    // Before every test
    some_class.magic_magic();
  },
  "after":  function(){
    // After every test
    some_class.clean();
  },
  "cleanup": function(){
    // When the scenario ends
    window.some_class = false;
  },

  "MagicClass should have a length": function(){
    some_class.add(1);
    assert_equal(some_class.length, 1);
  },

  "MagicClass should be valid": function (){
    assert(some_class.valid);
  }
});
```

## Custom logger

```javascript
var my_cool_logger = {
  "warn":   function(msg){},
  "log":    function(msg){},
  "error":  function(msg){
    alert(msg);
  },
};

scenario("Fancy scenario", {
  "somewhere over the rainbow": function(){
    assert(false);
  }
}, my_cool_logger);

// Change global logger

Gerbil.logger = my_cool_logger;

scenario("Fancy scenario is back", {
  "somewhere over the double rainbow": function(){
    assert(false);
  }
}, my_cool_logger);

```

## What's the catch?

The results are only shown in the console, the one from console.log
Run it with an open inspector

![Console tests](https://img.skitch.com/20110803-ghqcq5urn8hx99n2s1u777hq58.jpg)

And in the bottom you will find the summary

![Console summary](https://img.skitch.com/20110803-ry5249hcg6n69y5gjfhaibgxj9.jpg)

## TODO
  1. Workaround for tests using setTimeout
  2. Validate exceptions
  3. Trigger events on tests
  4. Get a gerbil as a pet
