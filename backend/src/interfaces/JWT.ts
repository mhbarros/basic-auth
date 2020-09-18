import UserInterface from "./User";

export default interface JWT {
    user: UserInterface,
    iat: number,
    exp: number
}