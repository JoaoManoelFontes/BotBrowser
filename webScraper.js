const { default: axios } = require("axios");
const puppeteer = require("puppeteer");

// ? Google search
// (async () => {
//   browser = await puppeteer.launch({ headless: true });
//   const [page] = await browser.pages();
//   await page.setRequestInterception(true);
//   page.on("request", (request) => {
//     request.resourceType() === "document"
//       ? request.continue()
//       : request.abort();
//   });
//   await page.goto(
//     "https://www.google.com/search?q=flamengo",
//     {
//       waitUntil: "domcontentloaded",
//     }
//   );
//   const data = {};

//   await page.waitForSelector(".LC20lb", { visible: true });
//   data["firstsResponses"] = await page.$$eval(".LC20lb", (els) =>
//     els.map((e) => ({ title: e.innerText, link: e.parentNode.href }))
//   );

//   try {
//     data["aboutEmbed"] = await page.evaluate(() => {
//       const main = document.querySelector(
//         "div[class='TQc1id IVvPP Jb0Zif rhstc4']"
//       );
//       const desc = main.querySelector(
//         'div[class="B03h3d V14nKc i8qq8b ptcLIOszQJu__wholepage-card wp-ms"]'
//       );
//       return desc.querySelector('div[class="kno-rdesc"] > span').innerText;
//     });
//   } catch (error) {}

//   try {
//     data["infoEmbed"] = await page.evaluate(() => {
//       return document
//         .querySelector('div[class="yp1CPe wDYxhc NFQFxe viOShc LKPcQc"]')
//         .innerText.replaceAll("\n", ", ");
//     });
//   } catch (error) {}

//   try {
//     data["ageEmbed"] = await page.evaluate(() => {
//       return document
//         .querySelector('[data-attrid="kc:/people/person:age"]')
//         .innerText.replaceAll("\n", ", ");
//     });
//   } catch (error) {}

//   try {
//     data["sideInfoEmbed"] = await page.evaluate(() => {
//       const main = document.querySelector(
//         'div[class="kp-wholepage kp-wholepage-osrp HSryR EyBRub"]'
//       );

//       let response = {
//         title: main.querySelector('h2[data-attrid="title"').innerText,
//         description: main
//           .querySelector('div[data-attrid="description"]')
//           .querySelector("span").innerText,
//       };

//       return response;
//     });
//   } catch (error) {}

//   console.log(data);
//   await browser.close();
// })().catch((err) => console.error(err));

// ? Github repos
// (async () => {
  // browser = await puppeteer.launch({ headless: true });
  // const page = await browser.newPage();
  // await page.goto("https://github.com/search?q=bot");

  // const data = await page.evaluate(() => {
  //   let list = document.querySelectorAll("[class='repo-list'] > li");
  //   let resData = [];

  //   for (let i = 0; i < list.length; i++) {
  //     let desc = "";
  //     let title = "";
  //     let tagList = [];
  //     let url = list.item(i).querySelector("a.v-align-middle").href;

  //     // ? title scrapping
  //     try {
  //       title = list
  //         .item(i)
  //         .querySelector('[class="v-align-middle"]').innerText;
  //     } catch (error) {
  //       title = null;
  //     }

  //     // ? description scrapping
  //     try {
  //       desc = list
  //         .item(i)
  //         .querySelector(
  //           '[class="mt-n1 flex-auto"] > [class="mb-1"]'
  //         ).innerText;
  //     } catch (error) {
  //       desc = null;
  //     }

  //     // ? tags scrapping
  //     try {
  //       let tags = list
  //         .item(i)
  //         .querySelectorAll('[data-ga-click="Topic, search results"]');

  //       for (let aux = 0; aux < tags.length; aux++) {
  //         tagList.push(tags.item(aux).innerText);
  //       }
  //     } catch (error) {
  //       tagList = null;
  //     }

  //     // ? Building response data
  //     resData.push({
  //       title: title,
  //       desc: desc,
  //       tags: tagList,
  //       url: url,
  //     });
  //   }
  //   return resData;
  // });

  // console.log(data);

  // await browser.close();
//   const {data} = await axios.get("https://gh-pinned-repos.egoist.dev/?username=JoaoManoelFontes");
//   console.log(data);
// })().catch((err) => console.error(err));

// ? Movies search - IMDB || Rotten
// (async () => {
//   browser = await puppeteer.launch({ headless: false });
//   const page = await browser.newPage();
//   // Lista dos melhores filmes do imdb
//   await page.goto("https://www.imdb.com/chart/top/?ref_=nv_mv_250");

//   const data = await page.evaluate(() => {
//     let tableItem = document
//       .querySelector("table[data-caller-name='chart-top250movie']")
//       .querySelectorAll("tbody > tr");

//     let resData = [];

//     for (let i = 0; i < 10; i++) {
//       // scraping de cada filme da lista
//       resData.push({
//         title: tableItem.item(i).querySelector("td.titleColumn > a").innerText,
//         desc: tableItem.item(i).querySelector("td.titleColumn > a").title,
//         rating: tableItem
//           .item(i)
//           .querySelector("td[class='ratingColumn imdbRating']").innerText,
//         url: tableItem.item(i).querySelector("td.titleColumn > a").href,
//         thumb: tableItem.item(i).querySelector("td.posterColumn > a > img").src,
//       });
//     }

//     return resData;
//   });

//   console.log(data);
//   await browser.close();
// })().catch((err) => console.error(err));

// (async () => {
//   browser = await puppeteer.launch({ headless: false });
//   const page = await browser.newPage();
//   await page.goto(
//     "https://www.rottentomatoes.com/search?search=godfather+part+2"
//   );

//   // ? Clicar no primeiro filme do resultado da pesquisa
//   await page.click(
//     'search-page-result[type="movie"]>ul>search-page-media-row>a'
//   );

