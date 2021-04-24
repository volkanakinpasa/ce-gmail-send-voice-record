import { ATTACHMENT_NAME_PREFIX, ATTACHMENT_NAME_EXTENSION } from './contants';

const generateVoieFileName = () => {
  const date = new Date();
  const dateFormat = `${date
    .getDate()
    .toString()
    .padStart(2, '0')}_${date
    .getUTCMonth()
    .toString()
    .padStart(
      2,
      '0'
    )}_${date
    .getUTCFullYear()
    .toString()}_${date
    .getHours()
    .toString()
    .padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

  return `${ATTACHMENT_NAME_PREFIX}${dateFormat}${ATTACHMENT_NAME_EXTENSION}`;
};

const audioUtils = { generateVoieFileName };
export default audioUtils;
