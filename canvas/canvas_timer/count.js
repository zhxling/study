var CANVAS_WIDTH=1024;
var CANVAS_HEIGHT=768;
var RADIUS=8;
var MARGIN_TOP=80;
var MARGIN_LEFT=30;

// var endTime=new Date();
// endTime.setTime(endTime.getTime()+3600*1000);
var curShowTimeSeconds=0;
var balls=[];
var colors=["#B3F1F1","#F0C4F3","#86F37F","#ECE627","#F96F46","#B2C7F7","#DEC3F7","#F5D8AD","#F90C4D","#CDE6BB","#E4161F"];

window.onload=function(){
	CANVAS_WIDTH = document.body.clientWidth
    CANVAS_HEIGHT = document.body.clientHeight

    MARGIN_LEFT = Math.round(CANVAS_WIDTH /10);
    RADIUS = Math.round(CANVAS_WIDTH * 4 / 5 / 108)-1

    MARGIN_TOP = Math.round(CANVAS_HEIGHT /5);

	var canvas=document.getElementById("canvas");
	var context=canvas.getContext("2d");

	canvas.width=CANVAS_WIDTH;
	canvas.height=CANVAS_HEIGHT;
	curShowTimeSeconds=getCurrentShowTimeSeconds();

    setInterval(function(){
        render(context);
        update();
    },50);
}

function update(){
    var nextShowTimeSeconds=getCurrentShowTimeSeconds();

    var nextHours = parseInt( nextShowTimeSeconds / 3600);
    var nextMinutes = parseInt( (nextShowTimeSeconds - nextHours * 3600)/60 );
    var nextSeconds = nextShowTimeSeconds % 60;

    var curHours = parseInt( curShowTimeSeconds / 3600);
    var curMinutes = parseInt( (curShowTimeSeconds - curHours * 3600)/60 );
    var curSeconds = curShowTimeSeconds % 60;
    if(nextSeconds!= curSeconds){

        if(parseInt(nextSeconds%10) !== parseInt(curSeconds%10)){
        	addBalls( MARGIN_LEFT+93*(RADIUS+1), MARGIN_TOP , parseInt(curSeconds%10))
        }
        if(parseInt(nextSeconds/10) !== parseInt(curSeconds/10)){
        	addBalls( MARGIN_LEFT+78*(RADIUS+1), MARGIN_TOP , parseInt(curSeconds/10))
        }
        if(parseInt(nextMinutes%10) !== parseInt(curMinutes%10)){
        	addBalls( MARGIN_LEFT+54*(RADIUS+1), MARGIN_TOP , parseInt(curMinutes%10))
        }
        if(parseInt(nextMinutes/10) !== parseInt(curMinutes/10)){
        	addBalls( MARGIN_LEFT+39*(RADIUS+1), MARGIN_TOP , parseInt(curMinutes/10))
        }
        if(parseInt(nextHours%10) !== parseInt(curHours%10)){
        	addBalls( MARGIN_LEFT+15*(RADIUS+1), MARGIN_TOP , parseInt(curHours%10))
        }
        if(parseInt(nextHours/10) !== parseInt(curHours/10)){
        	addBalls( MARGIN_LEFT, MARGIN_TOP , parseInt(curHours/10))
        }

        curShowTimeSeconds=nextShowTimeSeconds;
    }

    updateBalls();
    console.log(balls.length);
}

function addBalls(x,y,num){
	for(var i=0;i<digit[num].length;i++){
		for(var j=0;j<digit[num][i].length; j++){
			if(digit[num][i][j]==1){
				var aBall={
					x:x+(RADIUS+1)+j*2*(RADIUS+1),
					y:y+(RADIUS+1)+i*2*(RADIUS+1),
					g:1.5+Math.random(),
					vx:Math.pow(-1,Math.ceil(Math.random()*1000))*4,
					vy:-5,
					color:colors[Math.floor(Math.random()*colors.length)]
				}

				balls.push(aBall);
			}
		}
	}
}

function updateBalls(){
	for(var i=0;i<balls.length;i++){
		balls[i].x += balls[i].vx;
		balls[i].y += balls[i].vy;
		balls[i].vy += balls[i].g;

		if(balls[i].y >= CANVAS_HEIGHT-RADIUS){
			balls[i].y= CANVAS_HEIGHT-RADIUS;
			balls[i].vy = -balls[i].vy * 0.75;
		}
	}

	var cnt=0;
	for(var i=0;i<balls.length;i++){
		if(balls[i].x+RADIUS>0 && balls[i].x-RADIUS<CANVAS_WIDTH){
			balls[cnt++]=balls[i];
		}
	}

	var num=Math.min(300,cnt); //让彩色小球最多只能有300个
	if(balls.length>num){
		balls.splice(num);
	}
}

function getCurrentShowTimeSeconds(){
	var curTime=new Date();
	// var existTimeSeconds=endTime.getTime()-curTime.getTime(); //得到的是毫秒数
	// existTimeSeconds=Math.round(existTimeSeconds/1000);       //将毫秒转换成秒

	// return existTimeSeconds>=0 ? existTimeSeconds : 0;
	var ret=curTime.getHours()*3600+curTime.getMinutes()*60+curTime.getSeconds();
	return ret;
}

function render(cxt){
	cxt.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT); //对一个矩形空间进行刷新
	var hours=parseInt(curShowTimeSeconds / 3600);
	var minutes=parseInt((curShowTimeSeconds-hours*3600)/60);
	var seconds=curShowTimeSeconds % 60;

	renderDigit( MARGIN_LEFT , MARGIN_TOP , parseInt(hours/10) , cxt);
	renderDigit( MARGIN_LEFT+15*(RADIUS+1) , MARGIN_TOP , parseInt(hours%10) , cxt);
	renderDigit( MARGIN_LEFT+30*(RADIUS+1) , MARGIN_TOP , 10 , cxt);
	renderDigit( MARGIN_LEFT+39*(RADIUS+1) , MARGIN_TOP , parseInt(minutes/10),cxt);
	renderDigit( MARGIN_LEFT+54*(RADIUS+1) , MARGIN_TOP , parseInt(minutes%10) , cxt);
	renderDigit( MARGIN_LEFT+69*(RADIUS+1) , MARGIN_TOP , 10 , cxt);
	renderDigit( MARGIN_LEFT+78*(RADIUS+1) , MARGIN_TOP , parseInt(seconds/10) , cxt);
	renderDigit( MARGIN_LEFT+93*(RADIUS+1) , MARGIN_TOP , parseInt(seconds%10) , cxt);

	// 画出已有的彩色小球
	for(var i=0;i<balls.length;i++){
		cxt.beginPath();
		cxt.fillStyle=balls[i].color;
		cxt.arc(balls[i].x,balls[i].y,RADIUS,0,2*Math.PI);
		cxt.closePath();
		cxt.fill();
	}

}

function renderDigit(x,y,num,cxt){
	// 圆点的填充颜色
	cxt.fillStyle="#7dcefd";

	for(var i=0;i<digit[num].length;i++){
		for(var j=0;j<digit[num][i].length;j++){
			if(digit[num][i][j]==1){
				cxt.beginPath()
				cxt.arc( x+(RADIUS+1)+j*2*(RADIUS+1) , y+(RADIUS+1)+i*2*(RADIUS+1) , RADIUS , 0 , 2*Math.PI );
				cxt.closePath();
				cxt.fill();
			}
		}
	}
}