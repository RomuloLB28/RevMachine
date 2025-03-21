let agente = {
    x: 0,
    y: 0,
    movimento: true,
    pausado: false,
    ambiente: [], // Armazena o ambiente
    intervalo: null, // Armazena o intervalo do movimento
    pontuacao: 0, // Pontuação inicial do agente
    codigoColetado: false, // Indica se o código foi coletado
    jogoAtivo: true, // Indica se o jogo está ativo
    balaDisponivel: true // Indica se o agente ainda pode atirar
};

let execucoes = 0; // Contador de execuções
let pontuacoes = []; // Armazena as pontuações de cada execução
let ambienteOriginal = null; // Armazena o ambiente original (com o monstro)

// Função para clonar o ambiente
function clonarAmbiente(ambiente) {
    return JSON.parse(JSON.stringify(ambiente)); // Cria uma cópia profunda do ambiente
}

// Função para iniciar o jogo
function iniciarJogo() {
    if (execucoes >= 10) {
        console.log("Todas as 10 execuções foram concluídas.");
        return; // Para de executar após 10 vezes
    }

    console.log(`Iniciando execução ${execucoes + 1}...`);

    // Gera o ambiente original apenas na primeira execução
    if (!ambienteOriginal) {
        const tamanho = parseInt(document.getElementById('tamanho').value);
        ambienteOriginal = gerarAmbiente(tamanho, 0.20, 1, 1); // 20% de escombros, 1 máquina assassina e 1 código de desativação
    }

    // Reinicia o ambiente para o estado original
    agente.ambiente = clonarAmbiente(ambienteOriginal); // Usa uma cópia do ambiente original
    agente.x = 0; // Posiciona o agente na célula (0,0)
    agente.y = 0;
    agente.pontuacao = 0; // Reinicia a pontuação
    agente.codigoColetado = false; // Reinicia o estado do código
    agente.jogoAtivo = true; // Reinicia o estado do jogo
    agente.balaDisponivel = true; // Reinicia a bala
    imprimirMatriz(agente.ambiente); // Exibe a matriz inicial
    agente.movimento = true; // Inicia o movimento do agente
    agente.pausado = false; // Garante que o jogo não esteja pausado
    iniciarMovimentoAleatorio(); // Inicia o movimento aleatório do agente
    atualizarPontuacao(); // Atualiza a exibição da pontuação
}

// Função para finalizar uma execução
function finalizarExecucao() {
    pontuacoes.push(agente.pontuacao); // Armazena a pontuação da execução atual
    atualizarTabelaPontuacoes(); // Atualiza a tabela de pontuações
    execucoes++; // Incrementa o contador de execuções

    if (execucoes < 3) {
        // Reinicia o jogo após 2 segundos
        setTimeout(() => {
            iniciarJogo();
        }, 2000);
    } else {
        console.log("Todas as execuções foram concluídas.");
    }
}

// Função para atualizar a tabela de pontuações
function atualizarTabelaPontuacoes() {
    const corpoTabela = document.getElementById('corpo-tabela');
    corpoTabela.innerHTML = ''; // Limpa a tabela

    pontuacoes.forEach((pontuacao, index) => {
        const linha = document.createElement('tr');
        linha.innerHTML = `
            <td>${index + 1}</td>
            <td>${pontuacao}</td>
        `;
        corpoTabela.appendChild(linha);
    });
}

// Função para pausar o jogo
function pausarJogo() {
    agente.pausado = true;
    console.log("Jogo pausado.");
    if (agente.intervalo) {
        clearInterval(agente.intervalo); // Para o intervalo de movimento
        agente.intervalo = null; // Limpa o intervalo
    }
}

// Função para retomar o jogo
function retomarJogo() {
    if (!agente.movimento || !agente.pausado) return;
    agente.pausado = false;
    console.log("Retomando o jogo...");
    iniciarMovimentoAleatorio(); // Reinicia o movimento aleatório
}

// Função para parar o jogo
function pararJogo() {
    agente.movimento = false;
    agente.pausado = false;
    agente.jogoAtivo = false; // Encerra o jogo
    console.log("Jogo parado.");
    if (agente.intervalo) {
        clearInterval(agente.intervalo); // Para o intervalo de movimento
        agente.intervalo = null; // Limpa o intervalo
    }
}

// Função para atirar no monstro
function atirarNoMonstro() {
    if (!agente.balaDisponivel) return; // Verifica se ainda há bala disponível

    const direcoes = ['up', 'down', 'left', 'right'];
    const direcaoEscolhida = direcoes[Math.floor(Math.random() * direcoes.length)];

    let tiroX = agente.x;
    let tiroY = agente.y;

    switch (direcaoEscolhida) {
        case 'up':
            tiroX = Math.max(0, agente.x - 1);
            break;
        case 'down':
            tiroX = Math.min(agente.ambiente.length - 1, agente.x + 1);
            break;
        case 'left':
            tiroY = Math.max(0, agente.y - 1);
            break;
        case 'right':
            tiroY = Math.min(agente.ambiente[0].length - 1, agente.y + 1);
            break;
    }

    // Verifica se o tiro acertou o monstro
    if (agente.ambiente[tiroX][tiroY].includes('M')) {
        alert("Você acertou o monstro! +500 pontos.");
        agente.pontuacao += 500; // Ganha 500 pontos por matar o monstro
        agente.ambiente[tiroX][tiroY] = agente.ambiente[tiroX][tiroY].replace('M', ''); // Remove o monstro
        imprimirMatriz(agente.ambiente); // Atualiza o tabuleiro
    } else {
        alert("Você errou o tiro! O monstro ainda está lá.");
    }

    agente.balaDisponivel = false; // O agente não pode mais atirar
}

