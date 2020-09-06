import jwt from 'jsonwebtoken';

export function initUserSession(id: number, name: string, username: string): string|boolean{
    const secret = process.env.JWT_SECRET;
    if(!secret) return false;

    const payload = {
        user: {
            id,
            name,
            username
        }
    }

    return jwt.sign(payload, secret, {expiresIn: 60 * 60 * 3});
}

export function validateUserSession(token: string): boolean | string | object{
    const secret = process.env.JWT_SECRET;
    if(!secret) return false;

    return jwt.verify(token, secret);
}