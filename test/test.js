if(typeof module != 'undefined') {
  var Gerbil = require('../lib/gerbil');
  var scenario = Gerbil.scenario;
}

scenario("Validate some stuff", {
  "before": function() {
    this.a = 2;
  },

  "this is a pending test": function(g) {
    return g.pending("TODO");
  },

  "this is another pending test": function(g) {
    return g.pending()
  },

  "test": function(g) {
    g.assert(true);
    g.assertEqual(1);
  },

  "cuteness": function(g) {
    g.assert(true);
  },

  "take a long time": function(g) {
    for(var i = 0; i < 10000000; i++) {}
    g.assertEqual(i, 10000000);
  },

  "show error on async code": function(g) {
    g.async(function() {
      g.assert(false);
    });
  }
});
