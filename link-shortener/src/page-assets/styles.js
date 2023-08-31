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
`;
};

export default stylesheet;