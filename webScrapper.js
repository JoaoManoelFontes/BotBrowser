const params = require('./params.json');

const { MessageEmbed } = require('discord.js');

const axios = require('axios');

const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const SerpApi = require('google-search-results-nodejs');
const search = new SerpApi.GoogleSearch("5071d41195f23d47c5f858e033fea43c87852bb4f955ad61ceaadf651a3367c1");

module.exports = {
    yahooSearch(req) {

        axios({
            url: "https://br.search.yahoo.com/search?p=" + req
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


            return new promise((resolve) => {
                resolve(res[0]);
            });

        }).catch((error) => {
            console.log(error);
            return null;
        })

    }
}