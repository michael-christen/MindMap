 var theUI = {
	nodes:{
	    A:{name:'A', shape:'dot'},
	    B:{name:'B', shape:'dot'},
	    C:{name:'C', shape:'dot'},
	    D:{name:'D', shape:'dot'},
	},
	edges:{
	    A:{
	        C:{length: .8, name:'action'},
	        D:{length: .8, name:'action'},
	    }
	}
  };
var sys;


(function($){
  var Renderer = function(canvas){
    var canvas = $(canvas).get(0)
    var ctx = canvas.getContext("2d");
    var particleSystem;
    






    var that = {
      init:function(system){
        //
        // the particle system will call the init function once, right before the
        // first frame is to be drawn. it's a good place to set up the canvas and
        // to pass the canvas size to the particle system
        //
        // save a reference to the particle system for use in the .redraw() loop
        particleSystem = system

        // inform the system of the screen dimensions so it can map coords for us.
        // if the canvas is ever resized, screenSize should be called again with
        // the new dimensions
        particleSystem.screenSize(canvas.width, canvas.height) 
        particleSystem.screenPadding(80) // leave an extra 80px of whitespace per side
        
        // set up some event handlers to allow for node-dragging
        that.initMouseHandling()
      },
      
      redraw:function(){
        // 
        // redraw will be called repeatedly during the run whenever the node positions
        // change. the new positions for the nodes can be accessed by looking at the
        // .p attribute of a given node. however the p.x & p.y values are in the coordinates
        // of the particle system rather than the screen. you can either map them to
        // the screen yourself, or use the convenience iterators .eachNode (and .eachEdge)
        // which allow you to step through the actual node objects but also pass an
        // x,y point in the screen's coordinate system
        // 
        ctx.fillStyle = "white"
        ctx.fillRect(0,0, canvas.width, canvas.height)
        
        particleSystem.eachEdge(function(edge, pt1, pt2){
          // edge: {source:Node, target:Node, length:#, data:{}}
          // pt1:  {x:#, y:#}  source position in screen coords
          // pt2:  {x:#, y:#}  target position in screen coords

          // draw a line from pt1 to pt2
          ctx.strokeStyle = "rgba(0,0,0, .333)"
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(pt1.x, pt1.y)
          ctx.lineTo(pt2.x, pt2.y)
          ctx.stroke()

	  ctx.fillStyle = 'black';
	  ctx.font = 'italic 13px sans-serif';
	  ctx.fillText(edge.data['name'], (pt1.x+pt2.x)/2, (pt1.y+pt2.y)/2);
        })

        particleSystem.eachNode(function(node, pt){
          // node: {mass:#, p:{x,y}, name:"", data:{}}
          // pt:   {x:#, y:#}  node position in screen coords
          
      
		var maxWidth = 400;
		var actDim;
		var lineHeight = 25;

		ctx.font = '16pt Calibri';
		ctx.fillStyle = '#333';

		ctx.fillStyle = 'black';
		ctx.font = 'italic 13px sans-serif';

		actDim =  getDim(ctx, node.name, maxWidth, lineHeight);
		var actHeight = actDim.height;
		var actWidth = actDim.width;
		// draw a rectangle centered at pt
		ctx.beginPath();
		ctx.rect(pt.x-10, pt.y-actHeight/2 - 10,
		    actWidth+10,actHeight+10);
		ctx.fillStyle = "white"; 
		ctx.fill();
		ctx.lineWidth = 7;
		ctx.strokeStyle = 'black';
		ctx.stroke();
		ctx.fillStyle = 'black';
		ctx.font = 'italic 13px sans-serif';
		wrapText(ctx, node.name, pt.x, pt.y, maxWidth, lineHeight);

        })    			
      },
      
      initMouseHandling:function(){
        // no-nonsense drag and drop (thanks springy.js)
        var dragged = null;

        // set up a handler object that will initially listen for mousedowns then
        // for moves and mouseups while dragging
        var handler = {
          clicked:function(e){
            var pos = $(canvas).offset();
            _mouseP = arbor.Point(e.pageX-pos.left, e.pageY-pos.top)
            dragged = particleSystem.nearest(_mouseP);

            if (dragged && dragged.node !== null){
              // while we're dragging, don't let physics move the node
              dragged.node.fixed = true
            }

            $(canvas).bind('mousemove', handler.dragged)
            $(window).bind('mouseup', handler.dropped)

            return false
          },
          dragged:function(e){
            var pos = $(canvas).offset();
            var s = arbor.Point(e.pageX-pos.left, e.pageY-pos.top)

            if (dragged && dragged.node !== null){
              var p = particleSystem.fromScreen(s)
              dragged.node.p = p
            }

            return false
          },

          dropped:function(e){
            if (dragged===null || dragged.node===undefined) return
            if (dragged.node !== null) dragged.node.fixed = false
            dragged.node.tempMass = 1000
            dragged = null
            $(canvas).unbind('mousemove', handler.dragged)
            $(window).unbind('mouseup', handler.dropped)
            _mouseP = null
            return false
          }
        }
        
        // start listening
        $(canvas).mousedown(handler.clicked);

      },
      
    }
    return that
  }    
  $(document).ready(function(){
    sys = arbor.ParticleSystem(1000, 600, 0.5) // create the system with sensible repulsion/stiffness/friction
    sys.parameters({gravity:true}) // use center-gravity to make the graph settle nicely (ymmv)
    sys.renderer = Renderer("#viewport") // our newly created renderer will have its .init() method called shortly by sys...

    // add some nodes to the graph and watch it go...
    /*
    sys.addEdge('a','b');
    sys.addEdge('a','c');
    sys.addEdge('a','d');
    sys.addEdge('a','e');
    sys.addNode('f', {alone:true, mass:.25});
    */
//    sys.graft(theUI);

    // or, equivalently:
    //
    // sys.graft({
    //   nodes:{
    //     f:{alone:true, mass:.25}
    //   }, 
    //   edges:{
    //     a:{ b:{},
    //         c:{},
    //         d:{},
    //         e:{}
    //     }
    //   }
    // })
    
  })

})(this.jQuery)
function getDim(ctx, text, maxWidth, lineHeight) {
    var words = text.split(' ');
    var line = '';
    var actWidth = 0;
    var actHeight = lineHeight;

    for(var n = 0; n < words.length; n++) {
	var testLine = line + words[n] + ' ';
	var metrics = ctx.measureText(testLine);
	var testWidth = metrics.width;
	if (testWidth > maxWidth && n > 0) {
	    line = words[n] + ' ';
	    actHeight += lineHeight;
	    actWidth = maxWidth;
	}
	else {
	    if(testWidth > actWidth)
		actWidth = testWidth;
	    line = testLine;
	}
    }
    return {width: actWidth, height: actHeight};
}
function wrapText(context, text, x, y, maxWidth, lineHeight) {
    var words = text.split(' ');
    var line = '';
    var actWidth = 0;
    var actHeight = lineHeight;

    for(var n = 0; n < words.length; n++) {
	var testLine = line + words[n] + ' ';
	var metrics = context.measureText(testLine);
	var testWidth = metrics.width;
	if (testWidth > maxWidth && n > 0) {
	    context.fillText(line, x, y);
	    line = words[n] + ' ';
	    y += lineHeight;
	    actHeight += lineHeight;
	    actWidth = maxWidth;
	}
	else {
	    if(testWidth > actWidth)
		actWidth = testWidth;
	    line = testLine;
	}
    }
    context.fillText(line, x, y);
    return {width: actWidth, height: actHeight};
}

