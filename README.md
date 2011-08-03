# Gerbil

![Gerbil!](http://www.petsworld.co.uk/images/gerbil.jpg)

Gerbil attemps to be an uber simple and minimalistic testing framework for javascript.
It's written in coffeescript so be nice with me

## Example

```javascript
scenario("This is my scenario", function(){
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

## TODO
  1. Workaround for tests using setTimeout
  2. Validate exceptions
  3. Get a gerbil as a pet
