const Gamedig = require('gamedig');
Gamedig.query({
	type: 'arkse',
	host: '142.44.239.227'
}).then((state) => {
	console.log(state);
}).catch((error) => {
	console.log("Server is offline");
});
