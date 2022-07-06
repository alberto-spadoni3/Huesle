import { forwardRef } from "react";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import axiosPrivate from "../api/axios";
import { BACKEND_JOIN_PRIVATE_MATCH_ENDPOINT } from "../api/backend_endpoints";
import { useState } from "react";
import { useSnackbar } from "notistack";

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function JoinPrivateMatchDialog({ open, setOpen }) {
    const [searchingOpen, setSearchingOpen] = useState(false);

    const [secretCode, setSecretCode] = useState("");
    const { enqueueSnackbar } = useSnackbar();

    const handleSearch = async (event) => {
        event.preventDefault();
        handleCodeClose();
        setSearchingOpen(true);
        try {
            const username = "pippa";
            console.log(secretCode);
            const response = await axiosPrivate.post(
                BACKEND_JOIN_PRIVATE_MATCH_ENDPOINT,
                JSON.stringify({ username, secretCode }),
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );
            if (response) {
                enqueueSnackbar("Match found: " + response.data.matchId, {
                    variant: "success",
                    autoHideDuration: 2500,
                });
            }
        } catch (error) {
            console.log(error);
        }
        handleSearchClose();
    };

    const handleCodeClose = () => {
        setOpen(false);
    };

    const handleSearchClose = () => {
        setSearchingOpen(false);
        setSecretCode("");
    };

    return (
        <div>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleCodeClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Ricerca Partita Privata"}</DialogTitle>
                <DialogContent>
                    <DialogContentText
                        id="alert-dialog-slide-description"
                        textAlign="center"
                    >
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
                <DialogContent>
                    <DialogContentText
                        id="alert-dialog-slide-description"
                        textAlign="center"
                    >
                        Codice Segreto: {secretCode}
                    </DialogContentText>
                    <LinearProgress sx={{ m: 1.5 }} color="inherit" />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSearchClose}>Abbandona</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
