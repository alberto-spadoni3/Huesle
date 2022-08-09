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
import {
    BACKEND_LEAVE_MATCH_ENDPOINT
} from "../api/backend_endpoints";
import { useSnackbar } from "notistack";
import {useNavigate} from "react-router-dom";
import useGameData from "../hooks/useGameData";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function LeaveMatchDialog({
    leaveMatchDialogStatus,
    setLeaveMatchDialogStatus,
}) {
    const {auth} = useAuth();
    const axiosPrivate = useAxiosPrivate()
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
        } catch (error) {
            console.log(error);
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
