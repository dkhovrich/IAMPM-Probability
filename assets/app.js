var app =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			memo[selector] = fn.call(this, selector);
		}

		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(5);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 2 */
/***/ (function(module, exports) {

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0,
    MAX_SAFE_INTEGER = 9007199254740991,
    MAX_INTEGER = 1.7976931348623157e+308,
    NAN = 0 / 0;

/** `Object#toString` result references. */
var funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    symbolTag = '[object Symbol]';

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/** Built-in method references without a dependency on `root`. */
var freeParseFloat = parseFloat,
    freeParseInt = parseInt;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeFloor = Math.floor,
    nativeMin = Math.min,
    nativeRandom = Math.random;

/**
 * The base implementation of `_.random` without support for returning
 * floating-point numbers.
 *
 * @private
 * @param {number} lower The lower bound.
 * @param {number} upper The upper bound.
 * @returns {number} Returns the random number.
 */
function baseRandom(lower, upper) {
  return lower + nativeFloor(nativeRandom() * (upper - lower + 1));
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

/**
 * Checks if the given arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
 *  else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
        ? (isArrayLike(object) && isIndex(index, object.length))
        : (type == 'string' && index in object)
      ) {
    return eq(object[index], value);
  }
  return false;
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a finite number.
 *
 * @static
 * @memberOf _
 * @since 4.12.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted number.
 * @example
 *
 * _.toFinite(3.2);
 * // => 3.2
 *
 * _.toFinite(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toFinite(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toFinite('3.2');
 * // => 3.2
 */
function toFinite(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber(value);
  if (value === INFINITY || value === -INFINITY) {
    var sign = (value < 0 ? -1 : 1);
    return sign * MAX_INTEGER;
  }
  return value === value ? value : 0;
}

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

/**
 * Produces a random number between the inclusive `lower` and `upper` bounds.
 * If only one argument is provided a number between `0` and the given number
 * is returned. If `floating` is `true`, or either `lower` or `upper` are
 * floats, a floating-point number is returned instead of an integer.
 *
 * **Note:** JavaScript follows the IEEE-754 standard for resolving
 * floating-point values which can produce unexpected results.
 *
 * @static
 * @memberOf _
 * @since 0.7.0
 * @category Number
 * @param {number} [lower=0] The lower bound.
 * @param {number} [upper=1] The upper bound.
 * @param {boolean} [floating] Specify returning a floating-point number.
 * @returns {number} Returns the random number.
 * @example
 *
 * _.random(0, 5);
 * // => an integer between 0 and 5
 *
 * _.random(5);
 * // => also an integer between 0 and 5
 *
 * _.random(5, true);
 * // => a floating-point number between 0 and 5
 *
 * _.random(1.2, 5.2);
 * // => a floating-point number between 1.2 and 5.2
 */
function random(lower, upper, floating) {
  if (floating && typeof floating != 'boolean' && isIterateeCall(lower, upper, floating)) {
    upper = floating = undefined;
  }
  if (floating === undefined) {
    if (typeof upper == 'boolean') {
      floating = upper;
      upper = undefined;
    }
    else if (typeof lower == 'boolean') {
      floating = lower;
      lower = undefined;
    }
  }
  if (lower === undefined && upper === undefined) {
    lower = 0;
    upper = 1;
  }
  else {
    lower = toFinite(lower);
    if (upper === undefined) {
      upper = lower;
      lower = 0;
    } else {
      upper = toFinite(upper);
    }
  }
  if (lower > upper) {
    var temp = lower;
    lower = upper;
    upper = temp;
  }
  if (floating || lower % 1 || upper % 1) {
    var rand = nativeRandom();
    return nativeMin(lower + (rand * (upper - lower + freeParseFloat('1e-' + ((rand + '').length - 1)))), upper);
  }
  return baseRandom(lower, upper);
}

module.exports = random;


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["setMode"] = setMode;
/* harmony export (immutable) */ __webpack_exports__["execute"] = execute;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_normalize_css__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_normalize_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_normalize_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__scss_style_scss__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__scss_style_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__scss_style_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__scss_dice_scss__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__scss_dice_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__scss_dice_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__scss_random_scss__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__scss_random_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__scss_random_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__scss_cube_scss__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__scss_cube_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__scss_cube_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__scss_market_scss__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__scss_market_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5__scss_market_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__js_mode__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__js_uiHelper__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__js_probability__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__js_market__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_lodash_random__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_lodash_random___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10_lodash_random__);














const THROW_CUBE_BUTTON_TEXT = 'Бросить кубики ;)';
const MARKET_BUTTON_TEXT = 'Тянуть карту';
const CUBE_DELAY = 3000;
let selectedMode = 0;

window.onload = function () {
  Object(__WEBPACK_IMPORTED_MODULE_7__js_uiHelper__["i" /* setValue */])(__WEBPACK_IMPORTED_MODULE_7__js_uiHelper__["c" /* EXECUTE_BUTTON_ID */], THROW_CUBE_BUTTON_TEXT);
  selectedMode = __WEBPACK_IMPORTED_MODULE_6__js_mode__["a" /* default */].cubes;
}

function setMode(mode) {
  selectedMode = mode;
  Object(__WEBPACK_IMPORTED_MODULE_7__js_uiHelper__["g" /* hideAll */])();

  switch (mode) {
    case __WEBPACK_IMPORTED_MODULE_6__js_mode__["a" /* default */].cubes: {
      Object(__WEBPACK_IMPORTED_MODULE_7__js_uiHelper__["i" /* setValue */])(__WEBPACK_IMPORTED_MODULE_7__js_uiHelper__["c" /* EXECUTE_BUTTON_ID */], THROW_CUBE_BUTTON_TEXT);
      Object(__WEBPACK_IMPORTED_MODULE_7__js_uiHelper__["h" /* setDisplay */])(__WEBPACK_IMPORTED_MODULE_7__js_uiHelper__["a" /* CUBES_CONTAINER */], 'flex');
      break;
    }
    case __WEBPACK_IMPORTED_MODULE_6__js_mode__["a" /* default */].probability: {
      Object(__WEBPACK_IMPORTED_MODULE_7__js_uiHelper__["i" /* setValue */])(__WEBPACK_IMPORTED_MODULE_7__js_uiHelper__["c" /* EXECUTE_BUTTON_ID */], THROW_CUBE_BUTTON_TEXT);
      Object(__WEBPACK_IMPORTED_MODULE_7__js_uiHelper__["h" /* setDisplay */])(__WEBPACK_IMPORTED_MODULE_7__js_uiHelper__["e" /* PROBABILITY_CONTAINER */], 'block');
      break;
    }
    case __WEBPACK_IMPORTED_MODULE_6__js_mode__["a" /* default */].market: {
      Object(__WEBPACK_IMPORTED_MODULE_7__js_uiHelper__["i" /* setValue */])(__WEBPACK_IMPORTED_MODULE_7__js_uiHelper__["c" /* EXECUTE_BUTTON_ID */], MARKET_BUTTON_TEXT);
      Object(__WEBPACK_IMPORTED_MODULE_7__js_uiHelper__["h" /* setDisplay */])(__WEBPACK_IMPORTED_MODULE_7__js_uiHelper__["d" /* MARKET_CONTAINER */], 'flex');
      break;
    }
    default: break;
  }
}

function execute() {
  switch (selectedMode) {
    case __WEBPACK_IMPORTED_MODULE_6__js_mode__["a" /* default */].cubes: {
      executeCubes();
      break;
    }
    case __WEBPACK_IMPORTED_MODULE_6__js_mode__["a" /* default */].probability: {
      executeProbability();
      break;
    }
    case __WEBPACK_IMPORTED_MODULE_6__js_mode__["a" /* default */].market: {
      executeMarket();
      break;
    }
    default: break;
  }
}

function executeCubes() {
  const result = __WEBPACK_IMPORTED_MODULE_10_lodash_random__(1, 16);

  Object(__WEBPACK_IMPORTED_MODULE_7__js_uiHelper__["i" /* setValue */])(__WEBPACK_IMPORTED_MODULE_7__js_uiHelper__["b" /* CUBE_RESULT_CONTAINER */], result);
  Object(__WEBPACK_IMPORTED_MODULE_7__js_uiHelper__["h" /* setDisplay */])(__WEBPACK_IMPORTED_MODULE_7__js_uiHelper__["b" /* CUBE_RESULT_CONTAINER */], 'flex');
}

function executeProbability() {
  const resultContainerId = 'random-result';
  const diceContainerId = 'random-dice';

  const probability = new __WEBPACK_IMPORTED_MODULE_8__js_probability__["a" /* Probability */]();
  const teamLevel = +Object(__WEBPACK_IMPORTED_MODULE_7__js_uiHelper__["f" /* getValue */])('team-level');
  const benefit = +Object(__WEBPACK_IMPORTED_MODULE_7__js_uiHelper__["f" /* getValue */])('random-benefit');

  const result = probability.getChance(teamLevel);

  if (!result) return;

  if (benefit) {
    const benefitValue = probability.calculateBenefitValue(benefit, result.fail);
    Object(__WEBPACK_IMPORTED_MODULE_7__js_uiHelper__["i" /* setValue */])('random-benefit-value', `${benefitValue} е.т.`);
  }

  Object(__WEBPACK_IMPORTED_MODULE_7__js_uiHelper__["i" /* setValue */])('random-fail', `${result.fail}% ошибок`);

  Object(__WEBPACK_IMPORTED_MODULE_7__js_uiHelper__["h" /* setDisplay */])(resultContainerId, 'none');
  Object(__WEBPACK_IMPORTED_MODULE_7__js_uiHelper__["h" /* setDisplay */])(diceContainerId, 'block');

  setTimeout(() => {
    Object(__WEBPACK_IMPORTED_MODULE_7__js_uiHelper__["h" /* setDisplay */])(diceContainerId, 'none');
    Object(__WEBPACK_IMPORTED_MODULE_7__js_uiHelper__["h" /* setDisplay */])(resultContainerId, 'flex');
  }, CUBE_DELAY);
}

function executeMarket() {
  const salesInputId = 'market-sales';
  const cardsInputId = 'market-cards';
  const salesResultId = 'market-sales-result';
  const cardsResultId = 'market-cards-result';  

  const market = new __WEBPACK_IMPORTED_MODULE_9__js_market__["a" /* Market */]();
  const salesValue = +Object(__WEBPACK_IMPORTED_MODULE_7__js_uiHelper__["f" /* getValue */])(salesInputId);
  const cardsValue = +Object(__WEBPACK_IMPORTED_MODULE_7__js_uiHelper__["f" /* getValue */])(cardsInputId);

  if (salesValue) {
    const salesResult = market.getSalesResult(salesValue);
    Object(__WEBPACK_IMPORTED_MODULE_7__js_uiHelper__["i" /* setValue */])(salesResultId, `${salesResult} продажи`);
    Object(__WEBPACK_IMPORTED_MODULE_7__js_uiHelper__["h" /* setDisplay */])(salesResultId, 'flex');
  }
  
  if (cardsValue) {
    const сardsResult = market.getCarsResult(cardsValue);
    Object(__WEBPACK_IMPORTED_MODULE_7__js_uiHelper__["i" /* setValue */])(cardsResultId, `${сardsResult} карты`);
    Object(__WEBPACK_IMPORTED_MODULE_7__js_uiHelper__["h" /* setDisplay */])(cardsResultId, 'flex');
  }
}

/***/ }),
/* 4 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 5 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(7);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js??ref--1-1!../../node_modules/sass-loader/lib/loader.js??ref--1-2!./style.scss", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js??ref--1-1!../../node_modules/sass-loader/lib/loader.js??ref--1-2!./style.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "body {\n  font-family: Arial, Helvetica, sans-serif;\n  font-size: 14px;\n  background-color: #2c3e50; }\n\n.logo {\n  position: relative;\n  display: block;\n  width: 120px;\n  height: 120px;\n  margin: 0 auto;\n  border-radius: 50%;\n  background-color: #fff; }\n  .logo::before {\n    position: absolute;\n    top: 50%;\n    left: 50%;\n    display: block;\n    width: 80px;\n    height: 80px;\n    content: '';\n    background-image: url(\"data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='94.7px' height='90.1px' viewBox='0 0 94.7 90.1'%3E %3Cstyle type='text/css'%3E .st0%7Bfill-rule:evenodd;clip-rule:evenodd;fill:%230080B6;%7D .st1%7Bfill-rule:evenodd;clip-rule:evenodd;fill:%23009EE2;%7D .st2%7Bfill-rule:evenodd;clip-rule:evenodd;fill:%2383CEEB;%7D %3C/style%3E %3Cdefs%3E %3C/defs%3E %3Cg%3E %3Cpath class='st0' d='M68.3,78.3l8.4,11.7l-28.8,0L32.2,78.4L68.3,78.3z M18.2,90.1l24.4,0l-16-11.6L18.2,90.1z M57.1,62.7 L57.1,62.7L48,57.9c-0.2-0.1-0.3-0.1-0.5-0.1c-0.2,0-0.3,0-0.5,0.1l-9.2,4.8l0-0.1l-8.7,12.3l0,0l36.9,0l0,0L57.1,62.7z'/%3E %3Cpath class='st1' d='M94.7,34.4l-8.9,27.4L70.3,72.9l10.8-34.2L94.7,34.4L94.7,34.4z M7.6,57.6l6-18.9L0,34.5L7.6,57.6z M68.3,78.3 l8.4,11.7l7.5-23.2L68.3,78.3z M26.6,78.5C26.6,78.5,26.6,78.5,26.6,78.5L15.2,44.6l-6,18.2l8.9,27.3L26.6,78.5z M39.6,52.5 c0.1-0.3-0.1-0.7-0.3-0.9l-7.4-7.2l0,0l-14.3-4.4l0,0l5.8,17.5l5.8,17.6l8.7-12.3L39.6,52.5z M77.3,39.9L63,44.3l0.2,0l-7.4,7.2 c-0.2,0.2-0.4,0.6-0.3,0.9l1.7,10.2L66,74.9l5.7-17.6L77.3,39.9L77.3,39.9z'/%3E %3Cpath class='st2' d='M94.7,34.4L94.7,34.4l-13.6,4.3L75,20.2L94.7,34.4z M47.4,14.3L47.4,14.3L76.4,35l-5.8-18.2L47.3,0L27.6,14.3 L47.4,14.3C47.3,14.3,47.3,14.3,47.4,14.3z M23.2,17.5L0,34.5l13.6,4.3l28.8-21.2L23.2,17.5z M47.4,18.1L47.4,18.1L32.5,28.9 l-15,11l14.3,4.4l10.2-1.5c0.3,0,0.6-0.3,0.8-0.6l4.5-9.2l0-0.1l4.6,9.3c0.2,0.3,0.4,0.5,0.8,0.6L63,44.3l14.4-4.4l-15-11 L47.4,18.1z'/%3E %3C/g%3E %3C/svg%3E\");\n    background-repeat: no-repeat;\n    background-size: 100%;\n    transform: translate(-50%, -50%); }\n\n.container {\n  width: 100%;\n  max-width: 320px;\n  margin: 30px auto; }\n  .container .img {\n    display: block;\n    width: 85px;\n    margin: 0 auto; }\n  .container .controll-buttons {\n    display: flex;\n    flex-direction: column;\n    margin-left: 1rem; }\n    .container .controll-buttons .controll-button {\n      display: flex;\n      align-items: center; }\n      .container .controll-buttons .controll-button span {\n        margin-left: 0.5rem;\n        color: white; }\n\n.actions button {\n  display: block;\n  width: 220px;\n  height: 50px;\n  padding: 0;\n  margin: 0 auto;\n  color: #fff;\n  font-size: 18px;\n  font-weight: bold;\n  line-height: 50px;\n  text-align: center;\n  border: 2px solid #fff;\n  border-radius: 4px;\n  outline: 0;\n  background-color: transparent;\n  cursor: pointer;\n  box-shadow: 0 2px 5px 0 rgba(255, 255, 255, 0.5);\n  transition: color 0.3s, background-color 0.3s, box-shadow 0.3s; }\n", "", {"version":3,"sources":["D:/Projects/IAMPM-Probability/src/scss/src/scss/style.scss"],"names":[],"mappings":"AAAA;EACI,0CAAyC;EACzC,gBAAe;EACf,0BAAyB,EAC5B;;AACD;EACE,mBAAkB;EAClB,eAAc;EACd,aAAY;EACZ,cAAa;EACb,eAAc;EACd,mBAAkB;EAClB,uBAAsB,EAevB;EAtBD;IAUI,mBAAkB;IAClB,SAAQ;IACR,UAAS;IACT,eAAc;IACd,YAAW;IACX,aAAY;IACZ,YAAW;IACX,siDAAqiD;IACriD,6BAA4B;IAC5B,sBAAqB;IACrB,iCAAgC,EACjC;;AAGH;EACI,YAAW;EACX,iBAAgB;EAChB,kBAAiB,EAuBpB;EA1BD;IAMQ,eAAc;IACd,YAAW;IACX,eAAc,EACjB;EATL;IAYQ,cAAa;IACb,uBAAsB;IACtB,kBAAiB,EAWpB;IAzBL;MAiBY,cAAa;MACb,oBAAmB,EAMtB;MAxBT;QAqBgB,oBAAmB;QACnB,aAAY,EACf;;AAKb;EAEQ,eAAc;EACd,aAAY;EACZ,aAAY;EACZ,WAAU;EACV,eAAc;EACd,YAAW;EACX,gBAAe;EACf,kBAAiB;EACjB,kBAAiB;EACjB,mBAAkB;EAClB,uBAAsB;EACtB,mBAAkB;EAClB,WAAU;EACV,8BAA6B;EAC7B,gBAAe;EACf,iDAA+C;EAC/C,+DAA8D,EACjE","file":"style.scss","sourcesContent":["body {\r\n    font-family: Arial, Helvetica, sans-serif;\r\n    font-size: 14px;\r\n    background-color: #2c3e50;\r\n}\r\n.logo {\r\n  position: relative;\r\n  display: block;\r\n  width: 120px;\r\n  height: 120px;\r\n  margin: 0 auto;\r\n  border-radius: 50%;\r\n  background-color: #fff;\r\n\r\n  &::before {\r\n    position: absolute;\r\n    top: 50%;\r\n    left: 50%;\r\n    display: block;\r\n    width: 80px;\r\n    height: 80px;\r\n    content: '';\r\n    background-image: url(\"data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='94.7px' height='90.1px' viewBox='0 0 94.7 90.1'%3E %3Cstyle type='text/css'%3E .st0%7Bfill-rule:evenodd;clip-rule:evenodd;fill:%230080B6;%7D .st1%7Bfill-rule:evenodd;clip-rule:evenodd;fill:%23009EE2;%7D .st2%7Bfill-rule:evenodd;clip-rule:evenodd;fill:%2383CEEB;%7D %3C/style%3E %3Cdefs%3E %3C/defs%3E %3Cg%3E %3Cpath class='st0' d='M68.3,78.3l8.4,11.7l-28.8,0L32.2,78.4L68.3,78.3z M18.2,90.1l24.4,0l-16-11.6L18.2,90.1z M57.1,62.7 L57.1,62.7L48,57.9c-0.2-0.1-0.3-0.1-0.5-0.1c-0.2,0-0.3,0-0.5,0.1l-9.2,4.8l0-0.1l-8.7,12.3l0,0l36.9,0l0,0L57.1,62.7z'/%3E %3Cpath class='st1' d='M94.7,34.4l-8.9,27.4L70.3,72.9l10.8-34.2L94.7,34.4L94.7,34.4z M7.6,57.6l6-18.9L0,34.5L7.6,57.6z M68.3,78.3 l8.4,11.7l7.5-23.2L68.3,78.3z M26.6,78.5C26.6,78.5,26.6,78.5,26.6,78.5L15.2,44.6l-6,18.2l8.9,27.3L26.6,78.5z M39.6,52.5 c0.1-0.3-0.1-0.7-0.3-0.9l-7.4-7.2l0,0l-14.3-4.4l0,0l5.8,17.5l5.8,17.6l8.7-12.3L39.6,52.5z M77.3,39.9L63,44.3l0.2,0l-7.4,7.2 c-0.2,0.2-0.4,0.6-0.3,0.9l1.7,10.2L66,74.9l5.7-17.6L77.3,39.9L77.3,39.9z'/%3E %3Cpath class='st2' d='M94.7,34.4L94.7,34.4l-13.6,4.3L75,20.2L94.7,34.4z M47.4,14.3L47.4,14.3L76.4,35l-5.8-18.2L47.3,0L27.6,14.3 L47.4,14.3C47.3,14.3,47.3,14.3,47.4,14.3z M23.2,17.5L0,34.5l13.6,4.3l28.8-21.2L23.2,17.5z M47.4,18.1L47.4,18.1L32.5,28.9 l-15,11l14.3,4.4l10.2-1.5c0.3,0,0.6-0.3,0.8-0.6l4.5-9.2l0-0.1l4.6,9.3c0.2,0.3,0.4,0.5,0.8,0.6L63,44.3l14.4-4.4l-15-11 L47.4,18.1z'/%3E %3C/g%3E %3C/svg%3E\");\r\n    background-repeat: no-repeat;\r\n    background-size: 100%;\r\n    transform: translate(-50%, -50%);\r\n  }\r\n}\r\n\r\n.container {\r\n    width: 100%;\r\n    max-width: 320px;\r\n    margin: 30px auto;\r\n\r\n    .img {\r\n        display: block;\r\n        width: 85px;\r\n        margin: 0 auto;\r\n    }\r\n\r\n    .controll-buttons {\r\n        display: flex;\r\n        flex-direction: column;\r\n        margin-left: 1rem;\r\n\r\n        .controll-button {\r\n            display: flex;\r\n            align-items: center;\r\n            \r\n            span {\r\n                margin-left: 0.5rem;\r\n                color: white;\r\n            }\r\n        }\r\n    }\r\n}\r\n\r\n.actions {\r\n    button {\r\n        display: block;\r\n        width: 220px;\r\n        height: 50px;\r\n        padding: 0;\r\n        margin: 0 auto;\r\n        color: #fff;\r\n        font-size: 18px;\r\n        font-weight: bold;\r\n        line-height: 50px;\r\n        text-align: center;\r\n        border: 2px solid #fff;\r\n        border-radius: 4px;\r\n        outline: 0;\r\n        background-color: transparent;\r\n        cursor: pointer;\r\n        box-shadow: 0 2px 5px 0 rgba(255, 255, 255, .5);\r\n        transition: color 0.3s, background-color 0.3s, box-shadow 0.3s;\r\n    }\r\n}"],"sourceRoot":""}]);

// exports


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(9);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js??ref--1-1!../../node_modules/sass-loader/lib/loader.js??ref--1-2!./dice.scss", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js??ref--1-1!../../node_modules/sass-loader/lib/loader.js??ref--1-2!./dice.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, ".dice {\n  width: 60px;\n  height: 60px;\n  position: relative;\n  transform-style: preserve-3d;\n  transform: rotateX(0deg) rotateY(0deg) translateX(0);\n  animation-name: rotate;\n  animation-iteration-count: infinite;\n  animation-duration: 3s;\n  animation-timing-function: ease-in-out; }\n\n.dice > div {\n  height: 60px;\n  width: 60px;\n  position: absolute;\n  border: 2px solid #fff;\n  background: #008abe; }\n\n.dice span {\n  width: 8px;\n  height: 8px;\n  background: #fff;\n  border-radius: 50%;\n  display: block;\n  position: absolute; }\n\n.dice .front {\n  transform: rotateY(0deg) translateZ(30px); }\n\n.dice .front span:nth-child(1) {\n  top: 10px;\n  left: 12px; }\n\n.dice .front span:nth-child(2) {\n  top: 10px;\n  right: 12px; }\n\n.dice .front span:nth-child(3) {\n  top: 26px;\n  left: 12px; }\n\n.dice .front span:nth-child(4) {\n  top: 26px;\n  right: 12px; }\n\n.dice .front span:nth-child(5) {\n  bottom: 10px;\n  left: 12px; }\n\n.dice .front span:nth-child(6) {\n  bottom: 10px;\n  right: 12px; }\n\n.dice .back {\n  transform: rotateX(180deg) translateZ(30px); }\n\n.dice .back span {\n  top: 26px;\n  left: 26px; }\n\n.dice .right {\n  transform: rotateY(90deg) translateZ(30px); }\n\n.dice .right span:nth-child(1) {\n  top: 12px;\n  left: 12px; }\n\n.dice .right span:nth-child(2) {\n  top: 12px;\n  right: 12px; }\n\n.dice .right span:nth-child(3) {\n  top: 26px;\n  left: 26px; }\n\n.dice .right span:nth-child(4) {\n  bottom: 12px;\n  left: 12px; }\n\n.dice .right span:nth-child(5) {\n  bottom: 12px;\n  right: 12px; }\n\n.dice .left {\n  transform: rotateY(-90deg) translateZ(30px); }\n\n.dice .left span:nth-child(1) {\n  top: 12px;\n  right: 12px; }\n\n.dice .left span:nth-child(2) {\n  bottom: 12px;\n  left: 12px; }\n\n.dice .top {\n  transform: rotateX(90deg) translateZ(30px); }\n\n.dice .top span:nth-child(1) {\n  top: 12px;\n  right: 12px; }\n\n.dice .top span:nth-child(2) {\n  bottom: 12px;\n  left: 12px; }\n\n.dice .top span:nth-child(3) {\n  bottom: 26px;\n  left: 26px; }\n\n.dice .bottom {\n  transform: rotateX(-90deg) translateZ(30px); }\n\n.dice .bottom span:nth-child(1) {\n  top: 12px;\n  right: 12px; }\n\n.dice .bottom span:nth-child(2) {\n  top: 12px;\n  left: 12px; }\n\n.dice .bottom span:nth-child(3) {\n  bottom: 12px;\n  left: 12px; }\n\n.dice .bottom span:nth-child(4) {\n  bottom: 12px;\n  right: 12px; }\n\n.button {\n  position: fixed;\n  bottom: 20px;\n  background: #f76939;\n  padding: 20px 40px;\n  border-radius: 4px;\n  color: #fff;\n  cursor: pointer; }\n\n.button:hover {\n  background: #e35525; }\n\n@keyframes opacity {\n  0% {\n    opacity: 1; }\n  20% {\n    opacity: .5; }\n  40% {\n    opacity: 1; }\n  60% {\n    opacity: 1; }\n  80% {\n    opacity: .5; }\n  100% {\n    opacity: 1; } }\n\n@keyframes rotate {\n  0% {\n    transform: rotateX(90deg) rotateY(360deg) rotateZ(0deg) translateX(0); }\n  35% {\n    transform: rotateX(-180deg) rotateY(-90deg) rotateZ(0deg) translateX(0); }\n  45% {\n    transform: rotateX(-180deg) rotateY(-90deg) rotateZ(0deg) translateX(0); }\n  65% {\n    transform: rotateX(0deg) rotateY(0deg) rotateZ(-360deg) translateX(0); }\n  75% {\n    transform: rotateX(0deg) rotateY(0deg) rotateZ(-360deg) translateX(0); }\n  100% {\n    transform: rotateX(90deg) rotateY(360deg) rotateZ(0deg) translateX(0); } }\n", "", {"version":3,"sources":["D:/Projects/IAMPM-Probability/src/scss/src/scss/dice.scss"],"names":[],"mappings":"AAAA;EACE,YAAW;EACX,aAAY;EACZ,mBAAkB;EAClB,6BAA4B;EAC5B,qDAAoD;EACpD,uBAAsB;EACtB,oCAAmC;EACnC,uBAAsB;EACtB,uCAAsC,EACvC;;AACD;EACE,aAAY;EACZ,YAAW;EACX,mBAAkB;EAClB,uBAAsB;EACtB,oBAAmB,EACpB;;AACD;EACE,WAAU;EACV,YAAW;EACX,iBAAgB;EAChB,mBAAkB;EAClB,eAAc;EACd,mBAAkB,EACnB;;AACD;EACE,0CAAyC,EAC1C;;AACD;EACE,UAAS;EACT,WAAU,EACX;;AACD;EACE,UAAS;EACT,YAAW,EACZ;;AACD;EACE,UAAS;EACT,WAAU,EACX;;AACD;EACE,UAAS;EACT,YAAW,EACZ;;AACD;EACE,aAAY;EACZ,WAAU,EACX;;AACD;EACE,aAAY;EACZ,YAAW,EACZ;;AACD;EACE,4CAA2C,EAC5C;;AACD;EACE,UAAS;EACT,WAAU,EACX;;AACD;EACE,2CAA0C,EAC3C;;AACD;EACE,UAAS;EACT,WAAU,EACX;;AACD;EACE,UAAS;EACT,YAAW,EACZ;;AACD;EACE,UAAS;EACT,WAAU,EACX;;AACD;EACE,aAAY;EACZ,WAAU,EACX;;AACD;EACE,aAAY;EACZ,YAAW,EACZ;;AACD;EACE,4CAA2C,EAC5C;;AACD;EACE,UAAS;EACT,YAAW,EACZ;;AACD;EACE,aAAY;EACZ,WAAU,EACX;;AACD;EACE,2CAA0C,EAC3C;;AACD;EACE,UAAS;EACT,YAAW,EACZ;;AACD;EACE,aAAY;EACZ,WAAU,EACX;;AACD;EACE,aAAY;EACZ,WAAU,EACX;;AACD;EACE,4CAA2C,EAC5C;;AACD;EACE,UAAS;EACT,YAAW,EACZ;;AACD;EACE,UAAS;EACT,WAAU,EACX;;AACD;EACE,aAAY;EACZ,WAAU,EACX;;AACD;EACE,aAAY;EACZ,YAAW,EACZ;;AAED;EACE,gBAAe;EACf,aAAY;EACZ,oBAAmB;EACnB,mBAAkB;EAClB,mBAAkB;EAClB,YAAW;EACX,gBAAe,EAChB;;AACD;EACE,oBAAmB,EACpB;;AAED;EACE;IACE,WAAU,EAAA;EAEZ;IACE,YAAW,EAAA;EAEb;IACE,WAAU,EAAA;EAEZ;IACE,WAAU,EAAA;EAEZ;IACE,YAAW,EAAA;EAEb;IACE,WAAU,EAAA,EAAA;;AAGd;EACE;IACE,sEAAqE,EAAA;EAEvE;IACE,wEAAuE,EAAA;EAEzE;IACE,wEAAuE,EAAA;EAEzE;IACE,sEAAqE,EAAA;EAEvE;IACE,sEAAqE,EAAA;EAEvE;IACE,sEAAqE,EAAA,EAAA","file":"dice.scss","sourcesContent":[".dice {\r\n  width: 60px;\r\n  height: 60px;\r\n  position: relative;\r\n  transform-style: preserve-3d;\r\n  transform: rotateX(0deg) rotateY(0deg) translateX(0);\r\n  animation-name: rotate;\r\n  animation-iteration-count: infinite;\r\n  animation-duration: 3s;\r\n  animation-timing-function: ease-in-out;\r\n}\r\n.dice > div {\r\n  height: 60px;\r\n  width: 60px;\r\n  position: absolute;\r\n  border: 2px solid #fff;\r\n  background: #008abe;\r\n}\r\n.dice span {\r\n  width: 8px;\r\n  height: 8px;\r\n  background: #fff;\r\n  border-radius: 50%;\r\n  display: block;\r\n  position: absolute;\r\n}\r\n.dice .front {\r\n  transform: rotateY(0deg) translateZ(30px);\r\n}\r\n.dice .front span:nth-child(1) {\r\n  top: 10px;\r\n  left: 12px;\r\n}\r\n.dice .front span:nth-child(2) {\r\n  top: 10px;\r\n  right: 12px;\r\n}\r\n.dice .front span:nth-child(3) {\r\n  top: 26px;\r\n  left: 12px;\r\n}\r\n.dice .front span:nth-child(4) {\r\n  top: 26px;\r\n  right: 12px;\r\n}\r\n.dice .front span:nth-child(5) {\r\n  bottom: 10px;\r\n  left: 12px;\r\n}\r\n.dice .front span:nth-child(6) {\r\n  bottom: 10px;\r\n  right: 12px;\r\n}\r\n.dice .back {\r\n  transform: rotateX(180deg) translateZ(30px);\r\n}\r\n.dice .back span {\r\n  top: 26px;\r\n  left: 26px;\r\n}\r\n.dice .right {\r\n  transform: rotateY(90deg) translateZ(30px);\r\n}\r\n.dice .right span:nth-child(1) {\r\n  top: 12px;\r\n  left: 12px;\r\n}\r\n.dice .right span:nth-child(2) {\r\n  top: 12px;\r\n  right: 12px;\r\n}\r\n.dice .right span:nth-child(3) {\r\n  top: 26px;\r\n  left: 26px;\r\n}\r\n.dice .right span:nth-child(4) {\r\n  bottom: 12px;\r\n  left: 12px;\r\n}\r\n.dice .right span:nth-child(5) {\r\n  bottom: 12px;\r\n  right: 12px;\r\n}\r\n.dice .left {\r\n  transform: rotateY(-90deg) translateZ(30px);\r\n}\r\n.dice .left span:nth-child(1) {\r\n  top: 12px;\r\n  right: 12px;\r\n}\r\n.dice .left span:nth-child(2) {\r\n  bottom: 12px;\r\n  left: 12px;\r\n}\r\n.dice .top {\r\n  transform: rotateX(90deg) translateZ(30px);\r\n}\r\n.dice .top span:nth-child(1) {\r\n  top: 12px;\r\n  right: 12px;\r\n}\r\n.dice .top span:nth-child(2) {\r\n  bottom: 12px;\r\n  left: 12px;\r\n}\r\n.dice .top span:nth-child(3) {\r\n  bottom: 26px;\r\n  left: 26px;\r\n}\r\n.dice .bottom {\r\n  transform: rotateX(-90deg) translateZ(30px);\r\n}\r\n.dice .bottom span:nth-child(1) {\r\n  top: 12px;\r\n  right: 12px;\r\n}\r\n.dice .bottom span:nth-child(2) {\r\n  top: 12px;\r\n  left: 12px;\r\n}\r\n.dice .bottom span:nth-child(3) {\r\n  bottom: 12px;\r\n  left: 12px;\r\n}\r\n.dice .bottom span:nth-child(4) {\r\n  bottom: 12px;\r\n  right: 12px;\r\n}\r\n\r\n.button {\r\n  position: fixed;\r\n  bottom: 20px;\r\n  background: #f76939;\r\n  padding: 20px 40px;\r\n  border-radius: 4px;\r\n  color: #fff;\r\n  cursor: pointer;\r\n}\r\n.button:hover {\r\n  background: #e35525;\r\n}\r\n\r\n@keyframes opacity {\r\n  0% {\r\n    opacity: 1;\r\n  }\r\n  20% {\r\n    opacity: .5;\r\n  }\r\n  40% {\r\n    opacity: 1;\r\n  }\r\n  60% {\r\n    opacity: 1;\r\n  }\r\n  80% {\r\n    opacity: .5;\r\n  }\r\n  100% {\r\n    opacity: 1;\r\n  }\r\n}\r\n@keyframes rotate {\r\n  0% {\r\n    transform: rotateX(90deg) rotateY(360deg) rotateZ(0deg) translateX(0);\r\n  }\r\n  35% {\r\n    transform: rotateX(-180deg) rotateY(-90deg) rotateZ(0deg) translateX(0);\r\n  }\r\n  45% {\r\n    transform: rotateX(-180deg) rotateY(-90deg) rotateZ(0deg) translateX(0);\r\n  }\r\n  65% {\r\n    transform: rotateX(0deg) rotateY(0deg) rotateZ(-360deg) translateX(0);\r\n  }\r\n  75% {\r\n    transform: rotateX(0deg) rotateY(0deg) rotateZ(-360deg) translateX(0);\r\n  }\r\n  100% {\r\n    transform: rotateX(90deg) rotateY(360deg) rotateZ(0deg) translateX(0);\r\n  }\r\n}\r\n\r\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(11);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js??ref--1-1!../../node_modules/sass-loader/lib/loader.js??ref--1-2!./random.scss", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js??ref--1-1!../../node_modules/sass-loader/lib/loader.js??ref--1-2!./random.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, ".random-container-inputs {\n  display: flex;\n  flex-direction: column;\n  align-items: center; }\n  .random-container-inputs select, .random-container-inputs input {\n    display: block;\n    width: 220px;\n    height: 50px;\n    font-size: 20px;\n    line-height: 50px;\n    border: 1px solid #ccc;\n    border-radius: 4px;\n    background-color: #fff; }\n  .random-container-inputs select {\n    margin-bottom: 1rem; }\n\n.random-result {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  height: 100px;\n  margin: 30px 0; }\n\n.random-result-container {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  width: 100%; }\n  .random-result-container .fail {\n    color: #ff0000;\n    font-size: 24px;\n    font-weight: bold; }\n  .random-result-container .benefit {\n    color: blue;\n    font-size: 24px;\n    font-weight: bold; }\n", "", {"version":3,"sources":["D:/Projects/IAMPM-Probability/src/scss/src/scss/random.scss"],"names":[],"mappings":"AAAA;EACI,cAAa;EACb,uBAAsB;EACtB,oBAAmB,EAgBtB;EAnBD;IAMQ,eAAc;IACd,aAAY;IACZ,aAAY;IACZ,gBAAe;IACf,kBAAiB;IACjB,uBAAsB;IACtB,mBAAkB;IAClB,uBAAsB,EACzB;EAdL;IAiBQ,oBAAmB,EACtB;;AAEL;EACI,cAAa;EACb,oBAAmB;EACnB,wBAAuB;EACvB,cAAa;EACb,eAAc,EACjB;;AACD;EACI,cAAa;EACb,uBAAsB;EACtB,wBAAuB;EACvB,oBAAmB;EACnB,YAAW,EAad;EAlBD;IAQQ,eAAc;IACd,gBAAe;IACf,kBAAiB,EACpB;EAXL;IAcQ,YAAW;IACX,gBAAe;IACf,kBAAiB,EACpB","file":"random.scss","sourcesContent":[".random-container-inputs {\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    \r\n    select, input {\r\n        display: block;\r\n        width: 220px;\r\n        height: 50px;\r\n        font-size: 20px;\r\n        line-height: 50px;\r\n        border: 1px solid #ccc;\r\n        border-radius: 4px;\r\n        background-color: #fff;\r\n    }\r\n\r\n    select {\r\n        margin-bottom: 1rem;\r\n    }\r\n}\r\n.random-result {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n    height: 100px;\r\n    margin: 30px 0;\r\n}\r\n.random-result-container {\r\n    display: flex;\r\n    flex-direction: column;\r\n    justify-content: center;\r\n    align-items: center;\r\n    width: 100%;\r\n\r\n    .fail {\r\n        color: #ff0000;\r\n        font-size: 24px;\r\n        font-weight: bold;\r\n    }\r\n\r\n    .benefit {\r\n        color: blue;\r\n        font-size: 24px;\r\n        font-weight: bold;\r\n    }\r\n}"],"sourceRoot":""}]);

// exports


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(13);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js??ref--1-1!../../node_modules/sass-loader/lib/loader.js??ref--1-2!./cube.scss", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js??ref--1-1!../../node_modules/sass-loader/lib/loader.js??ref--1-2!./cube.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "#cubes-container .cube-result-container {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  width: 100%; }\n\n#cubes-container span {\n  color: red; }\n", "", {"version":3,"sources":["D:/Projects/IAMPM-Probability/src/scss/src/scss/cube.scss"],"names":[],"mappings":"AAAA;EAEI,cAAa;EACb,uBAAsB;EACtB,wBAAuB;EACvB,oBAAmB;EACnB,YAAW,EACZ;;AAPH;EAUI,WAAU,EACX","file":"cube.scss","sourcesContent":["#cubes-container {\r\n  .cube-result-container {\r\n    display: flex;\r\n    flex-direction: column;\r\n    justify-content: center;\r\n    align-items: center;\r\n    width: 100%;\r\n  }\r\n\r\n  span {\r\n    color: red;\r\n  }\r\n}"],"sourceRoot":""}]);

// exports


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(15);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js??ref--1-1!../../node_modules/sass-loader/lib/loader.js??ref--1-2!./market.scss", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js??ref--1-1!../../node_modules/sass-loader/lib/loader.js??ref--1-2!./market.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "#market-container .market-container-inputs {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  width: 100%; }\n", "", {"version":3,"sources":["D:/Projects/IAMPM-Probability/src/scss/src/scss/market.scss"],"names":[],"mappings":"AAAA;EAEI,cAAa;EACb,uBAAsB;EACtB,wBAAuB;EACvB,oBAAmB;EACnB,YAAW,EACZ","file":"market.scss","sourcesContent":["#market-container {\r\n  .market-container-inputs {\r\n    display: flex;\r\n    flex-direction: column;\r\n    justify-content: center;\r\n    align-items: center;\r\n    width: 100%;\r\n  }\r\n}"],"sourceRoot":""}]);

// exports


/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const Mode = Object.freeze({
  cubes: 1,
  probability: 2,
  market: 3
});

/* harmony default export */ __webpack_exports__["a"] = (Mode);

