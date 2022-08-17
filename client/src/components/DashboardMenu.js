import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import useLogout from "../hooks/useLogout";
import { useNavigate } from "react-router-dom";
import UserPicture from "./UserPicture";
import useAuth from "../hooks/useAuth";

export default function DashboardMenu({ anchorEl, setAnchorEl, open }) {
    const logout = useLogout();
    const navigate = useNavigate();
    const { auth } = useAuth();

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <Menu
            anchorEl={anchorEl}
            id="dashboard-menu"
            open={open}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
            PaperProps={{
                elevation: 0,
                sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: "3px",
                    bgcolor: "background.dashboardMenu",
                    "& .MuiAvatar-root": {
                        width: 64,
                        height: 64,
                        ml: -0.5,
                        mr: 1,
                    } /* 
                    "&:before": {
                        content: '""',
                        display: "block",
                        position: "absolute",
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: "red",
                        transform: "translateY(-50%) rotate(45deg)",
                        zIndex: 0,
                    }, */,
                },
            }}
            anchorOrigin={{
                vertical: "top",
                horizontal: "center",
            }}
            transformOrigin={{
                vertical: "bottom",
                horizontal: "center",
            }}
        >
            <MenuItem onClick={(e) => navigate("/user/profile")}>
                <UserPicture userPic={auth.profilePicID} /> My profile
            </MenuItem>
            <Divider />
            <MenuItem onClick={(e) => navigate("/rules")}>
                <ListItemIcon>
                    <QuestionMarkIcon fontSize="small" />
                </ListItemIcon>
                How To Play
            </MenuItem>
            <MenuItem onClick={(e) => navigate("/settings")}>
                <ListItemIcon>
                    <Settings fontSize="small" />
                </ListItemIcon>
                Settings
            </MenuItem>
            <MenuItem onClick={logout}>
                <ListItemIcon>
                    <Logout color="error" fontSize="small" />
                </ListItemIcon>
                <Typography variant="body1" color="error">
                    Logout
                </Typography>
            </MenuItem>
        </Menu>
    );
}