// Função para movimentar aleatoriamente o agente
function moverAleatorio() {
    if (!agente.movimento || agente.pausado || !agente.jogoAtivo) return;

    // Direções possíveis (cima, baixo, esquerda, direita)
    const direcoes = ['up', 'down', 'left', 'right'];
    const direcaoEscolhida = direcoes[Math.floor(Math.random() * direcoes.length)];

    let novoX = agente.x;
    let novoY = agente.y;

    switch (direcaoEscolhida) {
        case 'up':
            novoX = Math.max(0, agente.x - 1); // Garante que o agente não saia da matriz
            break;
        case 'down':
            novoX = Math.min(agente.ambiente.length - 1, agente.x + 1); // Limita ao tamanho da matriz
            break;
        case 'left':
            novoY = Math.max(0, agente.y - 1); // Garante que o agente não saia da matriz
            break;
        case 'right':
            novoY = Math.min(agente.ambiente[0].length - 1, agente.y + 1); // Limita ao tamanho da matriz
            break;
    }

    // Remove o destaque da célula anterior
    const celulaAnterior = document.querySelector(`.cell[data-x="${agente.x}"][data-y="${agente.y}"]`);
    if (celulaAnterior) {
        celulaAnterior.classList.remove('agente');
        // Remove apenas a imagem do agente, mantendo as outras imagens
        const imagemAgente = celulaAnterior.querySelector('img[alt="Agente Hacker"]');
        if (imagemAgente) {
            celulaAnterior.removeChild(imagemAgente);
        }
    }

    // Atualiza a posição do agente
    agente.x = novoX;
    agente.y = novoY;

    // Verifica a célula atual e aplica as regras
    const conteudoCelula = agente.ambiente[novoX][novoY];
    if (conteudoCelula.includes('E')) {
        agente.pontuacao -= 10; // Perde 10 pontos por entrar em escombros
    }
    if (conteudoCelula.includes('M')) {
        agente.jogoAtivo = false; // Morre ao encontrar a máquina assassina
        alert("Você morreu! Fim de jogo.");
        finalizarExecucao(); // Finaliza a execução atual
        return;
    }
    if (conteudoCelula.includes('C') && !agente.codigoColetado) {
        agente.pontuacao += 2000; // Ganha 2000 pontos por coletar o código
        agente.codigoColetado = true; // Marca o código como coletado
    }
    if (agente.codigoColetado && novoX === 0 && novoY === 0) {
        agente.jogoAtivo = false; // Completa a missão ao voltar para (0, 0)
        alert("Missão cumprida! Você venceu!");
        finalizarExecucao(); // Finaliza a execução atual
        return;
    }
    if (conteudoCelula.includes('R') && agente.balaDisponivel) {
        atirarNoMonstro(); // Atira no monstro se sentir ruído e ainda tiver bala
    }

    // Atualiza a exibição da pontuação
    atualizarPontuacao();

    // Adiciona a imagem e o destaque na nova célula
    const novaCelula = document.querySelector(`.cell[data-x="${agente.x}"][data-y="${agente.y}"]`);
    if (novaCelula) {
        novaCelula.innerHTML += '<img src="images/hacker.png" alt="Agente Hacker">'; // Adiciona a imagem do agente
        novaCelula.classList.add('agente'); // Destaca a célula do agente
    }
}

// Função para iniciar o movimento aleatório do agente
function iniciarMovimentoAleatorio() {
    if (!agente.movimento || agente.pausado) return;
    console.log("Iniciando movimento aleatório...");
    if (agente.intervalo) {
        clearInterval(agente.intervalo); // Limpa qualquer intervalo anterior
    }
    agente.intervalo = setInterval(moverAleatorio, 50); // Movimento a cada 500ms(0,5s) (super rápido)
}

// Função para atualizar a pontuação na tela
function atualizarPontuacao() {
    const elementoPontuacao = document.getElementById('pontuacao');
    if (elementoPontuacao) {
        elementoPontuacao.textContent = `Pontuação: ${agente.pontuacao}`;
    }
}

// Adicionando os eventos para os botões
document.getElementById('gerarAmbiente').addEventListener('click', () => {
    execucoes = 0; // Reinicia o contador de execuções
    pontuacoes = []; // Limpa o array de pontuações
    ambienteOriginal = null; // Reseta o ambiente original
    iniciarJogo(); // Inicia a primeira execução
});
document.getElementById('pausar').addEventListener('click', function () {
    const botaoPausar = document.getElementById('pausar');

    if (agente.pausado) {
        retomarJogo(); // Se estiver pausado, retoma
        botaoPausar.textContent = "Pausar"; // Altera o nome do botão de volta para "Pausar"
    } else {
        pausarJogo(); // Se estiver em execução, pausa
        botaoPausar.textContent = "Pausado"; // Altera o nome do botão para "Pausado"
    }
});

document.getElementById('parar').addEventListener('click', pararJogo);