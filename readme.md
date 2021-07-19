<<h1 align="center">Bot Browser</h1>
<h3 align="center">Bot do discord que tem a função de fazer a pesquisa em um browser por você </h3>
<br/>
<br/>
<br/>
<p align="center">Funções:</p>

<ul> 

<li>!src</li>
 Pesquisa no yahoo o que o usuário pedir e manda no chat os 2 primeiros resultados junto com um pequeno resumo  e uma imagem sobre o link, todos tirados da página da pesquisa.
<br/>
<h4>Obs:</h4>
<ul>
<li>Talvez alguns desses links não tenham um resumo ou uma imagem (em ambos os casos o Bot avisará)</li>
</ul>
<br/>

<h4>Exemplo:</h4>
<ul>
<li> !src github // o Bot vai pesquisar github no yahoo, vai pegar os links dos 2 primeiros resultados e mandar para o usuário </li>
</ul>

<br/>
<br/>

<li>!watch</li>
Pesquisa o vídeo que o usuário pedir pelo Yahoo Vídeos e mostra o link, o título e a thumbnail do primeiro resultado.
<br/>
<h4>Obs:</h4>
<ul>
<li>Geralmente o resultado é um vídeo do YouTube, nesse caso o Bot enviará uma embed personalizada do site, mostrando também a duração do vídeo. Caso não seja do YouTube o Bot, além de mandar que é um site que ele não conhece, irá mostrar o link do site junto com a thumb e o título em uma embed geral</li>
</ul>
<br/>

<h4>Exemplo:</h4>
<ul>
<li> !watch github // o Bot vai pesquisar github no Yahoo Vídeos, e vai mandar o primeiro resultado para o usuário </li>
</ul>
<br/>
<br/>
</ul>

<br/>
<h3 align="center">Bibliotecas:</h3>
<br/>
<br/>
<dl>
<dt>Axios</dt>
<dd>Foi feita para extrair dados de outras páginas da internet, ou seja, Web Scraping. Usada no Bot Browser para pegar todo o html de uma página </dd>
<dt>jsdom</dt>
<dd>Biblioteca que consegue lê html e, consequentemente, criar váriaveis com as informações contidas no html em questão, como por exemplo armazenar os links dos primeiros resultados de uma página em uma variavel, e foi para isso que essa biblioteca foi usada no Bot. </dd>
</dl>
<br/>
<br/>
<p>O Bot Random foi feito com a library discord.js na versão 12.5.3 .</p>
<p>Para adicionar esse codigo no seu bot, antes você terá que baixar o node js e, em seguida, essa biblioteca pelo npm.
<p><a href="https://www.digitalocean.com/community/tutorials/how-to-build-a-discord-bot-with-node-js-pt">Esse site</a> explica passo-a-passo uma maneira de criar um bot no discord usando javascript.</p>
<br/>
<br/>
<p>Obs: É importante que, no arquivo config.JSON, você armazene seu Bot Token, senão o código não funcionará, o site acima também explica como isso funciona</p>
<br/>
<br/>
<p align="right">Meu instagram: <a href="https://www.instagram.com/fontesjoaomanoel/">@fontesjoaomanoel
