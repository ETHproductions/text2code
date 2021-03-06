function str (obj) {
	if (obj.constructor === String) return '"' + obj.replace(/\n/g,"\\n").replace(/"/g,"\\\"") + '"';
	if (obj.constructor === Array)  return '[' + obj.map(str).join(", ") + ']';
	return "" + obj;
}

function sp (text, split) {
	for (var i = 0, level = 0, a = [""]; i < text.length; i++) {
		var char = text[i];
		if (level === 0) {
			if (RegExp("^"+split).test(text.slice(i))) {
				a.push("");
				i += split.length - 1;
			}
			else {
				a[a.length-1] += char;
				if (char === "(")
					level++;
			}
		}
		else {
			a[a.length-1] += char;
			if (char === ")") level--;
			else if (char === "(") level++;
		}
	}
	if (level === 0)
		return a;
	else
		return [];
}

onmessage = function (e) {
	var text = e.data[0],
		debug = e.data[3],
		run = e.data[4],
		stack = [];
	function delog () { if (debug) console.log.apply(console,arguments); }
	eval(e.data[1]);
	eval(e.data[2]);
	
	/************** Prepping program for compilation **************/
	
	var values = [];
	delog("Compiling program...");
	delog("Removing numbers and strings.");
	text = denumber(text);
	text = text.replace(/(^|[ \t])("(?:\\.|[^"])+"|[+-]?\d*\.?\d+(?:e[+-]?)?\d*)/gi, function (_,y,x) { values.push(x); return y + "VALUE-" + (values.length - 1); });
	delog(text.replace(/(^|\n)/g,"$1\t"));
	delog("Removing variables.");

	var newtext = text.replace(/VALUE-\d+/gi,"#"), oldtext = text, item = /0/, reg = /0/;
	if (newtext !== oldtext) delog("Removed values:"), delog(newtext.replace(/(^|\n)/g,"$1\t"));

	for (var key in text_commands) for (item of text_commands[key]) if (item !== "%0 %1(?!\\d| times| with)") {
		oldtext = newtext;
		reg = RegExp("(.*)"+item.replace(/ /g,"[ \\t]+").replace(/%\d+/g,"(.+)").replace(/^(?!\W)/,"\\b").replace(/.$/,function(x){return /\W/.test(x)?x:x+"\\b"}),"i");
		while (reg.test(newtext)) newtext = newtext.replace(reg,/%1/.test(item)?/^%\d/.test(item)?"$1 $2 # $3 #":"$1 # $2 # $3 #":/^%0/.test(item)?"$1 $2 #":/%0/.test(item)?"$1 # $2":"$1 #");
		if (oldtext !== newtext) delog("Removed "+item+":"), delog(newtext.replace(/(^|\n)/g,"$1\t"));
	}
	
	var vars = newtext.match(/[^#\s]+(?:\s+[^#\s]+)*/g) || [];
	for (item of vars.sort(function(x,y){return y.length-x.length;})) text = text.replace(RegExp("([ \\t])("+item+")(\\b[ \\t,;.]?)","g"), function (_,a,x,b) { values.push(x.replace(/\s+/g,"_")); return a + "VALUE-" + (values.length - 1) + b; });
	delog("Variables:", vars);
	delog("Removed variables.");
	delog(text.replace(/(^|\n)/g,"$1\t"));
	delog("Values:",values);
	
	/************** Compiling each line **************/
	/* TODO: control flow and indentation */
	
	delog("Starting line compilation...");
	var instructions = [], result = text, line = "";
	text = "";
	for (item of text_commands.sep4) result = result.replace(RegExp(item,"g"),"\n");
	delog("Split into lines:",result.split("\n"));
	
	for (line of result.split("\n")) {
		if (line) delog("\n\nProcessing line:",line);
		for (var i = 0; i < 1e5 && !/^VALUE-\d+$/.test(line) && text !== line; i++) {
			text = line;
			for (key in text_commands) if (text === line) if (key !== "sep4") for (item of text_commands[key]) {
				reg = RegExp(item.replace(/ /g,"[ \\t]+").replace(/%\d+/g,"(?:VALUE-(\\d+))").replace(/^(?!\W)/,"\\b").replace(/.$/,function(x){return /\W/.test(x)?x:x+"\\b"}),"i");
				if (code_commands.hasOwnProperty(key) && reg.test(line)) {
					delog("Item matched:",key,"(\""+item+"\")");
					var match = line.match(reg).slice(1);
					if (/%1.*%0/.test(item)) match = match.reverse();
					values.push(
						typeof code_commands[key] === "string"
						? code_commands[key].replace(/%(\d+)/g,function(_,x){return match[x]?values[match[x]]:"";})
						: code_commands[key].apply(null,match.map(function(x){return values[x];}))
					);
					line = line.replace(reg,"VALUE-"+(values.length-1));
					break;
				}
			}
			if (line) delog("Current line text:",line), delog("Values:",values.slice()), delog("Stack:",stack.slice(),"\n\n");
		}
		instructions.push(line);
	}
	
	/************** Polishing and packaging **************/
	
	result = instructions.filter(function(x){return !x||!!values[x.slice(6)]}).join(code_commands.sep4);
	result = result.replace(/(?:VALUE-\d+[ \t]*)+/g,function(x){return x.match(/\d+/g).map(function(y){return values[y];}).join(code_commands.sep2.replace(/%\d/g,""));});
	result = simplify(result);
	
	delog("Done compiling program.");
	delog(result.trim().replace(/(^|\n)/g,"$1\t"));
	postMessage('document.getElementById("code").value = '+str(result)+';');
	if (run) {
		postMessage('document.getElementById("progress").innerHTML = "Running...";');
		eval(result);
	}
	postMessage('document.getElementById("progress").style="color:#1C1";document.getElementById("progress").innerHTML="Ready.";');
};