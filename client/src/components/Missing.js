import { useNavigate } from "react-router-dom";
import { Box, Button, Stack, Typography } from "@mui/material";

const Missing = () => {
    const navigate = useNavigate();
    return (
        <Box
            sx={{
                height: "30vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Stack spacing={1}>
                <Typography variant="h5">Route not found</Typography>
                <Button variant="outlined" color="button" onClick={() => navigate("/")}>
                    Go to the Homepage
                </Button>
            </Stack>
        </Box>
    );
};

export default Missing;
