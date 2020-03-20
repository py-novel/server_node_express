import axios from 'axios'
import iconv from 'iconv-lite'

export async function getHtml(url: string, encoding?: string) {
    const response = await axios.get(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.37 70.100 Safari/537.36',
        },
        responseType: 'arraybuffer',
    })

    const html = iconv.decode(response.data, encoding || 'gbk')
    return html
}

export function getRandomAlphaNum(len: number = 10) {
    let rdmString = ''
    for (; rdmString.length < len; rdmString += Math.random().toString(36).substr(2));
    return rdmString.substr(0, len)
}