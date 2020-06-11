const puppeteer = require('puppeteer')
const expect = require('chai').expect

const config = require('../lib/config')
const click = require('../lib/helpers').click
const typeText = require('../lib/helpers').typeText
const loadUrl = require('../lib/helpers').loadUrl
const getCount = require('../lib/helpers').getCount
const waitForText = require('../lib/helpers').waitForText
const pressKey = require('../lib/helpers').pressKey
const shouldExist = require('../lib/helpers').shouldExist
const utils = require('../lib/utils')

describe('Example End-to-End Test', () => {

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

    const LOGIN_FORM = '#login_form'

    describe('Login Test', () => {
        it('should navigate to homepage', async () => {
            await loadUrl(page, config.baseUrl)
            await shouldExist(page, '#online_banking_features')
        });

        it('should click on signin button', async () => {
            await click(page, '#signin_button')
            await shouldExist(page, LOGIN_FORM)
        });

        it('should submit login form', async () => {
            await typeText(page, utils.generateID(10), '#user_login')
            await typeText(page, utils.generateNumbers(), '#user_password')
            await click(page, '.btn-primary')
        });

        it('should get error message', async () => {
            await waitForText(page, 'body', 'Login and/or password are wrong')
            await shouldExist(page, LOGIN_FORM)
        });
    })

    describe('Search Test', () => {
        it('should navigate to homepage', async () => {
            await loadUrl(page, config.baseUrl)
            await shouldExist(page, '#online_banking_features')
        });

        it('should submit search phrase', async () => {
            await typeText(page, 'hello world', '#searchTerm')
            await pressKey(page, 'Enter')
        });

        it('should display search results', async() => {
            await waitForText(page, 'h2', 'Search Results')
            await waitForText(page, 'body', 'No results were found for the query')
        });
    })

    describe('Navbar Links Test', () => {
        it('should navigate to homepage', async () => {
            await loadUrl(page, config.baseUrl)
            await shouldExist(page, '#online_banking_features')
        });
        
        it('should have correct number of links', async () => {
            const numberOfLinks = await getCount(page, '#pages-nav > li')
            expect(numberOfLinks).to.equal(3)
        });
    })

    describe('Feedback Test', () => {
        it('should navigate to homepage', async () => {
            await loadUrl(page, config.baseUrl)
            await shouldExist(page, '#online_banking_features')
        });
        
        it('should click on feedback link', async () => {
            await click(page, '#feedback')
            await shouldExist(page, 'form')
        });

        it('should submit feedback form',  async () => {
            await typeText(page, 'rajiv', '#name')
            await typeText(page, utils.generateEmail(), '#email')
            await typeText(page, 'Test subject', '#subject')
            await typeText(page, utils.generateID(20), '#comment')
            await click(page, 'input[type="submit"]')
        });

        it('should display success message', async () => {
            await shouldExist(page, '#feedback-title')
            await waitForText(page, 'body', 'Thank you for your comments')
        });
    })

    describe('Forgotten Password Test', () => {
        it('should navigate to homepage', async () => {
            await loadUrl(page, config.baseUrl)
            await shouldExist(page, '#online_banking_features')
        });

        it('should click on forgot password button', async () => {
            await click(page, '#signin_button')
            await click(page, 'a[href="/forgot-password.html"]')
        });

        it('should load forgotten password form', async () => {
            await waitForText(page, 'h3', 'Forgotten Password')
        });

        it('should submit email', async () => {
            await typeText(page, utils.generateEmail(), '#user_email')
            await click(page, '.btn-primary')
        });

        it('should display success message', async () => {
            await waitForText(page, 'body', 'Your password will be sent to the following email')
        });
    })
    
})