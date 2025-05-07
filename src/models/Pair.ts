import { Card } from "./Card";

export class Pair {
    cards: [Card, Card];
    content: string;

    constructor(card1: Card, card2: Card, content: string) {
        this.cards = [card1, card2];

        card1.pair = this;
        card2.pair = this;

        this.content = content;
    }
}