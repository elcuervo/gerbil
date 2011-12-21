if(typeof module != 'undefined') {
  var Gerbil = require('../lib/gerbil');
  var scenario = Gerbil.scenario;
}

Gerbil.logger = {
  log: function(msg) { console.log(msg); },
  info: function(msg) { console.info(msg); },
  warn: function(msg) { console.warn(msg); },
  error: function(msg) { console.error(msg); }
};

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