/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["g"] = hideAll;
/* harmony export (immutable) */ __webpack_exports__["h"] = setDisplay;
/* harmony export (immutable) */ __webpack_exports__["i"] = setValue;
/* harmony export (immutable) */ __webpack_exports__["f"] = getValue;
const CUBES_CONTAINER = 'cubes-container';
/* harmony export (immutable) */ __webpack_exports__["a"] = CUBES_CONTAINER;

const PROBABILITY_CONTAINER = 'probability-container';
/* harmony export (immutable) */ __webpack_exports__["e"] = PROBABILITY_CONTAINER;

const MARKET_CONTAINER = 'market-container';
/* harmony export (immutable) */ __webpack_exports__["d"] = MARKET_CONTAINER;

const CUBE_RESULT_CONTAINER = 'cube-result';
/* harmony export (immutable) */ __webpack_exports__["b"] = CUBE_RESULT_CONTAINER;

const EXECUTE_BUTTON_ID = 'executeButton';
/* harmony export (immutable) */ __webpack_exports__["c"] = EXECUTE_BUTTON_ID;


function hideAll() {
  setDisplay(CUBES_CONTAINER, 'none');
  setDisplay(PROBABILITY_CONTAINER, 'none');
  setDisplay(MARKET_CONTAINER, 'none');
}

