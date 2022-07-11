import { useContext } from "react";
import GameDataContext from "../context/GameDataProvider";

const useGameData = () => {
    return useContext(GameDataContext);
};

export default useGameData;
