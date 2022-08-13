import { Avatar, Skeleton } from "@mui/material";

const UserPicture = ({ size = "64px", userPic }) => {

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

    return (
        <>
            {userPic >= 0 ? (
                <>
                    <Avatar
                        sx={{
                            width: size,
                            height: size,
                        }}
                        src={"/img/" + availablePics[userPic]}
                    ></Avatar>
                </>
            ) : (
                <>
                    <Skeleton
                        variant="circular"
                        sx={{
                            width: size,
                            height: size,
                        }}
                    />
                </>
            )}
        </>
    );
};

export default UserPicture;