//   await page.waitForSelector("h1[slot='title']");
//   await page.waitForSelector("ul[class='content-meta info'] > li");

//   const data = await page.evaluate(() => {
//     let content = document.querySelector(
//       "div[class='panel-body content_body']"
//     );

//     let title = document.querySelector("h1[slot='title']").innerText;

//     let list = content.querySelectorAll("ul[class='content-meta info'] > li");

//     // ? Scraping do filme da pesquisa
//     let movieInfos = [
//       content.querySelector(
//         "div[class='movie_synopsis clamp clamp-6 js-clamp']"
//       ).innerText,
//     ];

//     for (let i = 0; i < list.length; i++) {
//       movieInfos.push(list.item(i).innerText.replaceAll("\t", ""));
//     }

//     let resData = {
//       title,
//       movieInfos,
//     };

//     let thumb = document.querySelector(
//       'div[class="thumbnail-scoreboard-wrap"]'
//     );
//     resData["thumb"] = thumb.querySelector("img").src;

//     return resData;
//   });

//   console.log(data);
//   await browser.close();
// })().catch((err) => console.error(err));

// ? Letras_mus
(async () => {
  browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto("http://www.letras.mus.br/?q=te%20liberando");
  await page.waitForSelector("div[class='gsc-results gsc-webResult']");

  // ? Clicar no primeiro filme do resultado da pesquisa
  await page.click('div [class="gs-webResult gs-result"] > div > div > a');

  await page.waitForSelector("article");
  //   await page.waitForSelector("ul[class='content-meta info'] > li");

  const data = await page.evaluate(() => {
    return document.querySelector('div [class="cnt-letra"]').innerText;
  });

  console.log(data);
  await browser.close();
})().catch((err) => console.error(err));

// ? Google maps
// (async () => {
//   browser = await puppeteer.launch({ headless: true });
//   const page = await browser.newPage();
//   await page.goto("https://www.google.com.br/maps/search/Sushi+Mossoró");

//   await page.waitForSelector("img[decoding='async']");

//   const data = await page.evaluate(() => {
//     let name_list = document.querySelectorAll("div.qBF1Pd.fontHeadlineSmall");
//     let address_list = document.querySelectorAll("div[class='W4Efsd']");
//     let name_data = [];
//     let address_data = [];

//     //?Nomes dos locais
//     for (let i = 0; i < name_list.length; i++) {
//       name_data.push(name_list.item(i).innerText);
//     }
//     //?Endereços
//     for (let i = 2; i < address_list.length; i += 4) {
//       address_data.push(address_list.item(i).innerText);
//     }

//     return [name_data, address_data];
//   });

//   for (let i = 0; i < data[0].length; i++) {
//     console.log(data[0][i], " - ", data[1][i]);
//   }

//   await page.screenshot({
//     path: "screenshot.jpg",
//     fullPage: true,
//   });

//   await page.waitForSelector(
//     "div[class='gYkzb'] > button[aria-label='Recolher painel lateral']"
//   );
//   await page.click(
//     "div[class='gYkzb'] > button[aria-label='Recolher painel lateral']"
//   );

//   await page.screenshot({
//     path: "screenshot2.jpg",
//     fullPage: true,
//   });
//   await browser.close();
// })().catch((err) => console.error(err));
// // ? Google shopping

// (async () => {
//   browser = await puppeteer.launch({ headless: false });
//   const page = await browser.newPage();
//   await page.goto(
//     "https://www.google.com/search?q=camisa+do+flamengo&tbm=shop"
//   );

//   await page.waitForSelector(
//     'div [class="sh-pr__product-results-grid sh-pr__product-results"]'
//   );

//   const data = await page.evaluate(() => {
//     const main = document.querySelector(
//       'div [class="sh-pr__product-results-grid sh-pr__product-results"]'
//     );
//     const list = main.querySelectorAll(
//       'div[class="sh-dgr__gr-auto sh-dgr__grid-result"]'
//     );
//     const resData = [];

//     for (let i = 0; i < list.length; i++) {
//       resData.push({
//         title: list.item(i).querySelector("span > a h3").innerText,
//         img: list.item(i).querySelector("img").src,
//         price: list.item(0).querySelector('div [class="zLPF4b"] ').innerText,
//       });
//     }

//     return resData;
//   });

//   console.log(data);
//   // await browser.close();
// })().catch((err) => console.error(err));

// ? Football championships classifications - ge.globo
// async GoogleSearch(req) {
//   return new Promise((resolve, reject) => {
//     params.search.q = req;
//     params.image.q = req;

//     search.json(params.search, (dataSearch) => {
//       search.json(params.image, (dataImg) => {
//         const [res1, res2] = dataSearch.organic_results;
//         const { images_results } = dataImg;

//         const query = new EmbedBuilder()
//           .setColor("#4285f4")
//           .setTitle("Google - " + req)
//           .setURL("https://www.google.com/search?q=" + req.replace(/ /g, "+"))
//           .setAuthor({
//             name: "Google",
//             iconURL:
//               "https://w7.pngwing.com/pngs/249/19/png-transparent-google-logo-g-suite-google-guava-google-plus-company-text-logo-thumbnail.png",
//             url: "https://google.com.br",
//           })
//           .addFields(
//             { name: "1-" + res1.title, value: res1.link },
//             { name: res1.snippet, value: "\u200B" },
//             { name: "2-" + res2.title, value: res2.link },
//             { name: res2.snippet, value: "\u200B" }
//           )
//           .addFields({
//             name: "-----------------------------",
//             value: images_results[0].title,
//             inline: true,
//           })
//           .setImage(images_results[0].thumbnail)
//           .setTimestamp();
//         resolve(query);
//       });
//     });
//   });
// },