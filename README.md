**tester** is a straightforward test runner. Add it to a project with:

```shell
    $ npm install @acransac/tester
```

and import it with:

```javascript
    const Test = require('@acransac/tester');
```

Then, declare tests with `Test.makeTest` and pass them to `Test.run` or `Test.runInSequence`. The first runner starts all tests at once, and they can complete in any order. The second executes one test after the other, in the order they are passed as arguments:
* `Test.makeTest:: (TestFunction, String) -> Test`
  | Parameter    | Type         | Description                           |
  |--------------|--------------|---------------------------------------|
  | testFunction | TestFunction | A function which executes some logic to be tested, checks the outcome and signals to the runner it is done |
  | name         | String       | The name of the test. Appears in logs |

* `TestFunction:: (() -> (), Boolean -> ()) -> ()`
  | Parameter | Type          | Description |
  |-----------|---------------|-------------|
  | finish    | () -> ()      | A callback provided by the runner to call in the return statement to signal the end of the test |
  | check     | Boolean -> () | A callback provided by the runner. The actual test is the expression evaluating to true or false passed as argument to this callback. The test fails if the expression evaluates to false |

* `Test.run:: ([Test], Maybe<String>) -> ()`
  | Parameter     | Type           | Description                                                          |
  |---------------|----------------|----------------------------------------------------------------------|
  | tests         | [Test]         | The array of tests to run. They all run at once                      |
  | testSuiteName | Maybe\<String> | The name of the test suite that appears in logs. Default: Test Suite |

* `Test.runInSequence:: ([Test], Maybe<String>) -> ()`
  | Parameter     | Type           | Description                                                                     |
  |---------------|----------------|---------------------------------------------------------------------------------|
  | tests         | [Test]         | The array of tests to run. They run one after another in the order of the array |
  | testSuiteName | Maybe\<String> | The name of the test suite that appears in logs. Default: Test Suite            |

Example:

```javascript
    const Test = require('@acransac/tester');
    
    function upperCase(finish, check) {
      return finish(check("a".toUpperCase() === "A"));
    }
    
    function oddNumber(finish, check) {
      return finish(check(2 % 2 > 0));
    }
    
    Test.run([
      Test.makeTest(upperCase, "Upper Case"),
      Test.makeTest(oddNumber, "Odd Number")
    ], "Elementary Checks");
```

```shell
    $ node example.js
    --------------------
    Elementary Checks:
        Test Odd Number failed!
    
        1 / 2 test(s) passed
    --------------------
```
