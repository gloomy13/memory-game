class GameState {
    //pairs: Pair[];
    cardMap?: Record<string, Card>;

    constructor() {
        // this.pairs = this.generatePairs(16);
        this.cardMap = this.generateCards(16);
        if (this.cardMap) {
            console.log(this.cardMap);
        }
        this.init();
    }

    init() {
        document.addEventListener("DOMContentLoaded", () => this.renderCards());
        document.addEventListener("DOMContentLoaded", hookFunctions);
    }

    generateCards(cardsCount: number): Record<string, Card> {
        let cardMap: Record<string, Card> = {};
        const columnsRowsCount: number = Math.sqrt(cardsCount);
        const pairsCount: number = cardsCount / 2;

        let availablePositions: Position[] =
            this.generateAllPossiblePositions(columnsRowsCount);

        //let pairs: Pair[] = [];

        for (let i = 0; i < pairsCount; i++) {
            const card1Position: Position =
                this.generateCardPosition(availablePositions);
            const card1: Card = new Card(card1Position);

            cardMap[JSON.stringify(card1Position)] = card1;

            availablePositions = removeElementFromPositionsArray(
                card1Position,
                availablePositions
            );

            const card2Position: Position =
                this.generateCardPosition(availablePositions);
            const card2: Card = new Card(card2Position);

            cardMap[JSON.stringify(card2Position)] = card2;
            
            availablePositions = removeElementFromPositionsArray(
                card2Position,
                availablePositions
            );

            // establish connection
            new Pair(card1, card2, i);
        }

        return cardMap;
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
            const cardCount = Object.keys(this.cardMap ?? {}).length;
            const columnsCount = Math.sqrt(cardCount);
            for (let i = 0; i < cardCount; i++) {
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

function cardClicked(e: Event) {
    // TODO is back? is front? is first? is second?
    const targetCardElement: HTMLElement = e.target as HTMLElement;
    console.log('card clicked');
    revealACard(targetCardElement);
}

function revealACard() {
    console.log(this);    
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
    content: number;

    constructor(card1: Card, card2: Card, content: number) {
        this.cards = [card1, card2];

        card1.pair = this;
        card2.pair = this;

        this.content = content;
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
