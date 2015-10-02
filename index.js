var bitcore = require('bitcore');

// statics 
var alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

// useful functions
function strStartsWith(str, prefix) {
    return str.indexOf(prefix) === 0;
}

// start

// knock off first two args (path to node and location of script)
var args = process.argv.slice(2);
if (args.length<1 || args[0]=="-h") {
	console.log("USAGE: vanity-gen prefix. # No need to include the 1. For example if you want an address starting with 1ROX run nodejs ./vanity-gen.js ROX\n");
	process.exit(1);
}

var prefix='1'+args[0];

// check prefix characters valid for Bitcoin base58
for (var i = 0, len = prefix.length; i < len; i++) {
  var c = prefix[i];
  if (!~alphabet.indexOf(c)) {
    console.log("ERROR: Bitcoin addresses are comprised only of the following characters:"+alphabet+"\n");
    process.exit(1);
  }
}

var match=false;
var address=""
var counter=0;
var start_time=new Date().getTime();

console.log("Starting search for: "+prefix);

while (!match) {
  counter++; 
  var privateKey = new bitcore.PrivateKey();
  address = privateKey.toAddress();
  if (strStartsWith(String(address),prefix)) {
	match=true;
        console.log(privateKey);
	console.log(new bitcore.PublicKey(privateKey));
        console.log(address);
	var end_time=new Date().getTime();
        console.log('Took: '+((start_time-end_time)/1000)+' seconds');
  } else if (counter%1000==0) {
	var curr_time=new Date().getTime();
	var avgPerMilli=((curr_time-start_time)/counter)*1000;
        console.log(counter+' - '+avgPerMilli+' per second');
  }
}
