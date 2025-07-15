// Choose a cache name
const cacheName = 'cache-v1'

// List the files to precache
const precacheResources = [
  './assets/chaveAzul.png',
  './assets/chaveVermelha.png',
  './assets/final-feliz.png',
  './assets/GameOver.png',
  './assets/fumaca.png',
  './assets/dan.png',
  './assets/fantasmas.png',
  './assets/fantasmasAlvos.png',
  './assets/fundo-sala.png',
  './assets/enigma1.png',
  './assets/abertura-fundo.png',
  './assets/luz.png',
  './assets/mascaraLanterna.png',
  './assets/mascaraPlayer.png',
  './assets/ernesto.png',
  './assets/mapa/texturas/chuva.png',
  './assets/mapa/texturas/chao/chao.png',
  './assets/mapa/texturas/objetos/tenda.png',
  './assets/mapa/texturas/objetos/portao.png',
  './assets/mapa/texturas/objetos/arvores.png',
  './assets/mapa/texturas/objetos/marcacao.png',
  './assets/mapa/texturas/objetos/banco.png',
  './assets/mapa/texturas/objetos/povTiroAlvo.png',
  './assets/mapa/texturas/objetos/tiroAoAlvo.png',
  './assets/mapa/mapa-patio.json',
  './assets/UI/hintUI.png',
  './assets/UI/numeros.png',
  './assets/UI/danFala.png',
  './assets/UI/botao.png',
  './assets/UI/tela-cheia.png',
  './assets/UI/vidas.png',
  './assets/UI/joystick.png',
  './assets/UI/interacaoLer.png',
  './assets/UI/lupa.png',
  './assets/UI/ernestoFala.png',
  './assets/UI/runUI.png',
  './assets/UI/shootUI.png',
  './assets/UI/seta.png',
  './assets/audio/chuva.mp3',
  './assets/audio/passosMadeira.mp3',
  './assets/audio/trilha-sonora.mp3',
  './assets/audio/somFantasma.mp3',
  './assets/audio/passos.mp3',
  './assets/audio/chuvaInterior.mp3',
  './assets/audio/falhaSom.mp3',
  './assets/audio/bancoMovendo.mp3',
  './assets/audio/pegaPista.mp3',
  './assets/audio/ernesto-machucado.mp3',
  './assets/audio/tiro.mp3',
  './assets/audio/passos.mp3',
  './assets/audio/trilha-sonora.mp3',
  './assets/audio/somFantasma.mp3',
  './assets/audio/passosMadeira.mp3',
  './assets/audio/chuva.mp3',
  './assets/audio/chuvaInterior.mp3',
  './assets/audio/falhaSom.mp3',
  './assets/audio/bancoMovendo.mp3',
  './assets/audio/pegaPista.mp3',
  './assets/audio/ernesto-machucado.mp3',
]

self.addEventListener('install', (event) => {
  console.log('Service worker install event!')
  event.waitUntil(caches.open(cacheName).then((cache) => cache.addAll(precacheResources)))
})

self.addEventListener('activate', (event) => {
  console.log('Service worker activate event!')
})

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request)
    })
  )
})
