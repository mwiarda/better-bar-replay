import { Builder, By, WebDriver } from 'selenium-webdriver'
import { symbol } from './reducers/symbol'
import { SPREADS } from './spreads'

let driver = undefined as WebDriver

export const configure = async () => {
	try {
		const replayButton = await driver.findElement(By.xpath('//*[starts-with(@class, "replayGameBtn")]'));
		if (replayButton) {
			const symbolName = await (await driver.getTitle()).split(" ")[0]
			symbol.setName(symbolName)
			symbol.setSpread(SPREADS[symbolName] || 0)
			return symbolName
		}
	}
	catch (error) {
	}
}

export const nextTicker = async () => {
	const button = (await driver.findElements(By.xpath('//*[starts-with(@class, "controlsPanel")]/div[4]')))[0]

	if (button) {
		await button.click()
		await driver.sleep(250)
		await setPrice()
	}
}

export const setPrice = async () => {
	try {
		const nextPrice = await getCurrentPrice()
		symbol.setPrice(nextPrice)
	}
	catch (error) { }
}

const getCurrentPrice = async () => {
	const price = await (await driver.findElements(By.xpath('//*[starts-with(@class, "valuesWrapper")]/div[1]/div[5]/div[2]')))[0].getText()
	const decimalLength = !price.includes('.') ? 1 : price.split('.')[1].length
	return parseFloat(price).toFixed(decimalLength)
}

(async () => {
	driver = await new Builder().forBrowser("chrome").build();

	try {
		await driver
			.manage()
			.window()
			.maximize();

		await driver.get('https://www.tradingview.com/#signin')
		await driver.sleep(1000)
		await (await driver.findElement(By.xpath('//*[starts-with(@class, "emailButton")]'))).click()
		await driver.sleep(1000)
		const username = await driver.findElements(By.xpath('/html/body/div[8]/div/div/div[1]/div/div[2]/div[2]/div/div/div/form/div[1]/span[2]/span[1]/input'))
		username[0].sendKeys(process.env.TV_USERNAME)
		await driver.sleep(1000)
		const password = await driver.findElements(By.xpath('/html/body/div[8]/div/div/div[1]/div/div[2]/div[2]/div/div/div/form/div[2]/span[2]/span[1]/input'))
		password[0].sendKeys(process.env.TV_PASSWORD)
		await driver.sleep(1000)
		await (await driver.findElement(By.xpath('//*[starts-with(@class, "submitButton")]'))).click()
	} catch (error) { }
})()
