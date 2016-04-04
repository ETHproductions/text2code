function simplify (code) {
	var i = 1e4;
	while (i-- && /(^|[\s(])\(([^,()\s]+)\)/.test(code)) code = code.replace(/(^|[\s(])\(([^,()\s]+)\)/,"$1$2");
	return code;
}

var code_commands = {
	print:          function(a){/*stack.push(a);*/return "console.log("+a+")";},
	set:            function(a,b){var z=b.split(", ");return a.split(", ").map(function(x,y){return x+" = "+(z[y]||z[z.length-1])}).join(";\n")},
	add:            function(a,b){a=sp(a,", ");b=sp(b,", ");return b.map(function(x,y){return a.length===b.length?x+" += "+a[y]:x+" += "+a.join(" + ")}).join(";\n")},
	create:         function(a){/*stack.push(a);*/return "var "+a;},
	create2:        function(a,b){/*stack.push(a);*/return "var "+a+" = "+b;},
	
	repeataction:   function(a,b){return "for(var $loop = 0; $loop < "+b+"; $loop++) "+a},
	
	sep1:           "(%0)",
	sep2:           "%0, %1",
	sep3:           "(%0)",
	sep4:           ";\n",
	
	prop:           "%0.%1",
	
	not:            "!(%0)",
	positive:       "+%0",
	negative:       "-%0",
	double:         "%0 * 2",
	square:         "Math.pow(%0, 2)",
	cube:           "Math.pow(%0, 3)",
	sqrt:           "Math.sqrt(%0)",
	cbrt:           "Math.pow(%0, 1/3)",
	
	plus:           "%0 + %1",
	minus:          "%0 - %1",
	times:          "%0 * %1",
	over:           "%0 / %1",
	mod:            "%0 % %1",
	power:          "Math.pow(%0, %1)",
	
	equal:          "%0 === %1",
	unequal:        "%0 !== %1",
	lessthan:       "%0 < %1",
	greaterthan:    "%0 > %1",
	lessequal:      "%0 <= %1",
	greaterequal:   "%0 >= %1",
	divisible:      "(%0 % %1) === 0",
	indivisible:    "(%0 % %1) !== 0"
};