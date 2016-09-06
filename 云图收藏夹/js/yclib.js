//库:   放一些内置函数的扩展 ( String,  Array, Object  )
//      放一些自定义的函数,这些函数为了不与别的库冲突，定义到一个命名空间( 对象) 中. 
(function(){
	//给window添加了一个属性( 命名空间 )
	if(  !window.yc   ){
			//window.yc={};
			window['yc']={};
	}
	/*
	window.yc.prototype={
		$:function(){
				
		}	
	}
	*/
	
	//判断当前浏览器是否兼容这个库:  浏览器能力检测.
	function isCompatible( other){
		if( other===false || !Array.prototype.push || !Object.hasOwnProperty || !document.createElement ||  !document.getElementsByTagName ){
			return false;	
		}	
		return true;
	};
	window['yc']['isCompatible']=isCompatible;
	
	/////////////////////////////////////////////获取页面元素的操作///////////////////
	//   <div id="a">    <div id="b">
	 //  $("dddd");     var array=$("a","b")   =>  1个参数则返回一个对象      array=>2    array=> 0
	 //如果参数是一个字符串，则返回一个对象
	 //如果参数是多个字符串,则返回一个数组  
	function $( ){
		 var elements=new Array();
		//查找作为参数提供的所有元素
		for( var i=0;i<arguments.length;i++){
			var element=arguments[i];       //    "b","c"     Node(b)
			//如果这个元素是一个string,则表明这是一个id
			if( typeof element=='string'){
				element=document.getElementById( element );	
			}	
			if(   arguments.length==1){
				return element;	
			}		
			elements.push( element );
		}	
		return elements;
	}
	window['yc']['$']=$;
	
	
	//    className: 要找的类名    tag:要查找的标签    parent: 如果有的话，表示tag所属的容器
	function getElementsByClassName( className, tag,  parent){  
		parent=parent||document;
		if(  !(parent=$(parent)) ){
			return false;	
		}
		//查看所有匹配的标签
		var allTags=(tag=="*"&&parent.all)?parent.all:parent.getElementsByTagName(tag);
		var matchingElements=new Array();
		//创建一个正则表达式，来判断className是否正确       ^a ||    a 
		var regex=new RegExp( "(^|\\s)"+className+"(\\s|$)");   //   class="ba b"  class=" a b "
		var element;
		//检查每个元素
		for( var i=0;i<allTags.length;i++){
			element=allTags[i];
			if( regex.test(element.className) ){  // true/false    if(   indexOf("a")
				matchingElements.push( element );	
			}	
		}
		return matchingElements;
	};
	window['yc']['getElementsByClassName']=getElementsByClassName;
	
	
	
	
	/////////////////////////////////////////////事件操作  /////////////////////
	
	//增加事件:  node:节点    type:事件类型( 'click')     listener:监听器函数
	function addEvent( node, type, listener){ 
		if( !isCompatible() ){ return false;}
		if( !(node=$(node))){  return false; }
		//W3C加事件的方法
		if( node.addEventListener   ){
				node.addEventListener( type, listener, false);
				return true;
		}else if( node.attachEvent ){
			//MSIE的事件
			node['e'+type+listener]=listener;
			node[type+listener]=function(){
				node['e'+type+listener](   window.event  );
				//listener( window.event);	
			}	
			node.attachEvent('on'+type,node[type+listener] );
			return true;
		}
    };
	window['yc']['addEvent']=addEvent;
	
	
	
	
	/*
	 页面加载事件
	*/
	function addLoadEvent( func   ){
		//将现有的window.onload事件处理函数的值存入变量oldOnLoad
		var oldOnLoad=window.onload;
		//如果在这个处理函数上还没有绑定任何函数，就像平时那样把新函数添加给它. 
		if( typeof window.onload!='function'){
			window.onload=func;	
		}else{
			//如果在这个处理函数上已经绑定了一些函数，则将新函数追加到现有指令的尾部. 
			window.onload=function(){
				oldOnLoad();    //如果以前这个页面有函数，则调用 以前的函数
				func();	   //再调当前函数.
			}	
		}
	}
	window['yc']['addLoadEvent']=addLoadEvent;
	
	
	
	
	//移除事件
	function removeEvent(node, type, listener){  
		if( !(node=$(node)) ) {  return false;}
		if( node.removeEventListener){   // ff
			node.removeEventListener( type,listener, false);
			return true;	
		}else if( node.detachEvent){  //ie
			node.detachEvent( 'on'+type,node[type+listener] );
			node[type+listener]=null;
			return true;	
		}
		return false;
    };
	window['yc']['removeEvent']=removeEvent;
	///////////////////////注意点:   添加事件时用的函数必须与删除时用的函数要是同一个函数 ////////
	/*
	   var show=function(){
			alert( "hello");	
		}
	yc.addEvent(  "show", "click", show );   //   添加事件时用了一个函数
	yc.removeEvent(  "show", "click", show);     // 删除时用了另一个函数 
	   // 以上对
	   yc.addEvent( "show","click",function(){ alert("hello");  });
	   yc.removeEvent( "show","click",function(){ alert("hello");  });
		 以上错误，无法移除，因为匿名函数是两个函数.
	*/
	
	
	
	
	
	
	
	////////////////////////////////////////////////界面显示效果/////////////////////
	//开关操作:用于操作页面元素是否显示或隐藏
	function toggleDisplay(node, value){  
		if(  !(node=$(node))) { return false; }
		if( node.style.display!='none' ){
			node.style.display='none';	
		}else{
			node.style.display=value||'';	
		}
		return true;
	};
	window['yc']['toggleDisplay']=toggleDisplay;
	
	
	
	
	//动画：定时移动元素
	function moveElement( elementId, final_x, final_y, interval){
		if( !isCompatible() ) return false;
		if( !$( elementId) ) return false;
		var elem=$( elementId);
		
		//清空movement
		//在这里如何清空呢???
		
		var xpos=parseInt( elem.style.left);
		var ypos=parseInt( elem.style.top);
		if( xpos==final_x && ypos==final_y ){
			return true;	
		}
		if( xpos<final_x){
			xpos++;	
		}
		if( xpos>final_x){
			xpos--;	
		}
		if( ypos<final_y){
			ypos++;	
		}
		if( ypos>final_y){
			ypos--;	
		}
		elem.style.left=xpos+"px";
		elem.style.top=ypos+"px";
		var repeat="yc.moveElement('"+elementId+"',"+final_x+","+final_y+","+interval+")";
		setTimeout(repeat, interval);
		
	}
	window['yc']['moveElement']=moveElement;
    
	
	
	
	///////////////////////////////////////DOM中的节点操作补充///////////////
	///  标准 a.appendChild(b)   在a的子节点的最后加入 b
	///   a. insertBefore( b );   在a的前面加入一个b
	
	//新增的第一个函数:   给  referenceNode的后面加入一个node
	function insertAfter(node, referenceNode){ 
		if( !(node=$(node))){   return false; }
		if( !(referenceNode=$(referenceNode))){  return false; }
		var parent=referenceNode.parentNode;
		if( parent.lastChild==referenceNode ){   //当前节点referenceNode是最后一个节点 ->  appendChild
			parent.appendChild( node );	
		}else{    //  当前节点referenceNode后面还有兄弟节点 
			parent.insertBefore( node, referenceNode.nextSibling );	
		}
	};
	window['yc']['insertAfter']=insertAfter;
	
	//标准(删除节点): node.removeChild(childNode)  =>一次只能删除一个子节点
	//新增的第二个函数:   一次删除所有的子节点
	function removeChildren(parent){
		if( !(parent=$(parent))){   return false; }
		while(  parent.firstChild){
			//parent.firstChild.parentNode.removeChild( parent.firstChild );
			parent.removeChild( parent.firstChild );	
		}	
		//返回父元素，以实现方法连缀。
		return parent;
	};
	window['yc']['removeChildren']=removeChildren;
	
	//在一个父节点的第一个子节点前面添加一个新节点
	function prependChild( parent, newChild ){
		if( !(parent=$(parent))){   return false; }
		if( !(newChild=$(newChild))){  return false; }
		if( parent.firstChild){   //查看parent节点下是否有子节点
			//如果有一个子节点，就在这个子节点前添加
			parent.insertBefore( newChild, parent.firstChild);	
		}else{
			//如果没有子节点则直接添加
			parent.appendChild( newChild);	
		}
		return parent;
	};
	window['yc']['prependChild']=prependChild;
	
	
	
	
	
	//模板替换
	function supplant(str,o) { 
    	return str.replace(/{([^{}]*)}/g, 
        						function (a, b) {  
										var r = o[b];
										//return typeof r === 'string' ? r : a; 
										return r;
        						}
   		 ); 
	}; 
	window['yc']['supplant']=supplant;
	
	function parseJSON(s,filter){
		var j;
		function walk(k,v){
			var i;
			if(v && typeof v==="object"){
				for(i in v){
					if(v.hasOwnProperty(i)){
						v[i]=walk(i,v[i]);
					}
				}
			}
			return filter(k,v);
		}
		if(/^(["'](\\.|[^"\\\n\r])*?["']|[,:{}\[\]0-9.\-+Eaeflnr-u\n\r\t])+?$/.test(s)){
			try{
				j=eval('('+ s +')');
			}catch(e){
				throw new SyntaxError("eval  parseJSON");
			}
		}else{
			throw new SyntaxError("parseJSON");
		}
		if(typeof filter === "function"){
			j=walk('',j);
		}
		return j;
	}
	window['yc']['parseJSON']=parseJSON;
	
	
	/////////////////////////////////////////////////////////////////////////////
	//////////////////样式表操作第一弹: 设置样式规则 ->增强了行内样式, 缺点:css加在style行内.  ///////////////////
	////////////////////////////////////////////////////////////////////////////
	//将word-word 转换为wordWord      fontSize
	function camelize( s ){  // "fond-size".replace(  /-(\w)/g,          =>  ["-s","s"]
		return s.replace(/-(\w)/g, function(strMatch, p1){   //   -s  p1-> s
			  return p1.toUpperCase();
			});	
	}
	window['yc']['camelize']=camelize;
	
	//将wordWord转换为word-word
	function uncamelize(s, sep) {   //   "fondSize".replace( /([a-z])([A-Z])/g     ->  ["dS","d", "S"]
		sep = sep || '-';
		return s.replace(/([a-z])([A-Z])/g, function (match, p1, p2){
													return p1 + sep + p2.toLowerCase();
				});
	} 
	window['yc']['uncamelize']=uncamelize;
	
	
	
	
	
	//通过id修改单个元素的样式  {"backgroundColor":"red"}
	function setStyleById( element,styles){
		//取得对象的引用
		if(  !(element=$(element))){
			return false;
		}
		//遍历styles对象的属性，并应用每个属性. 
		for( property in styles){
			if( !styles.hasOwnProperty(property) ){
				continue;
			}
			if(  element.style.setProperty ){
				//           setProperty(   "background-color" )
				//DOM2样式规范   setProperty(propertyName,value,priority);
				element.style.setProperty(   uncamelize(property,'-')   ,styles[property],   null  );
			}else{
				//备用方法  element.style["backgroundColor"]="red";    
				element.style[   camelize(property)     ]=styles[property];
			}
		}
		return true;
	}
	window['yc']['setStyle']=setStyleById;
	window['yc']['setStyleById']=setStyleById;
	
	
	/*
	通过标签名修改多个样式: 调用举例: yc.setStylesByTagName('a',{'color':'red'} );
	* tagname:标签名
	  styles: 样式对象
	  parent:  父标签的id号
	*/
	function setStylesByTagName( tagname, styles, parent){
		parent=$(parent)||document;
		var elements=parent.getElementsByTagName( tagname);
		for( var e=0;e<elements.length;e++){
			setStyleById( elements[e],styles);
		}
	}
	window['yc']['setStylesByTagName']=setStylesByTagName;
	
	
	
	/*
	通过类名修改多个元素的样式
	parent: 父元素的id
	tag: 标签名
	className: 标签上的类名
	style:样式对象
	*/
	function setStylesByClassName( parent, tag, className,  styles){
		if(  !(parent=$(parent))){
			return false;
		}
		var elements=getElementsByClassName( className, tag, parent);
		for( var e=0; e<elements.length;e++){
			setStyleById( elements[e],styles);
		}
		return true;
	}
	window['yc']['setStylesByClassName']=setStylesByClassName;
	
	
	
	/////////////////////////////////////////////////////////////////////////////
	///////////////////////   样式表操作第二弹: 基于className切换样式 ///////////////////
	////////////////////////////////////////////////////////////////////////////
	/*
	取得元素中类名的数组
	element: 要查找类名的元素
	*/
	function getClassNames( element ){
		if(!(element=$(element))){
			return false;
		}
		//用一个空格替换多个空格，再基于空格分割类名
		return element.className.replace(/\s+/,' ').split(' ');
	}
	window['yc']['getClassNames']=getClassNames;
	
	/*
	检查元素中是否存在某个类
	element: 要查找类名的元素
	className:要查找的类名
	*/
	function hasClassName( element, className){
		if(!(element=$(element))){
			return false;
		}
		var classes=getClassNames(element);  //得到所有的类名
		for( var i=0;i<classes.length;i++){
			if( classes[i]===className){
				return true;
			}
		}
		return false;
	}
	window['yc']['hasClassName']=hasClassName;
	
	/*
	为元素添加类 
	element: 要添加类名的元素
	className:要添加的类名
	*/
	function addClassName( element, className){
		if(!(element=$(element))){
			return false;
		}
		//将类名添加到当前className的末尾, 如果没有类名，则不包含空格
		var space=element.className?' ':'';
		//   a b      b
		element.className+= space+className;
		return true;
	}
	window['yc']['addClassName']=addClassName;
	
	
	/*
	从元素中删除类
	*/
	function removeClassName( element, className){
		if( !(element=$(element))){
			return false;
		}
		//先获取所有的类
		var classes=getClassNames(element);
		//循环遍历数组删除匹配的项
		//因为从数组中删除项会使数组变短，所以要反向删除
		var length=classes.length;
		var a=0;
		for( var i=length-1;i>=0;i--){
			if( classes[i]===className){
				delete(classes[i]);  // delete只将数组中下标为i的元素改为  undefined
				a++;
			}
		}
		element.className=classes.join(' ');
		//判断删除是否成功..
		return (a>0?true:false);
	}
	window['yc']['removeClassName']=removeClassName;
	
	
	/////////////////////////////////////////////////////////////////////////////
	///////////////////////   样式表操作第三部分:更大范围的改变, 切换样式表 ///////////////////
	////////////////////////////////////////////////////////////////////////////
	/*
	通过url取得包含所有样式表的数组
	<link>   <style>
	*/
	function getStyleSheets(url, media){
		var sheets=[];
		for( var i=0;i<document.styleSheets.length;i++){
			if(   !document.styleSheets[i].href  ){
				continue;	
			}
			if( url&& document.styleSheets[i].href.indexOf(url)==-1){
				continue;
			}
			if( media ){
				//规范化media字符串
				media=media.replace(/,\s*/,',');
				var sheetMedia;
				if( document.styleSheets[i].media.mediaText){
					//DOM方法
					sheetMedia=document.styleSheets[i].media.mediaText.replace( /,\s*/,',');
					//Safari会添加额外的逗号和空格
					sheetMedia=sheetMedia.replace(/,\s*$/,'');
				}else{
					//ie方法
					sheetMedia=document.styleSheets[i].media.replace(/,\s*/,',');
				}
				//如果media不匹配，则跳过
				if( media!=sheetMedia ){
					continue;
				}
			}
			sheets.push( document.styleSheets[i]);
		}
		return sheets;
	}
	window['yc']['getStyleSheets']=getStyleSheets;
	
	/*
	添加新样式表
	*/
	function addStyleSheet( url, media){
		media=media||'screen';
		var link=document.createElement('LINK');
		link.setAttribute('rel','stylesheet');
		link.setAttribute('type','text/css');
		link.setAttribute('href',url);
		link.setAttribute('media',media);
		document.getElementsByTagName('head')[0].appendChild( link );
	}
	window['yc']['addStyleSheet']=addStyleSheet;
	
	
	/*
	移除样式表
	*/
	function removeStyleSheet(url, media){
		var styles=getStyleSheets(url,media);
		for( var i=0;i<styles.length;i++){
			//   styles[i]表示样式表  ->  .ownerNode表示这个样式表所属的节点<link>
			var node=styles[i].ownerNode||styles[i].owningElement;
			//禁用样式表
			styles[i].diabled=true;
			//移除节点
			node.parentNode.removeChild( node );
		}
	}
	window['yc']['removeStyleSheet']=removeStyleSheet;
	
	////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////样式表操作第四弹: 操作样式规则////////////////
	//////////////////////////////////////////////////////////////////////////////////////
	
	/*
	添加一条css规则:   yc.addCSSRule( '.test',{ 'font-size':'40%','color':'red'});
		 如果存在多个样式表，可使用 url和media:   yc.addCSSRule( '.test',{'text-decoration':'underline','style.css'});
	*/
	function addCSSRule( selector, styles, index,url, media){
		var declaration='';
		//根据styles参数(样式对象)构建声明字符串
		for(property in styles){
			if( !styles.hasOwnProperty(property)){
				continue;
			}
			declaration+=property+":"+styles[property]+";";   // font-size:40%;color:red;
		}
		//根据url和media获取样式表
		var styleSheets=getStyleSheets(url,media);
		var newIndex;
		//循环所有满足条件的样式表，添加样式规则
		for(var i=0;i<styleSheets.length;i++){
			//添加规则
			if( styleSheets[i].insertRule){
				//计算规则添加的索引位置    cssRules ->  w3c
				newIndex=(index>=0?index:styleSheets[i].cssRules.length);
				//DOM2样式规则添加的方法    insertRule( rule, index);
				styleSheets[i].insertRule( selector+'{'+declaration+'}',newIndex);
			}else if( styleSheets[i].addRule ){
				//计算规则添加的索引位置
				newIndex=(index>=0?index:-1);  // ie中认为规则列表最后一项用-1代表
				//ie样式规则添加的方法   addRule( selector, style [, index] );
				styleSheets[i].addRule( selector, declaration, newIndex);
			}
		}
	}
	window['yc']['addCSSRule']=addCSSRule;
	
	
	/*
	编辑样式规则: yc.editCSSRule('.test',{'font-size':'red'});
	*/
	function editCSSRule( selector, styles, url, media){
		//取出所有的样式表
		var styleSheets= getStyleSheets(url,media);
		// 循环每个样式表中的每条规则.
		for( i=0;i<styleSheets.length;i++){
			//取得规则列表  DOM2样式规范方法是styleSheets[i].cssRules    ie方法是styleSheets[i].rules
			var rules=styleSheets[i].cssRules||styleSheets[i].rules;
			if(  !rules ){
				continue;
			}
			//ie默认选择器名使用大写故转换为大写形式, 如果使用的是区分大小写的id,则可能会导致冲突
			selector=selector.toUpperCase();
			for( var j=0;j<rules.length;j++){
				//检查规则中的选择器名是否匹配
				if( rules[j].selectorText.toUpperCase()==selector){  //找到要修改的选择器
					for( property in styles){
						if( !styles.hasOwnProperty(property) ){
							continue;
						}
						//将这条规则设置为新样式
						rules[j].style[camelize(property)]=styles[property];  //rules[j].style['fontSize']=  'red'
					}
				}
			}
		}
	}
	window['yc']['editCSSRule']=editCSSRule;
	
	
	
	/*
	取得一个元素的计算样式   font-size     fontSize
	*/
	function getStyle( element, property){
		if(!(element=$(element))||!property){
			return false;
		}
		//检测元素style属性中的值
		var value=element.style[  camelize(property)  ];
		if( !value){
			//取得计算值
			if( document.defaultView&&document.defaultView.getComputedStyle){
				//DOM方法
				var css=document.defaultView.getComputedStyle(element,null);   //取出了element这个元素所有的计算样式
				value=css?css.getPropertyValue( property ):null;
			}else if( element.currentStyle){
				//ie方法
				value=element.currentStyle[  camelize(property)   ];
			}
		}
		//返回空字符串而不是auto,这样就不必检查auto值了
		return value=='auto'?'':value;
	}
	window['yc']['getStyle']=getStyle;
	window['yc']['getSytleById']=getStyle;
	
	////////////////////////////////////////////////////////////////////////
	///////////////////////  xml操作 //////////////////////////////////////
	///////////////////////////////////////////////////////////////////////
	//从 xml 文档对象中按  xpath规则提取出要求的节点   /students/student
	function selectXMLNodes(xmlDoc, xpath) {
		if ('\v' == 'v') {
			// IE
			xmlDoc.setProperty("SelectionLanguage", "XPath"); //将当前xml文档的查找方式改为  xpath
			return xmlDoc.documentElement.selectNodes(xpath);
		} else {
			// W3C
			var evaluator = new XPathEvaluator();	
			//                                                          按节点顺序解析
			var resultSet = evaluator.evaluate(xpath, xmlDoc, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
			//通过xpath解析的结果是一个集合.
			var finalArray = [];
			if (resultSet) {
				var el = resultSet.iterateNext();  //循环解到的结果.
				while (el) {
					finalArray.push(el);
					el = resultSet.iterateNext();
				}
				return finalArray;
			}
		}
	}
	window['yc']['selectXMLNodes']=selectXMLNodes;
	
	
	//在xml dom中不能使用getElementById方法，所以这里自己实现一个相似功能的函数
	function getElementByIdXML(rootnode, id) {   //   getElementByIdXML   ==  getElementById
		//先获取所有的元素
		var nodeTags = rootnode.getElementsByTagName('*');   //  * 所有元素
		for (i=0;i<nodeTags.length;i++) {
			if (    nodeTags[i].hasAttribute('id')    ) {
				// 取出属性名为id
				if (nodeTags[i].getAttribute('id') == id)
					return nodeTags[i];
			}
		}
	}
	window['yc']['getElementByIdXML']=getElementByIdXML;
	
	//将  xml的字符串 反序列化转为  xml Dom节点对象,以便于使用   getElementsByTagName()等函数来操作
	function parseTextToXmlDomObject(str) {
		if ('\v' == 'v') {
			//Internet Explorer
			var xmlNames = ["Msxml2.DOMDocument.6.0", "Msxml2.DOMDocument.4.0", "Msxml2.DOMDocument.3.0", "Msxml2.DOMDocument", "Microsoft.XMLDOM", "Microsoft.XmlDom"];
			for (var i = 0; i < xmlNames.length; i++) {
				try {
					var xmlDoc = new ActiveXObject(xmlNames[i]);
					break;
				} catch(e) {
					
				}
			}
			xmlDoc.async = false;
			xmlDoc.loadXML(str);
		} else {
			try  {
				//Firefox, Mozilla, Opera, Webkit.
				var parser = new DOMParser();
				var xmlDoc = parser.parseFromString(str,"text/xml");
			} catch(x) {
				alert(x.message);
				return;
			}
		}
		return xmlDoc;
	}
	window['yc']['parseTextToXmlDomObject']=parseTextToXmlDomObject;
	
	//将  xml Dom对象 序列化转为  xml 字符串,
	function parseXmlDomObjetToText( xmlDom ){
		if (xmlDOM.xml) {
			return xmlDOM.xml;    //  xml文件内容
		} else {
			var serializer  = new XMLSerializer();
			return serializer.serializeToString(xmlDOM, "text/xml");
		}
	}
	window['yc']['parseXmlDomObjetToText']=parseXmlDomObjetToText;

	/*
	通用的获取 xmlHttpRequest对象的函数
	*/
	function getRequestObject(url,options){
			//初始化请求对象
			var req=false;
			if(window.XMLHttpRequest){
				var req=new window.XMLHttpRequest();//ie7+ ff,chrome
			}else if(window.ActiveXObject){
				var req=new window.ActiveXObject('Microsoft.XMLHTTP');//ie7以下
			}
			if(!req) return false;//如果无法创建 request对象，则返回
			//定义默认选项
			options=options||{};
			options.method=options.method||'POST';
			options.send=options.send || null;//req.open("POST",url,true);

			//定义请求的不同状态时回调的函数
			req.onreadystatechange=function(){
				switch(req.readyState){
					case 1:
						//请求初始化时
						if(options.loadListener){
							options.loadListener.apply(req,arguments); //apply/call ->this 作用域
						}
						break;
					case 2:
						//加载完成
						if(options.loadListener){
							options.loadListener.apply(req,arguments);
						}
						break;
					case 3:
						//交互
						if(options.ineractiveListener){
							options.ineractiveListener.apply(req,arguments);
						}
						break;
					case 4:
						//完成交互时的回调操作
						try{
							if(req.status && req.status==200){
								//注意：
								//Content-Type:text/html;charset=ISO-8859-4
								//这个数据存在响应头中，表示响应的数据类型，那么要用responseTest/responseXML来获取
								//获取响应头的文件类型部分
								var contentType=req.getResponseHeader('Content-Type');
								//截取出 前面的部分，这一些表示的是内容类型
								var mimeType=contentType.match(/\s*([^;]+)\s*(;|$)/i)[1];
								switch(mimeType){
									case 'text/javascript':
									case 'application/javascript':
									//表示回送的数据时一个JavaScript代码
											if(options.jsResponseListener){
												options.jsResponseListener.call(req,req.responseText);
											}
											break;
									case 'text/plain':
									case 'application/json':
									//结果是json数据，先parseJSON,转成json格式,再调用处理函数处理
											if(options.jsonResponseListener){
												try{
													var json=parseJSON(req.responseText);
												}catch(e){
													var json=false;
												}
												options.jsonResponseListener.call(req,json);
											}
											break;
									case 'text/xml':
									case 'application/xml':
									case 'application/xhtml+xml':
										//响应的结果是一个xml字符串
										if(options.xmlResponseListener){
											options.xmlResponseListener.call(req,req.responseXML);
										}
										break;
									case "text/html":
									//响应的结果是html
										if(options.htmlResponseListener){
											options.htmlResponseListener.call(req,req.responseText);
										}
										break;
								}
								//完成后的监听器
								if(options.completeListener){
									options.completeListener.apply(req,arguments);
								}
							}else {
								//响应吗不为200,
								if(options.errorListener){
									options.errorListener.apply(req,arguments);
								}
							}
						}catch(e){
							//内部处理有错误时
							alert(e);
						}
						break;
					}
				};
				//打开请求
				req.open(options.method,url,true);
				//在这里，可以加入自己的请求头信息(可以随便加)
				//req.setRequestHeader('X-yc-Ajax-Request','AjaxRequest');
				return req;
		}
		window['yc']['getRequestObject']=getRequestObject;
		/*
			ajax
			发送ajax请求XMLHttpRequest
			options对象的结构：{
								'method':'GET/POST',
								'send':发送的参数,
								'loadListener':初始化回调  readyState=1
								'loadedListener':加载完成回调  readyState=1
								'ineractiveListener':交互时回调 readyState=3
								}
								以下是readyState=4的处理
								'jsResponseListener':结果是一个javascript代码时的回调处理函数
								'jsonResponseListener':结果是json时的回调处理
								'xmlResponseListener':结果是xml时的回调处理
								'htmlResponseListener':结果是一个html时的回调处理函数
								'completeListener':处理完成后的回调

								statu==500
								'errorListener'：响应吗不为200时。
		*/
		function ajaxRequest(url,options){
			var req=getRequestObject(url,options);
			req.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
			return req.send(options.send);//send(null) |send("name=zy");
		}
		window['yc']['ajaxRequest']=ajaxRequest;
	
	
	
	///////////////////////////////////////////////////////////////////////////
	////////////////////////////   ajax封装   ////////////////////////////////
	///////////////////////////////////////////////////////////////////////////
	//对参数字符串编码   针对get请求   person.action?name=%xxx%xxx&age=20        name    张三    age=20
	function addUrlParam( url, name , value ){
		url+=(url.indexOf("?")==-1?"?":"&" );
		url+=encodeURIComponent( name )+ "="+encodeURIComponent( value );
		return url;
	}
	
	//序列化表单    name=zy&password=a
	function serialize(form){        
            var parts = new Array();
            var field = null; 
			//    form.elements  表单中所有的元素           
            for (var i=0, len=form.elements.length; i < len; i++){
                field = form.elements[i];   //取出每一个元素
                switch(field.type){
                    case "select-one":
                    case "select-multiple":
                        for (var j=0, optLen = field.options.length; j < optLen; j++){
                            var option = field.options[j];
                            if (option.selected){
                                var optValue = "";
                                if (option.hasAttribute){
                                    optValue = (option.hasAttribute("value") ? option.value : option.text);
                                } else {
                                    optValue = (option.attributes["value"].specified ? option.value : option.text);
                                }
                                parts.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(optValue));
                            }
                        }
                        break;
                        
                    case undefined:     //fieldset
                    case "file":        //file input
                    case "submit":      //submit button
                    case "reset":       //reset button
                    case "button":      //custom button
                        break;
                        
                    case "radio":       //radio button
                    case "checkbox":    //checkbox
                        if (!field.checked){
                            break;
                        }
                        /* falls through */
                                    
                    default:
                        parts.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(field.value));
                }
            }        
            return parts.join("&");
        }
		
		window['yc']['serialize']=serialize;
        
	
	
	
	
	
	
})();




