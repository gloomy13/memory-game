import { Position } from "../models/Position";
import { Card } from "../models/Card";

 /**
  * Returns true if cards are of the same pair.
  * 
  * @param revealedCards: Card[]
  * 
  * @return boolean
  */
export function isPair(revealedCards: Card[]): boolean {
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
export function removeElementFromPositionsArray(
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