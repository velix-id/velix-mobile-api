import {VelixIDAuthRequest, VelixIDAuthRequestStatus} from "./auth-request";
import {Email} from "../helpers/email";

let AWS = require("aws-sdk");
AWS
  .config
  .update({region: "us-east-1"});

const AUTHS_TABLE = "VELIXID-AUTHS";
const MAPPING_TABLE = "VELIXID-MAPPING";

export class VelixIDKey {

  public static generateOld(publicKey : string, cb : Function) {
    var newVelixID = "V";
    // var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var possible = "0123456789";

    for (var i = 0; i < 7; i++) 
      newVelixID += possible.charAt(Math.floor(Math.random() * possible.length));
    
    let now = Date
      .now()
      .toString();

    let params = {
      TableName: MAPPING_TABLE,
      Item: {
        vid: newVelixID,
        pubkey: publicKey,
        createdOn: now
      }
    };

    let docClient = new AWS
      .DynamoDB
      .DocumentClient();

    docClient.put(params, (err, doc) => {
      if (err) {
        throw "ERROR: " + err.message;
      } else {
        cb(null, newVelixID);
      }
    });
  }

  public static generate(publicKey : string, token : string, otp : string, cb : Function) {

    if (Email.validateOTPwithString(token, otp)) {
      var newVelixID = "V";
      // var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      var possible = "0123456789";

      for (var i = 0; i < 7; i++) 
        newVelixID += possible.charAt(Math.floor(Math.random() * possible.length));
      
      let now = Date
        .now()
        .toString();

      let params = {
        TableName: MAPPING_TABLE,
        Item: {
          vid: newVelixID,
          pubkey: publicKey,
          createdOn: now
        }
      };

      let docClient = new AWS
        .DynamoDB
        .DocumentClient();

      docClient.put(params, (err, doc) => {
        if (err) {
          throw "ERROR: " + err.message;
        } else {
          cb(null, newVelixID);
        }
      });
    } else {
      cb(new Error('Invalid OTP'), null);
    }
  }

  velixID : string;
  publicKey : string;

  docClient : any;

  /**
   * Consturctor for VelixIDKey
   */
  constructor(velixID : string) {
    this.velixID = velixID;
    this.docClient = new AWS
      .DynamoDB
      .DocumentClient();
  }

  /**
   * Load the velix.ID public key into current instance.
   * @param cb {Funtion} callback function
   */
  public loadKey(cb : Function) : any {
    let query = {
      TableName: MAPPING_TABLE,
      KeyConditionExpression: "vid = :v",
      ExpressionAttributeValues: {
        ":v": this.velixID
      }
    };

    console.log('query', query);

    this
      .docClient
      .query(query, (err, doc) => {
        if (err) {
          cb(err, doc);
        } else if (doc.Items && doc.Items.length) {
          this.velixID = doc.Items[0].vid;
          this.publicKey = doc.Items[0].pubkey;
          cb(null, doc.Items[0]);
        } else {
          cb(new Error("Invalid Velix.ID (" + this.velixID + ")"), null);
        }
      });
  }

  public newAuthRequest(fromKey : VelixIDKey, type : string, partner : any, data : any, cb : Function) : any {
    let now = Date.now();

    let request = new VelixIDAuthRequest();

    request.to = this;
    request.from = fromKey;
    request.createdOn = now;
    request.updateOn = now;
    request.type = type;
    request.response = {
      requestAccepted: false,
      data: false
    };
    if (partner) {
      request.partner = {
        logo: partner.logo || '',
        name: partner.name
      }
    }

    request.status = VelixIDAuthRequestStatus.NEW;
    request.requestID = this.velixID + "-" + fromKey.velixID + "-" + now;

    let params = {
      TableName: AUTHS_TABLE,
      Item: request.toJSON()
    };

    this
      .docClient
      .put(params, (err, doc) => {
        if (err) {
          throw "ERROR: " + err.message;
        } else {
          cb(null, request);
        }
      });
  }

  public encrypt(input : string) : string {throw "Not implimented";}

  public decrypt(input : string) : string {throw "Not implimented";}

  public sign(input : string) : string {throw "Not implimented";}

  public verify(input : string, signature : string) : boolean {throw "Not implimented";}
}
