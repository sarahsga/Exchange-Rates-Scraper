const cheerio = require('cheerio');
const axios = require('axios');


async function scrapeData() {
    const response = await axios.get('https://www.x-rates.com/table/?from=USD&amount=1');
    const $ = cheerio.load(response.data);

    const title = $('title').text();

    const timestamp = $('.ratesTimestamp').first().text();

    const ratesData = [];
    $('table.tablesorter.ratesTable tbody>tr').each((i, elem) => {
        const currencyName = $(elem).find('td').first().text();
        const usdEquiv = $(elem).find('.rtRates').first().text();
        ratesData.push({
            currency: currencyName,
            rate: +usdEquiv
        })
    });

    return {
        title,
        timestamp,
        data: ratesData,
    }

}

async function run() {
    const { title, timestamp, data } = await scrapeData();

    console.log(`${title} for ${timestamp}:`);
    console.table(data);
}

run();
