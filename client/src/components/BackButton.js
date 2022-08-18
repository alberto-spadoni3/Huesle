import { Box, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const BackButton = () => {
    const navigate = useNavigate();

    return (
        <Box sx={{ marginY: 1 }}>
            <IconButton onClick={(e) => navigate(-1)}>
                <ArrowBackIcon
                    style={{
                        fontSize: 50,
                        border: "2px solid",
                        borderColor: "palette.text.primary",
                        borderRadius: "50%",
                        padding: "2px",
                    }}
                />
            </IconButton>
        </Box>
    );
};

export default BackButton;
