export default interface User {
    id: number,
    name: string,
    username: string,
    password?: string,
    email?: string,
    gender?: string,
    uuid?: string
}