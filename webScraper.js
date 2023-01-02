const puppeteer = require("puppeteer");

// ? Google search
// (async () => {
//   browser = await puppeteer.launch({ headless: false });
//   const [page] = await browser.pages();
//   await page.setRequestInterception(true);
//   page.on("request", (request) => {
//     request.resourceType() === "document"
//       ? request.continue()
//       : request.abort();
//   });
//   await page.goto("https://www.google.com/search?q=neymar+idade", {
//     waitUntil: "domcontentloaded",
//   });
//   await page.waitForSelector(".LC20lb", { visible: true });
//   const searchResults = await page.$$eval(".LC20lb", (els) =>
//     els.map((e) => ({ title: e.innerText, link: e.parentNode.href }))
//   );

//   console.log(searchResults[0]);
// })().catch((err) => console.error(err));

// ? Google embeds - firsts responses (unfinished)
// try {
//   const res = await page.evaluate(() => {
//     return document.querySelector('[data-attrid="kc:/people/person:age"]')
//       .innerText;
//   });

//   console.log(res);
// } catch (error) {}

// ? Github repos
// (async () => {
//   browser = await puppeteer.launch({ headless: false });
//   const page = await browser.newPage();
//   await page.goto("https://github.com/search?q=bot");

//   const data = await page.evaluate(() => {
//     let list = document.querySelectorAll("[class='repo-list'] > li");
//     let resData = [];

//     for (let i = 0; i < list.length; i++) {
//       let desc = "";
//       let title = "";
//       let tagList = [];
//       let url = list.item(i).querySelector("a.v-align-middle").href;

//       // ? title scrapping
//       try {
//         title = list
//           .item(i)
//           .querySelector('[class="v-align-middle"]').innerText;
//       } catch (error) {
//         title = null;
//       }

//       // ? description scrapping
//       try {
//         desc = list
//           .item(i)
//           .querySelector(
//             '[class="mt-n1 flex-auto"] > [class="mb-1"]'
//           ).innerText;
//       } catch (error) {
//         desc = null;
//       }

//       // ? tags scrapping
//       try {
//         let tags = list
//           .item(i)
//           .querySelectorAll('[data-ga-click="Topic, search results"]');

//         for (let aux = 0; aux < tags.length; aux++) {
//           tagList.push(tags.item(aux).innerText);
//         }
//       } catch (error) {
//         tagList = null;
//       }

//       // ? Building response data
//       resData.push({
//         title: title,
//         desc: desc,
//         tags: tagList,
//         url: url,
//       });
//     }
//     return resData;
//   });

//   console.log(data);

//   await browser.close();
// })().catch((err) => console.error(err));

// ? Movies search - IMDB || Rotten
// (async () => {
//   browser = await puppeteer.launch({ headless: true });
//   const page = await browser.newPage();
//   await page.goto("https://www.imdb.com/chart/top/?ref_=nv_mv_250");

//   const data = await page.evaluate(() => {
//     let tableItem = document
//       .querySelector("table[data-caller-name='chart-top250movie']")
//       .querySelectorAll("tbody > tr");

//     let resData = [];

//     for (let i = 0; i < 10; i++) {
//       resData.push({
//         title: tableItem.item(i).querySelector("td.titleColumn > a").innerText,
//         desc: tableItem.item(i).querySelector("td.titleColumn > a").title,
//         rating: tableItem
//           .item(i)
//           .querySelector("td[class='ratingColumn imdbRating']").innerText,
//         url: tableItem.item(i).querySelector("td.titleColumn > a").href,
//       });
//     }

//     return resData;
//   });

//   console.log(data);
//   await browser.close();
// })().catch((err) => console.error(err));

(async () => {
  browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto("https://www.rottentomatoes.com/m/the_batman");

  const data = await page.evaluate(() => {
    let content = document.querySelector(
      "div[class='panel-body content_body']"
    );

    let list = content.querySelectorAll("ul[class='content-meta info'] > li");

    let movieInfos = [
      content.querySelector(
        "div[class='movie_synopsis clamp clamp-6 js-clamp']"
      ).innerText,
    ];

    for (let i = 0; i < list.length; i++) {
      movieInfos.push(list.item(i).innerText.replace("\t", ""));
    }

    let resData = {
      movieInfos: movieInfos,
    };

    return resData;
  });

  console.log(data);
  await browser.close();
})().catch((err) => console.error(err));

// ? Letras_mus

// ? Google maps

// ? Google shopping

// ? Football championships classifications - ge.globo
