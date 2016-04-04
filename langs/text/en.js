function denumber (code) {
	/* TODO: replace text numbers (i.e. "one", "twenty-three", "one million one hundred two") with real numbers */
	return code;
}

var text_commands = {	
	not:            ["not %0"],
	positive:       ["positive %0"],
	negative:       ["negative %0"],
	
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
	
	equal:          ["%0 equals %1", "%0 is equal to %1", "%0 is the same as %1", "%0 is not different than %1"],
	unequal:        ["%0 does not equal %1", "%0 doesn't equal %1", "%0 is not equal to %1", "%0 is not the same as %1", "%0 is different than %1"],
	lessequal:      ["%0 is not greater than %1", "%0 is not more than %1", "%0 is less than or equal to %1"],
	greaterequal:   ["%0 is not less than %1", "%0 is greater than or equal to %1", "%0 is more than or equal to %1"],
	lessthan:       ["%0 is less than %1", "%0 is not greater than or equal to %1", "%0 is not more than or equal to %1"],
	greaterthan:    ["%0 is greater than %1", "%0 is more than %1", "%0 is not less than or equal to %1"],
	divisible:      ["%0 is divisible by %1"],
	indivisible:    ["%0 is not divisible by %1"],
	
	sep2:           ["%0 and %1", "%0 %1(?!\\d| times)"],
	sep3:           ["\\(\\s*%0\\s*\\)"],
	
	prop:           ["%0's %1", "the %1 of %0"],
	
	set:            ["set %0 to %1"],
	add:            ["add %0 to %1"],
	create2:        ["create (?:a |the )?variable (?:called )?%0 with (?:a )?value (?:of )?%1"],
	create:         ["create (?:a |the )?variable (?:called )?%0"],
	print:          ["log %0", "print %0"],

	repeataction:   ["%0 %1 times"],
	
	sep4:           ["\\.\\s*", ";\\s*", "\\s*\\n"]
};