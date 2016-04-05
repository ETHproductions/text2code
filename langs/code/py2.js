function simplify (code) {
	var strings = [], i = 0;
	code = code.replace(/"(\\.|[^"])+"/g,function(x){strings[i] = x; return '"' + i++ + '"'});
	
	i = 1e4;
	while (i-- && /(^|[\s(\[])\(([^,()\s]+)\)/.test(code)) code = code.replace(/(^|[\s(\[])\(([^,()\s]+)\)/,"$1$2");
	return code.replace(/"(\d+)"/g,function(_,x){return strings[x]});
}

var code_commands = {
	print:          function (a) {
						a = a || stack.pop();
						stack.push(a);
						return "print " + a;
					},
	set:            function (a,b) {
						var z = sp(b, ", ");
						return sp(a, ", ").map(function (x,y) { stack.push(x); return x + " = " + (z[y] || z[z.length - 1]); }).join("\n");
					},
	add:            function (a,b) {
						if (!a) return stack.push((b = stack.pop() || 0, a = stack.pop() || 0) + " + " + b) && "";
						a = sp(a, ", ");
						if (!b) 
							return /^\d/.test(b = stack.pop() || 0) ?
								a.length < 2 ?
									stack.push(b + " + " + a[0])
									: stack.push(b, a.join(" + ")) && ""
								: stack.push(b) && b + " += " + a.join(" + ");
						b = sp(b, ", ");
						return b.map(function (x,y) {
							return a.length === b.length ?
								/^\d/.test(x) ?
									stack.push(x + " + " + a[y]) && ""
									: x + " += " + a[y]
								: /^\d/.test(x) ?
									stack.push(x + " + " + a.join(" + ")) && ""
									: x + " += " + a.join(" + ");
						}).join("\n");
					},
	create:         function (a) { stack.push(a); return a; },
	create2:        function (a,b) { stack.push(a); return a + " = " + b; },
	
	repeataction:   function (a,b) { return "for _ in range(0, " + b + "):\n\t" + a; },
	
	sep1:           "(%0)",
	sep2:           "%0, %1",
	sep3:           "(%0)",
	sep4:           "\n",
	
	"true":         "True",
	"false":        "False",
	it:             function(){return "("+stack.pop()+")"},
	these:          "",
	
	prop:           "%0.%1",
	array:          "[%0]",
	
	not:            "not (%0)",
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