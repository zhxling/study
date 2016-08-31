var https=require('https');
var fs=require('fs');

var options={
	key:fs.readFileSync('ssh_key.pem'),
	cert:fs.readFileSync('ssh_cert.pem')
}

https
	.createServer(options,function(){
		res.writeHead('200');
		res.end('hello Alin');
	})
	.listen(8090);