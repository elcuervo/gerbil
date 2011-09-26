if(typeof module != 'undefined'){
  scenario = require('../lib/gerbil.js');
}

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

var scenario_logger = {
  counter: 0,
  count: function(){ this.counter += 1; },
}

scenario("Gerbil - after, before, setup, cleanup", {
  "setup": function(){
    scenario_logger.count();
  },

  "before": function(){
    scenario_logger.count();
  },

  "after": function(){
    scenario_logger.count();
  },

  "cleanup": function(){
    scenario_logger.count();
    assert_equal(scenario_logger.counter, 6);
  },

  "should run tests": function(){ assert(true); },

  "should run tests again": function(){ assert(true); }
});
