/*List of useful functions
-   Generate secret code
-   Check secret code
-   Check win condition
-   Check number of turns ended
 */

const max_turns = 10;
const code_length = 4;

export class Colours {
    static Red = new Colours("red")
    static Green = new Colours("green")
    static Blue = new Colours("blue")
    static Yellow = new Colours("yellow")
    static Black = new Colours("black")
    static White = new Colours("white")
    static Orange = new Colours("orange")
    static Brown = new Colours("brown")

    constructor(name) {
        this.name = name
    }
}
const colours = Object.keys(Colours);

class GameStates {
    static Draw = new GameStates("draw")
    static TURN_P1 = new GameStates("p1turn")
    static TURN_P2 = new GameStates("p2turn")
    static WIN_P1 = new GameStates("p1win")
    static WIN_P2 = new GameStates("p2win")

    constructor(name) {
        this.name = name
    }
}

function createSolutionWithoutRepetition() {
    let solution = new Array();
    let temp = colours.slice();
    for(let i = 0; i < code_length; i++) {
        solution.push(temp.splice(Math.floor(Math.random() * temp.length), 1).pop());
    }
    return solution;
}

function createRandomSolutionWithRepetition() {
    let solution = new Array();
    for(let i = 0; i < code_length; i++) {
        solution.push(colours[Math.floor(Math.random() * colours.length)]);
    }
    return solution;
}

function checkGuess(guess, solution) {
    let rightPositions = 0;
    for(let i = 0; i < guess.length; i++) {
        if(guess[i] == solution[i]) rightPositions++;
    }

    let rightColours = -rightPositions;
    let temp = solution.slice();
    guess.forEach(value => {
        if(temp.includes(value)) {
            temp.splice(temp.indexOf(value), 1)
            rightColours++;
        }
    });
    return {colours: rightColours, position: rightPositions};
}

function elaborateTurn(guess, solution, currentState, turn_n) {
    const values = checkGuess(guess, solution);
    turn_n++;
    if(turn_n < max_turns) {
        switch (currentState) {
            case GameStates.TURN_P1.name: {
                if (values.position == code_length) currentState = GameStates.WIN_P1;
                else currentState = GameStates.TURN_P2;
                break;
            }
            case GameStates.TURN_P2.name: {
                if (values.position == code_length) currentState = GameStates.WIN_P2;
                else currentState = GameStates.TURN_P1;
                break;
            }
        }
    } else currentState = GameStates.Draw;
    return {status: currentState.name, turn: turn_n, rightC: values.colours, rightP: values.position};
}

export {createSolutionWithoutRepetition, createRandomSolutionWithRepetition, checkGuess, elaborateTurn,
    GameStates};