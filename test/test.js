import { extractFromHtml } from '../index.js'
import fs from 'fs'
import extractWithReadability, {
    extractTitleWithReadability,
} from '../src/extractWithReadability.js'
import { cleanify } from '../src/html.js'
import fetch from 'node-fetch'
//let url =
// 'https://dev.to/coderallan/how-to-spice-up-your-markdown-documents-2pjg'

import getMeta from '../src/get-meta.js'
let url = 'https://www.cnn.com/europe/live-news/russia-ukraine-war-news-02-27-23/h_3ad7bf5ac0516bbcc00bf751e5715b75'
const test1 = async () => {
    const html = await fetch(url).then((res) => res.text())
    const data = await extractWithReadability(html)
    const clean = await cleanify(data)
    let datameta = await getMeta(html, url)
    let all = {
        ...datameta,
        content: data,
        cleaned: clean,
    }
    // fs.writeFileSync('data.html', data.content);
    fs.writeFileSync('data.json', JSON.stringify(all, null, 2))
}
const main = async () => {
    const html = await fetch(url).then((res) => res.text())
    const data = extractWithReadability(html)
    const clean = await cleanify(data)
    let datameta = await getMeta(html, url)
    let all = {
        ...datameta,
        content: data,
        cleaned: clean,
    }
    // fs.writeFileSync('data.html', data.content);
    fs.writeFileSync('./data.json', JSON.stringify(all, null, 2))
}
main()
