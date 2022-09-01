import {UserModel} from "../model/UserModel.js";

export async function findUserId(username) {
    const account = await UserModel.findOne({ username: username }, "_id");
    if (!account) return;
    else return account._id.toString();
}

export async function findUsername(id) {
    const name = await UserModel.findById(id, ["username"]);
    return name?.username;
}
