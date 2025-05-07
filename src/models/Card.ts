import { Pair } from "./Pair";
import { Position } from "./Position";

export class Card {
    position: Position;
    pair?: Pair;

    constructor(position: Position) {
        this.position = position;
    }
}