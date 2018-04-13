import { APIResponse } from "../lib/helpers/api-response";
import { VelixIDAuthRequest, VelixIDAuthRequestStatus } from "../lib/velixid/auth-request";

export const invoke = (event, context, cb) => {
  let response = new APIResponse(cb);

  let requestId = event.pathParameters.authid;

  VelixIDAuthRequest.loadRequest(requestId, (err, request:VelixIDAuthRequest) => {
    if (err) {
      response.error(err.message);
    } else {
      let eventBody = JSON.parse(event.body);
      let action = eventBody.action;
      let data = eventBody.data;
      let status:VelixIDAuthRequestStatus;

      if (action === 'ACCEPT') {
        status = VelixIDAuthRequestStatus.ACCEPTED;
      } else if (action === 'REJECT' || action === 'DENY') {
        status = VelixIDAuthRequestStatus.REJECTED;
      } else {
        status = VelixIDAuthRequestStatus.CANCELED;
      }
      
      request.update(status, data, (err, data) => {
        response.json(request);
      });
    }
  });
};
