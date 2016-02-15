import oak from "./oak";
import JSXElement from "./JSXElement";

// Load some sample parser files
import smallTest from "raw!./parserTest/small.fjsx";
import bigTest from "raw!./parserTest/big.fjsx";

oak.smallTest = smallTest;
oak.bigTest = bigTest;



oak.timeParse = function(code) {
	const message = "Parsing: "+code.substr(0,30)+"...";
	console.time(message)
	const ast = acorn.parse(code)
	console.timeEnd(message);
	return ast;
}


oak.parse = function(code) {
	const ast = oak.timeParse(code);
	console.dir(ast);
	const message = "Parsing ast";
	console.time(message)
	const element = JSXElement.parse(code);
	console.timeEnd(message)
	return element;
}


oak.rountrip = function(code) {
	const element = oak.parse(code);
	console.dir(element);
	const message = "Stringifying element";
	console.time(message)
	const string = element.toString();
	console.timeEnd(message)
	return string;
}
