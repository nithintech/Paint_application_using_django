Array.prototype.insert=function(index,item){
		this.splice(index,0,item);
};
	var tool;
	var json_array =[];
	var cord={};
	var movestate=false;
	var color="red";
	var savepoints=[];
	var savecount=-1;
	var pointersize=1;
	var ol=[];
	var undool=[];
	function ollist(update){
		if(document.getElementById("savename").value){
        	$.post('/save/', {
        	'data': JSON.stringify(ol),
		'name':document.getElementById("savename").value,
		'update':update
   		 }).done(function success(datas){
			if(datas[1]=="error" && confirm("data already exist do you want update it"))
						ollist(1);
			else alert('saved succesfully');
        	}).fail(function error(){
                alert("error");
           });
	};
	};

	function savedlist(update){
        	$.post('/savelist/', {
   		 }).done(function success(datas){
			data1 = datas;
			table="<ol>"
			for(var i=0; i < data1.length; ++i)
				table= table + "<li>"+data1[i]+"</li>"
			table=table + "</ol>"
			var class_table = document.getElementById("suggestion");
			class_table.innerHTML = table;
        	}).fail(function error(){
                alert("error");
           });
	};

       function savedlist1(update){
		name = document.getElementById("savename1").value;
		var loader=document.getElementById("loader");
		loader.style.display="inline-block";
		var name=name;
		var url='/loaddata/';
                $.post(url, {'name':name
                 }).done(function success(datas){
			console.log('ssssssssssssssssssssssssss',datas[0]['imagedata']);
			datas=JSON.parse(datas[0]['imagedata']);
			console.log('ssssssssssssssssssssssssss',datas);
			clearscreen();
			ol=[];
			tool=null;
			savepoints=[];
        		savecount=-1;
			undool=[];
			for(x in datas)
				draw_load(datas[x]);
			loader.style.display="None";
                }).fail(function error(){
		loader.style.display="None";
                alert("error");
           });
	};

	function draw_load(data){
		if (data==null)
			return {}
		var b_canvas = document.getElementById("a");
                var b_context = b_canvas.getContext("2d");
		tool=data.type;
                b_context.fillStyle=data.color;
                b_context.strokeStyle=data.color;
                b_context.lineWidth=data.pointersize;
                b_context.beginPath();
		if(tool=="rectangle"){
			var x=data.start[0];y=data.start[1];
                	var w=data.spec[0];h=data.spec[1];
                        b_context.strokeRect(x,y,w,h);
                        b_context.stroke();
                        ol.push({type:'rectangle',start:[x,y],spec:[w,h],color:data.color,pointersize:data.pointersize});
                };
		if(tool=="fillrectangle"){
			var x=data.start[0];y=data.start[1];
                	var w=data.spec[0];h=data.spec[1];
                        b_context.fillRect(x,y,w,h);
                        ol.push({type:'fillrectangle',start:[x,y],spec:[w,h],color:data.color,pointersize:data.pointersize});
		};
		if(tool=="circle" || tool=="filledcircle"){
		       var x=data.centre[0];y=data.centre[1];
                       var radius=data.radius;
                       b_context.beginPath();
                       b_context.arc(x,y,radius,0,Math.PI*2,false);
                       if(tool=="circle")
                                b_context.stroke();
                       else
                                b_context.fill();
                        ol.push({type:tool,centre:[x,y],radius:data.radius,color:data.color,pointersize:data.pointersize});
		};
		if(tool=="text"){
			var x=data.start[0];y=data.start[1];
                        var text=data.content;
                        var size=data.size;
                        b_context.font =data.font;
                        var ey=data.ey;
                        if(ey>=0)
                                b_context.textBaseline = "top";
                        else
                                b_context.textBaseline = "bottom";
                        b_context.fillText(text,x,y);
                        ol.push({type:tool,start:[x,y],size:size,color:data.color,content:text,pointersize:data.pointersize,ey:ey,font:data.font});
		};
		if(tool=="line"){
                        var x=data.end[0];
                        var y=data.end[1];
			var s1=data.start[0];
			var s2=data.start[1];
                        b_context.moveTo(s1,s2);
                        b_context.lineTo(x,y);
                        b_context.stroke();
                        ol.push({type:tool,start:[s1,s2],end:[x,y],color:data.color,pointersize:data.pointersize});
                };
		if(tool=="eraser"){
			console.log("eraser");
			var x=data.start[0];y=data.start[1];
                        var ps=data.spec[0];
			b_context.clearRect(x,y,ps,ps);
                        ol.push({type:"eraser",start:[x,y],spec:[ps,ps],color:data.color,pointersize:data.pointersize});
		};
		if(tool=="image"){
			var c = document.getElementById("a");
                        var ctx = c.getContext("2d");
                        var img=new Image();
                        img.src = data.data;
                        ctx.drawImage(img,0,0);
			ol.push({type:"image",data:data.data});
		};
	if(tool!="pen")
                        savestate();
	};

	function SetColor(value) {
		color = value;
	};
	function setsize(value){
		pointersize=value;
		document.getElementById("sizeofbrush").innerHTML=pointersize;
	};
	function settool(x){
		tool=x;
	};
	function savestate(){
		var l=document.getElementById("a").toDataURL();
		savepoints.insert(savecount+1,l);
		savecount++;
	};
	function undo(){
		if(savecount>=0){
			clearscreen();
			var c = document.getElementById("a");
                	var ctx = c.getContext("2d");
			var img=new Image();
			if(savecount>0){
				undool.push(ol.pop());
                		img.src = savepoints[savecount-1];
                		ctx.drawImage(img,0,0);};
				savecount--;
		};
	};
	function redo(){
                if(savecount<savepoints.length-1){
                        clearscreen();
                        var c = document.getElementById("a");
                        var ctx = c.getContext("2d");
                        var img=new Image();
			img.src = savepoints[savecount+1];
			ol.push(undool.pop());
                        ctx.drawImage(img,0,0);
			if(savecount<savepoints.length-1)
                        	savecount++;
                };
        };
	function save(){
		var b_canvas = document.getElementById("a");
		var image=b_canvas.toDataURL();
		var link = document.createElement("a");
    		link.download = "";
    		link.href = image;
    		link.click();
	};
	function preview(){
                var b_canvas = document.getElementById("a");
                var image=b_canvas.toDataURL();
		window.open(image,'_blank');
        };
	function setstart(event){
		if(tool=="eraser" || tool=="pen")
			movestate=true;
		var c=document.getElementById("a");
		cord.sx=event.clientX-c.getBoundingClientRect().left;
		cord.sy=event.clientY-c.getBoundingClientRect().top;
	};
	function setend(event){
                movestate=false;
                var c=document.getElementById("a");
                cord.ex=event.clientX-c.getBoundingClientRect().left-cord.sx;
                cord.ey=event.clientY-c.getBoundingClientRect().top-cord.sy;
		drawshape(event);
		if(tool=="pen" || tool=="eraser")
			savestate();
        };
	function drawshape(event){
		var b_canvas = document.getElementById("a");
                var b_context = b_canvas.getContext("2d");
		b_context.fillStyle=color;
		b_context.strokeStyle=color;
		b_context.lineWidth=pointersize;
		b_context.beginPath();
		if(tool=="rectangle"){
			b_context.strokeRect(cord.sx,cord.sy,cord.ex,cord.ey);
			b_context.stroke();
			json_array.push({'type':tool,'p1':cord.sx,'p2':cord.sy,'p1':cord.ex,'p2':cord.ey});
			ol.push({type:tool,start:[cord.sx,cord.sy],spec:[cord.ex,cord.ey],color:color,pointersize:pointersize});
		};
		if(tool=="fillrectangle"){
                        b_context.fillRect(cord.sx,cord.sy,cord.ex,cord.ey);
			json_array.push({'type':tool,'p1':cord.sx,'p2':cord.sy,'p1':cord.ex,'p2':cord.ey,'fill_color':color});
			ol.push({type:tool,start:[cord.sx,cord.sy],spec:[cord.ex,cord.ey],color:color,pointersize:pointersize});
                };
		if(tool=="circle" || tool=="filledcircle"){
		       var radius=Math.sqrt(Math.pow(cord.ex,2)+Math.pow(cord.ey,2));
		       b_context.beginPath();
                       b_context.arc(cord.sx,cord.sy,radius,0,Math.PI*2,false);
		       if(tool=="circle")
		       		b_context.stroke();
		       else
				b_context.fill();
			json_array.push({'type':tool,'centre':[cord.sx,cord.sy],'radius':radius,'color':color})
			ol.push({type:tool,centre:[cord.sx,cord.sy],radius:radius,color:color,pointersize:pointersize});
                };
		if(tool=="text"){
			var text=document.getElementById("textbox").value;
			var size=Math.sqrt(Math.pow(cord.ex,2)+Math.pow(cord.ey,2));
			font=size+"px Arial";
			b_context.font =size+"px Arial";
			if(cord.ey>=0)
				b_context.textBaseline = "top";
			else
				b_context.textBaseline = "bottom";
			b_context.fillText(text,cord.sx,cord.sy);
			ol.push({type:tool,font:font,start:[cord.sx,cord.sy],size:size,color:color,content:text,pointersize:pointersize,ey:cord.ey});
		};
		if(tool=="line"){
                	var x=event.clientX-b_canvas.getBoundingClientRect().left;
                	var y=event.clientY-b_canvas.getBoundingClientRect().top;
			b_context.moveTo(cord.sx,cord.sy);
			b_context.lineTo(x,y);
			b_context.stroke();
			json_array.push({'type':tool,'start':[cord.sx,cord.sy],'end':[x,y],'color':color})
			ol.push({type:tool,start:[cord.sx,cord.sy],end:[x,y],color:color,pointersize:pointersize});
			b_context.closePath();
		};
		if(tool!="pen" && tool!="eraser")
			savestate();
	};
	function clearscreen(){
                var b_canvas = document.getElementById("a");
                b_canvas.width = b_canvas.width;
		json_array = []
		ol=[];
        };
	function moveactions(event){
		var bcan = document.getElementById("a");
                var b = bcan.getContext("2d");
		ps=pointersize;
                var x=event.clientX-bcan.getBoundingClientRect().left;
                var y=event.clientY-bcan.getBoundingClientRect().top;
                b.beginPath();
		if (tool=="eraser" && movestate==true){
			b.clearRect(x,y,ps,ps);
			ol.push({type:"eraser",start:[x,y],spec:[ps,ps],color:color,pointersize:pointersize});
                };
		if(tool=="pen" && movestate==true){
			b.fillStyle=color;
                        b.fillRect(x,y,ps,ps);
			ol.push({type:"fillrectangle",start:[x,y],spec:[ps,ps],color:color,pointersize:pointersize});
		};
	};
        
	function rgbToHex(r, g, b){
    		if (r > 255 || g > 255 || b > 255)
        	throw "Invalid color component";
    		return ((r << 16) | (g << 8) | b).toString(16);
    	};
	
	
function load_json(){
	var myJsonString = JSON.stringify(json_array);
	alert(myJsonString);
}
