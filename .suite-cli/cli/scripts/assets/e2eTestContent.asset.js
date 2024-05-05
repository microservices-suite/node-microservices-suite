module.exports = ({ answers }) => `
const puppeteer = require('puppeteer');

describe('End-to-End Tests', () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await puppeteer.launch();
        page = await browser.newPage();
    });

    afterAll(async () => {
        await browser.close();
    });

    test('Example E2E Test', async () => {
        await page.goto('https://${answers.project_base}.com');
        // Write your test logic here
    });
});
`;
