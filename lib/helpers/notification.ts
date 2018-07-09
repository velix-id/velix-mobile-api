import {VelixIDKey} from "../velixid/key";
import * as request from "request";

export class Notification {
  constructor() {}
  static sendToVelixID(title : string, body : string, toKey : VelixIDKey, data : any, cb : Function) {
    var options = {
      method: "POST",
      url: "https://us-central1-velix-mobile.cloudfunctions.net/sendNotification",
      headers: {
        "cache-control": "no-cache",
        key: "vbkdshajfgrwhofiqvreg79wequobvr2f9uoqfberg392f8hqeobvur92oeqbv2",
        "content-type": "application/json"
      },
      body: {
        to: toKey.velixID,
        title: title,
        notificationBody: body,
        data: {
          requestId: data
        }
      },
      json: true
    };

    request(options, function (error, response, body) {
      if (error) {
        cb(error, response);
      } else {
        cb(null, body);
      }
    });
  }
}
