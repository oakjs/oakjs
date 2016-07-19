"use strict";
//////////////////////////////
//
//  DataTranslator
//
//  Translate data from one format to another
//    - source key => dest key
//    - source key => function() => dest key
//
//////////////////////////////


function makeConstructingFunction(Constructor) {
  return function(inputValue) { return new Constructor(inputValue) }
}

// Built-in types that we don't consider "classes" for the purposes of `isAConstructor`.
const BUILT_IN_TYPES = [ Number, String, Boolean ];
function isAConstructor(potentialClass) {
  return typeof potentialClass === "function"
        && (potentialClass.prototype !== Object.prototype)
        && !BUILT_IN_TYPES.includes(potentialClass)
}

class Translator {
  constructor({fields = {}, includeUnknown = true, includeUndefined = false, type}) {
    this.fields = this.initializeFields(fields);
    this.includeUnknown = includeUnknown;
    this.includeUndefined = includeUndefined;
    this.type = type;
  }

  // Initialize fields to make translation quick as a bunny!
  initializeFields(fields) {
    const normalized = {};

    for (let inputKey in fields) {
      const fieldValue = fields[inputKey];

      let mapper;
      if (fieldValue === undefined || fieldValue === null) {
        mapper = { suppress: true };
      }
      else if (typeof fieldValue === "string") {
        mapper = { key: fieldValue };
      }
      else if (typeof fieldValue === "function") {
        // if we got a class, assume they want to make an instance of it
        if (isAConstructor(fieldValue) {
          mapper = {
            key: inputKey,
            translate: makeConstructingFunction(fieldValue)
          }
        }
        else {
          mapper = {
            key: fieldValue,
            translate: fieldValue
          }
        }
      }
      // assume it's a valid `mapper` as defined above
      else if (typeof fieldValue === "object") {
        mapper = fieldValue;
        // if there is a `translate` function, see if it's a class
        if (mapper.translate && isAConstructor(mapper.translate)) {
          mapper.translate = makeConstructingFunction(mapper.translate);
        }
        if (!mapper.key) mapper.key = inputKey;
      }
      else {
        console.warn(this, ".initializeFields(): don't know what to do with "+inputKey+": ", fieldValue);
        throw new TypeError("Invalid field type");
      }

      normalized[inputKey] = mapper;
    }
    return normalized;
  }

  //////////////////////////////
  //  Translate
  //////////////////////////////

  // Translate an `input` object or array.
  translate(input, ...translateArgs) {
    if (Array.isArray(input)) return this.translateArray(input, ...translateArgs);
    return this.translateObject(input, ...translateArgs);
  }

  // Translate an `input` object into an `output` object.
  translateObject(input, ...translateArgs) {
    const { fields, includeUnknown, includeUndefined, type } = this;

    const output = {};
    if (!input) return output;

    for (var inputKey in input) {
      const inputValue = input[inputKey];

      // skip undefined values
      if (inputValue === undefined && !includeUndefined) continue;

      const mapper = fields[inputKey];
      if (mapper) {
        const { key:outputKey, translate } = mapper;
        if (translate) {
          const translated translate.apply(input, [inputValue, output, inputKey, input, ...translateArgs]);
          if (translated !== undefined && !includeUndefined) continue;
          output[outputKey] = translated;
        }
        else if (outputKey) {
          output[outputKey] = inputValue;
        }
      }
      else if (includeUnknown) {
        output[inputKey] = inputValue;
      }
    }

    // If we got an type constructor, create a new one with the bag of properties we translated.
    if (type) {
      return new type(output);
    }

    return output;
  }

  // Translate an array of items.
  translateList(items, ...translateArgs) {
    if (Array.isArray(items)) {
      return items.map( item => this.translateObject(item, ...translateArgs) );
    }
    // don't know how to process things that aren't arrays
    if (items) {
      console.warn("translator.translateList(",items,"): items must be an array");
    }
    return [];
  }

}