//扩展全局的  Object.prototype=xxx
Object.prototype.toJSONString=function(){
	var jsonarr=[];
	for( var i in this ){  // Object -> 所有的属性..
		   if(  this.hasOwnProperty( i  ) )  {
			  jsonarr.push(   "\""+i+"\""+":\""+ this[i]+"\"" );
		   }
	}
	
	var r=jsonarr.join( ",\n" );
	r="{"+r+"}";
	return  r  ;  //返回json字符串
}

//  [1,2,3]
//  ["a","zs"]
// [ {"name":"zs","age":30}, {"name":"zs","age":30}]
Array.prototype.toJSONString=function(){
	var json=[];
	for(var i=0;i<this.length;i++)  
		json[i] = (this[i] != null) ? this[i].toJSONString() : "null";  
	return "["+json.join(", ")+"]"  
}

String.prototype.toJSONString = function(){  
	return '"' +  this.replace(/(\\|\")/g,"\\$1").replace(/\n|\r|\t/g,function(){  
	var a = arguments[0];  
	return  (a == '\n') ? '\\n':(a == '\r') ? '\\r':(a == '\t') ? '\\t': "" }) +  '"'  
} 


Boolean.prototype.toJSONString = function(){return this}  
Function.prototype.toJSONString = function(){return this}  
Number.prototype.toJSONString = function(){return this}  
RegExp.prototype.toJSONString = function(){return this}
