const puppeteer = require('puppeteer')
const expect = require('chai').expect

const config = require('../lib/config');

describe('Example Test', () => {

    let browser
    let page

    before(async function() {
        browser = await puppeteer.launch({
            headless: false,
            slowMo: 0,
            timeout: 10000
        })
        page = await browser.newPage()
        await page.setDefaultTimeout(10000);
        await page.setViewport({
            width: 1200,
            height: 800
        })
    })

    after(async function() {
        await browser.close()
    })

    it('My first test step', async () => {
        await page.goto(config.baseUrl)
        await page.waitForSelector('#nav-search')

        const url = await page.url()
        const title = await page.title()

        expect(url).to.contain('dev')
        expect(title).to.contains('Community')
    })
})