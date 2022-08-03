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
import {useEffect, useLayoutEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import DashboardMenu from "./DashboardMenu";
import { axiosPrivate } from "../api/axios";
import {
    BACKEND_GET_MATCHES_ENDPOINT
} from "../api/backend_endpoints";
import useAuth from "../hooks/useAuth";
import useGameData from "../hooks/useGameData";
import {useSnackbar} from "notistack";
import useSocket from "../hooks/useSocket";

const BottomBar = () => {
    const [anchorElement, setAnchorElement] = useState(null);
    const { auth } = useAuth();
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

    return (
        <>
                <Box
                    marginTop={2}
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        flexDirection: "column",
                        alignItems: "center"
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
                            {auth.username.substring(0, 2).toUpperCase()}
                        </Avatar>
                        <Typography variant="h6" pl={"6px"}>
                            {auth.username}
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
                    <DashboardMenu
                        anchorEl={anchorElement}
                        setAnchorEl={setAnchorElement}
                        open={open}
                    />
                </Box>
        </>
    );
};

export default BottomBar;
