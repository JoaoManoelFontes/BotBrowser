const params = require("../params.json");

const { EmbedBuilder } = require("discord.js");

const SerpApi = require("google-search-results-nodejs");
const search = new SerpApi.GoogleSearch(
  "5071d41195f23d47c5f858e033fea43c87852bb4f955ad61ceaadf651a3367c1"
);

module.exports = {
  async GoogleSearch(req) {
    return new Promise((resolve, reject) => {
      params.search.q = req;
      params.image.q = req;

      search.json(params.search, (dataSearch) => {
        search.json(params.image, (dataImg) => {
          const [res1, res2] = dataSearch.organic_results;
          const { images_results } = dataImg;

          const query = new EmbedBuilder()
            .setColor("#4285f4")
            .setTitle("Google - " + req)
            .setURL("https://www.google.com/search?q=" + req.replace(/ /g, "+"))
            .setAuthor({
              name: "Google",
              iconURL:
                "https://w7.pngwing.com/pngs/249/19/png-transparent-google-logo-g-suite-google-guava-google-plus-company-text-logo-thumbnail.png",
              url: "https://google.com.br",
            })
            .addFields(
              { name: "1-" + res1.title, value: res1.link },
              { name: res1.snippet, value: "\u200B" },
              { name: "2-" + res2.title, value: res2.link },
              { name: res2.snippet, value: "\u200B" }
            )
            .addFields({
              name: "-----------------------------",
              value: images_results[0].title,
              inline: true,
            })
            .setImage(images_results[0].thumbnail)
            .setTimestamp();
          resolve(query);
        });
      });
    });
  },
};