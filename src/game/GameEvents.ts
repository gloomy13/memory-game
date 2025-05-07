import { Card } from "../models/Card";
import { Position } from "../models/Position";

import { CardMap } from "../types";

import { isPair } from "../utils/helpers";

export class GameEvents {
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