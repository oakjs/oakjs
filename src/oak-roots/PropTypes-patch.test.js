
// DEBUG
window.PT = React.PropTypes;
window.propTypesToSchema = propTypesToSchema;
window.schemaForComponent = schemaForComponent;


// Output propTypes
// console.group("PropTypes");
// console.dir(PT);
// console.groupEnd();


// Sample schema
console.group("sample proptypes");
const propTypes = {
  string: PT.string,
  requiredString: PT.string.isRequired,

  number: PT.number,
  requiredNumber: PT.number.isRequired,

  array: PT.string,
  requiredArray: PT.array.isRequired,

  arrayOfString: PT.arrayOf(PT.string),
  requiredArrayOfString: PT.arrayOf(PT.string).isRequired,

  instanceOf: PT.instanceOf(React.Component),
  requiredInstanceOf: PT.instanceOf(React.Component).isRequired,

  objectOfString: PT.objectOf(PT.string),
  requiredObjectOfString: PT.objectOf(PT.string).isRequired,

  oneOf: PT.oneOf(["a","b","c"]),
  requiredOneOf: PT.oneOf(["a","b","c", null]).isRequired,

  oneOfType: PT.oneOf([PT.string, PT.number]),
  requiredOneOfType: PT.oneOf([PT.string, PT.number]).isRequired,

  oneOfType: PT.oneOfType([PT.string, PT.number]),
  requiredOneOfType: PT.oneOfType([PT.string, PT.number]).isRequired,

	shape: PT.shape({ color: PT.string, size: PT.number.isRequired }),
	requiredShape: PT.shape({ color: PT.string, size: PT.number.isRequired }).isRequired,

}
console.dir(propTypesToSchema(propTypes));
console.groupEnd();
