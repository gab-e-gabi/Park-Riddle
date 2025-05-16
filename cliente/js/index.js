import config from './config.js'
import abertura from './abertura.js'
import preload from './preload.js'
import sala from './sala.js'
import patio from './patio.js'
import Win from './Win.js'
import GameOver from './GameOver.js'

class Game extends Phaser.Game {
  constructor () {
    super(config)

    this.audio = document.querySelector("audio")

    this.iceServers = {
      iceServers: [
        {
        urls: "stun:stun.l.google.com:19302",
        }
      ],
    }

    this.socket = io();

    this.socket.on("connect", () => {
      console.log(`Usuário ${this.socket.id} conectado no servidor`)
    })

    this.scene.add('abertura', abertura)
    this.scene.add('preload', preload)
    this.scene.add('sala', sala)
    this.scene.add('patio', patio)
    this.scene.add('Win', Win)
    this.scene.add('GameOver', GameOver)
    this.scene.start('abertura')
  }
}



window.onload = () => {
  window.game = new Game()
}
