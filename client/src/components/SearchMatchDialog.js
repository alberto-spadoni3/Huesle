import * as React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import axios from "../api/axios";
import { BACKEND_LEAVE_SEARCH_PRIVATE_MATCH_ENDPOINT } from "../api/backend_endpoints";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function SearchMatchDialog({privateCode}) {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose =  async (event) => {
        event.preventDefault();

        try {
            setOpen(false);
            const username = "default";
            const response = await axios.delete(
                BACKEND_LEAVE_SEARCH_PRIVATE_MATCH_ENDPOINT,
                JSON.stringify({username}),
                {
                    headers: {"Content-Type": "application/json"},
                    withCredentials: true,
                }
            );
        }catch (error) {
            if (!error?.response) {
                console.log(error)
            }
        }
    };

    return (
        <div>
            <Button variant="outlined" onClick={handleClickOpen}>
                Slide in alert dialog
            </Button>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Ricerca Partita Privata"}</DialogTitle>
                <DialogContent >
                    <DialogContentText id="alert-dialog-slide-description" textAlign="center">
                        Codice Segreto: {privateCode}
                    </DialogContentText>
                    <LinearProgress  sx={{ m: 1.5}} color='inherit'/>
                </DialogContent>
                <DialogActions>
                        <Button onClick={handleClose}>Abbandona</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
