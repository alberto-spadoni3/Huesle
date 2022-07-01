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
import { useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import DashboardMenu from "./DashboardMenu";

const Dashboard = (/* { theme } */) => {
    const navigate = useNavigate();
    const [anchorElement, setAnchorElement] = useState(null);
    const open = Boolean(anchorElement);

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

    function createData(name, status) {
        return { name, status };
    }

    const rows = [
        createData("Richard", "waiting"),
        createData("Mark", "your turn"),
        createData("Lana", "lost"),
        createData("Annah", "lost"),
        createData("Rebecca", "won"),
    ];

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
                                        key={row.name}
                                        /* sx={{
                                            "&:last-child td, &:last-child th":
                                                {
                                                    border: 0,
                                                },
                                        }} */
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
                            aria-label="settings"
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