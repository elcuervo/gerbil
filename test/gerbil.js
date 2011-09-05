scenario = require('../lib/gerbil.js');

scenario("Gerbil - Assertions", {
  "should be able to assert": function(){
    assert(true);
    assert(1 == 1);
  },

  "should be able to assert a false statement": function(){
    assert_raise(Error, function(){
      assert(false)
    })
  },

  "should fail when an assert_raise block doesn't raise an exception": function(){
    var exception_was_raised = false

    try {
      assert_raise(Error, function(){
        //we are not raising anything
      });
    } catch (exception) {
      exception_was_raised = true;
    }

    assert(exception_was_raised);
  }
});
