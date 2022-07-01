import * as React from "react";
import { Snackbar, Alert } from "@mui/material";

export default function SnackbarAlert({ state, setState }) {
    const { open, message, severity } = state;

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setState({ ...state, open: false });
    };

    return (
        <div>
            <Snackbar
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                open={open}
                autoHideDuration={4000}
                onClose={handleClose}
                key={message}
            >
                <Alert
                    onClose={handleClose}
                    severity={severity}
                    sx={{ width: "100%", fontSize: "18px" }}
                >
                    {message}
                </Alert>
            </Snackbar>
        </div>
    );
}
