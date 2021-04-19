const timerToString = (timer) => {
  return `${timer
    .getTimeValues()
    .minutes.toString()
    .padStart(2, '0')}:${timer
    .getTimeValues()
    .seconds.toString()
    .padStart(2, '0')}`;
};
const timerUtils = { timerToString };
export default timerUtils;
