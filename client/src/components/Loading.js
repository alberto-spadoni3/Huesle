import {Box, CircularProgress, Fade} from "@mui/material";

const Loading = () => {
    return (
        <Fade in={true}>
            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                marginTop={4}
                height="50vh"
            >
                <CircularProgress />
            </Box>
        </Fade>
    );
};

export default Loading;
