const nomeCapitulo = document.getElementById("capitulo");
const audio = document.getElementById("audio-capitulo");
const botaoPlayPause = document.getElementById("play-pause");
const botaoProximoCapitulo = document.getElementById("proximo");
const botaoCapituloAnterior = document.getElementById("anterior");
const barraProgresso = document.querySelector(".barra-progresso");
const progressoPreenchido = document.querySelector(".progresso-preenchido");
const tempoRestanteSpan = document.querySelector(".tempo-restante");

let arrastandoProgresso = false;

function atualizarBarraProgresso() {
  const porcentagem = (audio.currentTime / audio.duration) * 100;
  progressoPreenchido.style.width = `${porcentagem || 0}%`;

  // Atualiza tempo restante
  let tempoRestante = audio.duration - audio.currentTime;
  if (isNaN(tempoRestante) || tempoRestante < 0) tempoRestante = 0;
  tempoRestanteSpan.textContent = formatarTempo(tempoRestante);
}

function formatarTempo(segundos) {
  const min = Math.floor(segundos / 60);
  const sec = Math.floor(segundos % 60);
  return `${min.toString().padStart(2, "0")}:${sec
    .toString()
    .padStart(2, "0")}`;
}

audio.addEventListener("timeupdate", atualizarBarraProgresso);

function definirTempoAudio(event) {
  const rect = barraProgresso.getBoundingClientRect();
  const x = event.type.startsWith("touch")
    ? event.touches[0].clientX
    : event.clientX;
  const posicao = x - rect.left;
  const largura = rect.width;
  const porcentagem = Math.max(0, Math.min(1, posicao / largura));
  audio.currentTime = porcentagem * audio.duration;
}

barraProgresso.addEventListener("mousedown", (event) => {
  arrastandoProgresso = true;
  definirTempoAudio(event);
});

barraProgresso.addEventListener("mousemove", (event) => {
  if (arrastandoProgresso) {
    definirTempoAudio(event);
  }
});

document.addEventListener("mouseup", () => {
  arrastandoProgresso = false;
});

// Suporte a toque em dispositivos móveis
barraProgresso.addEventListener("touchstart", (event) => {
  arrastandoProgresso = true;
  definirTempoAudio(event);
});
barraProgresso.addEventListener("touchmove", (event) => {
  if (arrastandoProgresso) {
    definirTempoAudio(event);
  }
});
document.addEventListener("touchend", () => {
  arrastandoProgresso = false;
});

const quantidadeCapitulos = 10;

let taTocando = false;
let capitulo = 1;

function tocarFaixa() {
  audio.play();
  taTocando = true;
  botaoPlayPause.classList.add("tocando");
}

function pausarFaixa() {
  audio.pause();
  taTocando = false;
  botaoPlayPause.classList.remove("tocando");
}

function tocarOuPausarFaixa() {
  if (taTocando === true) {
    pausarFaixa();
  } else {
    tocarFaixa();
  }
}

function capituloAnterior() {
  pausarFaixa();

  if (capitulo === 1) {
    capitulo = quantidadeCapitulos;
  } else {
    capitulo -= 1;
  }

  audio.src = "/audios/" + capitulo + ".mp3";
  nomeCapitulo.innerText = "Capítulo " + capitulo;
  progressoPreenchido.style.width = "0%";
  tempoRestanteSpan.textContent = " ";
}

function proximoCapitulo() {
  pausarFaixa();

  if (capitulo < quantidadeCapitulos) {
    capitulo += 1;
  } else {
    capitulo = 1;
  }

  audio.src = "/audios/" + capitulo + ".mp3";
  nomeCapitulo.innerText = "Capítulo " + capitulo;
  progressoPreenchido.style.width = "0%";
  tempoRestanteSpan.textContent = " ";

  // Se chamado pelo evento 'ended', tocar automaticamente
  if (proximoCapitulo.chamadoPorEnded) {
    tocarFaixa();
    proximoCapitulo.chamadoPorEnded = false;
  }
}

botaoPlayPause.addEventListener("click", tocarOuPausarFaixa);
botaoCapituloAnterior.addEventListener("click", capituloAnterior);
botaoProximoCapitulo.addEventListener("click", proximoCapitulo);

audio.addEventListener("ended", function() {
  proximoCapitulo.chamadoPorEnded = true;
  proximoCapitulo();
});
