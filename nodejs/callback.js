function learn(somthing){
	this.words=somthing;
	this.speak=function(){
		console.log(this.words);
		console.log(this);
	}

	console.log(this);
}

learn("node");
var learn=new learn("node");
learn.speak();