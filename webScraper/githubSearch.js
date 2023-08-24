const { default: axios } = require("axios")
const { EmbedBuilder } = require("discord.js");

async function gitHubUserSearch(message){
    const userResponse = await axios.get(`https://api.github.com/users/${message}`)
    const {avatar_url, html_url, name, bio, public_repos, followers, following} = userResponse.data
    const pinnedReposResponse = await axios.get(`https://gh-pinned-repos.egoist.dev/?username=${message}`)

    const pinnedRepos = pinnedReposResponse.data.length > 3 ? pinnedReposResponse.data.slice(0, 3) : pinnedReposResponse.data

    const embed = new EmbedBuilder()
        .setColor("#563d7c")
        .setTitle(`Github - ${name === null ? message : name}`)
        .setURL(html_url)
        .setAuthor({
            name: message,
            iconURL: avatar_url,
            url: html_url,
        })
        .addFields(
            { name: '\n', value: bio === null ? 'Sem bio' : bio },
            { name: 'Seguidores', value: followers.toString(), inline: true },
            { name: 'Seguindo', value: following.toString(), inline: true },
            { name: 'Repositórios públicos', value: public_repos.toString(), inline: true },
            { name: '\u200B', value: '\u200B' },
            { name: 'Principais repositórios', value: '\n' },
        )
        .setTimestamp()

    pinnedRepos.forEach(repo => {
        embed.addFields(
            {name: repo.repo, value: repo.description === undefined ? 'Sem descrição' : repo.description, inline: true },
            {name: 'Linguagem', value: repo.language, inline: true},
            {name: 'Link', value: repo.link},
            { name: '\u200B', value: '\u200B' },
            )
        
    })

    return embed
}

module.exports = { gitHubUserSearch }