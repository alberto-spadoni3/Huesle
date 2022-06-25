import { Container } from "@mui/material";
import { Outlet } from "react-router-dom";

const MainContainer = () => {
    return (
        <Container component="contaienr" maxWidth="xs">
            <Outlet />
        </Container>
    );
};

export default MainContainer;
