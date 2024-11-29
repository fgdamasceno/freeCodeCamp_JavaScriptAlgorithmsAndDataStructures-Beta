// Seleciona todos os elementos com a classe 'die' (dados)
const listOfAllDice = document.querySelectorAll(".die");
// Seleciona todos os inputs de opções de pontuação
const scoreInputs = document.querySelectorAll("#score-options input");
// Seleciona todos os spans de opções de pontuação
const scoreSpans = document.querySelectorAll("#score-options span");
// Seleciona o elemento que mostra a rodada atual
const roundElement = document.getElementById("current-round");
// Seleciona o elemento que mostra o número de lançamentos restantes
const rollsElement = document.getElementById("current-round-rolls");
// Seleciona o elemento que mostra a pontuação total
const totalScoreElement = document.getElementById("total-score");
// Seleciona o elemento que contém o histórico de pontuação
const scoreHistory = document.getElementById("score-history");
// Seleciona o botão para rolar os dados
const rollDiceBtn = document.getElementById("roll-dice-btn");
// Seleciona o botão para manter a pontuação
const keepScoreBtn = document.getElementById("keep-score-btn");
// Seleciona o container que contém as regras
const rulesContainer = document.querySelector(".rules-container");
// Seleciona o botão que mostra/oculta as regras
const rulesBtn = document.getElementById("rules-btn");

// Inicializa variáveis para armazenar o valor dos dados, estado do modal, pontuação, rodada e lançamentos
let diceValuesArr = [];
let isModalShowing = false;
let score = 0;
let round = 1;
let rolls = 0;

// Função para rolar os dados e atualizar o array 'diceValuesArr'
const rollDice = () => {
  diceValuesArr = [];

  // Gera 5 valores aleatórios para os dados (entre 1 e 6)
  for (let i = 0; i < 5; i++) {
    const randomDice = Math.floor(Math.random() * 6) + 1;
    diceValuesArr.push(randomDice);
  }

  // Atualiza o conteúdo dos dados na tela
  listOfAllDice.forEach((dice, index) => {
    dice.textContent = diceValuesArr[index];
  });
};

// Função para atualizar as estatísticas da rodada e lançamentos
const updateStats = () => {
  rollsElement.textContent = rolls;
  roundElement.textContent = round;
};

// Função para habilitar e atualizar a opção de pontuação no rádio
const updateRadioOption = (index, score) => {
  scoreInputs[index].disabled = false;
  scoreInputs[index].value = score;
  scoreSpans[index].textContent = `, score = ${score}`;
};

// Função para atualizar a pontuação total e o histórico de pontuação
const updateScore = (selectedValue, achieved) => {
  score += parseInt(selectedValue);
  totalScoreElement.textContent = score;

  // Adiciona o novo valor no histórico de pontuação
  scoreHistory.innerHTML += `<li>${achieved} : ${selectedValue}</li>`;
};

// Função para identificar os maiores conjuntos de dados iguais
const getHighestDuplicates = (arr) => {
  const counts = {};

  // Conta as ocorrências de cada número no array
  for (const num of arr) {
    if (counts[num]) {
      counts[num]++;
    } else {
      counts[num] = 1;
    }
  }

  let highestCount = 0;

  // Verifica se há duplicatas de 3 ou mais
  for (const num of arr) {
    const count = counts[num];
    if (count >= 3 && count > highestCount) {
      highestCount = count;
    }
    if (count >= 4 && count > highestCount) {
      highestCount = count;
    }
  }

  // Calcula a soma de todos os dados
  const sumOfAllDice = arr.reduce((a, b) => a + b, 0);

  // Atualiza as opções de pontuação conforme as duplicatas encontradas
  if (highestCount >= 4) {
    updateRadioOption(1, sumOfAllDice);
  }

  if (highestCount >= 3) {
    updateRadioOption(0, sumOfAllDice);
  }

  // Reinicia a opção de pontuação "5"
  updateRadioOption(5, 0);
};

