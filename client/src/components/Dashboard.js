import {
    Box,
    Button,
    styled,
    Stack,
    Avatar,
    Typography,
    IconButton,
    TableCell,
    TableContainer,
    TableRow,
    TableHead,
    Table,
    TableBody,
    Paper,
} from "@mui/material";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import DashboardMenu from "./DashboardMenu";
import useGameData from "../hooks/useGameData";
import { axiosPrivate } from "../api/axios";
import {
    BACKEND_GET_MATCHES_ENDPOINT,
    BACKEND_GET_MATCH_ENDPOINT,
} from "../api/backend_endpoints";

const Dashboard = (/* { theme } */) => {
    const navigate = useNavigate();
    const [anchorElement, setAnchorElement] = useState(null);
    const open = Boolean(anchorElement);

    const { setCurrentRow, setMatchHistory } = useGameData();

    const handleMenuOpening = (event) => {
        setAnchorElement(event.currentTarget);
    };

    const MenuTooltip = styled(({ className, ...props }) => (
        <Tooltip {...props} classes={{ popper: className }} />
    ))(({ theme }) => ({
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: theme.palette.tooltip.main,
            color: theme.palette.text.secondary,
            fontSize: 16,
        },
    }));

    const ActiveMatchesCard = styled(Box)(({ theme }) => ({
        width: "100%",
        backgroundColor: theme.palette.background.paper,
        borderRadius: 5,
        margin: "1rem 0 0.4rem 0",
    }));

    const [rows, setRows] = useState([
        { id: "5099803df3f4948bd2f98391", name: "azzu", status: "pending" },
        { id: "5099803df3f4948bd2f98392", name: "pappa", status: "won" },
    ]);

    async function updateMatches() {
        const username = "pappa";
        try {
            const temp_rows = [];
            const response = await axiosPrivate.get(
                BACKEND_GET_MATCHES_ENDPOINT,
                { params: { username: username } }
            );
            const { pending, matches } = response.data;
            if (pending)
                temp_rows.push(
                    createData("wait", "???", "Waiting for new match")
                );

            matches.forEach((match) => {
                if (match.players.includes(username)) {
                    const opponent = match.players.filter(
                        (name) => name != username
                    );
                    temp_rows.push(
                        createData(match.id, opponent, match.status)
                    );
                }
            });
            setRows(temp_rows);
        } catch (error) {
            console.log(error);
        }
    }

    function createData(id, name, status) {
        return { id, name, status };
    }

    async function openSelectedMatch(matchId) {
        if (!matchId) {
            console.log("Invalid match ID");
            return;
        }

        try {
            const response = await axiosPrivate.get(
                BACKEND_GET_MATCH_ENDPOINT,
                { params: { matchId } }
            );

            const match = response?.data?.match;
            setCurrentRow(match.attempts.length);
            setMatchHistory(match.attempts);
        } catch (error) {
            console.log(error?.response.data.message);
        }
    }

    useEffect(() => {
        updateMatches();
    }, []);

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Button
                    sx={{ width: "100%", height: "50px", marginTop: 3 }}
                    variant="contained"
                    startIcon={<SearchIcon />}
                    aria-label="Search Match"
                    onClick={(e) => navigate("/searchMatch")}
                >
                    Search Match
                </Button>

                <ActiveMatchesCard
                    sx={{
                        border: "2px solid",
                        borderColor: "palette.text.secondary",
                        background: "palette.background.paper",
                    }}
                >
                    <TableContainer>
                        <Table
                            sx={{
                                minWidth: 250,
                            }}
                            aria-label="simple table"
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell>Match with</TableCell>
                                    <TableCell align="center">Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        onClick={(e) =>
                                            openSelectedMatch(row.id)
                                        }
                                    >
                                        <TableCell component="th" scope="row">
                                            {row.name}
                                        </TableCell>
                                        <TableCell align="center">
                                            {row.status}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </ActiveMatchesCard>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        width: "80%",
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

export default Dashboard;
