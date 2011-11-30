var scenario = require('../lib/gerbil');
scenario("Validate some stuff", {
  "before": function(){
    this.a = 2;
  },
  "test": function(g){
    g.assert(true);
    g.set_timeout(function(){
      console.log(1);
      g.assert_equal(this.a, 2);
    }, 2000, this);
  }
});
