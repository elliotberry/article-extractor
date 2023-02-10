import retrieve from './utils/retrieve.js';
import parseFromHtml from './utils/parseFromHtml.js';
import {isValid as isValidUrl} from './utils/linker.js';

export const extract = async (input, parserOptions = {}, fetchOptions = {}) => {
  if (!isValidUrl(input)) {
    return parseFromHtml(input, null, parserOptions);
  }
  const html = await retrieve(input, fetchOptions);
  if (!html) {
    return null;
  }

  return parseFromHtml(html, input, parserOptions);
};

export const extractFromHtml = async ({html, url = '', parserOptions = {}}) => {
  if (!html || typeof html !== 'string') {
    throw new Error('HTML string needed!');
  }
  return parseFromHtml({html, url, parserOptions});
};
