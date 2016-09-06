//判断是否点击分类
window.onload=function(){
	var classicon=yc.$('classicon');
	var cont2=yc.$('cont2');
	var timer=null;
	
	//判断是否点击分类
	var isclick=false;
	yc.addEvent('classed',"click",function(){
		isclick=!isclick;
		if(isclick){
			classicon.style.backgroundPosition="-49px -13px";
			findTags("全部");
			//yc.editCSSRule("#web","{'height':'auto'}");
			web.style.height="auto";
		}else{
			classicon.style.backgroundPosition="-67px -13px";
			web.style.height="400px";
		}
	});

	//添加数据
	yc.addEvent('set-add',"click",function(){
		yc.$("bg").style.display ="block";
		yc.$("show").style.display ="block";
	});

	//遮罩层
	function mask(){
		yc.$("bg").style.display ='none';
		yc.$("show").style.display ='none';
		var eles=document.myform.elements;
		for(var i=0;i<eles.length;i++){
			if(eles[i].type=="text"||eles[i].type=="textarea"){
				eles[i].value="";
			}
		}
	};
	yc.addEvent('btnclose',"click",mask);
	yc.addEvent('btnclose','click',function(){
			yc.removeClassName("show","addshake");
		});

	//编辑
	yc.addEvent("btnclose1","click",function(){
		yc.$("dialog").style.display="none";
		yc.$("mask").style.display="none";
		yc.removeClassName("dialog","addshake");
	});
	


	//缓冲运动
	function move(node,target){
	 	clearInterval(timer1);
	     timer1 = setInterval(function(){
	   		var speed = (target-node.offsetLeft)/8;
	     	speed = speed>0?Math.ceil(speed):Math.floor(speed);
	     	if(node.offsetLeft == target){
	     	    clearInterval(timer1);
	     	}else{
	     	    node.style.left = node.offsetLeft+speed+"px";
	     	}
	    },30);
	}

	//左右箭头
	var ul1=yc.$('ul1');
	var timer1=null;

	yc.addEvent('arrow_l',"click",function(){
		var target=yc.$('ul1').offsetLeft;
		// console.log(target+840);
		if((target+840)!=0){
			move(ul1,target+840);
		}
		// yc.$('ul1').style.left=yc.$('ul1').offsetLeft+840+"px";

	});

	yc.addEvent('arrow_r',"click",function(){
		var target=yc.$('ul1').offsetLeft;
		// console.log(target-840);
		move(ul1,target-840);
		// yc.$('ul1').style.left=yc.$('ul1').offsetLeft-840+"px";
	});

	//图片渐变
	var alpha=30;
	var timer=null;

	function startMove(node,iTarget)
	{
		clearInterval(timer);
		timer=setInterval(function (){
			var speed=0;
			if(alpha<iTarget){
				speed=10;
			}
			else{
				speed=-10;
			}
			if(alpha==iTarget){
				clearInterval(timer);
			}
			else{
				alpha+=speed;
				node.style.filter='alpha(opacity:'+alpha+')';
				node.style.opacity=alpha/100;
			}
		}, 80);
	}

	var gradient=yc.$("gradient");
	gradient.onmouseover=function ()
	{
		startMove(gradient,100);
	};
	gradient.onmouseout=function ()
	{
		startMove(gradient,30);
	};
	
	//显示云图
	function dataProcessing(tags,count){
		var div=document.createElement("div");
		div.className="div";
		div.innerHTML=tags;
		div.style.fontSize="12px";
		var x=getRandom(0,window.innerWidth*0.65);
		var y=getRandom(0,window.innerHeight-150);
		var colornum=getRandom(0,5);
	
		var style="position:absolute;left:"+x+"px;top:"+y+"px;";
		style+="width:"+(30+count*5)+"px;"+"height:"+(30+count*5)+"px;";
		style+="line-height:"+(30+count*5)+"px;"
		style+="font-size:"+(12+count/2)+"px;"
		style+="background:"+colorarr[colornum]+";";
		div.setAttribute("style",style);

		yuntu_web.appendChild(div);
	}
	var yuntu_web=yc.$('yuntu_web');
	yc.addEvent('yuntu','click',function(){
		yuntu_web.style.display="block";
		move(yuntu_web,Math.floor(window.innerWidth*0.2));
		setTimeout('yc.addClassName("mybody","pink")',50);
	});
	var timer3=null;
	yc.addEvent('yuntu_web','click',function(){
		move(yuntu_web,Math.floor(window.innerWidth));
		yuntu_web.style.display="none";
		setTimeout('yc.removeClassName("mybody","pink")',50);
		})
	//获取一定范围内的随机数
	function getRandom(min,max){
		return Math.floor(Math.random()*(max-min)+min);
	}

	//添加新网址
	function addData(){
	if(yc.$('flabel').value && yc.$('furl').value){
				var options={
			    "method":"POST",
			    "send":yc.serialize(document.myform),
			   "jsonResponseListener":function(json){
				if(json.code=0){
					alert("添加失败");
				}else{
					mask();
					allTags();
					findTags("全部");
				}
			 }
		   };
		// console.log(options.send);
		yc.ajaxRequest("http://218.196.14.220:8080/webtag/favorite_add.action",options);
		
	 }else{
		 if(yc.hasClassName("show","addshake")){
					yc.removeClassName("show","addshake");
					setTimeout('yc.addClassName("show","addshake")',20);
				}else{
					yc.addClassName("show","addshake");
				}
		 }	
	};
	yc.addEvent("btncomfirm","click",addData);
	//编辑网站 网址 
	yc.addEvent("btncomfirm1","click",function(){
			if(!yc.$('flabel').value ||!yc.$('furl').value){
				 if(yc.hasClassName("dialog","addshake")){
					yc.removeClassName("dialog","addshake");
					setTimeout('yc.addClassName("dialog","addshake")',20);
				}else{
					yc.addClassName("dialog","addshake");
				}
			}
			yc.ajaxRequest("http://218.196.14.220:8080/webtag/favorite_update.action",options); 	

	})
	//请求所有标签
	var count=0;
	function allTags(){
		var options={
			"method":"POST",
			"send":null,
			"jsonResponseListener":function(json){
				//console.log(json);
				var tagsarr=json.obj;
				//将插入的清空
				// yc.$("node").innerHTML="";
				var check=/\d|([\u4e00-\u9fa5][a-z])|([a-z][\u4e00-\u9fa5])/i;
				for(var i in tagsarr){
					if (tagsarr.hasOwnProperty(i)) {
						// console.log(tagsarr[i].tcount);
						// console.log(tagsarr[i]);
						// console.log(tagsarr[i]["tname"]);
						if(!check.test(tagsarr[i]["tname"])){
						count+=tagsarr[i].tcount;
						// var adiv=document.createElement("div");
						// adiv.className="tagclass";
						var ali=document.createElement("li");
						ali.innerHTML=tagsarr[i]["tname"];
						var span=document.createElement("span");
						span.className='countspan';
						span.innerHTML="["+tagsarr[i]['tcount']+"]";
						ali.appendChild(span);
						ali.className='webli';
						//ali.style.backgroundColor=colorarr[Math.floor(Math.random()*10)];
						yc.$(ul1).appendChild(ali);
						//findTags(tagsarr[i]["tname"]);
						(function(name){
							yc.addEvent(ali,"click",function(){
								findTags(name);
							})
							dataProcessing(tagsarr[i]["tname"],tagsarr[i]["tcount"]);
						})(tagsarr[i]["tname"]);
				}
				if(count<100){
					yc.$('count').innerHTML=count;
				}else{
					yc.$('count').innerHTML='99+';
				}
				}
			}
			}
		}
		yc.ajaxRequest("http://218.196.14.220:8080/webtag/tag_findAll.action",options);
	}
	allTags();
	findTags("全部");

	var elearr=[];
	var hrefurl=[];//把url放入数组中取出来
	//最开始颜色的版本colorarr1
	var colorarr=['#99CCCC','#FF9999','#48D1CC','#A4D3EE','#8DB6CD'];
	function findTags(tname){
		var options={
			"method":"POST",
			"send":"tname="+tname,
			"jsonResponseListener":function(json){
				yc.$('ul3').innerHTML="";
				var tagarr=json.obj;
				// console.log(tagarr);
				var reg=/^([https|http]?:\/\/)?(www)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
				var check=/\d|([\u4e00-\u9fa5]{1,}[a-z])|([a-z][\u4e00-\u9fa5])/i;
				for(var i=0;i<tagarr.length;i++){
					// console.log(tagarr[i][value]);
					if(reg.test(tagarr[i]['furl']) && tagarr[i]['flabel']&& !check.test(tagarr[i]['flabel'])){
						//var li=document.createElement("li");
						var obj={};
						var nav=document.createElement("a");
						nav.className='nav';
						var del=document.createElement("div");
						var nav_text=document.createElement("div");
						var span=document.createElement("span");
						var pen=document.createElement("span");
						del.data=tagarr[i].fid;
						if(tagarr[i]['furl'].indexOf("http://")>=0){
							nav.href=tagarr[i]['furl'];
							hrefurl.push(tagarr[i]['furl']);
						}else{
							nav.href="http://"+tagarr[i]['furl'];
							hrefurl.push("http://"+tagarr[i]['furl']);
						}
						del.className="del_icon";
						del.style.display="none";
						nav.appendChild(del);
						nav_text.className="nav_text";
						var spanvalue=document.createTextNode(tagarr[i]['flabel']);
						span.appendChild(spanvalue);
						nav.style.backgroundColor=colorarr[Math.floor(Math.random()*6)];
						pen.className="pen";
						pen.style.display="none";
						nav_text.appendChild(span);
						nav_text.appendChild(pen);
						nav.appendChild(nav_text);
						yc.$('ul3').appendChild(nav);
						obj.del=del;
						obj.pen=pen;
						obj.nav=nav;
						elearr.push(obj);
						

						//li.innerHTML=tagarr[i]['flabel'];
						//li.className='label';
					}
				}
				// console.log(urlarr);
			}
		};
		yc.ajaxRequest("http://218.196.14.220:8080/webtag/favorite_findAll.action",options);
	}
	
	//"http://218.196.14.220:8080/webtag/favorite_del.action?fid=编号； 1是成功。
	
	
	var flag=false;
	yc.addEvent("set-edit","click",function(){
		flag=!flag;
		yc.addClassName("web","shake");
		for(var i=0;i<elearr.length;i++){
			var obj=elearr[i];
			console.log(obj)
			if(flag){
				obj.del.style.display="block";
		        obj.pen.style.display="inline-block";
				//obj.nav.style.cssText="border:1px solid blue; border-radius:10px;";
				obj.nav.href="javascript:;";
				(function(i){
					var obj=elearr[i];
				yc.addEvent(obj.nav,"mouseover",function(){
					if(flag){
						obj.nav.style.cssText="background-color:rgba(18,18,156,0.5);border:2px dotted black;border-radius:10px;";
						obj.pen.style.backgroundPosition="-82px 2px";
						obj.del.style.backgroundPosition="-15px -12px";
					 }
				});
				yc.addEvent(obj.nav,"mouseout",function(){
					if(flag){
						obj.nav.style.cssText=" ";
						obj.pen.style.backgroundPosition="-12px 2px";
						obj.del.style.backgroundPosition="0px -12px";
					}
				});
				yc.addEvent(obj.del,"click",function(){
					if(flag){
						var options={
							"method":"POST",
							"send":"fid="+obj.del.data,
							"jsonResponseListener":function(json){ 
								obj.nav.parentNode.removeChild(obj.nav);
								}
							}
							yc.ajaxRequest("http://218.196.14.220:8080/webtag/favorite_del.action",options);
						}
						
					});
				yc.addEvent(obj.pen,"click",function(){
					if(flag){
						dialog.style.display="block";
						yc.$('mask').style.display="block";
						}
				});
		
			})(i)
			}else{
				obj.del.style.display="none";
				obj.pen.style.display="none";
				//obj.nav.style.cssText=" ";
				obj.nav.style.backgroundColor=colorarr[Math.floor(Math.random()*6)];
				yc.removeClassName("web","shake");
				obj.nav.href=hrefurl[i];
				//还要设置一下obj.nav.href=数组里面的值
			}
		}
		
	});
	
}