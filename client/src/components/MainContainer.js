import { Container } from "@mui/material";
import { Outlet } from "react-router-dom";

const MainContainer = () => {
    return (
        <Container maxWidth="xs">
            <Outlet />
        </Container>
    );
};

export default MainContainer;
