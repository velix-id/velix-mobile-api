const MD5 = require('md5');

let AWS = require("aws-sdk");

AWS
    .config
    .update({region: "us-east-1"});

let ses = new AWS.SES();

export class Email {
    static generateOTPfromString(input : string) : string {
        let code = MD5(input).substr(0, 4);
        code = parseInt(code, 16)
            .toString()
            .substr(0, 4);

        return code;
    }
    static validateOTPwithString(input : string, OTP : string) : boolean {
        return Email.generateOTPfromString(input) === OTP;
    }
    constructor() {}
    send(email : string, subject : string, html : string, text : string) {
        let EmailParams = {
            Destination: {
                ToAddresses: [email]
            },
            Message: {
                Body: {
                    Text: {
                        Data: text
                    },
                    Html: {
                        Data: html
                    }
                },
                Subject: {
                    Data: subject
                }
            },
            Source: 'info@velix.id'
        };

        let label = email;
        console.log('sending Email', EmailParams);

        ses.sendEmail(EmailParams, (err, mailData) => {
            console.log("mail Sent", label, err, mailData);
        });

    }
}