function setDisplay(id, value) {
  const element = document.getElementById(id);
  if (element) {
    element.style.display = value;
  }
}

function setValue(id, value) {
  const element = document.getElementById(id);
  if (element) {
    element.innerHTML = value;
  }
}

function getValue(id) {
  const element = document.getElementById(id);
  return element ? element.value : null;
}

/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__chance__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash_random__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash_random___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_lodash_random__);



const LEVEL_ZERO_CHANCES = [new __WEBPACK_IMPORTED_MODULE_0__chance__["a" /* Chance */](100), new __WEBPACK_IMPORTED_MODULE_0__chance__["a" /* Chance */](80), new __WEBPACK_IMPORTED_MODULE_0__chance__["a" /* Chance */](60), new __WEBPACK_IMPORTED_MODULE_0__chance__["a" /* Chance */](40), new __WEBPACK_IMPORTED_MODULE_0__chance__["a" /* Chance */](20), new __WEBPACK_IMPORTED_MODULE_0__chance__["a" /* Chance */](0)];
const LEVEL_FIRST_CHANCES = [new __WEBPACK_IMPORTED_MODULE_0__chance__["a" /* Chance */](80), new __WEBPACK_IMPORTED_MODULE_0__chance__["a" /* Chance */](60), new __WEBPACK_IMPORTED_MODULE_0__chance__["a" /* Chance */](40), new __WEBPACK_IMPORTED_MODULE_0__chance__["a" /* Chance */](20), new __WEBPACK_IMPORTED_MODULE_0__chance__["a" /* Chance */](0)];
const LEVEL_SECOND_CHANCES = [new __WEBPACK_IMPORTED_MODULE_0__chance__["a" /* Chance */](60), new __WEBPACK_IMPORTED_MODULE_0__chance__["a" /* Chance */](40), new __WEBPACK_IMPORTED_MODULE_0__chance__["a" /* Chance */](20), new __WEBPACK_IMPORTED_MODULE_0__chance__["a" /* Chance */](0)];
const LEVEL_THIRD_CHANCES = [new __WEBPACK_IMPORTED_MODULE_0__chance__["a" /* Chance */](40), new __WEBPACK_IMPORTED_MODULE_0__chance__["a" /* Chance */](20), new __WEBPACK_IMPORTED_MODULE_0__chance__["a" /* Chance */](0)];

