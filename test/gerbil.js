if(typeof module != 'undefined')
  scenario = require('../lib/gerbil.js').scenario;

scenario("Gerbil - Assertions", {
  "should be able to assert": function(g){
    g.assert(true);
    g.assert(1 == 1);
    g.assert(true != false);
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

scenario("Gerbil - setTimeout", {
  "should work": function(g){
    var a = 1;
    g.setTimeout(function(){
      a++;
      g.assert_equal(a, 3);
    }, 1000);
    a++;
  }
});

scenario("Gerbil - special methods", {
  'pending': function(g) {
    return g.pending("This is pending somehow");
    g.assert(false);
  }
});

scenario('Gerbil - context access for tests', {
  'setup': function(g) {
    this.value = 1;
  },
  'should access context': function(g) {
    g.assert_equal(this.value, 1);
  }
});
