if(typeof module != 'undefined'){
  scenario = require('../lib/gerbil.js');
}

scenario("Gerbil - Assertions", {
  "should be able to assert": function(g){
    g.assert(true);
    g.assert(1 == 1);
  },

  "should be able to assert a false statement": function(g){
    g.assert_throw(Error, function(){
      g.assert(false)
    })
  },

  "should fail when an assert_throw block doesn't raise an exception": function(g){
    g.assert_throw(Error, function(){
      g.assert_throw(Error, function(){
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

  "cleanup": function(g){
    scenario_logger.count();
    g.assert_equal(scenario_logger.counter, 6);
  },

  "should run tests": function(g){ g.assert(true); },

  "should run tests again": function(g){ g.assert(true); }
});


scenario("Gerbil - setTimeout", {
  "should work": function(g){
    var a = 1;
    g.set_timeout(function(){
      a++;
      g.assert_equal(a, 3);
    });
    a++;
  }

});
