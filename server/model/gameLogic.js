const max_turns = 10;
const code_length = 4;

export class Colours {
    static crimson = new Colours("crimson");
    static coral = new Colours("coral");
    static gold = new Colours("gold");
    static forestgreen = new Colours("forestgreen");
    static mediumblue = new Colours("mediumblue");
    static rebeccapurple = new Colours("rebeccapurple");

    constructor(name) {
        this.name = name;
    }
}
const colours = Object.keys(Colours);

export class GameStates {
    static DRAW = "DRAW";
    static PLAYING = "PLAYING";
    static WINNER = "WINNER";
}

function createSolutionWithoutRepetition() {
    let solution = new Array();
    let temp = colours.slice();
    for (let i = 0; i < code_length; i++) {
        solution.push(
            temp.splice(Math.floor(Math.random() * temp.length), 1).pop()
        );
    }
    return solution;
}

function createRandomSolutionWithRepetition() {
    let solution = new Array();
    for (let i = 0; i < code_length; i++) {
        solution.push(colours[Math.floor(Math.random() * colours.length)]);
    }
    return solution;
}

function checkGuess(guess, solution) {
    let rightPositions = 0;
    for (let i = 0; i < guess.length; i++) {
        if (guess[i] === solution[i]) rightPositions++;
    }

    let rightColours = -rightPositions;
    let temp = solution.slice();
    guess.forEach((value) => {
        if (temp.includes(value)) {
            temp.splice(temp.indexOf(value), 1);
            rightColours++;
        }
    });
    return { colours: rightColours, positions: rightPositions };
}

function elaborateTurn(guess, solution, currentState, players) {
    const values = checkGuess(guess, solution);
    currentState.turn++;
    if (currentState.turn < max_turns) {
        if (values.positions === code_length)
            currentState.state = GameStates.WINNER;
        else {
            currentState.player = changePlayer(players, currentState.player);
        }
    } else {
        if (values.positions === code_length)
            currentState.state = GameStates.WINNER;
        else currentState.state = GameStates.DRAW;
    }
    return {
        status: currentState,
        rightC: values.colours,
        rightP: values.positions,
    };
}

function isMatchOver(status) {
    const terminatingStates = [GameStates.DRAW, GameStates.WINNER];
    return terminatingStates.includes(status.state);
}

function isPlayerTurn(player, status) {
    return status.state == GameStates.PLAYING && status.player == player;
}

function changePlayer(players, prevActivePlayer) {
    return players.find((p) => p != prevActivePlayer);
}

export {
    createSolutionWithoutRepetition,
    createRandomSolutionWithRepetition,
    checkGuess,
    elaborateTurn,
    isMatchOver,
    isPlayerTurn,
    changePlayer,
};
