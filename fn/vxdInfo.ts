import {HTMLResponse} from "../lib/helpers/html-response";

export const invoke = (event, context, cb) => {
    console.log(event);
    console.log(context);
    console.log(typeof cb);

    let response = new HTMLResponse(cb);

    response.html(`
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
    <div class="container">
    <header class="text-center">
        <ul class="nav nav-pills">
            <li class="nav-item">
              <a class="nav-link active" href="/vxd/address/*">Find By Address</a>
            </li>
            <li class="nav-item">
              <a class="nav-link active" href="/vxd/email/*">Find By Email</a>
            </li>
          </ul>
        </header>
    </div>
    `);
}