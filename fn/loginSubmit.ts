import {HTMLResponse} from "../lib/helpers/html-response";
import {VelixIDPartner} from "../lib/velixid/partner";
import {VelixIDAuthRequest} from "../lib/velixid/auth-request";
import {VelixIDKey} from "../lib/velixid/key";
import {Notification} from "../lib/helpers/notification";

export const invoke = (event, context, cb) => {
    let response = new HTMLResponse(cb);

    let partnerToken = event
        .pathParameters
        .partnerid
        .split(':');
    VelixIDPartner.GetPartner(partnerToken[0], partnerToken[1], (error, partner : VelixIDPartner) => {

        let partnerKey = partner.getKey();
        let userKey = new VelixIDKey(event.body.replace('velixid=', ''));

        console.log('partner', partnerKey);
        console.log('user', userKey);

        partnerKey.loadKey((partnerKeyError) => {
            if (partnerKeyError) {
                response.error(partnerKeyError);
            } else {
                userKey.loadKey((userKeyError) => {
                    if (userKeyError) {
                        response.error(userKeyError);
                    } else {
                        userKey.newAuthRequest(partnerKey, 'login', partner, null, (arError, transaction : VelixIDAuthRequest) => {
                            if (arError) {
                                response.error(arError);
                            } else {
                                Notification.sendToVelixID("Is it you trying to sign in?", "Are you trying to log in to " + transaction.partner.name + "?. Please Approve to login or Deny if its not you.", userKey, transaction.requestID, (err, data) => {
                                    if (err) {
                                        console.log("Error Sending Push Notification");
                                        console.log(err);
                                    } else {
                                        console.log("Push Notification Sent correctly", data);
                                    }
                                });
                                response.redirect(`https://api.velix.id/popup/login/${event.pathParameters.partnerid}/${transaction.requestID}`);
                            }
                        });
                    }
                })
            }
        });
    });
}