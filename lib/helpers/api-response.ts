export class APIResponse {
    public responded : boolean;
    constructor(private cb : Function) {
        this.responded = false;
    }

    json(data : any) {
        if(this.responded) {
            throw "already responded";
        }

        let rawResponse = {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*", // Required for CORS support to work
                "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS
            },
            body: JSON.stringify({
                success: true,
                data: data
            }, null, "\t")
        }
        this.cb(null, rawResponse);
        this.responded = true;
    }

    error(message:String) {
        if(this.responded) {
            throw "already responded";
        }
        
        let rawResponse = {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*", // Required for CORS support to work
                "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS
            },
            body: JSON.stringify({
                success: false,
                error: message
            }, null, "\t")
        }
        this.cb(null, rawResponse);
        this.responded = true;
    }
}