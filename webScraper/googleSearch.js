const puppeteer = require("puppeteer");
const { EmbedBuilder } = require("discord.js");

async function googleSearch(message) {
  browser = await puppeteer.launch({ headless: "new" });
  const [page] = await browser.pages();
  await page.setRequestInterception(true);
  page.on("request", (request) => {
    request.resourceType() === "document"
      ? request.continue()
      : request.abort();
  });
  await page.goto(
    `https://www.google.com/search?q=${message.replace(/ /g, "+")}`,
    {
      waitUntil: "domcontentloaded",
    }
  );
  const data = {};

  await page.waitForSelector(".LC20lb", { visible: true });
  data["firstsResponses"] = await page.$$eval(".LC20lb", (els) =>
    els.map((e) => ({ title: e.innerText, link: e.parentNode.href }))
  );

  const query = new EmbedBuilder()
    .setColor("#4285f4")
    .setTitle("Google - " + message)
    .setURL("https://www.google.com/search?q=" + message.replace(/ /g, "+"))
    .setAuthor({
      name: "Google",
      iconURL:
        "https://w7.pngwing.com/pngs/557/90/png-transparent-google-logo-g-suite-google-text-logo-business-thumbnail.png",
      url: "https://google.com.br",
    })
    .setTimestamp();

  try {
    data["aboutEmbed"] = await page.evaluate(() => {
      const main = document.querySelector(
        "div[class='TQc1id IVvPP Jb0Zif rhstc4']"
      );
      const desc = main.querySelector(
        'div[class="B03h3d V14nKc i8qq8b ptcLIOszQJu__wholepage-card wp-ms"]'
      );
      return desc.querySelector('div[class="kno-rdesc"] > span').innerText;
    });

    query.addFields({ name: "Sobre: ", value: "\n" + data.aboutEmbed });
  } catch (error) {}

  try {
    data["infoEmbed"] = await page.evaluate(() => {
      return document.querySelector(
        'div[class="yp1CPe wDYxhc NFQFxe viOShc LKPcQc"]'
      ).innerText;
    });
    query.addFields({
      name: "\n",
      value: data.infoEmbed.slice(0, 200) + "...",
    });
  } catch (error) {}

  try {
    data["ageEmbed"] = await page.evaluate(() => {
      return document.querySelector('[data-attrid="kc:/people/person:age"]')
        .innerText;
    });

    query.addFields({ name: `Idade:`, value: "\n" + data.ageEmbed });
  } catch (error) {}

  try {
    data["sideInfoEmbed"] = await page.evaluate(() => {
      const main = document.querySelector(
        'div[class="kp-wholepage kp-wholepage-osrp HSryR EyBRub"]'
      );

      let response = {
        title: main.querySelector('h2[data-attrid="title"').innerText,
        description: main
          .querySelector('div[data-attrid="description"]')
          .querySelector("span")
          .innerText.replace("MAIS", "."),
      };

      return response;
    });

    query.addFields({
      name: `Informações: ${data.sideInfoEmbed.title}`,
      value: "\n" + data.sideInfoEmbed.description,
    });
  } catch (error) {}
  await browser.close();

  data["firstsResponses"].slice(0, 5).map((e, index) => {
    query.addFields({
      name: `${index + 1} - ` + e.title,
      value: e.link + "\n",
    });
  });

  return query;
}

module.exports = { googleSearch };
