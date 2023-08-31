import stylesheet from './page-assets/styles';
import scripts from './page-assets/scripts.js';

const style = stylesheet();
const script = scripts();

export default async function pageTemplate() {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Link Shortener</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0" />
        <link rel="icon" href="https://fav.farm/🔗" />
        <style>
            ` + style + `
        </style>
    </head>
    <body>
        <template id="link-item"></template>
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <h1>Link Shortener</h1>
                    <form action="javascript:;" onsubmit="handleSubmit(this)">
                        <input type="url" name="url" placeholder="URL" />
                        <select name="ttl" id="ttl">
                            <option value="7776000">90 days</option>
                            <option value="10800">3 hours</option>
                            <option value="86400">1 day</option>
                            <option value="2592000">30 days</option>
                            <option value="31536000">1 year</option>
                            <option value="315360000">10 years</option>
                        </select>
                        <input type="submit" value="Submit" />
                    </form>
                    <div id="result"></div>
                </div>
                <div class="col-12" id="list"></div>
            </div>
        </div>
        <script>
            ` + script + `
        </script>
    </body>
    `;
}