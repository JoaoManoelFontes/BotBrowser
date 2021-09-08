//modules
const Discord = require("discord.js");
const config = require("./config.json");
const axios = require('axios');
const jsdom = require('jsdom');
const  {  JSDOM  }  =  jsdom ;

const client = new Discord.Client({
 presence: {
  status: 'online',
  activity: {
   name: 'Pica-Pau',
   type: 'WATCHING',
  },
 },
});
//prefixo
const prefix = "!"

client.once('ready', () => {
  console.log('bot logado em '+client.channels.cache.size+" "+'canais de '+client.guilds.cache.size+' servers') 
  }); 
 

client.on("message", function(message) {    
  if (message.author.bot) return;

    const errorEmbed = new Discord.MessageEmbed()
  .setColor('#3C4043')
  .setTitle('Erro!')
  .setTimestamp()

  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(' ');
  const command = args.shift().toLowerCase();
  const idUrl = message.guild.id


    if (command === "src"){

 const dataSrc = axios({

  url: "https://br.search.yahoo.com/search?p="+message.content.substring(5,message.content.length).replace(/ /g, "+")
}).then((result) =>{
  //cortando o html da página para conseguir apenas os links e imagens necessários
  const found = (result.data.match(/<ol class=" reg searchCenterMiddle">.+<\/ol/))
  const dom = new JSDOM(found)
  //pegando os resultados da pesquisa - links e imagens
  const searchLink =(dom.window.document.getElementsByTagName('a'))
  const imgFound =(dom.window.document.getElementsByTagName('img'))
  
  const useless = []
  const resul = []
  const resultext = []


  for (var i = 0; i <= searchLink.length-1; i++) { // removendo os links "desnecessários" para sua pesquisa

    if(searchLink[i].href.startsWith('https://br.search.yahoo.com/')){
      useless.push(searchLink[i].href)

    }else if(searchLink[i].href.startsWith('https://br.images.search.yahoo.com/search')){
      useless.push(searchLink[i].href)

    }else if (searchLink[i].href.startsWith('https://br.news.search.yahoo.com/search')){
      useless.push(searchLink[i].href)

    }else if (searchLink[i].href.startsWith('https://br.video.search.yahoo.com/search')){
      useless.push(searchLink[i].href)

      }else if (searchLink[i].href.startsWith('https://cc.bingj.com/cache')){
      useless.push(searchLink[i].href)

        }else if (searchLink[i].href.startsWith('https://br.ajuda.yahoo.com/')){
      useless.push(searchLink[i].href)

       }else if (searchLink[i].href.startsWith('https://r.search.yahoo.com/')){
      useless.push(searchLink[i].href)

         }else if (searchLink[i].href.startsWith('https://esportes.yahoo.com/noticias/')){
      useless.push(searchLink[i].href)

    }else{
      resul.push(searchLink[i].href)
      resultext.push(searchLink[i].text)
    }
  }

      for (var i = 0; i <= resultext.length-1; i++) {// caso não tenha um resumo abaixo do link
        if(resultext[i]===""){
          resultext.splice(i,1,"-esse site não apresenta nenhum resumo-")
        }
      }

      if(resul[0]===undefined){ //se não for possível achar os links referentes à pesquisa

        const searchEmbed = new Discord.MessageEmbed()
        .setColor('#4B0082')
        .setTitle('Resultados da pesquisa')
        .addFields(
            {name:"erro",value:"não foi possível encontrar resultados para essa pesquisa"},
         )
        .setTimestamp()        

        message.channel.send(searchEmbed);

      }else{

        if(imgFound.length>=0){//se tiver uma imagem sobre a pesquisa na página em questão

          const searchEmbed = new Discord.MessageEmbed()

           .setColor('#4B0082')
           .setTitle('Resultados da pesquisa')
           .setDescription('resultados sobre '+message.content.substring(5,message.content.length).replace(/ /g, " "))
           .addFields(
              {name: resul[0],value:resultext[0]},
              {name: resul[1],value:resultext[1]}
           )
           .addFields(
            {name:"imagem sobre "+message.content.substring(5,message.content.length).replace(/ /g, " "),value:imgFound[0].title}
          )
           .setImage(imgFound[0].src)
           .setTimestamp()
  
        message.channel.send(searchEmbed);   
        
        }else{

      const searchEmbed = new Discord.MessageEmbed()
        .setColor('#4B0082')
        .setTitle('Resultados da pesquisa')
        .setDescription('resultados sobre '+message.content.substring(5,message.content.length).replace(/ /g, " "))
        .addFields(
            {name: resul[0],value:resultext[0]},
            {name: resul[1],value:resultext[1]}
         )
        .setTimestamp()

      message.channel.send(searchEmbed);   
        }
      } 

    }).catch((error) =>{
      console.log(error)
      })


  }

  else if(command === "watch"){

    const dataWatch = axios({

      url: "https://br.video.search.yahoo.com/search/video;_ylt=A2KLfRhB7upgluUATjPz6Qt.;_ylu=Y29sbwNiZjEEcG9zAzEEdnRpZAMEc2VjA3BpdnM-?p="+message.content.substring(7,message.content.length).replace(/ /g, "+")
    }).then((result) =>{

      const videoFound = (result.data.match(/<ol><li class="vr vres">.+<\/ol/))
      const videoDom = new JSDOM(videoFound)
      const link = videoDom.window.document.getElementsByTagName("a")
      const thumb = videoDom.window.document.getElementsByTagName("img")
      const contentTitle = videoDom.window.document.getElementsByTagName("h3")
      const contentTime = videoDom.window.document.getElementsByClassName("v-time")

      if(link[0].href.startsWith("/video/play?p")){ //caso o vídeo for do YouTube

          const dataYt = axios({  //vai no link do video pelo Yahoo e pega o link do video no YouTube

            url: "https://br.video.search.yahoo.com/"+link[0].href
          }).then((result) =>{
            const yt = new JSDOM(result.data)
            const watchInYt = yt.window.document.getElementsByClassName("url")
          
              const videoEmbed = new Discord.MessageEmbed()//embed personalizada do yt
              .setColor('#FF0000')
              .setAuthor('www.youtube.com','https://logodownload.org/wp-content/uploads/2014/10/youtube-logo-5-2.png' ,'https://www.youtube.com/')
              .setTitle('Resultados da pesquisa:')
              .setDescription('video sobre '+message.content.substring(7,message.content.length).replace(/ /g, " "))
              .setImage(thumb[0].src)
              .addFields(
                {name:contentTitle[0].textContent, value:watchInYt[0].href, inline:true}
               )
              .setFooter("duração: "+contentTime[0].textContent)
    
            message.channel.send(videoEmbed);
              
      }).catch((error) =>{
        console.log(error)
        })      

      }else{// se for um video de outro site desconhecido

        const videoEmbed = new Discord.MessageEmbed()
        .setColor('#202A54')
        .setAuthor('Site desconhecido')
        .setTitle('Resultados da pesquisa:')
        .setDescription('video sobre '+message.content.substring(7,message.content.length).replace(/ /g, " "))
        .setImage(thumb[0].src)
        .addFields(
           {name:contentTitle[0].textContent, value:link[0].href}
           )
        .setFooter("informações tiradas inteiramente do Yahoo Vídeos")
  
      message.channel.send(videoEmbed);   
       }
    
  }).catch((error) =>{
    console.log(error)
    })
  
  }

  else if(command === "comandos"){
  const commandEmbed = new Discord.MessageEmbed()

   .setColor('#B35A33')
   .setTitle('Menu de comandos do Bot Lampião')
   .setAuthor('João Manoel', null , 'https://github.com/JoaoManoelFontes')
   .setDescription('todos os comandos do bot aqui')
   .addFields(
     {name:"prefix: ",value:"!", inline:true},
     {name:"library: ", value:"discord.js", inline:true},
     {name:"version: ", value:"2.5.0", inline:true}
   )
   .addFields(
     {name:'google', value:'O bot retorna um link que redireciona voçê ao google com sua pesquisa' },
     {name:'src', value:'O bot retorna o primeiro resultado da sua pesquisa de acordo com o search do Yahoo. Obs: Tente fazer uma pesquisa simples para evitar erros'},
     {name:'watch', value:'O bot retorna o primeiro resultado da sua pesquisa no Yahoo Videos, que geralmente é um vídeo do YouTube, por isso a mensagem personalizada'}
     )
   .setTimestamp()

message.channel.send(commandEmbed);
  }

});

client.login(config.BOT_TOKEN);
