import { Box, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {Outlet} from "@mui/icons-material";

const BackButton = ({children}) => {
    const navigate = useNavigate();

    return (
        <Box sx={{ marginY: 1 }}>
            <IconButton onClick={(e) => navigate(-1)}>
                <ArrowBackIcon
                    titleAccess="Go back"
                    style={{
                        fontSize: 50,
                        border: "3px solid",
                        borderColor: "palette.text.secondary",
                        borderRadius: "50%",
                        padding: "2px",
                        marginLeft: "-4"
                }}
                />
            </IconButton>
        </Box>
    );
};

export default BackButton;
