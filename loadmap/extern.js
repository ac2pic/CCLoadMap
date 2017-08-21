var getFiles = function(path) {
	return fs.readdirSync(path).filter(function(filename) {
		return fs.statSync(path + "/" + filename).isFile();
	});
};
var genMapOptions = function(){ 
	var a = areasToJSON()
		.reduce(function(worldOptions, map, index, arr) {
			worldOptions.push({
				text :"-----"  + map.name + "-----",
				value : ""
			});
			map.maps.forEach(function(element) {
				worldOptions = worldOptions.concat(element);
			});
			return worldOptions;
		}, []);
	var mapSelect= createSelect("map-options", a); 
	var div = document.createElement("div");
	div.appendChild(mapSelect);
	return div.innerHTML;
};
var areasToJSON = function(){
	return getFiles(paths.area).map(function(value) {
		//it is much quicker to traverse a single file instead of all directories
		var json = JSON.parse(fs.readFileSync(paths.area + "/" + value, "utf8"));
		var title = value.replace(/-/g," ").replace(".json", "").capitalize();
		//need lang id for variations
		if(json.name.en_US != "untitled") {
			title = json.name.en_US;
		}
		var maps = json.floors.map(function(floor) {
			return floorstoMapArray(floor);
		});
		return {
			name : title,
			maps : maps
		};
	});
};
var floorstoMapArray = function(floor) {
	return floor.maps.map(function(value) {
		if(value.name) {
			//need lang id for variations
			return {
				text : value.name && value.name.en_US,
				value : value.path
			}
		}
		return null;
	}).filter(function(value) {
		return value != null;
	});
};