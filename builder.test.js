import { equal } from 'node:assert';
import path from 'node:path';
import process from 'node:process';

import { findpath } from 'nw';
import selenium from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('NW.js Selenium Builder test suite', async () => {
    let driver = undefined;

    /* Setup Selenium driver. */
    beforeAll(async function () {

        /* Initialise Chrome options */
        const options = new chrome.Options();

        const seleniumArguments = [
            'nwapp=' + path.resolve('js', 'selenium', 'builder')
        ];

        /* Run in headless mode when in CI environment. */
        if (process.env.CI) {
            seleniumArguments.push('headless=new');
        }

        options.addArguments(seleniumArguments);

        const nwPath = await findpath('nwjs', { flavor: 'sdk' });
        options.setChromeBinaryPath(nwPath);

        /* Create a new session using the Chromium options and DriverService defined above. */
        driver = new selenium
            .Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();
    });

    /**
     * Get text via element's ID and assert it is equal.
     */
    it('Hello, World! text by ID', async function () {
        const textElement = await driver.findElement(selenium.By.id('test'));

        const text = await textElement.getText();

        equal(text, 'Hello, World!');
    }, { timeout: 30000 });

    /**
     * Quit Selenium driver.
     */
    afterAll(() => {
        driver.quit();
    });
});
