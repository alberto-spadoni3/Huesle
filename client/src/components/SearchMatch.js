import {
    Box,
    Button,
    Stack,
    Avatar,
    Typography,
    IconButton,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import DashboardMenu from "./DashboardMenu";
import SearchPrivateMatchDialog from "./SearchPrivateMatchDialog";
import JoinPrivateMatchDialog from "./JoinPrivateMatchDialog";
import BackButton from "./BackButton";
import {axiosPrivate} from "../api/axios";
import {BACKEND_SEARCH_MATCH_ENDPOINT} from "../api/backend_endpoints";
import {useSnackbar} from "notistack";
import useAuth from "../hooks/useAuth";

const SearchMatch = () => {
    const navigate = useNavigate();
    const [anchorElement, setAnchorElement] = useState(null);
    const { enqueueSnackbar } = useSnackbar();
    const { auth} = useAuth();
    const open = Boolean(anchorElement);

    const [searchPrivateOpen, setSearchPrivateOpen] = useState(false);
    const [joinPrivateOpen, setJoinPrivateOpen] = useState(false);

    const handleMenuOpening = (event) => {
        setAnchorElement(event.currentTarget);
    };

    const generatePublicMatch = async () => {
        try {
            const username = auth.username;
            const secret = false;
            await axiosPrivate.post(
                BACKEND_SEARCH_MATCH_ENDPOINT,
                JSON.stringify({ username, secret }),
            );
            enqueueSnackbar("Searching for new Match...", {
                variant: "success",
                autoHideDuration: 2500,
            });
            navigate("/dashboard", { replace: true });
            return;
        } catch (error) {
            enqueueSnackbar("Error in comunicating with Server", {
                variant: "error",
                autoHideDuration: 2500,
            });
        }
    };

    return (
        <>
            <BackButton />
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
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        width: "80%",
                        margin: "1rem 0 0.4rem 0",
                    }}
                >
                    <Stack
                        direction="row"
                        justifyContent="space-evenly"
                        alignItems="center"
                        width="inherit"
                        spacing={4}
                    >
                        <Avatar
                            sx={{ bgcolor: "orange", width: 60, height: 60 }}
                        >
                            A
                        </Avatar>
                        <Typography variant="h6" pl={"6px"}>
                            Albisyx
                        </Typography>
                        <IconButton
                            onClick={(e) => handleMenuOpening(e)}
                            aria-label="Open menu"
                        >
                            <MenuRoundedIcon
                                fontSize="large"
                                sx={{
                                    border: "3px solid",
                                    borderColor: "palette.text.secondary",
                                    borderRadius: "50%",
                                    padding: "5px",
                                }}
                            />
                        </IconButton>
                    </Stack>
                </Box>
            </Box>
            <DashboardMenu
                anchorEl={anchorElement}
                setAnchorEl={setAnchorElement}
                open={open}
            />
        </>
    );
};

export default SearchMatch;
