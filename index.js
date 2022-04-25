//modules
const Discord = require("discord.js");
const { Intents, MessageEmbed } = require('discord.js');
const config = require("./config.json");
const params = require('./params.json');

const axios = require('axios');

const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const SerpApi = require('google-search-results-nodejs');
const { cleanLogs } = require("forever/lib/forever/cli");
const search = new SerpApi.GoogleSearch("5071d41195f23d47c5f858e033fea43c87852bb4f955ad61ceaadf651a3367c1");

const client = new Discord.Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] }, {
    presence: {
        status: 'online',
        activity: {
            name: 'Pica-Pau',
            type: 'WATCHING',
        },
    },
});


client.once('ready', () => {

    console.log('bot logado em ' + client.guilds.cache.size + ' servers com ' + client.channels.cache.size + " canais")
});


client.on("messageCreate", function(message) {
    if (message.author.bot) return;

    //mensagem de error automatizada
    const errorEmbed = new MessageEmbed()
        .setColor('#3C4043')
        .setTitle('Erro!')
        .setTimestamp()

    const commandBody = message.content.slice(config.prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();


    if (command === "src") {

        axios({
            url: "https://br.search.yahoo.com/search?p=" + message.content.substring(5, message.content.length).replace(/ /g, "+")
        }).then((result) => {

            //cortando o html da página para conseguir apenas os links e imagens necessários
            const found = (result.data.match(/<ol class=" reg searchCenterMiddle">.+<\/ol/))
            const dom = new JSDOM(found)

            //pegando os resultados da pesquisa - links e imagens
            const searchLink = (dom.window.document.getElementsByTagName('a'));
            const domImg = (dom.window.document.getElementsByTagName('img'));

            let imgFound = [];
            let imgTxt = [];

            const useless = []
            const res = []
            const resText = []

            // removendo os links "desnecessários" para sua pesquisa
            for (var i = 0; i <= searchLink.length - 1; i++) {

                if (searchLink[i].href.startsWith('https://br.search.yahoo.com/')) {
                    useless.push(searchLink[i].href)

                } else if (searchLink[i].href.startsWith('https://br.images.search.yahoo.com/search')) {
                    useless.push(searchLink[i].href)

                } else if (searchLink[i].href.startsWith('https://br.news.search.yahoo.com/search')) {
                    useless.push(searchLink[i].href)

                } else if (searchLink[i].href.startsWith('https://br.video.search.yahoo.com/search')) {
                    useless.push(searchLink[i].href)

                } else if (searchLink[i].href.startsWith('https://cc.bingj.com/cache')) {
                    useless.push(searchLink[i].href)

                } else if (searchLink[i].href.startsWith('https://br.ajuda.yahoo.com/')) {
                    useless.push(searchLink[i].href)

                } else if (searchLink[i].href.startsWith('https://r.search.yahoo.com/')) {
                    useless.push(searchLink[i].href)

                } else if (searchLink[i].href.startsWith('https://esportes.yahoo.com/noticias/')) {
                    useless.push(searchLink[i].href)

                } else {
                    res.push(searchLink[i].href)
                    resText.push(searchLink[i].text)
                }
            }

            //eliminando os gifs da variavel que armazena as imagens
            for (let index = 0; index < domImg.length - 1; index++) {

                if (domImg[index].src.startsWith("https://")) {
                    imgFound.push(domImg[index].src)
                    imgTxt.push(domImg[index].title)
                }

            }


            // caso não tenha um resumo abaixo do link
            for (var i = 0; i <= resText.length - 1; i++) {
                if (resText[i] === "") {
                    resText.splice(i, 1, "esse site não apresenta nenhum resumo")
                }
            }

            //se não for possível achar os links referentes à pesquisa
            if (res[0] === undefined) {

                errorEmbed.addFields({ name: "erro!", value: "não foi possível encontrar resultados para essa pesquisa" }, )
                message.channel.send({ embeds: [errorEmbed] });

            } else {

                //se tiver uma imagem sobre a pesquisa na página em questão
                if (imgFound.length > 0) {

                    const searchEmbed = new MessageEmbed()

                    .setColor('#4B0082')
                        .setTitle('Resultados da pesquisa')
                        .setDescription('resultados sobre ' + message.content.substring(5, message.content.length).replace(/ /g, " "))
                        .addFields({ name: res[0], value: resText[0] }, { name: res[1], value: resText[1] })
                        .addFields({ name: "imagem sobre " + message.content.substring(5, message.content.length).replace(/ /g, " "), value: imgTxt[0] })
                        .setImage(imgFound[0])
                        .setTimestamp()

                    message.channel.send({ embeds: [searchEmbed] });
                } else {

                    const searchEmbed = new MessageEmbed()
                        .setColor('#4B0082')
                        .setTitle('Resultados da pesquisa')
                        .setDescription('resultados sobre ' + message.content.substring(5, message.content.length).replace(/ /g, " "))
                        .addFields({ name: res[0], value: resText[0] }, { name: res[1], value: resText[1] })
                        .setTimestamp()

                    message.channel.send({ embeds: [searchEmbed] });
                }
            }

        }).catch((error) => {
            console.log(error)
        })

    } else if (command === "watch") {

        axios({
            url: "https://br.video.search.yahoo.com/search/video;_ylt=A2KLfRhB7upgluUATjPz6Qt.;_ylu=Y29sbwNiZjEEcG9zAzEEdnRpZAMEc2VjA3BpdnM-?p=" + message.content.substring(7, message.content.length).replace(/ /g, "+")
        }).then((result) => {

            const videoFound = (result.data.match(/<ol><li class="vr vres">.+<\/ol/))
            const videoDom = new JSDOM(videoFound)
            const link = videoDom.window.document.getElementsByTagName("a")
            const thumb = videoDom.window.document.getElementsByTagName("img")
            const contentTitle = videoDom.window.document.getElementsByTagName("h3")
            const contentTime = videoDom.window.document.getElementsByClassName("v-time")

            //caso o vídeo for do YouTube
            if (link[0].href.startsWith("/video/play?p")) {

                //vai no link do video pelo Yahoo e pega o link do video no YouTube
                axios({
                    url: "https://br.video.search.yahoo.com/" + link[0].href
                }).then((result) => {
                    const yt = new JSDOM(result.data)
                    const watchInYt = yt.window.document.getElementsByClassName("url")

                    //embed personalizada do yt
                    const videoEmbed = new MessageEmbed()
                        .setColor('#FF0000')
                        .setAuthor({ name: 'Youtube', iconURL: 'https://img2.gratispng.com/20180330/iyw/kisspng-youtube-red-logo-computer-icons-youtube-5abe39fec046a9.7547336915224161267876.jpg', url: 'https://www.youtube.com/' })
                        .setTitle('Resultados da pesquisa:')
                        .setDescription('video sobre ' + message.content.substring(7, message.content.length).replace(/ /g, " "))
                        .setImage(thumb[0].src)
                        .addField(
                            contentTitle[0].textContent, watchInYt[0].href, true

                        )
                    message.channel.send({ embeds: [videoEmbed] });

                }).catch((error) => {
                    console.log(error)
                })

                // se for um video de outro site desconhecido
            } else {

                const videoEmbed = new MessageEmbed()
                    .setColor('#202A54')
                    .setAuthor({ name: 'Site desconhecido' })
                    .setTitle('Resultados da pesquisa:')
                    .setDescription('video sobre ' + message.content.substring(7, message.content.length).replace(/ /g, " "))
                    .setImage(thumb[0].src)
                    .addField(contentTitle[0].textContent, link[0].href)

                message.channel.send({ embeds: [videoEmbed] });
            }

        }).catch((error) => {
            console.log(error)
        })

    } else if (command === "google") {

        const req = message.content.substring(8, message.content.length);
        params.search.q = req;
        params.image.q = req;

        search.json(params.search, (dataSearch) => {

            search.json(params.image, (dataImg) => {

                const [res1, res2] = dataSearch.organic_results;
                const { images_results } = dataImg;
                console.log(res1.link, res1.title, res1.snippet);
                console.log(res2.link, res2.title, res2.snippet);

                message.channel.send({
                    embeds: [
                        new MessageEmbed()
                        .setColor('#4285f4')
                        .setTitle('Google - ' + req)
                        .setURL('https://www.google.com/search?q=' + req.replace(/ /g, "+"))
                        .setAuthor({ name: 'Google', iconURL: 'https://w7.pngwing.com/pngs/249/19/png-transparent-google-logo-g-suite-google-guava-google-plus-company-text-logo-thumbnail.png', url: 'https://google.com.br' })
                        .addFields({ name: "1-" + res1.title, value: res1.link }, { name: res1.snippet, value: '\u200B' }, { name: "2-" + res2.title, value: res2.link }, { name: res2.snippet, value: '\u200B' }, )
                        .addField("-----------------------------", images_results[0].title)
                        .setImage(images_results[0].thumbnail)
                        .setTimestamp()
                    ]
                });
            });


        });






    } else if (command === "sort") { //sorteia qualquer quantidade de números, palavras ou pessoas... 

        if (args.length <= 1) { //se o usuário digitar só um item (ou nenhum) e não tiver como sortear 
            errorEmbed.addField('O Bot não pôde reconhecer a sua mensagem', 'Digite 2 ou mais itens', true)
            message.channel.send({ embeds: [errorEmbed] });
        } else {
            const random = getRandomInt(0, args.length)
            message.reply("o item sorteado é " + args[random])

        }

    } else if (command === "prob") { //o bot sorteia a probabilidade de acontecer uma sentença que o usuário digitar

        if (args.length <= 1) {
            errorEmbed.addField('O Bot não pôde reconhecer a sua mensagem', 'Digite uma palavra ou uma sentença ', true)
            message.channel.send({ embeds: [errorEmbed] });
        } else {

            const probability = getRandomInt(0, 100)
            message.reply(`chance de ` + probability + `%`)

        }

    }
    //menu de comandos
    else if (command === "comandos") {

        const commandEmbed = new MessageEmbed()

        .setColor('#B35A33')
            .setTitle('Menu de comandos do Bot Lampião')
            .setAuthor('João Manoel', null, 'https://github.com/JoaoManoelFontes')
            .setDescription('todos os comandos do bot aqui')
            .addFields({ name: "prefix: ", value: "!", inline: true }, { name: "library: ", value: "discord.js", inline: true }, { name: "version: ", value: "1.5.0", inline: true })
            .addFields({ name: 'google', value: 'Api da serp que retorna os resultados de qualquer pesquisa no google. Apenas 100 pesquisas por mês são permitidas' }, { name: 'src', value: 'O bot retorna o primeiro resultado da sua pesquisa de acordo com o search do Yahoo.' }, { name: 'watch', value: 'O bot retorna o primeiro resultado da sua pesquisa no Yahoo Videos, que geralmente é um vídeo do YouTube, por isso a mensagem personalizada' })
            .setTimestamp()

        message.channel.send({ embeds: [commandEmbed] });
    }



});

client.login(config.BOT_TOKEN);