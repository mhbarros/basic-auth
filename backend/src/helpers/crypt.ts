import bcrypt from 'bcrypt';

const passCrypt = '$mh$';

export async function hashPassword(password: string){
    return await bcrypt.hash(password + passCrypt, 10);
}

export async function checkPassword(password: string, hash: string){
    return await bcrypt.compare(password + passCrypt, hash);
}