// Função para verificar se há um Full House (uma trinca e um par)
const detectFullHouse = (arr) => {
  const counts = {};

  // Conta as ocorrências de cada número no array
  for (const num of arr) {
    counts[num] = counts[num] ? counts[num] + 1 : 1;
  }

  // Verifica se há uma trinca e um par
  const hasThreeOfAKind = Object.values(counts).includes(3);
  const hasPair = Object.values(counts).includes(2);

  // Se houver Full House, atualiza a opção de pontuação
  if (hasThreeOfAKind && hasPair) {
    updateRadioOption(2, 25);
  }

  // Reinicia a opção de pontuação "5"
  updateRadioOption(5, 0);
};

// Função para resetar todas as opções de rádio
const resetRadioOptions = () => {
  scoreInputs.forEach((input) => {
    input.disabled = true;
    input.checked = false;
  });

  scoreSpans.forEach((span) => {
    span.textContent = "";
  });
};

// Função para reiniciar o jogo
const resetGame = () => {
  diceValuesArr = [0, 0, 0, 0, 0];
  score = 0;
  round = 1;
  rolls = 0;

  // Atualiza os valores dos dados na tela
  listOfAllDice.forEach((dice, index) => {
    dice.textContent = diceValuesArr[index];
  });

  // Reseta a pontuação total e o histórico
  totalScoreElement.textContent = score;
  scoreHistory.innerHTML = "";

  // Reseta as estatísticas de rodada e lançamentos
  rollsElement.textContent = rolls;
  roundElement.textContent = round;

  resetRadioOptions();
};

// Função para verificar a presença de sequências
const checkForStraights = (arr) => {
  const counts = {};

  // Conta as ocorrências de cada número no array
  for (const num of arr) {
    counts[num] = counts[num] ? counts[num] + 1 : 1;
  }

  // Junta as chaves (números) em uma string para verificar sequências
  const keys = Object.keys(counts).join("");

  // Verifica se há uma grande sequência (1-5 ou 2-6)
  if (keys === "12345" || keys === "23456") {
    updateRadioOption(4, 40);
  }

  // Verifica se há uma pequena sequência (4 números consecutivos)
  if (keys.includes("1234") || keys.includes("2345") || keys.includes("3456")) {
    updateRadioOption(3, 30); // Atualiza a opção de rádio 3 com pontuação 30 para pequena sequência
  }

  // Reinicia a opção de pontuação "5"
  updateRadioOption(5, 0);
};

// Evento para rolar os dados ao clicar no botão
rollDiceBtn.addEventListener("click", () => {
  if (rolls === 3) {
    alert("You have made three rolls this round. Please select a score.");
  } else {
    rolls++;
    resetRadioOptions();
    rollDice();
    updateStats();
    getHighestDuplicates(diceValuesArr);
    detectFullHouse(diceValuesArr);
  }
});

// Evento para mostrar ou esconder as regras ao clicar no botão
rulesBtn.addEventListener("click", () => {
  isModalShowing = !isModalShowing;

  if (isModalShowing) {
    rulesBtn.textContent = "Hide rules";
    rulesContainer.style.display = "block";
  } else {
    rulesBtn.textContent = "Show rules";
    rulesContainer.style.display = "none";
  }
});

// Evento para manter a pontuação ao clicar no botão
keepScoreBtn.addEventListener("click", () => {
  let selectedValue;
  let achieved;

  // Verifica qual opção de pontuação foi selecionada
  for (const radioButton of scoreInputs) {
    if (radioButton.checked) {
      selectedValue = radioButton.value;
      achieved = radioButton.id;
      break;
    }
  }

  // Se uma opção for selecionada, atualiza o jogo
  if (selectedValue) {
    rolls = 0;
    round++;
    updateStats();
    resetRadioOptions();
    updateScore(selectedValue, achieved);
    if (round > 6) {
      setTimeout(() => {
        alert(`Game Over! Your total score is ${score}`);
        resetGame();
      }, 500);
    }
  } else {
    alert("Please select an option or roll the dice");
  }
});
