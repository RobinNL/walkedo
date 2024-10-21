import { NextResponse } from "next/server";

const nodemailer = require('nodemailer');

export async function POST(request: any) {
    const username = process.env.NEXT_PUBLIC_EMAIL_USERNAME;
    const password = process.env.NEXT_PUBLIC_EMAIL_PASSWORD;
    const myEmail = process.env.NEXT_PUBLIC_PERSONAL_EMAIL;

    const transporter = nodemailer.createTransport({
        host: "smtp.mail.me.com",
        port: 587,
        tls: {
            ciphers: "SSLv3",
            rejectUnauthorized: false,
        },

        auth: {
            user: username,
            pass: password
        }
    });

    try {
        const body = await request.json();

        console.log(body);
        const success = await new Promise((resolve, reject) => {
            transporter.sendMail({
                from: myEmail,
                to: myEmail,
                respondTo: body.email,
                subject: 'Walkedo Casting - Aanmelding',
                html: `
            <p>Naam: ${body.firstName} ${body.lastName} </p>
            <p>Email: ${body.email} </p>
            <p>Telefoon: ${body.phoneNr} </p>
            <p>Adres: ${body.address} </p>
            <p>Project: ${body.projectSummary} </p>
            `,
            }, (err: any, info: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(info);
                }
            })
        });
        if (success) {
            return Response.json({message: 'Success'}, {status: 200});
        } else {
            return Response.json({message: 'Conflict'}, {status: 500});
        }

    } catch (error) {
        console.log(error)
        return Response.json({
            message: 'Error'
        }, {status: 500})
    }

}


export async function GET(): Promise<any> {
    return new NextResponse('ping');
}