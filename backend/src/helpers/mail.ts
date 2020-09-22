import nodemailer from 'nodemailer';

import {v4 as uuid} from 'uuid';
import {generateForgotPasswordLink} from "./auth";

const config = {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
}

const account = nodemailer.createTransport(config);

export const sendMail = async (to: string, subject: string, text: string) => {
    const html = `
    <div style="border: 1px solid #5172f0;border-radius: 8px;padding: 10px">
        ${text}
    </div>
    `;

    return await account.sendMail({
        from: '"Marcelo Barros" marcelo@notasparamoedas.com.br',
        to,
        subject,
        html,

    })
}

export async function sendForgotPasswordMail(to: string):Promise<string | boolean>{
    const recoverURL = await generateForgotPasswordLink(to);
    if(!recoverURL) return false;

    const text = `Para recuperar seu acesso, clique no link abaixo:<br/>${recoverURL}`;

    return await sendMail(to, 'Recuperação de senha', text);
}