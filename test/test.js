if(typeof module != 'undefined')
  var scenario = require('../lib/gerbil').scenario;

scenario("Validate some stuff", {
  "before": function() {
    this.a = 2;
  },

  "stuff": function(g) {
    return g.pending("TODO");
  },

  "test": function(g) {
    g.assert(true);
    g.assert(false);
  },

  "cuteness": function(g) {
    g.assert(true);
  }
});
