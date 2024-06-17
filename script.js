document.addEventListener('DOMContentLoaded', () => {
    // Array de imagens usadas no jogo
    const imgArray = [
        'image1', 'image2', 'image3', 'image4',
        'image5', 'image6', 'image7', 'image8',
        'image1', 'image2', 'image3', 'image4',
        'image5', 'image6', 'image7', 'image8'
    ];

    // Seleção de elementos do DOM
    const memoryGameContainer = document.getElementById('memory-game-container');
    const feedback = document.getElementById('feedback');
    const elapsedTime = document.getElementById('elapsed-time');
    const restartButton = document.getElementById('restart-game');
    const beginButton = document.getElementById('begin-game');
    const playerNameInput = document.getElementById('player-name');
    const leaderboard = document.getElementById('leaderboard');

    // Variáveis do jogo
    let card1, card2;
    let blockBoard = false;
    let matchedCards = 0;
    let gameTimer;
    let totalTime = 0;
    let leaderboardData = [];

    // Eventos de clique para iniciar e reiniciar o jogo
    beginButton.addEventListener('click', initiateGame);
    restartButton.addEventListener('click', initiateGame);

    // Função para iniciar o jogo
    function initiateGame() {
        // Verifica se o nome de usuário foi inserido
        if (playerNameInput.value.trim() === '') {
            alert('Por favor, insira seu nome!');
            return;
        }
        resetGame();
        shuffle(imgArray);
        generateBoard();
        startGameTimer();
    }

    // Função para resetar o jogo
    function resetGame() {
        clearInterval(gameTimer);
        totalTime = 0;
        elapsedTime.textContent = `Tempo: ${totalTime}s`;
        matchedCards = 0;
        card1 = null;
        card2 = null;
        blockBoard = false;
        feedback.textContent = '';
        memoryGameContainer.innerHTML = '';
    }

    // Função para iniciar o timer
    function startGameTimer() {
        gameTimer = setInterval(() => {
            totalTime++;
            elapsedTime.textContent = `Tempo: ${totalTime}s`;
        }, 1000);
    }

    // Função para embaralhar as cartas
    function shuffle(array) {
        array.sort(() => Math.random() - 0.5);
    }

    // Função para criar o tabuleiro do jogo
    function generateBoard() {
        imgArray.forEach(imageClass => {
            const card = document.createElement('div');
            card.classList.add('card', imageClass);
            card.innerHTML = `
                <div class="card-inner">
                    <div class="card-front">?</div>
                    <div class="card-back"></div>
                </div>
            `;
            card.addEventListener('click', flipCard);
            memoryGameContainer.appendChild(card);
        });
    }

    // Função para virar uma carta
    function flipCard() {
        if (blockBoard) return;
        if (this === card1) return;

        this.classList.add('flipped');

        if (!card1) {
            card1 = this;
            return;
        }

        card2 = this;
        validateMatch();
    }

    // Função para checar se as cartas combinam
    function validateMatch() {
        const isMatch = card1.className === card2.className;
        isMatch ? disableCards() : unflipCards();
    }

    // Função para desabilitar as cartas combinadas
    function disableCards() {
        card1.removeEventListener('click', flipCard);
        card2.removeEventListener('click', flipCard);
        matchedCards++;
        resetBoard();

        // Verifica se todas as cartas foram combinadas
        if (matchedCards === imgArray.length / 2) {
            clearInterval(gameTimer);
            feedback.textContent = `Parabéns, ${playerNameInput.value}! Você venceu em ${totalTime} segundos!`;
            updateLeaderboard(playerNameInput.value, totalTime);
        }
    }

    // Função para desvirar as cartas que não combinam
    function unflipCards() {
        blockBoard = true;
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            resetBoard();
        }, 900);
    }

    // Função para virar todas as cartas (usada na tecla 'P')
    function flipAllCards() {
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => card.classList.add('flipped'));
    }

    // Função para resetar o estado do tabuleiro
    function resetBoard() {
        [card1, card2] = [null, null];
        blockBoard = false;
    }

    // Função para atualizar o ranking
    function updateLeaderboard(player, time) {
        leaderboardData.push({ name: player, time: time });
        leaderboardData.sort((a, b) => a.time - b.time);
        displayLeaderboard();
    }

    // Função para exibir o ranking
    function displayLeaderboard() {
        leaderboard.innerHTML = '';
        leaderboardData.forEach((entry, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${entry.name} - ${entry.time} segundos`;
            leaderboard.appendChild(listItem);
        });
    }

    // Função para terminar o jogo e registrar a vitória
    function endGame() {
        clearInterval(gameTimer);
        matchedCards = imgArray.length / 2; // Simula que todos os pares foram encontrados
        feedback.textContent = `Parabéns, ${playerNameInput.value}! Você venceu o jogo em ${totalTime} segundos.`;
        updateLeaderboard(playerNameInput.value, totalTime);
    }

    // Evento de teclado para pressionar 'P' e vencer o jogo instantaneamente
    document.addEventListener('keydown', (event) => {
        if (event.key === 'p' || event.key === 'P') {
            if (playerNameInput.value.trim() !== '') {
                endGame();
                flipAllCards();
            } else {
                alert('Por favor, insira seu nome!');
            }
        }
    });
});
