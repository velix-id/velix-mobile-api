import { VelixIDKey } from "../lib/velixid/key";
import { APIResponse } from "../lib/helpers/api-response";
import { VelixIDAuthRequest } from "../lib/velixid/auth-request";
import { Notification } from "../lib/helpers/notification";

export const invoke = (event, context, cb) => {
  let response = new APIResponse(cb);
  let velixID = event.pathParameters.velixid;
  let body = JSON.parse(event.body);

  let toKey = new VelixIDKey(velixID);
  let fromKey = new VelixIDKey(body.from);

  fromKey.loadKey(fromErr => {
    if (fromErr) {
      response.error(fromErr.message);
    } else {
      toKey.loadKey(toErr => {
        if (toErr) {
          response.error(toErr.message);
        } else {
          toKey.newAuthRequest(
            fromKey,
            body.type,
            body.partner,
            body.data,
            (arErr, authRequest: VelixIDAuthRequest) => {
              if (arErr) {
                response.error(arErr.message);
              } else {
                Notification.sendToVelixID(
                  authRequest.partner.name + " is requesting your information",
                  authRequest.partner.name + " has sent you an Authentication request using your Velix.ID. Please Approve or Deny the request.",
                  toKey,
                  authRequest.requestID,
                  (err, data) => {
                    if (err) {
                        console.log("Error Sending Push Notification");
                        console.log(err);
                    } else {
                        console.log("Push Notification Sent correctly", data);
                    }
                  }
                );
                response.json(authRequest);
              }
            }
          );
        }
      });
    }
  });
};
