import {extractFromHtml} from './index.js'

import fetch from 'node-fetch';
let url = 'https://www.nytimes.com/2020/09/17/technology/elon-musk-tesla-stock.html'

const main = async () => {
    const html = await fetch(url).then(res => res.text());
    const data = await extractFromHtml({html, url: url});
    console.log(data);
}

main();