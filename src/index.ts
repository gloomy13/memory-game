class GameState {
    pairs: Pair[];

    constructor() {
        this.pairs = this.generatePairs(16);
        this.init();
    }

    init() {
        document.addEventListener("DOMContentLoaded", () => this.renderCards());
        document.addEventListener("DOMContentLoaded", hookFunctions);
    }

    generatePairs(cardsCount: number) {
        const columnsRowsCount: number = Math.sqrt(cardsCount);
        const pairsCount: number = cardsCount / 2;

        let availablePositions: Position[] =
            this.generateAllPossiblePositions(columnsRowsCount);

        let pairs: Pair[] = [];

        for (let i = 0; i < pairsCount; i++) {
            const card1Position: Position =
                this.generateCardPosition(availablePositions);
            const card1: Card = new Card(card1Position);

            availablePositions = removeElementFromPositionsArray(
                card1Position,
                availablePositions
            );

            const card2Position: Position =
                this.generateCardPosition(availablePositions);
            const card2: Card = new Card(card2Position);

            availablePositions = removeElementFromPositionsArray(
                card2Position,
                availablePositions
            );

            pairs.push(new Pair(card1, card2));
        }

        return pairs;
    }

    generateAllPossiblePositions(coulumnsCount: number): Position[] {
        let positions: Position[] = [];

        for (let x = 0; x < coulumnsCount; x++) {
            for (let y = 0; y < coulumnsCount; y++) {
                positions.push({ x, y });
            }
        }

        return positions;
    }

    generateCardPosition(availablePositions: Position[]): Position {
        let randomIndex = Math.floor(Math.random() * availablePositions.length);

        return availablePositions[randomIndex];
    }

    renderCards() {
        const container = document.querySelector(".cards-container");

        if (container != undefined) {
            const columnsCount = Math.sqrt(this.pairs.length * 2);
            for (let i = 0; i < this.pairs.length * 2; i++) {
                let column = Math.floor(i / columnsCount) + 1;
                let row = (i % columnsCount) + 1;
                container.innerHTML += `<div class="card w-32 h-32 flex m-auto items-center justify-center border border-black rounded cursor-pointer col-start-${column} row-start-${row}"><div>T</div></div>`;
            }
        }
    }
}
// TODO function revealFirstCard
// TODO function revealSecondCard

function hookFunctions() {
    document.querySelectorAll(".card").forEach((card) => {
        card.addEventListener("click", cardClicked);
    });
}

function cardClicked() {
    // TODO is back? is front? is first? is second?
    console.log('test');
}

/**
 * Function returns reduced array.
 *
 * @param value: number
 * @param array: number[]
 *
 * @return number[]
 */
function removeElementFromPositionsArray(
    position: Position,
    array: Position[]
): Position[] {
    const index = array.findIndex(
        (pos) => pos.x === position.x && pos.y === position.y
    );

    if (index !== -1) {
        array.splice(index, 1);
    }

    return array;
}

class Pair {
    cards: [Card, Card];

    constructor(card1: Card, card2: Card) {
        this.cards = [card1, card2];

        card1.pair = this;
        card2.pair = this;
    }
}

class Card {
    position: Position;
    pair?: Pair;

    constructor(position: Position) {
        this.position = position;
    }
}

interface Position {
    x: number;
    y: number;
}

const gameState = new GameState();
