// Recupera as apostas armazenadas no localStorage (caso existam) ou cria um objeto vazio
const apostas = JSON.parse(localStorage.getItem("apostas")) || {};

// Mapeia os números dos cavalos para nomes personalizados
const nomesCavalos = {
  1: "Relâmpago",
  2: "Trovão",
  3: "Veloz",
  4: "Pegasus",
  5: "Tempestade"
};

// Referências aos campos e elementos HTML
const inCavalo = document.getElementById("inCavalo");
const inValor = document.getElementById("inValor");
const outCavalo = document.getElementById("outCavalo");
const preResumo = document.querySelector("pre");

const btApostar = document.getElementById("btApostar");
const btResumo = document.getElementById("btResumo");
const btGanhador = document.getElementById("btGanhador");
const btNovo = document.getElementById("btNovo");

// Carrega sons para feedback sonoro nas ações do usuário
const somClick = new Audio("https://www.soundjay.com/button/beep-07.wav");
const somWin = new Audio("https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3");

// Salva o objeto de apostas no localStorage (persistência local)
function salvarApostas() {
  localStorage.setItem("apostas", JSON.stringify(apostas));
}

// Exibe o ranking visual com barras de progresso
function exibirRanking() {
  let rankingHTML = "<h4>Ranking Visual:</h4>";
  let total = Object.values(apostas).reduce((acc, val) => acc + val, 0); // Soma total de apostas

  for (let numero in apostas) {
    let nome = nomesCavalos[numero] || `Cavalo ${numero}`;
    let valor = apostas[numero];
    let largura = (valor / total) * 100; // Proporção da barra em relação ao total

    rankingHTML += `
      <div>${nome} (R$ ${valor.toFixed(2)})</div>
      <div style="background-color:#007bff; height:20px; width:${largura}%; margin-bottom:10px;"></div>
    `;
  }

  // Insere o HTML gerado dentro da div com id="ranking"
  document.getElementById("ranking").innerHTML = rankingHTML;
}

// Evento para registrar uma nova aposta
btApostar.addEventListener("click", function (event) {
  event.preventDefault(); // Impede o envio do formulário
  somClick.play(); // Toca som de clique

  // Converte valores de entrada para número
  const numero = Number(inCavalo.value);
  const valor = Number(inValor.value);

  // Validações
  if (!numero || numero < 1 || !valor || valor <= 0) {
    alert("Digite dados válidos.");
    return;
  }

  // Atualiza ou cria a entrada de aposta para o cavalo escolhido
  apostas[numero] = (apostas[numero] || 0) + valor;
  salvarApostas(); // Salva no localStorage

  // Mostra na tela o cavalo que recebeu a aposta
  let nome = nomesCavalos[numero] || `Cavalo ${numero}`;
  outCavalo.textContent = `${nome} recebeu R$ ${valor.toFixed(2)}.`;

  // Limpa os campos de entrada e foca novamente no campo de cavalo
  inCavalo.value = "";
  inValor.value = "";
  inCavalo.focus();
});

// Evento para exibir o resumo das apostas em formato de texto
btResumo.addEventListener("click", function () {
  if (Object.keys(apostas).length === 0) {
    preResumo.textContent = "Nenhuma aposta.";
    return;
  }

  let texto = "Resumo:\n";
  for (let numero in apostas) {
    let nome = nomesCavalos[numero] || `Cavalo ${numero}`;
    texto += `${nome} - R$ ${apostas[numero].toFixed(2)}\n`;
  }

  preResumo.textContent = texto;
  exibirRanking(); // Exibe o ranking visual também
});

// Evento para sortear o cavalo ganhador aleatoriamente
btGanhador.addEventListener("click", function () {
  const cavalos = Object.keys(apostas); // Lista os cavalos que receberam apostas

  if (cavalos.length === 0) {
    preResumo.textContent = "Sem apostas para sortear.";
    return;
  }

  // Sorteia um índice aleatório baseado no número de cavalos com aposta
  const indice = Math.floor(Math.random() * cavalos.length);
  const cavalo = cavalos[indice];
  const nome = nomesCavalos[cavalo] || `Cavalo ${cavalo}`;
  const valor = apostas[cavalo];

  somWin.play(); // Som de vitória

  // Exibe o vencedor e o valor total apostado nele
  preResumo.innerHTML =
    `<h4>🏆 Vencedor: ${nome}</h4>` +
    `<p>Total apostado: R$ ${valor.toFixed(2)}</p>`;

  exibirRanking(); // Atualiza o ranking visual
});

// Evento para reiniciar a corrida e limpar todas as apostas
btNovo.addEventListener("click", function () {
  if (confirm("Deseja reiniciar todas as apostas?")) {
    // Limpa o objeto de apostas
    for (let cavalo in apostas) delete apostas[cavalo];
    salvarApostas(); // Atualiza localStorage

    // Limpa os campos e saídas visuais
    outCavalo.textContent = "";
    preResumo.textContent = "";
    document.getElementById("ranking").innerHTML = ""; // Limpa o ranking também
    inCavalo.value = "";
    inValor.value = "";
    inCavalo.focus();
  }
});
