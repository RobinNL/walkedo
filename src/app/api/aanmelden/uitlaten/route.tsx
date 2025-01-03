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
        const mail = await transporter.sendMail({
            from: myEmail,
            to: body.email,
            bcc: myEmail,
            respondTo: body.email,
            subject: 'Walkedo Uitlaatservice - Aanmelding',
            html: `
             <p>Beste ${body.firstName},</p>
                <p>Bedankt voor je aanmelding. Ik zal zo spoedig mogelijk contact met je opnemen.</p>
                <p>Met vriendelijke groet,</p>
                <p>Walkedo</p>
                
                <p>---</p>
                
            <p>Naam: ${body.firstName} ${body.lastName} </p>
            <p>Email: ${body.email} </p>
            <p>Telefoon: ${body.phoneNr} </p>
            <p>Adres: ${body.address} </p>
            <p>Over de honden: ${body.dogSummary} </p>
            `,
        })
        return Response.json({message: 'Success'}, {status: 200});

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