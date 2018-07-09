import { isNumber } from "util";

export class HTMLResponse {
    public responded : boolean;
    constructor(private cb : Function) {
        this.responded = false;
    }
    
    redirect(url: any): any {
        if(this.responded) {
            throw "already responded";
        }
        
        let rawResponse = {
            statusCode: 303,
            headers: {
                "Location": url
            },
            body: 'Redirecting to ' + url
        }
        this.cb(null, rawResponse);
        this.responded = true;
    }

    html(data : string) {
        if(this.responded) {
            throw "already responded";
        }
        
        let rawResponse = {
            statusCode: 200,
            headers: {
                "content-type": "text/html"
            },
            body: data
        }
        this.cb(null, rawResponse);
        this.responded = true;
    }

    popupHTML(title: string, content:string, options:any = null) {
        let refresh = '';
        let footerstring = '';

        if(options && isNumber(options.refresh)) {
            if (options.refreshURL) {
                refresh = `<meta http-equiv="refresh" content="${options.refresh}; url=${options.refreshURL}">`
            } else {
                refresh = `<meta http-equiv="refresh" content="${options.refresh}">`
            }
        }

        if(options && options.footerstring) {
            footerstring = ' | ' + options.footerstring;
        }

        let html = `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="X-UA-Compatible" content="ie=edge">
                ${refresh}
                <title>Login with Velix.ID</title>
                <style>
                body {
                    margin: 0px;
                    font-family: lato,Arial,Helvetica,sans-serif;
                }
                header {
                    font-family: lato,Arial,Helvetica,sans-serif;
                    background: -webkit-linear-gradient(bottom,#00245a,#090b23);
                    color: #ffffff;
                    line-height: 50px;
                    padding: 0px 15px;
                }
        
                section {
                    padding: 15px;
                    text-align: center;
                }
        
                form {
            
                }
        
                input[type="text"] {
                    border-style: hidden;
                    padding: 8px 15px;
                    border-bottom: 1px solid #aaa;
                    outline: none;
                    font-weight: 300;
                    font-size: 24px;
                    text-align: center;
                    text-transform: uppercase;
                    background: #fff;
                    -webkit-box-shadow: 0 0 2px 0 rgba(0,0,0,.3);
                    box-shadow: 0 0 2px 0 rgba(0,0,0,.3);
                    display: block;
                    text-align: left;
                    margin: 15px auto;
                }
        
                button {
                    margin-top: 15px;
                    font-size: 16px;
                    font-family: Lato,Arial,Helvetica,sans-serif;
                    font-weight: 300;
                    color: #fff;
                    background-color: #007aff;
                    padding: 15px 28px;
                    -webkit-box-shadow: 0 0 2px 0 rgba(0,0,0,.5);
                    box-shadow: 0 0 2px 0 rgba(0,0,0,.5);
                    border-radius: 5px;
                    border-color: #007aff;
                    outline: none;
                    text-transform: uppercase;
                    display: block;
                    margin: auto;
                }
        
                a.cancel {
                    font-family: Lato,Arial,Helvetica,sans-serif;
                    font-weight: 300;
                    font-size: 14px;
                    color: #888;
                    display: inline-block;
                    margin: 15px auto 0px;
                }
        
                footer {
                    font-family: Lato,Arial,Helvetica,sans-serif;
                    font-weight: 300;
                    font-size: 12px;
                    color: #888;
                    padding: 15px;
                    text-align: center;
                }

                .partner-logo {
                    width: 100px;
                    background: white;
                    height: 100px;
                    margin: 0px auto;
                    overflow: hidden;
                    padding: 5px;
                    -webkit-box-shadow: 0 0 2px 2px rgba(0,0,0,0.3);
                    box-shadow: 0 0 2px 2px rgba(0,0,0,0.3);
                    border-radius: 5px;
                }

                .partner-logo img {
                    width: 100%;
                    height: 100%;
                }

                .partner-name {
                    display: inline-block;
                    margin-top: 15px;
                    font-weight: 800;
                }

                .error-message {
                    border: 1px solid rgba(255,0,0,0.5);
                    border-radius: 5px;
                    padding: 15px;
                    background: rgba(255,0,0,0.1);
                    text-align: left;
                }
        
                .error-message h2 {
                    margin: 0px;
                    font-size: 16px;
                }

                .error-message p {
                    margin: 5px 0px;
                    font-size: 12px;
                    color: red;
                }

                .profile {
                    display: block;
                }
                .profile div {
                    text-align: center;
                    margin: 10px;
                    font-size: 12px;
                    font-weight: bold;
                }
                .profile img {
                    width: 70px;
                    background: white;
                    height: 70px;
                    margin: 0px auto;
                    overflow: hidden;
                    padding: 5px;
                    -webkit-box-shadow: 0 0 2px 2px rgba(0,0,0,0.3);
                    box-shadow: 0 0 2px 2px rgba(0,0,0,0.3);
                    border-radius: 50%;
                }

                .profile h3 {
                    margin: 5px auto;
                }
            </style>
            <script>
                function closeMe(message) {
                    sendMessage(message, true);
                }
                
                function sendMessage(message, close) {
                    window.opener.postMessage({ close: close, data: message}, "*");
                }
            </script>
            </head>
            <body>
                <div>
                    <header>
                        <img src="" alt="">
                        ${title}
                    </header>
                    <section>
                    ${content}    
                    </section>
                    <footer>
                        Velix.ID${footerstring}
                    </footer>
                </div>
            </body>
            </html>`;

        this.html(html);
    }

    error(error:Error, code: number = 500) {
        if(this.responded) {
            console.log('Throwing Already responded error');
            
            throw "already responded";
        }
        
        let rawResponse = {
            statusCode: code,
            headers: {
                "content-type": "text/plain"
            },
            body: [error.name, error.message, error.stack.toString()].join('\n\n')
        }
        this.cb(null, rawResponse);
        this.responded = true;
    }
}