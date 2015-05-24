var points = [];
var rectangular = [];
var canvasWidth = window.innerWidth;
var canvasHeight = window.innerHeight;
var iX = 10;
var iY,iCellX,iCellY;
var freeDegree = 0.4;
var noise = 0;

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
canvas.width = canvasWidth;
canvas.height = canvasHeight;
var colora = '#00ffff';//渐变色1
var colorb = '#ff00ff';//渐变色2
var lGrd = ctx.createLinearGradient(0,0, canvasWidth, canvasHeight);  
lGrd.addColorStop(0, colora);  
lGrd.addColorStop(1, colorb); 




//intPoint
function intPoint () {
	
	iY = parseInt ( iX*( canvasHeight / canvasWidth) );
	console.log(iY);
	iCellX = canvasWidth / iX;
	iCellY = canvasHeight /iY;	
	points.length = 0;
	
	for (var j = 0 ; j <= iY; j++) {		
		var a = [];
		for (var i = 0; i <= iX; i++) {
			function Point(i,j){
				var x = iCellX * (i + Math.random()*(freeDegree -1) );
				var y = iCellY * (j + Math.random()*(freeDegree -1) )
				if( i==0 ){
					x =0;
				}
				if( i== iX ){
					x = canvasWidth;
				}
				if( j==0 ){
					y =0;
				}
				if( j== iY ){
					y = canvasHeight;
				}
				return [x,y];
			}
			var point = new Array();
			point = Point(i,j);						
			a.push(point);	
		};
		points.push(a);

	}
};

var Rectangular = function(a,b,c,d){
	this.a = a;
	this.b = b;
	this.c = c;
	this.d = d;
}
var colorToRGB = function (color, alpha) {
  // http://www.codefans.net
  if (typeof color === 'string' && color[0] === '#') {
    color = window.parseInt(color.slice(1), 16);
  }
  alpha = (alpha === undefined) ? 1 : alpha;
  //parse hex values
  var r = color >> 16 & 0xff,
      g = color >> 8 & 0xff,
      b = color & 0xff,
      a = (alpha < 0) ? 0 : ((alpha > 1) ? 1 : alpha);
  //only use 'rgba' if needed
  if (a === 1) {
    return [r,g,b];
  } else {
    return [r,g,b,a];
  }
};
var getColor = function(a,b,c){
	var x = (a[0]+b[0]+c[0])/3;
	var y = (a[1]+b[1]+c[1])/3;
	var rx = x/canvasWidth;
	var ry = y/canvasHeight;
	var cA = colorToRGB(colora); 
	var cB = colorToRGB(colorb); 
	var r = parseInt(cA[0]+rx*(cB[0]-cA[0])+Math.random()*noise); 	
	var g = parseInt(cA[1]+(rx+ry)/2*(cB[1]-cA[1])+Math.random()*noise);	
	var b = parseInt(cA[2]+ry*(cB[2]-cA[2])+Math.random()*noise);
	// var r = parseInt(rx*(cB[0]+cA[0])); 	
	// var g = parseInt((rx+ry)/2*(cB[1]+cA[1]));	
	// var b = parseInt(ry*(cB[2]+cA[2]));    
	return "rgb("+ r +","+ g +","+ b +")";
}
// getColor(points[0][0],points[0][1],points[1][1])
Rectangular.prototype.draw = function (ctx){
	 var a = this.a;
	 var b = this.b;
	 var c = this.c;
	 var d = this.d;
	 var Draw = function(a,b,c){
		ctx.save();
			ctx.beginPath();
			ctx.fillStyle = getColor(a,b,c);
			ctx.lineWidth = 1;
			ctx.moveTo(a[0],a[1]);		
			ctx.lineTo(b[0],b[1]);
			ctx.lineTo(c[0],c[1]);		
			ctx.closePath();
			ctx.fill();
			ctx.strokeStyle = getColor(a,b,c);
		ctx.stroke();
	}

	if(IfDelaunay(a,b,c,d) ==1 ){
		Draw(a,c,d);		//acd		
		Draw(b,d,a);		//bda
	}
	if(IfDelaunay(a,b,c,d) == 2 ){
		Draw(a,c,b);		//acd
		Draw(b,d,c);		//bda
	}
	if(IfDelaunay(a,b,c,d) == 0 ){
		console.log(a,b,c,d);
	}


}
// console.log(IfDelaunay(points[0][0],points[0][1],points[1][0],points[1][1]));
var circle = function (A,B,C){
		var  x1,x2,x3,y1,y2,y3;  
  
	    x1  =  A[0];   
	    x2  =  B[0];  
	    x3  =  C[0];  
	    y1  =  A[1];  
	    y2  =  B[1];  
	    y3  =  C[1];  
	  
	    //求外接圆半径  
	    var a=Math.sqrt( (x1-x2)*(x1-x2)+(y1-y2)*(y1-y2) );  
	    var b=Math.sqrt( (x1-x3)*(x1-x3)+(y1-y3)*(y1-y3) );  
	    var c=Math.sqrt( (x2-x3)*(x2-x3)+(y2-y3)*(y2-y3) );  
	    var p=(a+b+c)/2;  
	    var S=Math.sqrt( p*(p-a)*(p-b)*(p-c) );  
	    var radius=a*b*c/(4*S);  
	  
	    //求外接圆圆心  
	    var t1=x1*x1+y1*y1;  
	    var t2=x2*x2+y2*y2;  
	    var t3=x3*x3+y3*y3;  
	    var temp=x1*y2+x2*y3+x3*y1-x1*y3-x2*y1-x3*y2;  
	    var x=(t2*y3+t1*y2+t3*y1-t2*y1-t3*y2-t1*y3)/temp/2;  
	    var y=(t3*x2+t2*x1+t1*x3-t1*x2-t2*x3-t3*x1)/temp/2;  
	  	return [x,y,radius]; 
}

var IfIn = function(circle,D){

		var dx = D[0] - circle[0];
		var dy = D[1] - circle[1];
		var r = circle[2];
		var t = dx*dx +dy*dy -r*r;
		// if (t>=0) {
		// 	return false;

		// }else{
		// 	return true;
		// };
		return t;
}
var IfDelaunay = function(A,B,C,D){

	
	var o1 = circle(A,C,D);
	var o2 = circle(B,D,A);



	// if (!IfIn(o1,B)&&!IfIn(o2,C)) {
	// 	return true;
	// }else if( (IfIn(o1,B)&&IfIn(o2,C)) == false){

	// }else{
	// 	return false;
	// };
	
	if(IfIn(o1,B)>=0){
		type=1;
	}else if(!IfIn(o2,C)>=0){
		type=2;
	}else{
		type=0;
	}
	return type;
}

//initRectangular
function initRectangular () {
	rectangular.length = 0;
	var rec ;
	for (var i = 0; i < iY ; i++) {
		for (var j = 0; j < iX  ; j++) {
			//console.log(points[i][j],points[i][j],points[i][j],points[i][j]);
			rec = new Rectangular(points[i][j],points[i][j+1],points[i+1][j],points[i+1][j+1]) ;
			rec.indexX=i;
			rec.indexY=j;
			rectangular.push(rec);
		};
	};
	//rectangular[0].draw(ctx);
};
