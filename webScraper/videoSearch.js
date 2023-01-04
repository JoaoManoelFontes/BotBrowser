const { EmbedBuilder } = require("discord.js");

const { default: axios } = require("axios");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

module.exports = {
  async videoSearch(message) {
    return new Promise((resolve, reject) => {
      axios({
        url:
          "https://br.video.search.yahoo.com/search/video?p=" +
          message.content
            .substring(7, message.content.length)
            .replace(/ /g, "+"),
      })
        .then((result) => {
          // ? Regex pra retornar apenas a lista de vídeos
          const videoFound = result.data.match(
            /<ol><li class="vr vres">.+<\/ol/
          );
          // ? Extraindo os dados
          const videoDom = new JSDOM(videoFound);
          const link = videoDom.window.document.getElementsByTagName("a");
          const thumb = videoDom.window.document.getElementsByTagName("img");
          const contentTitle =
            videoDom.window.document.getElementsByTagName("h3");
          const contentTime =
            videoDom.window.document.getElementsByClassName("v-time");

          // ? caso o vídeo for do YouTube
          if (link[0].href.startsWith("/video/play?p")) {
            axios({
              url: "https://br.video.search.yahoo.com/" + link[0].href,
            })
              .then((result) => {
                const yt = new JSDOM(result.data);
                const watchInYt =
                  yt.window.document.getElementsByClassName("url");

                //embed personalizada do yt
                const videoEmbed = new EmbedBuilder()
                  .setColor("#FF0000")
                  .setAuthor({
                    name: "Youtube",
                    iconURL:
                      "https://img2.gratispng.com/20180330/iyw/kisspng-youtube-red-logo-computer-icons-youtube-5abe39fec046a9.7547336915224161267876.jpg",
                    url: "https://www.youtube.com/",
                  })
                  .setTitle("Resultados da pesquisa:")
                  .setDescription(
                    "video sobre " +
                      message.content
                        .substring(7, message.content.length)
                        .replace(/ /g, " ")
                  )
                  .setImage(thumb[0].src)
                  .addFields({
                    name: contentTitle[0].textContent,
                    value: watchInYt[0].href,
                    inline: true,
                  });
                resolve(videoEmbed);
              })

              .catch((err) => console.log(err));
          } else {
            const videoEmbed = new EmbedBuilder()
              .setColor("#918f93")
              .setAuthor({ name: "Site desconhecido" })
              .setTitle("Resultados da pesquisa:")
              .setDescription(
                "video sobre " +
                  message.content
                    .substring(7, message.content.length)
                    .replace(/ /g, " ")
              )
              .setImage(thumb[0].src)
              .addFields({
                name: contentTitle[0].textContent,
                value: link[0].href,
                inline: true,
              });
            resolve(videoEmbed);
          }
        })
        .catch((err) => console.log(err));
    });
  },
};
