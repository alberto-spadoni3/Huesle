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
    BACKEND_LEAVE_MATCH_ENDPOINT,
    BACKEND_SEARCH_MATCH_ENDPOINT,
} from "../api/backend_endpoints";
import { useSnackbar } from "notistack";
import {useNavigate} from "react-router-dom";
import useSocket from "../hooks/useSocket";
import useGameData from "../hooks/useGameData";
import useAuth from "../hooks/useAuth";

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function LeaveMatchDialog({
    leaveMatchDialogStatus,
    setLeaveMatchDialogStatus,
}) {

    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const {auth} = useAuth();
    const {id, players} = useGameData();
    const opponent = players.find(p => p != auth.username);

    const handleClose = (event) => {
        event.preventDefault();
        setLeaveMatchDialogStatus(false);
    };

    const leaveMatch = async (event) => {
        try {
            await axiosPrivate.put(
                BACKEND_LEAVE_MATCH_ENDPOINT,
                {
                    matchId: id
                }
            );
            enqueueSnackbar("Match against " + opponent + " abandoned", {
                variant: "info",
                autoHideDuration: 2500,
            });
        } catch (error) {
            if (!error?.response) {
                console.log(error);
            }
        }
        handleClose(event);
    };

    return (
        <>
            <Dialog
                open={leaveMatchDialogStatus}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="leave-dialog-slide-description"
            >
                <DialogTitle>{"Abandon Match"}</DialogTitle>
                <DialogContent>
                    <DialogContentText
                        id="alert-dialog-slide-description"
                        textAlign="center"
                    >
                        Are you sure you want to admit defeat to {opponent}?
                    </DialogContentText>
                    <DialogActions>
                        <Button onClick={leaveMatch}>Yes</Button>
                        <Button onClick={handleClose}>No</Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        </>
    );
}
