if(typeof module != 'undefined')
  scenario = require('../lib/gerbil.js').scenario;

scenario("Gerbil - Assertions", {
  "should be able to assert": function(g){
    g.assert(true);
    g.assert(1 == 1);
    g.assert(true != false);
  },

  "should be able to assert a false statement": function(g){
    g.assertThrow(Error, function(){
      g.assert(false)
    })
  },

  "should fail when an assertThrow block doesn't raise an exception": function(g){
    g.assertThrow(Error, function(){
      g.assertThrow(Error, function(){
        //we are not raising anything
      })
    });
  },
});

scenario("Gerbil - setTimeout", {
  'setup': function() {
    this.name = 'timeout';
  },
  "should access gerbil test scenario": function(g){
    var a = 1;
    g.setTimeout(function(){
      a++;
      g.assertEqual(a, 3);
    }, 1000);
    a++;
  },

  'should access context': function(g) {
    g.setTimeout(function() {
      g.assertEqual(this.name, 'timeout');
    }, 1000);
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
    g.assertEqual(this.value, 1);
  }
});

scenario('Gerbil - asyncronous code', {
  'setup': function() {
    this.context = true;
  },

  'should be able to test asyncronous code': function(g) {
    var asyncStuff = function() {
      this.callbacks = {};
      this.numer = null;

      this.random = function() {
        return Math.floor(Math.random()*11);
      }
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
        g.end();
      });
      async.exec();
    });
  },

  'should not lose context during async execution': function(g) {
    g.async(function() {
      g.assertEqual(this.context, true);
      g.end();
    });
  }
});
