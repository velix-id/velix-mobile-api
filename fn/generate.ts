import { VelixIDKey } from "../lib/velixid/key";
import { APIResponse } from "../lib/helpers/api-response";

export const invoke = (event, context, cb) => {
  let response = new APIResponse(cb);
  
  let publicKey = JSON.parse(event.body).public_key;

  try {
    let newVelixID = VelixIDKey.generate(publicKey, (err, velixID) => {
      if (err) {
        response.error(err.message);
      } else {
        response.json({
          velixid: velixID
        });
      }
    });
  } catch (error) {
    response.error(error.message);
  }
}
