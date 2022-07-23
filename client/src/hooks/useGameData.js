import { useContext } from "react";
import GameDataContext from "../context/GameDataProvider";

const useGameData = () => {
    return useContext(GameDataContext);
};

export default useGameData;

function getPegRowID(rowIndex, pegIndex) {
    return "row" + rowIndex+".peg"+pegIndex;
}

function getHintRowID(rowIndex, hintIndex) {
    return "row" + rowIndex+".hint"+hintIndex;
}

export {
    getPegRowID,
    getHintRowID
}