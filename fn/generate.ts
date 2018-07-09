import {VelixIDKey} from "../lib/velixid/key";
import {APIResponse} from "../lib/helpers/api-response";

export const invoke = (event, context, cb) => {
  let response = new APIResponse(cb);

  let payload = JSON.parse(event.body);

  let handleNewVelixID = (err, velixID) => {
    if (err) {
      response.error(err.message);
    } else {
      response.json({velixid: velixID});
    }
  }

  try {
    let newVelixID;
    if (payload.token) {
      newVelixID = VelixIDKey.generate(payload.public_key, payload.token, payload.otp, handleNewVelixID)
    } else {
      newVelixID = VelixIDKey.generateOld(payload.public_key, handleNewVelixID);
    }
  } catch (error) {
    response.error(error.message);
  }
}