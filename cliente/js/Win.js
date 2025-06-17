/*global Phaser, axios*/
/*eslint no-undef: "error"*/
export default class Win extends Phaser.Scene {
  constructor () {
    super("Win");
  }

  preload () {
    this.load.image('final-feliz', 'assets/final-feliz.png')
  }

  create () {
    this.imagemFinal = this.add.image(0, 0, 'final-feliz')
    this.cameras.main.startFollow(this.imagemFinal)



    globalThis.google.accounts.id.initialize({
      client_id:
        "331191695151-ku8mdhd76pc2k36itas8lm722krn0u64.apps.googleusercontent.com",
      callback: (res) => {
        if (res.error) {
          console.error(res.error);
        } else {
          axios
            .post(
              "https://feira-de-jogos.dev.br/api/v2/credit",
              {
                product: 42, // id do jogo cadastrado no banco de dados da Feira de Jogos
                value: 1000, // crédito em tijolinhos
              },
              {
                headers: {
                  Authorization: `Bearer ${res.credential}`,
                },
              }
            )
            .then(function (response) {
              console.log(response);
            })
            .catch(function (error) {
              console.error(error);
            });
        }
      },
    });

    globalThis.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        globalThis.google.accounts.id.prompt();
      }
    });
  }
}