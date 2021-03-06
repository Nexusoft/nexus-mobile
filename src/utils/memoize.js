export default function memoize(
  resultFn,
  transformArgs = keepArgs,
  isEqual = areInputsEqual
) {
  let lastThis;
  let lastArgs = [];
  let lastResult;
  let calledOnce = false;

  // breaking cache when context (this) or arguments change
  function memoized(...newArgs) {
    const transformedArgs = transformArgs(...newArgs);
    if (calledOnce && lastThis === this && isEqual(transformedArgs, lastArgs)) {
      return lastResult;
    }

    // Throwing during an assignment aborts the assignment: https://codepen.io/alexreardon/pen/RYKoaz
    // Doing the lastResult assignment first so that if it throws
    // nothing will be overwritten
    lastResult = resultFn.apply(this, transformedArgs);
    calledOnce = true;
    lastThis = this;
    lastArgs = transformedArgs;
    return lastResult;
  }

  return memoized;
}

function keepArgs(...params) {
  return params;
}

function areInputsEqual(newInputs, lastInputs) {
  // no checks needed if the inputs length has changed
  if (newInputs.length !== lastInputs.length) {
    return false;
  }
  // Using for loop for speed. It generally performs better than array.every
  // https://github.com/alexreardon/memoize-one/pull/59
  for (let i = 0; i < newInputs.length; i++) {
    // using shallow equality check
    if (newInputs[i] !== lastInputs[i]) {
      return false;
    }
  }
  return true;
}