class Probability {
  constructor() {
    this.chanceMap = new Map([
      [0, LEVEL_ZERO_CHANCES],
      [1, LEVEL_FIRST_CHANCES],
      [2, LEVEL_SECOND_CHANCES],
      [3, LEVEL_THIRD_CHANCES]
    ]);
  }

  getChance(level) {
    if (!this.chanceMap.has(level)) return null;

    const items = this.chanceMap.get(level);
    const index = __WEBPACK_IMPORTED_MODULE_1_lodash_random__(0, items.length - 1);
    return items[index];
  }

  calculateBenefitValue(benefit, fail) {
    if (benefit < 0) {
      benefit *= -1;
    }

    return benefit - Math.round(benefit * fail / 100);
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Probability;


/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Chance {
  constructor(fail) {
    this.fail = fail;
    this.win = 100 - fail;
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Chance;


/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_random__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_random___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash_random__);


class CardValue {
  constructor(value, isPositive) {
    this.value = value;
    this.isPositive = isPositive;
  }
}

class Market {
  constructor() {
    this.sales = [0, 10, 20, 40, 80, 100, 120, 140, 180, 200];
    this.cards = [
      new CardValue(0, false),
      new CardValue(1, false),
      new CardValue(2, false),
      new CardValue(4, false),
      new CardValue(8, false),
      new CardValue(8, true),
      new CardValue(4, true),
      new CardValue(2, true),
      new CardValue(1, true),
      new CardValue(0, true)
    ];
  }

  getSalesResult(salesInputVal) {
    const index = __WEBPACK_IMPORTED_MODULE_0_lodash_random__(0, this.sales.length - 1);
    return salesInputVal - Math.round(salesInputVal * this.sales[index] / 100);
  }

  getCarsResult(cardsInputVal) {
    const index = __WEBPACK_IMPORTED_MODULE_0_lodash_random__(0, this.cards.length - 1);
    const card = this.cards[index];

    if (card.value === 0) {
      return card.isPositive ? cardsInputVal : 0;
    } else {
      return card.isPositive ? cardsInputVal + card.value : cardsInputVal - card.value;
    }
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Market;


/***/ })
/******/ ]);
//# sourceMappingURL=app.js.map