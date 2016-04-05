function denumber (code) {
	var strings = [], i = 0;
	code = code.replace(/"(\\.|[^"])+"/g,function(x){strings[i] = x; return '"' + i++ + '"'});
	
	function s(){var reg=/(\d+\.?\d*|\.\d+)[- ](\d+\.?\d*|\.\d+)/;while(reg.test(code))code=code.replace(reg,function(_,x,y){return /\./.test(x)?x+y:+x+ +y});}
	
	code = code.replace(/[ \t]point\b/g,".");
	
	var tens=["zero","ten","twenty","thirty","forty","fifty","sixty","seventy","eighty","ninety"];
	for(i in tens) code = code.replace(RegExp("\\b"+tens[i]+"\\b","gi"),i*10);
	
	var digits=["zero","one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen"];
	for(i in digits) code = code.replace(RegExp("\\b"+digits[i]+"\\b","gi"),i);
	s();
	
	code = code.replace(/([\de+.-]+) ?hundred\b/gi,function(_,i){return i*1e2});
	s();
	
	code = code.replace(/([\de+.-]+) ?thousand\b/gi,function(_,i){return i*1e3});
	s();
	
	var illions = ["m","b","tr","quadr","quint","sext","sept","oct","non","dec"];
	for(i in illions) code = code.replace(RegExp("([\\de+.-]+) ?"+illions[i]+"illio(n\\b|n$)","gi"),function(_,j){return +j*Math.pow(10,i*3+6)});
	s();
	
	code = code.replace(/"(\d+)"/g,function(x,y){return strings[+y]});
	return code;
}

var text_commands = {
	sep4:           ["\\.\\s*", ";\\s*", "\\s*\\n", ",? then "],
	
	"true":         ["true"],
	"false":        ["false"],
	these:          ["these", "the results"],
	it:             ["it", "this", "the result"],
	
	not:            ["not %0"],
	positive:       ["positive %0"],
	negative:       ["negative %0"],
	integer:        ["%0 as an integer"],
	number:         ["%0 as a number"],
	string:         ["%0 as a string"],
	
	plus:           ["%0 plus %1"],
	minus:          ["%0 minus %1"],
	times:          ["%0 times %1"],
	over:           ["%0 divided by %1", "%0 over %1"],
	mod:            ["%0 mod %1", "%0 modulo %1"],
	power:          ["%0 to the power of %1", "%0 to the %1 power"],
	
	double:         ["double %0", "twice %0", "%0 doubled"],
	sqrt:           ["the square root of %0"],
	square:         ["the square of %0", "square %0", "%0 squared"],
	cube:           ["the cube of %0", "cube %0", "%0 cubed"],
	
	sep1:           ["%0,"],
	
	isinteger:      ["%0 is an integer"],
	isnumber:       ["%0 is a number"],
	isstring:       ["%0 is a string"],
	divisible:      ["%0 is divisible by %1"],
	indivisible:    ["%0 is not divisible by %1"],
	lessequal:      ["%0 is not greater than %1", "%0 is not more than %1", "%0 is less than or equal to %1"],
	greaterequal:   ["%0 is not less than %1", "%0 is greater than or equal to %1", "%0 is more than or equal to %1"],
	lessthan:       ["%0 is less than %1", "%0 is not greater than or equal to %1", "%0 is not more than or equal to %1"],
	greaterthan:    ["%0 is greater than %1", "%0 is more than %1", "%0 is not less than or equal to %1"],
	equal:          ["%0 is %1", "%0 equals %1", "%0 is equal to %1", "%0 is the same as %1", "%0 is not different than %1"],
	unequal:        ["%0 is not %1", "%0 does not equal %1", "%0 doesn't equal %1", "%0 is not equal to %1", "%0 is not the same as %1", "%0 is different than %1"],
	
	sep2:           ["%0 and %1", "%0 %1(?!\\d| times)"],
	sep3:           ["\\(\\s*%0\\s*\\)"],
	
	prop:           ["%0's %1", "the %1 of %0"],
	array:          ["the array %0"],
	
	set:            ["set %0 to %1"],
	add:            ["add %0 to %1", "add %0$", "add$"],
	create2:        ["create (?:a |the )?variable (?:called )?%0 with (?:a )?value (?:of )?%1"],
	create:         ["create (?:a |the )?variable (?:called )?%0"],
	print:          ["log %0", "log$", "print %0", "print$"],

	repeataction:   ["%0 %1 times"]
};