import ArrowLeftRoundedIcon from "@mui/icons-material/ArrowLeftRounded";
import ArrowRightRoundedIcon from "@mui/icons-material/ArrowRightRounded";
import { Stack, IconButton, Skeleton, Button } from "@mui/material";
import { useEffect, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { BACKEND_UPDATE_USERPIC_ENDPOIND } from "../api/backend_endpoints";
import { useSnackbar } from "notistack";
import UserPicture from "./UserPicture";
import useAuth from "../hooks/useAuth";

const UserPictureSelector = ({ size }) => {
    const { enqueueSnackbar } = useSnackbar();
    const axiosPrivate = useAxiosPrivate();
    const { auth, setAuth } = useAuth();

    const [picSelector, setPicSelector] = useState(auth.profilePicID? auth.profilePicID: 0);
    const availablePics = [
        "fran-FNCNNGESmPg-unsplash.jpg",
        "irish83-0A6bEhfE6B0-unsplash.jpg",
        "janko-ferlic-sfL_QOnmy00-unsplash.jpg",
        "k-k-LZW0_GQGBFM-unsplash.jpg",
        "levi-loot-O1BwdrrZWfg-unsplash.jpg",
        "luka-e-ryJZpXk79qE-unsplash.jpg",
        "michael-2v1xGvytGfw-unsplash.jpg",
        "prometheus-design-Xqnf71EKEc8-unsplash.jpg",
        "yaroslav-melnychuk-uOz_-zNdWpM-unsplash.jpg",
    ];

    const [currentUserPic, setCurrentUserPic] = useState(auth.profilePicID);

    const changePic = (up = false) => {
        let newPicID = up ? picSelector + 1 : picSelector - 1;
        if (newPicID < 0 || newPicID >= availablePics.length) return;
        setPicSelector(newPicID);
    };

    const updateUserPicture = async () => {
        try {
            const response = await axiosPrivate.put(
                BACKEND_UPDATE_USERPIC_ENDPOIND,
                JSON.stringify({ profilePicID: picSelector })
            );

            if (response.status === 200) {
                setCurrentUserPic(picSelector);
                enqueueSnackbar(response.data.message, { variant: "success" });
                setAuth({...auth, profilePicID: picSelector});
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        /*const loadUserPic = async () => {
            try {
                const response = await axiosPrivate.get(
                    BACKEND_UPDATE_USERPIC_ENDPOIND
                );
                const { userPicID } = response.data;
                setPicSelector(userPicID? userPicID: -1);
                setCurrentUserPic(userPicID);
            } catch (error) {
                console.log(error);
            }
        };
        loadUserPic();
        */
    }, []);

    return (
        <>
            <Stack direction="row" alignItems="center">
                {picSelector !== -1 ? (
                    <>
                        <IconButton
                            aria-label="select left image"
                            disabled={picSelector === 0}
                            onClick={() => changePic()}
                        >
                            <ArrowLeftRoundedIcon fontSize="large" />
                        </IconButton>
                        <UserPicture size={200} userPic={picSelector}/>
                        <IconButton
                            aria-label="select right image"
                            disabled={
                                picSelector === availablePics.length - 1
                            }
                            onClick={() => changePic(true)}
                        >
                            <ArrowRightRoundedIcon fontSize="large" />
                        </IconButton>
                    </>
                ) : (
                    <>
                        <Skeleton
                            variant="circular"
                            width={12}
                            height={12}
                            sx={{ margin: 3 }}
                        />
                        <Skeleton
                            variant="circular"
                            width={size}
                            height={size}
                        />
                        <Skeleton
                            variant="circular"
                            width={12}
                            height={12}
                            sx={{ margin: 3 }}
                        />
                    </>
                )}
            </Stack>
            <Button
                variant="outlined"
                disabled={currentUserPic === picSelector}
                sx={{ mt: 1.5, mb: 1.5 }}
                onClick={updateUserPicture}
            >
                Update picture
            </Button>
        </>
    );
};

export default UserPictureSelector;
