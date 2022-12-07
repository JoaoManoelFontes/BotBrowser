//modules
const {
  Client,
  GatewayIntentBits,
  Partials,
  EmbedBuilder,
  ActivityType,
} = require("discord.js");

const { BOT_TOKEN, prefix } = require("./config.json");
const axios = require("axios");
const { JSDOM } = require("jsdom");
const webScraper = require("./webScraper");

const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel],
});

client.once("ready", () => {
  client.user.setPresence({
    activities: [{ name: `Wandinha`, type: ActivityType.Watching }],
  });

  console.log(
    "bot logado em " +
      client.guilds.cache.size +
      " servers com " +
      client.channels.cache.size +
      " canais"
  );
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(" ");
  const command = args.shift().toLowerCase();

  if (command === "src") {
    webScraper
      .yahooSearch(
        message.content.substring(5, message.content.length).replace(/ /g, "+")
      )
      .then((query) => {
        message.channel.send({ embeds: [query] });
      });
  } else if (command === "watch") {
    axios({
      url:
        "https://br.video.search.yahoo.com/search/video;_ylt=A2KLfRhB7upgluUATjPz6Qt.;_ylu=Y29sbwNiZjEEcG9zAzEEdnRpZAMEc2VjA3BpdnM-?p=" +
        message.content.substring(7, message.content.length).replace(/ /g, "+"),
    })
      .then((result) => {
        const videoFound = result.data.match(/<ol><li class="vr vres">.+<\/ol/);
        const videoDom = new JSDOM(videoFound);
        const link = videoDom.window.document.getElementsByTagName("a");
        const thumb = videoDom.window.document.getElementsByTagName("img");
        const contentTitle =
          videoDom.window.document.getElementsByTagName("h3");
        const contentTime =
          videoDom.window.document.getElementsByClassName("v-time");

        //caso o vídeo for do YouTube
        if (link[0].href.startsWith("/video/play?p")) {
          //vai no link do video pelo Yahoo e pega o link do video no YouTube
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
              message.channel.send({ embeds: [videoEmbed] });
            })
            .catch((error) => {
              console.log(error);
            });

          // se for um video de outro site desconhecido
        } else {
          const videoEmbed = new EmbedBuilder()
            .setColor("#202A54")
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

          message.channel.send({ embeds: [videoEmbed] });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  } else if (command === "google") {
    webScraper
      .GoogleSearch(message.content.substring(8, message.content.length))
      .then((query) => {
        message.channel.send({ embeds: [query] });
      });
  }
  //menu de comandos
  else if (command === "comandos") {
    const commandEmbed = new EmbedBuilder()

      .setColor("#B35A33")
      .setTitle("Menu de comandos do Bot Lampião")
      .setAuthor({
        name: "João Manoel",
        iconURL: null,
        url: "https://github.com/JoaoManoelFontes",
      })
      .setDescription("todos os comandos do bot aqui")
      .addFields(
        { name: "prefix: ", value: "!", inline: true },
        { name: "library: ", value: "discord.js", inline: true },
        { name: "version: ", value: "1.5.0", inline: true }
      )
      .addFields(
        {
          name: "google",
          value:
            "Api da serp que retorna os resultados de qualquer pesquisa no google. Apenas 100 pesquisas por mês são permitidas",
        },
        {
          name: "src",
          value:
            "O bot retorna o primeiro resultado da sua pesquisa de acordo com o search do Yahoo.",
        },
        {
          name: "watch",
          value:
            "O bot retorna o primeiro resultado da sua pesquisa no Yahoo Videos, que geralmente é um vídeo do YouTube, por isso a mensagem personalizada",
        }
      )
      .setTimestamp();

    message.channel.send({ embeds: [commandEmbed] });
  }
});

client.login(BOT_TOKEN);
