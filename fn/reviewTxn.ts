import {HTMLResponse} from "../lib/helpers/html-response";
import { VelixIDPartner } from "../lib/velixid/partner";
import { VelixIDAuthRequest, VelixIDAuthRequestStatus } from "../lib/velixid/auth-request";

export const invoke = (event, context, cb) => {
    let response = new HTMLResponse(cb);
    
    let partnerToken = event.pathParameters.partnerid.split(':');
    let txnid = event.pathParameters.txnid;
    VelixIDPartner.GetPartner(partnerToken[0], partnerToken[1], (error, partner:VelixIDPartner) => {
        VelixIDAuthRequest.loadRequest(txnid, (txnerr, transaction:VelixIDAuthRequest) => {
            let html = '';
            let options:any = {
                footerstring: 'TXN ' + transaction.requestID
            };
            if (error) {
                html = `<div class="error-message">
                    <h2>Partner Error</h2>
                    <p>${error.message}</p>
                    </div>`;
            } else {

                let statusMessage = `<div>Please proceed on your app for the next steps.</div>
                <small>Waiting for you to respond on VelixID App.</small>`;


                if (VelixIDAuthRequestStatus.ACCEPTED === transaction.status) {
                    let data = JSON.parse(transaction.response.data);
                    statusMessage = `<div class="profile">
                        <div>Logged in as</div>
                        <img src="data:image/jpeg;base64,${data.image}" />
                        <h3>${data.name.value}</h3>
                    </div>
                    <script>closeMe(${transaction.response.data})</script>`;
                } else if (VelixIDAuthRequestStatus.REJECTED === transaction.status) {
                    let data = JSON.parse(transaction.response.data);
                    statusMessage = `<div>Login <strong>DENIED</strong> by user</div>
                    <script>closeMe('rejected')</script>`;
                } else {
                    options.refresh = 3;
                }

                html = `<div class="partner-logo">
                        <img src="${partner.logo}" />
                    </div>
                    <p>You are trying to login to:
                    <br/>
                    <span class="partner-name">${partner.name}</span>
                    </p>
                    ${statusMessage}
                    `       
            }

            response.popupHTML('Log in with Velix.ID', html, options);
        })
    });
}