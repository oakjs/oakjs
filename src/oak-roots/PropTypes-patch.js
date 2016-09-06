//////////////////////////////
//  Monkey-patch React.PropTypes so we can reflect on them.
//////////////////////////////

const PT = React.PropTypes;

//
// Monkey-patch React.PropTypes functions to have a reflective `schema` property.
//

// Return the logical type of a value.
function typeOf(value) {
  if (value === null) return null;

  switch (typeof value) {
    case "boolean":   return "boolean";
    case "function":   return "function";
    case "number":     return "number";
    case "string":     return "string";
    case "undefined":  return undefined;

    default:
      if (Array.isArray(value)) return "array";
      // TODO: "object" for Object only, otherwise return the constructor of the object?
      return "object";
  }
}


// Handle simple types first (everything with a "isRequired") property.
Object.keys(PT).forEach( function(key) {
  const checker = PT[key];

  switch (key) {
    // Array of items of a certain type.
    // JSON Schema:  `{ type: "array", items: { type: "string" } }`
    case "arrayOf":
      PT[key] = function(typeChecker){
        const result = checker(typeChecker);
        result.schema = {
          type: "array",
          items: typeChecker.schema
        }

        // set up `isRequired` on the returned propType
        if (result.isRequired) result.isRequired.schema = Object.assign({}, result.schema, { isRequired: true });
        return result;
      }
      break;

    // Instance of some class.
    // JSON Schema:    `{ type: <expectedClass> }`
    //
    // NON-STANDARD: We extend JSON schema to support javascript classes as `type`s.
    case "instanceOf":
      PT[key] = function(expectedClass) {
        const result = checker(expectedClass);
        result.schema = { type: expectedClass };

        // set up `isRequired` on the returned propType
        if (result.isRequired) result.isRequired.schema = Object.assign({}, result.schema, { isRequired: true });
        return result;
      }
      break;

    // Object where ALL properties are of a certain type.
    // JSON Schema:    `{ type: "object", additionalProperties: { type: "string" } }`
    case "objectOf":
      PT[key] = function(typeChecker) {
        const result = checker(typeChecker);
        result.schema = { type: "object", additionalProperties: typeChecker.schema };

        // set up `isRequired` on the returned propType
        if (result.isRequired) result.isRequired.schema = Object.assign({}, result.schema, { isRequired: true });
        return result;
      }
      break;

    // Enumeration of different values.
    // JSON Schema:    `{ "enum": <expectedValues> } }`
    //          or:    `{ type: "string", "enum": <expectedValues> }`
    case "oneOf":
      PT[key] = function(expectedValues) {
        const result = checker(expectedValues);
        result.schema = { "enum": expectedValues };

        // attempt to divine the type of the expectedValues
        const VARIES = {};
        const type = expectedValues.map( function (value) { return typeOf(value) } )
                      .reduce( function (prev, current) { return prev === current ? prev : VARIES },
                                typeOf(expectedValues[0]) );
        if (type !== VARIES) result.schema.type = type;

        // set up `isRequired` on the returned propType
        if (result.isRequired) result.isRequired.schema = Object.assign({}, result.schema, { isRequired: true });
        return result;
      }
      break;

    // Enumeration of different types.
    // JSON schema:    `{ anyOf: [ <nested type checkers > ] }`
    case "oneOfType":
      PT[key] = function(arrayOfTypeCheckers) {
        const result = checker(arrayOfTypeCheckers);
        // get list of schemas from the `arrayOfTypeCheckers`, omitting any we can't figure out.
        // TODO: omitting ones we can't figure out is losing information... ???
        const typeSchemas = arrayOfTypeCheckers.map( function (typeChecker) { return typeChecker.schema } )
                            .filter(Boolean);
        result.schema = { anyOf: typeSchemas };

        // set up `isRequired` on the returned propType
        if (result.isRequired) result.isRequired.schema = Object.assign({}, result.schema, { isRequired: true });
        return result;
      }
      break;

    // Object of a certain shape.
    // JSON schema:    `{ type: "object", properties: {...} }`
    //          or:    `{ type: "object", properties: {...}, required: [....] }`
    case "shape":
      PT[key] = function(shapeTypes) {
        const result = checker(shapeTypes);

        // figure out schema for properties + required property keys
        const shapeSchema = {};
        const shapeRequired = [];
        Object.keys(shapeTypes).forEach( function(key) {
          const schema = shapeTypes[key].schema;
          if (schema) {
            shapeSchema[key] = schema;
            if (schema.isRequired) shapeRequired.push(key);
          }
        });

        result.schema = { type: "object", properties: shapeSchema };
        if (shapeRequired.length) result.schema.required = shapeRequired;

        // set up `isRequired` on the returned propType
        if (result.isRequired) result.isRequired.schema = Object.assign({}, result.schema, { isRequired: true });
        return result;
      }
      break;

    // Simple type checker, including `isRequired` for that type.
    default:
      // If a simple type checker
      if (checker.isRequired) {
        // handle mismatched naming in PropTypes => JSON Schema
        switch (key) {
          case "any":
            checker.schema = {};
            break;

          case "bool":
            checker.schema = { type: "boolean" };
            break;

          case "func":
            // TODO:  `{ type: Function }` ???
            checker.schema = { type: "function" };
            break;

          default:
            checker.schema = { type: key };
        }

        // monkey-patch "isRequired" to add the schema
        checker.isRequired.schema = Object.assign({}, checker.schema, { isRequired: true });
      }
      else {
        console.warn(`PropTypes-patch: PropTypes.${key} hasn't been patched.`);
      }
      break;
  }
});


// `propTypesToSchema()` returns a JSON schema-ish schema object for:
//  - `propTypes`:       a set of `React.PropTypes`.
//  - `defaultProps`:   default values for those types
function propTypesToSchema(propTypes, defaultProps) {
  const schema = {
    $schema: "http://json-schema.org/schema#",
    type: "object",
    properties: {}
  };

  // Build the schema `properties` & `required`entries
  if (propTypes) {
    const required = [];
    Object.keys(propTypes).forEach( function(key) {
      schema.properties[key] = Object.assign({ title: key }, propTypes[key].schema);
      if (schema.properties[key].isRequired) required.push(key);
    });
    if (required.length) schema.required = required;
  }

  // Add `defaultProps` as property `default`s if passed in.
  if (defaultProps) {
    Object.keys(defaultProps).forEach( function(key) {
      if (!schema.properties[key]) schema.properties[key] = {};
      schema.properties[key]["default"] = defaultProps[key];
    });
  }

  return schema;
}

function schemaForComponent(Component) {
  if (!Component) return undefined;
  return propTypesToSchema(Component.propTypes, Component.defaultProps);
}
