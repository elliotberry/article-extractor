import parseFromHtml from './src/parseFromHtml.js';

export const extractFromHtml = async ({html, url = '', parserOptions = {}}) => {
  if (!html || typeof html !== 'string') {
    throw new Error('HTML string needed!');
  }
  return parseFromHtml({html, url, parserOptions});
};
