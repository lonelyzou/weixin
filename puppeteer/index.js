
const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await  browser.newPage();
    await page.goto('https://movie.douban.com/cinema/nowplaying/shenzhen/', {
        waitUntil: ['domcontentloaded']
    });

    // 爬取所有正在热映的电影网址
    const result = await page.evaluate(() => {
        // 抓取网页中的内容
        const $a = $('.lists>li .poster a');
        const result = [];
        $a.each(function (index,item) {
            result.push(item.href);
        })
        return result;
    })
    console.log(result);

    let movies = []
    for(let i=0;i<result.length;i++){
        const url = result[i];

        await page.goto(url);
        const detail = await page.evaluate(() =>{
            const title = $('[property="v:itemreviewed"]').text()
            // 电影评分
            const rating = $('[property="v:average"]').text()
            // 电影海报
            const image = $('[rel="v:image"]').attr('src');

            return {
                title,
                rating,
                image
            }
        })
        movies.push(detail);
    }
    console.log(movies);
    await browser.close();
})();