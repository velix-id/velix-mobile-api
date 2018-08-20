import {VelixIDKey} from "./key";
const Dynamodb = require('serverless-dynamodb-client');

const PARTNERS_TABLE = "VELIXID-PARTNER";

export class VelixIDPartner {

    velixID : string;

    name : string;

    logo : string;

    integrations : Array < Integration >;

    public static GetPartner(partnerID : string, token : string, cb : Function) : VelixIDPartner {

        let query = {
            TableName: PARTNERS_TABLE,
            KeyConditionExpression: "vid = :v",
            ExpressionAttributeValues: {
                ":v": partnerID
            }
        };

        Dynamodb.doc.query(query, (err, doc) => {
            if (err) {
                cb(err, doc);
            } else if (doc.Items && doc.Items.length) {
                let partner = new VelixIDPartner(doc.Items[0]);

                let mathcedIntegrations = partner
                    .integrations
                    .filter((value) => {
                        return value.keys.public === token && value.status === IntegrationStatus.ENABLED;
                    });

                if (mathcedIntegrations.length) {
                    cb(null, partner);
                } else {
                    cb(new Error("Invalid Partner Credentials"), null);
                }
            } else {
                cb(new Error("Invalid Velix.ID"), null);
            }
        });
        return null;
    }

    constructor(params : {
        vid: string,
        velixID: string,
        name: string,
        logo: string,
        integrations: Array < any >
    }) {
        this.velixID = params.vid || params.velixID;
        this.name = params.name;
        this.logo = params.logo;
        this.integrations = params
            .integrations
            .map((value) => {
                return new Integration(value);
            })
    }

    getKey() : VelixIDKey {
        return new VelixIDKey(this.velixID);
    }
}

export class Integration {

    type : IntegrationType

    label : string;

    keys : {
        private: string,
        public: string
    };

    status : IntegrationStatus;

    constructor(param : {
        type: IntegrationType,
        label: string,
        keys: {
            private: string,
            public: string
        },
        status: IntegrationStatus
    }) {
        this.type = param.type;
        this.label = param.label;
        this.keys = param.keys;
        this.status = param.status;
    }
}

export enum IntegrationType {
    WEB,
    MOBILE,
    SERVER
}

export enum IntegrationStatus {
    ENABLED,
    DISABLED
}