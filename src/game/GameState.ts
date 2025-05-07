import { GameEvents } from "./GameEvents";

import { CardMap } from "../types";

import { Position } from "../models/Position";
import { Pair } from "../models/Pair";
import { Card } from "../models/Card";

import { removeElementFromPositionsArray } from "../utils/helpers";

export class GameState {
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