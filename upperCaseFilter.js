var APP=angular.module('APP',[]);
APP.filter('titleCase',function(){
	var titleCaseFilter=function(h1){
		var words=h1.split(' ');
		for(var i=0;i<words.length;i++){
			words[i]=words[i].charAt(0).toUpperCase()+words[i].slice(1);
		}
		word=words.join(' ');

		return word;
	}
	return titleCaseFilter;
})