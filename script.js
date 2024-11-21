//variaveis
// --------------------------------------------------------------------------------------------

// variaveis para as opções [foco-curto-longo]
const appCardBt = document.querySelectorAll('.app__card-button');
const html = document.querySelector('html'); //para ser possível alterar o atributo data-contexto : <html lang="pt-br" data-contexto="foco">
const focoBt = document.querySelector('.app__card-button--foco');
const longoBt = document.querySelector('.app__card-button--longo');
const curtoBt = document.querySelector('.app__card-button--curto');
const atributoPersonalizado = 'data-contexto';
const banner = document.querySelector('.app__image');
const titulo = document.querySelector('.app__title');
let opcaoAtual = "foco";

let textoOpcao = {
    'foco': 'Otimize sua produtividade,<br> <strong class="app__title-strong">mergulhe no que importa.</strong>',
    'descanso-curto': 'Que tal dar uma respirada?<br> <strong class="app__title-strong">Faça uma pausa curta.</strong>',
    'descanso-longo': 'Hora de voltar à superfície.<br> <strong class="app__title-strong">Faça uma pausa longa.</strong>'
};



//variaveis para o botão start-pause
const startPauseBt = document.querySelector('#start-pause'); //botao comecar-parar
const span = document.querySelector('#start-pause span'); //texto comecar-parar
const iconeStartPause = document.querySelector('.app__card-primary-butto-icon'); ////icone comecar-parar
let cronometroLIgado = false;
const startMusic = new Audio('/sons/play.wav');
const pauseMusic = new Audio('/sons/pause.mp3');
const beepMusic = new Audio('/sons/beep.mp3');





//variaveis para input de musica
const musicaFocoInput = document.querySelector('#alternar-musica');
//musica vai ser uma variavel referencia ao objeto audio que é a musica, ou seja, a variavel musica vai receber a musica luna-rise
//por meio do objeto Audio[new Audio('caminho/do/arquivo')] é possível manipular uma musica, por exemplo, configurar o volume dela
const musica = new Audio('/sons/luna-rise-part-one.mp3');



//variaveis temporizador

// Temporizador de foco com valor 1500;
// Temporizador de descanso curso com valor 300;
// Temporizador de descanso longo com valor 900.
const duracaoFoco = 1500;
const duracaoDescansoCurto = 300;
const duracaoDescansoLongo = 900;
const tempoTotal = 30;
let tempoDecorridoSegundos = 0;
let timer = null;
const tempoNaTela = document.querySelector('#timer'); //tempo do timer (ex: 25:00)



//funcoes
// --------------------------------------------------------------------------------------------


//funcoes de update

//será utilizado quando for necessario saber a opção que está selecionada atualmente
//ex: ao clicar na opcao [descanso-logo] essa funcao será chamada
function updateTempoDecorrido() {

    if (opcaoAtual === "foco") {
        tempoDecorridoSegundos = duracaoFoco;
    } else if (opcaoAtual === "curto") {
        tempoDecorridoSegundos = duracaoDescansoCurto;
    } else {
        tempoDecorridoSegundos = duracaoDescansoLongo;
    }

}


function updateInterface() {

    beepMusic.pause();

    updateTempoDecorrido();

    if(getCronometroLigado()) {
        pauseMusic.play();
    }

    setCronometroLigado(false);

    displayTimerOff();

    zerarTimer();

    displayScreenTime();


}






//funcoes para as opções [foco-curto-longo]

//remove a classe active de todos os botoes com a classe .app__card-button
function removerActive() {
    appCardBt.forEach(function (item, index) {
        item.classList.remove('active');
    });
}



//funcoes para o botao start-pause


function setCronometroLigado(state) {

    if (typeof state === 'undefined') {
        throw new Error('state should be declared');
    }

    cronometroLIgado = state;

    console.log("cronometroLIgado=" + cronometroLIgado);
    
}


function getCronometroLigado() {

    return cronometroLIgado;

}



function displayTimerOff() {

    //alterar icone
    iconeStartPause.setAttribute('src', '/imagens/play_arrow.png')

    //alterar texto
    span.textContent = 'Começar'; //text content é ideal para inserir texto, quando eu quiser inseir tag, ai uso o innerHTML


}

function displayTimerOn() {

    //alterar icone
    iconeStartPause.setAttribute('src', '/imagens/pause.png')

    //alterar texto
    span.textContent = 'Parar';
}

function displayScreenTime() {
    const tempo = new Date(tempoDecorridoSegundos * 1000); //tempoDecorridoMilisegundos = tempoDecorridoSegundos * 1000
    const tempoFormatado = tempo.toLocaleTimeString('pt-br', {minute: '2-digit', second: '2-digit'}); //00:00
    tempoNaTela.innerHTML = `${tempoFormatado}`;
}

function contagemTempo() {
    tempoDecorridoSegundos -= 1;
    console.log("tempo restante: " + tempoDecorridoSegundos);
    displayScreenTime();
    if (tempoDecorridoSegundos <= 0) {
        zerarTimer();
        beepMusic.play();
        return;
    }
}

function iniciarTimer() {
    timer = setInterval(contagemTempo, 1000); //timer recebe o identificador de setInterval()
}

function zerarTimer() {
    clearInterval(timer);
    timer = null;
}



//---------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------
//estado inicial da página


//opções [foco-curto-longo]
focoBt.classList.add('active');


//tempo incial
tempoDecorridoSegundos = duracaoFoco;


//---------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------








//acoes da pagina
// --------------------------------------------------------------------------------------------



//acao ao clicar em umas das opcoes [foco, curto, longo]
appCardBt.forEach(function (item, index) {

    item.addEventListener('click', () => {

        //pega o valor no indice 1 ex: ['app__card-button', 'curto']
        let opcaoValue = `${item.classList[1].split('--')[1]}`;

        opcaoAtual = opcaoValue;

        updateInterface();

        //bt = recebe o botao clicado pelo usuario
        const bt = document.querySelector('.app__card-button--' + opcaoValue);;

        if (opcaoValue != 'foco') {
            opcaoValue = 'descanso-' + opcaoValue;
        }

        titulo.innerHTML = textoOpcao[opcaoValue];

        html.setAttribute(atributoPersonalizado, opcaoValue);
        banner.setAttribute('src', '/imagens/' + opcaoValue + '.png');

        displayTimerOff();

        removerActive();
        bt.classList.add('active');


    })
});



// inicar ou pausar cronometro

startPauseBt.addEventListener('click', () => {

    if (tempoDecorridoSegundos === 0) {
        updateTempoDecorrido();
    }


    //pause
    if (cronometroLIgado) {

        pauseMusic.play(); //toca o som de pausa

        beepMusic.pause();

        setCronometroLigado(false);

        displayTimerOff();

        zerarTimer();


    //start
    } else {

        startMusic.play(); //toca o som de inciar

        setCronometroLigado(true);

        displayTimerOn();

        iniciarTimer();

    };


});



//iniciar ou parar audio

musica.loop = true; //vai fazer a musica(que é uma referencia a um objeto, não é apenas uma variável) tocar de forma infinita

//change =  para quando houver uma mudança no checkbox
musicaFocoInput.addEventListener('change', () => {
    if (musica.paused) {
        musica.play();
    } else {
        musica.pause();
    }
})

