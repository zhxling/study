angular.module("ngUpload", []).directive("ngUpload", function(){
	return {
		restrict : "A",
		scope : {
			__ngUpload : "=ngUpload",
			__ngUploadModel : "=ngUploadModel"
		},
		link : function(scope, ele, attr){
			var set = scope.__ngUpload,
				$ = angular.element,
				input;
				
			var progress;
			function initInput(){
				model = scope.__ngUploadModel,
				input = $("<input type='file'/>").css({
					position:"fixed",
					zIndex : "-100",
					opacity:"0",
					left:0,
					top:0
				}).bind("change", function(){
					var f = input[0].files[0];
					if(!set.verifier || set.verifier(f)){
						scope.$apply();
						
						if(progress){
							progress.remove();
							progress = $("<div style='margin:2px;border:1px solid #ccc;backgorund:#fff;padding:2px;text-align:left;'><div style='text-align:center;line-height:15px;height:15px;font-size:12px;background:#00a1e9;color:#eee;'>0%<div></div>");
							var uploaded = progress.find("div");
						}
						
						var fd = new FormData();
						fd.append(set.name, f);
						
						var xhr = new XMLHttpRequest();
						set.timeout ? (xhr.timeout = set.timeout) : "";
						
						//上传状态
						xhr.onreadystatechange = function(){
							if(xhr.readyState == 4){
								var data = xhr.response;
								try{
									data=JSON.parse(data);
								} catch(e){}
								
								if(xhr.status == 200){
									if(set.progress) {
										progress.css({
											"border-color":"#119718"
										}).find("div").css({
											"background":"#119718"
										});
									}
									if(set.success){
										set.success(data, model);
									}
								} else if(set.error){
									if(set.progress) {
										progress.css({
											"border-color":"#F83B09"
										}).find("div").css({
											"background":"#F83B09"
										});
									}
									set.error(data, model);
								}
								
								if(set.complete){
									set.complete(data, model);
								}
								
								scope.$apply();
								
								/*进度条的控制*/
								if(set.progress && set.removeProcess){
									if(set.removeProcessDelay){
										setTimeout(function(){
											progress.remove();
											progress = null;
										}, set.removeProcessDelay);
									} else {
										progress.remove();
										progress  = null;
									}
								}
							}
						};
						
						/*显示进度条*/
						if(set.progress || set.progressChange){
							if(set.progress){
								$(document.querySelector(set.progress)).append(progress);
							}
							
							xhr.upload.addEventListener("progress", function(e){
								var l = Math.round(e.loaded * 100 / e.total)+"%";
								if(set.progress){
									uploaded.css("width", l);
									uploaded.html(l);
								} 
								
								if(set.progressChange) {
									set.progressChange(l, model);
									scope.$apply();
								}
								
							}, false);
						}
						if(set.start){
							set.start(model);
						}
						xhr.open("POST", set.url(model), true);
						xhr.send(fd);
						scope.$apply();
					}
					input.remove();
					initInput();
				});
				input.attr("accept", set.accept);
				$(document.querySelector('body')).append(input);
			}
			
			initInput();
			
			/*选择文件*/
			ele.bind('click', function () {
				input[0].click();
			});
		}
	}
});