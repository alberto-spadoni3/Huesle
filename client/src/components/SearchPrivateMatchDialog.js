import React, {useState , useEffect} from "react";
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import axiosPrivate from "../api/axios";
import { BACKEND_SEARCH_PRIVATE_MATCH_ENDPOINT } from "../api/backend_endpoints";
import {useSnackbar} from "notistack";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function SearchPrivateMatchDialog({connectOpen, setConnectOpen}) {

    const [searchPrivateOpen, setSearchPrivateOpen] = useState(false);
    const [secretCode, setSecretCode] = useState("");
    const {enqueueSnackbar} = useSnackbar();

    const generateMatch = async () => {
        setConnectOpen(true);
        try {
            const username = "pappa";
            const secret = true;
            const response = await axiosPrivate.post(
                BACKEND_SEARCH_PRIVATE_MATCH_ENDPOINT,
                JSON.stringify({username, secret}),
                {
                    headers: {"Content-Type": "application/json"},
                    withCredentials: true,
                }
            );
            return response;
        }catch (error) {
            enqueueSnackbar("Error in comunicating with Server", {
                variant: "error",
                autoHideDuration: 2500,
            });
            setConnectOpen(false);
        }
    }

    const handleClose =  async (event) => {
        event.preventDefault();

        try {
            const username = "pappa";
            const response = await axiosPrivate.delete(
                BACKEND_SEARCH_PRIVATE_MATCH_ENDPOINT,
                {
                    headers: {"Content-Type": "application/json"},
                    withCredentials: true,
                    data: JSON.stringify({username})
                }
            );
            enqueueSnackbar("Stopped hosting the private match", {
                variant: "success",
                autoHideDuration: 2500,
            });
        }catch (error) {
            if (!error?.response) {
                console.log(error)
            }
        }
        setSearchPrivateOpen(false);
    };

    useEffect(() => {
        if(connectOpen) {
            generateMatch().then((response) => {
                if(response) {
                    setSecretCode(response.data.secretCode);
                    setConnectOpen(false);
                    setSearchPrivateOpen(true);
                    enqueueSnackbar("Match created successfully", {
                        variant: "success",
                        autoHideDuration: 2500,
                    });
                }
            });
        }
    }, [connectOpen])

    return (
        <div>
            <Dialog
                open={connectOpen}
                TransitionComponent={Transition}
                keepMounted
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Ricerca Partita Privata"}</DialogTitle>
                <DialogContent >
                    <DialogContentText id="alert-dialog-slide-description" textAlign="center">
                        Generating New Match...
                    </DialogContentText>
                    <LinearProgress  sx={{ m: 1.5}} color='inherit'/>
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
                <DialogContent >
                    <DialogContentText id="alert-dialog-slide-description" textAlign="center">
                        Codice Segreto: {secretCode}
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
