document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const restartButton = document.getElementById('restart-button');
    const statusMessage = document.getElementById('status-message');

    const cardData = [
        { name: 'Fusible', image: 'images/fusible.png' },
        { name: 'Contacto NO', image: 'images/contacto_no.png' },
        { name: 'Conector', image: 'images/conector.png' },
        { name: 'Motor Trifásico', image: 'images/motor_trifasico.png' },
        { name: 'Contacto NA', image: 'images/contacto_na.png' },
        { name: 'Sensor Proximidad', image: 'images/sensor_proximidad.png' },
        { name: 'Lámpara', image: 'images/lampara.png' },
        { name: 'Resistencia', image: 'images/resistencia.png' },
        { name: 'Diodo', image: 'images/diodo.png' },
        { name: 'Contacto NC', image: 'images/contacto_nc.png' },
    ];

    let cards = [];
    let flippedCards = [];
    let matchedCards = 0;
    let lockBoard = false;

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function createBoard() {
        gameBoard.innerHTML = '';
        statusMessage.textContent = '';
        flippedCards = [];
        matchedCards = 0;
        lockBoard = false;

        const gameCards = [];
        cardData.forEach((item, index) => {
            // Tarjeta de símbolo
            gameCards.push({ id: `symbol-${index}`, type: 'symbol', value: item.name, content: `<img src="${item.image}" alt="${item.name}">` });
            // Tarjeta de nombre
            gameCards.push({ id: `name-${index}`, type: 'name', value: item.name, content: item.name });
        });

        const shuffledCards = shuffle(gameCards);

        shuffledCards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.dataset.value = card.value;
            cardElement.dataset.id = card.id;

            cardElement.innerHTML = `
                <div class="card-inner">
                    <div class="card-face card-front">?</div>
                    <div class="card-face card-back">${card.content}</div>
                </div>
            `;
            cardElement.addEventListener('click', flipCard);
            gameBoard.appendChild(cardElement);
        });
        cards = Array.from(document.querySelectorAll('.card'));
    }

    function flipCard() {
        if (lockBoard) return;
        if (this === flippedCards[0]) return; // Evita hacer clic en la misma tarjeta dos veces

        this.classList.add('flipped');
        flippedCards.push(this);

        if (flippedCards.length === 2) {
            lockBoard = true;
            checkForMatch();
        }
    }

    function checkForMatch() {
        const [card1, card2] = flippedCards;
        const isMatch = card1.dataset.value === card2.dataset.value;

        if (isMatch) {
            disableCards();
        } else {
            unflipCards();
        }
    }

    function disableCards() {
        flippedCards[0].classList.add('matched');
        flippedCards[1].classList.add('matched');
        flippedCards[0].removeEventListener('click', flipCard);
        flippedCards[1].removeEventListener('click', flipCard);

        matchedCards += 2;
        resetBoard();

        if (matchedCards === cards.length) {
            statusMessage.textContent = '¡Felicidades, has encontrado todos los pares!';
        }
    }

    function unflipCards() {
        setTimeout(() => {
            flippedCards[0].classList.remove('flipped');
            flippedCards[1].classList.remove('flipped');
            resetBoard();
        }, 1000);
    }

    function resetBoard() {
        [flippedCards, lockBoard] = [[], false];
    }

    restartButton.addEventListener('click', createBoard);

    createBoard();
});