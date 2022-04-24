const params = require('./params.json');

const { MessageEmbed } = require('discord.js');

const axios = require('axios');

const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const SerpApi = require('google-search-results-nodejs');
const search = new SerpApi.GoogleSearch("5071d41195f23d47c5f858e033fea43c87852bb4f955ad61ceaadf651a3367c1");

module.exports = {
    GoogleSearch(req) {
        params.search.q = req;
        params.image.q = req;

        search.json(params.search, (dataSearch) => {

            search.json(params.image, (dataImg) => {
                const [res1, res2] = dataSearch.organic_results;
                const { images_results } = dataImg;
                return new MessageEmbed()
                    .addField('Ms: ', "sla");

            });

            return new MessageEmbed()
                .addField('Ms: ', "sla");

        });

        return new MessageEmbed()
            .addField('Ms: ', "sla");

    }
}