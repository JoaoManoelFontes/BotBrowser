const params = require("./params.json");

const { EmbedBuilder } = require("discord.js");

const axios = require("axios");

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const SerpApi = require("google-search-results-nodejs");
const search = new SerpApi.GoogleSearch(
  "5071d41195f23d47c5f858e033fea43c87852bb4f955ad61ceaadf651a3367c1"
);

module.exports = {
  async yahooSearch(req) {
    return new Promise((resolve, reject) => {
      axios({
        url: "https://br.search.yahoo.com/search?p=" + req,
      })
        .then((result) => {
          //cortando o html da página para conseguir apenas os links e imagens necessários
          const found = result.data.match(
            /<ol class=" reg searchCenterMiddle">.+<\/ol/
          );
          const dom = new JSDOM(found);

          //pegando os resultados da pesquisa - links e imagens
          const searchLink = dom.window.document.getElementsByTagName("a");
          const domImg = dom.window.document.getElementsByTagName("img");

          let imgFound = [];
          let imgTxt = [];

          const useless = [];
          const res = [];
          const resText = [];

          // removendo os links "desnecessários" para sua pesquisa
          for (var i = 0; i <= searchLink.length - 1; i++) {
            if (searchLink[i].href.startsWith("https://br.search.yahoo.com/")) {
              useless.push(searchLink[i].href);
            } else if (
              searchLink[i].href.startsWith(
                "https://br.images.search.yahoo.com/search"
              )
            ) {
              useless.push(searchLink[i].href);
            } else if (
              searchLink[i].href.startsWith(
                "https://br.news.search.yahoo.com/search"
              )
            ) {
              useless.push(searchLink[i].href);
            } else if (
              searchLink[i].href.startsWith(
                "https://br.video.search.yahoo.com/search"
              )
            ) {
              useless.push(searchLink[i].href);
            } else if (
              searchLink[i].href.startsWith("https://cc.bingj.com/cache")
            ) {
              useless.push(searchLink[i].href);
            } else if (
              searchLink[i].href.startsWith("https://br.ajuda.yahoo.com/")
            ) {
              useless.push(searchLink[i].href);
            } else if (
              searchLink[i].href.startsWith("https://r.search.yahoo.com/")
            ) {
              useless.push(searchLink[i].href);
            } else if (
              searchLink[i].href.startsWith(
                "https://esportes.yahoo.com/noticias/"
              )
            ) {
              useless.push(searchLink[i].href);
            } else {
              res.push(searchLink[i].href);
              resText.push(searchLink[i].text);
            }
          }

          //eliminando os gifs da variavel que armazena as imagens
          for (let index = 0; index < domImg.length - 1; index++) {
            if (domImg[index].src.startsWith("https://")) {
              imgFound.push(domImg[index].src);
              imgTxt.push(domImg[index].title);
            }
          }

          // caso não tenha um resumo abaixo do link
          for (var i = 0; i <= resText.length - 1; i++) {
            if (resText[i] === "") {
              resText.splice(i, 1, "esse site não apresenta nenhum resumo");
            }
          }
          if (res[0] === undefined || res[0] === null || res[0] === "") {
            const errorEmbed = new EmbedBuilder()
              .setColor("#3C4043")
              .setTitle("Erro!")
              .setTimestamp()
              .addFields({
                name: "erro!",
                value:
                  "não foi possível encontrar resultados para essa pesquisa",
              });

            resolve(errorEmbed);
          } else {
            //se tiver uma imagem sobre a pesquisa na página em questão
            if (imgFound.length > 0) {
              const searchEmbed = new EmbedBuilder()

                .setColor("#4B0082")
                .setTitle("Resultados da pesquisa")
                .setDescription("resultados sobre " + req.replace("+", " "))
                .addFields(
                  { name: res[0], value: resText[0] },
                  { name: res[1], value: resText[1] }
                )
                .addFields({
                  name: "imagem sobre " + req.replace("+", " "),
                  value: imgTxt[0],
                })
                .setImage(imgFound[0])
                .setTimestamp();

              resolve(searchEmbed);
              //se não tiver nenhuma imagem
            } else {
              const searchEmbed = new EmbedBuilder()
                .setColor("#4B0082")
                .setTitle("Resultados da pesquisa")
                .setDescription("resultados sobre " + req.replace("+", " "))
                .addFields(
                  { name: res[0], value: resText[0] },
                  { name: res[1], value: resText[1] }
                )
                .setTimestamp();

              resolve(searchEmbed);
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    });
  },
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
