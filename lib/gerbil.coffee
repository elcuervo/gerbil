@scenario = (description, tests, logger) ->
  GerbilOptions =
    if exports?
      logger: {
        log:    (msg) -> console.log("\033[32m#{msg}\033[0m")
        info:   (msg) -> console.info("\033[34m#{msg}\033[0m")
        warn:   (msg) -> console.warn("\033[33m#{msg}\033[0m")
        error:  (msg) -> console.error("\033[31m#{msg}\033[0m")
      }
    else
      logger: console

  class @Gerbil
    success:    0
    fail:       0
    count:      0
    assertions: 0

    constructor: (@description, @tests, @logger = GerbilOptions.logger) ->

    extract: (key, from) ->
      value = from[key] || (->)
      delete from[key]
      value

    run: ->
      this.logger.info this.description
      this.setup   = this.extract "setup",   this.tests
      this.before  = this.extract "before",  this.tests
      this.after   = this.extract "after",   this.tests
      this.cleanup = this.extract "cleanup", this.tests

      this.setup()
      this.exec key, value for key, value of this.tests
      this.cleanup()
      this.logger.warn "Results for #{this.description} #{this.success}/#{this.count} tests. #{this.assertions} assertions"
      process.exit(1) if this.fail > 0 if module?

    assert_equal: (obj1, obj2) ->
      throw new Error("obj1 is #{obj1} and obj2 is #{obj2}") if !obj1 or !obj2
      throw new Error("types are different obj1: #{obj1.constructor}, obj2: #{obj2.constructor}") if obj1.constructor != obj2.constructor

      current_scenario.assertions += 1
      error = new Error("expected #{obj2} got #{obj1}")
      switch obj1.constructor
        when Array
          throw error unless value == obj2[key] for key, value of obj1 if obj1.length == obj2.length
        when Number, String
          throw error unless obj1 == obj2

    assert: (expectation) ->
      current_scenario.assertions += 1
      return throw new Error("assertion failed") if !expectation

    assert_throw: (expected_error, fun) ->
      current_scenario.assertions += 1

      error = false
      try
        fun()
        error = "#{expected_error.name} was expected but nothing was raised"
      catch exception
        error = "#{expected_error} was expected got #{exception} instead" unless exception.constructor is expected_error

      throw new Error(error) if !error?

    exec: (test_name, test) ->
      this.before()
      try
        initial_assertions = this.assertions
        test.apply(this)
        this.success  += 1
        this.logger.log " |-- #{test_name} SUCCESS (#{this.assertions - initial_assertions} assertions)"
      catch error
        this.fail     += 1
        this.logger.error " |-- #{error}: #{test_name} FAILED"
      finally
        this.after()
        this.count    += 1

  @current_scenario = new Gerbil(description, tests, logger)
  @assert = @current_scenario.assert
  @assert_equal = @current_scenario.assert_equal
  @assert_throw = @current_scenario.assert_throw
  @current_scenario.run()

module.exports = @scenario if module?
