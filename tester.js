function makeTest(testFunction, name) {
  return [testFunction, name];
}

function testFunction(test) {
  return test[0];
}

function name(test) {
  return test[1];
}

function reportTestRun(settledTests, successCount, failureCount) {
  if (settledTests.length === 0) {
    return console.log(colourText(`\n${successCount} / ${successCount + failureCount} test(s) passed`,
                                  failureCount === 0 ? "green" : "red"));
  }
  else if (settledTests[0].status === "fulfilled") {
    return reportTestRun(settledTests.slice(1), successCount + 1, failureCount);
  }
  else {
    console.log(colourText(settledTests[0].reason, "yellow"));

    return reportTestRun(settledTests.slice(1), successCount, failureCount + 1);
  }
}

function run(tests) {
  Promise.allSettled(tests.map(test => new Promise((resolve, reject) => {
    testFunction(test)(() => resolve(), checker(name(test), reject));
  })))
         .then(settledTests => reportTestRun(settledTests, 0, 0));
}

function runInSequence(tests) {
  Promise.allSettled(tests.reduce((previousTests, test) => [...previousTests, new Promise((resolve, reject) => {
    if (previousTests.length === 0) {
      testFunction(test)(() => resolve(), checker(name(test), reject));
    }
    else {
      previousTests[previousTests.length - 1].then(() => testFunction(test)(() => resolve(), checker(name(test), reject)));
    }
  })], []))
         .then(settledTests => reportTestRun(settledTests, 0, 0));
}

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

function sameSequences(sequenceA, sequenceB) {
  const equalSequences = (sequenceA, sequenceB) => {
    if (sequenceA.length === 0) {
      return true;
    }
    else if (sequenceA[0] !== sequenceB[0]) {
      return false;
    }
    else {
      return equalSequences(sequenceA.slice(1), sequenceB.slice(1));
    }
  };

  return sequenceA.length === sequenceB.length && equalSequences(sequenceA, sequenceB);
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

module.exports = { makeTest: makeTest, run: run, runInSequence: runInSequence, sameSequences: sameSequences };
