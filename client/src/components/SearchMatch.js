import {
    Box,
    Button, Fade,
    Typography
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import SearchPrivateMatchDialog from "./SearchPrivateMatchDialog";
import JoinPrivateMatchDialog from "./JoinPrivateMatchDialog";
import BackButton from "./BackButton";
import { BACKEND_SEARCH_MATCH_ENDPOINT } from "../api/backend_endpoints";
import { useSnackbar } from "notistack";
import BottomBar from "./BottomBar";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const SearchMatch = () => {
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate()
    const { enqueueSnackbar } = useSnackbar();

    const [searchPrivateOpen, setSearchPrivateOpen] = useState(false);
    const [joinPrivateOpen, setJoinPrivateOpen] = useState(false);

    const generatePublicMatch = async () => {
        try {
            const secret = false;
            const response = await axiosPrivate.post(
                BACKEND_SEARCH_MATCH_ENDPOINT,
                JSON.stringify({ secret })
            );

            const message = "Searching public match...";

            enqueueSnackbar(message, {
                variant: "info",
                autoHideDuration: 2500,
            });

            navigate("/dashboard", { replace: true });
            return;
        } catch (error) {
            enqueueSnackbar(error.response.data.message, {
                variant: "error",
                autoHideDuration: 2500,
            });
        }
    };

    return (
        <>
            <BackButton />
            <Fade in={true}>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Typography
                    variant="h5"
                    color="text.primary"
                    sx={{
                        textAlign: "center",
                        marginTop: 1,
                    }}
                >
                    Public Matches
                </Typography>

                <Button
                    sx={{
                        width: "100%",
                        height: "50px",
                        marginTop: 2,
                        marginBottom: 2,
                    }}
                    variant="contained"
                    color="button"
                    startIcon={<SearchIcon />}
                    aria-label="Search Match"
                    onClick={(e) => generatePublicMatch()}
                >
                    Search Match
                </Button>

                <Typography
                    variant="h5"
                    color="text.primary"
                    sx={{
                        textAlign: "center",
                        marginTop: 2,
                    }}
                >
                    Private Matches
                </Typography>

                <Button
                    sx={{ width: "100%", height: "50px", marginTop: 2 }}
                    variant="contained"
                    startIcon={<SearchIcon />}
                    color="button"
                    aria-label="Create Match"
                    onClick={() => setSearchPrivateOpen(true)}
                >
                    Create Match
                </Button>
                <SearchPrivateMatchDialog
                    connectOpen={searchPrivateOpen}
                    setConnectOpen={setSearchPrivateOpen}
                />

                <Button
                    sx={{
                        width: "100%",
                        height: "50px",
                        marginTop: 2,
                    }}
                    variant="contained"
                    startIcon={<SearchIcon />}
                    color="button"
                    aria-label="Join Match"
                    onClick={(e) => setJoinPrivateOpen(true)}
                >
                    Join Match
                </Button>
                <JoinPrivateMatchDialog
                    open={joinPrivateOpen}
                    setOpen={setJoinPrivateOpen}
                />
                {/* FOOTER */}
                <BottomBar></BottomBar>
            </Box>
            </Fade>
        </>
    );
};

export default SearchMatch;
