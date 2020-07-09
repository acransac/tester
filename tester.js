// Copyright (c) Adrien Cransac
// License: MIT

// # Test

/*
 * Make a test. See README
 * @param {function} testFunction - The test function
 * @param {string} name - The name of the test. Used in logs
 * @return {Test}
 */
function makeTest(testFunction, name) {
  return [testFunction, name];
}

function testFunction(test) {
  return test[0];
}

function name(test) {
  return test[1];
}

// # Runner
function checker(testName, fail) {
  const check = maybeTrue => {
    if (!maybeTrue) {
      fail(`Test ${testName} failed!`);
    }
    else {
      return;
    }
  };

  return check;
}

function colourText(text, colour) {
  switch (colour) {
    case 'black': return `\u001b[30m${text}\u001b[0m`;
    case 'red': return `\u001b[31m${text}\u001b[0m`;
    case 'green': return `\u001b[32m${text}\u001b[0m`;
    case 'yellow': return `\u001b[33m${text}\u001b[0m`;
    case 'blue': return `\u001b[34m${text}\u001b[0m`;
    case 'magenta': return `\u001b[35m${text}\u001b[0m`;
    case 'cyan': return `\u001b[36m${text}\u001b[0m`;
    case 'white': return `\u001b[37m${text}\u001b[0m`;
  }
}

function reportTestRun(settledTests, testSuiteName) {
  console.log("--------------------");
  console.log(testSuiteName ? `${testSuiteName}:` : "Test Suite:");

  const reporter = (settledTests, successCount, failureCount) => {
    if (settledTests.length === 0) {
      console.log(colourText(`\n    ${successCount} / ${successCount + failureCount} test(s) passed`,
                             failureCount === 0 ? "green" : "red"));

      return console.log("--------------------");
    }
    else if (settledTests[0].status === "fulfilled") {
      return reporter(settledTests.slice(1), successCount + 1, failureCount);
    }
    else {
      console.log(colourText(`    ${settledTests[0].reason}`, "yellow"));

      return reporter(settledTests.slice(1), successCount, failureCount + 1);
    }
  };

  return reporter(settledTests, 0, 0);
}

/*
 * Run tests, all at once
 * @param {Test[]} tests - An array of tests
 * @param {string} [testSuiteName: "Test Suite"] - The name of the test suite. Used in logs
 */
function run(tests, testSuiteName) {
  return Promise.allSettled(tests.map(test => new Promise((resolve, reject) => {
    testFunction(test)(() => resolve(), checker(name(test), reject));
  })))
         .then(settledTests => reportTestRun(settledTests, testSuiteName));
}

/*
 * Run tests, one after the other
 * @param {Test[]} tests - An array of tests. They run in the order of this array
 * @param {string} [testSuiteName: "Test Suite"] - The name of the test suite. Used in logs
 */
function runInSequence(tests, testSuiteName) {
  return Promise.allSettled(tests.reduce((previousTests, test) => [...previousTests, new Promise((resolve, reject) => {
    if (previousTests.length === 0) {
      testFunction(test)(() => resolve(), checker(name(test), reject));
    }
    else {
      previousTests[previousTests.length - 1].then(() => testFunction(test)(() => resolve(), checker(name(test), reject)));
    }
  })], []))
         .then(settledTests => reportTestRun(settledTests, testSuiteName));
}

module.exports = { makeTest: makeTest, run: run, runInSequence: runInSequence };
