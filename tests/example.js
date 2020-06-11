const puppeteer = require('puppeteer')
const expect = require('chai').expect

const config = require('../lib/config')
const click = require('../lib/helpers').click
const typeText = require('../lib/helpers').typeText
const loadUrl = require('../lib/helpers').loadUrl
const waitForText = require('../lib/helpers').waitForText
const pressKey = require('../lib/helpers').pressKey
const shouldExist = require('../lib/helpers').shouldExist

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
        await loadUrl(page, config.baseUrl)
        await shouldExist(page, '#nav')

        await waitForText(page, 'body', 'Online Banking')

        const url = await page.url()
        const title = await page.title()

        expect(url).to.contain('zero')
        expect(title).to.contains('Personal')
    })

    it('Click method', async () => {
        await loadUrl(page, config.baseUrl)
        await click(page, '#signin_button')
        await shouldExist(page, '#user_login')
    })

    it('Type method', async () => {
        await loadUrl(page, config.baseUrl)
        await click(page, '#signin_button')
        await typeText(page, 'username', '#user_login')
        await typeText(page, 'password', '#user_password')
        await click(page, '.btn-primary')
        await shouldExist(page, '.nav-tabs')

    })

    it('Press method', async () => {
        await loadUrl(page, config.baseUrl)
        await typeText(page, 'Loans', '#searchTerm')
        await pressKey(page, 'Enter')
        await waitForText(page, 'body', 'The following pages were found for the query')
    })
})