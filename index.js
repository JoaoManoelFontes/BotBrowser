//modules
const {
  Client,
  GatewayIntentBits,
  Partials,
  EmbedBuilder,
  ActivityType,
} = require("discord.js");

const { BOT_TOKEN, prefix } = require("./config.json");

const { yahooSearch } = require("./webScraper/yahooSearch");
const { GoogleSearch } = require("./webScraper/googleSearch");
const { videoSearch } = require("./webScraper/videoSearch");

// Client
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

// Event on ready
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

// Event on message
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  // ? Transformando a mensagem em um array
  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(" ");
  const command = args.shift().toLowerCase();

  if (command === "src") {
    yahooSearch(
      message.content.substring(5, message.content.length).replace(/ /g, "+")
    ).then((embed) => {
      message.channel.send({ embeds: [embed] });
    });
  } else if (command === "watch") {
    videoSearch(message).then((embed) => {
      message.channel.send({ embeds: [embed] });
    });
  } else if (command === "google") {
    GoogleSearch(message.content.substring(8, message.content.length)).then(
      (embed) => {
        message.channel.send({ embeds: [embed] });
      }
    );
  }

  // ? menu de comandos
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
