if (window.Worker) {
	var worker = new Worker("src/worker.js");
	worker.onmessage = function (e) {
		eval(e.data);
	}
}

function ajax (url, success) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		try {
			if(xhr.readyState === XMLHttpRequest.DONE) {
				if(xhr.status !== 200) {
					document.getElementById("progress").style = "color:#E01";
					document.getElementById("progress").innerHTML = url + " could not be loaded.";
				} else {
					try {
						success(xhr.responseText);
					} catch (e) {
						document.getElementById("progress").style = "color:#E01";
						document.getElementById("progress").innerHTML = "An error occured while running success(): " + e;
					}
				}
			}
		} catch (e) {
			document.getElementById("progress").style = "color:#E01";
			document.getElementById("progress").innerHTML = "An error occured while retrieving " + url + ": " + e;
		}
	};
	xhr.open("GET", url);
	xhr.send();
}

function text2code (text, from, to, debug, run) {
	if (window.Worker) {
		function delog () { if (debug) console.log.apply(console,arguments); }
		var orig = text, stack = [];
		delog("Program:");
		delog(text.replace(/(^|\n)/g,"$1\t"));
		delog("Loading data...");
		document.getElementById("progress").style = "color:#DD0";
		document.getElementById("progress").innerHTML = "Loading data...";
		
		/************** Loading code and text lists **************/
		
		ajax("langs/text/" + from + ".js", function (response1) {
			delog("Loaded text data for " + from + ".");
			ajax("langs/code/" + to + ".js", function (response2) {
				delog("Loaded code data for " + to + ".");
				document.getElementById("progress").innerHTML = "Compiling...";
				worker.postMessage([text, response1, response2, debug, run]);
				// The rest of the algorithm is located in src/worker.js.
			});
		});
	} else {
		document.getElementById("progress").style = "color: #E01";
		document.getElementById("progress").innerHTML = "This browser does not support Web Workers.";
	}
}