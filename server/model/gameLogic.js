/*List of useful functions
-   Generate secret code
-   Check secret code
-   Check win condition
-   Check number of turns ended
 */

const max_turns = 10;
const code_length = 4;

class Colours {
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
    guess.forEach(value => {
        if(solution.includes(value)) {
            solution.splice(solution.indexOf(value), 1)
            rightColours++;
        }
    });
    return {colours: rightColours, position: rightPositions};
}

export {createRandomSolutionWithRepetition, checkGuess};