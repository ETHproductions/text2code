function simplify (code) {
	var i = 1e4;
	while (i-- && /(^|[\s(])\(([^,()\s]+)\)/.test(code)) code = code.replace(/(^|[\s(])\(([^,()\s]+)\)/,"$1$2");
	return code;
}

var code_commands = {
	print:          function(a){/*stack.push(a);*/return "print "+a;},
	set:            function(a,b){var z=b.split(", ");return a.split(", ").map(function(x,y){return x+" = "+(z[y]||z[z.length-1])}).join("\n")},
	add:            function(a,b){a=sp(a,", ");b=sp(b,", ");return b.map(function(x,y){return a.length===b.length?x+" += "+a[y]:x+" += "+a.join(" + ")}).join("\n")},
	create:         function(a){/*stack.push(a);*/return a;},
	create2:        function(a,b){/*stack.push(a);*/return a+" = "+b;},
	
	repeataction:   function(a,b){return "for _ in range(0, "+b+"):\n\t"+a},
	
	sep1:           "(%0)",
	sep2:           "%0, %1",
	sep3:           "(%0)",
	sep4:           "\n",
	
	"true":         "True",
	"false":        "False",
	
	prop:           "%0.%1",
	
	not:            "!(%0)",
	positive:       "+%0",
	negative:       "-%0",
	integer:        "int(%0)",
	number:         "float(%0)",
	string:         "str(%0)",
	double:         "%0 * 2",
	square:         "%0 ** 2",
	cube:           "%0 ** 3",
	sqrt:           "%0 ** (1./2)",
	cbrt:           "%0 ** (1./3)",
	
	plus:           "%0 + %1",
	minus:          "%0 - %1",
	times:          "%0 * %1",
	over:           "%0 / %1",
	mod:            "%0 % %1",
	power:          "%0 ** %1",
	
	equal:          "%0 == %1",
	unequal:        "%0 != %1",
	lessthan:       "%0 < %1",
	greaterthan:    "%0 > %1",
	lessequal:      "%0 <= %1",
	greaterequal:   "%0 >= %1",
	divisible:      "(%0 % %1) == 0",
	indivisible:    "(%0 % %1) != 0",
	isinteger:      "int(%0) == (%0)",
	isnumber:       "float(%0) == (%0)",
	isstring:       "str(%0) == (%0)"
};