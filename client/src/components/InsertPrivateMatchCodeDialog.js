import * as React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import axios from "../api/axios";
import { BACKEND_SEARCH_PRIVATE_MATCH_ENDPOINT } from "../api/backend_endpoints";
import {useState} from "react";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function InsertPrivateMatchCodeDialog({privateCode}) {
    const [codeOpen, setCodeOpen] = React.useState(false);
    const [searchingOpen, setSearchingOpen] = React.useState(false);

    const [secretCode, setSecretCode] = useState("");

    const handleClickOpen = () => {
        setCodeOpen(true);
    };

    const handleSearch =  async (event) => {
        event.preventDefault();
        handleCodeClose();
        setSearchingOpen(true);
        try {
            const username = "pippa";
            const response = await axios.post(
                BACKEND_SEARCH_PRIVATE_MATCH_ENDPOINT,
                JSON.stringify({secretCode, username}),
                {
                    headers: {"Content-Type": "application/json"},
                    withCredentials: true,
                });
        } catch (error) {
            console.log(error)
        }
        handleSearchClose();
    };

    const handleCodeClose =  () => {
        setCodeOpen(false);
    };

    const handleSearchClose =  () => {
        setSearchingOpen(false);
        setSecretCode("");
    };

    return (
        <div>
            <Button variant="outlined" onClick={handleClickOpen}>
                Slide in alert dialog
            </Button>
            <Dialog
                open={codeOpen}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleCodeClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Ricerca Partita Privata"}</DialogTitle>
                <DialogContent >
                    <DialogContentText id="alert-dialog-slide-description" textAlign="center">
                        Inserisci codice segreto della partita
                    </DialogContentText>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="secretCode"
                        label="Secret Code"
                        name="secretCode"
                        onChange={(e) => setSecretCode(e.target.value)}
                        value={secretCode}
                        autoComplete="off"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCodeClose}>Abbandona</Button>
                    <Button onClick={handleSearch}>Prosegui</Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={searchingOpen}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleSearchClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Ricerca Partita Privata"}</DialogTitle>
                <DialogContent >
                    <DialogContentText id="alert-dialog-slide-description" textAlign="center">
                        Codice Segreto: {secretCode}
                    </DialogContentText>
                    <LinearProgress  sx={{ m: 1.5}} color='inherit'/>
                </DialogContent>
                <DialogActions>
                        <Button onClick={handleSearchClose}>Abbandona</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
