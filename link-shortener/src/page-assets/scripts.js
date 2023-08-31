function scripts() {
	return `
    customElements.define('link-item', class extends HTMLElement {
        constructor() {
            super();

            this.data = {
                title: this.getAttribute('link-title'),
                short_url: this.getAttribute('short-url'),
                true_url: this.getAttribute('true-url'),
                slug: this.getAttribute('slug'),
                hits: this.getAttribute('hits'),
                expiration: this.getAttribute('expiration'),
            };

            const template = document.getElementById('link-item');
            const templateContent = template.content;

            const shadowRoot = this.attachShadow({mode: 'open'});

            // add google material icons
            const link = document.createElement('link');
            link.setAttribute('rel', 'stylesheet');
            link.setAttribute('href', 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0');
            shadowRoot.appendChild(link);
            
            // add styles
            const style = document.createElement('style');
            style.textContent = \`
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
                    .link-section:nth-child(2),
                    .link-section:nth-child(3) {
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

                    font-size: 0.9rem;
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
                    margin: 0.3rem 0 0.3rem 0rem;
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
            \`;
            shadowRoot.appendChild(style);

            // add template
            const linkItem = document.createElement('div');
            linkItem.innerHTML = \`
            <li class="link-card">
                <div class="link-title link-section">
                    <div class="link-header">
                        <h3>
                            <a target="_blank"></a>
                        </h3>
                        <span class="material-symbols-outlined">
                            open_in_new
                        </span>
                    </div>
                    <div class="link-copy">
                        <input type="text">
                        <span class="material-symbols-outlined">
                            content_copy
                        </span>
                    </div>
                </div>
                <div class="link-section">
                    <button class="link-stat">
                        <span class="material-symbols-outlined">
                            share
                        </span>
                        Share Link
                    </button>
                    <button class="link-stat">
                        <span class="material-symbols-outlined">
                            link
                        </span>
                        Copy Link
                    </button>
                    <button class="link-stat">
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
                        0 views
                    </div>
                    <div class="link-stat">
                        <span class="material-symbols-outlined">
                            hourglass_empty
                        </span>
                        Expires
                    </div>
                    <button class="link-stat">
                        <span class="material-symbols-outlined">
                            delete_forever
                        </span>
                        Delete
                    </button>
                </div>
            </li>
            \`;

            shadowRoot.appendChild(linkItem);



            shadowRoot.appendChild(templateContent.cloneNode(true));


            // add data
            const clampedTitle = this.data.title.length > 30 ? this.data.title.substring(0, 30) + '...' : this.data.title;
            const linkHeader = shadowRoot.querySelector('.link-header');
            linkHeader.innerHTML = \`
                <h3>
                    <a target="_blank" href="\` + this.data.true_url + \`">
                        \` + clampedTitle + \`
                    </a>
                </h3>
                <span class="material-symbols-outlined">
                    open_in_new
                </span>
            \`;

            const linkCopy = shadowRoot.querySelector('.link-copy input');
            linkCopy.setAttribute('value', this.data.short_url);
            linkCopy.setAttribute('onclick', 'window.open("' + this.data.short_url + '", "_blank")');

            const linkCopySpan = shadowRoot.querySelector('.link-copy span');
            linkCopySpan.setAttribute('onclick', 'navigator.clipboard.writeText("' + this.data.short_url + '")');

            const linkStat = shadowRoot.querySelectorAll('.link-stat');
            linkStat[0].setAttribute('onclick', 'navigator.share({ title: "' + this.data.title + '", url: "' + this.data.short_url + '" })');
            linkStat[1].setAttribute('onclick', 'navigator.clipboard.writeText("' + this.data.short_url + '")');
            linkStat[2].setAttribute('onclick', 'window.open("./api/links/' + this.data.slug + '/qr", "_blank")');
            linkStat[3].innerHTML = '<span class="material-symbols-outlined">trending_up</span>' + this.data.hits + ' views';
            linkStat[4].innerHTML = '<span class="material-symbols-outlined">hourglass_empty</span>Expires ' + new Date(this.data.expiration * 1000).toLocaleDateString();
            linkStat[5].setAttribute('onclick', 'deleteLink("' + this.data.slug + '")');
        }
    });

    async function handleSubmit(form) {
        const url = form.url.value;
        const ttl = form.ttl.value;
        const result = document.getElementById('result');
        result.innerHTML = '';
        fetch('./api/links', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url, ttl }),
        })
		.then((res) => res.json())
		.then((res) => {
			if (res.error !== undefined && res.error !== null) {
				console.error(res);
				result.innerHTML = '<p>' + res.error + '</p>';
				return;
			} else {
				console.log(res);

				// page hostname
				const pageHostname = window.location.hostname;

				result.innerHTML =
					'<p>Your new link is <a href="' +
					res.short_url +
					'" target="_blank">' +
					res.short_url +
					'</a> and will expire on ' +
					new Date(Date.now() + Number(res.ttl) * 1000).toLocaleString() +
					'<br>Allow ~15 seconds to fully propagate across network.</p>';
			}
            getLinks();
		})
		.catch((err) => {
			console.error(err);
			result.innerHTML = '<p>Unknown error</p>';
		});
}

async function getLinks() {
	const list = document.getElementById('list');
	list.innerHTML = '<h2>Active Links:</h2><ul>';
	fetch('./api/links')
		.then((res) => res.json())
		.then((res) => {
			if (res.error !== undefined && res.error !== null) {
				console.error(res);
				list.innerHTML = '<p>' + res.error + '</p>';
				return;
			} else {
				console.log(res);
				res.forEach((link) => {
                    const data = {
                        title: link.meta.title,
                        short_url: location.protocol + '//' + location.host + '/' + link.slug,
                        true_url: link.url,
                        slug: link.slug,
                        hits: link.hits,
                        expiration: link.expiration,
                    }
					list.innerHTML += \`<link-item link-title="\` + data.title + \`" short-url="\` + data.short_url + \`" true-url="\` + data.true_url + \`" slug="\` + data.slug + \`" hits="\` + data.hits + \`" expiration="\` + data.expiration + \`"></link-item>\`;
				});
				list.innerHTML += '</ul>';
			}
		})
		.catch((err) => {
			console.error(err);
			list.innerHTML = '<p>Unknown error</p>';
		});
}

async function deleteLink(slug) {
	fetch('./api/links/' + slug, {
		method: 'DELETE',
	})
		.then((res) => res.json())
		.then((res) => {
			if (res.error !== undefined && res.error !== null) {
				console.error(res);
				alert(res.error);
				return;
			} else {
				console.log(res);
				alert('Link deleted');
			}
		})
		.catch((err) => {
			console.error(err);
			alert('Unknown error');
		});
	getLinks();
}

getLinks();

    `;
}

export default scripts;
