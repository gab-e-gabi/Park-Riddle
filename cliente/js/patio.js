/*global Phaser*/
/*eslint no-undef: "error"*/
export default class patio extends Phaser.Scene {

  constructor() {
    super('patio')
    this.threshold = 1
    this.direcaoAtual = 'cima'
    this.personagemLocalAcao = false
    this.flagDentro = false
    this.velocidade = undefined
    this.ultimoAngulo = -1.5
    this.emCutscene = false
    this.flagTendaAberta = false
    this.entrouTendaE = false
    this.entrouTendaD = false
  }

  init() { }

  preload() {

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
    this.load.image('chaveAzul', 'assets/chaveAzul.png')
    this.load.image('chaveVermelha', 'assets/chaveVermelha.png')
    this.load.spritesheet('fantasmaAlvo', 'assets/fantasmasAlvos.png',{
      frameWidth: 50,
      frameHeight: 64
    })
    this.load.spritesheet('portao', 'assets/mapa/texturas/objetos/portao.png',{
      frameWidth: 128,
      frameHeight: 128
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

    this.input.addPointer()
  }

  create() {
    //Sons
    this.trilha = this.sound.add("trilha-sonora", {
      loop: true,
      volume: 0.1,
    })
    this.trilha.play()

    this.chuvaSom = this.sound.add("chuva", {
      loop: true,
      volume: 0.2
    })
    this.chuvaSom.play()

    this.chuvaInteriorSom = this.sound.add("chuvaInterior", {
      loop: true,
      volume: 0.5
    })

    this.passosSom = this.sound.add('passos', {
      volume: 0.5,
    })
    this.passosMadeiraSom = this.sound.add('passosMadeira', {
      volume: 0.7,
    })
    this.fantasmaSom = this.sound.add('som-fantasma', {
      volume: 0.3
    })
    this.machucadoSom = this.sound.add('ernesto-machucado', {
      volume: 0.3
    })
    this.bancoMovedoSom = this.sound.add('bancoMovendo', {
      volume: 0.6
    })
    this.falhaSom = this.sound.add('falhaSom', {
      volume: 0.3
    })
    this.pistaSom = this.sound.add('pega-pista', {
      volume: 0.5
    })
    this.tiroSom = this.sound.add('tiro')
    
    this.tilemapMapa = this.make.tilemap({ key: 'mapa' })
    // Da um nome prar cada Tileset
    this.tilesetChao = this.tilemapMapa.addTilesetImage('chao')
    this.tilesetArvores = this.tilemapMapa.addTilesetImage('arvores')
    this.tilesetTendas = this.tilemapMapa.addTilesetImage('tendas')
    //
    
    //Diz qual imagem esta em qual camada
    this.layerChao = this.tilemapMapa.createLayer('chao', [this.tilesetChao])
    this.layerCaminho = this.tilemapMapa.createLayer('caminho', [this.tilesetChao])

    this.portao = this.physics.add.sprite(960, 64, 'portao')
    this.anims.create({
      key: 'portao-abrindo',
      frames: this.anims.generateFrameNumbers('portao', { start: 0, end: 26 }),
      frameRate: 12,
      repeat: 0
    })
    
    this.lanternaLocal = this.add.image(0, 0, 'lanterna')
    this.lanternaLocal
      .setAlpha(0.7)
      .setBlendMode(Phaser.BlendModes.ADD)
      .setTint(0xfffabe)
      .setDisplaySize(512, 128)
    
    this.lanternaRemota = this.add.image(0, 0, 'lanterna')
    this.lanternaRemota
      .setAlpha(0.7)
      .setBlendMode(Phaser.BlendModes.ADD)
      .setTint(0xfffabe)
      .setDisplaySize(512, 128)


      this.layerSombras = this.tilemapMapa.createLayer('sombras', [this.tilesetArvores,this.tilesetTendas])
      
      this.pistas = [
      { x: 160, y: 740 },
      { x: 480, y: 1000 },
      { x: 960, y: 1115 },
      { x: 1570, y: 780 },
      { x: 1470, y: 180 },
      { x:600, y: 400},
    ]
    this.areaColeta = this.physics.add.image(0, 0, null).setSize(32, 40).setVisible(false)

    // Contador de pistas
    let contador = this.add.text(38, 45, 'Pistas: 0 / 6', { fontFamily: 'Arial', fontSize: 16, color: '#ffff00' }).setScrollFactor(0)
    contador.depth = 100

    this.pistasEncontradas = 0
    this.pistas.forEach((pista) => {
      pista.objeto = this.physics.add.sprite(pista.x, pista.y, 'lupa')
      this.physics.add.overlap(this.areaColeta, pista.objeto, (personagem, pista) => {
        pista.disableBody(true, true),
        this.pistaSom.play(),
        this.pistasEncontradas += 1,
        contador.text = `Pistas: ${this.pistasEncontradas} / 6`

        if (this.pistasEncontradas == 6) {
          this.flagPegouPistas = true
        }
      }, null, this)
    })
    
    this.layerPlayerSobrepoe = this.tilemapMapa.createLayer('playerSobrepoe', [this.tilesetTendas, this.tilesetArvores])
    
    if (this.game.jogadores.primeiro === this.game.socket.id) {
      this.game.remoteConnection = new RTCPeerConnection(this.game.iceServers);
      this.game.dadosJogo = this.game.remoteConnection.createDataChannel(
        "dadosJogo",
        { negotiated: true, id: 0 },
      );
      
      this.game.remoteConnection.onicecandidate = ({ candidate }) => {
        candidate &&
        this.game.socket.emit("candidate", this.game.sala, candidate);
      };
      
      this.game.remoteConnection.ontrack = ({ streams: [stream] }) => {
        this.game.audio.srcObject = stream;
      };

      if (this.game.midias) {
        this.game.midias
          .getTracks()
          .forEach((track) =>
            this.game.remoteConnection.addTrack(track, this.game.midias),
          );
      }

      this.game.socket.on("offer", (description) => {
        this.game.remoteConnection
          .setRemoteDescription(description)
          .then(() => this.game.remoteConnection.createAnswer())
          .then((answer) =>
            this.game.remoteConnection.setLocalDescription(answer),
          )
          .then(() =>
            this.game.socket.emit(
              "answer",
              this.game.sala,
              this.game.remoteConnection.localDescription,
            ),
          );
      });

      this.game.socket.on("candidate", (candidate) => {
        this.game.remoteConnection.addIceCandidate(candidate);
      });

      this.personagemLocal = this.physics.add.sprite(936, 1248, 'ernesto')
      // this.personagemLocal = this.physics.add.sprite(1570, 1800, 'ernesto')
      this.personagemRemoto = this.add.sprite(1000, 1248, 'dan')
      this.velocidade = 75
      this.speed = this.velocidade
      this.frameRate = 18
      this.personagemLocal.stamina = 650
      this.personagemLocal.cansado = false

      this.tempoUltimoDano = 0
      this.invulneravel = false
      this.tempoInvulnerabilidade = 2000

      this.barraStaminaMeio = this.add.circle(0, 0, 150 / 50, 0x000000)
      this.barraStaminaMeio.depth = 102

      this.barraStamina = this.add.circle(0, 0, this.personagemLocal.stamina / 50, 0x1a620e)
      this.barraStamina.depth = 101

      this.barraStaminaFundo = this.add.circle(0, 0, 700 / 50, 0x000000)
      this.barraStaminaFundo.depth = 100

      //Botão de corrida
      this.botaoCorrida = this.add.sprite(700, 400, 'corrida', 0)
        .setInteractive()
        .setScrollFactor(0)
      this.botaoCorrida
        .on('pointerdown', () => {
          if (!this.flagInteracao) {
            this.speed = this.velocidade *2
            this.frameRate = 25
            this.personagemLocal.movimento = 'correndo'
          }
        })
        .on('pointerup', () => {
          if (!this.flagInteracao) {
            this.speed = this.velocidade
            this.frameRate = 18
            this.personagemLocal.movimento = 'andando'
          }
        })
        .depth = 200

      //Botão de Ação
      this.botaoAcao = this.add.sprite(750, 350, 'pista', 0, )
        .setInteractive()
        .setScrollFactor(0)
      this.botaoAcao.depth = 200

      //Animação do Cachimbo
      this.particulaAcaoLocal = this.physics.add.sprite(0, 0, 'fumaca', 0)
        .setVisible(false)
        .setActive(false)
      this.particulaAcaoLocal.depth = 100
      this.particulaAcaoLocal.movendo = false

      this.particulaAcaoRemota = this.add.image(this.personagemRemoto.x, this.personagemRemoto.y, 'bullet')
        .setDisplaySize(5, 5)
        .setTint(0xffff00)
        .setBlendMode(Phaser.BlendModes.ADD)
      this.particulaAcaoRemota.depth = 100

      this.botaoAcao.on('pointerdown', () => {

        //Acha a pista mais proxima
        let distancia_pista = 0
        let mais_proxima = 10000
        let sobra_pista = 0
        this.maisProximaAngulo = 0

        this.pistas.forEach((pista) => {
          if (pista.objeto.visible) {
            sobra_pista = 1
            distancia_pista = Phaser.Math.Distance.Between(this.personagemLocal.x, this.personagemLocal.y, pista.x, pista.y)

            if (distancia_pista < mais_proxima) {
              mais_proxima = distancia_pista
              this.maisProximaAngulo = Phaser.Math.Angle.Between(this.personagemLocal.x, this.personagemLocal.y, pista.x, pista.y)
            }
          }
        })

        if (!this.particulaAcaoLocal.visible) {
          this.botaoAcao.setFrame(1)
          this.personagemLocalAcao = true
          this.personagemLocal.setVelocity(0)

          this.personagemLocal.anims.play(`personagem-acao-${this.direcaoAtual}`, true)
          this.personagemLocal.anims.yoyo = true
          this.personagemLocal.on('animationcomplete', () => {
            this.personagemLocalAcao = false
            this.botaoAcao.setFrame(0)
          })

          if (this.particulaAcaoLocal.movendo == false) {
            this.particulaAcaoLocal.movendo = true

            this.time.delayedCall(1000, () => {
              this.personagemLocal.anims.pause()
              this.particulaAcaoLocal
                .setPosition(this.personagemLocal.x + Math.cos(this.ultimoAngulo) * 30, this.personagemLocal.y + Math.sin(this.ultimoAngulo) * 30)
                .setFrame(0)
                .setVisible(true)
                .setActive(true)
              this.time.delayedCall(150, () => {
                this.personagemLocal.anims.resume()
                this.particulaAcaoLocal.setVelocity(Math.cos(this.maisProximaAngulo) * 35 * sobra_pista, Math.sin(this.maisProximaAngulo) * 35 * sobra_pista)
              })
              this.time.delayedCall(1000, () => {
                this.particulaAcaoLocal.anims.play('fumaca-desfazendo')
                this.particulaAcaoLocal.on('animationcomplete', () => {
                  this.particulaAcaoLocal
                    .setVisible(false)
                    .setActive(false)
                    .setVelocity(0)
                    .movendo = false
                })
              })
            })
          }
        }
      })

      this.fantasmaRemoto = this.add.sprite(0, 0, 'fantasma')
      this.fantasmaRemoto.depth = 99


      //vida

      this.vidas = this.add.sprite(80, 30, 'vidas').setScrollFactor(0).setDisplaySize(90, 24)
      this.vidas.depth = 100

      var vidas = 0
      this.vidas.on('dano', () => {
        this.machucadoSom.play()
        if (vidas == 2) {
          this.flagMorte = true
        } else {
          vidas += 1
          this.vidas.setFrame(vidas)
        }
      })

    } else if (this.game.jogadores.segundo === this.game.socket.id) {
      this.game.localConnection = new RTCPeerConnection(this.game.iceServers);
      this.game.dadosJogo = this.game.localConnection.createDataChannel(
        "dadosJogo",
        {
          negotiated: true,
          id: 0,
        },
      );

      this.game.localConnection.onicecandidate = ({ candidate }) => {
        this.game.socket.emit("candidate", this.game.sala, candidate);
      };

      this.game.localConnection.ontrack = ({ streams: [stream] }) => {
        this.game.audio.srcObject = stream;
      };

      if (this.game.midias) {
        this.game.midias
          .getTracks()
          .forEach((track) =>
            this.game.localConnection.addTrack(track, this.game.midias),
          );
      }

      this.game.localConnection
        .createOffer()
        .then((offer) => this.game.localConnection.setLocalDescription(offer))
        .then(() =>
          this.game.socket.emit(
            "offer",
            this.game.sala,
            this.game.localConnection.localDescription,
          ),
        );

      this.game.socket.on("answer", (description) => {
        this.game.localConnection.setRemoteDescription(description);
      });

      this.game.socket.on("candidate", (candidate) => {
        this.game.localConnection.addIceCandidate(candidate);
      });

      this.personagemLocal = this.physics.add.sprite(1000, 1248, 'dan')
      this.personagemRemoto = this.add.sprite(936, 1248, 'ernesto')
      this.velocidade = 90
      this.speed = this.velocidade
      this.frameRate = 18
      this.personagemLocal.stamina = 650
      this.personagemLocal.cansado = false

      this.barraStaminaMeio = this.add.circle(0, 0, 150 / 50, 0x000000)
      this.barraStaminaMeio.depth = 102

      this.barraStamina = this.add.circle(0, 0, this.personagemLocal.stamina / 50, 0x1a620e)
      this.barraStamina.depth = 101

      this.barraStaminaFundo = this.add.circle(0, 0, 700 / 50, 0x000000)
      this.barraStaminaFundo.depth = 100

      //Botão de corrida
      this.botaoCorrida = this.add.sprite(700, 400, 'corrida', 0, )
        .setInteractive()
        .setScrollFactor(0)
      this.botaoCorrida
        .on('pointerdown', () => {
          if (!this.flagInteracao) {
            this.speed = this.velocidade * 2
            this.frameRate = 25
            this.personagemLocal.movimento = 'correndo'
          }
        })
        .on('pointerup', () => {
          if (!this.flagInteracao) {
            this.speed = this.velocidade
            this.frameRate = 18
            this.personagemLocal.movimento = 'andando'
          }
        })
        .depth = 200

      //Botão de Ação
      this.botaoAcao = this.add.sprite(750, 350, 'tiro', 0, )
        .setInteractive()
        .setScrollFactor(0)
      this.botaoAcao.depth = 200

      //Animação de tiro
      this.particulaAcaoLocal = this.physics.add.image(0, 0, 'bullet')
        .setDisplaySize(5, 5)
        .setTint(0xffff00)
        .setBlendMode(Phaser.BlendModes.ADD)
        .setSize(10, 10)
        .setVisible(false)
        .setActive(false)
      this.particulaAcaoLocal.depth = 100
      this.particulaAcaoLocal.movendo = false

      this.particulaAcaoRemota = this.add.sprite(0, 0, 'fumaca', 0)
      this.particulaAcaoRemota.depth = 99

      this.botaoAcao.on('pointerdown', () => {

        if (!this.particulaAcaoLocal.visible) {
          this.botaoAcao.setFrame(1)
          this.personagemLocalAcao = true
          this.personagemLocal.setVelocity(0)

          this.personagemLocal.anims.play(`personagem-acao-${this.direcaoAtual}`, true)
          if (!this.tiroSom.isPlaying) {
            this.tiroSom.play()
          }

          this.personagemLocal.on('animationcomplete', () => {
            this.personagemLocalAcao = false
            this.botaoAcao.setFrame(0)
            this.tiroSom.stop()
          })

          if (this.particulaAcaoLocal.movendo == false) {
            this.particulaAcaoLocal.movendo = true

            this.time.delayedCall(700, () => {
              this.cameras.main.shake(100, 0.02)
              this.particulaAcaoLocal
                .setPosition(this.personagemLocal.x, this.personagemLocal.y)
                .setVisible(true)
                .setActive(true)
                .setVelocity(Math.cos(this.ultimoAngulo) * 1000, Math.sin(this.ultimoAngulo) * 1000)

              this.time.delayedCall(100, () => {
                const frame_tiro = this.anims.get(`personagem-acao-${this.direcaoAtual}`).getFrameAt(8)
                this.personagemLocal.anims.setCurrentFrame(frame_tiro)
                this.personagemLocal.anims.reverse()
              })


              this.time.delayedCall(600, () => {
                this.particulaAcaoLocal
                  .setVisible(false)
                  .setActive(false)
                  .setVelocity(0)
                  .movendo = false
              })
            })
          }
        }
      })

      this.fantasma = this.physics.add.sprite(100, -100, 'fantasma').setVisible(false)
      this.fantasma.visivel = false
      this.fantasma.atacando = false

      this.fantasma.on('comecou', () => {
        this.time.delayedCall(30000, () => { //Primeiro fantasma >>>>> 30s
          this.fantasma.setPosition(this.personagemRemoto.x, this.personagemRemoto.y - 100)
          this.fantasmaAngulo = 0
          this.fantasmaDistancia = 150
          this.fantasma.visivel = true
          this.fantasma.atacando = true
        })
      })

      this.physics.add.overlap(this.fantasma, this.particulaAcaoLocal, () => {

        this.fantasma.anims.play('fantasma-acertado', true).yoyo=true
        this.fantasma.on('animationcomplete', () => {
          this.fantasma.emit('invisivel')
        })
      })
      
      this.fantasma.on('invisivel', () => {
        this.fantasma.setPosition(-2000, -2000)
        this.fantasma.setFrame(0)
        this.fantasma.visivel = false
        
        this.time.delayedCall(15000, () => { //tempo de spawn dos fantasmas >>>> 15s
          this.fantasma.setPosition(this.personagemRemoto.x, this.personagemRemoto.y - 100)
          this.fantasmaAngulo = 0
          this.fantasmaDistancia = 150
          this.fantasma.visivel = true
          this.fantasma.atacando = true
          })
        })

    } else {
      window.alert("Sala cheia!")
      this.scene.stop()
      this.scene.start("sala")
    }

    this.game.dadosJogo.onopen = () => {
      console.log("Conexão de dados aberta!");
    }

    // Processa as mensagens recebidas via DataChannel
    this.game.dadosJogo.onmessage = (event) => {
      const dados = JSON.parse(event.data);

      if (dados.personagem) {
        this.personagemRemoto.x = dados.personagem.x;
        this.personagemRemoto.y = dados.personagem.y;
        this.personagemRemoto.setFrame(dados.personagem.frame);
        this.personagemRemoto.estaDentro = dados.personagem.estaDentro
        this.personagemRemoto.dentroTendaE = dados.personagem.dentroTendaE
        this.personagemRemoto.dentroTendaD = dados.personagem.dentroTendaD
        this.angleRemoto = dados.personagem.lanterna
      }

      if (dados.particula) {
        this.particulaAcaoRemota.x = dados.particula.x;
        this.particulaAcaoRemota.y = dados.particula.y;
        this.particulaAcaoRemota.visible = dados.particula.visivel
        this.particulaAcaoRemota.setFrame(dados.particula.frame);
      }

      if (dados.fantasma){
        if (!this.flagDentro) {
          this.fantasmaRemoto.x = dados.fantasma.x,
          this.fantasmaRemoto.y = dados.fantasma.y,
          this.fantasmaRemoto.visible = dados.fantasma.visivel
          this.fantasmaRemoto.setFrame(dados.fantasma.frame)
        } else {
          this.fantasmaRemoto.x = -2000,
          this.fantasmaRemoto.y = -2000,
          this.fantasmaRemoto.visible = false  
        }
      }

      if (dados.bancos) {
        this.bancosContainersEstaticos.forEach((banco, i) => {
          banco.x = dados.bancos[i].x;
          banco.y = dados.bancos[i].y;
        });
      }

      if (dados.pistas) {
        this.pistas.forEach((pista, i) => {
          if (!dados.pistas[i].visible) {
            pista.objeto.disableBody(true, true)
          }
        })
      }
      if (dados.pistasEncontradas) {
        this.pistasRecebidas = dados.pistasEncontradas
        if (this.pistasRecebidas > this.pistasEncontradas) {
          this.pistasEncontradas = this.pistasRecebidas
          contador.text = `Pistas: ${this.pistasEncontradas} / 6`
        }
      }

      if (dados.alvo) {

        if ((dados.alvo.correto.x != this.fantAlvoCorreto.x) || (dados.alvo.correto.y != this.fantAlvoCorreto.y)) {
          if (this.minigameAlvo) {
            this.minigameAlvo.emit('mudouPos')
          }
        }
        this.fantAlvoCorreto.x = dados.alvo.correto.x
        this.fantAlvoCorreto.y = dados.alvo.correto.y
        this.fantAlvoCorreto.alpha = dados.alvo.correto.alpha

        this.fantAlvoErrado.x = dados.alvo.errado.x
        this.fantAlvoErrado.y = dados.alvo.errado.y
        this.fantAlvoErrado.alpha = dados.alvo.errado.alpha

      }

      if (dados.chaveAzul) {
        if (dados.chaveAzul.pega) {
          this.pistaSom.play()
          this.chaveAzul.pega = true
          this.chaveAzul.visible = false
        } else {
          this.chaveAzul.visible = dados.chaveAzul.visible
          this.chaveAzul.body.enable = dados.chaveAzul.fisica
        }
      }
      if (dados.chaveVermelha) {
        if (dados.chaveVermelha.pega) {
          this.pistaSom.play()
          this.chaveVermelha.pega = true
          this.chaveVermelha.visible = false
        } else {
          this.chaveVermelha.visible = dados.chaveVermelha.visible
          this.chaveVermelha.body.enable = dados.chaveVermelha.fisica
        }
      }

      if (dados.flagMorte) {
        this.flagMorte = dados.flagMorte
      }
      if (dados.flagFinal) {
        this.flagFinal = dados.flagFinal
      }
      if (dados.flagPegouPistas) {
        this.flagPegouPistas = dados.flagPegouPistas
      }
    };

    this.layerObjetos = this.tilemapMapa.createLayer('objetos', [this.tilesetArvores, this.tilesetTendas])
    this.layerTendas = this.tilemapMapa.createLayer('tendas', [this.tilesetTendas])

    // Desenha círculos ao redor dos tiles com propriedade meio == true
    this.layerTendas.forEachTile(tile => {
      if (tile.properties && tile.properties.lado === true) {
        const worldX = tile.getCenterX();
        const worldY = tile.getCenterY();
        const tamanho = 80
        this.colisaoTenda = [
          this.physics.add.staticImage(worldX, worldY).setSize(tamanho*2,tamanho*2).setCircle(tamanho),
          this.physics.add.staticImage(worldX, worldY+64).setSize(tamanho,tamanho).setCircle(tamanho/2),
          this.physics.add.staticImage(worldX, worldY-48).setSize(tamanho + 16,tamanho + 16).setCircle((tamanho + 16)/2)
        ]

        this.physics.add.collider(this.personagemLocal, this.colisaoTenda)
      }
    });
    //Fisica do player
    this.cameras.main.startFollow(this.personagemLocal, true, 0.05, 0.05)
      .setBounds(
        0,
        0,
        1920, 
        1280)

    this.physics.world.setBounds(
      0,
      -16,
      1920, 
      1260)

    this.personagemLocal.setSize(40, 2)
    this.personagemLocal.setOffset(12, 6)
    this.personagemLocal.setCollideWorldBounds(true)

    
    this.chaveAzul = this.physics.add.image(1570, 1950, 'chaveAzul')
    this.chaveAzul.setVisible(false)
    this.chaveAzul.body.enable = false

    this.physics.add.overlap(this.chaveAzul, this.personagemLocal, () => {
      this.chaveAzul.pega = true
      this.chaveAzul.visible = false
      this.chaveAzul.body.enable = false
    })

    this.chaveVermelha = this.physics.add.image(355, 1950, 'chaveVermelha')
    this.chaveVermelha.setVisible(false)
    this.chaveVermelha.body.enable = false

    this.physics.add.overlap(this.chaveVermelha, this.personagemLocal, () => {
      this.chaveVermelha.pega = true
      this.chaveVermelha.visible = false
      this.chaveVermelha.body.enable = false
    })

    this.portao.body.pushable = false
    this.physics.add.collider(this.personagemLocal, this.portao, () => {
      if (this.chaveAzul.pega && this.chaveVermelha.pega) {
        this.portao.disableBody()
        this.portao.anims.play('portao-abrindo', true)
        this.flagFinal = true

        if (this.personagemLocal.texture.key == 'ernesto') this.personagemLocal.setPosition(936, 96)
        if (this.personagemLocal.texture.key == 'dan') this.personagemLocal.setPosition(1000, 96)
      } else {
        this.TextoFala('Trancado...', this.personagemLocal.texture.key)
      }
    })


    this.layerObjetos.setCollisionByProperty({ collides: true })
    this.layerTendas.setCollisionByProperty({ collides: true })
    this.layerPlayerSobrepoe.setCollisionByProperty({ collides: true })
    this.physics.add.collider(this.personagemLocal, [this.layerObjetos, this.layerTendas, this.layerPlayerSobrepoe])

    this.imagemMascaraPersonagem = this.add.image(0, 0, 'mascaraPersonagem').setVisible(false)
    this.imagemMascaraLanterna = this.add.image(0, 0, 'mascaraLanterna').setVisible(false)
    this.imagemMascaraLanterna.setSize(512, 128)
    
    this.mascaraPersonagem = this.imagemMascaraPersonagem.createBitmapMask()
    this.mascaraPersonagem.invertAlpha=true
    
    this.mascaraLanterna = this.imagemMascaraLanterna.createBitmapMask()
    this.mascaraLanterna.invertAlpha=true

    this.layerSombras.setMask(this.mascaraLanterna)
    this.layerObjetos.setMask(this.mascaraPersonagem)
    this.layerTendas.setMask(this.mascaraPersonagem)

    //Animacoes do personagem andando
    this.anims.create({
      key: 'personagem-andando-baixo',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 0, end: 12 }),
      frameRate: this.frameRate,
      repeat: -1
    })
    this.anims.create({
      key: 'personagem-andando-cima',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 13, end: 25 }),
      frameRate: this.frameRate,
      repeat: -1
    })
    this.anims.create({
      key: 'personagem-andando-esquerda',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 26, end: 38 }),
      frameRate: this.frameRate,
      repeat: -1
    })
    this.anims.create({
      key: 'personagem-andando-direita',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 39, end: 51 }),
      frameRate: this.frameRate,
      repeat: -1
    })
    this.anims.create({
      key: 'personagem-andando-cima-esquerda',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 52, end: 64 }),
      frameRate: this.frameRate,
      repeat: -1,
    })
    this.anims.create({
      key: 'personagem-andando-cima-direita',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 65, end: 77 }),
      frameRate: this.frameRate,
      repeat: -1
    })
    this.anims.create({
      key: 'personagem-andando-baixo-esquerda',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 78, end: 90 }),
      frameRate: this.frameRate,
      repeat: -1
    })
    this.anims.create({
      key: 'personagem-andando-baixo-direita',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 91, end: 103 }),
      frameRate: this.frameRate,
      repeat: -1
    })

    // Animações do personagem parado
    this.anims.create({
      key: 'personagem-parado-baixo',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 0, end: 0 }),
      frameRate: 12,
      repeat: -1
    })
    this.anims.create({
      key: 'personagem-parado-cima',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 14, end: 14 }),
      frameRate: 12,
      repeat: -1
    })
    this.anims.create({
      key: 'personagem-parado-esquerda',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 27, end: 27 }),
      frameRate: 12,
      repeat: -1
    })
    this.anims.create({
      key: 'personagem-parado-direita',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 40, end: 40 }),
      frameRate: 12,
      repeat: -1
    })
    this.anims.create({
      key: 'personagem-parado-cima-esquerda',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 53, end: 53 }),
      frameRate: 12,
      repeat: -1
    })
    this.anims.create({
      key: 'personagem-parado-cima-direita',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 66, end: 66 }),
      frameRate: 12,
      repeat: -1
    })
    this.anims.create({
      key: 'personagem-parado-baixo-esquerda',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 79, end: 79 }),
      frameRate: 12,
      repeat: -1
    })
    this.anims.create({
      key: 'personagem-parado-baixo-direita',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 92, end: 92 }),
      frameRate: 12,
      repeat: -1
    })

    //Acao do personagem
    this.anims.create({
      key: 'personagem-acao-baixo',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 104, end: 116 }),
      frameRate: 12,
    })
    this.anims.create({
      key: 'personagem-acao-cima',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 117, end: 129 }),
      frameRate: 12,
    })
    this.anims.create({
      key: 'personagem-acao-esquerda',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 130, end: 142 }),
      frameRate: 12,
    })
    this.anims.create({
      key: 'personagem-acao-direita',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 143, end: 155 }),
      frameRate: 12,
    })
    this.anims.create({
      key: 'personagem-acao-cima-esquerda',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 156, end: 168 }),
      frameRate: 12,
    })
    this.anims.create({
      key: 'personagem-acao-cima-direita',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 169, end: 181 }),
      frameRate: 12,
    })
    this.anims.create({
      key: 'personagem-acao-baixo-esquerda',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 182, end: 194 }),
      frameRate: 12,
    })
    this.anims.create({
      key: 'personagem-acao-baixo-direita',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 195, end: 207 }),
      frameRate: 12,
    })

    //Animações dan correndo
    if (this.personagemLocal.texture.key == 'dan') {
      this.anims.create({
        key: 'dan-correndo-baixo',
        frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 208, end: 220 }),
        frameRate: 18,
        repeat:-1
        })
      this.anims.create({
        key: 'dan-correndo-cima',
        frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 221, end: 233 }),
        frameRate: 18,
        repeat: -1
      })
      this.anims.create({
        key: 'dan-correndo-esquerda',
        frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 234, end: 246 }),
        frameRate: 18,
        repeat: -1
      })
      this.anims.create({
        key: 'dan-correndo-direita',
        frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 247, end: 259 }),
        frameRate: 18,
        repeat: -1
      })
      this.anims.create({
        key: 'dan-correndo-cima-esquerda',
        frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 260, end: 272 }),
        frameRate: 18,
        repeat: -1
      })
      this.anims.create({
        key: 'dan-correndo-cima-direita',
        frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 273, end: 285 }),
        frameRate: 18,
        repeat: -1
      })
      this.anims.create({
        key: 'dan-correndo-baixo-esquerda',
        frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 286, end: 298 }),
        frameRate: 18,
        repeat: -1
      })
      this.anims.create({
        key: 'dan-correndo-baixo-direita',
        frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 299, end: 311 }),
        frameRate: 18,
        repeat: -1
      })
    }

    this.anims.create({
      key: 'fumaca-desfazendo',
      frames: this.anims.generateFrameNumbers('fumaca', { start: 0, end: 4 }),
      frameRate: 6,
    })
    this.anims.create({
      key: 'fantasma-acertado',
      frames: this.anims.generateFrameNumbers('fantasma', {start: 0, end: 1}),
      frameRate: 12,
      repeat: 3
    })

    //Camada para escurecer o fundo
    this.noite = this.add.rectangle(960, 640, 1920, 1280, 0x472a66, 0.75)
    this.noite.setBlendMode(Phaser.BlendModes.MULTIPLY)
    this.noite.depth = 99

    // //chuva
    this.particulaChuva = this.add.particles(0, 0, 'particula-chuva', {
      x: { min: this.personagemLocal.x - 1500, max: this.personagemLocal.x + 500},
      quantity: 20, // mais gotas
      lifespan: 2000,
      speedY: { min: 900, max: 2200 }, // mais rápido
      speedX: { min: -120, max: 120 }, // vento lateral
      angle: { min: 85, max: 95 },
      scaleY: { min: 2.5, max: 5.5 }, // gotas maiores
      scaleX: { min: 0.5, max: 1 },
      alpha: { min: 0.7, max: 1 }, // mais opacas
      blendMode: 'ADD' // mais brilho
    })
      .setScrollFactor(0)
      this.particulaChuva.depth = 99

    this.ponteiro = this.physics.add.image(this.personagemRemoto.x, this.personagemRemoto.y, 'ponteiro').setDisplaySize(80, 64)
    this.ponteiro.depth = 100

    this.joystick = this.plugins.get('rexvirtualjoystickplugin').add(this, {
      x: 100,
      y: 360,
      radius: 50, // Raio do joystick
      base: this.add.sprite(120, 360, 'joystick', 0, ),
      thumb: this.add.sprite(120, 360, 'joystick', 1, )
    })
    this.joystick.base.depth = 200
    this.joystick.thumb.depth = 200

    this.telaCheia = this.add.sprite(778, 20, "tela-cheia", 0).setInteractive()
    this.telaCheia.on('pointerdown', () => {
      if (this.scale.isFullscreen) {
        this.scale.stopFullscreen();
        this.telaCheia.setFrame(0);
      } else {
        this.scale.startFullscreen();
        this.telaCheia.setFrame(1);
      }
    })
      .setScrollFactor(0)
      .depth = 100

    let flagFade = false
    this.minigameAlvo = this.add.image(-200, -200, null)

    this.entradaTendaE = this.physics.add.staticImage(288, 370).setSize(50, 50)
    this.entradaTendaE.body.enable = false

    this.saidaTendaE = this.physics.add.staticImage(350, 2080).setSize(50, 50)

    this.add.image(355, 1750, 'mascaraPersonagem').setDisplaySize(800, 800).setTint(0xfffabe).setAlpha(0.2).setBlendMode(Phaser.BlendModes.ADD)

    this.bordasProtecao = [
      this.physics.add.staticImage(150, 1750, null).setVisible(false).setSize(16, 400),
      this.physics.add.staticImage(355, 1950, null).setVisible(false).setSize(400, 16),
      this.physics.add.staticImage(355, 1550, null).setVisible(false).setSize(400, 16),
      this.physics.add.staticImage(550, 1750, null).setVisible(false).setSize(16, 400)
    ]

    this.physics.add.overlap(this.entradaTendaE, this.personagemLocal, () => {
      this.personagemLocal.setSize(32, 12)
      this.personagemLocal.setOffset(16, 24)
      this.mascaraLanterna.invertAlpha = false



      if (!flagFade) {
        this.cameras.main.fadeOut(1000)
        flagFade = true

        this.cameras.main.once('camerafadeoutcomplete', () => {
          this.cameras.main.fadeIn(1200);

          this.personagemLocal.dentroTendaE = true

          this.personagemLocal.setPosition(355, 2000)
          this.physics.world.setBounds(
            0,
            1450,
            1920,
            1280
          )
          this.cameras.main.setBounds(
            -50,
            1450,
            260,
            680
          )

          this.flagDentro = true

          if (this.personagemLocal.texture.key == 'ernesto') {
            this.lanternaLocal.setTint(0x2d2d96).setDisplaySize(320, 128)
            this.imagemMascaraLanterna.setDisplaySize(320, 128)
            this.lanternaRemota.setVisible(false)
          }

          if (this.personagemLocal.texture.key == 'dan') {
            this.lanternaLocal.setVisible(false)
            this.lanternaRemota.setTint(0x2d2d96).setDisplaySize(320, 128)
            this.imagemMascaraLanterna.setDisplaySize(0, 0)
          }

          flagFade = false

          this.fantasmaSom.stop()
          this.trilha.stop()
          this.chuvaSom.stop()
          this.chuvaInteriorSom.play()
        })

        this.particulaChuva.quantity = 0

      }
    })

    this.physics.add.overlap(this.saidaTendaE, this.personagemLocal, () => {
      this.personagemLocal.setSize(40, 2)
      this.personagemLocal.setOffset(12, 6)
      this.personagemLocal.dentroTendaE = false
      this.mascaraLanterna.invertAlpha = true


      if (!flagFade) {
        this.cameras.main.fadeOut(1000)
        flagFade = true

        this.cameras.main.once('camerafadeoutcomplete', () => {
          this.cameras.main.fadeIn(1200);

          this.personagemLocal.setPosition(288, 500)
          this.physics.world.setBounds(
            0,
            -16,
            1920,
            1260
          )
          this.cameras.main.setBounds(
            0,
            0,
            1920,
            1280
          )

          this.flagDentro = false

          if (this.personagemLocal.texture.key == 'ernesto') {
            this.lanternaLocal.setTint(0xfffabe).setDisplaySize(512, 128)
            this.imagemMascaraLanterna.setDisplaySize(512, 128)
            this.lanternaRemota.setVisible(true)
          }

          if (this.personagemLocal.texture.key == 'dan') {
            this.lanternaLocal.setVisible(true)
            this.lanternaRemota.setTint(0xfffabe).setDisplaySize(512, 128)
            this.imagemMascaraLanterna.setDisplaySize(512, 128)
          }

          flagFade = false

          this.trilha.play()
          this.chuvaSom.play()
          this.chuvaInteriorSom.stop()
        })

        this.particulaChuva.quantity = 50

      }

    })

    this.bancoPosicao = [
      {x: 250, y: 1650, n: 4, cod: 6},
      {x: 290, y: 1650, n: 2, cod: 5},
      {x: 330, y: 1650, n: 6, cod: 2},
      {x: 370, y: 1650, n: 3, cod: 1},
      {x: 410, y: 1650, n: 1, cod: 4},
      {x: 450, y: 1650, n: 5, cod: 3},
    ]

    if (this.personagemLocal.texture.key == 'dan') {
      this.bancosContainers = []
      this.spots = []
      this.resultado = 0

      this.bancoPosicao.forEach((banco) => {
        banco.objeto = this.add.image(0,0 , 'banco')
        banco.numero = this.add.text(0,0 , banco.n).setMask(this.mascaraLanterna)
        banco.numero.setVisible(false)
        
        banco.container = this.add.container(banco.x, banco.y, [banco.objeto, banco.numero])
        banco.container.setSize(20, 26)

        banco.container.numero = banco.n
        banco.container.correto = false
        banco.container.detector = this.physics.add.image(0, 0, null).setVisible(false).setSize(22, 28)

        this.physics.add.existing(banco.container)
        banco.container.body.pushable = false
        banco.container.body.setDrag(500)
        this.bancosContainers.push(banco.container)

        this.bancosContainers.forEach((bancosColisao) => {
          this.physics.add.collider(banco.container.body, bancosColisao.body)
        })

        this.physics.add.collider(banco.container, this.bordasProtecao)

        banco.spot = this.physics.add.image(banco.x, banco.y +200, 'marcacao').setMask(this.mascaraLanterna)
        banco.spot.numero = banco.cod
        this.spots.push(banco.spot)

        this.physics.add.overlap(banco.container.detector, this.personagemLocal)
        this.physics.add.collider(banco.container, this.personagemLocal, () => {
          banco.container.body.pushable = true

          if (!this.bancoMovedoSom.isPlaying) {
            this.bancoMovedoSom.play()
          }
          
          this.time.delayedCall(200, () => {
            if (!this.physics.overlap(banco.container.detector, this.personagemLocal)) {
              banco.container.body.pushable = false
            }
          })

        })
      })

      this.checaValor = this.physics.add.image(-200, -200)
      this.spots.forEach((spot) => {
        spot.setVisible(false)
        spot.podeChecar = true

        this.bancosContainers.forEach((bancos) => {

          this.checaValor.on('checar', () => {
            if (bancos.correto) {
              this.resultado += 1
            } else {
              this.resultado *= 0
            }

            if (this.resultado == 6) {
              this.chaveVermelha.setVisible(true)
              this.chaveVermelha.body.enable = true

              this.pistaSom.play()
            }
          })

          this.physics.add.overlap(spot, bancos, () => {

            if(spot.podeChecar) {
              spot.podeChecar = false
            
              if (bancos.numero == spot.numero) {
                bancos.correto = true
              } else {
                bancos.correto = false
              }

              this.checaValor.emit('checar')
            }

            if(!this.physics.overlap(bancos.detector, this.personagemLocal) && !spot.cheio) {
              spot.cheio = true
              bancos.x = spot.x
              bancos.y = spot.y
              bancos.body.setVelocity(0)
              bancos.body.pushable = false
            }
            this.time.delayedCall(100, () => {
              if (!this.physics.overlap(spot, bancos)) {
                this.resultado = 0
                spot.cheio = false
                bancos.correto = false
                spot.podeChecar = true
              }
            })

          })
        })
      })

      this.fantGanhaPonto = this.physics.add.staticImage(0, 0).setInteractive()
      this.fantGanhaPonto.setScrollFactor(0).setDisplaySize(96, 128).setDepth(300)

      this.fantPerdePonto = this.physics.add.staticImage(0, 0).setInteractive()
      this.fantPerdePonto.setScrollFactor(0).setDisplaySize(96, 128).setDepth(300)

      // converte a posição aleatória em coordenadas
      function ConvertePos(num) {
        switch (num) {
          case 0:
            return {x: 75, y: 50}

          case 1:
            return {x: 200, y: 50}

          case 2:
            return {x: 335, y: 50}

          case 3:
            return {x: 465, y: 50}

          case 4:
            return {x: 590, y: 50}

          case 5:
            return {x: 725, y: 50}

          case 6:
            return {x: 75, y: 180}

          case 7:
            return {x: 200, y: 180}

          case 8:
            return {x: 335, y: 180}

          case 9:
            return {x: 465, y: 180}
            
          case 10:
            return {x: 590, y: 180}

          case 11:
            return {x: 725, y: 180}

          case 12:
            return {x: 75, y: 320}

          case 13:
            return {x: 200, y: 320}

          case 14:
            return {x: 335, y: 320}

          case 15:
            return {x: 465, y: 320}

          case 16:
            return {x: 590, y: 320}

          case 17:
            return {x: 725, y: 320}

        }
      }
        let ganhaPontoPos = Math.floor(Math.random() * (17 - 0 + 1));
        let perdePontoPos = Math.floor(Math.random() * (17 - 0 + 1));
        var coorFantasma = undefined


      // escolhe um numero aleatório para o correto
      this.minigameAlvo.on('escolheCorreto', () => {
        ganhaPontoPos = Math.floor(Math.random() * (17 - 0 + 1));
        
        // posiciona
        coorFantasma = ConvertePos(ganhaPontoPos)
        this.fantGanhaPonto.setPosition(coorFantasma.x, coorFantasma.y)
      })

      // escolhe um numero aleatório para o errado
      this.minigameAlvo.on('escolheErrado', () => {
        perdePontoPos = Math.floor(Math.random() * (17 - 0 + 1));

        // se igual, rola de novo
        if (ganhaPontoPos == perdePontoPos) {
          this.minigameAlvo.emit('escolheErrado')
        } else {

          coorFantasma = ConvertePos(perdePontoPos)
          this.fantPerdePonto.setPosition(coorFantasma.x, coorFantasma.y)
        }
      })

      this.minigameAlvo.emit('escolheCorreto')
      this.minigameAlvo.emit('escolheErrado')
      this.pontosTiroAlvo = 0

      this.fantGanhaPonto.on('pointerdown', () => {
        this.pistaSom.play()
        this.pontosTiroAlvo += 1
        this.povAlvosContador.text = 'Pontos: '+this.pontosTiroAlvo
        this.minigameAlvo.emit('mudouPos')
      })

      this.fantPerdePonto.on('pointerdown', () => {
        if (!this.falhaSom.isPlaying) {
          this.falhaSom.play()
        }

        this.pontosTiroAlvo = 0
        this.povAlvosContador.text = 'Pontos: '+this.pontosTiroAlvo
        this.flagErro = true

        this.time.delayedCall(1500, () => {
          if (this.flagErro) {
            this.minigameAlvo.emit('mudouPos')
            this.flagErro = false
          }
        })

      })

      this.fadeInTween = this.tweens.add({
        targets: [this.fantGanhaPonto, this.fantPerdePonto],
        alpha: {from: 0, to: 1},
        duration: 1000,
        ease: 'Cubic',
        yoyo: false,
        repeat: 0,
        persist: true,
      });

      this.fadeOutTween = this.tweens.add({
        targets: [this.fantGanhaPonto, this.fantPerdePonto],
        alpha: {from: 1, to: 0},
        duration: 200,
        ease: 'Ease',
        yoyo: false,
        repeat: 0,
        persist: true,
        onComplete: () => {
          this.minigameAlvo.emit('escolheCorreto')
          this.minigameAlvo.emit('escolheErrado')
          if (this.pontosTiroAlvo < 10) {
            this.time.delayedCall(300, () => {
              this.fadeInTween.play()
            })
          } else {this.minigameAlvo.emit('ganhouAlvo')}
        }
      });

      this.fantGanhaPonto.setVisible(false)
      this.fantPerdePonto.setVisible(false)

      this.minigameAlvo.on('mudouPos', () => {
        this.fadeOutTween.play()
      })

      this.minigameAlvo.on('ganhouAlvo', () => {
        povAlvosSair.setActive(false).setVisible(false)
        povAlvos.setVisible(false)
        this.cameras.main.startFollow(this.personagemLocal, true, 0.05, 0.05)
        this.flagInteracao = false
        this.speed = this.velocidade
        this.pontosTiroAlvo = 0
        this.povAlvosContador.text = 'Pontos: '+this.pontosTiroAlvo

        if (this.personagemLocal.texture.key == 'ernesto') {
          this.fantAlvoCorreto.setVisible(false)
          this.fantAlvoErrado.setVisible(false)
        }
        if (this.personagemLocal.texture.key == 'dan') {
          this.fantGanhaPonto.setVisible(false)
          this.fantPerdePonto.setVisible(false)
          this.povAlvosContador.setVisible(false)
        }

        this.chaveAzul.setVisible(true)
        this.chaveAzul.body.enable = true

      })
    }

    if( this.personagemLocal.texture.key == 'ernesto') {
      this.bancosContainersEstaticos = []

      this.bancoPosicao.forEach((banco) => {
        banco.objeto = this.add.image(0,0 , 'banco')
        banco.numero = this.add.text(0,0 , banco.n).setMask(this.mascaraLanterna)

        banco.container = this.add.container(banco.x, banco.y, [banco.objeto, banco.numero])
        banco.container.setSize(20, 26)
        this.physics.add.existing(banco.container)
        this.physics.add.collider(banco.container, this.personagemLocal)
        this.physics.add.collider(banco.container, this.bordasProtecao)

        banco.container.body.pushable = false
        this.bancosContainersEstaticos.push(banco.container)

        banco.spot = this.add.image(banco.x, banco.y + 200, 'marcacao').setMask(this.mascaraLanterna)
      })

      this.fantAlvoCorreto = this.add.sprite(0, 0, 'fantasmaAlvo', 1)
      this.fantAlvoCorreto.setScrollFactor(0).setDisplaySize(96, 128).setDepth(500)

      this.fantAlvoErrado = this.add.sprite(0, 0, 'fantasmaAlvo', 0)
      this.fantAlvoErrado.setScrollFactor(0).setDisplaySize(96, 128).setDepth(500)

      this.fantAlvoCorreto.setVisible(false)
      this.fantAlvoErrado.setVisible(false)
    }

    this.papelEnigma1 = this.physics.add.image(350, 1750, 'enigma1').setDisplaySize(32, 40)
    this.botaoLer = this.add.image(this.papelEnigma1.x, this.papelEnigma1.y, 'ler').setInteractive()
    this.botaoLer.setVisible(false)
    this.botaoLer.depth = 100

    this.physics.add.overlap(this.papelEnigma1, this.areaColeta , () => {
      this.time.delayedCall(100, () => {
        this.botaoLer.setVisible(this.physics.overlap(this.papelEnigma1, this.areaColeta))
      })
    })

    this.botaoLer.on('pointerdown', () => {
      this.cameras.main.startFollow(this.papelEnigma1)
      this.flagInteracao = true
      this.speed = 0
      this.papelEnigma1.depth = 200

      this.papelEnigma1.setDisplaySize(396, 520).setInteractive().on('pointerdown', () => {
        this.cameras.main.startFollow(this.personagemLocal, true, 0.05, 0.05)
        this.flagInteracao = false
        this.speed = this.velocidade
        this.papelEnigma1.setDisplaySize(32, 40).setInteractive(false)
        this.papelEnigma1.depth = 99
      })
    })

    this.flagBlur = false
    this.entradaTendaD = this.physics.add.staticImage(1630, 370).setSize(50, 50)
    this.entradaTendaD.body.enable = false

    this.saidaTendaD = this.physics.add.staticImage(1570, 2080).setSize(50, 50)

    this.add.image(1560, 1750, 'mascaraPersonagem').setDisplaySize(800, 800).setTint(0xfffabe).setAlpha(0.2).setBlendMode(Phaser.BlendModes.ADD)
    const areaTiro = this.physics.add.image(1570, 1790).setSize(200, 80)

    const povAlvos = this.add.image(1580, 1860, 'povTiroAlvo').setDisplaySize(800, 500)
    povAlvos.setVisible(false).depth = 300

    const povAlvosSair = this.add.text(1580, 2060, 'Clique aqui para sair').setInteractive().setOrigin(.5, .5)
    povAlvosSair.setActive(false).setVisible(false).depth = 300

    this.povAlvosContador = this.add.text(1380, 2060, `Pontos: ${this.pontosTiroAlvo}`, {fontFamily: 'Arial',  fontSize: 24, color: '#fff000',stroke: '#000000', strokeThickness: 2})
    this.povAlvosContador.setOrigin(.5, .5).setDepth(300).setVisible(false)

    this.botaoTiro = this.add.image(areaTiro.x, areaTiro.y, 'ler').setInteractive()
    this.botaoTiro.setVisible(false)

    this.physics.add.overlap(areaTiro, this.areaColeta, () => {
      this.time.delayedCall(100, () => {
        this.botaoTiro.setVisible(this.physics.overlap(areaTiro, this.areaColeta))
      })
    })
    this.botaoTiro.on('pointerdown', () => {
      povAlvos.setVisible(true)
      povAlvosSair.setActive(true).setVisible(true)
      this.cameras.main.startFollow(povAlvos)
      this.flagInteracao = true
      this.speed = 0

      if (this.personagemLocal.texture.key == 'ernesto') {
        this.fantAlvoCorreto.setVisible(true)
        this.fantAlvoErrado.setVisible(true)
      }
      if (this.personagemLocal.texture.key == 'dan') {
        this.fantGanhaPonto.setVisible(true)
        this.fantPerdePonto.setVisible(true)
        this.povAlvosContador.setVisible(true)
      }
    })

    povAlvosSair.on('pointerdown', () => {
      povAlvosSair.setActive(false).setVisible(false)
      povAlvos.setVisible(false)
      this.cameras.main.startFollow(this.personagemLocal, true, 0.05, 0.05)
      this.flagInteracao = false
      this.speed = this.velocidade
      this.pontosTiroAlvo = 0
      this.povAlvosContador.text = 'Pontos: '+this.pontosTiroAlvo

      if (this.personagemLocal.texture.key == 'ernesto') {
        this.fantAlvoCorreto.setVisible(false)
        this.fantAlvoErrado.setVisible(false)
      }
      if (this.personagemLocal.texture.key == 'dan') {
        this.fantGanhaPonto.setVisible(false)
        this.fantPerdePonto.setVisible(false)
        this.povAlvosContador.setVisible(false)
      }
    })

    this.physics.add.overlap(this.entradaTendaD, this.personagemLocal, () => {
      this.personagemLocal.setSize(32, 12)
      this.personagemLocal.setOffset(16, 24)


      if (!flagFade) {
        this.cameras.main.fadeOut(1000)
        flagFade = true

        this.cameras.main.once('camerafadeoutcomplete', () => {
          this.cameras.main.fadeIn(1200);
          
          this.lanternaRemota.setAlpha(0.0001)
          this.lanternaLocal.setAlpha(0.0001)

          if(this.personagemLocal.texture.key == 'ernesto' && !this.flagBlur && this.entrouTendaD) {
            this.cameras.main.postFX.addBlur(1, 2, 1, 1, 0xffffff, 1)
            this.cameras.main.postFX.addBarrel(1.2)
            this.flagBlur = true
          }

          this.personagemLocal.dentroTendaD = true

          this.personagemLocal.setPosition(1560, 2000)
          this.physics.world.setBounds(
            0,
            1450,
            1920,
            1280
          )
          this.cameras.main.setBounds(
            1180,
            1450,
            260,
            680
          )

          this.flagDentro = true

          flagFade = false

          this.fantasmaSom.stop()
          this.trilha.stop()
          this.chuvaSom.stop()
          this.chuvaInteriorSom.play()
        })

        this.particulaChuva.quantity = 0

      }
    })

    this.physics.add.overlap(this.saidaTendaD, this.personagemLocal, () => {
      this.personagemLocal.setSize(40, 2)
      this.personagemLocal.setOffset(12, 6)
      this.personagemLocal.dentroTendaD = false


      if (!flagFade) {
        this.cameras.main.fadeOut(1000)
        flagFade = true

        this.cameras.main.once('camerafadeoutcomplete', () => {
          this.cameras.main.fadeIn(1200);
          
          this.lanternaRemota.setAlpha(1)
          this.lanternaLocal.setAlpha(1)
          this.mascaraLanterna.invertAlpha = true
          

          if(this.personagemLocal.texture.key == 'ernesto') {
            this.cameras.main.postFX.clear()
            this.flagBlur = false
          }

          this.personagemLocal.setPosition(1630, 500)
          this.physics.world.setBounds(
            0,
            -16,
            1920,
            1260
          )
          this.cameras.main.setBounds(
            0,
            0,
            1920,
            1280
          )

          this.flagDentro = false

          flagFade = false

          this.trilha.play()
          this.chuvaSom.play()
          this.chuvaInteriorSom.stop()
        })

        this.particulaChuva.quantity = 50

      }

    })
    this.EntrandoParque()

    this.entradaTendaE.on('triggerDialogoTendaE', () => {
      this.EntrandoTendaE()
    })
    this.entradaTendaD.on('triggerDialogoTendaD', () => {
      this.EntrandoTendaD()
    })

  }

    TextoFala (fala, falante, chainFunc)
  {

      this.joystick.setEnable(false)
      this.joystick.thumb.setVisible(false)
      this.joystick.base.setVisible(false)
      this.botaoAcao.setVisible(false)
      this.botaoCorrida.setVisible(false)
      this.speed = 0

      var bubbleWidth = 632;
      var bubbleHeight = 100;
      var bkg = this.add.image(0, 450, `${falante}Fala`).setOrigin(0, 1).setScrollFactor(0).setDisplaySize(800, 128).setDepth(300)
      var bubble = this.add.graphics({ x: 140, y: 336 }).setScrollFactor(0).setDepth(301)

      //  Bubble color
      bubble.fillStyle(0x012201, 1);

      //  Bubble outline line style
      bubble.lineStyle(4, 0x000100, 1);

      //  Bubble shape and outline
      bubble.strokeRoundedRect(0, 0, bubbleWidth, bubbleHeight, 16);
      bubble.fillRoundedRect(0, 0, bubbleWidth, bubbleHeight, 16);

      var content = this.add.text(0, 0, fala, { fontFamily: 'Arial', fontSize: 20, color: '#bbbbbb', align: 'center', wordWrap: { width: bubbleWidth - 40 } });
      content.setScrollFactor(0).setDepth(302)

      var b = content.getBounds();

      content.setPosition(bubble.x + (bubbleWidth / 2) - (b.width / 2), bubble.y + (bubbleHeight / 2) - (b.height / 2));

      bkg.setInteractive().on('pointerdown', () => {
        content.destroy()
        bubble.destroy()
        bkg.destroy()

        if (typeof chainFunc === 'function') {chainFunc()}
        else {
          this.joystick.setEnable(true)
          this.joystick.thumb.setVisible(true)
          this.joystick.base.setVisible(true)
          this.botaoAcao.setVisible(true)
          this.botaoCorrida.setVisible(true)
          this.speed = this.velocidade
        }
      })
  }

    EntrandoParque () {
      const d = 'dan'
      const e = 'ernesto'
    this.emCutscene = true

    this.TextoFala('Finalmente chegamos, bem isolado esse lugar, essa chuva também não ajudou.', d, () =>
    this.TextoFala('Vamos terminar isso logo, por onde começamos?', d, () => 
    this.TextoFala('Se acalme, jovem. Não podemos ir com pressa, vamos acabar perdendo algo.', e, () => 
    this.TextoFala('Vamos dar uma boa olhada nos arredores primeiramente', e, () => {

      if (this.personagemLocal.texture.key == e) {
        const fant = this.add.sprite(this.personagemLocal.x, this.personagemLocal.y - 200, 'fantasma', 0)
        fant.setAlpha(0)
        this.fantasmaSom.play()

        const fadeIn = this.tweens.add({
          targets: fant,
          alpha: {from: 0, to: 1},
          duration: 1000,
          ease: 'Ease',
          yoyo: true,
          repeat: 0,
          onComplete: () => {
              fant.destroy()
          }
        });
          fadeIn.play()
        }
    this.TextoFala('Viu isso?', e, () => 
    this.TextoFala('O que?! Onde atiro?!', d, () =>
    this.TextoFala('HaHaHaHa. Se acalme jovem.', e, () =>
    this.TextoFala('Esse caso vai ser mais interessante do que eu esperava...', e, () =>
    this.TextoFala('Ahnn.. Espero que isso seja uma coisa boa. Não esquece que fui designado para sua segurança, onde precisar que eu atire, eu atiro', d, () => {

      if (this.personagemLocal.texture.key == 'dan') this.fantasma.emit('comecou')
      this.emCutscene = false

    this.TextoFala('HaHaHa. Certo, agora vamos procurar pistas. A fumaça do meu cachimbo deve nos ajudar a encontrar pistas (🔎)', e
    )}
    )))))
    }))))

  }

    AbrindoTendas() {
      const d = 'dan'
      const e = 'ernesto'
      this.emCutscene = true
      this.flagPegouPistas = false

      this.cameras.main.fadeOut(1000)

      this.cameras.main.once('camerafadeoutcomplete', () => {

        if (this.emCutscene) {

          this.cameras.main.fadeIn(1000)
          
          this.entradaTendaD.body.enable = true
          this.entradaTendaE.body.enable = true
          
          if (this.personagemLocal.texture.key == 'ernesto') {
            this.personagemLocal.setPosition(936, 700)
            this.ultimoAngulo = 0
            this.direcaoAtual = 'direita'
            
          }

          if (this.personagemLocal.texture.key == 'dan') {
            this.personagemLocal.setPosition(1000, 700)
            this.ultimoAngulo = 3
            this.direcaoAtual = 'esquerda'
          }
          
          this.TextoFala('Terminamos?', d, () => 
            this.TextoFala('Receio que não, jovem', e, () => 
              this.TextoFala('Não encontrei o suficiente para determinar o paradeiro desses desaparecidos, vamos olhar aquelas tendas', e, () =>{
                this.emCutscene = false
                this.TextoFala('OK!', d)
              })))
            }
      })
  }

  EntrandoTendaE() {
      const d = 'dan'
      const e = 'ernesto'
      this.emCutscene = true
      this.entrouTendaE = true
      
      this.TextoFala('Hmmm, não me parece que tenha muito pra ver por aqui', d, () => 
      this.TextoFala('Sem pressa', e, () => 
      this.TextoFala('Eu trouxe minha lanterna UV, vamos dar uma olhada mais de perto', e, () => 
      this.TextoFala('Lanterna UV?', d, () => {
      this.emCutscene = false
      this.TextoFala('Sim, com ela vou poder ver possiveis marcas ocultas a olho nu', e)
      }))))
  }
  
  EntrandoTendaD() {
    const d = 'dan'
    const e = 'ernesto'
    this.emCutscene = true
    this.entrouTendaD = true

    this.TextoFala('Hmm, tiro ao alvo', e, () =>
    this.TextoFala('Já que estamos aqui, que tal mostrar sua pontaria?', e, () =>
    this.TextoFala('Ahm.. Não vejo nenhum alvo', d, () =>
    this.TextoFala('Ah sim, o paranormal, eu te guio', e, () =>
    this.TextoFala('?..', d, () =>
    this.TextoFala('Presumo que tenhamos que acertar os malvados', e, () =>
    this.TextoFala('Hmmm... Está bem úmido aqui..', e,  () => 
    this.TextoFala('Como sabe? Algum equipamento de investigação??', d, () => 
    this.TextoFala('Não..', e, () => 
    this.TextoFala('Meus óculos....', e,  () => 
    this.TextoFala('Embaçaram....', e,  () => {
      if (this.personagemLocal.texture.key == 'ernesto') {
        this.cameras.main.postFX.addBlur(1, 2, 1, 1, 0xffffff, 1)
        this.cameras.main.postFX.addBarrel(1.2)
      }
      this.TextoFala('ah-', d)
    })))))))))))
  }

  AbrindoPortao() {
    const d = 'dan'
    const e = 'ernesto'
    this.emCutscene = true
    this.entrouTendaD = true

    this.TextoFala('O que será que tem la dentro?', d, () =>
    this.TextoFala('Tipo, o que tá rolando aqui exatamente?', d, () =>
    this.TextoFala('HaHaHa. Está aprendenddo rápido jovem, este é o espírito de investigação', e, () => 
    this.TextoFala('...', d, () =>
    this.TextoFala('Vamos la, é um ótimo primeiro caso para você', e, () =>
    this.TextoFala('Vai ser.. um...', e, () =>
    this.TextoFala('Enigma do Parque?..', d, () => {
      this.cameras.main.fadeOut(1000)
      
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.sound.stopAll()
        this.scene.stop()
        this.scene.start('Win')
      })
    }
  )))))))
  }

  update(time, delta) {


    console.log(this.personagemLocal.texture.key,this.chaveAzul.pega, this.chaveVermelha.pega)
    // Normaliza delta para 60 FPS (16.666 ms)
    const norm = delta / 16.666;

    if (this.bancosContainers) {
      this.bancosContainers.forEach(banco => {
        if (banco.detector) {
          banco.detector.x = banco.x;
          banco.detector.y = banco.y;
        }
      });
    }

    const angle = Phaser.Math.DegToRad(this.joystick.angle)
    const force = this.joystick.force

    // Acha o aungulo mais próximo da direção do joystick
    let o = 0
    if (this.joystick.angle < 0) {
      o = (this.joystick.angle % 360 + 360) % 360;
    } else {
      o = this.joystick.angle
    }
    const closest = (arr, n) => arr.sort((a, b) => Math.abs(a - n) - Math.abs(b - n))[0];
    this.direcao = closest([0, 45, 90, 135, 180, 225, 270, 315, 360], o)

    if (angle != 0) {
      this.ultimoAngulo = angle
    }

    // Stamina recupera usando delta
    if ((this.personagemLocal.movimento == 'andando' && this.personagemLocal.stamina != 650)) {
      this.personagemLocal.stamina += 1 * norm;
      if (this.personagemLocal.stamina > 650) this.personagemLocal.stamina = 650;
      this.barraStamina.radius = this.personagemLocal.stamina / 50

    } else if (this.personagemLocal.stamina == 650) {
      this.personagemLocal.cansado = false
      this.barraStamina.setFillStyle(0x309a06)
      this.barraStamina.setAlpha(0)
      this.barraStaminaMeio.setAlpha(1)
      this.barraStaminaMeio.setFillStyle(0x309a06)

      if (this.barraStaminaFundo.radius >= this.barraStaminaMeio.radius + 1) {
        this.barraStaminaFundo.radius -= 0.4 * norm;
      }
    }

    this.lanternaRemota.setPosition(this.personagemRemoto.x, this.personagemRemoto.y + 15)
    this.lanternaRemota.setRotation(this.angleRemoto)
    this.lanternaLocal.setPosition(this.personagemLocal.x, this.personagemLocal.y + 15)
    this.lanternaLocal.setRotation(this.ultimoAngulo)

    let pathFinder = Phaser.Math.Angle.Between(this.ponteiro.x, this.ponteiro.y, this.personagemRemoto.x, this.personagemRemoto.y)
    this.ponteiro.setRotation(pathFinder)
    const indicadorX = Math.round(Math.cos(pathFinder) * 120)
    const indicadorY = Math.round(Math.sin(pathFinder) * 120)
    const dist = Phaser.Math.Distance.Between(
      this.ponteiro.x, this.ponteiro.y,
      this.personagemRemoto.x, this.personagemRemoto.y
    )
    const modDistancia = (dist / 30)
    this.ponteiro.setDisplaySize(80 - modDistancia, 64 - modDistancia)
    if (dist < 10) {
      this.ponteiro.setVelocity(0, 0);
    } else {
      this.ponteiro.setVelocity(indicadorX, indicadorY)
    }

    const cam = this.cameras.main;
    const left = cam.worldView.left;
    const top = cam.worldView.top;
    const right = cam.worldView.right;
    const bottom = cam.worldView.bottom;
    const remotoNaTela =
      this.personagemRemoto.x >= left &&
      this.personagemRemoto.x <= right &&
      this.personagemRemoto.y >= top &&
      this.personagemRemoto.y <= bottom;

    if (!remotoNaTela && !this.flagDentro && !this.personagemRemoto.estaDentro) {
      this.ponteiro.setVisible(true)
        .setActive(true)
    } else {
      this.ponteiro.setVisible(false)
        .setActive(false)
    }
    this.ponteiro.y = Phaser.Math.Clamp(this.ponteiro.y, top + 50, bottom - 50);
    this.ponteiro.x = Phaser.Math.Clamp(this.ponteiro.x, left + 50, right - 50);

    // Fantasma girando (usar delta)
    if (this.personagemLocal.texture.key == 'dan' && this.fantasma.atacando) {
      Phaser.Math.RotateAroundDistance(this.fantasma, this.personagemRemoto.x, this.personagemRemoto.y, this.fantasmaAngulo, this.fantasmaDistancia);
      this.fantasmaAngulo = Phaser.Math.Angle.Wrap(this.fantasmaAngulo + 0.00003 * norm);
      this.fantasmaDistancia -= 0.2 * norm;
      if (this.fantasmaDistancia < 5) {
        this.fantasma.atacando = false
        this.fantasma.emit('invisivel')
      }
    }

    if (this.personagemLocal.texture.key == 'ernesto') {
      const agora = this.time.now;
      const distancia = Phaser.Math.Distance.BetweenPoints(this.personagemLocal, this.fantasmaRemoto);
      if (this.fantasmaRemoto.visible &&
        distancia < 10 &&
        !this.invulneravel
      ) {
        this.vidas.emit('dano');
        this.invulneravel = true;
        this.tempoUltimoDano = agora;
      }
      if (this.invulneravel && agora - this.tempoUltimoDano > this.tempoInvulnerabilidade) {
        this.invulneravel = false;
      }
      if (this.fantasmaRemoto.visible && !this.fantasmaSom.isPlaying && !this.flagDentro) {
        this.fantasmaSom.play()
      }
    }

    if (((this.threshold < force) && (force <= 1000)) && (this.personagemLocalAcao != true)) {

      const velocityX = Math.round(Math.cos(angle) * this.speed)
      const velocityY = Math.round(Math.sin(angle) * this.speed)

      if (this.personagemLocal.cansado == false) {
        if (this.personagemLocal.movimento == 'correndo' && this.personagemLocal.stamina > 150) {
          this.personagemLocal.stamina -= 1 * norm;
          if (this.personagemLocal.stamina < 150) this.personagemLocal.stamina = 150;
          this.barraStamina.setAlpha(1)
          this.barraStaminaFundo.setAlpha(1)
          this.barraStaminaMeio.setAlpha(1)
          this.barraStaminaMeio.setFillStyle(0x000000)
          this.barraStamina.radius = this.personagemLocal.stamina / 50
          this.barraStaminaFundo.radius = this.personagemLocal.stamina / 50 +  2
        }
        else if (this.personagemLocal.stamina == 150) {
          this.personagemLocal.movimento = 'andando'
          this.personagemLocal.cansado = true
          this.barraStamina.setAlpha(1)
          this.barraStaminaFundo.setAlpha(1)
          this.barraStaminaMeio.setAlpha(1)
          this.barraStamina.setFillStyle(0x9a3706)
          this.speed = this.velocidade
        }
      }
      this.personagemLocal.setVelocity(velocityX, velocityY)
      this.cameras.main.followOffset.setTo(- velocityX, - velocityY)

      this.areaColeta.setPosition(this.personagemLocal.x, this.personagemLocal.y)

      this.imagemMascaraPersonagem.setPosition(this.personagemLocal.x, this.personagemLocal.y)
      this.imagemMascaraLanterna.setPosition(this.personagemLocal.x, this.personagemLocal.y + 15)
      this.imagemMascaraLanterna.setRotation(this.ultimoAngulo)

      this.barraStamina.setPosition(this.personagemLocal.x - ((Math.cos(angle) * 30)), this.personagemLocal.y + (Math.abs(Math.cos(angle) * 30)) - 70)
      this.barraStaminaFundo.setPosition(this.personagemLocal.x - ((Math.cos(angle) * 30)), this.personagemLocal.y + (Math.abs(Math.cos(angle) * 30)) - 70)
      this.barraStaminaMeio.setPosition(this.personagemLocal.x - ((Math.cos(angle) * 30)), this.personagemLocal.y + (Math.abs(Math.cos(angle) * 30)) - 70)

      let Modulado = Math.floor(Math.random() * (2200 - 0 + 1));
      this.passosSom.setDetune(Modulado)
      this.passosMadeiraSom.setDetune(Modulado)
      this.frameAtual = this.personagemLocal.anims.currentFrame.index;

      const pesNoChao = [4, 10]
      if (pesNoChao.includes(this.frameAtual) && this.personagemLocalAcao == false) {
        if (!this.flagDentro) {
          this.passosSom.play()
        } else {
          this.passosMadeiraSom.play()
        }
      }

      if (this.personagemLocal.texture.key == 'dan' && this.personagemLocal.movimento == 'correndo') {
        switch (this.direcao) {
          case 0:
            this.personagemLocal.anims.play('dan-correndo-direita', true)
            this.direcaoAtual = 'direita'
            break
          case 45:
            this.personagemLocal.anims.play('dan-correndo-baixo-direita', true)
            this.direcaoAtual = 'baixo-direita'
            break
          case 90:
            this.personagemLocal.anims.play('dan-correndo-baixo', true)
            this.direcaoAtual = 'baixo'
            break
          case 135:
            this.personagemLocal.anims.play('dan-correndo-baixo-esquerda', true)
            this.direcaoAtual = 'baixo-esquerda'
            break
          case 180:
            this.personagemLocal.anims.play('dan-correndo-esquerda', true)
            this.direcaoAtual = 'esquerda'
            break
          case 225:
            this.personagemLocal.anims.play('dan-correndo-cima-esquerda', true)
            this.direcaoAtual = 'cima-esquerda'
            break
          case 270:
            this.personagemLocal.anims.play('dan-correndo-cima', true)
            this.direcaoAtual = 'cima'
            break
          case 315:
            this.personagemLocal.anims.play('dan-correndo-cima-direita', true)
            this.direcaoAtual = 'cima-direita'
            break
          case 360:
            this.personagemLocal.anims.play('dan-correndo-direita', true)
            this.direcaoAtual = 'direita'
            break
        }
      } else {
        switch (this.direcao) {
          case 0:
            this.personagemLocal.anims.play('personagem-andando-direita', true)
            this.direcaoAtual = 'direita'
            break
          case 45:
            this.personagemLocal.anims.play('personagem-andando-baixo-direita', true)
            this.direcaoAtual = 'baixo-direita'
            break
          case 90:
            this.personagemLocal.anims.play('personagem-andando-baixo', true)
            this.direcaoAtual = 'baixo'
            break
          case 135:
            this.personagemLocal.anims.play('personagem-andando-baixo-esquerda', true)
            this.direcaoAtual = 'baixo-esquerda'
            break
          case 180:
            this.personagemLocal.anims.play('personagem-andando-esquerda', true)
            this.direcaoAtual = 'esquerda'
            break
          case 225:
            this.personagemLocal.anims.play('personagem-andando-cima-esquerda', true)
            this.direcaoAtual = 'cima-esquerda'
            break
          case 270:
            this.personagemLocal.anims.play('personagem-andando-cima', true)
            this.direcaoAtual = 'cima'
            break
          case 315:
            this.personagemLocal.anims.play('personagem-andando-cima-direita', true)
            this.direcaoAtual = 'cima-direita'
            break
          case 360:
            this.personagemLocal.anims.play('personagem-andando-direita', true)
            this.direcaoAtual = 'direita'
            break
        }
      }
    } else {
      if (this.personagemLocalAcao != true) {
        this.personagemLocal.setVelocity(0)
        this.personagemLocal.anims.play(`personagem-parado-${this.direcaoAtual}`, true)
      }
    }
    try {
      if (this.game.dadosJogo.readyState === "open") {
        if (this.personagemLocal && this.pistas) {
          this.game.dadosJogo.send(
            JSON.stringify({
              personagem: {
                x: this.personagemLocal.x,
                y: this.personagemLocal.y,
                frame: this.personagemLocal.frame.name,
                lanterna: this.ultimoAngulo,
                estaDentro: this.flagDentro,
                dentroTendaE: this.personagemLocal.dentroTendaE,
                dentroTendaD:  this.personagemLocal.dentroTendaD
              },
              particula: {
                x: this.particulaAcaoLocal.x,
                y: this.particulaAcaoLocal.y,
                frame: this.particulaAcaoLocal.frame.name,
                visivel: this.particulaAcaoLocal.visible
              },
              pistas: this.pistas.map(pista => ({ visible: pista.objeto.visible })),
              pistasEncontradas: this.pistasEncontradas
            })
          );
        }
        if (this.fantasma) {
          this.game.dadosJogo.send(
            JSON.stringify({
              fantasma:{
                x: this.fantasma.x,
                y: this.fantasma.y,
                visivel: this.fantasma.visivel,
                frame: this.fantasma.frame.name
              },
            })
          )
        }

        if (this.bancosContainers) {
          this.game.dadosJogo.send(
            JSON.stringify({
              bancos: this.bancosContainers.map(banco => ({
                x: banco.x,
                y: banco.y
              }))
            })
          )
        }
        if (this.fantGanhaPonto && this.fantPerdePonto) {
          this.game.dadosJogo.send(
            JSON.stringify({
              alvo: {
                correto:{
                  x: this.fantGanhaPonto.x,
                  y: this.fantGanhaPonto.y,
                  alpha: this.fantGanhaPonto.alpha
                },
                errado: {
                  x: this.fantPerdePonto.x,
                  y: this.fantPerdePonto.y,
                  alpha: this.fantPerdePonto.alpha
                }
              }
            })
          )
        }

        if (this.flagMorte) {
          this.game.dadosJogo.send(
            JSON.stringify({
              flagMorte: this.flagMorte
            })
          )
        }

        if (this.flagFinal) {
          this.game.dadosJogo.send(
            JSON.stringify({
              flagFinal: this.flagFinal
            })
          )
        }

        if (this.flagPegouPistas) {
          this.game.dadosJogo.send(
            JSON.stringify({
              flagPegouPistas: this.flagPegouPistas
            })
          )
        }

        if (this.chaveAzul.visible) {
          this.game.dadosJogo.send(
            JSON.stringify({
              chaveAzul: {
                visible: this.chaveAzul.visible,
                pega: this.chaveAzul.pega,
                fisica: this.chaveAzul.body.enable
              }
            })
          )
        }
        if (this.chaveVermelha) {
          this.game.dadosJogo.send(
            JSON.stringify({
              chaveVermelha: {
                visible: this.chaveVermelha.visible,
                pega: this.chaveVermelha.pega,
                fisica: this.chaveVermelha.body.enable
              }
            })
          )
        }
      }
    } catch (error) {
      console.error(error);
    }
    if (this.flagMorte == true) {
      this.sound.stopAll()
      this.scene.stop()
      this.scene.start('GameOver')
    }
    if (this.flagFinal && !this.flagPortaoAberto) {
      this.AbrindoPortao()
      this.flagPortaoAberto = true
    }
    if (this.flagPegouPistas && !this.flagTendaAberta) {
        this.AbrindoTendas()
        this.flagTendaAberta = true
    }

    if (this.personagemLocal.dentroTendaE && this.personagemRemoto.dentroTendaE && !this.entrouTendaE) {
      this.entradaTendaE.emit('triggerDialogoTendaE')
      this.entrouTendaE = true
    }
    if (this.personagemLocal.dentroTendaD && this.personagemRemoto.dentroTendaD && !this.entrouTendaD) {
      this.entradaTendaD.emit('triggerDialogoTendaD')
      this.entrouTendaD = true
    }
  }
}
