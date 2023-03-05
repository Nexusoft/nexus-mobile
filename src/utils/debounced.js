export default function debounced(fn, ms) {
  let timerId;
  return function () {
    const functionCall = () => fn.apply(this, arguments);
    clearTimeout(timerId);
    timerId = setTimeout(functionCall, ms);
    return timerId;
  };
}
