//requires simplify as well
if(!cc)
	throw "No Modloader Found!";
String.prototype.capitalize = function() {
	return this.split(" ").map(function(value){
		var capFirst = value[0].toUpperCase();
		if(value.length == 1) {
			return capFirst;
		}
		return capFirst + value.substring(1);
	}).join(" ");
};
var modCache = {
	maps : ""
};
var paths = new function(){
	this.crosscode = process.cwd() + "\\";
	this.data = this.crosscode + "assets\\data\\";
	this.area = this.data + "areas\\";
	this.mod =  this.crosscode + "assets\\mods\\loadmap\\";
	this.vexScript = this.mod + "js\\vex\\";
	this.vexCss = this.mod + "css\\vex\\";
};
var fs = require('fs');
var eventListener = function () {
	document.body.removeEventListener('modsLoaded', eventListener);
	window.addEventListener('keyup', function() {
		if(event.keyCode == "T".charCodeAt(0)) {
			vex.dialog.open({
				message : 'Select Map',
				input : modCache.maps,
				callback : function (map) {
					var teleportName = map["map-options"];
					teleportName && cc.ig.gameMain.teleport(teleportName );
				}
			});
		}
	});
};
document.body.addEventListener('modsLoaded',function() {
	preload();
	eventListener();
});
function preload() {
	add(getVex(), function() {
		if(vex) {
			vex.defaultOptions.className = 'vex-theme-os';
			vex.dialog.buttons.YES.text = "Teleport";
			vex.dialog.buttons.NO.text = "Cancel";
			return true;
		}
	});
	add(getMapDependencies(), function() {
		if(genMapOptions) {
			modCache.maps = genMapOptions();
			return true;
		}
	});
};
var createElement = function(elementName,obj) {
	return Object.keys(obj).reduce(function(scripts, element) {
		scripts[element] = obj[element];
		return scripts;
	}, document.createElement(elementName));
};
var createSelect = function(id, options) {
	var selectElement = createElement("select", {
		id : id,
		name : id
	});
	return options.map(function(element, index) {
		return createElement("option", {
			value : element.value,
			textContent : element.text
		});
	}).reduce(function(mainObj, element) {
		mainObj.appendChild(element);
		return  mainObj;
	}, selectElement);
};
var get = function(arr, func) {
	return arr.map(func);
};
var generalGetFunc = function(ele) {
	return createElement(ele.type, ele.content);
};
var getVex = function() {
	var dependencies = [{
		type : "script",
		content : {
			src : paths.vexScript + "vex.combined.min.js"	
		}
	},{
		type : "link",
		content : {
			rel : "stylesheet",
			href : paths.vexCss + "vex.css"
		}
	},{
		type : "link",
		content : {
			rel : "stylesheet",
			href : paths.vexCss  + "vex-theme-os.css"
		}
	}];
	return get(dependencies, generalGetFunc);
};
var getMapDependencies = function() {
	var dependencies = [{
		type : "script",
		content : {
			src : paths.mod + "extern.js"
		}
	}];
	return get(dependencies, generalGetFunc);
};
var add = function(arr, callback) {
	arr.forEach(function(domObj) {
		document.head.appendChild(domObj);
	});
	if(typeof callback != "function") {
		callback = function() { return true;};		
	}
	var checkIfLoaded = window.setInterval(function() {
		if(callback()) {
			clearInterval(checkIfLoaded);
		}
	}, 250);
};
























