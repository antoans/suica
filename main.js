$( window ).on( "load", function() {
	var suica = new Suica("canv1");
	
	orthographic(1,2);
	lookAt([0,0,1], [0,0,0], [0,1,0])
	
	var a = point([-350,-50,0]);
	var b = point([0,150,0]);
	var c = point([-350,150,0]);
	
	moveLetters();
	calcAngles();

	a.pointSize = 15;
	b.pointSize = 15;
	c.pointSize = 15;
	a.interactive = true;
	b.interactive = true;
	
	var segment_ab = segment(a.center, b.center);
	segment(a.center, c.center);
	segment(b.center, c.center);
	
	var vec_ac = vectorPoints(a.center,c.center);
	var vec_bc = vectorPoints(b.center,c.center);
	
	var offset_ac = vec_ac[0] * vec_ac[0] + vec_ac[1] * vec_ac[1];
	var offset_bc = vec_bc[0] * vec_bc[0] + vec_bc[1] * vec_bc[1];
	
	suica.gl.canvas.addEventListener('mousedown', onMouseDown);
	suica.gl.canvas.addEventListener('mouseup', onMouseUp);
	suica.gl.canvas.addEventListener('mousemove', onMouseMove);
	
	function onFrame() {
		console.log(c);
	}
	
	var clickedPoint = null;
	
	function onMouseDown(e) {
		clickedPoint = suica.objectAtPoint(e.clientX, e.clientY);
	}
	
	function onMouseUp(e) {
		clickedPoint = null;
	}
	
	function onMouseMove(e) {			
		if (clickedPoint) {
			movePoint(e);
			moveLetters();
			calcAngles();
		}
	}
	
	function movePoint(e) {
		var vector;
		var offset;
		
		if (clickedPoint == a) {
			vector = vec_ac;
			offset = offset_ac;
		} else if (clickedPoint == b) {
			vector = vec_bc;
			offset = offset_bc;
		} else {
			return;
		}
		
		var x = e.clientX - e.target.offsetLeft - e.target.offsetWidth / 2;
		var y = - ( e.clientY - e.target.offsetTop - e.target.offsetHeight / 2);
		
		var d =( (x - c.center[0]) * vector[0] + (y - c.center[1]) * vector[1] ) / offset;

		clickedPoint.center[0] = c.center[0] + d * vector[0];
		clickedPoint.center[1] = c.center[1] + d * vector[1];
	}
	
	function moveLetters() {
		var div = document.getElementById("A");
		var pos = suica.getPosition(a.center);
		div.style.left = pos[0] + "px";
		div.style.top = (pos[1] + 5) + "px";
		
		div = document.getElementById("degA");
		div.style.left = (pos[0] - 0) + "px";
		div.style.top = (pos[1] - 30 ) + "px";
		
		div = document.getElementById("B");
		pos = suica.getPosition(b.center);
		div.style.left = (pos[0] + 10) + "px";
		div.style.top = pos[1] + "px";
		
		
		div = document.getElementById("degB");
		div.style.left = (pos[0] - 40) + "px";
		div.style.top = (pos[1] - 25) + "px";
	}
	
	function calcAngles() {
		var AB_length = Math.sqrt((a.center[0] - b.center[0]) * (a.center[0] - b.center[0]) + (a.center[1] - b.center[1]) * (a.center[1] - b.center[1]));
		var AC_length = Math.sqrt((a.center[0] - c.center[0]) * (a.center[0] - c.center[0]) + (a.center[1] - c.center[1]) * (a.center[1] - c.center[1]));
		var BC_length = Math.sqrt((c.center[0] - b.center[0]) * (c.center[0] - b.center[0]) + (c.center[1] - b.center[1]) * (c.center[1] - b.center[1]));

		var sinB = (AC_length / AB_length);
		var cosB = (BC_length / AB_length);
		var sinA = (BC_length / AB_length);
		var cosA = (AC_length / AB_length);
		
		document.getElementById("sinB").innerHTML = sinB.toFixed(4);
		document.getElementById("cosB").innerHTML = cosB.toFixed(4);
		document.getElementById("sinA").innerHTML = sinA.toFixed(4);
		document.getElementById("cosA").innerHTML = cosA.toFixed(4);
		
		document.getElementById("degA").innerHTML = (Math.asin(sinA)*180/Math.PI).toFixed(1) + "°";
		document.getElementById("degB").innerHTML = (Math.asin(sinB)*180/Math.PI).toFixed(1) + "°";
	}
});

function log(o) {
	console.log(o);
}

