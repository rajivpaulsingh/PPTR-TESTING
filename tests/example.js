const puppeteer = require('puppeteer')
const expect = require('chai').expect

const config = require('../lib/config')
const click = require('../lib/helpers').click

describe('Example Test', () => {

    let browser
    let page

    before(async function() {
        browser = await puppeteer.launch({
            headless: config.isHeadless,
            slowMo: config.sloMo,
            timeout: config.launchTimeout
        })
        page = await browser.newPage()
        await page.setDefaultTimeout(config.waitingTimeout);
        await page.setViewport({
            width: config.viewportWidth,
            height: config.viewportHeight
        })
    })

    after(async function() {
        await browser.close()
    })

    it('My first test step', async () => {
        await page.goto(config.baseUrl)
        await page.waitForSelector('#nav')

        const url = await page.url()
        const title = await page.title()

        expect(url).to.contain('zero')
        expect(title).to.contains('Personal')
    })

    it('Click method', async () => {
        await page.goto(config.baseUrl)
        await click(page, '#signin_button')
        await page.waitForSelector('#user_login')
    })
})