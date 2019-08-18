const LineConnect = require('./connect');
let line = require('./main.js');
let LINE = new line();


const auth = {
	authToken: 'EIrM2z9WIkWSTkRe0iAe.gufDRztNV3t8CCzmV2YixG.PfQwkFBOYBeQKwpQkT1+pmGF9JnY3UxWbTfsplkcWuc=',
	certificate: 'b8b66180ebacbd3abc6ebd4621a453d3f7e4f10ba534f146bf9f86c5755344ac',
	email: '',
	password: ''
}

//let client =  new LineConnect();
let client =  new LineConnect(auth);

client.startx().then(async (res) => {
	
	while(true) {
		try {
			ops = await client.fetchOps(res.operation.revision);
		} catch(error) {
			console.log('error',error)
		}
		for (let op in ops) {
			if(ops[op].revision.toString() != -1){
				res.operation.revision = ops[op].revision;
				LINE.poll(ops[op])
			}
		}
	}
});

