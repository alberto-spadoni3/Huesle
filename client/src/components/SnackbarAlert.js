import * as React from 'react';
import {Snackbar, Alert} from '@mui/material';

export default function SnackbarAlert({state, setState}) {

    const {open, message, severity} = state;

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setState({ ...state, open: false });
    };

    return (
        <div>
            <Snackbar
                anchorOrigin={{vertical: "top", horizontal: "center" }}
                open={open}
                onClose={handleClose}
                key={message}
                >
                <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                    {message}
                    </Alert>
            </Snackbar>

        </div>
    );
}
