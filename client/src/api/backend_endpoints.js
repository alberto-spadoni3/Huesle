//User Management
export const BACKEND_LOGIN_ENDPOINT = "/user/login";
export const BACKEND_SETTINGS_ENDPOINT = "/setting/profileSetting";
export const BACKEND_REGISTRATION_ENDPOINT = "/user/register";
export const BACKEND_UPDATE_USERNAME = "/setting/updateUsername";
export const BACKEND_UPDATE_EMAIL = "/setting/updateEmail";
export const BACKEND_UPDATE_PASSWORD_ENDPOINT = "/setting/updatePassword";
export const BACKEND_REFRESH_TOKEN_ENDPOINT = "/user/refreshToken";
export const BACKEND_LOGOUT_ENDPOINT = "/user/logout";
export const BACKEND_DELETE_USER_ENDPOINT = "/user/delete";

//Match Search
export const BACKEND_SEARCH_MATCH_ENDPOINT = "/search/searchMatch";
export const BACKEND_JOIN_PRIVATE_MATCH_ENDPOINT = "/search/joinPrivateMatch";

//Game Moves
export const BACKEND_GET_MATCH_ENDPOINT = "/game/getMatch";
export const BACKEND_DO_GUESS_ENDPOINT = "/game/doGuess";
export const BACKEND_LEAVE_MATCH_ENDPOINT = "/game/leaveMatch";

//Socket
export const BACKEND_SOCKET_ENDPOINT = "http://localhost:8081";

//Stats Management
export const BACKEND_GET_MATCHES_ENDPOINT = "/stats/allMatches";
export const BACKEND_UPDATE_USERPIC_ENDPOIND = "/setting/profilePics";
export const BACKEND_GET_USER_STATS_ENDPOINT = "/stats/userStats";

//Password Reset
export const BACKEND_FORGOT_PASSWORD_ENDPOINT = "/user/forgotPassword";
export const BACKEND_CHECK_REQUEST_TOKEN_ENDPOINT = "/user/checkRequestToken";
export const BACKEND_RESET_PASSWORD_ENDPOINT = "/user/resetPassword";

//Notifications
export const BACKEND_NOTIFICATIONS_ENDPOINT = "/stats/notifications";
export const BACKEND_NEW_NOTIFICATIONS_ENDPOINT = "/stats/newNotifications";
