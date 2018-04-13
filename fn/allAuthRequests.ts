import { APIResponse } from "../lib/helpers/api-response";

export const invoke = (event, context, cb) => {
  let response = new APIResponse(cb);
  response.error("Not implimented");
}
