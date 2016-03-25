import JSXElement from "oak/JSXElement";

// Load some sample parser files
export smallTest from "raw!./small.jsxe";
export bigTest from "raw!./big.jsxe";
export card from "raw!./card.jsxe";

export function timeAcornParse(code) {
	const message = "Acorn parsing: "+code.substr(0,30)+"...";
	console.time(message)
	const ast = acorn.parse(code)
	console.timeEnd(message);
	return ast;
}


export function parse(code) {
	const ast = timeAcornParse(code);
	console.dir(ast);
	const message = "JSXElement.parse()";
	console.time(message)
	const element = JSXElement.parse(code);
	console.timeEnd(message)
	return element;
}


export function roundtrip(code) {
	const element = parse(code);
	console.dir(element);
	const message = "Stringifying element";
	console.time(message)
	const string = element.toString();
	console.timeEnd(message)
	return string;
}

export function clone(code) {
	const element = parse(code);
	console.dir(element);
	const message = "Cloning element";
	console.time(message)
	const clone = element.clone();
	console.timeEnd(message)
	return clone;
}

export function getRenderMethod(code) {
	const element = parse(code);
	console.dir(element);
	const message = "element.getRenderMethod()";
	console.time(message)
	const source = element.getRenderMethod();
	console.timeEnd(message)
	return source;
}


// Export all as a map
export default Object.assign({}, exports);
