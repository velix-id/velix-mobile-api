import {HTMLResponse} from "../../lib/helpers/html-response";
import { VelixIDPartner } from "../../lib/velixid/partner";

export const invoke = (event, context, cb) => {
    let response = new HTMLResponse(cb);

    let partnerToken = event.pathParameters.partnerid.split(':');
    VelixIDPartner.GetPartner(partnerToken[0], partnerToken[1], (error, partner:VelixIDPartner) => {
        let html = '';
        if (error) {
            html = `<div class="error-message">
                <h2>Partner Error</h2>
                <p>${error.message}</p>
            </div>`;
        } else {
            html = `<div class="partner-logo">
                    <img src="${partner.logo}" />
                </div>
                <p>You are trying to login to:
                <br/>
                <span class="partner-name">${partner.name}</span>
                </p>
                <h3>Enter your Velix.ID</h3>
                <form method="post">
                    <input type="text" name="velixid" value="V">
                    <button type="submit">Continue</button>
                    <a class="cancel" href="javascript:closeMe('cancel');">Cancel</a>
                </form>`       
        }
        response.popupHTML('Log in with Velix.ID', html);

    });



}