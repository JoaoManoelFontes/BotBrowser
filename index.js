//modules
require("dotenv").config();

const {
  Client,
  GatewayIntentBits,
  Partials,
  EmbedBuilder,
  ActivityType,
} = require("discord.js");

const prefix = "!";

const { yahooSearch } = require("./webScraper/yahooSearch");
const { googleSearch } = require("./webScraper/googleSearch");
const { videoSearch } = require("./webScraper/videoSearch");
const { gitHubUserSearch } = require("./webScraper/githubSearch");

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
    activities: [{ name: `Barbie`, type: ActivityType.Watching }],
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
    )
      .then((embed) => {
        message.channel.send({ embeds: [embed] });
      })
      .catch((err) => console.log(err));
  } else if (command === "watch") {
    videoSearch(message).then((embed) => {
      message.channel.send({ embeds: [embed] });
    });
  } else if (command === "google") {
    const embed = await googleSearch(
      message.content.substring(8, message.content.length)
    );
    message.channel.send({ embeds: [embed] });
  } else if (command === "github") {
    const embed = await gitHubUserSearch(
      message.content.substring(8, message.content.length)
    );
    message.channel.send({ embeds: [embed] });
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
        { name: "made in: ", value: "2020", inline: true },
        { name: "version: ", value: "1.5.0", inline: true }
      )
      .addFields(
        {
          name: "google",
          value:
            "Retorna os resultados de qualquer pesquisa no google. Assim como informações do google sobre a pesquisa (ex: idade, altura, etc)",
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
        },
        {
          name: "github",
          value:
            "O bot retorna informações sobre o usuário do github pesquisado, além dos principais repositórios (pinned repos).",
        }
      )
      .setTimestamp();

    message.channel.send({ embeds: [commandEmbed] });
  }
});

client.login(process.env.BOT_TOKEN);
