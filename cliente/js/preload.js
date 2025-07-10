export default class preload extends Phaser.Scene {

  constructor () {
    super('preload')
  }

  init () {
    this.add.rectangle(400, 300, 468, 32).setStrokeStyle(1, 0xffffff)
    const progresso = this.add.rectangle(400 - 230, 300, 4, 28, 0xffffff)
    this.load.on('progress', (progress) => {
      progresso.width = 4 + (460 * progress)
    })
  }

  preload () {
    this.load.spritesheet('botao', 'assets/UI/botao.png', {
      frameWidth: 64,
      frameHeight: 64
    })
    this.load.spritesheet('numeros', 'assets/UI/numeros.png', {
      frameWidth: 96,
      frameHeight: 96
    });
    this.load.image('fundo-sala', 'assets/fundo-sala.png')

    // Principais
    this.load.spritesheet('ernesto', 'assets/ernesto.png', {
      frameWidth: 64,
      frameHeight: 64
    })
    this.load.spritesheet('dan', 'assets/dan.png', {
      frameWidth: 64,
      frameHeight: 64
    })

    this.load.spritesheet('fantasma', 'assets/fantasmas.png', {
      frameWidth: 50,
      frameHeight: 64
    })

    // FX
    this.load.image('mascaraPersonagem', 'assets/mascaraPlayer.png')
    this.load.image('mascaraLanterna', 'assets/mascaraLanterna.png')
    this.load.image('lanterna', 'assets/luz.png')
    this.load.image('particula-chuva', 'assets/mapa/texturas/chuva.png')
    this.textures.generate('bullet', { data: ['1'], pixelWidth: 1, pixelHeight: 1 });
    this.load.spritesheet('fumaca', 'assets/fumaca.png', {
      frameWidth: 32,
      frameHeight: 32
    })

    // UI
    this.load.image('ponteiro', 'assets/UI/seta.png')
    this.load.image('ler', 'assets/UI/interacaoLer.png')
    this.load.image('danFala', 'assets/UI/danFala.png')
    this.load.image('ernestoFala', 'assets/UI/ernestoFala.png')
    this.load.spritesheet('tela-cheia', 'assets/UI/tela-cheia.png', {
      frameWidth: 32,
      frameHeight: 32
    })
    this.load.spritesheet('tiro', 'assets/UI/shootUI.png', {
      frameWidth: 64,
      frameHeight: 64
    })
    this.load.spritesheet('pista', 'assets/UI/hintUI.png', {
      frameWidth: 64,
      frameHeight: 64
    })
    this.load.spritesheet('corrida', 'assets/UI/runUI.png', {
      frameWidth: 64,
      frameHeight: 64
    })
    this.load.spritesheet('joystick', 'assets/UI/joystick.png', {
      frameWidth: 96,
      frameHeight: 96
    })
    this.load.spritesheet('vidas', 'assets/UI/vidas.png', {
      frameWidth: 45,
      frameHeight: 12
    })
    this.load.spritesheet('lupa', 'assets/UI/lupa.png', {
      frameWidth: 32,
      frameHeight: 32
    })

    // Mapa
    this.load.tilemapTiledJSON('mapa', 'assets/mapa/mapa-patio.json')
    this.load.image('chao', 'assets/mapa/texturas/chao/chao.png')
    this.load.image('arvores', 'assets/mapa/texturas/objetos/arvores.png')
    this.load.image('tendas', 'assets/mapa/texturas/objetos/tenda.png')
    this.load.image('enigma1', 'assets/enigma1.png')
    this.load.image('marcacao', 'assets/mapa/texturas/objetos/marcacao.png')
    this.load.image('banco', 'assets/mapa/texturas/objetos/banco.png')
    this.load.image('povTiroAlvo', 'assets/mapa/texturas/objetos/povTiroAlvo.png')
    this.load.spritesheet('fantasmaAlvo', 'assets/fantasmasAlvos.png',{
      frameWidth: 50,
      frameHeight: 64
    })


    // Plugins
    this.load.plugin('rexvirtualjoystickplugin', './js/rexvirtualjoystickplugin.min.js', true)


    // Audio
    this.load.audio("trilha-sonora", 'assets/audio/trilha-sonora.mp3')
    this.load.audio('chuva', 'assets/audio/chuva.mp3')
    this.load.audio('chuvaInterior', 'assets/audio/chuvaInterior.mp3')
    this.load.audio('passos', 'assets/audio/passos.mp3')
    this.load.audio('passosMadeira', 'assets/audio/passosMadeira.mp3')
    this.load.audio('tiro', 'assets/audio/tiro.mp3')
    this.load.audio('som-fantasma', 'assets/audio/somFantasma.mp3')
    this.load.audio('pega-pista', 'assets/audio/pegaPista.mp3')
    this.load.audio('ernesto-machucado', 'assets/audio/ernesto-machucado.mp3')
    this.load.audio('bancoMovendo', 'assets/audio/bancoMovendo.mp3')
    this.load.audio('falhaSom', 'assets/audio/falhaSom.mp3')
  }

create() {
  this.scene.start('sala')
}

update() { }
}