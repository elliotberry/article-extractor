import parseFromHtml from './src/parseFromHtml.js';
import {isValid as isValidUrl} from './src/linker.js';

export const extractFromHtml = async ({html, url = '', parserOptions = {}}) => {
  if (!html || typeof html !== 'string') {
    throw new Error('HTML string needed!');
  }
  return parseFromHtml({html, url, parserOptions});
};
