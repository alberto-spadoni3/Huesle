import { Outlet } from "react-router-dom";
import { GameDataProvider } from "../context/GameDataProvider";

const GameContext = () => {
    return (
        <GameDataProvider>
            <Outlet />
        </GameDataProvider>
    );
};

export default GameContext;
