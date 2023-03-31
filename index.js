const { chromium } = require('playwright')
const PRODUCTS = require('./products.json')

const COMPARISON = {
  higher: {
    icon: '😡',
    message: 'está más caro',
    link: ''
  },
  equal: {
    icon: '😪',
    message: 'tiene el mismo precio',
    link: ''
  },
  lower: {
    icon: '🚀',
    message: 'bajó de precio!!!',
    link: ''
  }
}

function getPrice (amount) {
  return parseInt(amount.toString().replace('.', ''))
}

function getOfferData ({ item, price }) {
  if (item.referencePrice < price) return COMPARISON.higher

  if (item.referencePrice === price) return COMPARISON.equal

  const lower = { ...COMPARISON.lower, link: item.url }

  return lower
}

function renderLineBreak () {
  return console.log('\n================================================================================\n')
}

async function checkOffer ({ browser, item }) {
  const page = await browser.newPage()
  await page.goto(item.url)
  const priceText = await page.textContent('span.andes-money-amount__fraction')
  const itemName = await page.textContent('h1.ui-pdp-title')
  const price = getPrice(priceText)

  const offer = getOfferData({ item, price })
  const message = `El producto "${itemName}" ${offer.message} ${offer.link}`
  const icon = offer.icon

  console.log(`${icon} ${message}`)
  renderLineBreak()
}

// Main
;(async () => {
  const browser = await chromium.launch()

  console.log('================================================================================')
  console.log('🔎 Analizando productos...')
  console.log('================================================================================\n')

  await Promise.all(
    PRODUCTS.map((item) => checkOffer({ browser, item }))
  )

  await browser.close()
})()
