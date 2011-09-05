scenario = require('../lib/gerbil.js');

scenario("Gerbil - Assertions", {
  "should be able to assert": function(){
    assert(true);
    assert(1 == 1);
  },

  "should be able to assert a false statement": function(){
    assert_throw(Error, function(){
      assert(false)
    })
  },

  "should fail when an assert_throw block doesn't raise an exception": function(){
    assert_throw(Error, function(){
      assert_throw(Error, function(){
        //we are not raising anything
      })
    });
  },

});
