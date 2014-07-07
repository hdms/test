var global = global || {};
!function(d, w){
    "use strict";
    /*===============================================
     * lib
     * =============================================== */
    var rand = function(min,max){
	return (Math.random() * (max-min)+min) || 0;
    };
    var hitRect=function(x1,y1,w1,h1,x2,y2,w2,h2){
	return !(x1+w1<x2||x2+w2<x1||y1+h1<y2||y2+h2<y1);
    };
    var radian = Math.PI / 180;
    function log(obj){
	console.log(obj);
    };
    function isCanvasSuported(){
	var elm = d.createElement('canvas');
	return !!(elm.getContext && elm.getContext('2d'));
    };
    w.requestAnimationFrame = (function() {
	return window.requestAnimationFrame ||
	    window.webkitRequestAnimationFrame ||
	    window.mozRequestAnimationFrame ||
	    window.msRequestAnimationFrame ||
	    window.oRequestAnimationFrame ||
	    function(f) { return window.setTimeout(f, 1000 / FPS); };
    }());
    w.cancelRequestAnimationFrame = (function() {
	return window.cancelRequestAnimationFrame ||
	    window.webkitCancelRequestAnimationFrame ||
	    window.mozCancelRequestAnimationFrame ||
	    window.msCancelRequestAnimationFrame ||
	    window.oCancelRequestAnimationFrame ||
	    function(id) { window.clearTimeout(id); };
    }());
    var onResize = function (e){
	return function(){
	    cv.width = w.innerWidth;
	    cv.height = w.innerHeight;
	}
    }();
    function Point(x, y) {
	this.x = x || 0;
	this.y = y || 0;
    }
    Point.add = function(p1, p2) {
	return new Point(p1.x + p2.x, p1.y + p2.y);
    };
    Point.distance=function(p1,p2){
	//三平方
	var a = p1.x - p2.x;
	var b = p1.y - p2.y;
	return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
    };
    Point.interpolate = function(p1,p2,t){
	//内分点
	var x = p1.x * (1 - t) + p2.x * t;
	var y = p1.y * (1 - t) + p2.y * t;
	return new Point(x, y);
    };
    Point.prototype = {    
	add: function(p) {
	    return Point.add(this, p);
	},
	distance:function(p){
	    return Point.distance(this,p);
	},
	dump:function(){
	    log(this);
	},
	offset:function(x,y){
	    this.x += x || 0;
	    this.y += y || 0;
	},
	interpolate : function (p, t){
	    return Point.interpolate(this, p, t);   
	}
    };
    function extend(s, c){
	function f(){};
	f.prototype = s.prototype;
	c.prototype = new f();
	c.prototype.__super__ = s.prototype;  
	c.prototype.__super__.constructor = s;
	c.prototype.constructor = c;
	return c;
    };
    /*===============================================
     * conf
     * =============================================== */
    var WIDTH = 500;
    var HEIGHT = 500;
    var FPS = 60;

    var width;
    var height;

    var cv;
    var ctx;
    var gl;
    var mouseX;
    var mouseY;
    var cx,cy;
    var rad = 0;
    var deg = 1;
    var count = 0;
    //var noise = new SimplexNoise();
    var noiseX = 0;
    /*===============================================*/
    var values = [0,0,0,0];
    var startTime = 0.0;
    var tempTime = 0.0;
    var fps = 1000 / 60;
    var uniLocation;
    var time = 0;
    var mx,my;
    /*===============================================
     * main
     * =============================================== */
    function setUp(){
	var vs = createShader('vs');
	var fs = createShader('fs');

	var p = createProgram(vs,fs);
	uniLocation = [
	    gl.getUniformLocation(p,'time'),
	    gl.getUniformLocation(p,'mouse'),
	    gl.getUniformLocation(p,'resolution')
	];
	var pos = [
		-1.0,  1.0,  0.0,
            1.0,  1.0,  0.0,
		-1.0, -1.0,  0.0,
            1.0, -1.0,  0.0
	];
	var index = [
	    0, 2, 1,
            1, 2, 3
	];
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	mx = my = 0.5;
	startTime = new Date().getTime();

	var vPosition = createVbo(pos);
	var vIndex = createIbo(index);
	var vAttLocation = gl.getAttribLocation(p,"position");
	gl.bindBuffer(gl.ARRAY_BUFFER,vPosition);
	gl.enableVertexAttribArray(vAttLocation);
	gl.vertexAttribPointer(vAttLocation, 3, gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vIndex);
	render();
    };


    /*===============================================
     * =============================================== */
    function render(){
	time = (new Date().getTime() - startTime) * 0.001;
	gl.clear(gl.COLOR_BUFFER_BIT);

	gl.uniform1f(uniLocation[0], time + tempTime);
	gl.uniform2fv(uniLocation[1], [mx, my]);
	gl.uniform2fv(uniLocation[2], [cx, cy]);

	gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

	gl.flush();
	w.setTimeout(render,fps);
    };


    /*===============================================
     * =============================================== */
    function createShader(id){
	var shader;
	var elm = d.getElementById(id);

	if(!elm) return;
	switch(elm.type){
	case 'x-shader/x-vertex':
	    shader = gl.createShader(gl.VERTEX_SHADER);
	    break;
	case 'x-shader/x-fragment':
	    shader = gl.createShader(gl.FRAGMENT_SHADER);
	    break;
	    defult :
	    return;
	};

	gl.shaderSource(shader, elm.text);
	gl.compileShader(shader);

	if(gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
	    return shader;
	}else{
	    alert(gl.getShaderInfoLog(shader));
	}
    };
    // ------------------------------------------------

    function createProgram(vs,fs){
	var p = gl.createProgram();

	gl.attachShader(p,vs);
	gl.attachShader(p,fs);

	gl.linkProgram(p);

	if(gl.getProgramParameter(p,gl.LINK_STATUS)){
	    gl.useProgram(p);
	    return p;
	}else{
	    alert(gl.getProgramParamInforLog(p));
	};
	
    };
    // ------------------------------------------------
    function createVbo(data){
	var vbo = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	
	return vbo;
    };
    function createIbo(data){
	var ibo = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(data), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
	
	return ibo;
	
    };


    /*===============================================
     * 
     /*===============================================
     * init
     * =============================================== */
    function glInit(){
	// cv = d.createElement('canvas');
	// d.body.appendChild(cv);

	cv = d.getElementById("glsl");

	// cv.width = w.innerWidth;
	// cv.height = w.innerHeight;
	cv.width = WIDTH;
	cv.height = HEIGHT;

	gl = cv.getContext("webgl") || cv.getContext("experimental-webgl");
	
	if(gl) suported();
	else return;

	cx = cv.width >> 1;
	cy = cv.height >> 1;

	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clearDepth(1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	{
	    //w.addEventListener('resize',onResize,false);
	    w.addEventListener('mousemove', function(e) {

		//  draw();
	    }, false);

	    w.addEventListener('click', function(e) {
		//getTarget();
	    }, false);
	    //-----------------------------
	}

	setUp();
    };

    function suported(){
	var rep;
	cv = d.getElementById("glsl")	;
	rep = d.getElementById("cvReplace");

	cv.style.display = "block";
	rep.style.display = "none";
    };

    /*===============================================
     * =============================================== */
    isCanvasSuported() ? w.addEventListener('load',glInit,false): null;//alert('canvas not suported');
}(document, window);


