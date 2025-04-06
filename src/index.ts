type CardMap = Record<string, Card>;
class GameState {
    constructor() {
        const cardMap: CardMap = this.generateCards(16);

        if (cardMap) {
            const gameEvents = new GameEvents(cardMap);
        }
    }

    generateCards(cardsCount: number): CardMap {
        let cardMap: CardMap = {};
        const columnsRowsCount: number = Math.sqrt(cardsCount);
        const pairsCount: number = cardsCount / 2;

        let availablePositions: Position[] = this.generateAllPossiblePositions(columnsRowsCount);

        for (let i = 0; i < pairsCount; i++) {
            const card1Position: Position =
                this.generateCardPosition(availablePositions);
            const card1: Card = new Card(card1Position);

            cardMap[JSON.stringify(card1Position)] = card1;

            availablePositions = removeElementFromPositionsArray(
                card1Position,
                availablePositions
            );

            const card2Position: Position = this.generateCardPosition(availablePositions);
            const card2: Card = new Card(card2Position);

            cardMap[JSON.stringify(card2Position)] = card2;
            
            availablePositions = removeElementFromPositionsArray(
                card2Position,
                availablePositions
            );

            // establish connection
            new Pair(card1, card2, i.toString());
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
}

class GameEvents {
    cardMap: CardMap;
    revealedCards: Card[] = [];
    cardBack: string = '';
    overlay: HTMLElement = document.createElement("div");

    constructor(cardMap: CardMap) {
        this.cardMap = cardMap;

        // add overlay classes
        this.overlay.classList.add("w-screen", "h-screen", "absolute", "overlay", "top-0");

        document.addEventListener("DOMContentLoaded", () => this.renderCards());
        document.addEventListener("DOMContentLoaded", () => this.hookFunctions());
    }

    hookFunctions() {
        document.querySelectorAll(".card").forEach((card) => {
            card.addEventListener("click", (e: Event) => this.cardClicked(e));
        });
        console.log('functions hooked');
    }

    renderCards() {
        const container = document.querySelector(".cards-container");

        if (container != undefined) {
            const cardCount = Object.keys(this.cardMap ?? {}).length;
            const columnsCount = Math.sqrt(cardCount);
            for (let i = 0; i < cardCount; i++) {
                let column = Math.floor(i / columnsCount) + 1;
                let row = (i % columnsCount) + 1;
                container.innerHTML += `<div class="card w-32 h-32 bg-green-600 flex m-auto items-center justify-center border border-black rounded-xl border-3 cursor-pointer text-white text-2xl font-semibold col-start-${column} row-start-${row}" x="${column - 1}" y="${row - 1}"><div class="card-content"></div></div>`;
            }
        }
    }
    
    cardClicked(e: Event) {
        const targetCardElement: HTMLElement = e.target as HTMLElement;

        // TODO check if card is already revealed
        if(this.isCardRevealed(targetCardElement)) {
            // TODO this doesnt work correctly
            console.log("WHAT?!");
            return;
        }

        this.revealCard(targetCardElement);

        if(this.revealedCards.length % 2 == 0){
            document.body.appendChild(this.overlay);

            if(!isPair([...this.revealedCards])) {
                console.log("is not a pair");
                this.revealedCards.splice(-2, 2);
            }

            setTimeout(() => {
                document.body.removeChild(this.overlay);
                this.hideCards();
            },1000);
        }
    }

    revealCard(cardElement: HTMLElement) {
        if(cardElement.classList.contains("card-content")) {
            // content clicked - set element to card
            cardElement = cardElement.closest(".card") as HTMLElement;
        }

        cardElement.classList.add('revealed');

        const card = this.getCardByElement(cardElement);

        if (!card) {
            console.error("Card not found in map: " + cardElement);
            return;
        }

        this.revealedCards.push(card);

        const cardContent = card.pair?.content || "No content available";

        let contentElement = cardElement.querySelector('.card-content');
        
        if(contentElement) {
            contentElement.innerHTML = cardContent;
        }
    }

    hideCards() {
        document.querySelectorAll(".card").forEach((cardElement) => {
            if(cardElement) {
                cardElement.classList.remove('revealed');

                if(this.isCardRevealed(cardElement as HTMLElement)) {
                    cardElement.classList.add('guessed-correctly');
                    return;
                }
            }

            let cardContent = cardElement.querySelector('.card-content');

            if(cardContent) {
                cardContent.innerHTML = this.cardBack;
            }
        });
    }

    isCardRevealed(cardElement: HTMLElement): boolean {
        const card: Card = this.getCardByElement(cardElement as HTMLElement);

        if(this.revealedCards.some((revealedCard: Card) => revealedCard.position == card.position)) {
            return true;
        }

        return false;
    }

    getCardByElement(cardElement: HTMLElement): Card {
        const x: number = Number(cardElement.getAttribute("x"));
        const y: number = Number(cardElement.getAttribute("y"));

        const position: Position = {x: x, y: y};
        const card = this.cardMap[JSON.stringify(position)];

        return card;
    }
}

function isPair(revealedCards: Card[]): boolean {
    if(revealedCards.length < 2) {
        return false;
    }

    const lastPair = revealedCards.splice(-2, 2);

    if(lastPair[0].pair == lastPair[1].pair && lastPair[0].position != lastPair[1].position) {
        return true;
    }

    return false;
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
    content: string;

    constructor(card1: Card, card2: Card, content: string) {
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
