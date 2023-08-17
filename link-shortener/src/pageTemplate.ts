export default async function pageTemplate() {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Link Shortener</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0" />
        <style>
            body {
            background-color: #fff;
            font-family: sans-serif;
            font-size: 16px;
            text-align: center;
            line-height: 1.5;
            margin: 0;
            padding: 0;
        }

        .container {
            margin: 0 auto;
            max-width: 960px;
            padding: 0 15px;
        }

        .row {
            display: flex;
            flex-wrap: wrap;
            margin: 0 -15px;
        }

        .col-12 {
            flex: 0 0 100%;
            max-width: 100%;
            padding: 0 15px;
        }

        .link-card {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            margin: 15px 15px;
            padding: 10px 15px;
            background-color: rgb(245, 245, 245);
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
            border: 1px solid transparent;
            border-radius: 5px;
            gap: 1rem;
        }

        .link-card:hover {
            box-shadow: none;
            border: 1px solid #ccc;
        }

        @media screen and (max-width: 768px) {
            .link-card {
                flex-direction: column;
            }
            .link-section {
                width: -webkit-fill-available;
                max-width: -webkit-fill-available;
            }
            .link-copy input {
                padding: 0.4rem 0.2rem 0.4rem 0.5rem;
            }
            .link-copy span {
                padding: 0.3rem !important;
            }
        }

        @media screen and (min-width: 768px) {
            .link-section:nth-child(2), .link-section:nth-child(3) {
                max-width: 20%;
            }
            .link-title {
                max-width: 50%;
            }
        }

        .link-section {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            margin: 0 -15px;
            padding: 10px 15px;
            gap: 0.2rem;
        }

        .link-title {
            text-align: left;
            display: flex;
            align-items: flex-start;
            flex-wrap: wrap;
            flex-direction: column;
            justify-content: center;
            gap: 0.5rem;
            flex-grow: 1;
        }

        .link-title h3 {
            margin: 0 0px;
        }

        .link-stat {
            width: -webkit-fill-available;
            display: flex;
            align-items: center;
            align-content: center;
            padding: 0.3rem;
            gap: 0.5rem;

            border: 1px solid #ccc;
            border-radius: 5px;
            background-color: #fff;
            color: #000;
            cursor: pointer;
        }

        .link-stat:hover {
            background-color: #eee;
        }

        .link-header {
            display: flex;
            align-items: center;
        }

        .link-header span {
            font-size: 1.3rem;
            color: #000;
            cursor: pointer;
            height: 100%;
            padding: 0.3rem;
            display: flex;
            align-items: center;
        }

        .link-copy {
            display: flex;
            align-items: center;
            gap: 0rem;
            width: -webkit-fill-available;
        }

        .link-copy input {
            flex-grow: 1;
            width: max-content;
            height: 100%;
            border: 1px solid #ccc;
            border-radius: 5px 0px 0px 5px;
            border-right: none;
            background-color: #fff;
            color: #000;
            margin: 0.3rem 0 0.3rem 0.3rem;
            padding-right: 0.2rem;
            text-decoration: underline;
            cursor: pointer;
        }

        .link-copy input:hover {
            background-color: #eee;
        }

        .link-copy span {
            font-size: 1.1rem;
            color: #000;
            cursor: pointer;
            background-color: #fff;
            border: 1px solid #ccc;
            border-radius: 0px 5px 5px 0px;
            border-left: none;
            height: 100%;
            padding: 0.08rem;
            display: flex;
            align-items: center;
        }

        .link-copy span:hover {
            background-color: #eee;
        }
        </style>
    </head>
    <body>
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
            async function handleSubmit(form) {
                const url = form.url.value;
                const ttl = form.ttl.value;
                const result = document.getElementById('result');
                result.innerHTML = '';
                fetch('/api/links', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ url, ttl })
                })
                .then(res => res.json())
                .then(res => {
                    if (res.error !== undefined && res.error !== null) {
                        console.error(res);
                        result.innerHTML = '<p>' + res.error + '</p>';
                        return;
                    } else {
                        console.log(res);

                        // page hostname
                        const pageHostname = window.location.hostname;

                        result.innerHTML = '<p>Your new link is <a href="' + res.short_url + '" target="_blank">' + res.short_url + '</a> and will expire on ' + new Date(Date.now() + (Number(res.ttl) * 1000)).toLocaleString() + '</p>';
                    }
                })
                .catch(err => {
                    console.error(err);
                    result.innerHTML = '<p>Unknown error</p>';
                });
            }

            async function getLinks() {
                const list = document.getElementById('list');
                list.innerHTML = '<h2>Active Links:</h2><ul>';
                fetch('/api/links')
                .then(res => res.json())
                .then(res => {
                    if (res.error !== undefined && res.error !== null) {
                        console.error(res);
                        list.innerHTML = '<p>' + res.error + '</p>';
                        return;
                    } else {
                        console.log(res);
                        res.forEach(link => {
                            list.innerHTML += \`
                            <li class="link-card">
                                <div class="link-title link-section">
                                    <div class="link-header">
                                        <h3>
                                            <a href="\` + link.url + \`" target="_blank">\` + link.meta.title + \`</a>
                                        </h3>
                                        <span class="material-symbols-outlined" onclick="window.open('\` + link.url + \`', '_blank')">
                                            open_in_new
                                        </span>
                                    </div>
                                    <div class="link-copy">
                                        <input type="text" value="\` + location.protocol + \`//\` + location.host + \`/\` + link.slug + \`" onclick="window.open('\` + location.protocol + \`//\` + location.host + \`/\` + link.slug + \`', '_blank')" />
                                        <span class="material-symbols-outlined" onclick="navigator.clipboard.writeText('\` + location.protocol + \`//\` + location.host + \`/\` + link.slug + \`')">
                                            content_copy
                                        </span>
                                    </div>
                                </div>
                                <div class="link-section">
                                    <button class="link-stat" onclick="navigator.share({ title: '\` + link.meta.title + \`', url: '\` + location.protocol + \`//\` + location.host + \`/\` + link.slug + \`' })">
                                        <span class="material-symbols-outlined">
                                            share
                                        </span>
                                        Share Link
                                    </button>
                                    <button class="link-stat" onclick="navigator.clipboard.writeText('\` + location.protocol + \`//\` + location.host + \`/\` + link.slug + \`')">
                                        <span class="material-symbols-outlined">
                                            link
                                        </span>
                                        Copy Link
                                    </button>
                                    <button class="link-stat" onclick="window.open('\` + location.protocol + \`//\` + location.host + \`/api/links/\` + link.slug + \`/qr\` + \`', '_blank')">
                                        <span class="material-symbols-outlined">
                                            qr_code_scanner
                                        </span>
                                        QR Code
                                    </button>
                                </div>
                                <div class="link-section">
                                    <div class="link-stat">
                                        <span class="material-symbols-outlined">
                                            trending_up
                                        </span>
                                        \` + link.hits + \` views
                                    </div>
                                    <div class="link-stat">
                                        <span class="material-symbols-outlined">
                                            hourglass_empty
                                        </span>
                                        Expires \` + new Date(link.expiration * 1000).toLocaleDateString() + \`
                                    </div>
                                    <button class="link-stat" onclick="deleteLink('\` + link.slug + \`')">
                                        <span class="material-symbols-outlined">
                                            delete_forever
                                        </span>
                                        Delete
                                    </button>
                                </div>
                            </li>\`;
                        });
                        list.innerHTML += '</ul>';
                    }
                })
                .catch(err => {
                    console.error(err);
                    list.innerHTML = '<p>Unknown error</p>';
                });
            }

            async function deleteLink(slug) {
                fetch('/api/links/' + slug, {
                    method: 'DELETE'
                })
                .then(res => res.json())
                .then(res => {
                    if (res.error !== undefined && res.error !== null) {
                        console.error(res);
                        alert(res.error);
                        return;
                    } else {
                        console.log(res);
                        alert('Link deleted');
                    }
                })
                .catch(err => {
                    console.error(err);
                    alert('Unknown error');
                });
                getLinks();
            }

            getLinks();
        </script>
    </body>
    `;
}