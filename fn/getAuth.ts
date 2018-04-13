import { APIResponse } from "../lib/helpers/api-response";
import { VelixIDAuthRequest } from "../lib/velixid/auth-request";

export const invoke = (event, context, cb) => {
  let response = new APIResponse(cb);

  let requestId = event.pathParameters.authid;

  VelixIDAuthRequest.loadRequest(requestId, (err, request:VelixIDAuthRequest) => {
    if (err) {
      response.error(err.message);
    } else {
      let outReq = request.toJSON();
      let fields = [];
      switch (request.type) {
        case "basic": 
        fields.push({
          name: 'name',
          label: 'Name'
        });
        fields.push({
          name: 'email',
          label: 'Email'
        });
        fields.push({
          name: 'phone',
          label: 'Phone Number'
        });
      }
      outReq["fields"] = fields;
      response.json(outReq);
    }
  });
};
