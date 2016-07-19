/* NOTE:  none of the below works perfectly in the browser(s)!
	- unless you create the error instance as `new Error()` and munge it,
		`console.error(error)` prints nonsense
	- if you do the above, you get an actual error but:
		- it's of the wrong type
		-`console.error()` output shows `Error: foo` rather than `MyError: foo`
		- your debugger catch() will end up inside this file, rather than your file
		- your stack trace will have an extra line inside this file where error is constructed
*/




// Create an error subclass:
//		MyError = new CustomErrorClass("MyClass", { custom props }
// Call as:
//		throw new MyError(message, {some data object })
//
// Interesting custom props:
//		- `defaultMessage`	: default message to pass if no message specified
//		- `getMessage` 		: function to massage message (passed initial error message string)

const version = 1;
CustomErrorClass = function CustomErrorClass(className, props) {
	if (version === 1) {
		var CustomError = function(message, param1, param2) {
			var err = new Error(message);
			Object.setPrototypeOf(err, CustomError.prototype);

			//set properties specific to the custom error
			err.param1 = param1;
			err.param2 = param2;

			return err;
		};
		CustomError.name = "CustomError";
		CustomError.prototype = Object.create(Error.prototype, {
			name: { value: 'CustomError', enumerable: false }
		});
		return CustomError;

	}
	else if (version === 2) {
		function MyError(message, data) {
			this.name = "MyError";
			this.message = (message || "Default message");
			this.data = data;
			this.stack = (new Error()).stack;
		}
		MyError.prototype = Object.create(Error.prototype);
		MyError.prototype.constructor = MyError;
		MyError.prototype = className;
		return MyError;
	}
	else if (version === 3) {

		var constructor = function CustomError(message, data) {
			message = (this.getMessage ? this.getMessage(message) : message) || this.defaultMessage;

			var error = new TypeError(message);
			error.data = data;
			error.name = className;
			error.constructor = CustomError;
			error.toString = function(){return className+": "+message};

			// get a stack trace, removing the first item (which is this call)
			if (!Error.captureStackTrace) {
				var stack = error.stack.split("\n");
				// remove the first line in the stack (reference `Error()` above)
				stack.splice(0, 1);
				error.stack = stack.join("\n");
			}

			error.toString = function() {
				return className + ": " + message;
			}

			return error;
		}
		return constructor;
	}
	else {
		// THIS FORM doesn't work in firebug `console.error(error)`:  prints `[object Object]`
		//	to get console.error() to work, you have to return an actual Error instance
		var constructor = function CustomError(message, data) {
			this.message = (this.getMessage ? this.getMessage(message) : message) || this.defaultMessage;
			this.data = data;

			// get a stack trace, removing the first item (which is this call)
			if (Error.captureStackTrace) {
				// nodejs way
				Error.captureStackTrace(this, this.constructor);
			} else {
				// browser way
				var stack = Error(message).stack.split("\n");
				// remove the first line in the stack (reference `Error()` above)
				stack.splice(0, 1);
				this.stack = stack.join("\n");
			}
		}

		var prototype = Object.create(Error.prototype);

		Object.defineProperties(constructor, {
			prototype 	: { value : prototype }
		});

		// echo normal error instance stuff
		Object.defineProperties(prototype, {
			name 		: { value : className },
			constructor	: { value : constructor },
			toString	: { value : function() { return className + ": " + this.message } }
		});

		// assign props to prototype non-enumerably
		if (props) {
			for (var key in props) {
				Object.defineProperty(prototype, key, { value : props[key] } );
			}
		}

		return constructor;
	}
}

EntityError = CustomErrorClass("EntityError", { defaultMessage: "Error in entity land" });
