$( window ).on( "load", function() {
	var suica1 = new Suica("canv1");
	
	orthographic(1,2);
	lookAt([0,0,1], [0,0,0], [0,1,0]);
	suica1.gl.canvas.addEventListener('mousedown', onMouseDownSuica1);
	suica1.gl.canvas.addEventListener('mouseup', onMouseUp);
	suica1.gl.canvas.addEventListener('mousemove', onMouseMove);
	
	var a = point([-350,-87,0]).custom({color: [0,0.6,0], interactive: true, pointSize: 15});
	var b = point([60,150,0]).custom({color: [0,0.6,0], interactive: true, pointSize: 15});
	var c = point([-350,150,0]).custom({color: [0,0,0]});
	
	moveLettersOnTriangle();
	calcAnglesOnTriangle();
	
	segment(a.center, b.center).custom({color: [0.4,0.4,0.4]});
	segment(a.center, c.center).custom({color: [0.4,0.4,0.4]});
	segment(b.center, c.center).custom({color: [0.4,0.4,0.4]});
	
	var vec_ac = vectorPoints(a.center,c.center);
	var vec_bc = vectorPoints(b.center,c.center);
	
	var offset_ac = vec_ac[0] * vec_ac[0] + vec_ac[1] * vec_ac[1];
	var offset_bc = vec_bc[0] * vec_bc[0] + vec_bc[1] * vec_bc[1];
	
	
	////////////////////////////////////////////// SECOND Suica
	
	
	var suica2 = new Suica("canv2");
	
	orthographic(1,2);
	lookAt([0,0,1], [0,0,0], [0,1,0])
	suica2.gl.canvas.addEventListener('mousedown', onMouseDownSuica2);
	suica2.gl.canvas.addEventListener('mouseup', onMouseUp);
	suica2.gl.canvas.addEventListener('mousemove', onMouseMove);
	
	line([0,0,0],[0,1,0]).custom({color: [0,0,0]});
	line([0,0,0],[1,0,0]).custom({color: [0,0,0]});
	
	circ = circle([0,0,0],250).custom({mode:Suica.LINE, color: [0,0.6,0]});
	
	var p = point([0,250,0]).custom({pointSize: 15, interactive: true, color: [0,0.6,0]});
	segment(p.center, circ.center).custom({color: [1,0,0]});
	var sin_point = point([0, p.center[1], 0]);
	var cos_point = point([p.center[0], 0, 0]);
	segment(sin_point.center, p.center).custom({color: [0.6,0,0.6]});
	segment(cos_point.center, p.center).custom({color: [0,0,1]});
	
	moveElementByIdToPoint(suica2, "O_circle", circ.center);
	moveElementByIdToPoint(suica2, "A_circle", [circ.radius, 0, 0]);
	moveElementByIdToPoint(suica2, "P_circle", p.center, 0, -30);
	
	var clickedPoint = null;
	
	function onMouseDownSuica1(e) {
		clickedPoint = suica1.objectAtPoint(e.clientX, e.clientY);
	}
	
	function onMouseDownSuica2(e) {
		clickedPoint = suica2.objectAtPoint(e.clientX, e.clientY);
	}
	
	function onMouseUp(e) {
		clickedPoint = null;
	}
	
	function onMouseMove(e) {			
		if (clickedPoint) {
			movePoint(e);
		}
	}
	
	function movePoint(e) {
		var vector;
		var offset;
		var d;

		var x = e.clientX - e.target.offsetLeft - e.target.offsetWidth / 2;
		var y = - ( e.clientY - e.target.offsetTop - e.target.offsetHeight / 2) - window.scrollY;
		
		if (clickedPoint == a || clickedPoint == b) {
			vector = clickedPoint == a ? vec_ac : vec_bc;
			offset = clickedPoint == a ? offset_ac : offset_bc;
			d =( (x - c.center[0]) * vector[0] + (y - c.center[1]) * vector[1] ) / offset;
			
			clickedPoint.center[0] = c.center[0] + d * vector[0];
			clickedPoint.center[1] = c.center[1] + d * vector[1];
			
			moveLettersOnTriangle();
			calcAnglesOnTriangle();
			
			
		} else if (clickedPoint == p) {
			d = Math.sqrt( x * x + y * y ); 
			clickedPoint.center[0] = circ.radius * x / d;
			clickedPoint.center[1] = circ.radius * y / d;
			
			sin_point.center[1] = clickedPoint.center[1];
			cos_point.center[0] = clickedPoint.center[0];
			
			onCirclePointMoved();
		}
	}
	
	function onCirclePointMoved() {
		moveElementByIdToPoint(suica2, "P_circle", p.center, 0, -30);
		moveElementByIdToPoint(suica2, "sin_circle", sin_point.center);
		moveElementByIdToPoint(suica2, "cos_circle", cos_point.center);
		document.getElementById("sin_circle").innerHTML = "sin(α)<br>" + ((sin_point.center[1] / circ.radius).toFixed(3));
		document.getElementById("cos_circle").innerHTML = "cos(α)<br>" + ((cos_point.center[0] / circ.radius).toFixed(3));
	}
	
	/** id - string; point - Suica.point; x,y - offset (in pixels) */
	function moveElementByIdToPoint(suica, id, point, x, y) {
		if (!x) x = 0;
		if (!y) y = 0;
		
		var div = document.getElementById(id);
		var pos = suica.getPosition(point);
		div.style.left = (pos[0] + x) + "px";
		div.style.top = (pos[1] + y) + "px";
	}
	
	function moveLettersOnTriangle() {
		moveElementByIdToPoint(suica1, "A", a.center, 0, 5);
		moveElementByIdToPoint(suica1, "degA", a.center, 0, -30);
		moveElementByIdToPoint(suica1, "B", b.center, 10, 0);
		moveElementByIdToPoint(suica1, "degB", b.center, -40, -25);
		moveElementByIdToPoint(suica1, "C", c.center, -15, -20);
		moveElementByIdToPoint(suica1, "degC", c.center, 5, 0);
	}
	
	function calcAnglesOnTriangle() {
		var AB_length = Math.sqrt((a.center[0] - b.center[0]) * (a.center[0] - b.center[0]) + (a.center[1] - b.center[1]) * (a.center[1] - b.center[1]));
		var AC_length = Math.sqrt((a.center[0] - c.center[0]) * (a.center[0] - c.center[0]) + (a.center[1] - c.center[1]) * (a.center[1] - c.center[1]));
		var BC_length = Math.sqrt((c.center[0] - b.center[0]) * (c.center[0] - b.center[0]) + (c.center[1] - b.center[1]) * (c.center[1] - b.center[1]));

		var sinB = AC_length / AB_length;
		var cosB = BC_length / AB_length;
		var tgB = sinB / cosB;
		var cotgB = 1 / tgB;
		var sinA = BC_length / AB_length;
		var cosA = AC_length / AB_length;
		var tgA = sinA / cosA;
		var cotgA = 1 / tgA;
		
		document.getElementById("sinB").innerHTML = sinB.toFixed(3);
		document.getElementById("cosB").innerHTML = cosB.toFixed(3);
		document.getElementById("tgB").innerHTML = tgB.toFixed(3);
		document.getElementById("cotgB").innerHTML = cotgB.toFixed(3);
		document.getElementById("sinA").innerHTML = sinA.toFixed(3);
		document.getElementById("cosA").innerHTML = cosA.toFixed(3);
		document.getElementById("tgA").innerHTML = tgA.toFixed(3);
		document.getElementById("cotgA").innerHTML = cotgA.toFixed(3);
		
		document.getElementById("degA").innerHTML = (Math.asin(sinA)*180/Math.PI).toFixed(1) + "°";
		document.getElementById("degB").innerHTML = (Math.asin(sinB)*180/Math.PI).toFixed(1) + "°";
	}
});