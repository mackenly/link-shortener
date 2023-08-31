function stylesheet() {
	return `
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

`;
};

export default stylesheet;