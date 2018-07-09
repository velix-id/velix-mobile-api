import {VelixIDKey} from "./key";

let AWS = require("aws-sdk");
AWS
  .config
  .update({region: "us-east-1"});

const AUTHS_TABLE = "VELIXID-AUTHS";

export enum VelixIDAuthRequestStatus {
  NEW,
  CANCELED,
  REJECTED,
  ACCEPTED
}

export class VelixIDAuthRequest {
  requestID : string;
  to : VelixIDKey;
  from : VelixIDKey;
  partner : {
    name: string,
    logo: string
  };
  type : string;
  createdOn : number;
  updateOn : number;
  status : VelixIDAuthRequestStatus;
  response : {
    requestAccepted: boolean;
    data: any;
  };

  static loadRequest(requestID : string, cb : Function) : any {
    // JM88WRIB-TKJYZHRS-1523207582145
    let requestParams = requestID.split("-");

    let params = {
      TableName: AUTHS_TABLE,
      Key: {
        vid: requestParams[0],
        AUTH_REQUEST_ID: requestID
      }
    };

    let docClient = new AWS
      .DynamoDB
      .DocumentClient();

    docClient.get(params, (err, doc) => {
      if (err) {
        cb(err, null);
      } else {
        cb(null, new VelixIDAuthRequest(doc.Item));
      }
    });
  }

  constructor(data : any = null) {
    if (data) {
      this.createdOn = data.createdOn;
      this.from = new VelixIDKey(data.from);
      this.to = new VelixIDKey(data.vid);
      this.requestID = data.AUTH_REQUEST_ID;
      this.response = {
        requestAccepted: data.response.requestAccepted,
        data: data.response.data
      }
      this.status = data.status;
      this.type = data.type;
      this.updateOn = data.updateOn;
      if (data.partner) {
        this.partner = data.partner;
      }
    }

  }

  update(newStatus : VelixIDAuthRequestStatus, data : any, cb : Function) {
    let now = Date.now();
    let params = {
      TableName: AUTHS_TABLE,
      Key: {
        vid: this.to.velixID,
        AUTH_REQUEST_ID: this.requestID
      },
      UpdateExpression: "set #r = :r, #s = :s, #u = :u",
      ExpressionAttributeNames: {
        "#r": "response",
        "#s": "status",
        "#u": "updatedOn"
      },
      ExpressionAttributeValues: {
        ":r": {
          requestAccepted: newStatus === VelixIDAuthRequestStatus.ACCEPTED,
          data: data
        },
        ":s": newStatus,
        ":u": now.toString()
      }
    };

    let docClient = new AWS
      .DynamoDB
      .DocumentClient();
    docClient.update(params, (err, doc) => {
      if (err) {
        throw "ERROR: " + err.message;
      } else {
        this.response.data = data;
        this.response.requestAccepted = newStatus === VelixIDAuthRequestStatus.ACCEPTED;
        this.updateOn = now;
        cb(null, this);
      }
    });
  }

  toJSON() : any {
    let pObj = {
      name: this.partner.name
    };

    if (this.partner.logo) {
      pObj['logo'] = this.partner.logo;
    }
    return {
      AUTH_REQUEST_ID: this.requestID,
      vid: this.to.velixID,
      from: this.from.velixID,
      type: this.type,
      createdOn: this.createdOn,
      updateOn: this.updateOn,
      status: this
        .status
        .toString(),
      response: {
        requestAccepted: this.response.requestAccepted,
        data: this.response.data
      },
      partner: pObj
    };
  }
}
