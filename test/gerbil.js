scenario = require('../lib/gerbil.js');

scenario("Gerbil - Assertions", {
  "should be able to assert": function(){
    assert(true);
    assert(1 == 1);
  },
  "should be able to assert a false statement": function(){
    assert_raise(Error, function(){
      assert(false)
    });
  }
});
