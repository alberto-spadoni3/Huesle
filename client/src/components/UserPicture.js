import { Avatar, Skeleton } from "@mui/material";

const UserPicture = ({ size = "64px", userPic }) => {
    const pictureURL = userPic === 0 ? "" : `/img/profile-pic-${userPic}.jpg`;

    return (
        <>
            {userPic >= 0 ? (
                <>
                    <Avatar
                        sx={{
                            width: size,
                            height: size,
                        }}
                        imgProps={{ alt: `profile picture ${userPic}` }}
                        src={pictureURL}
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
