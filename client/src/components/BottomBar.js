import {
    Box,
    styled,
    Stack,
    Typography,
    IconButton,
} from "@mui/material";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { useState } from "react";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import DashboardMenu from "./DashboardMenu";
import useAuth from "../hooks/useAuth";
import UserPicture from "./UserPicture";

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
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    alignItems: "center",
                    marginY: "25px",
                }}
            >
                <Stack
                    direction="row"
                    justifyContent="space-evenly"
                    alignItems="center"
                    width="inherit"
                    spacing={4}
                >
                    <UserPicture userPic={auth.profilePicID} />
                    <Typography color="text.primary" variant="h6" pl={"6px"}>
                        {auth.username}
                    </Typography>
                    <IconButton
                        onClick={(e) => handleMenuOpening(e)}
                        aria-label="Open menu"
                    >
                        <MenuRoundedIcon
                            style={{
                                fontSize: 50,
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
