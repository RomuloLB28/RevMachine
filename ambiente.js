// Função para criar uma matriz NxN
function criarMatriz(n) {
    let matriz = [];
    for (let i = 0; i < n; i++) {
        matriz[i] = [];
        for (let j = 0; j < n; j++) {
            matriz[i][j] = ''; // Inicializa cada célula como vazia
        }
    }
    return matriz;
}

// Função para gerar posições aleatórias respeitando restrições
function gerarPosicaoValida(matriz, n, proibidos) {
    let x, y;
    do {
        x = Math.floor(Math.random() * n);
        y = Math.floor(Math.random() * n);
    } while (proibidos.some(p => p[0] === x && p[1] === y));
    return [x, y];
}

// Função para adicionar efeitos adjacentes (ruído e poeira)
function adicionarEfeitoAdjacente(matriz, x, y, efeito) {
    let direcoes = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (let [dx, dy] of direcoes) {
        let nx = x + dx, ny = y + dy;
        if (nx >= 0 && nx < matriz.length && ny >= 0 && ny < matriz.length) {
            if (!matriz[nx][ny].includes(efeito)) {
                matriz[nx][ny] += efeito;
            }
        }
    }
}

// Função para gerar o ambiente
function gerarAmbiente(n, qtdEscombrosPercent, qtdMaquinas, qtdCodigos) {
    let matriz = criarMatriz(n);
    let proibidos = [[0, 0]]; // A casa 0,0 está sempre proibida de ter objetos, mas pode ter percepções

    // Calcular a quantidade de escombros com base em 20% da matriz
    let qtdEscombros = Math.floor(n * n * qtdEscombrosPercent);

    // Adicionando Escombros (E)
    for (let i = 0; i < qtdEscombros; i++) {
        let [x, y] = gerarPosicaoValida(matriz, n, proibidos);
        matriz[x][y] = 'E';
        adicionarEfeitoAdjacente(matriz, x, y, 'P'); // Poeira
        proibidos.push([x, y]);
    }

    // Adicionando Máquina (M)
    for (let i = 0; i < qtdMaquinas; i++) {
        let [x, y] = gerarPosicaoValida(matriz, n, proibidos);
        matriz[x][y] = 'M';
        adicionarEfeitoAdjacente(matriz, x, y, 'R'); // Ruído
        proibidos.push([x, y]);
    }

    // Adicionando Código Secreto de Desativação (C) e Sinal (S)
    for (let i = 0; i < qtdCodigos; i++) {
        let [x, y] = gerarPosicaoValida(matriz, n, proibidos);
        matriz[x][y] = 'C';
        matriz[x][y] += 'S'; // Sinal na mesma posição do Código
        proibidos.push([x, y]);
    }

    return matriz;
}

function imprimirMatriz(matriz) {
    const divMatriz = document.getElementById('matriz');
    divMatriz.innerHTML = '';
    
    const n = matriz.length;
    divMatriz.style.gridTemplateColumns = `repeat(${n}, 50px)`;
    divMatriz.style.gridTemplateRows = `repeat(${n}, 50px)`;

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            const divCell = document.createElement('div');
            divCell.classList.add('cell');
            divCell.setAttribute('data-x', i);
            divCell.setAttribute('data-y', j);
            let conteudo = matriz[i][j];

            if (conteudo.includes('M')) {
                divCell.innerHTML += '<img src="images/roborev.png" alt="Máquina Assassina">';
            }
            if (conteudo.includes('E')) {
                divCell.innerHTML += '<img src="images/escombros.png" alt="Escombros">';
            }
            if (conteudo.includes('C')) {
                divCell.innerHTML += '<img src="images/secretcode.png" alt="Código de Desativação">';
            }
            if (conteudo.includes('S')) {
                divCell.innerHTML += '<img src="images/sinal.png" alt="Sinal de Rede">';
            }
            if (conteudo.includes('R')) {
                divCell.innerHTML += '<img src="images/ruido.png" alt="Ruído">';
            }
            if (conteudo.includes('P')) {
                divCell.innerHTML += '<img src="images/poeira.png" alt="Poeira">';
            }
            if (i === agente.x && j === agente.y) {
                divCell.innerHTML += '<img src="images/hacker.png" alt="Agente Hacker">';
                divCell.classList.add('agente');
            }
            
            divMatriz.appendChild(divCell);
        }
    }

    // Ajustar escala dinamicamente
    divMatriz.classList.remove('scale-small', 'scale-smaller');
    if (n > 10) {
        divMatriz.classList.add('scale-small');
    }
    if (n > 15) {
        divMatriz.classList.add('scale-smaller');
    }
}
