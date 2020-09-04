import bcrypt from 'bcrypt';

const passCrypt = '$mh$';

export async function cryptPassword(password: string){
    return await bcrypt.hash(password + passCrypt, 10);
}

export async function checkPassword(hash: string, password: string){
    return await bcrypt.compare(password + passCrypt, hash);
}

export function cryptEmail(){

}