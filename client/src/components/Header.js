import { Box, Container, Stack, Typography } from "@mui/material";
import AppSymbol from "./AppSymbol";

const Header = () => {

    return (
        <header>
            <Box>
                <Container
                    maxWidth="xs"
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        paddingTop: 1,
                    }}
                >
                    <Stack
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        spacing={1}
                    >
                        <AppSymbol />
                        <Typography
                            variant="h3"
                            color="text.primary"
                            sx={{
                                textAlign: "center",
                            }}
                        >
                            Huesle
                        </Typography>
                    </Stack>
                </Container>
            </Box>
        </header>
    );
};

export default Header;
