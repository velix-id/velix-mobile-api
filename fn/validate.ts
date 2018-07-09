import {Email} from "../lib/helpers/email";
import {APIResponse} from "../lib/helpers/api-response";

const JWT = require('jsonwebtoken');

export const invoke = (event, context, cb) => {
    let data = JSON.parse(event.body);

    let token = JWT.sign({
        name: data.name,
        email: data.email
    }, data.name + data.email);

    let OTP = Email.generateOTPfromString(token);

    let html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif">
    <p>Hi ${data.name},</p>
    <p>This email contains your OTP code to complete your account creation on Velix.ID.</p>
    <div style="font-size: 26px; font-family: 'Courier New', Courier, monospace; text-align: center;">${OTP}</div>
    <p>If you did not make this signup attempt, please ignore this email.</p>
    <p>
    Thank you,<br>
    Velix.ID
    </p>
    </div>
    `;

    let text = `
    Hi ${data.name},

    This email contains your OTP code to complete your account creation on Velix.ID.

    OTP: ${OTP}

    If you did not make this signup attempt, please ignore this email.

    Thank you,
    Velix.ID
    `;

    let subject = 'Velix.ID OTP';

    let email = new Email();

    email.send(data.email, subject, html, text);

    let response = new APIResponse(cb);

    response.json({token: token});

    // Generate JWT geenrate OTP from JWT send OTP to email

};