import {
    Box,
    Button,
    Fade,
    styled,
    TableCell,
    TableContainer,
    TableRow,
    TableHead,
    Table,
    TableBody, Typography
} from "@mui/material";
import {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import {
    BACKEND_GET_MATCHES_ENDPOINT
} from "../api/backend_endpoints";
import useAuth from "../hooks/useAuth";
import useGameData from "../hooks/useGameData";
import useSocket from "../hooks/useSocket";
import BottomBar from "./BottomBar";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const Dashboard = () => {
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate()
    const [anchorElement, setAnchorElement] = useState(null);
    const { auth } = useAuth();
    const { socket, MessageTypes} = useSocket();
    const open = Boolean(anchorElement);
    const { loadBoard, GameStates, isMatchOver } = useGameData();

    const ActiveMatchesCard = styled(Box)(({ theme }) => ({
        width: "100%",
        backgroundColor: theme.palette.background.paper,
        borderRadius: 5,
        margin: "1rem 0 0.4rem 0",
    }));

    const [rows, setRows] = useState([]);
    const [endedRows, setEndedRows] = useState([]);

    async function updateMatches() {
        try {
            const temp_rows = [];
            const temp_endedrows = [];
            const response = await axiosPrivate.get(
                BACKEND_GET_MATCHES_ENDPOINT
            );
            const { pending, matches } = response.data;
            if (pending)
                temp_rows.push(createData(null, "Searching...", "Waiting"));
            matches.sort((a, b) => {
                if(a.status.state == GameStates.PLAYING && b.status.state == GameStates.PLAYING) {
                    return a.status.player == auth.username ? -1 : 1;
                } else return a.status.state == GameStates.PLAYING ? -1 : 1;

            })
            matches.forEach((match) => {
                const opponent = match.players.find(
                    (name) => name != auth.username
                );
                (match.status.state == GameStates.PLAYING)?
                    temp_rows.push(createData(match._id, opponent, match.status)):
                    temp_endedrows.push(createData(match._id, opponent, match.status));
            });
            setRows(temp_rows);
            setEndedRows(temp_endedrows);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        updateMatches();
        socket.on(MessageTypes.NEW_MATCH, () => {
            updateMatches();
        });
        socket.on(MessageTypes.NEW_MOVE, () => {
            updateMatches();
        });
        socket.on(MessageTypes.MATCH_OVER, () => {
            updateMatches();
        });
    }, [socket]);

    function createData(id, name, status) {
        return { id, name, status };
    }

    function generateRow(index, row_id, row_name, row_status) {
        let button_label;
        let button_type = "outlined";
        let button_state = true;
        switch(row_status.state) {
            case GameStates.PLAYING:
                if(row_status.player == auth.username) {
                    button_label = "It's your turn!";
                    button_type = "contained"
                } else {
                    button_label = "Opponent's turn...";
                };
                button_state = false;
                break;
            case GameStates.WINNER:
                button_label = row_status.player == auth.username? "You won!": "You Lost...";
                break;
            case GameStates.DRAW:
                button_label = "Draw";
                break;
            default:
                button_label = "Waiting";
                break;
        }
        return (<TableRow
            key={index}
            onClick={() =>
                openSelectedMatch(row_id)
            }
        >
            <TableCell component="th" scope="row">
                {row_name}
            </TableCell>
            <TableCell component="th" scope="row" align="center">
                <Button
                    sx={{ width: "70%", height: "50%", fontSize: "70%"}}
                    variant={button_type}
                    aria-label={row_id + "status"}
                    onClick={() => openSelectedMatch(row_id)}
                    disabled={button_state}
                >
                    {button_label}
                </Button>
            </TableCell>
        </TableRow>);
    }

    async function openSelectedMatch(matchId) {
        if (!matchId) {
            console.log("Invalid match ID");
            return;
        }

        try {
            loadBoard(matchId).then(() =>
                navigate("/match-details"));
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
        <Fade in={true}>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Button
                    sx={{ width: "100%", height: "50px", marginTop: 3, marginBottom: 2 }}
                    variant="contained"
                    startIcon={<SearchIcon />}
                    aria-label="Search Match"
                    onClick={(e) => navigate("/searchMatch")}
                >
                    Search Match
                </Button>

                <Typography variant="h6" align="center">
                    Active Matches
                </Typography>
                <ActiveMatchesCard
                    sx={{
                        border: "2px solid",
                        borderColor: "palette.text.secondary",
                        background: "palette.background.paper",
                        marginBottom: 2
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
                                        <TableCell>Match against</TableCell>
                                        <TableCell align="center">Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map((row, index) => (
                                        generateRow(index, row.id, row.name, row.status)
                                    ))}
                                </TableBody>
                            </Table>
                    </TableContainer>
                </ActiveMatchesCard>

                <Typography variant="h6" align="center">
                    Completed Matches
                </Typography>
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
                                </TableRow>
                                <TableRow>
                                    <TableCell>Match against</TableCell>
                                    <TableCell align="center">Result</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {endedRows.map((row, index) => (
                                    generateRow(index, row.id, row.name, row.status)
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </ActiveMatchesCard>
                <BottomBar></BottomBar>
            </Box>
        </Fade>
        </>
    );
};

export default Dashboard;
