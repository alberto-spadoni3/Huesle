import React, { useState, useEffect, forwardRef } from "react";
import {
    Button,
    LinearProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Slide } from "@mui/material";
import {axiosPrivate} from "../api/axios";
import {
    BACKEND_SEARCH_MATCH_ENDPOINT,
} from "../api/backend_endpoints";
import { useSnackbar } from "notistack";
import {useNavigate} from "react-router-dom";
import useAuth from "../hooks/useAuth";
import {socket} from "../App";

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function SearchPrivateMatchDialog({
    connectOpen,
    setConnectOpen,
}) {

    const [searchPrivateOpen, setSearchPrivateOpen] = useState(false);
    const [secretCode, setSecretCode] = useState("");
    const { enqueueSnackbar } = useSnackbar();
    const {auth, MessageTypes} = useAuth();
    const navigate = useNavigate();

    const generateMatch = async () => {
        setConnectOpen(true);
        try {
            const secret = true;
            const response = await axiosPrivate.post(
                BACKEND_SEARCH_MATCH_ENDPOINT,
                JSON.stringify({ secret }),
            );
            return response;
        } catch (error) {
            enqueueSnackbar("Error in comunicating with Server", {
                variant: "error",
                autoHideDuration: 2500,
            });
            setConnectOpen(false);
        }
    };

    const listenOnSocket = async () => {
        socket.on(MessageTypes.NOTIFICATION, data => {
            enqueueSnackbar(data.content, {
                variant: "success",
                autoHideDuration: 2500,
            });
            setSearchPrivateOpen(false);
            navigate("/dashboard", { replace: true });
        });

    }

    const handleClose = async (event) => {
        event.preventDefault();
        try {
            await axiosPrivate.delete(
                BACKEND_SEARCH_MATCH_ENDPOINT,
            );
            enqueueSnackbar("Stopped hosting the private match", {
                variant: "success",
                autoHideDuration: 2500,
            });
        } catch (error) {
            if (!error?.response) {
                console.log(error);
            }
        }
        setSearchPrivateOpen(false);
    };

    useEffect(() => {
        if (connectOpen) {
            generateMatch().then((response) => {
                if (response) {
                    setSecretCode(response.data.secretCode);
                    setConnectOpen(false);
                    setSearchPrivateOpen(true);
                    enqueueSnackbar("Match created successfully", {
                        variant: "success",
                        autoHideDuration: 2500,
                    });
                    listenOnSocket();
                }
            });
        }
    }, [connectOpen]);

    return (
        <div>
            <Dialog
                open={connectOpen}
                TransitionComponent={Transition}
                keepMounted
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Ricerca Partita Privata"}</DialogTitle>
                <DialogContent>
                    <DialogContentText
                        id="alert-dialog-slide-description"
                        textAlign="center"
                    >
                        Generating New Match...
                    </DialogContentText>
                    <LinearProgress sx={{ m: 1.5 }} color="inherit" />
                </DialogContent>
            </Dialog>

            <Dialog
                open={searchPrivateOpen}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
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
                    <Button onClick={handleClose}>Abbandona</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
