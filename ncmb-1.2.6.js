/*!
 * NCMB JavaScript SDK
 * Version: 1.2.6
 * Build: 04.2015 
 * http://www.nifty.com
 *
 * Copyright (c) 2014, NIFTY Corporation. All rights reserved.
 * The NCMB JavaScript SDK is freely distributable under the MIT license.
 *
 * Created based on the following Javascript libraries.
 * 
 * Parse JavaScript SDK v1.2.8
 * Copyright 2013 Parse, Inc.
 * The Parse JavaScript SDK is freely distributable under the MIT license.
 * 
 * Backbone.js v1.0.0
 * Copyright (c) 2010-2013 Jeremy Ashkenas, DocumentCloud Inc.
 * Backbone may be freely distributed under the MIT license.
 *
 * Includes: Underscore.js v1.4.4
 * Copyright 2009-2012 Jeremy Ashkenas, DocumentCloud Inc.
 * The Underscore is freely distributable under the MIT license.
 * 
 * Includes: CryptoJS v3.0.2 v3.1.2
 * Copyright (c) 2009-2013 by Jeff Mott. All rights reserved.
 * code.google.com/p/crypto-js/wiki/License
 *
 * Includes: node-XMLHttpRequest v1.4.0
 * @author Dan DeFelippi <dan@driverdan.com>
 * @contributor David Ellis <d.f.ellis@ieee.org>
 * @license MIT
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, 
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF 
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, 
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, 
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH 
 * THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. 
 */

(function(root) {
  root.NCMB = root.NCMB || {};
  root.NCMB.VERSION = "1.2.6";
}(this));



//********************************************** UNDERSCORE *********************************************************//
//     Underscore.js 1.4.4
//     http://underscorejs.org
//     (c) 2009-2013 Jeremy Ashkenas, DocumentCloud Inc.
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `global` on the server.
  // root オブジェクトを生成（ブラウザーの場合、`window`、サーバーの場合）
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var push             = ArrayProto.push,
      slice            = ArrayProto.slice,
      concat           = ArrayProto.concat,
      toString         = ObjProto.toString,
      hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object via a string identifier,
  // for Closure Compiler "advanced" mode.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.4.4';

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects with the built-in `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each = _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, l = obj.length; i < l; i++) {
        if (iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      for (var key in obj) {
        if (_.has(obj, key)) {
          if (iterator.call(context, obj[key], key, obj) === breaker) return;
        }
      }
    }
  };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = _.collect = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results[results.length] = iterator.call(context, value, index, list);
    });
    return results;
  };

  var reduceError = 'Reduce of empty array with no initial value';

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function(value, index, list) {
      if (!initial) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var length = obj.length;
    if (length !== +length) {
      var keys = _.keys(obj);
      length = keys.length;
    }
    each(obj, function(value, index, list) {
      index = keys ? keys[--length] : --length;
      if (!initial) {
        memo = obj[index];
        initial = true;
      } else {
        memo = iterator.call(context, memo, obj[index], index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, iterator, context) {
    var result;
    any(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
  _.filter = _.select = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
    each(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) results[results.length] = value;
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, iterator, context) {
    return _.filter(obj, function(value, index, list) {
      return !iterator.call(context, value, index, list);
    }, context);
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
  _.every = _.all = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
    each(obj, function(value, index, list) {
      if (!(result = result && iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any = _.some = _.any = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
    each(obj, function(value, index, list) {
      if (result || (result = iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if the array or object contains a given value (using `===`).
  // Aliased as `include`.
  _.contains = _.include = function(obj, target) {
    if (obj == null) return false;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    return any(obj, function(value) {
      return value === target;
    });
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      return (isFunc ? method : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, function(value){ return value[key]; });
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs, first) {
    if (_.isEmpty(attrs)) return first ? null : [];
    return _[first ? 'find' : 'filter'](obj, function(value) {
      for (var key in attrs) {
        if (attrs[key] !== value[key]) return false;
      }
      return true;
    });
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.where(obj, attrs, true);
  };

  // Return the maximum element or (element-based computation).
  // Can't optimize arrays of integers longer than 65,535 elements.
  // See: https://bugs.webkit.org/show_bug.cgi?id=80797
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.max.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return -Infinity;
    var result = {computed : -Infinity, value: -Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed >= result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.min.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return Infinity;
    var result = {computed : Infinity, value: Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed < result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Shuffle an array.
  _.shuffle = function(obj) {
    var rand;
    var index = 0;
    var shuffled = [];
    each(obj, function(value) {
      rand = _.random(index++);
      shuffled[index - 1] = shuffled[rand];
      shuffled[rand] = value;
    });
    return shuffled;
  };

  // An internal function to generate lookup iterators.
  var lookupIterator = function(value) {
    return _.isFunction(value) ? value : function(obj){ return obj[value]; };
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, value, context) {
    var iterator = lookupIterator(value);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value : value,
        index : index,
        criteria : iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index < right.index ? -1 : 1;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(obj, value, context, behavior) {
    var result = {};
    var iterator = lookupIterator(value || _.identity);
    each(obj, function(value, index) {
      var key = iterator.call(context, value, index, obj);
      behavior(result, key, value);
    });
    return result;
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = function(obj, value, context) {
    return group(obj, value, context, function(result, key, value) {
      (_.has(result, key) ? result[key] : (result[key] = [])).push(value);
    });
  };

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = function(obj, value, context) {
    return group(obj, value, context, function(result, key) {
      if (!_.has(result, key)) result[key] = 0;
      result[key]++;
    });
  };

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator, context) {
    iterator = iterator == null ? _.identity : lookupIterator(iterator);
    var value = iterator.call(context, obj);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >>> 1;
      iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Safely convert anything iterable into a real, live array.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (obj.length === +obj.length) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return (obj.length === +obj.length) ? obj.length : _.keys(obj).length;
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    return (n != null) && !guard ? slice.call(array, 0, n) : array[0];
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if ((n != null) && !guard) {
      return slice.call(array, Math.max(array.length - n, 0));
    } else {
      return array[array.length - 1];
    }
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, (n == null) || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, output) {
    each(input, function(value) {
      if (_.isArray(value)) {
        shallow ? push.apply(output, value) : flatten(value, shallow, output);
      } else {
        output.push(value);
      }
    });
    return output;
  };

  // Return a completely flattened version of an array.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iterator, context) {
    if (_.isFunction(isSorted)) {
      context = iterator;
      iterator = isSorted;
      isSorted = false;
    }
    var initial = iterator ? _.map(array, iterator, context) : array;
    var results = [];
    var seen = [];
    each(initial, function(value, index) {
      if (isSorted ? (!index || seen[seen.length - 1] !== value) : !_.contains(seen, value)) {
        seen.push(value);
        results.push(array[index]);
      }
    });
    return results;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(concat.apply(ArrayProto, arguments));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.indexOf(other, item) >= 0;
      });
    });
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
    return _.filter(array, function(value){ return !_.contains(rest, value); });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var args = slice.call(arguments);
    var length = _.max(_.pluck(args, 'length'));
    var results = new Array(length);
    for (var i = 0; i < length; i++) {
      results[i] = _.pluck(args, "" + i);
    }
    return results;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    if (list == null) return {};
    var result = {};
    for (var i = 0, l = list.length; i < l; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
  // we need this function. Return the position of the first occurrence of an
  // item in an array, or -1 if the item is not included in the array.
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i = 0, l = array.length;
    if (isSorted) {
      if (typeof isSorted == 'number') {
        i = (isSorted < 0 ? Math.max(0, l + isSorted) : isSorted);
      } else {
        i = _.sortedIndex(array, item);
        return array[i] === item ? i : -1;
      }
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
    for (; i < l; i++) if (array[i] === item) return i;
    return -1;
  };

  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function(array, item, from) {
    if (array == null) return -1;
    var hasIndex = from != null;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) {
      return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);
    }
    var i = (hasIndex ? from : array.length);
    while (i--) if (array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var len = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(len);

    while(idx < len) {
      range[idx++] = start;
      start += step;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    if (func.bind === nativeBind && nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    var args = slice.call(arguments, 2);
    return function() {
      return func.apply(context, args.concat(slice.call(arguments)));
    };
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context.
  _.partial = function(func) {
    var args = slice.call(arguments, 1);
    return function() {
      return func.apply(this, args.concat(slice.call(arguments)));
    };
  };

  // Bind all of an object's methods to that object. Useful for ensuring that
  // all callbacks defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length === 0) funcs = _.functions(obj);
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memo = {};
    hasher || (hasher = _.identity);
    return function() {
      var key = hasher.apply(this, arguments);
      return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){ return func.apply(null, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time.
  _.throttle = function(func, wait) {
    var context, args, timeout, result;
    var previous = 0;
    var later = function() {
      previous = new Date;
      timeout = null;
      result = func.apply(context, args);
    };
    return function() {
      var now = new Date;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
      } else if (!timeout) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, result;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) result = func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) result = func.apply(context, args);
      return result;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if (ran) return memo;
      ran = true;
      memo = func.apply(this, arguments);
      func = null;
      return memo;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return function() {
      var args = [func];
      push.apply(args, arguments);
      return wrapper.apply(this, args);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = arguments;
    return function() {
      var args = arguments;
      for (var i = funcs.length - 1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    if (times <= 0) return func();
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = nativeKeys || function(obj) {
    if (obj !== Object(obj)) throw new TypeError('Invalid object');
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys[keys.length] = key;
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var values = [];
    for (var key in obj) if (_.has(obj, key)) values.push(obj[key]);
    return values;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var pairs = [];
    for (var key in obj) if (_.has(obj, key)) pairs.push([key, obj[key]]);
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    for (var key in obj) if (_.has(obj, key)) result[obj[key]] = key;
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    each(keys, function(key) {
      if (key in obj) copy[key] = obj[key];
    });
    return copy;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    for (var key in obj) {
      if (!_.contains(keys, key)) copy[key] = obj[key];
    }
    return copy;
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          if (obj[prop] == null) obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the Harmony `egal` proposal: http://wiki.ecmascript.org/doku.php?id=harmony:egal.
    if (a === b) return a !== 0 || 1 / a == 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className != toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, dates, and booleans are compared by value.
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return a == String(b);
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
        // other numeric values.
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a == +b;
      // RegExps are compared by their source patterns and flags.
      case '[object RegExp]':
        return a.source == b.source &&
               a.global == b.global &&
               a.multiline == b.multiline &&
               a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] == a) return bStack[length] == b;
    }
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    var size = 0, result = true;
    // Recursively compare objects and arrays.
    if (className == '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size == b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          if (!(result = eq(a[size], b[size], aStack, bStack))) break;
        }
      }
    } else {
      // Objects with different constructors are not equivalent, but `Object`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && (aCtor instanceof aCtor) &&
                               _.isFunction(bCtor) && (bCtor instanceof bCtor))) {
        return false;
      }
      // Deep compare objects.
      for (var key in a) {
        if (_.has(a, key)) {
          // Count the expected number of properties.
          size++;
          // Deep compare each member.
          if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
        }
      }
      // Ensure that both objects contain the same number of properties.
      if (result) {
        for (key in b) {
          if (_.has(b, key) && !(size--)) break;
        }
        result = !size;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return result;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, [], []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) == '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    return obj === Object(obj);
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
  each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) == '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return !!(obj && _.has(obj, 'callee'));
    };
  }

  // Optimize `isFunction` if appropriate.
  if (typeof (/./) !== 'function') {
    _.isFunction = function(obj) {
      return typeof obj === 'function';
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(NCMBFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj != +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  // Run a function **n** times.
  _.times = function(n, iterator, context) {
    var accum = Array(n);
    for (var i = 0; i < n; i++) accum[i] = iterator.call(context, i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // List of HTML entities for escaping.
  var entityMap = {
    escape: {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;'
    }
  };
  entityMap.unescape = _.invert(entityMap.escape);

  // Regexes containing the keys and values listed immediately above.
  var entityRegexes = {
    escape:   new RegExp('[' + _.keys(entityMap.escape).join('') + ']', 'g'),
    unescape: new RegExp('(' + _.keys(entityMap.unescape).join('|') + ')', 'g')
  };

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  _.each(['escape', 'unescape'], function(method) {
    _[method] = function(string) {
      if (string == null) return '';
      return ('' + string).replace(entityRegexes[method], function(match) {
        return entityMap[method][match];
      });
    };
  });

  // If the value of the named property is a function then invoke it;
  // otherwise, return it.
  _.result = function(object, property) {
    if (object == null) return null;
    var value = object[property];
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    each(_.functions(obj), function(name){
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result.call(this, func.apply(_, args));
      };
    });
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\t':     't',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function(text, data, settings) {
    var render;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = new RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset)
        .replace(escaper, function(match) { return '\\' + escapes[match]; });

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      }
      if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      }
      if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }
      index = offset + match.length;
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + "return __p;\n";

    try {
      render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    if (data) return render(data, _);
    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled function source as a convenience for precompilation.
    template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function, which will delegate to the wrapper.
  _.chain = function(obj) {
    return _(obj).chain();
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(obj) {
    return this._chain ? _(obj).chain() : obj;
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name == 'shift' || name == 'splice') && obj.length === 0) delete obj[0];
      return result.call(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result.call(this, method.apply(this._wrapped, arguments));
    };
  });

  _.extend(_.prototype, {

    // Start chaining a wrapped Underscore object.
    chain: function() {
      this._chain = true;
      return this;
    },

    // Extracts the result from a wrapped and chained object.
    value: function() {
      return this._wrapped;
    }

  });
}).call(this);

//************************************************ SHA256 ENCODE *******************************************************//
//     CryptoJS v3.0.2
//     code.google.com/p/crypto-js
//     (c) 2009-2012 by Jeff Mott. All rights reserved.
//     code.google.com/p/crypto-js/wiki/License

var CryptoJS = CryptoJS || function (h, i) {
        var e = {}, f = e.lib = {}, l = f.Base = function () {
                function a() {}
                return {
                    extend: function (j) {
                        a.prototype = this;
                        var d = new a;
                        j && d.mixIn(j);
                        d.$super = this;
                        return d
                    },
                    create: function () {
                        var a = this.extend();
                        a.init.apply(a, arguments);
                        return a
                    },
                    init: function () {},
                    mixIn: function (a) {
                        for (var d in a) a.hasOwnProperty(d) && (this[d] = a[d]);
                        a.hasOwnProperty("toString") && (this.toString = a.toString)
                    },
                    clone: function () {
                        return this.$super.extend(this)
                    }
                }
            }(),
            k = f.WordArray = l.extend({
                init: function (a, j) {
                    a =
                        this.words = a || [];
                    this.sigBytes = j != i ? j : 4 * a.length
                },
                toString: function (a) {
                    return (a || m).stringify(this)
                },
                concat: function (a) {
                    var j = this.words,
                        d = a.words,
                        c = this.sigBytes,
                        a = a.sigBytes;
                    this.clamp();
                    if (c % 4)
                        for (var b = 0; b < a; b++) j[c + b >>> 2] |= (d[b >>> 2] >>> 24 - 8 * (b % 4) & 255) << 24 - 8 * ((c + b) % 4);
                    else if (65535 < d.length)
                        for (b = 0; b < a; b += 4) j[c + b >>> 2] = d[b >>> 2];
                    else j.push.apply(j, d);
                    this.sigBytes += a;
                    return this
                },
                clamp: function () {
                    var a = this.words,
                        b = this.sigBytes;
                    a[b >>> 2] &= 4294967295 << 32 - 8 * (b % 4);
                    a.length = h.ceil(b / 4)
                },
                clone: function () {
                    var a =
                        l.clone.call(this);
                    a.words = this.words.slice(0);
                    return a
                },
                random: function (a) {
                    for (var b = [], d = 0; d < a; d += 4) b.push(4294967296 * h.random() | 0);
                    return k.create(b, a)
                }
            }),
            o = e.enc = {}, m = o.Hex = {
                stringify: function (a) {
                    for (var b = a.words, a = a.sigBytes, d = [], c = 0; c < a; c++) {
                        var e = b[c >>> 2] >>> 24 - 8 * (c % 4) & 255;
                        d.push((e >>> 4).toString(16));
                        d.push((e & 15).toString(16))
                    }
                    return d.join("")
                },
                parse: function (a) {
                    for (var b = a.length, d = [], c = 0; c < b; c += 2) d[c >>> 3] |= parseInt(a.substr(c, 2), 16) << 24 - 4 * (c % 8);
                    return k.create(d, b / 2)
                }
            }, q = o.Latin1 = {
                stringify: function (a) {
                    for (var b =
                        a.words, a = a.sigBytes, d = [], c = 0; c < a; c++) d.push(String.fromCharCode(b[c >>> 2] >>> 24 - 8 * (c % 4) & 255));
                    return d.join("")
                },
                parse: function (a) {
                    for (var b = a.length, d = [], c = 0; c < b; c++) d[c >>> 2] |= (a.charCodeAt(c) & 255) << 24 - 8 * (c % 4);
                    return k.create(d, b)
                }
            }, r = o.Utf8 = {
                stringify: function (a) {
                    try {
                        return decodeURIComponent(escape(q.stringify(a)))
                    } catch (b) {
                        throw Error("Malformed UTF-8 data");
                    }
                },
                parse: function (a) {
                    return q.parse(unescape(encodeURIComponent(a)))
                }
            }, b = f.BufferedBlockAlgorithm = l.extend({
                reset: function () {
                    this._data = k.create();
                    this._nDataBytes = 0
                },
                _append: function (a) {
                    "string" == typeof a && (a = r.parse(a));
                    this._data.concat(a);
                    this._nDataBytes += a.sigBytes
                },
                _process: function (a) {
                    var b = this._data,
                        d = b.words,
                        c = b.sigBytes,
                        e = this.blockSize,
                        g = c / (4 * e),
                        g = a ? h.ceil(g) : h.max((g | 0) - this._minBufferSize, 0),
                        a = g * e,
                        c = h.min(4 * a, c);
                    if (a) {
                        for (var f = 0; f < a; f += e) this._doProcessBlock(d, f);
                        f = d.splice(0, a);
                        b.sigBytes -= c
                    }
                    return k.create(f, c)
                },
                clone: function () {
                    var a = l.clone.call(this);
                    a._data = this._data.clone();
                    return a
                },
                _minBufferSize: 0
            });
        f.Hasher = b.extend({
            init: function () {
                this.reset()
            },
            reset: function () {
                b.reset.call(this);
                this._doReset()
            },
            update: function (a) {
                this._append(a);
                this._process();
                return this
            },
            finalize: function (a) {
                a && this._append(a);
                this._doFinalize();
                return this._hash
            },
            clone: function () {
                var a = b.clone.call(this);
                a._hash = this._hash.clone();
                return a
            },
            blockSize: 16,
            _createHelper: function (a) {
                return function (b, d) {
                    return a.create(d).finalize(b)
                }
            },
            _createHmacHelper: function (a) {
                return function (b, d) {
                    return g.HMAC.create(a, d).finalize(b)
                }
            }
        });
        var g = e.algo = {};
        return e
    }(Math);
(function (h) {
    var i = CryptoJS,
        e = i.lib,
        f = e.WordArray,
        e = e.Hasher,
        l = i.algo,
        k = [],
        o = [];
    (function () {
        function e(a) {
            for (var b = h.sqrt(a), d = 2; d <= b; d++)
                if (!(a % d)) return !1;
            return !0
        }

        function f(a) {
            return 4294967296 * (a - (a | 0)) | 0
        }
        for (var b = 2, g = 0; 64 > g;) e(b) && (8 > g && (k[g] = f(h.pow(b, 0.5))), o[g] = f(h.pow(b, 1 / 3)), g++), b++
    })();
    var m = [],
        l = l.SHA256 = e.extend({
            _doReset: function () {
                this._hash = f.create(k.slice(0))
            },
            _doProcessBlock: function (e, f) {
                for (var b = this._hash.words, g = b[0], a = b[1], j = b[2], d = b[3], c = b[4], h = b[5], l = b[6], k = b[7], n = 0; 64 >
                    n; n++) {
                    if (16 > n) m[n] = e[f + n] | 0;
                    else {
                        var i = m[n - 15],
                            p = m[n - 2];
                        m[n] = ((i << 25 | i >>> 7) ^ (i << 14 | i >>> 18) ^ i >>> 3) + m[n - 7] + ((p << 15 | p >>> 17) ^ (p << 13 | p >>> 19) ^ p >>> 10) + m[n - 16]
                    }
                    i = k + ((c << 26 | c >>> 6) ^ (c << 21 | c >>> 11) ^ (c << 7 | c >>> 25)) + (c & h ^ ~c & l) + o[n] + m[n];
                    p = ((g << 30 | g >>> 2) ^ (g << 19 | g >>> 13) ^ (g << 10 | g >>> 22)) + (g & a ^ g & j ^ a & j);
                    k = l;
                    l = h;
                    h = c;
                    c = d + i | 0;
                    d = j;
                    j = a;
                    a = g;
                    g = i + p | 0
                }
                b[0] = b[0] + g | 0;
                b[1] = b[1] + a | 0;
                b[2] = b[2] + j | 0;
                b[3] = b[3] + d | 0;
                b[4] = b[4] + c | 0;
                b[5] = b[5] + h | 0;
                b[6] = b[6] + l | 0;
                b[7] = b[7] + k | 0
            },
            _doFinalize: function () {
                var e = this._data,
                    f = e.words,
                    b = 8 * this._nDataBytes,
                    g = 8 * e.sigBytes;
                f[g >>> 5] |= 128 << 24 - g % 32;
                f[(g + 64 >>> 9 << 4) + 15] = b;
                e.sigBytes = 4 * f.length;
                this._process()
            }
        });
    i.SHA256 = e._createHelper(l);
    i.HmacSHA256 = e._createHmacHelper(l)
})(Math);
(function () {
    var h = CryptoJS,
        i = h.enc.Utf8;
    h.algo.HMAC = h.lib.Base.extend({
        init: function (e, f) {
            e = this._hasher = e.create();
            "string" == typeof f && (f = i.parse(f));
            var h = e.blockSize,
                k = 4 * h;
            f.sigBytes > k && (f = e.finalize(f));
            for (var o = this._oKey = f.clone(), m = this._iKey = f.clone(), q = o.words, r = m.words, b = 0; b < h; b++) q[b] ^= 1549556828, r[b] ^= 909522486;
            o.sigBytes = m.sigBytes = k;
            this.reset()
        },
        reset: function () {
            var e = this._hasher;
            e.reset();
            e.update(this._iKey)
        },
        update: function (e) {
            this._hasher.update(e);
            return this
        },
        finalize: function (e) {
            var f =
                this._hasher,
                e = f.finalize(e);
            f.reset();
            return f.finalize(this._oKey.clone().concat(e))
        }
    })
})();

//     CryptoJS v3.1.2
//     code.google.com/p/crypto-js
//     (c) 2009-2013 by Jeff Mott. All rights reserved.
//     code.google.com/p/crypto-js/wiki/License
//     http://crypto-js.googlecode.com/svn/tags/3.0.2/build/components/enc-base64.js

(function () {
    // Shortcuts
    var C = CryptoJS;
    var C_lib = C.lib;
    var WordArray = C_lib.WordArray;
    var C_enc = C.enc;

    /**
     * Base64 encoding strategy.
     */
    var Base64 = C_enc.Base64 = {
        /**
         * Converts a word array to a Base64 string.
         *
         * @param {WordArray} wordArray The word array.
         *
         * @return {string} The Base64 string.
         *
         * @static
         *
         * @example
         *
         *     var base64String = CryptoJS.enc.Base64.stringify(wordArray);
         */
        stringify: function (wordArray) {
            // Shortcuts
            var words = wordArray.words;
            var sigBytes = wordArray.sigBytes;
            var map = this._map;

            // Clamp excess bits
            wordArray.clamp();

            // Convert
            var base64Chars = [];
            for (var i = 0; i < sigBytes; i += 3) {
                var byte1 = (words[i >>> 2]       >>> (24 - (i % 4) * 8))       & 0xff;
                var byte2 = (words[(i + 1) >>> 2] >>> (24 - ((i + 1) % 4) * 8)) & 0xff;
                var byte3 = (words[(i + 2) >>> 2] >>> (24 - ((i + 2) % 4) * 8)) & 0xff;

                var triplet = (byte1 << 16) | (byte2 << 8) | byte3;

                for (var j = 0; (j < 4) && (i + j * 0.75 < sigBytes); j++) {
                    base64Chars.push(map.charAt((triplet >>> (6 * (3 - j))) & 0x3f));
                }
            }

            // Add padding
            var paddingChar = map.charAt(64);
            if (paddingChar) {
                while (base64Chars.length % 4) {
                    base64Chars.push(paddingChar);
                }
            }

            return base64Chars.join('');
        },

        /**
         * Converts a Base64 string to a word array.
         *
         * @param {string} base64Str The Base64 string.
         *
         * @return {WordArray} The word array.
         *
         * @static
         *
         * @example
         *
         *     var wordArray = CryptoJS.enc.Base64.parse(base64String);
         */
        parse: function (base64Str) {
            // Shortcuts
            var base64StrLength = base64Str.length;
            var map = this._map;

            // Ignore padding
            var paddingChar = map.charAt(64);
            if (paddingChar) {
                var paddingIndex = base64Str.indexOf(paddingChar);
                if (paddingIndex != -1) {
                    base64StrLength = paddingIndex;
                }
            }

            // Convert
            var words = [];
            var nBytes = 0;
            for (var i = 0; i < base64StrLength; i++) {
                if (i % 4) {
                    var bits1 = map.indexOf(base64Str.charAt(i - 1)) << ((i % 4) * 2);
                    var bits2 = map.indexOf(base64Str.charAt(i)) >>> (6 - (i % 4) * 2);
                    words[nBytes >>> 2] |= (bits1 | bits2) << (24 - (nBytes % 4) * 8);
                    nBytes++;
                }
            }

            return WordArray.create(words, nBytes);
        },

        _map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
    };
}());

//********************************************** NODE JS  XMLHttpRequest *********************************************************//


/**
 * Wrapper for built-in http.js to emulate the browser XMLHttpRequest object.
 *
 * This can be used with JS designed for browsers to improve reuse of code and
 * allow the use of existing libraries.
 *
 * Usage: include("XMLHttpRequest.js") and use XMLHttpRequest per W3C specs.
 *
 * @author Dan DeFelippi <dan@driverdan.com>
 * @contributor David Ellis <d.f.ellis@ieee.org>
 * @license MIT
 */

(function() {

  //Check nodejs environment or not
  if (typeof(exports) !== "undefined" && exports._) {
    var Url = require("url")
      , spawn = require("child_process").spawn
      , fs = require('fs');
      
    XMLHttpRequest = function() {
      /**
       * Private variables
       */
      var self = this;
      var http = require('http');
      var https = require('https');

      // Holds http.js objects
      var request;
      var response;

      // Request settings
      var settings = {};

      // Disable header blacklist.
      // Not part of XHR specs.
      var disableHeaderCheck = false;

      // Set some default headers
      var defaultHeaders = {
        "User-Agent": "node-XMLHttpRequest",
        "Accept": "*/*",
      };

      var headers = defaultHeaders;

      // These headers are not user setable.
      // The following are allowed but banned in the spec:
      // * user-agent
      var forbiddenRequestHeaders = [
        "accept-charset",
        "accept-encoding",
        "access-control-request-headers",
        "access-control-request-method",
        "connection",
        "content-length",
        "content-transfer-encoding",
        "cookie",
        "cookie2",
        "date",
        "expect",
        "host",
        "keep-alive",
        "origin",
        "referer",
        "te",
        "trailer",
        "transfer-encoding",
        "upgrade",
        "via"
      ];

      // These request methods are not allowed
      var forbiddenRequestMethods = [
        "TRACE",
        "TRACK",
        "CONNECT"
      ];

      // Send flag
      var sendFlag = false;
      // Error flag, used when errors occur or abort is called
      var errorFlag = false;

      // Event listeners
      var listeners = {};

      /**
       * Constants
       */

      this.UNSENT = 0;
      this.OPENED = 1;
      this.HEADERS_RECEIVED = 2;
      this.LOADING = 3;
      this.DONE = 4;

      /**
       * Public vars
       */

      // Current state
      this.readyState = this.UNSENT;

      // default ready state change handler in case one is not set or is set late
      this.onreadystatechange = null;

      // Result & response
      this.responseText = "";
      this.responseXML = "";
      this.status = null;
      this.statusText = null;

      /**
       * Private methods
       */

      /**
       * Check if the specified header is allowed.
       *
       * @param string header Header to validate
       * @return boolean False if not allowed, otherwise true
       */
      var isAllowedHttpHeader = function(header) {
        return disableHeaderCheck || (header && forbiddenRequestHeaders.indexOf(header.toLowerCase()) === -1);
      };

      /**
       * Check if the specified method is allowed.
       *
       * @param string method Request method to validate
       * @return boolean False if not allowed, otherwise true
       */
      var isAllowedHttpMethod = function(method) {
        return (method && forbiddenRequestMethods.indexOf(method) === -1);
      };

      /**
       * Public methods
       */

      /**
       * Open the connection. Currently supports local server requests.
       *
       * @param string method Connection method (eg GET, POST)
       * @param string url URL for the connection.
       * @param boolean async Asynchronous connection. Default is true.
       * @param string user Username for basic authentication (optional)
       * @param string password Password for basic authentication (optional)
       */
      this.open = function(method, url, async, user, password) {
        this.abort();
        errorFlag = false;

        // Check for valid request method
        if (!isAllowedHttpMethod(method)) {
          throw "SecurityError: Request method not allowed";
        }

        settings = {
          "method": method,
          "url": url.toString(),
          "async": (typeof async !== "boolean" ? true : async),
          "user": user || null,
          "password": password || null
        };

        setState(this.OPENED);
      };

      /**
       * Disables or enables isAllowedHttpHeader() check the request. Enabled by default.
       * This does not conform to the W3C spec.
       *
       * @param boolean state Enable or disable header checking.
       */
      this.setDisableHeaderCheck = function(state) {
        disableHeaderCheck = state;
      };

      /**
       * Sets a header for the request.
       *
       * @param string header Header name
       * @param string value Header value
       */
      this.setRequestHeader = function(header, value) {
        if (this.readyState != this.OPENED) {
          throw "INVALID_STATE_ERR: setRequestHeader can only be called when state is OPEN";
        }
        if (!isAllowedHttpHeader(header)) {
          console.warn('Refused to set unsafe header "' + header + '"');
          return;
        }
        if (sendFlag) {
          throw "INVALID_STATE_ERR: send flag is true";
        }
        headers[header] = value;
      };

      /**
       * Gets a header from the server response.
       *
       * @param string header Name of header to get.
       * @return string Text of the header or null if it doesn't exist.
       */
      this.getResponseHeader = function(header) {
        if (typeof header === "string"
          && this.readyState > this.OPENED
          && response
          && response.headers
          && response.headers[header.toLowerCase()]
          && !errorFlag
        ) {
          return response.headers[header.toLowerCase()];
        }

        return null;
      };

      /**
       * Gets all the response headers.
       *
       * @return string A string with all response headers separated by CR+LF
       */
      this.getAllResponseHeaders = function() {
        if (this.readyState < this.HEADERS_RECEIVED || errorFlag) {
          return "";
        }
        var result = "";

        for (var i in response.headers) {
          // Cookie headers are excluded
          if (i !== "set-cookie" && i !== "set-cookie2") {
            result += i + ": " + response.headers[i] + "\r\n";
          }
        }
        return result.substr(0, result.length - 2);
      };

      /**
       * Gets a request header
       *
       * @param string name Name of header to get
       * @return string Returns the request header or empty string if not set
       */
      this.getRequestHeader = function(name) {
        // @TODO Make this case insensitive
        if (typeof name === "string" && headers[name]) {
          return headers[name];
        }

        return "";
      };

      /**
       * Sends the request to the server.
       *
       * @param string data Optional data to send as request body.
       */
      this.send = function(data) {
        if (this.readyState != this.OPENED) {
          throw "INVALID_STATE_ERR: connection must be opened before send() is called";
        }

        if (sendFlag) {
          throw "INVALID_STATE_ERR: send has already been called";
        }

        var ssl = false, local = false, formData = false;
        var url = Url.parse(settings.url);
        var host;
        // Determine the server
        switch (url.protocol) {
          case 'https:':
            ssl = true;
            // SSL & non-SSL both need host, no break here.
          case 'http:':
            host = url.hostname;
            break;

          case 'file:':
            local = true;
            break;

          case undefined:
          case '':
            host = "localhost";
            break;

          default:
            throw "Protocol not supported.";
        }

        // Load files off the local filesystem (file://)
        if (local) {
          if (settings.method !== "GET") {
            throw "XMLHttpRequest: Only GET method is supported";
          }

          if (settings.async) {
            fs.readFile(url.pathname, 'utf8', function(error, data) {
              if (error) {
                self.handleError(error);
              } else {
                self.status = 200;
                self.responseText = data;
                setState(self.DONE);
              }
            });
          } else {
            try {
              this.responseText = fs.readFileSync(url.pathname, 'utf8');
              this.status = 200;
              setState(self.DONE);
            } catch(e) {
              this.handleError(e);
            }
          }

          return;
        }

        // Default to port 80. If accessing localhost on another port be sure
        // to use http://localhost:port/path
        var port = url.port || (ssl ? 443 : 80);
        // Add query string if one is used
        var uri = url.pathname + (url.search ? url.search : '');

        // Set the Host header or the server may reject the request
        headers["Host"] = host;
        if (!((ssl && port === 443) || port === 80)) {
          headers["Host"] += ':' + url.port;
        }

        // Set Basic Auth if necessary
        if (settings.user) {
          if (typeof settings.password == "undefined") {
            settings.password = "";
          }
          var authBuf = new Buffer(settings.user + ":" + settings.password);
          headers["Authorization"] = "Basic " + authBuf.toString("base64");
        }

        // Determine whether data is FormData
        formData = data && data.pipe && data.getHeaders && data.getLengthSync;

        // Set content length header
        if (settings.method === "GET" || settings.method === "HEAD") {
          data = null;
        } else if (formData) {
          headers["Content-Length"] = data.getLengthSync();
          headers["Content-Type"] = data.getHeaders()["content-type"];
        } else if (data) {
          headers["Content-Length"] = Buffer.isBuffer(data) ? data.length : Buffer.byteLength(data);

          if (!headers["Content-Type"]) {
            headers["Content-Type"] = "text/plain;charset=UTF-8";
          }
        } else if (settings.method === "POST") {
          // For a post with no data set Content-Length: 0.
          // This is required by buggy servers that don't meet the specs.
          headers["Content-Length"] = 0;
        }

        var options = {
          host: host,
          port: port,
          path: uri,
          method: settings.method,
          headers: headers,
          agent: false
        };

        // Reset error flag
        errorFlag = false;

        // Handle async requests
        if (settings.async) {
          // Use the proper protocol
          var doRequest = ssl ? https.request : http.request;

          // Request is being sent, set send flag
          sendFlag = true;

          // As per spec, this is called here for historical reasons.
          self.dispatchEvent("readystatechange");

          // Handler for the response
          function responseHandler(resp) {
            // Set response var to the response we got back
            // This is so it remains accessable outside this scope
            response = resp;
            // Check for redirect
            // @TODO Prevent looped redirects
            if (response.statusCode === 301 || response.statusCode === 302 || response.statusCode === 303 || response.statusCode === 307) {
              // Change URL to the redirect location
              settings.url = response.headers.location;
              var url = Url.parse(settings.url);
              // Set host var in case it's used later
              host = url.hostname;
              // Options for the new request
              var newOptions = {
                hostname: url.hostname,
                port: url.port,
                path: url.path,
                method: response.statusCode === 303 ? 'GET' : settings.method,
                headers: headers
              };

              // Issue the new request
              request = doRequest(newOptions, responseHandler).on('error', errorHandler);
              request.end();
              // @TODO Check if an XHR event needs to be fired here
              return;
            }

            response.setEncoding("utf8");

            setState(self.HEADERS_RECEIVED);
            self.status = response.statusCode;

            response.on('data', function(chunk) {
              // Make sure there's some data
              if (chunk) {
                self.responseText += chunk;
              }
              // Don't emit state changes if the connection has been aborted.
              if (sendFlag) {
                setState(self.LOADING);
              }
            });

            response.on('end', function() {
              if (sendFlag) {
                // Discard the 'end' event if the connection has been aborted
                setState(self.DONE);
                sendFlag = false;
              }
            });

            response.on('error', function(error) {
              self.handleError(error);
            });
          }

          // Error handler for the request
          function errorHandler(error) {
            self.handleError(error);
          }

          // Create the request
          request = doRequest(options, responseHandler).on('error', errorHandler);

          // Node 0.4 and later won't accept empty data. Make sure it's needed.
          if (formData) {
            data.pipe(request);
          } else if (data) {
            request.write(data);
          }

          request.end();

          self.dispatchEvent("loadstart");
        } else { // Synchronous
          // Create a temporary file for communication with the other Node process
          var contentFile = ".node-xmlhttprequest-content-" + process.pid;
          var syncFile = ".node-xmlhttprequest-sync-" + process.pid;
          fs.writeFileSync(syncFile, "", "utf8");
          // The async request the other Node process executes
          var execString = "var http = require('http'), https = require('https'), fs = require('fs');"
            + "var doRequest = http" + (ssl ? "s" : "") + ".request;"
            + "var options = " + JSON.stringify(options) + ";"
            + "var responseText = '';"
            + "var req = doRequest(options, function(response) {"
            + "response.setEncoding('utf8');"
            + "response.on('data', function(chunk) {"
            + "  responseText += chunk;"
            + "});"
            + "response.on('end', function() {"
            + "fs.writeFileSync('" + contentFile + "', 'NODE-XMLHTTPREQUEST-STATUS:' + response.statusCode + ',' + responseText, 'utf8');"
            + "fs.unlinkSync('" + syncFile + "');"
            + "});"
            + "response.on('error', function(error) {"
            + "fs.writeFileSync('" + contentFile + "', 'NODE-XMLHTTPREQUEST-ERROR:' + JSON.stringify(error), 'utf8');"
            + "fs.unlinkSync('" + syncFile + "');"
            + "});"
            + "}).on('error', function(error) {"
            + "fs.writeFileSync('" + contentFile + "', 'NODE-XMLHTTPREQUEST-ERROR:' + JSON.stringify(error), 'utf8');"
            + "fs.unlinkSync('" + syncFile + "');"
            + "});"
            + (data ? "req.write('" + JSON.stringify(data).slice(1,-1).replace(/'/g, "\\'") + "');":"")
            + "req.end();";
          // Start the other Node Process, executing this string
          var syncProc = spawn(process.argv[0], ["-e", execString]);
          var statusText;
          while(fs.existsSync(syncFile)) {
            // Wait while the sync file is empty
          }
          self.responseText = fs.readFileSync(contentFile, 'utf8');
          // Kill the child process once the file has data
          syncProc.stdin.end();
          // Remove the temporary file
          fs.unlinkSync(contentFile);
          if (self.responseText.match(/^NODE-XMLHTTPREQUEST-ERROR:/)) {
            // If the file returned an error, handle it
            var errorObj = self.responseText.replace(/^NODE-XMLHTTPREQUEST-ERROR:/, "");
            self.handleError(errorObj);
          } else {
            // If the file returned okay, parse its data and move to the DONE state
            self.status = parseInt(self.responseText.replace(/^NODE-XMLHTTPREQUEST-STATUS:([0-9]*),.*/, "$1"), 10);
            self.responseText = self.responseText.replace(/^NODE-XMLHTTPREQUEST-STATUS:[0-9]*,(.*)/, "$1");
            setState(self.DONE);
          }
        }
      };

      /**
       * Called when an error is encountered to deal with it.
       */
      this.handleError = function(error) {
        this.status = 503;
        this.statusText = error;
        this.responseText = error.stack;
        errorFlag = true;
        setState(this.DONE);
      };

      /**
       * Aborts a request.
       */
      this.abort = function() {
        if (request) {
          request.abort();
          request = null;
        }

        headers = defaultHeaders;
        this.responseText = "";
        this.responseXML = "";

        errorFlag = true;

        if (this.readyState !== this.UNSENT
            && (this.readyState !== this.OPENED || sendFlag)
            && this.readyState !== this.DONE) {
          sendFlag = false;
          setState(this.DONE);
        }
        this.readyState = this.UNSENT;
      };

      /**
       * Adds an event listener. Preferred method of binding to events.
       */
      this.addEventListener = function(event, callback) {
        if (!(event in listeners)) {
          listeners[event] = [];
        }
        // Currently allows duplicate callbacks. Should it?
        listeners[event].push(callback);
      };

      /**
       * Remove an event callback that has already been bound.
       * Only works on the matching funciton, cannot be a copy.
       */
      this.removeEventListener = function(event, callback) {
        if (event in listeners) {
          // Filter will return a new array with the callback removed
          listeners[event] = listeners[event].filter(function(ev) {
            return ev !== callback;
          });
        }
      };

      /**
       * Dispatch any events, including both "on" methods and events attached using addEventListener.
       */
      this.dispatchEvent = function(event) {
        if (typeof self["on" + event] === "function") {
          self["on" + event]();
        }
        if (event in listeners) {
          for (var i = 0, len = listeners[event].length; i < len; i++) {
            listeners[event][i].call(self);
          }
        }
      };

      /**
       * Changes readyState and calls onreadystatechange.
       *
       * @param int state New state
       */
      var setState = function(state) {
        if (state == self.LOADING || self.readyState !== state) {
          self.readyState = state;

          if (settings.async || self.readyState < self.OPENED || self.readyState === self.DONE) {
            self.dispatchEvent("readystatechange");
          }

          if (self.readyState === self.DONE && !errorFlag) {
            self.dispatchEvent("load");
            // @TODO figure out InspectorInstrumentation::didLoadXHR(cookie)
            self.dispatchEvent("loadend");
          }
        }
      };
    };
  }

}).call(this);

/************************************************* NCMB main class ********************************************/

(function(root) {
  root.NCMB = root.NCMB || {};
  /**
   * NCMBクラスとメソッドを定義する。
   * @name NCMB
   * @namespace すべてのNCMBクラスとメソッドを定義する。
   *
   */
  var NCMB = root.NCMB;
  
  // Import NCMB's local copy of underscore.
  if (typeof(exports) !== "undefined" && exports._) {
    // We're running in Node.js.  Pull in the dependencies.
    if (typeof window === "undefined") {
      NCMB._ = exports._.noConflict();
      NCMB.localStorage = require('localStorage');
      NCMB.XMLHttpRequest = XMLHttpRequest;
      FormData = require('form-data'); //to upload multipart form for FileUpload
      exports.NCMB = NCMB;
    }
  } else {
    
    NCMB._ = _.noConflict();
    if (typeof(localStorage) !== "undefined") {
      NCMB.localStorage = localStorage;
    }
    if (typeof(XMLHttpRequest) !== "undefined") {
      NCMB.XMLHttpRequest = XMLHttpRequest;
    }
    //add to test upload file in monaca
    if (window.cordova) {
      delete File; // Avoid conflict with PhoneGap File API
    }
  }

  // jQuery か Zepto　は生成された場合、参照を取得する
  if (typeof($) !== "undefined") {
    NCMB.$ = $;
  }
  
  // 空のクラスのコンストラクター、プロトタイプチェイン作成を補助するため。
  var EmptyConstructor = function() {};

  // サブクラスのプロトタイプチェインを設定するためのヘルパーサービス。
  // `goog.inherits`と似ており、プロトタイプとクラスの属性のハッシュを使って、エクステンドさせる。
  var inherits = function(parent, protoProps, staticProps) {
    var child;

    // 新しいクラスのコンストラクター関数は自分で定義する（`extend`の定義で定義さする"constructor"属性）か、
    // デフォルトとして親のコンストラクターを実行させる。
    if (protoProps && protoProps.hasOwnProperty('constructor')) {
      child = protoProps.constructor;
    } else {
      /** @ignore */
      child = function(){ parent.apply(this, arguments); };
    }

    // Inherit class (static) properties from parent.
    NCMB._.extend(child, parent);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    EmptyConstructor.prototype = parent.prototype;
    child.prototype = new EmptyConstructor();

    // Add prototype properties (instance properties) to the subclass,
    // if supplied.
    if (protoProps) {
      NCMB._.extend(child.prototype, protoProps);
    }

    // Add static properties to the constructor function, if supplied.
    if (staticProps) {
      NCMB._.extend(child, staticProps);
    }

    // Correctly set child's `prototype.constructor`.
    child.prototype.constructor = child;

    // Set a convenience property in case the parent's prototype is
    // needed later.
    child.__super__ = parent.prototype;

    return child;
  };

  // Set the server for NCMB to talk to. //APIサーバーURL設定
  NCMB.serverURL = "https://mb.api.cloud.nifty.com/2013-09-01/";  

  /**
   * 認証トークンを設定する。コントロールパネルから認証キーを取得してください。
   * @param {String} applicationKey アプリケーションキー。
   * @param {String} clientKey 　クライントキー。
   */
  NCMB.initialize = function(applicationKey, clientKey) {
    NCMB._initialize(applicationKey, clientKey);
  };

  /**
   * アプリケーションキーとクライントキーを設定するため、実装する。プライベートで利用する。
   * @param {String} applicationKey NCMBのアプリケーションキー
   * @param {String} clientKey NCMBのクライントキー
   */
  NCMB._initialize = function(applicationKey, clientKey) {
    NCMB.applicationKey = applicationKey;
    NCMB.clientKey = clientKey;
  };

  /**
   * レスポンスが改ざんされていないか判定する機能を有効にする<br>
   * デフォルトは無効です
   * 
   * @param checkFlag true:有効
   *                  false:無効
   */
  
  NCMB.enableResponseValidation = function(checkFlag) {
    NCMB.responseValidationFlag = checkFlag;
  };
  
  
  //Setting default value for responseValidationFlag
  NCMB.responseValidationFlag = false;

  /**
   * Local storage　ローカルストレージ利用のため
   * NCMBのインスタンスのローカルストレージのプリフィクスprefixを取得。
   * @param {String} path 相対的の拡張子のパス。nullかundefinedの場合、空文字列として扱う。
   *     
   * @return {String} キーのフルの名前。
   */
  NCMB._getNCMBPath = function(path) {
    if (!NCMB.applicationKey) {
      throw "You need to call NCMB.initialize before using NCMB.";
    }
    if (!path) {
      path = "";
    }
    if (!NCMB._.isString(path)) {
      throw "Tried to get a localStorage path that wasn't a String.";
    }
    if (path[0] === "/") {
      path = path.substring(1);
    }
    return "NCMB/" + NCMB.applicationKey + "/" + path;
  };

  //　UTC文字列からデートオブジェクトを作成
  NCMB._NCMBDate = function(utcString) {
    var regexp = new RegExp(
      "^([0-9]{1,4})-([0-9]{1,2})-([0-9]{1,2})" + "T" +
      "([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2})" +
      "(.([0-9]+))?" + "Z$");

    var match = regexp.exec(utcString); 
    if (!match) {
      return null;
    }
    var year = match[1] || 0;
    var month = (match[2] || 1) - 1;  
    var day = match[3] || 0;
    var hour = match[4] || 0;
    var minute = match[5] || 0;
    var second = match[6] || 0;
    var milli = match[8] || 0;
    return new Date(Date.UTC(year, month, day, hour, minute, second, milli));
  };

  //アプリケーションキー、クライアントキー、タイムスタンプアクセス用のシグネチャーを作成し取得
  NCMB._createSignature = function(route, className, objectId, url, method, timestamp, responseData){
    var signature = "";
    var _applicationKey = NCMB.applicationKey;
    var _timestamp = timestamp;
    var _clientKey = NCMB.clientKey;

    var _method = method;
    var _url = url;
    var _tmp = _url.substring(_url.lastIndexOf("//") + 2);
    var _fqdn = _tmp.substring(0, _tmp.indexOf("/"));  
 
    var _position = _url.indexOf("?");
    var _path = "";
    var _data = {};

    if(_position == -1) {
      _path =  _url.substring(_url.lastIndexOf(_fqdn) + _fqdn.length );
    }
    else{
      var _get_parameter= _url.substring(_position + 1);
      _path = _url.substring(_url.lastIndexOf(_fqdn) + _fqdn.length, _position);
      _tmp = _get_parameter.split("&");
      for (var i = 0; i < _tmp.length; i++) {
      _position = _tmp[i].indexOf("=");
      _data[_tmp[i].substring(0 , _position)] = _tmp[i].substring(_position + 1);
      }
    }
    _data["SignatureMethod"] = "HmacSHA256";
    _data["SignatureVersion"] = "2";
    _data["X-NCMB-Application-Key"] = _applicationKey;
    _data["X-NCMB-Timestamp"] = _timestamp;

    var _sorted_data = {};
    var keys = [];
    var k, i, len;
    for (k in _data)
    {
      if (_data.hasOwnProperty(k))
      {
        keys.push(k);
      }
    }
    keys.sort();
    len = keys.length;
    for (i = 0; i < len; i++)
    {
      k = keys[i];
      _sorted_data[k] = _data[k];
    }
    var parameterString = "";
    for (k in _sorted_data)
    {
      if (_sorted_data.hasOwnProperty(k))
      {
        if (parameterString != "") {
          parameterString += "&";
        };
        parameterString = parameterString + k + "=" + _sorted_data[k]; 
      }
    }
    var forEncodeString = _method + "\n" + _fqdn + "\n" + _path + "\n" + parameterString;
    // Add for create signature for responseData
    if (responseData != null) {
      forEncodeString = forEncodeString + "\n" + responseData;
    }
    var hash = CryptoJS.HmacSHA256(forEncodeString, _clientKey);
    var signature = CryptoJS.enc.Base64.stringify(hash);       
    return signature;
  }

  //check response signature 
  NCMB._checkResponseSignature = function(resSignature, route, className, objectId, url, method, timestamp, responseData) {
     //create signature from response
     if (JSON.stringify(responseData) != "{}" ) {
       var resSignatureRecalculate = NCMB._createSignature(route, className, objectId, url, method, timestamp,  unescape(JSON.stringify(responseData)));
     } else {
       var resSignatureRecalculate = NCMB._createSignature(route, className, objectId, url, method, timestamp,  null);
     }
     if ((resSignatureRecalculate != null) && (resSignatureRecalculate != resSignature))
      return false;
     else 
      return true;
  }

  // AJAX リクエストを処理するための関数 
  NCMB._ajax = function(route, className, method, url, data, signature, timestamp, success, error) {
    var options = {
      success: success,
      error: error
    };

    var promise = new NCMB.Promise();
    var handled = false;

    var xhr = new NCMB.XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (handled) {
          return;
        }
        handled = true;
        if (xhr.status >= 200 && xhr.status < 300) {
          var response;
          try {
            if (xhr.responseText) {
              if (route != "files" || method != "GET" ||  className == null) { // check the situtation ファイル収得
                response = JSON.parse(xhr.responseText);
              } else {
                response = xhr.responseText;
              }
            } 
            else {
              response = {};
            }
          } catch (e) {
            promise.reject(e);
          }
          if (response) {
            promise.resolve(response, xhr.status, xhr);
          }
        } else {
          promise.reject(xhr);
        }
      }
    };
    xhr.open(method, url, true); 
    //get file situation
    if (route == "files" && method == "GET" &&  className != null) {
       xhr.overrideMimeType('text/plain; charset=x-user-defined');
    }    
    xhr.setRequestHeader("X-NCMB-Application-Key", NCMB.applicationKey );
    xhr.setRequestHeader("X-NCMB-Timestamp", timestamp);
    xhr.setRequestHeader("X-NCMB-Signature", signature);  
    var sdk_info = "javascript-" + NCMB.VERSION; 
    xhr.setRequestHeader("X-NCMB-SDK-Version", sdk_info); //Custom header for Javascript Request //x-ncmb-sdk-version

    //check if session token is exist or not
    var _requestCurrentUser = NCMB.User.current();
    if(_requestCurrentUser) {
      var _requestSessionToken  = _requestCurrentUser._sessionToken;      
      //set to header
      xhr.setRequestHeader("X-NCMB-Apps-Session-Token", _requestSessionToken);  
    }      

    //Fileの場合の設定
    if( route == "files" && method == "POST" ) {
      var formData = new FormData();
      formData.append("file", data.file);
      formData.append("acl", data.acl);
      xhr.send(formData);
    } else {
      //そのほかの場合
      data = JSON.stringify(data); 
      xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");  // avoid pre-flight. 
      xhr.send(data);
    }

    return promise._thenRunCallbacks(options);
  };

  // A self-propagating extend function.
  NCMB._extend = function(protoProps, classProps) {
    var child = inherits(this, protoProps, classProps);
    child.extend = this.extend;
    return child;
  };

  /**
   * route　はclasses, users, loginなどAPIのURLに応じて設定
   * objectId　はオブジェクトID
   * method REST APIの HTTPのメソッド（GET/POST/PUT）
   * dataObject　はデーターオブジェクトかnullのオブジェクト。
   * @ignore
   */
  NCMB._request = function(route, className, objectId, method, dataObject) {
    if (!NCMB.applicationKey) {
      throw "You must specify your applicationKey using NCMB.initialize";
    }

    if ( !NCMB.clientKey ) {
      throw "You must specify a key using NCMB.initialize";
    }

    //Process route of file/user/push/installation class
    if(className == "file" && route == "classes"){
      route = "files";
      className = null;
    }

    if(className == "user" && route == "classes"){
      route = "users";
      className = null;
    }
 
    if(className == "push" && route == "classes"){
      route = "push";
      className = null;
    }

    if(className == "role" && route == "classes"){
      route = "roles";
      className = null;
    }

    if(className == "installation" && route == "classes"){
      route = "installations";
      className = null;
    }

    //Check route
    if (route !== "classes" &&
        route !== "batch" &&
        route !== "users" &&
        route !== "files" &&
        route !== "requestPasswordReset" &&
        route !== "requestMailAddressUserEntry" &&        
        route !== "mailAddressConfirm" &&
        route !== "login" &&
        route !== "logout" &&
        route !== "push" &&
        route !== "roles" &&
        route !== "installations"
        ) {
      throw "Bad route: '" + route + "'.";
    }

    var url = NCMB.serverURL;
    
    if (url.charAt(url.length - 1) !== "/") {
      url += "/";
    }
    url += route;
    if (className) {
      url += "/" + encodeURI(className);
    }
    if (objectId) {
      url += "/" + objectId;
    }


    //where, include, order, skip, count, limitの処理 (json data to inUrl parameter)
    if(dataObject){
      if(dataObject["where"] || dataObject["include"] || dataObject["order"] || dataObject["skip"] || dataObject["count"] || dataObject["limit"] ) {
        url += "?";
      } 

      if(route == "login") {
        if(dataObject["userName"] || dataObject["password"] || dataObject["mailAddress"]) {
          url += "?";
        }        
      }

      if(dataObject["where"]) {
        if (url.charAt(url.length - 1) == '?') {
          url += "where=" + encodeURIComponent(JSON.stringify(dataObject["where"]));
        } else {
          url += "&where=" + encodeURIComponent(JSON.stringify(dataObject["where"]));
        }
        delete dataObject["where"];
      }

      if(dataObject["include"]) {
        if (url.charAt(url.length - 1) == '?') {
          url += "include=" + dataObject["include"];          
        } else {
          url += "&include=" + dataObject["include"];
        }
        delete dataObject["include"];
      }

      if(dataObject["order"]) {
        if (url.charAt(url.length - 1) == '?') {
          url += "order=" + dataObject["order"];
        } else {
          url += "&order=" + dataObject["order"];
        }
        delete dataObject["order"];
      }

      if(dataObject["skip"]) {
        if (url.charAt(url.length - 1) == '?') {
          url += "skip=" + JSON.stringify(dataObject["skip"]);
        } else {
          url += "&skip=" + JSON.stringify(dataObject["skip"]);
        }
        delete dataObject["skip"];
      }

      if(dataObject["count"]) {
        if (url.charAt(url.length - 1) == '?') {
          url += "count=" + JSON.stringify(dataObject["count"]);
        } else {
          url += "&count=" + JSON.stringify(dataObject["count"]);
        }
        delete dataObject["count"];
      }

      if(dataObject["limit"]) {
        if (url.charAt(url.length - 1) == "?") {
          url += "limit=" + JSON.stringify(dataObject["limit"]);
        } else {
          url += "&limit=" + JSON.stringify(dataObject["limit"]);
        }
        delete dataObject["limit"];
      }

      if(route == "login") {
        if(dataObject["userName"]) {
          if (url.charAt(url.length - 1) == "?") {
            url += "userName=" + encodeURIComponent(dataObject["userName"]);
          } else {
            url += "&userName=" + encodeURIComponent(dataObject["userName"]);
          }
          delete dataObject["userName"];
        }

        if(dataObject["password"]) {
          if (url.charAt(url.length - 1) == "?") {
            url += "password=" + encodeURIComponent(dataObject["password"]);
          } else {
            url += "&password=" + encodeURIComponent(dataObject["password"]);
          }
          delete dataObject["password"];
        }   

        if(dataObject["mailAddress"]) {
          if (url.charAt(url.length - 1) == "?") {
            url += "mailAddress=" + encodeURIComponent(dataObject["mailAddress"]);
          } else {
            url += "&mailAddress=" + encodeURIComponent(dataObject["mailAddress"]);
          }
          delete dataObject["mailAddress"];
        }        
      }
    }
    var now = new Date();
    //Function to check and correct the compatibility of toISOString
    if ( !Date.prototype.toISOString ) {
      ( function() {
        function pad(number) {
          var r = String(number);
          if ( r.length === 1 ) {
            r = '0' + r;
          }
          return r;
        }
        Date.prototype.toISOString = function() {
          return this.getUTCFullYear()
            + '-' + pad( this.getUTCMonth() + 1 )
            + '-' + pad( this.getUTCDate() )
            + 'T' + pad( this.getUTCHours() )
            + ':' + pad( this.getUTCMinutes() )
            + ':' + pad( this.getUTCSeconds() )
            + '.' + String( (this.getUTCMilliseconds()/1000).toFixed(3) ).slice( 2, 5 )
            + 'Z';
        };
      
      }() );
    }
    var timestring = now.toISOString();
    while (timestring.indexOf(":") > -1) {
      timestring = timestring.replace(":","%3A");
    }
    var timestamp = timestring;
    //create signature, pass to _ajax()
    signature = NCMB._createSignature(route, className, objectId, url, method, timestamp, null);
    var data = dataObject;
    return NCMB._ajax(route, className, method, url, data, signature, timestamp).then(
      function(response, status , xhr) {
        //check Response Signature 
        //check Flag
        if (NCMB.responseValidationFlag) {
            //check special request
            var resSignature = xhr.getResponseHeader("X-NCMB-Response-Signature");
            if (typeof(resSignature) != "undefined" && resSignature != null && NCMB.enableResponseValidation) {
              //signature check 
              if (NCMB._checkResponseSignature(resSignature, route, className, objectId, url, method, timestamp, response)) {
                 //do nothing
              } else {
                //return error and message
                var error = new NCMB.Error("E100001", "Authentication error by response signature incorrect.");
                return NCMB.Promise.error(error);
              }
            }   
        }
        return NCMB.Promise.as(response, status, xhr);// in normal case
      },
      function(response, status ) { //response => xhr which is returned only
        // Transform the error into an instance of NCMB.Error by trying to NCMB
        // the error string as JSON.
        var error;
        if (response && response.responseText) {
          try {
            var errorJSON = JSON.parse(response.responseText);
            if (errorJSON) {
              error = new NCMB.Error(errorJSON.code, errorJSON.error);
            }
          } catch (e) {
            // If we fail to NCMB the error text, that's okay.
          }
        }
        error = error || new NCMB.Error(-1, response.responseText); 
        //check Response Signature ★
        //check Flag
        if (NCMB.responseValidationFlag) {
          //check special request
          //if error and error code equals: E404002, E405001, E415001
          if (!((error) && (error.code) && (error.code == "E404002") && (error.code == "E405001") && (error.code == "E415001"))) {
            var resSignature = response.getResponseHeader("X-NCMB-Response-Signature");
            if (typeof(resSignature) != "undefined" && resSignature != null && NCMB.enableResponseValidation) {
              //signature check 
              if (NCMB._checkResponseSignature(resSignature, route, className, objectId, url, method, timestamp, JSON.parse(response.responseText))) {
                 //do nothing
              } else {
                //return error and message
                error.code = "E100001";
                error.message = "Authentication error by response signature incorrect.";
              }
              //if error -> return the response text, change the code ...
            }   
          }
        }

        //Authentication header error
        var _requestCurrentUser = NCMB.User.current();
        if (error.code == "E401001") {
          if (_requestCurrentUser) {
            if (_requestCurrentUser._sessionToken) {
              NCMB.User.logOut();
            }            
          }
        }

        // By explicitly returning a rejected Promise, this will work with
        // either jQuery or Promises/A semantics.
        return NCMB.Promise.error(error);
    });
  };

  // Backbonejs 対応するため、Backboneオブジェクトの属性か関数の値を取得するHelper関数

  NCMB._getValue = function(object, prop) {
    if (!(object && object[prop])) {
      return null;
    }
    return NCMB._.isFunction(object[prop]) ? object[prop]() : object[prop];
  };

  /**
   * 
   * NCMBオブジェクトの値を適切な表式を変換する関数。
   * seenObjectsが不正の場合、JavaのNCMB.maybeReferenceAndEncode(Object)と同等であり、適切な表式に変換する。
   * そのほかの場合、seenObjectに含まらないNCMB.Objectは、ポインタとしてエンコードされるより、
   * 完全に組み込まれる。この配列は無限ループを防ぐため、使われている。
   *
   */
  NCMB._encode = function(value, seenObjects, disallowObjects) {
    var _ = NCMB._;
    if (value instanceof NCMB.Object) {
      if (disallowObjects) {
        throw "NCMB.Objects not allowed here";
      }
      if (!seenObjects || _.include(seenObjects, value) || !value._hasData) {
        return value._toPointer();
      }
      if (!value.dirty()) {
        seenObjects = seenObjects.concat(value);
        return NCMB._encode(value._toFullJSON(seenObjects),
                             seenObjects,
                             disallowObjects);
      }
      throw "Tried to save an object with a pointer to a new, unsaved object.";
    }
    if (value instanceof NCMB.ACL) {
      return value.toJSON();
    }

    if (value instanceof NCMB.GeoPoint) {
      return value.toJSON();
    }

    if (_.isDate(value)) {
      return { "__type": "Date", "iso": value.toJSON() };
    }
    if (_.isArray(value)) {
      return _.map(value, function(x) {
        return NCMB._encode(x, seenObjects, disallowObjects);
      });
    }
    if (_.isRegExp(value)) {
      return value.source;
    }
    if (value instanceof NCMB.Relation) {
      return value.toJSON();
    }
    if (value instanceof NCMB.Op) {
      return value.toJSON();
    }
    if (value instanceof NCMB.File) {
      if (!value.url()) {
        throw "Tried to save an object containing an unsaved file.";
      }
      return {
        __type: "File",
        name: value.name(),
        url: value.url()
      };
    }
    if (_.isObject(value)) {
      var output = {};
      NCMB._objectEach(value, function(v, k) {
        output[k] = NCMB._encode(v, seenObjects, disallowObjects);
      });
      return output;
    }
    return value; 
  };

  /**
   * NCMB._encodeの逆関数である。
   * TODO: make decode not mutate value.
   */
  NCMB._decode = function(key, value) {
    var _ = NCMB._;
    if (key == "authData") {  //認証するためのデーター
      return value;
    }
    if (!_.isObject(value)) {
      return value;
    }
    if (_.isArray(value)) {
      NCMB._arrayEach(value, function(v, k) {
        value[k] = NCMB._decode(k, v);
      });
      return value;
    }
    if (value instanceof NCMB.Object) {
      return value;
    }
    if (value instanceof NCMB.File) {
      return value;
    }

    if (value instanceof NCMB.Op) {
      return value;
    }
    if (value.__op) {
      return NCMB.Op._decode(value);
    }
    if (value.__type === "Pointer") {
      var pointer = NCMB.Object._create(value.className);
      pointer._finishFetch({ objectId: value.objectId }, false);
      return pointer;
    }
    if (value.__type === "Object") {
      // It's an Object included in a query result.
      var className = value.className;
      delete value.__type;
      delete value.className;
      var object = NCMB.Object._create(className);
      object._finishFetch(value, true);
      return object;
    }
    if (value.__type === "Date") {
      return NCMB._NCMBDate(value.iso);
    }

    if (value.__type === "GeoPoint") {
      return new NCMB.GeoPoint({
        latitude: value.latitude,
        longitude: value.longitude
      });
    }

    if (key === "ACL") {
      if (value instanceof NCMB.ACL) {
        return value;
      }
      return new NCMB.ACL(value);
    }
    if (value.__type === "Relation") {
      var relation = new NCMB.Relation(null, key);
      relation.targetClassName = value.className;
      return relation;
    }
    if (value.__type === "File") {
      var file = new NCMB.File(value.name);
      file._url = value.url;
      return file;
    }
    NCMB._objectEach(value, function(v, k) {
      value[k] = NCMB._decode(k, v);
    });
    return value;
  };

  NCMB._arrayEach = NCMB._.each;

  /**
   * オブジェクトobjectの中の項目を取得し、func関数を実行させる。
   * @param {Object} object The object or array to traverse deeply.取得するためのオブジェクトか配列
   * @param {Function} それぞれ項目で実行させるfunc 関数。実行した結果は正確の値であれば、
   *                   その結果を現在の親コンテイナの項目に切り替える。
   * @returns {} object自体で実行した結果を取得
   */
  NCMB._traverse = function(object, func, seen) {
    if (object instanceof NCMB.Object) {
      seen = seen || [];
      if (NCMB._.indexOf(seen, object) >= 0) {
        // We've already visited this object in this call.
        return;
      }
      seen.push(object);
      NCMB._traverse(object.attributes, func, seen);
      return func(object);
    }
    if (object instanceof NCMB.Relation || object instanceof NCMB.File) {
      // Nothing needs to be done, but we don't want to recurse into the
      // object's parent infinitely, so we catch this case.
      return func(object);
    }
    if (NCMB._.isArray(object)) {
      NCMB._.each(object, function(child, index) {
        var newChild = NCMB._traverse(child, func, seen);
        if (newChild) {
          object[index] = newChild;
        }
      });
      return func(object);
    }
    if (NCMB._.isObject(object)) {
      NCMB._each(object, function(child, key) {
        var newChild = NCMB._traverse(child, func, seen);
        if (newChild) {
          object[key] = newChild;
        }
      });
      return func(object);
    }
    return func(object);
  };

  /**
   * _.eachに似ている、しかし、
   * * 配列のようなオブジェクトは利用しない
   * * lengthの属性のオブジェクトは問題
   */
  NCMB._objectEach = NCMB._each = function(obj, callback) {
    var _ = NCMB._;
    if (_.isObject(obj)) {
      _.each(_.keys(obj), function(key) {
        callback(obj[key], key);
      });
    } else {
      _.each(obj, callback);
    }
  };

  // Helper function to check null or undefined.
  NCMB._isNullOrUndefined = function(x) {
    return NCMB._.isNull(x) || NCMB._.isUndefined(x);
  };

  //UUIDを生成するため
  NCMB._createUuid = function(){
    var S4 = function() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }  
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4() +S4());
  };
}(this));

/************************************************* NCMB Promise class ********************************************/

(function(root) {
  root.NCMB = root.NCMB || {};
  var NCMB = root.NCMB;
  var _ = NCMB._;

  /**
   *　@class 
   * Backbone.jsのプロミス概念を実施するためのクラスである。プロミスでは非同期の処理を行った後に予約したコールバックを呼び出す。
   *
   * <p>利用例:<pre>
   *    query.findAsync().then(function(results) {
   *      results[0].set("foo", "bar");
   *      return results[0].saveAsync();
   *    }).then(function(result) {
   *      console.log("Updated " + result.id);
   *    });
   * </pre></p>
   *
   * @see NCMB.Promise.prototype.next
   * 
   */
  NCMB.Promise = function() {
    this._resolved = false;
    this._rejected = false;
    this._resolvedCallbacks = [];
    this._rejectedCallbacks = [];
  };

  _.extend(NCMB.Promise, /** @lends NCMB.Promise */ {

    /**
     * Promiseのオブジェクトであるかどうか判断するための関数である。
     * Promiseのインターフェイスを満たすオブジェクトの場合、Trueとして返却する。
     * @return {Boolean}
     */
    is: function(promise) {
      if(promise && promise.then && _.isFunction(promise.then))
        return promise && promise.then && _.isFunction(promise.then);
      else
        return false;
    },

    /**
     * 渡された値で解決された新しいPromiseを返却する。
     * @return {NCMB.Promise} 新しいプロミス
     */
    as: function() {
      var promise = new NCMB.Promise();
      promise.resolve.apply(promise, arguments);
      return promise;
    },

    /**
     * 失敗Promiseと渡されたErrorを返却する。
     * @return {NCMB.Promise} 新しいプロミス
     */
    error: function() {
      var promise = new NCMB.Promise();
      promise.reject.apply(promise, arguments);
      return promise;
    },

    /**
    　* すべてpromisesが成功したら、
     * 新しいPromiseを返す。実行したPromisesの中にエラーが発生したら、
     * 最後に実行したPromiseのエラーと共に、失敗Promiseとして返す。
     * すべて成功した場合、実行した結果の配列と共に成功Promiseとして返す。
     * @param {Array} promises 実行する予定Promisesのリスト。
     * @return {NCMB.Promise} 新しいPromiseを返却する。
     */
    when: function(promises) {
      // Allow passing in Promises as separate arguments instead of an Array.
      var objects;
      if (promises && NCMB._isNullOrUndefined(promises.length)) {
        objects = arguments;
      } else {
        objects = promises;
      }

      var total = objects.length;
      var hadError = false;
      var results = [];
      var errors = [];
      results.length = objects.length;
      errors.length = objects.length;

      if (total === 0) {
        return NCMB.Promise.as.apply(this, results);
      }

      var promise = new NCMB.Promise();

      var resolveOne = function() {
        total = total - 1;
        if (total === 0) {
          if (hadError) {
            promise.reject(errors);
          } else {
            promise.resolve.apply(promise, results);
          }
        }
      };

      NCMB._arrayEach(objects, function(object, i) {
        if (NCMB.Promise.is(object)) {
          object.then(function(result) {
            results[i] = result;
            resolveOne();
          }, function(error) {
            errors[i] = error;
            hadError = true;
            resolveOne();
          });
        } else {
          results[i] = object;
          resolveOne();
        }
      });

      return promise;
    },

    /**
     * Runs the given asyncFunction repeatedly, as long as the predicate
     * function returns a truthy value. Stops repeating if asyncFunction returns
     * a rejected promise.
     * @param {Function} predicate should return false when ready to stop.
     * @param {Function} asyncFunction should return a Promise.
     */
    _continueWhile: function(predicate, asyncFunction) {
      if (predicate()) {
        return asyncFunction().then(function() {
          return NCMB.Promise._continueWhile(predicate, asyncFunction);
        });
      }
      return NCMB.Promise.as();
    }
  });

  _.extend(NCMB.Promise.prototype, /** @lends NCMB.Promise.prototype */ {

    /**
     * Promiseを完了させ、成功コールバックを実行させる。
     * @param {Object} result コールバックに渡すresult。
     */
    resolve: function(result) {
      if (this._resolved || this._rejected) {
        throw "A promise was resolved even though it had already been " +
          (this._resolved ? "resolved" : "rejected") + ".";
      }
      this._resolved = true;
      this._result = arguments;
      var results = arguments;
      NCMB._arrayEach(this._resolvedCallbacks, function(resolvedCallback) {
        resolvedCallback.apply(this, results);
      });
      this._resolvedCallbacks = [];
      this._rejectedCallbacks = [];
    },

    /**
     * Promiseを完了させ、失敗コールバックを実行させる。
     * @param {Object} error コールバックに渡すエラー
     */
    reject: function(error) {
      if (this._resolved || this._rejected) {
        throw "A promise was rejected even though it had already been " +
          (this._resolved ? "resolved" : "rejected") + ".";
      }
      this._rejected = true;
      this._error = error;
      NCMB._arrayEach(this._rejectedCallbacks, function(rejectedCallback) {
        rejectedCallback(error);
      });
      this._resolvedCallbacks = [];
      this._rejectedCallbacks = [];
    },

    /**
     * Promiseが終了させた時にコールバックを追加。
     * コールバックが完了させた後、新しいPromiseを返却。
     * チェイニングをサポートする。
     * コールバックがPromiseとして返却する場合、
     * thenで実行させるコールバックはcallbackで実行させるPromiseが完成しないと完了できない。
     * @param {Function} resolvedCallback プロミスが完成させたら、実行させる関数。
     * コールバックが完了すると、"then"で返却されたプロミスが成功させる。
     * @param {Function} rejectedCallback プロミスがエラーとして拒否された場合。
     * コールバックが完了すると、"then"で返却されたプロミスが成功させる。
     * rejectedCallbackがnullか拒否のプロミスとして返却された場合、
     * "then"で返却されたプロミスがエラーと拒否される。

     * @return {NCMB.Promise} プロミスが完了したかコールバックが実行させた後の新しい成功させたプロミスを返却する。
     * コールバックがプロミスを返却した場合、そのプロミスが完了しない限り、プロミスが完了できない。
     */
    then: function(resolvedCallback, rejectedCallback) {
      var promise = new NCMB.Promise();
      var wrappedResolvedCallback = function() {
        var result = arguments;
        if (resolvedCallback) {
          result = [resolvedCallback.apply(this, result)];
        }
        if (result.length === 1 && NCMB.Promise.is(result[0])) {
          result[0].then(function() {
            promise.resolve.apply(promise, arguments);
          }, function(error) {
            promise.reject(error);
          });
        } else {
          promise.resolve.apply(promise, result);
        }
      };

      var wrappedRejectedCallback = function(error) {
        var result = [];
        if (rejectedCallback) {
          result = [rejectedCallback(error)];
          if (result.length === 1 && NCMB.Promise.is(result[0])) {
            result[0].then(function() {
              promise.resolve.apply(promise, arguments);
            }, function(error) {
              promise.reject(error);
            });
          } else {
            // A Promises/A+ compliant implementation would call:
            // promise.resolve.apply(promise, result);
            promise.reject(result[0]);
          }
        } else {
          promise.reject(error);
        }
      };

      if (this._resolved) {
        wrappedResolvedCallback.apply(this, this._result);
      } else if (this._rejected) {
        wrappedRejectedCallback(this._error);
      } else {
        this._resolvedCallbacks.push(wrappedResolvedCallback);
        this._rejectedCallbacks.push(wrappedRejectedCallback);
      }

      return promise;
    },

    /**
     * Run the given callbacks after this promise is fulfilled.
     * @param optionsOrCallback {} A Backbone-style options callback, or a
     * callback function. If this is an options object and contains a "model"
     * attributes, that will be passed to error callbacks as the first argument.
     * @param model {} If truthy, this will be passed as the first result of
     * error callbacks. This is for Backbone-compatability.
     * @return {NCMB.Promise} A promise that will be resolved after the
     * callbacks are run, with the same result as this.
     */
    _thenRunCallbacks: function(optionsOrCallback, model) {
      var options;
      if (_.isFunction(optionsOrCallback)) {
        var callback = optionsOrCallback;
        options = {
          success: function(result) {
            callback(result, null);
          },
          error: function(error) {
            callback(null, error);
          }
        };
      } else {
        options = _.clone(optionsOrCallback);
      }
      options = options || {};

      return this.then(function(result) {
        if (options.success) {
          options.success.apply(this, arguments);
        } else if (model) {
          // When there's no callback, a sync event should be triggered.
          model.trigger('sync', model, result, options);
        }
        return NCMB.Promise.as.apply(NCMB.Promise, arguments);
      }, function(error) {
        if (options.error) {
          if (!_.isUndefined(model)) {
            options.error(model, error);
          } else {
            options.error(error);
          }
        } else if (model) {
          // When there's no error callback, an error event should be triggered.
          model.trigger('error', model, error, options);
        }
        // By explicitly returning a rejected Promise, this will work with
        // either jQuery or Promises/A semantics.
        return NCMB.Promise.error(error);
      });
    },

    /**
     * Adds a callback function that should be called regardless of whether
     * this promise failed or succeeded. The callback will be given either the
     * array of results for its first argument, or the error as its second,
     * depending on whether this Promise was rejected or resolved. Returns a
     * new Promise, like "then" would.
     * @param {Function} continuation the callback.
     */
    _continueWith: function(continuation) {
      return this.then(function() {
        return continuation(arguments, null);
      }, function(error) {
        return continuation(null, error);
      });
    }

  });
}(this));

/************************************************** NCMB Error class *****************************************/

(function(root) {
  root.NCMB = root.NCMB || {};
  var NCMB = root.NCMB;
  var _ = NCMB._;

  /**
   * 渡されたエラーコードとメッセージから新しいNCMB.Errorのオブジェクトを生成、返却する。
   * @param {Number} code <code>NCMB.Error</code>から定義されたエラーコード定数とする。
   * @param {String} message エラーの詳細メッセージ
   * @class
   *
   * <p>コールバックのエラーを渡すために利用する。</p>
   */
  NCMB.Error = function(code, message) {
    this.code = code;
    this.message = message;
  };

  _.extend(NCMB.Error, /** @lends NCMB.Error */ {
    /**
     * ほかの原因でのエラーコード。
     * @constant
     */
    OTHER_CAUSE: -1,

    /**
     * E100001 レスポンスシグネチャ不正
     * @constant
     */
    INVALID_RESPONSE_SIGNATURE: "E100001",

    /**
     * E400000　不正なリクエストです。
     * @constant
     */
    BAD_REQUEST: "E400000",

    /**
     * E400001　JSON形式不正です。
     * @constant
     */
    INVALID_JSON: "E400001",

    /**
     * E400002　型が不正です。
     * @constant
     */
    INVALID_TYPE: "E400002",

    /**
     * E400003　必須項目で未入力です。
     * @constant
     */
    REQUIRED: "E400003",

    /**
     * E400004　フォーマットが不正です。
     * @constant
     */
    INVALID_FORMAT: "E400004",

    /**
     * E400005　有効な値ではありません。
     * @constant
     */
    INVALID_VALUE: "E400005",

    /**
     * E400006　存在しない値です。
     * @constant
     */
    NOT_EXIST: "E400006",

    /**
     * E400008　相関関係でエラーです。
     * @constant
     */
    RELATION_ERROR: "E400008",

    /**
     * E400009　指定桁数を超えています。
     * @constant
     */
    INVALID_SIZE: "E400009",

    /**
     * E401001　Header不正による認証エラーです。
     * @constant
     */
    INCORRECT_HEADER: "E401001",

    /**
     * E401002　ID/Pass認証エラーです。
     * @constant
     */
    INCORRECT_PASSWORD: "E401002",

    /**
     * E401003　OAuth認証エラーです。
     * @constant
     */
    OAUTH_ERROR: "E401003",

    /**
     * E403001　ＡＣＬによるアクセス権がありません。
     * @constant
     */
    INVALID_ACL: "E403001",

    /**
     * E403002　コラボレータ/管理者（サポート）権限がありません。
     * @constant
     */
    INVALID_OPERATION: "E403002",

    /**
     * E403003　禁止されているオペレーションです。
     * @constant
     */
    FORBIDDEN_OPERATION: "E403003",

    /**
     * E403005　設定不可の項目です。
     * @constant
     */
    INVALID_SETTING: "E403005",

    /**
     * E403006　GeoPoint型フィールドに対してGeoPoint型以外のデータ登録/更新を実施（逆も含む）不正なGeoPoint検索を実施エラーです。
     * @constant
     */
    INVALID_GEOPOINT: "E403006",

    /**
     * E405001　リクエストURI/メソッドが不許可です。
     * @constant
     */
    INVALID_METHOD: "E405001",

    /**
     * E409001　重複エラーです。
     * @constant
     */
    DUPPLICATION_ERROR: "E409001",

    /**
     * E413001　ファイルサイズ上限チェック  エラーです。
     * @constant
     */
    FILE_SIZE_ERROR: "E413001",

    /**
     * E413002　MongoDBドキュメントのサイズ上限エラーです。
     * @constant
     */
    DOCUMENT_SIZE_ERROR: "E413002",

    /**
     * E413003　複数オブジェクト一括操作の上限エラーです。
     * @constant
     */
    REQUEST_LIMIT_ERROR: "E413003",

    /**
     * E415001　サポート対象外のContentTypeの指定エラーです。
     * @constant
     */
    UNSUPPORT_MEDIA: "E415001",

    /**
     * E429001　使用制限（APIコール数、PUSH通知数、ストレージ容量）超過エラーです
     * @constant
     */
    REQUEST_OVERLOAD: "E429001",    

    /**
     * E500001　内部エラーです。
     * @constant
     */
    SYSTEM_ERROR: "E500001",

    /**
     * E502001　ストレージエラーです。NIFTY Cloud ストレージでエラーが発生した場合のエラーです。
     * @constant
     */
    STORAGE_ERROR: "E502001",

    /**
     * E502002　メール送信エラーです。
     * @constant
     */
    MAIL_ERROR: "E502002",

    /**
     * E502003　DBエラーです。
     * @constant
     */
    DATABASE_ERROR: "E502003",

    
  });
}(this));

/************************************************** NCMB Events class *****************************************/

/*global _: false */
(function() {
  var root = this;
  var NCMB = (root.NCMB || (root.NCMB = {}));
  var eventSplitter = /\s+/;
  var slice = Array.prototype.slice;
  
  /**
   * @class
   *
   * <p>NCMB.EventsではBackbone.jsのEvents概要を引き継ぎである。</p>
   *
   * <p>このモジュールはどんなオブジェクトでも組み合わせ、
   * オブジェクトのイベントをカスタマイズすることができる。　
   * イベントに'on'にコールバック関数を追加し、'off'に関数を削除する。
   *　イベントを発火させると、'on'からの順番ですべてコールバックが起こさせる。
   *
   * <pre>
   *     var object = {};
   *     _.extend(object, NCMB.Events);
   *     object.on('expand', function(){ alert('expanded'); });
   *     object.trigger('expand');</pre></p>
   *
   * <p>詳細はこちらでご確認ください。
   * <a href="http://documentcloud.github.com/backbone/#Events">Backbone
   * documentation</a>.</p>
   */
  NCMB.Events = {
    /**
     * スペースで区別するイベントのリスト'events'をコールバックcallbackにバインドする。
     *　'all'を渡せる場合、すべてイベントが発生すると、コールバックがバインドされる。
     */
    on: function(events, callback, context) {

      var calls, event, node, tail, list;
      if (!callback) {
        return this;
      }
      events = events.split(eventSplitter);
      calls = this._callbacks || (this._callbacks = {});

      // Create an immutable callback list, allowing traversal during
      // modification.  The tail is an empty object that will always be used
      // as the next node.
      event = events.shift();
      while (event) {
        list = calls[event];
        node = list ? list.tail : {};
        node.next = tail = {};
        node.context = context;
        node.callback = callback;
        calls[event] = {tail: tail, next: list ? list.next : node};
        event = events.shift();
      }

      return this;
    },

    /**
     * コールバックを取り除く関数。'context'がnullの場合、functionのコールバックをすべて取り除く。
     *'callback'がnullの場合、イベントのコールバックをすべて取り除く。
     * 'events'がnullの場合、すべてのイベントのすべてコールバックを取り除く。
     */
    off: function(events, callback, context) {
      var event, calls, node, tail, cb, ctx;
      
      // No events, or removing *all* events.
      if (!(calls = this._callbacks)) {
        return;
      }
      if (!(events || callback || context)) {
        delete this._callbacks;
        return this;
      }

      // Loop through the listed events and contexts, splicing them out of the
      // linked list of callbacks if appropriate.
      events = events ? events.split(eventSplitter) : _.keys(calls);
      event = events.shift();
      while (event) {
        node = calls[event];
        delete calls[event];
        if (!node || !(callback || context)) {
          continue;
        }
        // Create a new list, omitting the indicated callbacks.
        tail = node.tail;
        node = node.next;
        while (node !== tail) {
          cb = node.callback;
          ctx = node.context;
          if ((callback && cb !== callback) || (context && ctx !== context)) {
            this.on(event, cb, ctx);
          }
          node = node.next;
        }
        event = events.shift();
      }
      return this;
    },

    /**
     * 一つか複数イベントを発火し、コールバックを起こさせる。
     *　イベント名以外コールバックは'trigger'と同じ変数が渡される。
     * 'all'のイベントを待つ場合、本当の名前を一番目の変数としてもらう。
     */
    trigger: function(events) {
      var event, node, calls, tail, args, all, rest;
      if (!(calls = this._callbacks)) {
        return this;
      }
      all = calls.all;
      events = events.split(eventSplitter);
      rest = slice.call(arguments, 1);

      // For each event, walk through the linked list of callbacks twice,
      // first to trigger the event, then to trigger any `"all"` callbacks.
      event = events.shift();
      while (event) {
        node = calls[event];
        if (node) {
          tail = node.tail;
          while ((node = node.next) !== tail) {
            node.callback.apply(node.context || this, rest);
          }
        }
        node = all;
        if (node) {
          tail = node.tail;
          args = [event].concat(rest);
          while ((node = node.next) !== tail) {
            node.callback.apply(node.context || this, args);
          }
        }
        event = events.shift();
      }

      return this;
    }
  };  

  /**
   * @function
   */
  NCMB.Events.bind = NCMB.Events.on;

  /**
   * @function
   */
  NCMB.Events.unbind = NCMB.Events.off;
}.call(this));

/************************************************** NCMB Object class *****************************************/

// JAVAのNCMBObjectを対応するクラス。Backboneのモデルと同じインターフェースを実施するクラス。
(function(root) {
  root.NCMB = root.NCMB || {};
  var NCMB = root.NCMB;
  var _ = NCMB._;

  /**
   * 定義された属性からモデルを作成する。
   * クライアントid(cid)は自動的に生成され、渡される。
   *
   * <p>普段は直接メソッド利用しない。 
   * <code>extend</code>を使用し、<code>NCMB.Object</code>サブクラスを使用することがお勧めする。</p>
   *
   * <p>サブクラスを利用したくない場合、以下のフォーマットを利用することができる:
   * <pre>
   *     var object = new NCMB.Object("ClassName");
   * </pre>
   * 次の利用方法と同じである:<pre>
   *     var MyClass = NCMB.Object.extend("ClassName");
   *     var object = new MyClass();
   * </pre></p>
   *
   * @param {Object} attributes オブジェクトに保存するための初期データーセット
   * @param {Object} options オブジェクトを作成するに当たって、Backbone対応オプションセット。
   *                 現時点、"collection"のみサポートしていない。
   * @see NCMB.Object.extend
   *
   * @class
   *
   * <p>Backboneモデルインターフェイスを実行するNCMBデーターストアの基本クラス。</p>
   */
  NCMB.Object = function(attributes, options) {
    // 新しいNCMB.Object("ClassName")のショートカットを作成。
    if (_.isString(attributes)) { 
      return NCMB.Object._create.apply(this, arguments);
    }

    attributes = attributes || {};
    if (options && options.parse) {
      attributes = this.parse(attributes);
    }
    var defaults = NCMB._getValue(this, 'defaults');
    if (defaults) {
      attributes = _.extend({}, defaults, attributes);
    }
    if (options && options.collection) {
      this.collection = options.collection;
    }

    this._serverData = {};  // The last known data for this object from cloud.
    this._opSetQueue = [{}];  // List of sets of changes to the data.
    this.attributes = {};  // The best estimate of this's current data.

    this._hashedJSON = {};  // Hash of values of containers at last save.
    this._escapedAttributes = {};
    this.cid = _.uniqueId('c');
    this.changed = {};
    this._silent = {};
    this._pending = {};
    if (!this.set(attributes, {silent: true})) {
      throw new Error("Can't create an invalid NCMB.Object");
    }
    this.changed = {};
    this._silent = {};
    this._pending = {};
    this._hasData = true;
    this._previousAttributes = _.clone(this.attributes);
    this.initialize.apply(this, arguments);
  };

  /**
   * @lends NCMB.Object.prototype
   * @property {String} id Object.NCMBオブジェクトのObjectId
   */

  /**
   * NCMB.Objectのオブジェクトリストを保存する。
   * エラーがある場合、エラー処理を実行する。
   *　使用方法は二つがある。
   * 
   *
   * Backboneのような方法：<pre>
   *   NCMB.Object.saveAll([object1, object2, ...], {
   *     success: function(list) {
   *       // All the objects were saved.
   *     },
   *     error: function(error) {
   *       // An error occurred while saving one of the objects.
   *     },
   *   });
   * </pre>
   * 簡易化方法：
   * <pre>
   *   NCMB.Object.saveAll([object1, object2, ...], function(list, error) {
   *     if (list) {
   *       // All the objects were saved.
   *     } else {
   *       // An error occurred.
   *     }
   *   });
   * </pre>
   *
   * @param {Array} list <code>NCMB.Object</code>のリスト。
   * @param {Object} options Backboneスタイルのコールバックオブジェクト。
   */
  NCMB.Object.saveAll = function(list, options) {
    return NCMB.Object._deepSaveAsync(list)._thenRunCallbacks(options);
  };

  // Attach all inheritable methods to the NCMB.Object prototype.
  _.extend(NCMB.Object.prototype, NCMB.Events,
    /** @lends NCMB.Object.prototype */ 
    {
    _existed: false,

    /**
     * 初期化関数のデフォルトは空関数。好みの初期化ロジックはここで設定し、関数をオーバーライドしてください。
     */
    initialize: function(){},

    /**
     * NCMBに保存するため、オブジェクトのJSONバージョンとして返却
     * @return {Object}
     */
    toJSON: function() {
      var json = this._toFullJSON();
      NCMB._arrayEach(["__type", "className"],
                       function(key) { delete json[key]; });
      return json;
    },

    _toFullJSON: function(seenObjects) {
      var json = _.clone(this.attributes);
      NCMB._objectEach(json, function(val, key) {
        json[key] = NCMB._encode(val, seenObjects);
      });
      NCMB._objectEach(this._operations, function(val, key) {
        json[key] = val;
      });

      if (_.has(this, "id")) {
        json.objectId = this.id;
      }
      if (_.has(this, "createdAt")) {
        if (_.isDate(this.createdAt)) {
          json.createdAt = this.createdAt.toJSON();
        } else {
          json.createdAt = this.createdAt;
        }
      }

      if (_.has(this, "updatedAt")) {
        if (_.isDate(this.updatedAt)) {
          json.updatedAt = this.updatedAt.toJSON();
        } else {
          json.updatedAt = this.updatedAt;
        }
      }
      json.__type = "Object";
      json.className = this.className;
      return json;
    },

    /**
     * _hashedJSONを更新し、現在のオブジェクト状態を反映する。
     * 未完了変更のセットに変更されたハッシュ値を追加する。
     */
    _refreshCache: function() {
      var self = this;
      if (self._refreshingCache) {
        return;
      }
      self._refreshingCache = true;
      NCMB._objectEach(this.attributes, function(value, key) {
        if (value instanceof NCMB.Object) {
          value._refreshCache();
        } else if (_.isObject(value)) {
          if (self._resetCacheForKey(key)) {
            self.set(key, new NCMB.Op.Set(value), { silent: true });
          }
        }
      });
      delete self._refreshingCache;
    },

    /**
     * 最後の保存・リフレッシュした時からオブジェクトが変更された場合trueを返却
     * 属性が指定された場合、その属性が変更されたら、trueとして返却する。
     * @param {String} key 属性の名前（任意）
     * @return {Boolean}
     */
    dirty: function(key) {
      this._refreshCache();

      var currentChanges = _.last(this._opSetQueue);

      if (key) {
        return (currentChanges[key] ? true : false);
      }
      if (!this.id) {
        return true;
      }
      if (_.keys(currentChanges).length > 0) {
        return true;
      }
      return false;
    },

    /**
     * オブジェクトに参照するポインター。
     */
    _toPointer: function() {
      if (!this.id) {
        throw new Error("Can't serialize an unsaved NCMB.Object");
      }
      return { __type: "Pointer",
               className: this.className,
               objectId: this.id };
    },

    /**
     * 属性に対する値を返却する。
     * @param {String} key 属性の名前
     */
    get: function(key) {
      return this.attributes[key];
    },

    /**
     * オブジェクトの属性に対する関連オブジェクトを返却する。
     * @param String key 関連を取るための属性
     */
    relation: function(key) {
      var value = this.get(key);
      if (value) {    
        if (!(value instanceof NCMB.Relation)) {
          throw "Called relation() on non-relation field " + key;
        }
        value._ensureParentAndKey(this, key);
        return value;
      } else {
        return new NCMB.Relation(this, key);
      }
    },

    /**
     * 指定した属性のHTML-エスケープ値を取得
     */
    escape: function(key) {
      var html = this._escapedAttributes[key];
      if (html) {
        return html;
      }
      var val = this.attributes[key];
      var escaped;
      if (NCMB._isNullOrUndefined(val)) {
        escaped = '';
      } else {
        escaped = _.escape(val.toString());
      }
      this._escapedAttributes[key] = escaped;
      return escaped;
    },

    /**
     * nullかundefinedではない値を持っている属性が存在する場合、<code>true</code>として返却する。
     * @param {String} key 属性の名前
     * @return {Boolean}
     */
    has: function(key) {
      return !NCMB._isNullOrUndefined(this.attributes[key]);
    },

    /**
     * objectId, createdAtのような特別なフィールドを取りだし、
     * 現在のオブジェクトに直接追加する。
     * @param attrs - このNCMB.Objectのデータ辞書
     */
    _mergeMagicFields: function(attrs) {
      // Check for changes of magic fields.
      var model = this;
      var specialFields = ["id", "objectId", "createdAt", "updatedAt"];
      NCMB._arrayEach(specialFields, function(attr) {
        if (attrs[attr]) {
          if (attr === "objectId") {
            model.id = attrs[attr];
          } else if ((attr === "createdAt" || attr === "updatedAt") &&
                     !_.isDate(attrs[attr])) {
            model[attr] = NCMB._NCMBDate(attrs[attr]);
          } else {
            model[attr] = attrs[attr];
          }
          delete attrs[attr];
        }
      });
    },

    /**
     * Returns the json to be sent to the server.
     */
    _startSave: function() {
      this._opSetQueue.push({});
    },

    /**
     * Called when a save fails because of an error. Any changes that were part
     * of the save need to be merged with changes made after the save. This
     * might throw an exception is you do conflicting operations. For example,
     * if you do:
     *   object.set("foo", "bar");
     *   object.set("invalid field name", "baz");
     *   object.save();
     *   object.increment("foo");
     * then this will throw when the save fails and the client tries to merge
     * "bar" with the +1.
     */
    _cancelSave: function() {
      var self = this;
      var failedChanges = _.first(this._opSetQueue);
      this._opSetQueue = _.rest(this._opSetQueue);
      var nextChanges = _.first(this._opSetQueue);
      NCMB._objectEach(failedChanges, function(op, key) {
        var op1 = failedChanges[key];
        var op2 = nextChanges[key];
        if (op1 && op2) {
          nextChanges[key] = op2._mergeWithPrevious(op1);
        } else if (op1) {
          nextChanges[key] = op1;
        }
      });
      this._saving = this._saving - 1;
    },

    /**
     * Called when a save completes successfully. This merges the changes that
     * were saved into the known server data, and overrides it with any data
     * sent directly from the server.
     */
    _finishSave: function(serverData) {
      // Grab a copy of any object referenced by this object. These instances
      // may have already been fetched, and we don't want to lose their data.
      // Note that doing it like this means we will unify separate copies of the
      // same object, but that's a risk we have to take.
      var fetchedObjects = {};
      NCMB._traverse(this.attributes, function(object) {
        if (object instanceof NCMB.Object && object.id && object._hasData) {
          fetchedObjects[object.id] = object;
        }
      });

      var savedChanges = _.first(this._opSetQueue);
      this._opSetQueue = _.rest(this._opSetQueue);
      this._applyOpSet(savedChanges, this._serverData);
      this._mergeMagicFields(serverData);
      var self = this;
      NCMB._objectEach(serverData, function(value, key) {
        self._serverData[key] = NCMB._decode(key, value);

        // Look for any objects that might have become unfetched and fix them
        // by replacing their values with the previously observed values.
        var fetched = NCMB._traverse(self._serverData[key], function(object) {
          if (object instanceof NCMB.Object && fetchedObjects[object.id]) {
            return fetchedObjects[object.id];
          }
        });
        if (fetched) {
          self._serverData[key] = fetched;
        }
      });
      this._rebuildAllEstimatedData();
      this._saving = this._saving - 1;
    },

    /**
     * Called when a fetch or login is complete to set the known server data to
     * the given object.
     */
    _finishFetch: function(serverData, hasData) {
      // Clear out any changes the user might have made previously.
      this._opSetQueue = [{}];

      // Bring in all the new server data.
      this._mergeMagicFields(serverData);
      var self = this;
      NCMB._objectEach(serverData, function(value, key) {
        self._serverData[key] = NCMB._decode(key, value);
      });

      // Refresh the attributes.
      this._rebuildAllEstimatedData();

      // Clear out the cache of mutable containers.
      this._refreshCache();
      this._opSetQueue = [{}];
      this._hasData = hasData;
    },

    /**
     * Applies the set of NCMB.Op in opSet to the object target.
     */
    _applyOpSet: function(opSet, target) {
      var self = this;
      NCMB._objectEach(opSet, function(change, key) {
        target[key] = change._estimate(target[key], self, key);
        if (target[key] === NCMB.Op._UNSET) {
          delete target[key];
        }
      });
    },

    /**
     * Replaces the cached value for key with the current value.
     * Returns true if the new value is different than the old value.
     */
    _resetCacheForKey: function(key) {
      var value = this.attributes[key];
      if (_.isObject(value) &&
          !(value instanceof NCMB.Object) &&
          !(value instanceof NCMB.File)) {
        value = value.toJSON ? value.toJSON() : value;
        var json = JSON.stringify(value);
        if (this._hashedJSON[key] !== json) {
          this._hashedJSON[key] = json;
          return true;
        }
      }
      return false;
    },

    /**
     * Populates attributes[key] by starting with the last known data from the
     * server, and applying all of the local changes that have been made to that
     * key since then.
     */
    _rebuildEstimatedDataForKey: function(key) {
      var self = this;
      delete this.attributes[key];
      if (this._serverData[key]) {
        this.attributes[key] = this._serverData[key];
      }
      NCMB._arrayEach(this._opSetQueue, function(opSet) {
        var op = opSet[key];
        if (op) {
          self.attributes[key] = op._estimate(self.attributes[key], self, key);
          if (self.attributes[key] === NCMB.Op._UNSET) {
            delete self.attributes[key];
          } else {
            self._resetCacheForKey(key);
          }
        }
      });
    },

    /**
     * Populates attributes by starting with the last known data from the
     * server, and applying all of the local changes that have been made since
     * then.
     */
    _rebuildAllEstimatedData: function() {
      var self = this;

      var previousAttributes = _.clone(this.attributes);

      this.attributes = _.clone(this._serverData);
      NCMB._arrayEach(this._opSetQueue, function(opSet) {
        self._applyOpSet(opSet, self.attributes);
        NCMB._objectEach(opSet, function(op, key) {
          self._resetCacheForKey(key);
        });
      });

      // Trigger change events for anything that changed because of the fetch.
      NCMB._objectEach(previousAttributes, function(oldValue, key) {
        if (self.attributes[key] !== oldValue) {
          self.trigger('change:' + key, self, self.attributes[key], {});
        }
      });
      NCMB._objectEach(this.attributes, function(newValue, key) {
        if (!_.has(previousAttributes, key)) {
          self.trigger('change:' + key, self, newValue, {});
        }
      });
    },

    /**
     * オブジェクトのモデル属性のハッシュをセットし、
     * silenceの設定をしない限り、<code>"change"</code>を発生させる。
     *
     * 
     * <p>キーと値を持っているオブジェクトか（キー、値）でも実行可能である。
     * 例えば：
     * <pre>
     *   gameTurn.set({
     *     player: player1,
     *     diceRoll: 2
     *   }, {
     *     error: function(gameTurnAgain, error) {
     *       // The set failed validation.
     *     }
     *   });
     *
     *   game.set("currentPlayer", player2, {
     *     error: function(gameTurnAgain, error) {
     *       // The set failed validation.
     *     }
     *   });
     *
     *   game.set("finished", true);</pre></p>
     * 
     * @param {String} key 　セットするキー
     * @param {} value セットする値
     * @param {Object} options Backbone対応オプションのセット。
     *     現時点、<code>silent</code>, <code>error</code>, <code>promise</code>のみサポートされてない。
     * @return {Boolean} 成功にセットを行った場合、trueとして返却する。
     * @see NCMB.Object#validate
     * @see NCMB.Error
     */
    set: function(key, value, options) {
      var attrs, attr;
      if (_.isObject(key) || NCMB._isNullOrUndefined(key)) {
        attrs = key;
        NCMB._objectEach(attrs, function(v, k) {
          attrs[k] = NCMB._decode(k, v);
        });
        options = value;
      } else {
        attrs = {};
        attrs[key] = NCMB._decode(key, value);
      }
      // Extract attributes and options.
      options = options || {};
      if (!attrs) {
        return this;
      }
  
      if (attrs instanceof NCMB.Object) {
        attrs = attrs.attributes;
      }

      // If the unset option is used, every attribute should be a Unset.
      if (options.unset) {
        NCMB._objectEach(attrs, function(unused_value, key2) {
          attrs[key2] = new NCMB.Op.Unset();
        });
      }

      // Apply all the attributes to get the estimated values.
      var dataToValidate = _.clone(attrs);
      var self = this;

      /*checking*/
      NCMB._objectEach(dataToValidate, function(value2, key2) {
        if (value2 instanceof NCMB.Op) {
          dataToValidate[key2] = value2._estimate(self.attributes[key2],
                                                self, key2);
          if (dataToValidate[key2] === NCMB.Op._UNSET) {
            delete dataToValidate[key2];
          }
         }
      });
      // Run validation.
      if (!this._validate(attrs, options)) {
        return false;
      }


      this._mergeMagicFields(attrs);

      options.changes = {};
      var escaped = this._escapedAttributes;
      var prev = this._previousAttributes || {};

      // Update attributes.
      NCMB._arrayEach(_.keys(attrs), function(attr) {
        var val = attrs[attr];

        // If this is a relation object we need to set the parent correctly,
        // since the location where it was NCMBd does not have access to
        // this object.
        if (val instanceof NCMB.Relation) {
          val.parent = self;
        }

        if (!(val instanceof NCMB.Op)) {
          val = new NCMB.Op.Set(val);
        }

        // See if this change will actually have any effect.
        var isRealChange = true;
        if (val instanceof NCMB.Op.Set &&
            _.isEqual(self.attributes[attr], val.value)) {
          isRealChange = false;
        }

        if (isRealChange) {
          delete escaped[attr];
          if (options.silent) {
            self._silent[attr] = true;
          } else {
            options.changes[attr] = true;
          }
        }

        var currentChanges = _.last(self._opSetQueue);
        currentChanges[attr] = val._mergeWithPrevious(currentChanges[attr]);
        self._rebuildEstimatedDataForKey(attr);

        if (isRealChange) {
          self.changed[attr] = self.attributes[attr];
          if (!options.silent) {
            self._pending[attr] = true;
          }
        } else {
          delete self.changed[attr];
          delete self._pending[attr];
        }
      });

      if (!options.silent) {
        this.change(options);
      }
      return this;
    },

    /**
     * 属性をモデルから削除し、silenceを指定しない場合、<code>"change"</code>を実行させる。
     * 属性が存在しない場合、noopとして実行する。
     */
    unset: function(key, options) {
      options = options || {};
      return this.set(key, null, options);
    },

    /**
     * 次に保存を行う時、原子的に属性の値を増加させる。
     * 増加する値が指定されない場合、デフォルト値は1となる。
     *
     * @param key {String} キー名
     * @param amount {Number} 増加する値
     */
    increment: function(key, amount) {
      if (_.isUndefined(amount) || _.isNull(amount)) {
        amount = 1;
      }
      return this.set(key, new NCMB.Op.Increment(amount));
    },

    /**
     * キーの配列末にオブジェクトを追加する
     * @param key {String} キー名
     * @param value {} 追加項目
     */
    add: function(key, value) {
      return this.set(key, new NCMB.Op.Add([value]));
    },

    /**
     * オブジェクトがキー値の配列に存在しない場合だけ、配列にオブジェクトの追加を行う。追加位置は確定されていない。
     *
     * @param key {String} キー名
     * @param value {} 追加オブジェクト
     */
    addUnique: function(key, value) {
      return this.set(key, new NCMB.Op.AddUnique([value]));
    },

    /**
     * キー値の配列からオブジェクトのすべてのインスタンスを取り除く。
     *
     * @param key {String} キー名
     * @param item {} 取り除くオブジェクト
     */
    remove: function(key, item) {
      return this.set(key, new NCMB.Op.Remove([item]));
    },

    /**
     * 最後に保存された時から、フィールドの値にどんな変更があったかを表現するNCMB.Opのサブクラスのインスタンスを取得する。
     * 例えば、object.increment("x")を行った後、object.op("x")がNCMB.Op.Incrementを返却する。
     *
     * @param key {String} キー名
     * @returns {NCMB.Op} 操作かnoneの場合、不明確
     */
    op: function(key) {
      return _.last(this._opSetQueue)[key];
    },

    /**
     * モデルのすべての属性をクリアする、silenceをセットしない限り、<code>"change"</code>を実行させる。
     */
    clear: function(options) {
      options = options || {};
      options.unset = true;
      var keysToClear = _.extend(this.attributes, this._operations);
      return this.set(keysToClear, options);
    },

    /**
     * 次の保存リクエストと共に送信する操作セットのJSONエンコードを取得する。
     */
    _getSaveJSON: function() {
      var json = _.clone(_.first(this._opSetQueue));
      NCMB._objectEach(json, function(op, key) {
        json[key] = op.toJSON();
      });
      return json;
    },

    /**
     * 
     * Returns true if this object can be serialized for saving.
     */
    _canBeSerialized: function() {
      return NCMB.Object._canBeSerializedAsValue(this.attributes);
    },

    /**
     * サーバーからモデルを取得する。　サーバーの表現式は現在の属性と違う場合、
     * 現在の属性がoverridentされ、<code>"change"</code>のイベントを起動させる。
     * @return {NCMB.Promise} フェッチが完了されたら、成功のプロミスを返却する。
     */
    fetch: function(options) {
      var self = this;
      var request = NCMB._request("classes", this.className, this.id, 'GET');
      return request.then(function(response, status, xhr) {
        self._finishFetch(self.parse(response, status, xhr), true);
        return self;
      })._thenRunCallbacks(options, this);
    },

    /**
     * モデルの属性のハッシュセットを作成し、サーバーにモデルを保存する。
     * リクエストを返す時、updatedAtが更新される。
     * 以下のように、メソッドを利用する方法を紹介する。
     * <pre>
     *   object.save();</pre>
     * か<pre>
     *   object.save(null, options);</pre>
     * もしくは<pre>
     *   object.save(attrs, options);</pre>
     * か<pre>
     *   object.save(key, value, options);</pre>
     *
     * 例えば、
     * <pre>
     *   gameTurn.save({
     *     player: "Jake Cutter",
     *     diceRoll: 2
     *   }, {
     *     success: function(gameTurnAgain) {
     *       // The save was successful.
     *     },
     *     error: function(gameTurnAgain, error) {
     *       // The save failed.  Error is an instance of NCMB.Error.
     *     }
     *   });</pre>
     * かプロミス利用方法:<pre>
     *   gameTurn.save({
     *     player: "Jake Cutter",
     *     diceRoll: 2
     *   }).then(function(gameTurnAgain) {
     *     // The save was successful.
     *   }, function(error) {
     *     // The save failed.  Error is an instance of NCMB.Error.
     *   });</pre>
     * 
     * @return {NCMB.Promise} 保存が完了されたら、成功のプロミスを返却する。
     * @see NCMB.Error
     */
    save: function(keys, options) {      
      var i, attrs, current, saved; 
      attrs = keys;
      // Make save({ success: function() {} }) work.
      if (!options && attrs) {
        var extra_keys = _.reject(attrs, function(value, key) {
          return _.include(["success", "error", "wait"], key);
        });
        if (extra_keys.length === 0) {
          var all_functions = true;
          if (_.has(attrs, "success") && !_.isFunction(attrs.success)) {
            all_functions = false;
          }
          if (_.has(attrs, "error") && !_.isFunction(attrs.error)) {
            all_functions = false;
          }
          if (all_functions) {
            // This attrs object looks like it's really an options object,
            // and there's no other options object, so let's just use it.
            return this.save(null, attrs);
          }
        }
      }

      options = _.clone(options) || {};
      if (options.wait) {
        current = _.clone(this.attributes);
      }

      var setOptions = _.clone(options) || {};
      if (setOptions.wait) {
        setOptions.silent = true;
      }
      var setError;
      setOptions.error = function(model, error) {
        setError = error;
      };
      if (attrs && !this.set(attrs, setOptions)) {
        return NCMB.Promise.error(setError)._thenRunCallbacks(options, this);
      }

      var model = this;

      // If there is any unsaved child, save it first.
      model._refreshCache();     

      var unsavedChildren = [];
      var unsavedFiles = [];
      NCMB.Object._findUnsavedChildren(model.attributes,
                                        unsavedChildren,
                                        unsavedFiles);

      if (unsavedChildren.length + unsavedFiles.length > 0) {
        return NCMB.Object._deepSaveAsync(this.attributes).then(function() {
          return model.save(null, options);
        }, function(error) {
          return NCMB.Promise.error(error)._thenRunCallbacks(options, model);
        });
      }

      this._startSave();
      this._saving = (this._saving || 0) + 1;

      this._allPreviousSaves = this._allPreviousSaves || NCMB.Promise.as();
      this._allPreviousSaves = this._allPreviousSaves._continueWith(function() {

        if ( model.className == "file") {
          if (model._newFlag) //save new file situation 
            var method = "POST";
          else //save existed file situation
            var method = "PUT";
            model.id = model.toJSON().fileName;
        }
        else {
          var method = model.id ? 'PUT' : 'POST';
        }
        
        var json = model._getSaveJSON();
        var route = "classes";
        var className = model.className;
        var request = NCMB._request(route, className, model.id, method, json);
        request = request.then(function(resp, status, xhr) {
          var serverAttrs = model.parse(resp, status, xhr);
          if (options.wait) {
            serverAttrs = _.extend(attrs || {}, serverAttrs);
          }
          model._finishSave(serverAttrs);
          if (options.wait) {
            model.set(current, setOptions);
          }
          return model;

        }, function(error) {
          model._cancelSave();
          return NCMB.Promise.error(error);

        })._thenRunCallbacks(options, model);

        return request;
      });
      return this._allPreviousSaves;
    },

    /**
     * 現在のオブジェクトはサーバーに存在する場合、削除を行う。コレクションに存在する場合、コレクションから削除も行う。
     * オプションに`wait: true`が渡された場合、サーバーから反応があるまで、削除を待つ。
     *　
     * @return {NCMB.Promise} 削除が完了されたら、成功のプロミスを返却する。
     */
    destroy: function(options) {
      options = options || {};
      var model = this;

      var triggerDestroy = function() {
        model.trigger('destroy', model, model.collection, options);
      };

      if (!this.id) {
        var _fileName = this.get("fileName");
        if(_fileName) {
          this.id = _fileName;
        }
        else{
          return triggerDestroy();
        }
      }

      if (!options.wait) {
        triggerDestroy();
      }

      var request =
          NCMB._request("classes", this.className, this.id, 'DELETE');
      return request.then(function() {
        if (options.wait) {
          triggerDestroy();
        }
        return model;
      })._thenRunCallbacks(options, this);
    },

    /**
     * レスポンスを属性のハッシュに変換する。
     * @ignore
     */
    parse: function(resp, status, xhr) {
      var output = _.clone(resp);
      _(["createdAt", "updatedAt"]).each(function(key) {
        if (output[key]) {
          output[key] = NCMB._NCMBDate(output[key]);
        }
      });
      if (!output.updatedAt) {
        output.updatedAt = output.createdAt;
      }
      if (status) {
        this._existed = (status !== 201);
      }
      return output;
    },

    /**
     * 現在のオブジェクトと同じ属性のモデルを新しく作成する。
     * @return {NCMB.Object}
     */
    clone: function() {
      return new this.constructor(this.attributes);
    },

    /**
     * NCMBに保存されたことない場合、trueを返却する。
     * @return {Boolean}
     */
    isNew: function() {
      return !this.id;
    },

    /**
     * 属性の`"change:attribute"`イベントと、モデルの`"change"`イベントを手動的に実行させる。
     * この関数を実行すると、モデルのすべて関連オブジェクトが変更される。
     */

    change: function(options) {
      options = options || {};
      var changing = this._changing;
      this._changing = true;

      // Silent changes become pending changes.
      var self = this;
      NCMB._objectEach(this._silent, function(attr) {
        self._pending[attr] = true;
      });

      // Silent changes are triggered.
      var changes = _.extend({}, options.changes, this._silent);
      this._silent = {};
      NCMB._objectEach(changes, function(unused_value, attr) {
        self.trigger('change:' + attr, self, self.get(attr), options);
      });
      if (changing) {
        return this;
      }

      // This is to get around lint not letting us make a function in a loop.
      var deleteChanged = function(value, attr) {
        if (!self._pending[attr] && !self._silent[attr]) {
          delete self.changed[attr];
        }
      };

      // Continue firing `"change"` events while there are pending changes.
      while (!_.isEmpty(this._pending)) {
        this._pending = {};
        this.trigger('change', this, options);
        // Pending and silent changes still remain.
        NCMB._objectEach(this.changed, deleteChanged);
        self._previousAttributes = _.clone(this.attributes);
      }

      this._changing = false;
      return this;
    },
    
    
    /**
     * NCMBサーバーにオブジェクトが存在するかどうか確認し、true/false返却する。
     */
    existed: function() {
      return this._existed;
    },

    /**
     * 属性に対するすべて変更を持っているオブジェクトか、属性に変更がない時falseを返却する。
     * ビューがどんな部分は更新が必要かの確認とどんな属性がサーバーに持続するかの確認が便利になる。
     * セットされてない属性はundefinedとしてセットする。　属性オブジェクトdiffを渡す時、モデルに変更は行うかどうか判断し、返却する。
     */
    changedAttributes: function(diff) {
      if (!diff) {
        return this.hasChanged() ? _.clone(this.changed) : false;
      }
      var changed = {};
      var old = this._previousAttributes;
      NCMB._objectEach(diff, function(diffVal, attr) {
        if (!_.isEqual(old[attr], diffVal)) {
          changed[attr] = diffVal;
        }
      });
      return changed;
    },

    /**
     * 属性の前の値を取得する。この値は<code>"change"</code>イベントを実行した時に記録した値である。
     * @param {String} attr 取得したい属性名。
     */
    previous: function(attr) {
      if (!arguments.length || !this._previousAttributes) {
        return null;
      }
      return this._previousAttributes[attr];
    },

    /**
     * 前回の<code>"change"</code>イベントが発生した時のすべて属性を取得する。
     * @return {Object}　オブジェクト
     */
    previousAttributes: function() {
      return _.clone(this._previousAttributes);
    },

    /**
     * モデルは現在有効的な状態であるかどうか確認する。　
     * silent変更を利用する時だけ、invalid状態になる可能性がある。
     * @return {Boolean}
     */
    isValid: function() {
      return !this.validate(this.attributes);
    },

    /**
     * <code>NCMB.Object</code>をサブクラスをする方法以外、この関数は直接実行しない方がお勧めする。
     * この関数をオーバーライドし、メソッドに追加<code>set</code>と<code>save</code>のバリデーションを提供する可能。
     * 実装は以下のように可能である。
     * @param {Object} attrs 現在のバリデーションデーター。
     * @param {Object} options Backbone対応のオプションオブジェクト。
     * @return {} データーが正しくない場合、Falseを返却する。
     * @see NCMB.Object#set
     */
    validate: function(attrs, options) {
      if (_.has(attrs, "ACL") && !(attrs.ACL instanceof NCMB.ACL)) {
        return new NCMB.Error(NCMB.Error.OTHER_CAUSE,
                               "ACL must be a NCMB.ACL.");
      }
      return false;
    },

    /**
     * attrs の属性をバリデーションを実行し、成功の場合trueを返却する。 `error`コールバックが返却された場合、
     * `"errorイベントが"実行させるより、コールバックを使用した方がいい。
     */
    _validate: function(attrs, options) {
      if (options.silent || !this.validate) {
        return true;
      }
      attrs = _.extend({}, this.attributes, attrs);
      var error = this.validate(attrs, options);
      if (!error) {
        return true;
      }
      if (options && options.error) {
        options.error(this, error, options);
      } else {
        this.trigger('error', this, error, options);
      }
      return false;
    },

    /**
     * オブジェクトのACLを返却する。
     * @returns {NCMB.ACL} NCMB.ACLのインスタンス
     * @see NCMB.Object#get
     */
    getACL: function() {
      return this.get("acl");
    },

    /**
     * このオブジェクトにACLを設定する。
     * @param {NCMB.ACL} acl NCMB.ACLのインスタンス
     * @param {Object} options 　セットするためのBackbone対応のオプションオブジェクト(任意)
     * @return {Boolean} バリデーションに合格するかどうか結果を返却する。
     * @see NCMB.Object#set
     */
    setACL: function(acl, options) {
      return this.set("acl", acl, options);
    }

  });

  /**
   * Returns the appropriate subclass for making new instances of the given
   * className string.
   */
  NCMB.Object._getSubclass = function(className) {
    if (!_.isString(className)) {
      throw "NCMB.Object._getSubclass requires a string argument.";
    }
    var ObjectClass = NCMB.Object._classMap[className];
    if (!ObjectClass) {
      ObjectClass = NCMB.Object.extend(className);
      NCMB.Object._classMap[className] = ObjectClass;
    }
    return ObjectClass;
  };

  /**
   * Creates an instance of a subclass of NCMB.Object for the given classname.
   */
  NCMB.Object._create = function(className, attributes, options) {
    var ObjectClass = NCMB.Object._getSubclass(className);
    return new ObjectClass(attributes, options);
  };

  // Set up a map of className to class so that we can create new instances of
  // NCMB Objects from JSON automatically.
  NCMB.Object._classMap = {};

  NCMB.Object._extend = NCMB._extend;

  /**
  　* 渡されたNCMBクラス名からNCMB.Objectのサブクラスを作成する。
   *
   * <p>NCMBクラスの拡張はクラス拡張の最新のものから継承をする。　JSONをパースすることによりNCMB.
   * Objectは自動的に作成される場合、クラスの一番最近拡張を使用する。</p>
   *
   * <p>以下の方法で利用する:<pre>
   *     var MyClass = NCMB.Object.extend("MyClass", {
   *         <i>Instance properties</i>
   *     }, {
   *         <i>Class properties</i>
   *     });</pre>
   * か、Backbone対応の利用方法：or, for Backbone compatibility:<pre>
   *     var MyClass = NCMB.Object.extend({
   *         className: "MyClass",
   *         <i>Other instance properties</i>
   *     }, {
   *         <i>Class properties</i>
   *     });</pre></p>
   *
   * @param {String} className このモデルのNCMBクラス名
   * @param {Object} protoProps 関数にて返却したクラスのインスタンスにインスタンスの属性を追加
   * @param {Object} classProps 関数にて返却した値にクラスの属性の追加
   * @return {Class} 新しいNCMB.Objectのサブクラス。
   */
  NCMB.Object.extend = function(className, protoProps, classProps) {
    // Handle the case with only two args.
    if (!_.isString(className)) {
      if (className && _.has(className, "className")) {
        return NCMB.Object.extend(className.className, className, protoProps);
      } else {
        throw new Error(
            "NCMB.Object.extend's first argument should be the className.");
      }
    }

    // If someone tries to subclass "User", coerce it to the right type.
    if (className === "User") {
      classname = "user";
    }

    var NewClassObject = null;
    if (_.has(NCMB.Object._classMap, className)) {
      var OldClassObject = NCMB.Object._classMap[className];
      // This new subclass has been told to extend both from "this" and from
      // OldClassObject. This is multiple inheritance, which isn't supported.
      // For now, let's just pick one.
      NewClassObject = OldClassObject._extend(protoProps, classProps);
    } else {
      protoProps = protoProps || {};
      protoProps.className = className;
      NewClassObject = this._extend(protoProps, classProps);
    }
    // Extending a subclass should reuse the classname automatically.
    NewClassObject.extend = function(arg0) {
      if (_.isString(arg0) || (arg0 && _.has(arg0, "className"))) {
        return NCMB.Object.extend.apply(NewClassObject, arguments);
      }
      var newArguments = [className].concat(NCMB._.toArray(arguments));
      return NCMB.Object.extend.apply(NewClassObject, newArguments);
    };
    NCMB.Object._classMap[className] = NewClassObject;
    return NewClassObject;
  };
  NCMB.Object._findUnsavedChildren = function(object, children, files) {
    NCMB._traverse(object, function(object) {
      if (object instanceof NCMB.Object) {
        object._refreshCache();
        if (object.dirty()) {
          children.push(object);
        }
        return;
      }

      if (object instanceof NCMB.File) {
        if (!object.url()) {
          files.push(object);
        }
        return;
      }
    });
  };

  NCMB.Object._canBeSerializedAsValue = function(object) {
    var canBeSerializedAsValue = true;

    if (object instanceof NCMB.Object) {
      canBeSerializedAsValue = !!object.id;

    } else if (_.isArray(object)) {
      NCMB._arrayEach(object, function(child) {
        if (!NCMB.Object._canBeSerializedAsValue(child)) {
          canBeSerializedAsValue = false;
        }
      });

    } else if (_.isObject(object)) {
      NCMB._objectEach(object, function(child) {
        if (!NCMB.Object._canBeSerializedAsValue(child)) {
          canBeSerializedAsValue = false;
        }
      });
    }

    return canBeSerializedAsValue;
  };

  NCMB.Object._deepSaveAsync = function(object) {
    var unsavedChildren = [];
    var unsavedFiles = [];
    NCMB.Object._findUnsavedChildren(object, unsavedChildren, unsavedFiles);
    var promise = NCMB.Promise.as();
    _.each(unsavedFiles, function(file) {
      promise = promise.then(function() {
        return file.save();
      });
    });

    var objects = _.uniq(unsavedChildren);
    var remaining = _.uniq(objects);

    return promise.then(function() {
      return NCMB.Promise._continueWhile(function() {
        return remaining.length > 0;
      }, function() {

        // Gather up all the objects that can be saved in this batch.
        var batch = [];
        var newRemaining = [];
        NCMB._arrayEach(remaining, function(object) {
          // Limit batches to 20 objects.
          if (batch.length > 20) {
            newRemaining.push(object);
            return;
          }

          if (object._canBeSerialized()) {
            batch.push(object);
          } else {
            newRemaining.push(object);
          }
        });
        remaining = newRemaining;

        // If we can't save any objects, there must be a circular reference.
        if (batch.length === 0) {
          return NCMB.Promise.error(
            new NCMB.Error(NCMB.Error.OTHER_CAUSE,
                            "Tried to save a batch with a cycle."));
        }

        // Reserve a spot in every object's save queue.
        var readyToStart = NCMB.Promise.when(_.map(batch, function(object) {
          return object._allPreviousSaves || NCMB.Promise.as();
        }));
        var batchFinished = new NCMB.Promise();
        NCMB._arrayEach(batch, function(object) {
          object._allPreviousSaves = batchFinished;
        });

        // Save a single batch, whether previous saves succeeded or failed.
        return readyToStart._continueWith(function() {
          return NCMB._request("batch", null, null, "POST", {
            requests: _.map(batch, function(object) {
              var json = object._getSaveJSON();
              var method = "POST";

              var path = "/2013-09-01/classes/" + object.className; 
              if (object.id) {
                path = path + "/" + object.id;
                method = "PUT";
              }

              object._startSave();

              return {
                method: method,
                path: path,
                body: json
              };
            })

          }).then(function(response, status, xhr) {
            var error;
            NCMB._arrayEach(batch, function(object, i) {
              if (response[i].success) {
                object._finishSave(
                  object.parse(response[i].success, status, xhr));
              } else {
                error = error || response[i].error;
                object._cancelSave();
              }
            });
            if (error) {
              return NCMB.Promise.error(
                new NCMB.Error(error.code, error.error));
            }

          }).then(function(results) {
            batchFinished.resolve(results);
            return results;
          }, function(error) {
            batchFinished.reject(error);
            return NCMB.Promise.error(error);
          });
        });
      });
    }).then(function() {
      return object;
    });
  };
}(this));

/************************************************** NCMB Relation class *****************************************/

(function(root) {
  root.NCMB = root.NCMB || {};
  var NCMB = root.NCMB;
  var _ = NCMB._;

  /**
   * 渡されたオブジェクトとキーに対する新しいレリレーションを作成。コンストラクターは直接利用しない方がお勧めする。
   * @param {NCMB.Object} parent リレーションの親オブジェクト
   * @param {String} key 親でのリレーションのキー名
   * @see NCMB.Object#relation
   * @class
   *
   * <p>
   * 1対多や多対多のオブジェクトリレーションを実施するために利用する。 
   * NCMB.Relationのインスタンスを利用し、ある特定の親オブジェクトとキーで関連をさせることが可能である。
   * </p>
   */
  NCMB.Relation = function(parent, key) {
    this.parent = parent;
    this.key = key;
    this.targetClassName = null;
  };

  NCMB.Relation.prototype = {
    /**
     * 親とキーが正しいかを確認するリレーション
     */
    _ensureParentAndKey: function(parent, key) {
      this.parent = this.parent || parent;
      this.key = this.key || key;
      if (this.parent !== parent) {
        throw "Internal Error. Relation retrieved from two different Objects.";
      }
      if (this.key !== key) {
        throw "Internal Error. Relation retrieved from two different keys.";
      }
    },

    /**
     * NCMB.ObjectかNCMB.Objectsの配列をリレーションに追加する。
     * @param {} objects 追加する項目。
     */
    add: function(objects) {
      if (!_.isArray(objects)) {
        objects = [objects];
      }

      var change = new NCMB.Op.Relation(objects, []);
      this.parent.set(this.key, change);
      this.targetClassName = change._targetClassName;
    },

    /**
     * リレーションからNCMB.Objectか配列を削除する。
     * @param {} objects 削除する項目。
     */
    remove: function(objects) {
      if (!_.isArray(objects)) {
        objects = [objects];
      }

      var change = new NCMB.Op.Relation([], objects);
      this.parent.set(this.key, change);
      this.targetClassName = change._targetClassName;
    },

    /**
     * ディスクに保存するため、オブジェクトのJSONバージョンを返却する。
     * @return {Object}
     */
    toJSON: function() {
      return { "__type": "Relation", "className": this.targetClassName };
    },

    /**
     * リレーションオブジェクトに制限するNCMB.Queryを返却する。
     * @return {NCMB.Query}　クエリオブジェクト
     */
    query: function() {
      var targetClass;
      var query;
      if (!this.targetClassName) {
        targetClass = NCMB.Object._getSubclass(this.parent.className);
        query = new NCMB.Query(targetClass);
        query._extraOptions.redirectClassNameForKey = this.key;
      } else {
        targetClass = NCMB.Object._getSubclass(this.targetClassName);
        query = new NCMB.Query(targetClass);
      }
      query._addCondition("$relatedTo", "object", this.parent._toPointer());
      query._addCondition("$relatedTo", "key", this.key);
      return query;
    }
  };
}(this));

/************************************************** NCMB Operation class *****************************************/

(function(root) {
  root.NCMB = root.NCMB || {};
  var NCMB = root.NCMB;
  var _ = NCMB._;

  /**
   * @class
   * NCMB.OpはNCMB.Objectのフィールドに適応できる操作オペレーターである。例えば、<code>object.set("foo", "bar")</code>
   * はNCMB.Op.Setの利用例である。 <code>object.unset("foo")</code>はNCMB.Op.Unsetの一つの利用例である。
   * このような操作はNCMB.Objectに保存され、<code>object.save()</code> を実施すると、サーバーに送信する。
   * NCMB.Opのインスタンスは不変性である。直接NCMB.Opのサブクラスを作成しないで下さい。
   */
  NCMB.Op = function() {
    this._initialize.apply(this, arguments);
  };

  NCMB.Op.prototype = {
    _initialize: function() {}
  };

  _.extend(NCMB.Op, {
    /**
     * To create a new Op, call NCMB.Op._extend();
     */
    _extend: NCMB._extend,

    // A map of __op string to decoder function.
    _opDecoderMap: {},

    /**
     * Registers a function to convert a json object with an __op field into an
     * instance of a subclass of NCMB.Op.
     */
    _registerDecoder: function(opName, decoder) {
      NCMB.Op._opDecoderMap[opName] = decoder;
    },

    /**
     * Converts a json object into an instance of a subclass of NCMB.Op.
     */
    _decode: function(json) {
      var decoder = NCMB.Op._opDecoderMap[json.__op];
      if (decoder) {
        return decoder(json);
      } else {
        return undefined;
      }
    }
  });

  /*
   * バッチopsのハンドラーを追加する
   */
  NCMB.Op._registerDecoder("Batch", function(json) {
    var op = null;
    NCMB._arrayEach(json.ops, function(nextOp) {
      nextOp = NCMB.Op._decode(nextOp);
      op = nextOp._mergeWithPrevious(op);
    });
    return op;
  });

  /**
   * @class
   * 
   * Setの操作、 NCMB.Object.setによってフィールドが変更されたか、可変のコンテナーが変更されたかを表す。
   */
  NCMB.Op.Set = NCMB.Op._extend(/** @lends NCMB.Op.Set.prototype */ {
    _initialize: function(value) {
      this._value = value;
    },

    /**
     * セットした新しい値を取得する。
     */
    value: function() {
      return this._value;
    },

    /**
     * 操作のNCMBに送信する時に対応するJSONバージョンを取得する。
     * @return {Object}　JSONオブジェクト
     */
    toJSON: function() {
      return NCMB._encode(this.value());
    },

    _mergeWithPrevious: function(previous) {
      return this;
    },

    _estimate: function(oldValue) {
      return this.value();
    }
  });

  /**
   * どんなフィールドを削除するか指定するNCMB.Op.Unset._estimateが返却した値である。　
   * 基本的には_UNSETがオブジェクトの値である場合、キーの値を取り除く必要がある。
   */
  NCMB.Op._UNSET = {};

  /**
   * @class
   * Unset操作はこのフィールドが削除されたことを指定する。
   */
  NCMB.Op.Unset = NCMB.Op._extend(/** @lends NCMB.Op.Unset.prototype */ {
    /**
     * NCMBに送信するための対応JSON表式を取得する。
     * @return {Object}
     */
    toJSON: function() {
      return { __op: "Unset" };
    },

    _mergeWithPrevious: function(previous) {
      return this;
    },

    _estimate: function(oldValue) {
      return NCMB.Op._UNSET;
    }
  });

  NCMB.Op._registerDecoder("Delete", function(json) {
    return new NCMB.Op.Unset();
  });

  /**
   * @class
   * Increment操作は単位の操作であり、フィールドの数値を渡された量で増加させる。
   */
  NCMB.Op.Increment = NCMB.Op._extend(
      /** @lends NCMB.Op.Increment.prototype */ {

    _initialize: function(amount) {
      this._amount = amount;
    },

    /**
     * 増加させた量を取得する。
     * @return {Number} 増加させた量を返却する。
     */
    amount: function() {
      return this._amount;
    },

    /**
     * NCMBに送信するための対応JSON表式を取得する。
     * @return {Object}
     */
    toJSON: function() {
      return { __op: "Increment", amount: this._amount };
    },

    _mergeWithPrevious: function(previous) {
      if (!previous) {
        return this;
      } else if (previous instanceof NCMB.Op.Unset) {
        return new NCMB.Op.Set(this.amount());
      } else if (previous instanceof NCMB.Op.Set) {
        return new NCMB.Op.Set(previous.value() + this.amount());
      } else if (previous instanceof NCMB.Op.Increment) {
        return new NCMB.Op.Increment(this.amount() + previous.amount());
      } else {
        throw "Op is invalid after previous op.";
      }
    },

    _estimate: function(oldValue) {
      if (!oldValue) {
        return this.amount();
      }
      return oldValue + this.amount();
    }
  });

  NCMB.Op._registerDecoder("Increment", function(json) {
    return new NCMB.Op.Increment(json.amount);
  });

  /**
   * @class
   * Addは単位の操作であり、フィールドに保持された配列に、渡されたオブジェクトを付加させる。
   */
  NCMB.Op.Add = NCMB.Op._extend(/** @lends NCMB.Op.Add.prototype */ {
    _initialize: function(objects) {
      this._objects = objects;
    },

    /**
     * 配列に付加されるオブジェクトを取得する。
     * @return {Array} 配列に付加されるオブジェクトかオブジェクトの配列。
     */
    objects: function() {
      return this._objects;
    },

    /**
     * NCMBに送信するための対応JSON表式を取得する。
     * @return {Object}
     */
    toJSON: function() {
      return { __op: "Add", objects: NCMB._encode(this.objects()) };
    },

    _mergeWithPrevious: function(previous) {
      if (!previous) {
        return this;
      } else if (previous instanceof NCMB.Op.Unset) {
        return new NCMB.Op.Set(this.objects());
      } else if (previous instanceof NCMB.Op.Set) {
        return new NCMB.Op.Set(this._estimate(previous.value()));
      } else if (previous instanceof NCMB.Op.Add) {
        return new NCMB.Op.Add(previous.objects().concat(this.objects()));
      } else {
        throw "Op is invalid after previous op.";
      }
    },

    _estimate: function(oldValue) {
      if (!oldValue) {
        return _.clone(this.objects());
      } else {
        return oldValue.concat(this.objects());
      }
    }
  });

  NCMB.Op._registerDecoder("Add", function(json) {
    return new NCMB.Op.Add(NCMB._decode(undefined, json.objects));
  });

  /**
   * @class
   * AddUniqueは単位操作であり、フィールドに保持されている配列に存在しない限り、渡されたオブジェクトを配列に追加を行う操作である。
   */
  NCMB.Op.AddUnique = NCMB.Op._extend(
      /** @lends NCMB.Op.AddUnique.prototype */ {

    _initialize: function(objects) {
      this._objects = _.uniq(objects);
    },

    /**
     * 配列に追加するオブジェクトを取得する。
     * @return {Array} 　配列に追加するオブジェクトを返却する。
     */
    objects: function() {
      return this._objects;
    },

    /**
     * NCMBに送信するための対応JSON表式を取得する。
     * @return {Object}
     */
    toJSON: function() {
      return { __op: "AddUnique", objects: NCMB._encode(this.objects()) };
    },

    _mergeWithPrevious: function(previous) {
      if (!previous) {
        return this;
      } else if (previous instanceof NCMB.Op.Unset) {
        return new NCMB.Op.Set(this.objects());
      } else if (previous instanceof NCMB.Op.Set) {
        return new NCMB.Op.Set(this._estimate(previous.value()));
      } else if (previous instanceof NCMB.Op.AddUnique) {
        return new NCMB.Op.AddUnique(this._estimate(previous.objects()));
      } else {
        throw "Op is invalid after previous op.";
      }
    },

    _estimate: function(oldValue) {
      if (!oldValue) {
        return _.clone(this.objects());
      } else {
        // We can't just take the _.uniq(_.union(...)) of oldValue and
        // this.objects, because the uniqueness may not apply to oldValue
        // (especially if the oldValue was set via .set())
        var newValue = _.clone(oldValue);
        NCMB._arrayEach(this.objects(), function(obj) {
          if (obj instanceof NCMB.Object && obj.id) {
            var matchingObj = _.find(newValue, function(anObj) {
              return (anObj instanceof NCMB.Object) && (anObj.id === obj.id);
            });
            if (!matchingObj) {
              newValue.push(obj);
            } else {
              var index = _.indexOf(newValue, matchingObj);
              newValue[index] = obj;
            }
          } else if (!_.contains(newValue, obj)) {
            newValue.push(obj);
          }
        });
        return newValue;
      }
    }
  });

  NCMB.Op._registerDecoder("AddUnique", function(json) {
    return new NCMB.Op.AddUnique(NCMB._decode(undefined, json.objects));
  });

  /**
   * @class
   * Removeは単位操作である。フィールドに保持されている配列から、渡されたオブジェクトを取り除く。
   */
  NCMB.Op.Remove = NCMB.Op._extend(/** @lends NCMB.Op.Remove.prototype */ {
    _initialize: function(objects) {
      this._objects = _.uniq(objects);
    },

    /**
     * 取り除くオブジェクトを取得する。
     * @return {Array} 取り除くオブジェクトかオブジェクトの配列
     */
    objects: function() {
      return this._objects;
    },

    /**
     * NCMBに送信するための対応JSON表式を取得する。
     * @return {Object}
     */
    toJSON: function() {
      return { __op: "Remove", objects: NCMB._encode(this.objects()) };
    },

    _mergeWithPrevious: function(previous) {
      if (!previous) {
        return this;
      } else if (previous instanceof NCMB.Op.Unset) {
        return previous;
      } else if (previous instanceof NCMB.Op.Set) {
        return new NCMB.Op.Set(this._estimate(previous.value()));
      } else if (previous instanceof NCMB.Op.Remove) {
        return new NCMB.Op.Remove(_.union(previous.objects(), this.objects()));
      } else {
        throw "Op is invalid after previous op.";
      }
    },

    _estimate: function(oldValue) {
      if (!oldValue) {
        return [];
      } else {
        var newValue = _.difference(oldValue, this.objects());
        // If there are saved NCMB Objects being removed, also remove them.
        NCMB._arrayEach(this.objects(), function(obj) {
          if (obj instanceof NCMB.Object && obj.id) {
            newValue = _.reject(newValue, function(other) {
              return (other instanceof NCMB.Object) && (other.id === obj.id);
            });
          }
        });
        return newValue;
      }
    }
  });

  NCMB.Op._registerDecoder("Remove", function(json) {
    return new NCMB.Op.Remove(NCMB._decode(undefined, json.objects));
  });

  /**
   * @class
   * Relationは単位操作です。　フィールドはNCMB.Relationのインスタンスであり、
   * リレーションにオブジェクトを追加、削除されているか指定する操作である。
   */
  NCMB.Op.Relation = NCMB.Op._extend(
      /** @lends NCMB.Op.Relation.prototype */ {

    _initialize: function(adds, removes) {
      this._targetClassName = null;

      var self = this;

      var pointerToId = function(object) {
        if (object instanceof NCMB.Object) {
          if (!object.id) {
            throw "You can't add an unsaved NCMB.Object to a relation.";
          }
          if (!self._targetClassName) {
            self._targetClassName = object.className;
          }
          if (self._targetClassName !== object.className) {
            throw "Tried to create a NCMB.Relation with 2 different types: " +
                  self._targetClassName + " and " + object.className + ".";
          }
          return object.id;
        }
        return object;
      };

      this.relationsToAdd = _.uniq(_.map(adds, pointerToId));
      this.relationsToRemove = _.uniq(_.map(removes, pointerToId));
    },

    /**
     * リレーションに追加する予定のフェッチしていないNCMB.Objectの配列を取得する。
     * @return {Array}
     */
    added: function() {
      var self = this;
      return _.map(this.relationsToAdd, function(objectId) {
        var object = NCMB.Object._create(self._targetClassName);
        object.id = objectId;
        return object;
      });
    },

    /**
     * リレーションから削除する予定のフェッチしていないNCMB.Objectの配列を取得する。
     * @return {Array}
     */
    removed: function() {
      var self = this;
      return _.map(this.relationsToRemove, function(objectId) {
        var object = NCMB.Object._create(self._targetClassName);
        object.id = objectId;
        return object;
      });
    },

    /**
     * NCMBに送信するための対応JSON表式を取得する。
     * @return {Object}
     */
    toJSON: function() {
      var adds = null;
      var removes = null;
      var self = this;
      var idToPointer = function(id) {
        return { __type: 'Pointer',
                 className: self._targetClassName,
                 objectId: id };
      };
      var pointers = null;
      if (this.relationsToAdd.length > 0) {
        pointers = _.map(this.relationsToAdd, idToPointer);
        adds = { "__op": "AddRelation", "objects": pointers };
      }

      if (this.relationsToRemove.length > 0) {
        pointers = _.map(this.relationsToRemove, idToPointer);
        removes = { "__op": "RemoveRelation", "objects": pointers };
      }

      if (adds && removes) {
        return { "__op": "Batch", "ops": [adds, removes]};
      }

      return adds || removes || {};
    },

    _mergeWithPrevious: function(previous) {
      if (!previous) {
        return this;
      } else if (previous instanceof NCMB.Op.Unset) {
        throw "You can't modify a relation after deleting it.";
      } else if (previous instanceof NCMB.Op.Relation) {
        if (previous._targetClassName &&
            previous._targetClassName !== this._targetClassName) {
          throw "Related object must be of class " + previous._targetClassName +
              ", but " + this._targetClassName + " was passed in.";
        }
        var newAdd = _.union(_.difference(previous.relationsToAdd,
                                          this.relationsToRemove),
                             this.relationsToAdd);
        var newRemove = _.union(_.difference(previous.relationsToRemove,
                                             this.relationsToAdd),
                                this.relationsToRemove);

        var newRelation = new NCMB.Op.Relation(newAdd, newRemove);
        newRelation._targetClassName = this._targetClassName;
        return newRelation;
      } else {
        throw "Op is invalid after previous op.";
      }
    },

    _estimate: function(oldValue, object, key) {
      if (!oldValue) {
        var relation = new NCMB.Relation(object, key);
        relation.targetClassName = this._targetClassName;
      } else if (oldValue instanceof NCMB.Relation) {
        if (this._targetClassName) {
          if (oldValue.targetClassName) {
            if (oldValue.targetClassName !== this._targetClassName) {
              throw "Related object must be a " + oldValue.targetClassName +
                  ", but a " + this._targetClassName + " was passed in.";
            }
          } else {
            oldValue.targetClassName = this._targetClassName;
          }
        }
        return oldValue;
      } else {
        throw "Op is invalid after previous op.";
      }
    }
  });

  NCMB.Op._registerDecoder("AddRelation", function(json) {
    return new NCMB.Op.Relation(NCMB._decode(undefined, json.objects), []);
  });
  NCMB.Op._registerDecoder("RemoveRelation", function(json) {
    return new NCMB.Op.Relation([], NCMB._decode(undefined, json.objects));
  });
}(this));

/************************************************** NCMB File class *****************************************/

(function(root) {
  root.NCMB = root.NCMB || {};
  var NCMB = root.NCMB;
  var _ = NCMB._;

  var b64Digit = function(number) {
    if (number < 26) {
      return String.fromCharCode(65 + number);
    }
    if (number < 52) {
      return String.fromCharCode(97 + (number - 26));
    }
    if (number < 62) {
      return String.fromCharCode(48 + (number - 52));
    }
    if (number === 62) {
      return "+";
    }
    if (number === 63) {
      return "/";
    }
    throw "Tried to encode large digit " + number + " in base64.";
  };

  var encodeBase64 = function(array) {
    var chunks = [];
    chunks.length = Math.ceil(array.length / 3);
    _.times(chunks.length, function(i) {
      var b1 = array[i * 3];
      var b2 = array[i * 3 + 1] || 0;
      var b3 = array[i * 3 + 2] || 0;

      var has2 = (i * 3 + 1) < array.length;
      var has3 = (i * 3 + 2) < array.length;

      chunks[i] = [
        b64Digit((b1 >> 2) & 0x3F),
        b64Digit(((b1 << 4) & 0x30) | ((b2 >> 4) & 0x0F)),
        has2 ? b64Digit(((b2 << 2) & 0x3C) | ((b3 >> 6) & 0x03)) : "=",
        has3 ? b64Digit(b3 & 0x3F) : "="
      ].join("");
    });
    return chunks.join("");
  };

  
  // ファイルの拡張子とMIMEタイプのリストは以下リンクに参考：
  // http://stackoverflow.com/questions/58510/using-net-how-can-you-find-the-
  //     mime-type-of-a-file-based-on-the-file-signature
  var mimeTypes = {
    ai: "application/postscript",
    aif: "audio/x-aiff",
    aifc: "audio/x-aiff",
    aiff: "audio/x-aiff",
    asc: "text/plain",
    atom: "application/atom+xml",
    au: "audio/basic",
    avi: "video/x-msvideo",
    bcpio: "application/x-bcpio",
    bin: "application/octet-stream",
    bmp: "image/bmp",
    cdf: "application/x-netcdf",
    cgm: "image/cgm",
    "class": "application/octet-stream",
    cpio: "application/x-cpio",
    cpt: "application/mac-compactpro",
    csh: "application/x-csh",
    css: "text/css",
    dcr: "application/x-director",
    dif: "video/x-dv",
    dir: "application/x-director",
    djv: "image/vnd.djvu",
    djvu: "image/vnd.djvu",
    dll: "application/octet-stream",
    dmg: "application/octet-stream",
    dms: "application/octet-stream",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml." +
          "document",
    dotx: "application/vnd.openxmlformats-officedocument.wordprocessingml." +
          "template",
    docm: "application/vnd.ms-word.document.macroEnabled.12",
    dotm: "application/vnd.ms-word.template.macroEnabled.12",
    dtd: "application/xml-dtd",
    dv: "video/x-dv",
    dvi: "application/x-dvi",
    dxr: "application/x-director",
    eps: "application/postscript",
    etx: "text/x-setext",
    exe: "application/octet-stream",
    ez: "application/andrew-inset",
    gif: "image/gif",
    gram: "application/srgs",
    grxml: "application/srgs+xml",
    gtar: "application/x-gtar",
    hdf: "application/x-hdf",
    hqx: "application/mac-binhex40",
    htm: "text/html",
    html: "text/html",
    ice: "x-conference/x-cooltalk",
    ico: "image/x-icon",
    ics: "text/calendar",
    ief: "image/ief",
    ifb: "text/calendar",
    iges: "model/iges",
    igs: "model/iges",
    jnlp: "application/x-java-jnlp-file",
    jp2: "image/jp2",
    jpe: "image/jpeg",
    jpeg: "image/jpeg",
    jpg: "image/jpeg",
    js: "application/x-javascript",
    kar: "audio/midi",
    latex: "application/x-latex",
    lha: "application/octet-stream",
    lzh: "application/octet-stream",
    m3u: "audio/x-mpegurl",
    m4a: "audio/mp4a-latm",
    m4b: "audio/mp4a-latm",
    m4p: "audio/mp4a-latm",
    m4u: "video/vnd.mpegurl",
    m4v: "video/x-m4v",
    mac: "image/x-macpaint",
    man: "application/x-troff-man",
    mathml: "application/mathml+xml",
    me: "application/x-troff-me",
    mesh: "model/mesh",
    mid: "audio/midi",
    midi: "audio/midi",
    mif: "application/vnd.mif",
    mov: "video/quicktime",
    movie: "video/x-sgi-movie",
    mp2: "audio/mpeg",
    mp3: "audio/mpeg",
    mp4: "video/mp4",
    mpe: "video/mpeg",
    mpeg: "video/mpeg",
    mpg: "video/mpeg",
    mpga: "audio/mpeg",
    ms: "application/x-troff-ms",
    msh: "model/mesh",
    mxu: "video/vnd.mpegurl",
    nc: "application/x-netcdf",
    oda: "application/oda",
    ogg: "application/ogg",
    pbm: "image/x-portable-bitmap",
    pct: "image/pict",
    pdb: "chemical/x-pdb",
    pdf: "application/pdf",
    pgm: "image/x-portable-graymap",
    pgn: "application/x-chess-pgn",
    pic: "image/pict",
    pict: "image/pict",
    png: "image/png", 
    pnm: "image/x-portable-anymap",
    pnt: "image/x-macpaint",
    pntg: "image/x-macpaint",
    ppm: "image/x-portable-pixmap",
    ppt: "application/vnd.ms-powerpoint",
    pptx: "application/vnd.openxmlformats-officedocument.presentationml." +
          "presentation",
    potx: "application/vnd.openxmlformats-officedocument.presentationml." +
          "template",
    ppsx: "application/vnd.openxmlformats-officedocument.presentationml." +
          "slideshow",
    ppam: "application/vnd.ms-powerpoint.addin.macroEnabled.12",
    pptm: "application/vnd.ms-powerpoint.presentation.macroEnabled.12",
    potm: "application/vnd.ms-powerpoint.template.macroEnabled.12",
    ppsm: "application/vnd.ms-powerpoint.slideshow.macroEnabled.12",
    ps: "application/postscript",
    qt: "video/quicktime",
    qti: "image/x-quicktime",
    qtif: "image/x-quicktime",
    ra: "audio/x-pn-realaudio",
    ram: "audio/x-pn-realaudio",
    ras: "image/x-cmu-raster",
    rdf: "application/rdf+xml",
    rgb: "image/x-rgb",
    rm: "application/vnd.rn-realmedia",
    roff: "application/x-troff",
    rtf: "text/rtf",
    rtx: "text/richtext",
    sgm: "text/sgml",
    sgml: "text/sgml",
    sh: "application/x-sh",
    shar: "application/x-shar",
    silo: "model/mesh",
    sit: "application/x-stuffit",
    skd: "application/x-koan",
    skm: "application/x-koan",
    skp: "application/x-koan",
    skt: "application/x-koan",
    smi: "application/smil",
    smil: "application/smil",
    snd: "audio/basic",
    so: "application/octet-stream",
    spl: "application/x-futuresplash",
    src: "application/x-wais-source",
    sv4cpio: "application/x-sv4cpio",
    sv4crc: "application/x-sv4crc",
    svg: "image/svg+xml",
    swf: "application/x-shockwave-flash",
    t: "application/x-troff",
    tar: "application/x-tar",
    tcl: "application/x-tcl",
    tex: "application/x-tex",
    texi: "application/x-texinfo",
    texinfo: "application/x-texinfo",
    tif: "image/tiff",
    tiff: "image/tiff",
    tr: "application/x-troff",
    tsv: "text/tab-separated-values",
    txt: "text/plain",
    ustar: "application/x-ustar",
    vcd: "application/x-cdlink",
    vrml: "model/vrml",
    vxml: "application/voicexml+xml",
    wav: "audio/x-wav",
    wbmp: "image/vnd.wap.wbmp",
    wbmxl: "application/vnd.wap.wbxml",
    wml: "text/vnd.wap.wml",
    wmlc: "application/vnd.wap.wmlc",
    wmls: "text/vnd.wap.wmlscript",
    wmlsc: "application/vnd.wap.wmlscriptc",
    wrl: "model/vrml",
    xbm: "image/x-xbitmap",
    xht: "application/xhtml+xml",
    xhtml: "application/xhtml+xml",
    xls: "application/vnd.ms-excel",
    xml: "application/xml",
    xpm: "image/x-xpixmap",
    xsl: "application/xml",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    xltx: "application/vnd.openxmlformats-officedocument.spreadsheetml." +
          "template",
    xlsm: "application/vnd.ms-excel.sheet.macroEnabled.12",
    xltm: "application/vnd.ms-excel.template.macroEnabled.12",
    xlam: "application/vnd.ms-excel.addin.macroEnabled.12",
    xlsb: "application/vnd.ms-excel.sheet.binary.macroEnabled.12",
    xslt: "application/xslt+xml",
    xul: "application/vnd.mozilla.xul+xml",
    xwd: "image/x-xwindowdump",
    xyz: "chemical/x-xyz",
    zip: "application/zip"
  };

  /**
   * 
   * FileReaderを利用し、ファイルを読み込む
   * @param file {File} 読み込むファイル
   * @param type {String}  オーバーライドのためのMIMEタイプ（任意）
   * @return {NCMB.Promise} base64-encodedデーターの列とMIMEタイプを返却するプロミス
   */
   
  var readAsync = function(file, type) {
    var promise = new NCMB.Promise();

    if (typeof(FileReader) === "undefined") {
      return NCMB.Promise.error(new NCMB.Error(
          -1, "Attempted to use a FileReader on an unsupported browser."));
    }

    var reader = new FileReader();
    reader.onloadend = function() {
      if (reader.readyState !== 2) {
        promise.reject(new NCMB.Error(-1, "Error reading file."));
        return;
      }
      var dataURL = reader.result;
      // Guess the content type from the extension if we need to.
      var extension = /\.([^.]*)$/.exec(file.name);
      if (extension) {
        extension = extension[1].toLowerCase();
      }
      var guessedType = type || mimeTypes[extension] || "text/plain";

      //On chrome return the suitable file
      if (dataURL === "data:") {
        if (type)
          dataURL = "data:" + type + ";base64,";
        else {
          // Insert the datatype　手動的
          dataURL = "data:" + guessedType + ";base64,";
        }
      }
      
      var matches = /^data:([^;]*);base64,(.*)$/.exec(dataURL);
      var matches_android = /^data:base64,(.*)$/.exec(dataURL);
      if (!matches) {
        if (!matches_android) {
          promise.reject(
              new NCMB.Error(-1, "Unable to interpret data URL: " + dataURL));
          return;          
        }
        else { //android        
          promise.resolve(matches_android[1], type || guessedType);  
        }
      } else {
        promise.resolve(matches[2], type || matches[1]);        
      }
    };
    reader.readAsDataURL(file);
    return promise;
  };

  /**
   *
   * @class
   * 
   * NCMB.FileはNCMBに保存するファイルのローカル表するために利用する。
   * NCMB.Fileを利用することで、ファイルをアップやダウンロード可能になる。
   * <br>※ブラウザーの仕様により対応しない場合もあります。
   * <br>※テストした環境： Firefox, Chrome, Android 4.1, iOS 6.0, iOS 7.0 ブラウザー
   *　
   * @param name {String} ファイル名、ファイル名はユニークな値である。
   * @param data {Array} ファイルデーター、以下のフォーマットががる。
   *     1. or文字数字などのようなバイト値か
   *     2. { base64: "..." }のbase64エンコードされたオブジェクト
   *     3. ファイルアップロードコントロールから選択したファイルオブジェクト。
   * (3)は以下のブラウザー対象となる。Firefox 3.6+, Safari 6.0.2+, Chrome 7+, and IE 10+.
   *        例:<pre>
   * var fileUploadControl = $("#profilePhotoFileUpload")[0];
   * if (fileUploadControl.files.length > 0) {
   *   var file = fileUploadControl.files[0];
   *   var name = "photo.jpg";
   *   var NCMBFile = new NCMB.File(name, file);
   *   NCMBFile.save().then(function() {
   *     // The file has been saved to NCMB.
   *   }, function(error) {
   *     // The file either could not be read, or could not be saved to NCMB.
   *   });
   * }</pre>
   * @param type {String} 任意、ファイル用のコンテンツタイプのヘッダー。指定しない場合、拡張子からコンテンツタイプが判断される。
   * @memberOf
   */

 NCMB.File = NCMB.Object.extend("File",   /** @lends NCMB.File.prototype */
  {
    
    constructor: function(name, data, type, acl) {
      this._name = name;
      this._data = data;
      this._type = type; 
      this._newFlag = true;
      if (_.isString(name) && (acl instanceof NCMB.ACL)) {
        NCMB.Object.prototype.constructor.call(this, null, null);
        this.ACL = acl;
      } else {
        NCMB.Object.prototype.constructor.call(this, name, data, type, acl);
      }
      // Guess the content type from the extension i//f we need to.
      var extension = /\.([^.]*)$/.exec(name);
      if (extension) {
        extension = extension[1].toLowerCase();
      }
      var guessedType = type || mimeTypes[extension] || "text/plain";
      if(!type) this._type = guessedType; //set type

      //this to change to file data -> no need
      if (_.isArray(data)) {
        //console.log("is array data");
        this._source = NCMB.Promise.as(encodeBase64(data), guessedType);
      } else if (data && data.base64) {
        //console.log("is data base64");
        this._source = NCMB.Promise.as(data.base64, guessedType);
      } else if (typeof(File) !== "undefined" && data instanceof File) {
        //console.log("is data undefined instance of file");
        this._source = readAsync(data, type);
      } else if (_.isString(data)) {
        throw "Creating a NCMB.File from a String is not yet supported.";
      } 
      else {//data read from nodejs
        this._source = NCMB.Promise.as(data, guessedType);
      } 
    },

  /**
   * ファイルの名前を取得する。保存する前、ファイル名はユーザーに渡された値である。保存を行った後、名前が確定される。
   */
    getName: function() {
      return this._name;
    },

  /**
   * NCMBクラウドにファイルを保存する。
   * @param {Object} options Backbone対応するオプション
   * @return {NCMB.Promise} 保存が完了した後に、解決したプロミスを返却する。
   * @function
   */
    save: function(options) {   
      var self = this;
      if (!self._previousSave) {
        self._previousSave = self._source.then(function(base64, type) {
          self._dataBase64 = base64;
          var data = {};
          data.file = self._data;
          if(self.ACL) {
            data.acl = JSON.stringify(self.ACL);
          }
          else {
            data.acl = JSON.stringify({ "*" : { "read" : true , "write" : true }}); //default is public read write
          }
         
          if (data.file) {
            return NCMB._request("files", self._name, null, 'POST', data);
          } else {
            return NCMB._request("files", self._name, null, 'PUT', data);
          }
        }).then(function(response) {
          self._name = response.fileName;
          return self;
        });
      }
      return self._previousSave._thenRunCallbacks(options);
    },
  
  /**
   * NCMBストレージにあるファイルを削除する。
   * @param {Object} options Backbone対応するオプション
   * @return {NCMB.Promise} 削除が完了した後に、解決したプロミスを返却する。
   * @function
   */
    destroy: function(options) {
      options = options || {};
      var model = this;
      var triggerDestroy = function() {
        model.trigger('destroy', model, model.collection, options);
      };
      var request =
          NCMB._request("files", self._name, null, 'DELETE');
      return request.then(function() {
        if (options.wait) {
          triggerDestroy();
        }
        return model;
      })._thenRunCallbacks(options, this);
    },

  /**
   * NCMBストレージからファイルを取得する。取得してから、getData()メソッドを利用しファイルのバイナリデーターを取得する。
   * @param {Object} options Backbone対応するオプション
   * @return {NCMB.Promise} 取得が完了した後に、解決したプロミスを返却する。
   * @function
   */
    fetch: function(options) {
       var self = this;
       return NCMB._request("files", this._name, null ,'GET', null).then(
        function(response){  
          var s_response = '';
          for (i = 0; i < response.length; i++){
              s_response += String.fromCharCode(response.charCodeAt(i) & 0xff);
          }
          self._data = s_response;
          self._dataBase64 = btoa(unescape(encodeURIComponent(response)));
          return self;
        })._thenRunCallbacks(options);
    }, 

    /**
     * 渡されたセレクターに画像ファイルを生成する。.png, .bmp, .gif, .jpegファイルタイプはサポートされている。
     * @param {Object} image_canvas_selector 画像要素のセレクター
     * @function
     */
    
    fetchImgSource: function(image_canvas_selector) {
        var s_response = this.getData();
        if (s_response) {
              this._fetchImgSource(image_canvas_selector, s_response);
        } else {
           var self = this;
           self.fetch().then(function(){
              self._fetchImgSource(image_canvas_selector, self._data);
           });
        }
    },

    _fetchImgSource: function(image_canvas_selector, s_response) {
  
        // 画像形式の推定
        var header = s_response.toString().substring(0,9); 
        var type;
        if (header.match(/^\x89PNG/)) {
            type = 'png';
        } else if (header.match(/^BM/)){
            type = 'bmp';
        } else if (header.match(/^GIF87a/) || header.match(/^GIF89a/)) {
            type = 'gif';
        } else if (header.match(/^\xff\xd8/)) {
            type = 'jpeg';
        } else {
            console.log("画像ファイルの形式が特定できないため中断しました");
            return;
        }
        // base64変換してimgタグに直書き込み
        var data = 'data:image/' + type + ';base64,' + window.btoa(s_response);
        image_canvas_selector.src = data;
        return;
    },

  
    /**
     * ファイルのコンテンツタイプを取得する。
     */
    getContentType: function() {
      return this._type;
    },

    /**
     * ファイルのデーターを取得する。fetch()によりファイルのデーターをサーバーから取得を行なう。
     */

    getData: function() {
      return this._data;
    }

  });
}(this));

/************************************************** NCMB ACL class *****************************************/

/*global navigator: false */
(function(root) {
  root.NCMB = root.NCMB || {};
  var NCMB = root.NCMB;
  var _ = NCMB._;

  var PUBLIC_KEY = "*";

  /**
   * 新しいACL Access control を作成する。
   * 変数がない時、ACLはすべてユーザーに権限なしを指定する。
   * 変数はNCMB.Userの場合、ACLはそのユーザーに読み込みと更新権限を指定する。
   * 変数がJSONオブジェクトである場合、そのオブジェクトがtoJSON()でACLとして読み取る。
   * @see NCMB.Object#setACL
   * @class
   *
   * <p>ユーザーのアクセスを制限させるため、ACLアクセス制限設定はすべて<code>NCMB.Object</code>に追加可能である。
   * ACLクラスはアプリケーション内の会員のアクセス権を設定するものである。</p>
   *
   */
  NCMB.ACL = function(arg1) {
    var self = this;
    self.permissionsById = {};
    if (_.isObject(arg1)) {
      if (arg1 instanceof NCMB.User) {
        self.setReadAccess(arg1, true);
        self.setWriteAccess(arg1, true);
      } else {
        if (_.isFunction(arg1)) {
          throw "NCMB.ACL() called with a function.  Did you forget ()?";
        }
        NCMB._objectEach(arg1, function(accessList, userId) {
          if (!_.isString(userId)) {
            throw "Tried to create an ACL with an invalid userId.";
          }
          self.permissionsById[userId] = {};
          NCMB._objectEach(accessList, function(allowed, permission) {
            if (permission !== "read" && permission !== "write") {
              throw "Tried to create an ACL with an invalid permission type.";
            }
            if (!_.isBoolean(allowed)) {
              throw "Tried to create an ACL with an invalid permission value.";
            }
            self.permissionsById[userId][permission] = allowed;
          });
        });
      }
    }
  };

  /**
   * ACLのJSONエンコードされたデーター。
   * @return {Object}　オブジェクト
   */
  NCMB.ACL.prototype.toJSON = function() {
    return _.clone(this.permissionsById);
  };

  NCMB.ACL.prototype._setAccess = function(accessType, userId, allowed) {
    if (userId instanceof NCMB.User) {
      userId = userId.id;
    } else if (userId instanceof NCMB.Role) {
      userId = "role:" + userId.getName();
    }

    if (!_.isString(userId)) {
      throw "userId must be a string.";
    }
    if (!_.isBoolean(allowed)) {
      throw "allowed must be either true or false.";
    }
    var permissions = this.permissionsById[userId];
    if (!permissions) {
      if (!allowed) {
        // The user already doesn't have this permission, so no action needed.
        return;
      } else {
        permissions = {};
        this.permissionsById[userId] = permissions;
      }
    }

    if (allowed) {
      this.permissionsById[userId][accessType] = true;
    } else {
      delete permissions[accessType];
      if (_.isEmpty(permissions)) {
        delete permissions[userId];
      }
    }
  };

  NCMB.ACL.prototype._getAccess = function(accessType, userId) {
    if (userId instanceof NCMB.User) {
      userId = userId.id;
    } else if (userId instanceof NCMB.Role) {
      userId = "role:" + userId.getName();
    }
    var permissions = this.permissionsById[userId];
    if (!permissions) {
      return false;
    }
    return permissions[accessType] ? true : false;
  };

  /**
   * 渡されたユーザーがオブジェクトを読み込み権限を許可する。
   * @param userId NCMB.UserのインスタンスかユーザーのオブジェクトID。
   * @param {Boolean} allowed ユーザーがアクセス権限を許可するかどうか。
   */
  NCMB.ACL.prototype.setReadAccess = function(userId, allowed) {
    this._setAccess("read", userId, allowed);
  };

  /**
   * 渡されたユーザーIDかuserオブジェクトがオブジェクトを読み込み権限を持っているかどうか。 
   * getPublicReadAccessがtrueの場合かユーザーが属するロールはアクセス許可される場合、
   * この関数でfalseが返却されたとしても、ユーザーがアクセス可能である。
   * @param userId NCMB.UserのインスタンスかユーザーのオブジェクトIDかNCMB.Role.
   * @return {Boolean}
   */
  NCMB.ACL.prototype.getReadAccess = function(userId) {
    return this._getAccess("read", userId);
  };

  /** 
   * 渡されたユーザーがオブジェクトを更新する権限を許可する。
   * @param userId NCMB.UserのインスタンスかユーザーのオブジェクトID。
   * @param {Boolean} allowed ユーザーがアクセス権限を許可するかどうか。
   */
  NCMB.ACL.prototype.setWriteAccess = function(userId, allowed) {
    this._setAccess("write", userId, allowed);
  };

  /**渡されたユーザーIDが明確にオブジェクトを更新する権限を持っているかどうか。
   * getPublicWriteAccessがtrueの場合かユーザーが属するロールはアクセス許可される場合、
   * この関数でfalseが返却されたとしても、ユーザーがアクセス可能である。
   * @param userId NCMB.UserのインスタンスかユーザーのオブジェクトIDかNCMB.Role.
   * @return {Boolean}
   */
  NCMB.ACL.prototype.getWriteAccess = function(userId) {
    return this._getAccess("write", userId);
  };

  /**パブリックがオブジェクトを読み込みが許可するかどうかを指定する。
   * @param {Boolean} allowed
   */
  NCMB.ACL.prototype.setPublicReadAccess = function(allowed) {
    this.setReadAccess(PUBLIC_KEY, allowed);
  };

  /**パブリックがオブジェクトを読み込みが許可するかどうかを取得する。
   * @return {Boolean}
   */
  NCMB.ACL.prototype.getPublicReadAccess = function() {
    return this.getReadAccess(PUBLIC_KEY);
  };

  /**パブリックがオブジェクトを更新が許可するかどうかを指定する。
   * @param {Boolean} allowed
   */
  NCMB.ACL.prototype.setPublicWriteAccess = function(allowed) {
    this.setWriteAccess(PUBLIC_KEY, allowed);
  };

  /**パブリックがオブジェクトを更新が許可するかどうかを取得する。
   * @return {Boolean}
   */
  NCMB.ACL.prototype.getPublicWriteAccess = function() {
    return this.getWriteAccess(PUBLIC_KEY);
  };
  
  /**渡されたロールが明確にオブジェクトを読み込む権限を持っているかどうか。 
   * 親ロールはアクセス許可される場合、この関数でfalseが返却されたとしても、ロールがアクセス可能である。
   * 
   * @param role ロール名かNCMB.Roleオブジェクト
   * @return {Boolean} ロールは読み込み許可かどうか。true：許可、false：そのほか
   * @throws {String} roleはNCMB.Roleか文字列ではない場合
   */
  NCMB.ACL.prototype.getRoleReadAccess = function(role) {
    if (role instanceof NCMB.Role) {
      // Normalize to the String name
      role = role.getName();
    }
    if (_.isString(role)) {
      return this.getReadAccess("role:" + role);
    }
    throw "role must be a NCMB.Role or a String";
  };
  
  /**渡されたロールが明確にオブジェクトを更新する権限を持っているかどうか。
   * 親ロールはアクセス許可される場合、この関数でfalseが返却されたとしても、ロールがアクセス可能である。
   * 
   * @param role ロール名かNCMB.Roleオブジェクト
   * @return {Boolean} ロールは読み込み許可かどうか。true：許可、false：そのほか
   * @throws {String} roleはNCMB.Roleか文字列ではない場合の例外
   */
  NCMB.ACL.prototype.getRoleWriteAccess = function(role) {
    if (role instanceof NCMB.Role) {
      // Normalize to the String name
      role = role.getName();
    }
    if (_.isString(role)) {
      return this.getWriteAccess("role:" + role);
    }
    throw "role must be a NCMB.Role or a String";
  };
  
  /**
   * ロールに属するユーザーがオブジェクトを読み込み許可するかどうかを指定する。
   * 
   * @param role ロール名かNCMB.Roleオブジェクト
   * @param {Boolean} allowed オブジェクトを読み込み可能かどうか
   * @throws {String} roleはNCMB.Roleか文字列ではない場合の例外
   */
  NCMB.ACL.prototype.setRoleReadAccess = function(role, allowed) {
    if (role instanceof NCMB.Role) {
      // Normalize to the String name
      role = role.getName();
    }
    if (_.isString(role)) {
      this.setReadAccess("role:" + role, allowed);
      return;
    }
    throw "role must be a NCMB.Role or a String";
  };
  
  /**
   * ロールに属するユーザーがオブジェクトを更新する許可するかどうかを指定する。
   * 
   * @param role ロール名かNCMB.Roleオブジェクト
   * @param {Boolean} allowed オブジェクトを読み込み可能かどうか
   * @throws {String} roleはNCMB.Roleか文字列ではない場合の例外
   */
  NCMB.ACL.prototype.setRoleWriteAccess = function(role, allowed) {
    if (role instanceof NCMB.Role) {
      // Normalize to the String name
      role = role.getName();
    }
    if (_.isString(role)) {
      this.setWriteAccess("role:" + role, allowed);
      return;
    }
    throw "role must be a NCMB.Role or a String";
  };
}(this));

/************************************************** NCMB Role class *****************************************/
(function(root) {
  root.NCMB = root.NCMB || {};
  var NCMB = root.NCMB;
  var _ = NCMB._;

  /**
  　*　NCMBサーバーのロールを表現するクラス。　ロールの意味はユーザーをグルーピングさせ、権限を与える。
  　*　ロールは子ユーザーのセットと子ロールセットで指定される。子ユーザーおよび子ロールがすべて親ロールからの権限で指定される。
   *
   * <p>ロールはロール名を持っており、特定のACLが指定される。作成した後、ロール名が変更不可。</p>
   * @class
   * NCMB.Roleはオブジェクトのロール管理に実装するためのクラスである。
   */
  NCMB.Role = NCMB.Object.extend("role", /** @lends NCMB.Role.prototype */ {
    // Instance Methods
    
    /**
     * 渡された名前とACLからNCMBRoleオブジェクトを生成する。
     * 
     * @param {String} name 作成するロール。
     * @param {NCMB.ACL} acl ロールのACLオブジェクト（必須）
     */
    constructor: function(name, acl) {
      if (_.isString(name) && (acl instanceof NCMB.ACL)) {
        NCMB.Object.prototype.constructor.call(this, null, null);
        this.setName(name);
        this.setACL(acl);
      } else {
        NCMB.Object.prototype.constructor.call(this, name, acl);
      }
    },
    
    /**
     * ロール名を取得する。　role.get("name")でも取得可能である。
     * 
     * @return {String} ロール名
     */
    getName: function() {
      return this.get("roleName");
    },
    
    /**
     * ロール名を設定する。　ロールを保存する前、ロール名は必ず設定する必要がある。
     * ロールが保存されたら、再設定は不可になる。
     * 
     * <p>
     *   ロール名には英数字,_,-, スペースから含まれる。
     * </p>
     *
     * <p>この関数はrole.set("name", name)と同じ意味である。</p>
     * 
     * @param {String} name ロール名
     * @param {Object} options コールバック用の標準オプションsuccessとerrorがある。
     */
    setName: function(name, options) {
      return this.set("roleName", name, options);
    },

    _setRoles: function(roles, options) {
      return this.set("belongRole", roles, options);
    },

    _setUsers: function(users, options) {
      return this.set("belongUser", users, options);
    },        
    
    /**　
     * NCMB.Usersがロールの直接子ユーザーのNCMB.Relationを取得する。
    　*　子ユーザーはすべてロールの権限を持っている。リレーションからユーザーを追加およびロールから削除することができる。
     * 
     * <p>role.relation("users")と同じ意味である。</p>
     * 
     * @return {NCMB.Relation} 子ユーザーがロールに属するリレーションを返却する。
     */
    getUsers: function() {
      var rel = this.relation("belongUser");
      rel.targetClassName = "user";
      return rel; 
    },
    
    /**
     * ロールの直接子ロールのリレーションNCMB.Relationを取得する。
     *　子ロールはすべてロールの権限を持っている。
     *　リレーションからロールを追加およびロールから削除することができる。
     * 
     * <p> role.relation("roles")と同じ意味で実行する。</p>
     * 
     * @return {NCMB.Relation} 子ロールがロールに属するリレーションを返却する。
     */
    getRoles: function() {
      var rel = this.relation("belongRole");
      rel.targetClassName = "role";
      return rel;
    },
    
    /**
     * @ignore
     */
    validate: function(attrs, options) {
      if ("roleName" in attrs && attrs.roleName !== this.getName()) {  
        var newName = attrs.roleName;
        if (this.id && this.id !== attrs.objectId) {
          // Check to see if the objectId being set matches this.id.
          // This happens during a fetch -- the id is set before calling fetch.
          // Let the name be set in this case.
          return new NCMB.Error(NCMB.Error.OTHER_CAUSE,
              "A role's name can only be set before it has been saved.");
        }
        if (!_.isString(newName)) {
          return new NCMB.Error(NCMB.Error.OTHER_CAUSE,
              "A role's name must be a String.");
        }
        if (!(/^[0-9a-zA-Z\-_ ]+$/).test(newName)) {
          return new NCMB.Error(NCMB.Error.OTHER_CAUSE,
              "A role's name can only contain alphanumeric characters, _," +
              " -, and spaces.");
        }
      }
      if (NCMB.Object.prototype.validate) {
        return NCMB.Object.prototype.validate.call(this, attrs, options);
      }
      return false;
    }
  });
}(this));


/************************************************** NCMB Query class *************************************/

// NCMB.QueryはNCMB.Objectsのリストを取得するためクラスである。
(function(root) {
  root.NCMB = root.NCMB || {};
  var NCMB = root.NCMB;
  var _ = NCMB._;

  /**指定されたNCMB.ObjectサブクラスからNCMB.Queryのクエリを作成する。
   * @param objectClass -　オブジェクトクラス、NCMB.Objectのサブクラスのインスタンスか、
   * string.NCMB.Objectのサブクラスインスタンス。
   * @class
   *
   * <p>NCMB.Queryはクエリを定義し、NCMB.Objectを取得するためのクエリを生成する。
   * 一番よく利用例はクエリを指定し、<code>find</code> メソッドを利用し、
   * すべてマッチしたオブジェクトの一覧を収得する使い方である。
   * 例えば、以下のサンプルコードで、すべて <code>MyClass</code>クラスのオブジェクトを取得可能である。
   * フェッチが成功したかによって、コールバック関数がsuccessかerrorを実行する。
   * <code>MyClass</code>クラスをフェッチする。
   * <pre>
   * var query = new NCMB.Query(MyClass);
   * query.find({
   *   success: function(results) {
   *     // results is an array of NCMB.Object.
   *   },
   *
   *   error: function(error) {
   *     // error is an instance of NCMB.Error.
   *   }
   * });</pre></p>
   * 
   * <p>クエリはIDが分かるオブジェクトの単体を取得す可能である。
   * 以下のサンプルコードにて、使用方法を確認できる。　
   * このサンプルコードは <code>MyClass</code> クラスのオブジェクトと<code>myId</code>IDをフェッチするコードである。
   * フェッチが成功したかにより、コールバック関数がsuccessかerrorを実行する。
   * 
   * <pre>
   * var query = new NCMB.Query(MyClass);
   * query.get(myId, {
   *   success: function(object) {
   *     // object is an instance of NCMB.Object.NCMB.Objectのオブジェクトインスタンス
   *   },
   *
   *   error: function(object, error) {
   *     // error is an instance of NCMB.Error.NCMB.Errorのエラーインスタンス
   *   }
   * });</pre></p>
   * 
   * <p>NCMB.Queryを利用し、オブジェクトをすべて取得せず、オブジェクト数を把握することが可能である。
   * 例えば、以下のサンプルコードは<code>MyClass</code>クラスのオブジェクト数を取得する。
   * <pre>
   * var query = new NCMB.Query(MyClass);
   * query.count({
   *   success: function(number) {
   *     // There are number instances of MyClass.
   *   },
   *
   *   error: function(error) {
   *     // error is an instance of NCMB.Error.
   *   }
   * });</pre></p>
   */
  NCMB.Query = function(objectClass) {
    if (_.isString(objectClass)) {
      objectClass = NCMB.Object._getSubclass(objectClass);
    }

    this.objectClass = objectClass;

    this.className = objectClass.prototype.className;
    this._where = {};
    this._include = [];
    this._limit = -1; // negative limit means, do not send a limit
    this._skip = 0;
    this._extraOptions = {};
  };

  /**
   * NCMB.Queryの中にORが渡された時のクエリを生成する。例えば、以下のサンプルがある。
   * <pre>var compoundQuery = NCMB.Query.or(query1, query2, query3);</pre>
   *
   * query1, query2とquery3のOR条件で整合したクエリcompoundQueryが作成される。
   * @param {...NCMB.Query} var_args ORのクエリリスト
   * @return {NCMB.Query} OR条件が渡されたクエリ
   */
  NCMB.Query.or = function(queries) {
    var queries = _.toArray(arguments);
    var className = null;
    NCMB._arrayEach(queries, function(q) {
      if (_.isNull(className)) {
        className = q.className;
      }

      if (className !== q.className) {
        throw "All queries must be for the same class";
      }
    });
    var query = new NCMB.Query(className);
    query._orQuery(queries)
    return query;
  };

  NCMB.Query.prototype = {
    /**
     * 渡されたオブジェクトIDによりサーバーからオブジェクトをフェッチして、オブジェクトを生成する。　
     * フェッチが完了したら、options.successかoption.errorのコールバック関数は実行される。
     *
     * @param {} objectId フェッチするためのオブジェクトID
     * @param {Object} options オブジェクトのBackbone対応オプション
     */
    get: function(objectId, options) {
      var self = this;
      self.equalTo('objectId', objectId);

      return self.first().then(function(response) {
        if (response) {
          return response;
        }

        var errorObject = new NCMB.Error(NCMB.Error.OBJECT_NOT_FOUND,
                                          "Object not found.");
        return NCMB.Promise.error(errorObject);

      })._thenRunCallbacks(options, null);
    },

    /**
     * クエリのJSON表現を取得する。
     * @return {Object}　JSONオブジェクト
     */
    toJSON: function() {
      var params = {
        where: this._where
      };

      if (this._include.length > 0) {
        params.include = this._include.join(",");
      }
      if (this._select) {
        params.keys = this._select.join(",");
      }
      if (this._limit >= 0) {
        params.limit = this._limit;
      }
      if (this._skip > 0) {
        params.skip = this._skip;
      }
      if (this._order !== undefined) {
        params.order = this._order;
      }

      NCMB._objectEach(this._extraOptions, function(v, k) {
        params[k] = v;
      });

      return params;
    },

    /**
     * クエリに満たすNCMBオブジェクトのリストを取得する。
     * フェッチが完了したら、options.successかoption.errorのコールバック関数は実行される。
     *
     * @param {Object} options Backbone対応オプションオブジェクト
     * @return {NCMB.Promise} クエリが完了し、解決されたプロミスを返却する。
     */
    find: function(options) {
      var self = this;

      var request = NCMB._request("classes", this.className, null, "GET",
                                   this.toJSON());

      return request.then(function(response) {
        return _.map(response.results, function(json) {
          var obj;
          if (response.className) {
            obj = new NCMB.Object(response.className);
          } else {
            obj = new self.objectClass();
          }
          obj._finishFetch(json, true);
          return obj;
        });
      })._thenRunCallbacks(options);
    },

    /**
     * クエリにマッチするオブジェクトの数を取得する。
     * フェッチが完了したら、options.successかoption.errorのコールバック関数は実行される。 
     *
     * @param {Object} options Backbone対応オプションオブジェクト
     * @return {NCMB.Promise} クエリが完了し、解決されたプロミスを返却する。
     */
    count: function(options) {
      var params = this.toJSON();
      params.limit = 0;
      params.count = 1;
      var request = NCMB._request("classes", this.className, null, "GET",
                                   params);

      return request.then(function(response) {
        return response.count;
      })._thenRunCallbacks(options);
    },

    /**
     * クエリの条件に満たすNCMB.Objectを取得する。
     * フェッチが完了したら、options.successかoption.errorのコールバック関数は実行される。
     *
     * @param {Object} options Backbone対応オプションオブジェクト
     * @return {NCMB.Promise} クエリが完了し、解決されたプロミスを返却する。
     */
    first: function(options) {
      var self = this;

      var params = this.toJSON();
      params.limit = 1;

      var request = NCMB._request("classes", this.className, null, "GET",
                                   params);

      return request.then(function(response) {
        return _.map(response.results, function(json) {
          var obj = new self.objectClass();
          obj._finishFetch(json, true);
          return obj;
        })[0];
      })._thenRunCallbacks(options);
    },

    /**
     * クエリからNCMB.Collectionの新しいインスタンスを取得する。
     * @return {NCMB.Collection}　コレクション
     */
    collection: function(items, options) {
      options = options || {};
      return new NCMB.Collection(items, _.extend(options, {
        model: this.objectClass,
        query: this
      }));
    },

    /**
     * クエリの結果リストを取得する前に結果の項目をどのぐらいスキップするかをセットする。　
     * ページングをする時に便利のメソッド。
     * デフォルトは0件項目をスキップする。
     * @param {Number} n スキップするn個の結果
     * @return {NCMB.Query} チェーンにするクエリを返却する。
     */
    skip: function(n) {
      this._skip = n;
      return this;
    },

    /**
     * クエリの結果リストを取得する前に結果の項目をどのぐらい制限して取得するかをセットする。
     * 制限のデフォルト値は100である。1回リクエストすると、最大1000件の結果を取得可能である。
     * @param {Number} n 制限する数
     * @return {NCMB.Query} チェーンにするクエリを返却する。
     */
    limit: function(n) {
      this._limit = n;
      return this;
    },

    /**
     * 特定のキーの値が渡された値と同等する制限を追加する。
     * @param {String} key 　チェックするキー名
     * @param value NCMB.Objectが含まれる値
     * @return {NCMB.Query} チェーンにするクエリを返却する。
     */
    equalTo: function(key, value) {
      this._where[key] = NCMB._encode(value);
      return this;
    },

    /**
     * Helper for condition queries
     */
    _addCondition: function(key, condition, value) {
      // Check if we already have a condition
      if (!this._where[key]) {
        this._where[key] = {};
      }
      this._where[key][condition] = NCMB._encode(value);
      return this;
    },

    /**
     * 特定のキーの値が渡された値と同等しない制限を追加する。
     * 
     * @param {String} key 　チェックするキー名
     * @param value NCMB.Objectが含まれる値
     * @return {NCMB.Query} チェーンにするクエリを返却する。
     */
    notEqualTo: function(key, value) {
      this._addCondition(key, "$ne", value);
      return this;
    },

    /**
     * 特定のキーの値が渡された値と比べ、より小さい制限を追加する。
     * @param {String} key チェックするキー名
     * @param value 上限値
     * @return {NCMB.Query} チェーンにするクエリを返却する。
     */
    lessThan: function(key, value) {
      this._addCondition(key, "$lt", value);
      return this;
    },

    /**
     * 特定のキーの値が渡された値と比べ、より大きい制限を追加する。
     * @param {String} key 　チェックするキー名
     * @param value 最小限値
     * @return {NCMB.Query} チェーンにするクエリを返却する。
     */
    greaterThan: function(key, value) {
      this._addCondition(key, "$gt", value);
      return this;
    },

    /**
     * 特定のキーの値が渡された値と比べ、より小さいか同等かの制限を追加する。
     * 
     * @param {String} key 　チェックするキー名
     * @param value 上限値
     * @return {NCMB.Query} チェーンにするクエリを返却する。
     */
    lessThanOrEqualTo: function(key, value) {
      this._addCondition(key, "$lte", value);
      return this;
    },

    /**
     * 特定のキーの値が渡された値と比べ、より大きいか同等かの制限をクエリに追加する。
     * @param {String} key チェックするキー名
     * @param value 最小限値
     * @return {NCMB.Query} チェーンにするクエリを返却する。
     */
    greaterThanOrEqualTo: function(key, value) {
      this._addCondition(key, "$gte", value);
      return this;
    },

    /**
     * 特定のキーの値が値のリストに属する制限をクエリに追加する。
     * 
     * @param {String} key チェックするキー名
     * @param {Array} values マッチする値の配列。
     * @return {NCMB.Query} チェーンにするクエリを返却する。
     */
    containedIn: function(key, values) {
      this._addCondition(key, "$in", values);
      return this;
    },

    /**
     * 特定のキーの値が値のリストに属しない制限をクエリに追加する。
     * 
     * @param {String} key チェックするキー名
     * @param {Array} values マッチする値の配列。
     * @return {NCMB.Query} チェーンにするクエリを返却する。
     */
    notContainedIn: function(key, values) {
      this._addCondition(key, "$nin", values);
      return this;
    },

    /**
     * 特定のキーの値が値のリストはすべて値リストが含まれる制限をクエリに追加する。
     * @param {String} key 　チェックするキー名
     * @param {Array} values .マッチする値の配列。
     * @return {NCMB.Query} チェーンにするクエリを返却する。
     */
    containsAll: function(key, values) {
      this._addCondition(key, "$all", values);
      return this;
    },


    /**
     * 渡されたキーを含まれる制限を追加する。
     * @param {String} key 　チェックするキー名
     * @return {NCMB.Query} チェーンにするクエリを返却する。
     */
    exists: function(key) {
      this._addCondition(key, "$exists", true);
      return this;
    },

    /**
     * 渡されたキーが含まらないオブジェクトの制限を追加する。
     * @param {String} key チェックするキー名
     * @return {NCMB.Query} チェーンにするクエリを返却する。
     */
    doesNotExist: function(key) {
      this._addCondition(key, "$exists", false);
      return this;
    },

    /**
     * NCMB.Queryの制限にマッチする制限をクエリに追加する。
     * @param {String} key マッチするオブジェクトのキー名
     * @param {NCMB.Query} query マッチするクエリ
     * @return {NCMB.Query} チェーンにするクエリを返却する。
     */
    matchesQuery: function(key, query) {
      var queryJSON = query.toJSON();
      queryJSON.className = query.className;
      this._addCondition(key, "$inQuery", queryJSON);
      return this;
    },

    /**ほかのNCMB.Queryの制限にマッチするキーの値を利用し、制限をクエリに追加する。
     * 
     * @param {String} key マッチする値を含まれるキー名
     * @param {String} queryKey 再マッチするためクエリから取得したオブジェクトのキー名
     * @param {NCMB.Query} query 実行するクエリ
     * @return {NCMB.Query} チェーンにするクエリを返却する。
     */
    matchesKeyInQuery: function(key, queryKey, query) {

      var queryJSON = query.toJSON();
      var newQueryJSON = {};
      newQueryJSON.className = query.className;
      newQueryJSON["where"] = queryJSON.where;
      this._addCondition(key, "$select", {query: newQueryJSON,  key: queryKey });
      return this;
    },

    /**
     * Add constraint that at least one of the passed in queries matches.
     * @param {Array} queries
     * @return {NCMB.Query} Returns the query, so you can chain this call.
     */
    _orQuery: function(queries) {
      var queryJSON = _.map(queries, function(q) {
        return q.toJSON().where;
      });

      this._where.$or = queryJSON;
      return this;
    },

    /**
     * Converts a string into a regex that matches it.
     * Surrounding with \Q .. \E does this, we just need to escape \E's in
     * the text separately.
     */
    _quote: function(s) {
      return "\\Q" + s.replace("\\E", "\\E\\\\E\\Q") + "\\E";
    },

    /**
     * 渡されたキーに対す値リストの結果を上昇順にソートする。
     * 
     * @param {String} key 　ソートするキー名
     * @return {NCMB.Query} チェーンにするクエリを返却する。
     */
    ascending: function(key) {
      this._order = key;
      return this;
    },

    /**
     * 渡されたキーに対す値リストの結果を降下順にソートする。
     * 
     * @param {String} key ソートするキー名
     * @return {NCMB.Query} チェーンにするクエリを返却する。
     */
    descending: function(key) {
      this._order = "-" + key;
      return this;
    },

   
    /**
     * 渡されたキーに対するNCMB.Objectsが含まれる。
     * ドットの記号を利用し、含まれたオブジェクトのどこのフィールドをフェッチするか指定可能である。
     * @param {String} key 含まれたキー名
     * @return {NCMB.Query} チェーンにするクエリを返却する。
     */
    include: function() {
      var self = this;
      NCMB._arrayEach(arguments, function(key) {
        if (_.isArray(key)) {
          self._include = self._include.concat(key);
        } else {
          self._include.push(key);
        }
      });
      return this;
    },

    /**
     * 関連NCMB.Objectsが含まれる。
     * @param {NCMB.Object} object オブジェクト
     * @param {String} className クラス名
     * @param {String} key 含まれたキー名
     * @return {NCMB.Query} チェーンにするクエリを返却する。
     */
    relatedTo: function(object, className, key) {
      var self = this;
      var objectJSON = {};
      objectJSON.__type = "Pointer";
      objectJSON.className = className;
      objectJSON.objectId = object;
      self._addCondition("$relatedTo", "object", objectJSON);
      self._addCondition("$relatedTo", "key", key);
      return this;
    },

    /**
     * 渡されたキーが含まれるNCMB.Objects、フィールドを制限し、取得する。
     * @param {Array} keys 含まれるキー名
     * @return {NCMB.Query} チェーンにするクエリを返却する。
     */
    select: function() {
      var self = this;
      this._select = this._select || [];
      NCMB._arrayEach(arguments, function(key) {
        if (_.isArray(key)) {
          self._select = self._select.concat(key);
        } else {
          self._select.push(key);
        }
      });
      return this;
    },

    /**
     * 結果の一つずつ項目を繰り返し、コールバックを実施する。コールバックはプロミスとして返却する場合、
     * プロミスが成功に終了するまでに繰り返しを続かない。
     * コールバックは拒否コールバックとして返却する場合、繰り返しが終了になり、エラーを返却する。
     * 項目は指定しない順番で実施し、ソート順番および制限とスキップの指定は不可である。
     * @param callback {Function} それぞれのクエリの結果で実行されるコールバック
     * @param options {Object} Backbone対応のオプション。successかerrorか実行結果により、コールバック関数が実行される。
     * @return {NCMB.Promise} 繰り返しが完了した後、プロミスを返却する。
     */
    each: function(callback, options) {
      options = options || {};

      if (this._order || this._skip || (this._limit >= 0)) {
        var error =
          "Cannot iterate on a query with sort, skip, or limit.";
        return NCMB.Promise.error(error)._thenRunCallbacks(options);
      }

      var promise = new NCMB.Promise();

      var query = new NCMB.Query(this.objectClass);
      // We can override the batch size from the options.
      // This is undocumented, but useful for testing.
      query._limit = options.batchSize || 100;
      query._where = _.clone(this._where);
      query._include = _.clone(this._include);

      query.ascending('objectId');

      var finished = false;
      return NCMB.Promise._continueWhile(function() {
        return !finished;

      }, function() {
        return query.find().then(function(results) {
          var callbacksDone = NCMB.Promise.as();
          NCMB._.each(results, function(result) {
            callbacksDone = callbacksDone.then(function() {
              return callback(result);
            });
          });

          return callbacksDone.then(function() {
            if (results.length >= query._limit) {
              query.greaterThan("objectId", results[results.length - 1].id);
            } else {
              finished = true;
            }
          });
        });
      })._thenRunCallbacks(options);
    },

      /**
     * 渡されたpointの位置情報により近い順でオブジェクト検索を行うクエリを定義する。
     * @param {String} key NCMB.Objectが保存されるフィールド。
     * @param {NCMB.GeoPoint} point 参照するNCMB.GeoPointポイント.
     * @return {NCMB.Query} チェーンにするクエリを返却する。
     */
    near: function(key, point) {
      if (!(point instanceof NCMB.GeoPoint)) {
        // Try to cast it to a GeoPoint, so that near("loc", [20,30]) works.
        point = new NCMB.GeoPoint(point);
      }
      this._addCondition(key, "$nearSphere", point);
      return this;
    },

    /**
     * 渡されたpointの位置情報と距離の制限により近い順でオブジェクト検索を行うクエリを定義する。
     * @param {String} key NCMB.Objectが保存されるフィールド。
     * @param {NCMB.GeoPoint} point 参照するNCMB.GeoPointポイント。
     * @param {Number} maxDistance 結果の最大距離(radians)を返却する。
     * @return {NCMB.Query} チェーンにするクエリを返却する。
     */
    withinRadians: function(key, point, distance) {
      this.near(key, point);
      this._addCondition(key, "$maxDistanceInRadians", distance);
      return this;
    },

    /**
     * 渡されたpointの位置情報と距離の制限により近い順でオブジェクト検索を行うクエリを定義する。
     * 地球の半径は3958.8 miles.
     * @param {String} key NCMB.Objectが保存されるフィールド。
     * @param {NCMB.GeoPoint} point 参照するNCMB.GeoPointポイント。
     * @param {Number} maxDistance 結果の最大距離(miles)を返却する。
     * @return {NCMB.Query} チェーンにするクエリを返却する。
     */
    withinMiles: function(key, point, distance) {
      this.near(key, point);
      this._addCondition(key, "$maxDistanceInMiles", distance);
      return this;
    },

    /**
     * 渡されたpointの位置情報と距離の制限により近い順でオブジェクト検索を行うクエリを定義する。
     * 地球の半径は 6371.0 kilometers.
     * @param {String} key NCMB.Objectが保存されるフィールド。
     * @param {NCMB.GeoPoint} point 参照するNCMB.GeoPointポイント。
     * @param {Number} maxDistance 結果の最大距離(Kilometers)を返却する。
     * @return {NCMB.Query} チェーンにするクエリを返却する。
     */
    withinKilometers: function(key, point, distance) {
      this.near(key, point);
      this._addCondition(key, "$maxDistanceInKilometers", distance);
      return this;
    },

    /**
     * 渡された長方形の地理の制限の中で、フィールドが制限の中に検索を行うクエリを定義する。
     * @param {String} key 制約するフィールド。
     * @param {NCMB.GeoPoint} southwest 南西。
     *     左下隅ポイント。
     * @param {NCMB.GeoPoint} northeast 北東。
     *     右上隅ポイント。
     * @return {NCMB.Query} チェーンにするクエリを返却する。
     */
    withinGeoBox: function(key, southwest, northeast) {
      if (!(southwest instanceof NCMB.GeoPoint)) {
        southwest = new NCMB.GeoPoint(southwest);
      }
      if (!(northeast instanceof NCMB.GeoPoint)) {
        northeast = new NCMB.GeoPoint(northeast);
      }
      this._addCondition(key, '$within', { '$box': [southwest, northeast] });
      return this;
    }
  };
}(this));


/************************************************** NCMB User class *************************************/

(function(root) {
  root.NCMB = root.NCMB || {};
  var NCMB = root.NCMB;
  var _ = NCMB._;

  /**
   * @class
   *
   * <p>NCMB.UserオブジェクトはNCMBに保存するユーザーのローカル表現である。
   * NCMB.Objectのサブクラスであり、NCMB.Objectと同じ関数を持っており、ユーザー関数をより多くメソッドを拡張されている。
   * 例えば、ユーザー認証、サインアップ、独自性のバリデーション機能が追加されている。
   </p>
   */
    NCMB.User = NCMB.Object.extend("user", 
    /** @lends NCMB.User.prototype */ 
    {
    // Instance Variables
    _isCurrentUser: false,

    // Instance Methods

    /**
     * Internal method to handle special fields in a _User response.
     */
    _mergeMagicFields: function(keys) {
      if (keys.sessionToken) {
        this._sessionToken = keys.sessionToken;
        delete keys.sessionToken;
      }
      NCMB.User.__super__._mergeMagicFields.call(this, keys);
    },

    /**
     * Removes null values from authData (which exist temporarily for
     * unlinking)
     */
    _cleanupAuthData: function() {
      if (!this.isCurrent()) {
        return;
      }
      var authData = this.get('authData');
      if (!authData) {
        return;
      }
      NCMB._objectEach(this.get('authData'), function(value, key) {
        if (!authData[key]) {
          delete authData[key];
        }
      });
    },

    /**
     * Synchronizes authData for all providers.
     */
    _synchronizeAllAuthData: function() {
      var authData = this.get('authData');
      if (!authData) {
        return;
      }

      var self = this;
      NCMB._objectEach(this.get('authData'), function(value, key) {
        self._synchronizeAuthData(key);
      });
    },

    /**
     * Synchronizes auth data for a provider (e.g. puts the access token in the
     * right place to be used by the Facebook SDK).
     */
    _synchronizeAuthData: function(provider) {
      if (!this.isCurrent()) {
        return;
      }
      var authType;
      if (_.isString(provider)) {
        authType = provider;
        provider = NCMB.User._authProviders[authType];
      } else {
        authType = provider.getAuthType();
      }
      var authData = this.get('authData');
      if (!authData || !provider) {
        return;
      }
      var success = provider.restoreAuthentication(authData[authType]);
      if (!success) {
        this._unlinkFrom(provider);
      }
    },

    _handleSaveResult: function(makeCurrent) {
      // Clean up and synchronize the authData object, removing any unset values
      if (makeCurrent) {
        this._isCurrentUser = true;
      }
      this._cleanupAuthData();
      this._synchronizeAllAuthData();
      // Don't keep the password around.
      delete this._serverData.password;
      this._rebuildEstimatedDataForKey("password");
      this._refreshCache();
      if (makeCurrent || this.isCurrent()) {
        NCMB.User._saveCurrentUser(this);
      }
    },

    /**
     * Unlike in the Android/iOS SDKs, logInWith is unnecessary, since you can
     * call linkWith on the user (even if it doesn't exist yet on the server).
     */
    _linkWith: function(provider, options) {
      var authType;
      if (_.isString(provider)) {
        authType = provider;
        provider = NCMB.User._authProviders[provider];
      } else {
        authType = provider.getAuthType();
      }
      if (_.has(options, 'authData')) {
        var authData = this.get('authData') || {};
        authData[authType] = options.authData;

        //date 処理 
        if( authType == "facebook" ) {
          if(authData[authType]) 
            if(authData[authType]["expiration_date"]) {
              authData[authType]["expiration_date"] = {"__type": "Date", "iso": authData[authType]["expiration_date"]};
            }
        }
        this.set('authData', authData); 
        // Overridden so that the user can be made the current user.
        var newOptions = _.clone(options) || {};
        newOptions.success = function(model) {
          model._handleSaveResult(true);
          if (options.success) {
            options.success.apply(this, arguments);
          }
        };

        return this.save({'authData': authData}, newOptions);
      } else {
        var self = this;
        var promise = new NCMB.Promise();
        provider.authenticate({
          success: function(provider, result) {
            self._linkWith(provider, {
              authData: result,
              success: options.success,
              error: options.error
            }).then(function() {
              promise.resolve(self);
            });
          },
          error: function(provider, error) {
            if (options.error) {
              options.error(self, error);
            }
            promise.reject(error);
          }
        });
        return promise;
      }
    },

    /**
     * Unlinks a user from a service.
     */
    _unlinkFrom: function(provider, options) {
      var authType;
      if (_.isString(provider)) {
        authType = provider; 
      } else {
        authType = provider.getAuthType();
      }
      var newOptions = _.clone(options);
      var self = this;
      if(!newOptions) 
        newOptions = {};
      newOptions.authData = null;
      newOptions.success = function(model) {
        self._synchronizeAuthData(provider);
        if(options)
          if (options.success) {
            options.success.apply(this, arguments);
          }
      };
      return this._linkWith(provider, newOptions);
    },

    /**
     * Checks whether a user is linked to a service.
     */
    _isLinked: function(provider) {
      var authType;
      if (_.isString(provider)) {
        authType = provider;
      } else {
        authType = provider.getAuthType();
      }
      var authData = this.get('authData') || {};
      return !!authData[authType];
    },

    /**
     * Deauthenticates all providers.
     */
    _logOutWithAll: function() {
      var authData = this.get('authData');
      if (!authData) {
        return;
      }
      var self = this;
      NCMB._objectEach(this.get('authData'), function(value, key) {
        self._logOutWith(key);
      });
    },

    /**
     * Deauthenticates a single provider (e.g. removing access tokens from the
     * Facebook SDK).
     */
    _logOutWith: function(provider) {
      if (!this.isCurrent()) {
        return;
      }
      if (_.isString(provider)) {
        provider = NCMB.User._authProviders[provider];
      }
      if (provider && provider.deauthenticate) {
        provider.deauthenticate();
      }
    },

    /**
     * 新しいユーザーをサインアップする。NCMB.Usersのsave関数を利用するより、sign up関数を利用した方が良い。
     * サーバーに新しいNCMB.Userを作成し、サーバーに保存し、
     * ローカルでセッションを保持し、<code>current</code>で、現在のユーザーをアクセスできる。
     *
     * <p>サインアップする前、ユーザー名とパスワードをセットする必要がある。</p>
     *
     * <p>完了した後、options.successかoptions.errorを実行させる。</p>
     *
     * @param {Object} attrs nullか新しいユーザーに追加したいフィールド。
     * @param {Object} options Backbone対応のオプションオブジェクト。
     * @return {NCMB.Promise} サインアップを完了した後、解決したプロミス。
     * @see NCMB.User.signUp
     */
    signUp: function(attrs, options) {
      var error;
      options = options || {};

      var userName = (attrs && attrs.userName) || this.get("userName");
      if (!userName || (userName === "")) {
        error = new NCMB.Error(
            NCMB.Error.OTHER_CAUSE,
            "Cannot sign up user with an empty name.");
        if (options && options.error) {
          options.error(this, error);
        }
        return NCMB.Promise.error(error);
      }
      var password = (attrs && attrs.password) || this.get("password");
      if (!password || (password === "")) {
        error = new NCMB.Error(
            NCMB.Error.OTHER_CAUSE,
            "Cannot sign up user with an empty password.");
        if (options && options.error) {
          options.error(this, error);
        }
        return NCMB.Promise.error(error);
      }

      // Overridden so that the user can be made the current user.
      var newOptions = _.clone(options);
      newOptions.success = function(model) {
        model._handleSaveResult(true);
        if (options.success) {
          options.success.apply(this, arguments);
        }
      };
      return this.save(attrs, newOptions);
    },

    /**
     * NCMB.Userにログインする。成功する時、ローカルストレージにセッションが保存され、
     * 現在ログインしているユーザーのデーターが<code>current</code>にてアクセス可能である。
     *
     * <p>ログインする前に、ユーザー名(メールアドレス)とパスワードを設定する必要がある。</p>
     *
     * <p>完了した後、options.successかoptions.errorを実行させる。</p>
     *
     * @param {Object} 　Backbone対応のオプションオブジェクト。
     * @see NCMB.User.logIn
     * @return {NCMB.Promise} ログインを完了した後、解決したプロミス。
     */
    logIn: function(options) {
      var model = this;
      var request = NCMB._request("login", null, null, "GET", this.toJSON());
      return request.then(function(resp, status, xhr) {
        var serverAttrs = model.parse(resp, status, xhr);
        model._finishFetch(serverAttrs);
        model._handleSaveResult(true);
        return model;
      })._thenRunCallbacks(options, this);
    },

    /**
     * @see NCMB.Object#save
     */
    save: function(keys, options) {
      var i, attrs, current, options, saved;
      attrs = keys;
      options = options || {};

      var newOptions = _.clone(options);
      newOptions.success = function(model) {
        model._handleSaveResult(false);
        if (options.success) {
          options.success.apply(this, arguments);
        }
      };
      return NCMB.Object.prototype.save.call(this, attrs, newOptions);
    },

    /**
     * @see NCMB.Object#fetch
     */
    fetch: function(options) {
      var newOptions = options ? _.clone(options) : {};
      newOptions.success = function(model) {
        model._handleSaveResult(false);
        if (options && options.success) {
          options.success.apply(this, arguments);
        }
      };
      return NCMB.Object.prototype.fetch.call(this, newOptions);
    },

    /**
     * 現在のユーザーは<code>current</code>の場合、trueとして返却する。
     * @see NCMB.User#current
     */
    isCurrent: function() {
      return this._isCurrentUser;
    },

    /**
     * get("userName")を返却する。
     * @return {String}
     * @see NCMB.Object#get
     */
    getUsername: function() {
      return this.get("userName");
    },

    /**
     * set("userName", userName, options)を実行させ、結果を返却する。
     * @param {String} ユーザー名
     * @param {Object} options Backbone対応のオプションオブジェクト。
     * @return {Boolean}
     * @see NCMB.Object.set
     */
    setUsername: function(userName, options) {
      return this.set("userName", userName, options);
    },

    /**
     * set("password", password, options)を実行させ、結果を返却する。
     * @param {String} パスワード
     * @param {Object} options Backbone対応のオプションオブジェクト。
     * @return {Boolean}
     * @see NCMB.Object.set
     */
    setPassword: function(password, options) {
      return this.set("password", password, options);
    },

    /**
     * get("email")を返却する。
     * @return {String}
     * @see NCMB.Object#get
     */
    getEmail: function() {
      return this.get("mailAddress");
    },

    /**
     * set("email", email, options)を実行させ、結果を返却する。
     * @param {String} メールアドレス
     * @param {Object} options Backbone対応のオプションオブジェクト。
     * @return {Boolean}
     * @see NCMB.Object.set
     */
    setEmail: function(email, options) {
      return this.set("mailAddress", email, options);
    },

    /**
     * ユーザーオブジェクトは現在のユーザーかどうかと認証されたかどうかをチェックし、結果を返却する。
     * @return (Boolean) ユーザーは現在ユーザーかどうか、ログインしたかどうかを確認結果
     */
    authenticated: function() {
      return !!this._sessionToken &&
          (NCMB.User.current() && NCMB.User.current().id === this.id);
    }

  }, /** @lends NCMB.User */ {
    // Class Variables

    // The currently logged-in user.
    _currentUser: null,

    // Whether currentUser is known to match the serialized version on disk.
    // This is useful for saving a localstorage check if you try to load
    // _currentUser frequently while there is none stored.
    _currentUserMatchesDisk: false,

    // The localStorage key suffix that the current user is stored under.
    _CURRENT_USER_KEY: "currentUser",

    // The mapping of auth provider names to actual providers
    _authProviders: {},


    // Class Methods

    /**
     * 新しいユーザーをサインアップする。NCMB.Usersのsave関数を利用するより、sign up関数を利用した方が良い。
     *  サーバーに新しいNCMB.Userを作成し、サーバーに保存し、ローカルでセッションを保持し、
     *  <code>current</code>で、現在のユーザーにアクセスできる。
     *
     * <p>完了した後、options.successかoptions.errorを実行させる。</p>
     *
     * @param {String} username サインアップ用のユーザー名（メールアドレス）
     * @param {String} password サインアップ用のパスワード
     * @param {Object} attrs nullか新しいユーザーに追加したいフィールド.
     * @param {Object} options Backbone対応のオプションオブジェクト。
     * @return {NCMB.Promise} サインアップを完了した後、解決したプロミス。
     * @see NCMB.User#signUp
     */
    signUp: function(userName, password, attrs, options) {
      attrs = attrs || {};
      attrs.userName = userName;
      attrs.password = password;
      var user = NCMB.Object._create("user");
      return user.signUp(attrs, options);
    },


    /**
     * メールアドレスとパスワードを指定してログイン。成功する時、ローカルストレージにセッションが保存され、
     * 現在ログインしているユーザーのデーターが<code>current</code>にてアクセス可能である。
     *
     * <p>完了した後、options.successかoptions.errorを実行させる。</p>
     *
     * @param {String} mailAddress ログイン時に指定するメールアドレス
     * @param {String} password ログイン時に指定するパスワード
     * @param {Object} options 　Backbone対応のオプションオブジェクト。
     * @see NCMB.User.logIn
     * @return {NCMB.Promise} ログインを完了した後、解決したプロミス。
     */
    loginWithMailAddress: function(mailAddress, password, options) {
      var user = NCMB.Object._create("user");
      user._finishFetch({ mailAddress: mailAddress, password: password });
      return user.logIn(options);
    },

    /**
     * NCMB.Userにログインする。成功する時、ローカルストレージにセッションが保存され、
     * 現在ログインしているユーザーのデーターが<code>current</code>にてアクセス可能である。
     *
     * <p>完了した後、options.successかoptions.errorを実行させる。</p>
     *
     * @param {String} userName サインアップ用のユーザー名
     * @param {String} password サインアップ用のパスワード
     * @param {Object} options 　Backbone対応のオプションオブジェクト。
     * @see NCMB.User.logIn
     * @return {NCMB.Promise} ログインを完了した後、解決したプロミス。
     */
    logIn: function(userName, password, options) {
      var user = NCMB.Object._create("user");
      user._finishFetch({ userName: userName, password: password });
      return user.logIn(options);
    },

    /**
     * 現在ログイン中のユーザーセッションから、ログアウトする。　
     * ローカルからセッションを削除し、連携サービスをログアウトする。ログアウトが完了すると、
     * <code>current</code>の結果は<code>null</code>を返却する。
     */
    logOut: function() {
      if (NCMB.User._currentUser !== null) {
        NCMB.User._currentUser._logOutWithAll();
        NCMB.User._currentUser._isCurrentUser = false;
      }
      NCMB.User._currentUserMatchesDisk = true;
      NCMB.User._currentUser = null;
      NCMB.localStorage.removeItem(
          NCMB._getNCMBPath(NCMB.User._CURRENT_USER_KEY));
    },

    /**
     * ユーザーアカウントに登録した特定メールアドレスにパスワードリセット依頼メールを送信することを依頼する。
     * このメールで、安全にユーザーパスワードをリセットすることができる。
     *
     * <p>完了する時、options.successかoptions.errorを実行させる。</p>
     *
     * @param {String} email パスワードのリセットリクエストを行うユーザーのメールアドレス。
     * @param {Object} options Backbone対応のオプションオブジェクト
     */
    requestPasswordReset: function(email, options) {
      var json = { mailAddress: email };
      var request = NCMB._request("requestPasswordReset", null, null, "POST",
                                   json);
      return request._thenRunCallbacks(options);
    },

    /**
     * 指定したメールアドレスに対して、会員登録を行うためのメールを送信するよう要求する。
     *
     * <p>完了する時、options.successかoptions.errorを実行させる。</p>
     *
     * @param {String} email 指定するメールアドレス。
     * @param {Object} options Backbone対応のオプションオブジェクト
     */
    requestAuthenticationMail: function(email, options) {
      var json = { mailAddress: email };
      var request = NCMB._request("requestMailAddressUserEntry", null, null, "POST",
                                   json);
      return request._thenRunCallbacks(options);
    },

    /**
     *　現在ログイン中のユーザー NCMB.Userを取得する。
     * メモリかローカルストレージから適切なセッション情報を返却する。
     * @return {NCMB.Object} 現在ログインしているNCMB.User
     */
    current: function() {
      if (NCMB.User._currentUser) {
        return NCMB.User._currentUser;
      }

      if (NCMB.User._currentUserMatchesDisk) {       
        return NCMB.User._currentUser;
      }

      // Load the user from local storage.
      NCMB.User._currentUserMatchesDisk = true;

      var userData = NCMB.localStorage.getItem(NCMB._getNCMBPath(
          NCMB.User._CURRENT_USER_KEY));
      if (!userData) {

        return null;
      }

      NCMB.User._currentUser = NCMB.Object._create("user");
      NCMB.User._currentUser._isCurrentUser = true;

      var json = JSON.parse(userData);
      NCMB.User._currentUser.id = json._id;
      delete json._id;
      NCMB.User._currentUser._sessionToken = json._sessionToken;
      delete json._sessionToken;
      NCMB.User._currentUser.set(json);

      NCMB.User._currentUser._synchronizeAllAuthData();
      NCMB.User._currentUser._refreshCache();
      NCMB.User._currentUser._opSetQueue = [{}];
      return NCMB.User._currentUser;
    },

    /**
     * Persists a user as currentUser to localStorage, and into the singleton.
     */
    _saveCurrentUser: function(user) {
      if (NCMB.User._currentUser !== user) {
        NCMB.User.logOut();
      }
      user._isCurrentUser = true;
      NCMB.User._currentUser = user;
      NCMB.User._currentUserMatchesDisk = true;

      var json = user.toJSON();
      json._id = user.id;
      json._sessionToken = user._sessionToken;
      NCMB.localStorage.setItem(
          NCMB._getNCMBPath(NCMB.User._CURRENT_USER_KEY),
          JSON.stringify(json));
    },

    _registerAuthenticationProvider: function(provider) {
      NCMB.User._authProviders[provider.getAuthType()] = provider;
      // Synchronize the current user with the auth provider.
      if (NCMB.User.current()) {
        NCMB.User.current()._synchronizeAuthData(provider.getAuthType());
      }
    },

    _logInWith: function(provider, options) {
      if (provider == "anonymous") {
        var authData = {};
        authData["id"] = NCMB._createUuid();
        options["authData"] = authData;
      }
      var user = NCMB.Object._create("user");
      return user._linkWith(provider, options);
    }

  });
}(this));

/************************************************** NCMB Anonymous class *************************************/

/*global FB: false , console: false*/
(function(root) {
  root.NCMB = root.NCMB || {};
  var NCMB = root.NCMB;
  var _ = NCMB._;

  /**
   * 匿名ユーザーのために、利用する機能を提供するクラスである。
   * @namespace
   * 匿名ユーザーのために、利用する機能を提供するクラスである。
   */
  NCMB.AnonymousUtils = {

    /**
     * ユーザーのアカウントが匿名とリンクするかどうか判断し、取得する。
     * 
     * @param {NCMB.User}　user　チェックするユーザー。ユーザーが現在のデバイスにログインする必要がある。
     * @return {Boolean}  ユーザーアカウントは匿名アカウントとリンクしているかどうか判断結果。そうすると、<code>true</code>を返却する。
     */
    isLink: function(user) {
      return user._isLinked("anonymous");
    },

    /**
     * 匿名としてログインする。
     * 
     * @param {Object} options successとerrorのコールバック標準オプション
     */
    logIn: function(options) {
      return NCMB.User._logInWith("anonymous", options);
    },
  };
}(this));


/************************************************** NCMB Collection class *************************************/

/*global _: false */
(function(root) {
  root.NCMB = root.NCMB || {};
  var NCMB = root.NCMB;
  var _ = NCMB._;

  /**
   * 新しいモデルとオプションからCollectionを作成。普段は直接利用しないが、
   * <code>NCMB.Collection.extend</code>サブクラスを作成方法の方が多く利用されている。
   *
   * @param {Array} models <code>NCMB.Object</code>のインスタンスの配列
   *
   * @param {Object} options Backbone対応オプションオブジェクト。
   * 適切なオプションは以下のようになっている:<ul>
   *   <li>model: コレクションに入っているNCMB.Objectのサブクラス
   *   <li>query: 項目をフェッチするために利用するNCMB.Queryを利用し
   *   <li>comparator: ソートするための属性名前と関数
   * </ul>
   *
   * @see NCMB.Collection.extend
   *
   * @class
   *
   * <p>Backbone.jsのモデルの集合概念を実施するための機能を提供するクラスである。
   * コレクションの順番はソートおよび未ソート、両方がある。
   * 詳しくは以下のリンクで確認ください。
   * <a href="http://documentcloud.github.com/backbone/#Collection">Backbone
   * documentation</a>.</p>
   */
  NCMB.Collection = function(models, options) {
    options = options || {};
    if (options.comparator) {
      this.comparator = options.comparator;
    }
    if (options.model) {
      this.model = options.model;
    }
    if (options.query) {
      this.query = options.query;
    }
    this._reset();
    this.initialize.apply(this, arguments);
    if (models) {
      this.reset(models, {silent: true, NCMB: options.parse});
    }
  };

  // Define the Collection's inheritable methods.
  _.extend(NCMB.Collection.prototype, NCMB.Events,
      /** @lends NCMB.Collection.prototype */ {

    // The default model for a collection is just a NCMB.Object.
    // This should be overridden in most cases.
    
    model: NCMB.Object,

    /**
     * デフォルトの空の関数として返す。
     */
    initialize: function(){},

    /**
     * JSON形式を返す
     */
    toJSON: function() {
      return this.map(function(model){ return model.toJSON(); });
    },

    /**
     * モデルリストにモデル、モデルのリストを追加。　
     * 新しいモデルに **silent** が渡されると`add`イベントが発生することを防ぐ可能。
     */
    add: function(models, options) {
      var i, index, length, model, cid, id, cids = {}, ids = {};
      options = options || {};
      models = _.isArray(models) ? models.slice() : [models];

      // Begin by turning bare objects into model references, and preventing
      // invalid models or duplicate models from being added.
      for (i = 0, length = models.length; i < length; i++) {

        models[i] = this._prepareModel(models[i], options);
        model = models[i];
        if (!model) {
          throw new Error("Can't add an invalid model to a collection");
        }
        cid = model.cid;
        if (cids[cid] || this._byCid[cid]) {
          throw new Error("Duplicate cid: can't add the same model " +
                          "to a collection twice");
        }
        id = model.id;
        if (!NCMB._isNullOrUndefined(id) && (ids[id] || this._byId[id])) {
          throw new Error("Duplicate id: can't add the same model " +
                          "to a collection twice");
        }
        ids[id] = model;
        cids[cid] = model;
      }

      // Listen to added models' events, and index models for lookup by
      // `id` and by `cid`.
      for (i = 0; i < length; i++) {
        (model = models[i]).on('all', this._onModelEvent, this);
        this._byCid[model.cid] = model;
        if (model.id) {
          this._byId[model.id] = model;
        }
      }

      // Insert models into the collection, re-sorting if needed, and triggering
      // `add` events unless silenced.
      this.length += length;
      index = NCMB._isNullOrUndefined(options.at) ? 
          this.models.length : options.at;
      this.models.splice.apply(this.models, [index, 0].concat(models));
      if (this.comparator) {
        this.sort({silent: true});
      }
      if (options.silent) {
        return this;
      }
      for (i = 0, length = this.models.length; i < length; i++) {
        model = this.models[i];
        if (cids[model.cid]) {
          options.index = i;
          model.trigger('add', model, this, options);
        }
      }

      return this;
    },

    /**
     * セットからモデル・モデルリストを削除する。
     * 削除するモデルに **silent** が渡されると<code>remove</code>イベントが発生することを防ぐ可能。
     */
    remove: function(models, options) {
      var i, l, index, model;
      options = options || {};
      models = _.isArray(models) ? models.slice() : [models];
      for (i = 0, l = models.length; i < l; i++) {
        model = this.getByCid(models[i]) || this.get(models[i]);
        if (!model) {
          continue;
        }
        delete this._byId[model.id];
        delete this._byCid[model.cid];
        index = this.indexOf(model);
        this.models.splice(index, 1);
        this.length--;
        if (!options.silent) {
          options.index = index;
          model.trigger('remove', model, this, options);
        }
        this._removeReference(model);
      }
      return this;
    },

    /**
     * IDがセットしたモデルを取得する。
     */
    get: function(id) {
      return id && this._byId[id.id || id];
    },

    /**
     * クライアントIDがセットしたモデルを取得する。
     */
    getByCid: function(cid) {
      return cid && this._byCid[cid.cid || cid];
    },

    /**
     * 指定されたindexでのモデルを取得する。
     */
    at: function(index) {
      return this.models[index];
    },

    /**
     * コレクションを自分でソートするように強制にやらせる。普段はこの関数を利用必要がない。
     * セットはソートの順番を保持するため、新しい項目が追加されても、ソート順番は変更ない。
     */
    sort: function(options) {
      options = options || {};
      if (!this.comparator) {
        throw new Error('Cannot sort a set without a comparator');
      }
      var boundComparator = _.bind(this.comparator, this);
      if (this.comparator.length === 1) {
        this.models = this.sortBy(boundComparator);
      } else {
        this.models.sort(boundComparator);
      }
      if (!options.silent) {
        this.trigger('reset', this, options);
      }
      return this;
    },

    /**
     * コレクションのモデルの属性を引っ張る。
     */
    pluck: function(key) {
      return _.map(this.models, function(model){ return model.get(key); });
    },

    /**
     * 個別に追加および削除する項目より多く項目を取得したい場合、
     * 全体項目のセットを新しいモデルリストとリセットする可能である。
     * `add` か `remove`イベントを発火させない。メソッド実行が完了したら、 `reset`イベントが発火させる。
     */
    reset: function(models, options) {
      var self = this;
      models = models || [];
      options = options || {};
      NCMB._arrayEach(this.models, function(model) {
        self._removeReference(model);
      });
      this._reset();
      this.add(models, {silent: true, NCMB: options.parse});
      if (!options.silent) {
        this.trigger('reset', this, options);
      }
      return this;
    },

    /**
     *  コレクションのデフォルトセットをフェッチ、コレクションをリセットする。
     * `add: true` が渡された場合、リセットではなく、コレクションにモデル追加する。
     */
    fetch: function(options) {
      options = _.clone(options) || {};
      if (options.parse === undefined) {
        options.parse = true;
      }
      var collection = this;
      var query = this.query || new NCMB.Query(this.model);
      return query.find().then(function(results) {
        if (options.add) {
          collection.add(results, options);
        } else {
          collection.reset(results, options);
        }
        return collection;
      })._thenRunCallbacks(options, this);
    },

    /**
     * コレクションに新しいモデルのイスタンスを作成する。
     * コレクションにモデルを追加する。
     * `wait: true` が渡された場合、サーバーから同意を待ちが必要である。
     */
    create: function(model, options) {
      var coll = this;
      options = options ? _.clone(options) : {};
      model = this._prepareModel(model, options);
      if (!model) {
        return false;
      }
      if (!options.wait) {
        coll.add(model, options);
      }
      var success = options.success;
      options.success = function(nextModel, resp, xhr) {
        if (options.wait) {
          coll.add(nextModel, options);
        }
        if (success) {
          success(nextModel, resp);
        } else {
          nextModel.trigger('sync', model, resp, options);
        }
      };
      model.save(null, options);
      return model;
    },

    /**
    　*　レスポンスをコレクションに追加するためのモデルリストに変換する。　デフォルトの実装はパスさせる。
     * @ignore
     */
    parse: function(resp, xhr) {
      return resp;
    },

    /**
     * _のチェインのプロキシ。underscoreのconstructorに依存してしまうのため、
     * underscoreのメソッドと同じ方法で代理させることはできない。
     */
    chain: function() {
      return _(this.models).chain();
    },

    /**
     * Reset all internal state. Called when the collection is reset.
     */
    _reset: function(options) {
      this.length = 0;
      this.models = [];
      this._byId  = {};
      this._byCid = {};
    },

    /**
     * Prepare a model or hash of attributes to be added to this collection.
     */
    _prepareModel: function(model, options) {
      if (!(model instanceof NCMB.Object)) {
        var attrs = model;
        options.collection = this;
        model = new this.model(attrs, options);
        if (!model._validate(model.attributes, options)) {
          model = false;
        }
      } else if (!model.collection) {
        model.collection = this;
      }
      return model;
    },

    /**
     * Internal method to remove a model's ties to a collection.
     */
    _removeReference: function(model) {
      if (this === model.collection) {
        delete model.collection;
      }
      model.off('all', this._onModelEvent, this);
    },

    /**
     * Internal method called every time a model in the set fires an event.
     * Sets need to update their indexes when models change ids. All other
     * events simply proxy through. "add" and "remove" events that originate
     * in other collections are ignored.
     */
    _onModelEvent: function(ev, model, collection, options) {
      if ((ev === 'add' || ev === 'remove') && collection !== this) {
        return;
      }
      if (ev === 'destroy') {
        this.remove(model, options);
      }
      if (model && ev === 'change:objectId') {
        delete this._byId[model.previous("objectId")];
        this._byId[model.id] = model;
      }
      this.trigger.apply(this, arguments);
    }

  });

  // Collectionに実装するUnderscoreのメソッド。
  var methods = ['forEach', 'each', 'map', 'reduce', 'reduceRight', 'find',
    'detect', 'filter', 'select', 'reject', 'every', 'all', 'some', 'any',
    'include', 'contains', 'invoke', 'max', 'min', 'sortBy', 'sortedIndex',
    'toArray', 'size', 'first', 'initial', 'rest', 'last', 'without', 'indexOf',
    'shuffle', 'lastIndexOf', 'isEmpty', 'groupBy'];

  // Mix in each Underscore method as a proxy to `Collection#models`.
  NCMB._arrayEach(methods, function(method) {
    NCMB.Collection.prototype[method] = function() {
      return _[method].apply(_, [this.models].concat(_.toArray(arguments)));
    };
  });

  /**
   * <code>NCMB.Collection</code>の新しいサブクラスを作成する。例えば以下のサンプルコードを参照。
   * <pre>
   *   var MyCollection = NCMB.Collection.extend({
   *     // Instance properties
   *
   *     model: MyClass,
   *     query: MyQuery,
   *
   *     getFirst: function() {
   *       return this.at(0);
   *     }
   *   }, {
   *     // Class properties
   *
   *     makeOne: function() {
   *       return new MyCollection();
   *     }
   *   });
   *
   *   var collection = new MyCollection();
   * </pre>
   *
   * @function
   * @param {Object} instanceProps コレクションのインスタンスの属性。
   * @param {Object} classProps コレクションのクラス属性。
   * @return {Class} <code>NCMB.Collection</code>の新しいサブクラス。
   */
  NCMB.Collection.extend = NCMB._extend;
}(this));


/************************************************** NCMB Push class ************************************/
(function(root) {
  root.NCMB = root.NCMB || {};
  var NCMB = root.NCMB;

  NCMB.Installation = NCMB.Object.extend("installation");

  /**
   * NCMBのプッシュを操作するクラスである。
   * @name NCMB.Push
   * @namespace
   * NCMBのプッシュを操作するクラスである。
   */

   NCMB.Push = NCMB.Object.extend("push");

   NCMB.Push.constructor = function(data) {
      this._data = data;
   };

   NCMB.Push.save = function(data, options) {
      if(!data) {
        if (this._data) {
          data = this._data;          
        } else {
          data = {};
        }
      }

      // userSearchCondition
      //if (data.userSearchCondition) {
      //  data.userSearchCondition = NCMB._encode(data.userSearchCondition);
      //}

      if (data.searchCondition) {
        data.searchCondition = NCMB._encode(data.searchCondition);
      }
      if (data.deliveryExpirationDate) {
        data.deliveryExpirationDate = NCMB._encode(data.deliveryExpirationDate);
      }
      if (data.deliveryTime) {
        data.deliveryTime = NCMB._encode(data.deliveryTime);
      }
      if (data.deliveryExpirationTime) {
        data.deliveryExpirationTime = NCMB._encode(data.deliveryExpirationTime);
      }

      if (data.deliveryExpirationDate && data.deliveryExpirationTime) {
        throw "Both deliveryExpirationDate and deliveryExpirationTime can't be set";
      }

      var request = NCMB._request('push', null, null, 'POST', data);
      return request._thenRunCallbacks(options);
   };

    /**
     * プッシュ通知を送信する。
     * @param {Object} data -  プッシュ通知のデーター。　有効なフィールドは以下のようになっている:
     *   <ol>
     *     <li>deliveryTime - プッシュするタイミングのデートオブジェクト</li>
     *     <li>immediateDeliveryFlag - 即時配信</li>
     *     <li>target - ターゲット</li>
     *     <li>searchCondition -  NCMB.Installation検索条件設定にマッチするクエリNCMB.Query</li>
     *     <li>message - プッシュで送信するデーター</li>
     *     <li>deliveryExpirationDate -  配信期限日 </li>
     *     <li>deliveryExpirationTime -  配信期限時間 </li>
     *     <li>action {String} アクション </li>
     *     <li>badgeIncrementFlag {Boolean} バッジ数増加フラグ </li>
     *     <li>sound {String} 音楽ファイル </li>
     *     <li>contentAvailable {Boolean} content-available </li>
     *     <li>title {String} タイトル </li>
     *     <li>userSettingValue {Object} ユーザ設定値 </li>
     *     <li>acl {NCMB.ACL} ACL </li>
     *     <li style="display:none;"> userSearchCondition -  NCMB.User検索条件設定にマッチするクエリNCMB.Query</li>
     *     <li>dialog - Androidのみ。ダイアログプッシュの設定。未指定時の初期値は「false」</li>
     *     <li>richUrl - リッチコンテンツ表示用のURL未指定時の初期値は「Null」</li>
     *     <li>category - iOSのinteractive notification設定
     *   <ol>
     * @param {Object} options 
     *  オプションオブジェクト。任意のオプションsuccessコールバック関数であり、
     *  変数がない関数で、成功のプッシュの時に実行させる。
     */
     
  NCMB.Push.send = function(data, options) {
      //if (data.userSearchCondition) {
      //  data.userSearchCondition = NCMB._encode(data.userSearchCondition);
      //}
      if (data.searchCondition) {
        data.searchCondition = NCMB._encode(data.searchCondition);
      }

      if (data.deliveryExpirationDate) {
        data.deliveryExpirationDate = NCMB._encode(data.deliveryExpirationDate);
      }
      if (data.deliveryTime) {
        data.deliveryTime = NCMB._encode(data.deliveryTime);
      }
      if (data.deliveryExpirationTime) {
        data.deliveryExpirationTime = NCMB._encode(data.deliveryExpirationTime);
      }

      if (data.deliveryExpirationDate && data.deliveryExpirationTime) {
        throw "Both deliveryExpirationDate and deliveryExpirationTime can't be set";
      }
      var request = NCMB._request('push', null, null, 'POST', data);
      return request._thenRunCallbacks(options);
    };
}(this));


/************************************************** NCMB Facebook class ************************************/

/*global FB: false , console: false*/
(function(root) {
  root.NCMB = root.NCMB || {};
  var NCMB = root.NCMB;
  var _ = NCMB._;

  var PUBLIC_KEY = "*";

  var initialized = false;
  var requestedPermissions;
  var initOptions;
  var provider = {
    authenticate: function(options) {
      var self = this;
      FB.login(function(response) {
        if (response.authResponse) {
          if (options.success) {
            options.success(self, {
              id: response.authResponse.userID,
              access_token: response.authResponse.accessToken,
              expiration_date: new Date(response.authResponse.expiresIn * 1000 +
                  (new Date()).getTime()).toJSON()
            });
          }
        } else {
          if (options.error) {
            options.error(self, response);
          }
        }
      }, {
        scope: requestedPermissions
      });
    },
    restoreAuthentication: function(authData) {
      if (authData) {
        var authResponse = {
          userID: authData.id,
          accessToken: authData.access_token,
          expiresIn: (NCMB._NCMBDate(authData.expiration_date.iso).getTime() -
              (new Date()).getTime()) / 1000
        };
        var newOptions = _.clone(initOptions);
        newOptions.authResponse = authResponse;

        // Suppress checks for login status from the browser.
        newOptions.status = false;
        FB.init(newOptions);
      }
      return true;
    },
    getAuthType: function() {
      return "facebook";
    },
    deauthenticate: function() {
      this.restoreAuthentication(null);
      FB.logout();
    }
  };

  /**
   * Facebookと連携するために利用するメソッドを提供するクラスである。
   * @namespace
   * Facebookと連携するために利用するメソッドを提供するクラスである。
   */
  NCMB.FacebookUtils = {
    /**
     * NCMB Facebookを連携するメソッドを開始する。
     * このメソッドは渡されたパラメーターで渡す<code>
     * <a href=
     * "https://developers.facebook.com/docs/reference/javascript/FB.init/">
     * FB.init()</a></code>、Facebook Javascript SDKをロードされた後すぐ実行すること。　
     * NCMB.FacebookUtilsはこのパラメーターを利用して、FB.init()を実行させる。
     *
     * @param {Object} options　Facebookオプション、以下のリンクで説明に参考してください.
     *   <a href=
     *   "https://developers.facebook.com/docs/reference/javascript/FB.init/">
     *   FB.init()</a>. NCMB Facebookと統合するため、ステータスフラグは'false'にセットされる。
     *   アプリケーションが求める場合、FB.getLoginStatus()を明確に実行する可能である。
     */
    init: function(options) {
      if (typeof(FB) === 'undefined') {
        throw "The Facebook JavaScript SDK must be loaded before calling init.";
      } 
      initOptions = _.clone(options) || {};
      if (initOptions.status && typeof(console) !== "undefined") {
        var warn = console.warn || console.log || function() {};
        /*
        warn.call(console, "The 'status' flag passed into" +
          " FB.init, when set to true, can interfere with NCMB Facebook" +
          " integration, so it has been suppressed. Please call" +
          " FB.getLoginStatus() explicitly if you require this behavior.");
        */
      }
      initOptions.status = false;
      FB.init(initOptions);
      NCMB.User._registerAuthenticationProvider(provider);
      initialized = true;
    },

    /**
     * ユーザーのアカウントはFacebookとリンクされたかどうか取得する。
     * 
     * @param {NCMB.User} user Facebookリンクをチェックするためのユーザー。　
     * デバイスにログインする必要がある。　　
     * @return {Boolean} <code>true</code> ユーザーのアカウントがFacebookにリンクしているかどうか取得する。
     */
    isLinked: function(user) {
      return user._isLinked("facebook");
    },

    /**
     *　Facebook認証を利用し、ユーザーログインを行う。このメソッドはFacebook SDKを継承し、
     * ユーザー認証を行い、 認証が完了したあと、
     * 自動的にNCMB.Userとしてログインを行う。新規ユーザーの場合には、新規ユーザー登録を行う。
     * 
     * @param {String, Object} permissions Facebookにログインするため、
     * 必要なパーミションである。複数の場合、','で区別する。　
     * また、自分で制御する場合、FacebookのauthDataオブジェクトを提供し、
     * Facebookにログインを行うことが可能である。
     * @param {Object} options successとerrorの標準のオプションオブジェクト。
     */
    logIn: function(permissions, options) {
      if (!permissions || _.isString(permissions)) {
        if (!initialized) {
          throw "You must initialize FacebookUtils before calling logIn.";
        }
        requestedPermissions = permissions;
        return NCMB.User._logInWith("facebook", options);
      } else {
        var newOptions = _.clone(options) || {};
        newOptions.authData = permissions;
        return NCMB.User._logInWith("facebook", newOptions);
      }
    },

    /**
     * NCMBUserの既存ユーザーとリンクさせるメソッド。
     * このメソッドはFacebook認証にメソッドを実行させ、 
     * 自動的に既存ユーザーNCMB.Userアカウントとリンクさせる。
     *
     * @param {NCMB.User} user Facebookにリンクするユーザー。　現在ログインしているユーザーであること。 
     * @param {String, Object} permissions Facebookにログインするため、必要なパーミションである。
     * 複数の場合、','で区別する。　また、自分で制御する場合、FacebookのauthDataオブジェクトを提供し、
     * Facebookログインを行うことが可能である。
     * @param {Object} options successとerrorのコールバックを提供する標準のオプションオブジェクト。
     */
    link: function(user, permissions, options) {
      if (!permissions || _.isString(permissions)) {
        if (!initialized) {
          throw "You must initialize FacebookUtils before calling link.";
        }
        requestedPermissions = permissions;
        return user._linkWith("facebook", options);
      } else {
        var newOptions = _.clone(options) || {};
        newOptions.authData = permissions;
        return user._linkWith("facebook", newOptions);
      }
    },

    /**
     * NCMB.UserをFacebookアカウントからアンリンクする。
     * 
     * @param {NCMB.User} user Facebookからアンリンクするユーザー。現在ログイン中のユーザーであること。
     * @param {Object} options　successとerrorのコールバックを提供する標準のオプションオブジェクト。
     */
    unlink: function(user, options) {
      if (!initialized) {
        throw "You must initialize FacebookUtils before calling unlink.";
      }
      return user._unlinkFrom("facebook", options);
    }
  };
}(this));


/************************************************** NCMB View class ************************************/
/*global _: false, document: false */
(function(root) {
  root.NCMB = root.NCMB || {};
  var NCMB = root.NCMB;
  var _ = NCMB._;

  /**
   * 既存要素が提供されていない場合、DOM以外に新しく初期化された要素を作成するクラス。
   * @class
   *
   * <p>ユーザーの利便性を向上させるため、Backbone互換のViewを提供するクラスである。
   * このクラスを利用するため、jQueryかjqueryの$に互換ライブラリーを入れ含めるか参照することが必要である。
   * 詳しくは<a href="http://documentcloud.github.com/backbone/#View">Backbone
   * documentation</a>を参照してください。</p>
   * <p><strong><em>SDKクライアントで利用するのみ。</em></strong></p>
   */
  NCMB.View = function(options) {
    this.cid = _.uniqueId('view');
    this._configure(options || {});
    this._ensureElement();
    this.initialize.apply(this, arguments);
    this.delegateEvents();
  };

  // Cached regex to split keys for `delegate`.
  var eventSplitter = /^(\S+)\s*(.*)$/;

  // List of view options to be merged as properties.
  
  var viewOptions = ['model', 'collection', 'el', 'id', 'attributes',
                     'className', 'tagName'];

  // Set up all inheritable **NCMB.View** properties and methods.
  _.extend(NCMB.View.prototype, NCMB.Events,
           /** @lends NCMB.View.prototype */ {

    // The default `tagName` of a View's element is `"div"`.
    tagName: 'div',

    /**
     * 現在のビューの中にあるDOM要素を対象にする形で要素のルックアップをjQueryに委譲する。
     */
    $: function(selector) {
      return this.$el.find(selector);
    },

    /**
     * デフォルトは空の初期化関数。自由にオーバーライド可能である。
     */
    initialize: function(){},

    /**
     * ビューがオーバーライド必要があるコア関数である。
     * 適切のHTMLに適用するために必要。
     * **render** の注意はいつも`this`として返却する必要がある。
     */
    render: function() {
      return this;
    },

    /**
     * DOMからビューを削除する。デフォルトはビューが表示されない。
     * そのため、このメソッドを呼び出す時、no-opとして実行する可能性がある。
     */
    remove: function() {
      this.$el.remove();
      return this;
    },

    /**
     * DOMの要素が少ない場合、利用する。
     * 要素を作成するため、**make**を1回利用する。
     * <pre>
     *     var el = this.make('li', {'class': 'row'},
     *                        this.model.escape('title'));</pre>
     */
    make: function(tagName, attributes, content) {
      var el = document.createElement(tagName);
      if (attributes) {
        NCMB.$(el).attr(attributes);
      }
      if (content) {
        NCMB.$(el).html(content);
      }
      return el;
    },

    /**
     * イベントの再委任も含めビューの要素（`this.el`属性）を変更する。 
     */
    setElement: function(element, delegate) {
      this.$el = NCMB.$(element);
      this.el = this.$el[0];
      if (delegate !== false) {
        this.delegateEvents();
      }
      return this;
    },

    /**
     * コールバックを設定する。
     * <code>this.events</code> はハッシュであり、
     * <pre>
     * *{"event selector": "callback"}*
     *     {
     *       'mousedown .title':  'edit',
     *       'click .button':     'save'
     *       'click .open':       function(e) { 
                //code 
     *        }
     *     }
     * </pre>
     * の組がある. コールバックはビューにバインドさせ、`this`のセットを適切に利用する。
     *　イベントの委任を利用する方にお勧めする。
     * `this.el`にイベントをバインドするセレクターを除く。
     * 委任可能なイベントしか有効である。
     * IEの場合、次のイベントは不可である。
     * `focus`, `blur`, `change`, `submit`, `reset`である。
     */
    delegateEvents: function(events) {
      events = events || NCMB._getValue(this, 'events');
      if (!events) {
        return;
      }
      this.undelegateEvents();
      var self = this;
      NCMB._objectEach(events, function(method, key) {
        if (!_.isFunction(method)) {
          method = self[events[key]];
        }
        if (!method) {
          throw new Error('Event "' + events[key] + '" does not exist');
        }
        var match = key.match(eventSplitter);
        var eventName = match[1], selector = match[2];
        method = _.bind(method, self);
        eventName += '.delegateEvents' + self.cid;
        if (selector === '') {
          self.$el.bind(eventName, method);
        } else {
          self.$el.delegate(selector, eventName, method);
        }
      });
    },

    /**
     * `delegateEvents`でバインドされたコールバックをすべてクリアをする。
     * 普段は利用する必要がないが、同じDOM要素に所属させる複数の
     * Backboneビューを作成する場合、必要がある。
     */
    undelegateEvents: function() {
      this.$el.unbind('.delegateEvents' + this.cid);
    },

    /**
     * Performs the initial configuration of a View with a set of options.
     * Keys with special meaning *(model, collection, id, className)*, are
     * attached directly to the view.
     */
    _configure: function(options) {
      if (this.options) {
        options = _.extend({}, this.options, options);
      }
      var self = this;
      _.each(viewOptions, function(attr) {
        if (options[attr]) {
          self[attr] = options[attr];
        }
      });
      this.options = options;
    },

    /**
     * Ensure that the View has a DOM element to render into.
     * If `this.el` is a string, pass it through `$()`, take the first
     * matching element, and re-assign it to `el`. Otherwise, create
     * an element from the `id`, `className` and `tagName` properties.
     */
    _ensureElement: function() {
      if (!this.el) {
        var attrs = NCMB._getValue(this, 'attributes') || {};
        if (this.id) {
          attrs.id = this.id;
        }
        if (this.className) {
          attrs['class'] = this.className;
        }
        this.setElement(this.make(this.tagName, attrs), false);
      } else {
        this.setElement(this.el, false);
      }
    }

  });

  /**
   * @function
   * @param {Object} instanceProps ビュー―のためのインスタンス属性である。
   * @param {Object} classProps ビューのためのクラスの属性である。
   * @return {Class} <code>NCMB.View</code>の新サブクラス。
   */
  NCMB.View.extend = NCMB._extend;
}(this));

/************************************************** NCMB Router class ************************************/

/*global _: false*/
(function(root) {
  root.NCMB = root.NCMB || {};
  var NCMB = root.NCMB;
  var _ = NCMB._;

  /**
   * faux-URLをアクションにマップするためのクラス。アクションにマッチされたら、イベントを発火させる。
   * 'routes'ハッシュをセットするために、静的にセットされない場合、新しいセットの作成を行う。
   * @class
   *
   * <p>Backbone.Routerと互換し、ユーザーが使いやすくするために提供するクラスである。
   * 詳しくは、以下のURLを参照してください。
   * <a href="http://documentcloud.github.com/backbone/#Router">Backbone
   * documentation</a>.</p>
   * <p><strong><em>クライアントSDKのみ提供する。</em></strong></p>
   */
  NCMB.Router = function(options) {
    options = options || {};
    if (options.routes) {
      this.routes = options.routes;
    }
    this._bindRoutes();
    this.initialize.apply(this, arguments);
  };

  // Cached regular expressions for matching named param parts and splatted
  // parts of route strings.
  var namedParam    = /:\w+/g;
  var splatParam    = /\*\w+/g;
  var escapeRegExp  = /[\-\[\]{}()+?.,\\\^\$\|#\s]/g;

  // Set up all inheritable **NCMB.Router** properties and methods.
  _.extend(NCMB.Router.prototype, NCMB.Events,
           /** @lends NCMB.Router.prototype */ {

    /**
     * デフォルトは空初期化関数である。　
     * ユーザーは任意のロジックで初期化関数をオーバーライドする。
     */
    initialize: function(){},

    /**
     * 手動的にrouteをコールバックにバインドする。
     * 例えば：
     *
     * <pre>　this.route('search/:query/p:num', 'search', function(query, num) {
     *       //actions
     *     });
     * </pre>
     *
     */
    route: function(route, name, callback) {
      NCMB.history = NCMB.history || new NCMB.History();
      if (!_.isRegExp(route)) {
        route = this._routeToRegExp(route);
      } 
      if (!callback) {
        callback = this[name];
      }
      NCMB.history.route(route, _.bind(function(fragment) {
        var args = this._extractParameters(route, fragment);
        if (callback) {
          callback.apply(this, args);
        }
        this.trigger.apply(this, ['route:' + name].concat(args));
        NCMB.history.trigger('route', this, name, args);
      }, this));
      return this;
    },

    /**
     *　アプリケーションのナビゲートポイントでURLとして保存したい場合、
     * URLを更新するため、navigateを実行する。
     * route関数を実行させたい場合、triggerのオプションをtrueとして設定が必要である。
     * ブラウザーの履歴に項目を作成せず、
     * URLを更新したい場合replaceオプションをtrueに設定する。
     */
    navigate: function(fragment, options) {
      NCMB.history.navigate(fragment, options);
    },

    // Bind all defined routes to `NCMB.history`. We have to reverse the
    // order of the routes here to support behavior where the most general
    // routes can be defined at the bottom of the route map.
    _bindRoutes: function() {
      if (!this.routes) { 
        return;
      }
      var routes = [];
      for (var route in this.routes) {
        if (this.routes.hasOwnProperty(route)) {
          routes.unshift([route, this.routes[route]]);
        }
      }
      for (var i = 0, l = routes.length; i < l; i++) {
        this.route(routes[i][0], routes[i][1], this[routes[i][1]]);
      }
    },

    // Convert a route string into a regular expression, suitable for matching
    // against the current location hash.
    _routeToRegExp: function(route) {
      route = route.replace(escapeRegExp, '\\$&')
                   .replace(namedParam, '([^\/]+)')
                   .replace(splatParam, '(.*?)');
      return new RegExp('^' + route + '$');
    },

    // Given a route, and a URL fragment that it matches, return the array of
    // extracted parameters.
    _extractParameters: function(route, fragment) {
      return route.exec(fragment).slice(1);
    }
  });

  /**
   * @function
   * @param {Object} instanceProps routerのためのインスタンス属性。
   * @param {Object} classProps routerのためのクラス属性。
   * @return {Class} <code>NCMB.Router</code>のサブクラス。
   */
  NCMB.Router.extend = NCMB._extend;
}(this));


/************************************************** NCMB History class ************************************/

/*global _: false, document: false, window: false, navigator: false */
(function(root) {
  root.NCMB = root.NCMB || {};
  var NCMB = root.NCMB;
  var _ = NCMB._;

  /**
   *　グローバルルーターとして担当し、ハッシュ変更のイベントやpushStateを操作し、
   * 適切なルートにマッチし、コールバックを発火させる。
   * 新しく作成するより、 <code>NCMB.history</code>に参照する方法の方がお勧めする。
   * そうすると、Routerを利用する時自動的に作成される。
   * @class
   *   
   * <p>ユーザーのためにBackbone互換のRouterを提供するクラスである。
   * このクラスを利用するため、jQueryかjqueryの$に互換ライブラリーを含めるか参照することが必要である。
   * 詳しくは<a href="http://documentcloud.github.com/backbone/#View">Backbone
   * documentation</a>.</p>を参照してください。
   * <p><strong><em>SDKクライアントのみ利用する。</em></strong></p>
   */
  NCMB.History = function() {
    this.handlers = [];
    _.bindAll(this, 'checkUrl');
  };

  // Cached regex for cleaning leading hashes and slashes .
  var routeStripper = /^[#\/]/;

  // Cached regex for detecting MSIE.
  var isExplorer = /msie [\w.]+/;

  // Has the history handling already been started?
  NCMB.History.started = false;

  // Set up all inheritable **NCMB.History** properties and methods.
  _.extend(NCMB.History.prototype, NCMB.Events,
           /** @lends NCMB.History.prototype */ {

    // The default interval to poll for hash changes, if necessary, is
    // twenty times a second.
    interval: 50,

    /**
     * ハッシュ値を返却する。Firefoxの場合、
     * location.hashがデコードされたため、location.hashを直接利用しないこと。
     */
    getHash: function(windowOverride) {
      var loc = windowOverride ? windowOverride.location : window.location;
      var match = loc.href.match(/#(.*)$/);
      return match ? match[1] : '';
    },
    
    /**
    * URLかハッシュかオーバーライドからクロスブラウザーに標準化したURLフラグメントを返却する。
    */
    getFragment: function(fragment, forcePushState) {
      if (NCMB._isNullOrUndefined(fragment)) {
        if (this._hasPushState || forcePushState) {
          fragment = window.location.pathname;
          var search = window.location.search;
          if (search) {
            fragment += search;
          }
        } else {
          fragment = this.getHash();
        }
      }
      if (!fragment.indexOf(this.options.root)) {
        fragment = fragment.substr(this.options.root.length);
      }
      return fragment.replace(routeStripper, '');
    },

    /**
     * 操作を開始する。存在するルートに現在のURLマッチする場合、
     * `true`を返却し、その以外の場合、`false`を返却する。
     */
    start: function(options) {
      if (NCMB.History.started) {
        throw new Error("NCMB.history has already been started");
      }
      NCMB.History.started = true;

      // Figure out the initial configuration. Do we need an iframe?
      // Is pushState desired ... is it available?
      this.options = _.extend({}, {root: '/'}, this.options, options);
      this._wantsHashChange = this.options.hashChange !== false;
      this._wantsPushState = !!this.options.pushState;
      this._hasPushState = !!(this.options.pushState && 
                              window.history &&
                              window.history.pushState);
      var fragment = this.getFragment();
      var docMode = document.documentMode;
      var oldIE = (isExplorer.exec(navigator.userAgent.toLowerCase()) &&
                   (!docMode || docMode <= 7));

      if (oldIE) {
        this.iframe = NCMB.$('<iframe src="javascript:0" tabindex="-1" />')
                      .hide().appendTo('body')[0].contentWindow;
        this.navigate(fragment);
      }

      // Depending on whether we're using pushState or hashes, and whether
      // 'onhashchange' is supported, determine how we check the URL state.
      if (this._hasPushState) {
        NCMB.$(window).bind('popstate', this.checkUrl);
      } else if (this._wantsHashChange &&
                 ('onhashchange' in window) &&
                 !oldIE) {
        NCMB.$(window).bind('hashchange', this.checkUrl);
      } else if (this._wantsHashChange) {
        this._checkUrlInterval = window.setInterval(this.checkUrl,
                                                    this.interval);
      }

      // Determine if we need to change the base url, for a pushState link
      // opened by a non-pushState browser.
      this.fragment = fragment;
      var loc = window.location;
      var atRoot  = loc.pathname === this.options.root;

      // If we've started off with a route from a `pushState`-enabled browser,
      // but we're currently in a browser that doesn't support it...
      if (this._wantsHashChange && 
          this._wantsPushState && 
          !this._hasPushState &&
          !atRoot) {
        this.fragment = this.getFragment(null, true);
        window.location.replace(this.options.root + '#' + this.fragment);
        // Return immediately as browser will do redirect to new url
        return true;

      // Or if we've started out with a hash-based route, but we're currently
      // in a browser where it could be `pushState`-based instead...
      } else if (this._wantsPushState &&
                 this._hasPushState && 
                 atRoot &&
                 loc.hash) {
        this.fragment = this.getHash().replace(routeStripper, '');
        window.history.replaceState({}, document.title,
            loc.protocol + '//' + loc.host + this.options.root + this.fragment);
      }

      if (!this.options.silent) {
        return this.loadUrl();
      }
    },
    
    /**
     * 一時的にNCMB.Historyを無効にする。リアルのアプリケーションでは必要ではないが、ユニットテスト時に利用する可能性がある。
     */
    stop: function() {
      NCMB.$(window).unbind('popstate', this.checkUrl)
                     .unbind('hashchange', this.checkUrl);
      window.clearInterval(this._checkUrlInterval);
      NCMB.History.started = false;
    },

    /**
     * フラグメントを変更する時、テスト用のルートを追加する。
     *　後で追加する場合、前回のルートをオーバーライドする。
     */
     route: function(route, callback) {
      this.handlers.unshift({route: route, callback: callback});
    },

    /**
    * 現在のURLをチェックし、変更があるかどうか判断し、取得する。
    * 変更があった場合、隠したiframeを標準化し、'loadUrl'を実行させる。
    */
    checkUrl: function(e) {
      var current = this.getFragment();
      if (current === this.fragment && this.iframe) {
        current = this.getFragment(this.getHash(this.iframe));
      }
      if (current === this.fragment) {
        return false;
      }
      if (this.iframe) {
        this.navigate(current);
      }
      if (!this.loadUrl()) {
        this.loadUrl(this.getHash());
      }
    },

    /**
    * 現在のURLフラグメントをロードさせる。
    *　ルートが成功にマッチさせた場合、`true`を返却する。
    * フラグメントにマッチするルートがない場合、`false`を返却する。
    */

    loadUrl: function(fragmentOverride) {
      var fragment = this.fragment = this.getFragment(fragmentOverride);
      var matched = _.any(this.handlers, function(handler) {
        if (handler.route.test(fragment)) {
          handler.callback(fragment);
          return true;
        }
      });
      return matched;
    },

    /**
    * ハッシュ履歴にフラグメントを保存するか、'replace'オプションが渡された場合、URLステートを交換する。
    * フラグメントを適切なURLエンコーディングする可能である。
    * optionsオブジェクトに`trigger: true`を渡した場合、ルートのコールバックを発火させる。
    * `replace: true`を渡した場合、履歴に項目を追加せず、現在のURLを変更する可能である。
    */

    navigate: function(fragment, options) {
      if (!NCMB.History.started) {
        return false;
      }
      if (!options || options === true) {
        options = {trigger: options};
      }
      var frag = (fragment || '').replace(routeStripper, '');
      if (this.fragment === frag) {
        return;
      }

      // If pushState is available, we use it to set the fragment as a real URL.
      if (this._hasPushState) {
        if (frag.indexOf(this.options.root) !== 0) {
          frag = this.options.root + frag;
        }
        this.fragment = frag;
        var replaceOrPush = options.replace ? 'replaceState' : 'pushState';
        window.history[replaceOrPush]({}, document.title, frag);

      // If hash changes haven't been explicitly disabled, update the hash
      // fragment to store history.
      } else if (this._wantsHashChange) {
        this.fragment = frag;
        this._updateHash(window.location, frag, options.replace);
        if (this.iframe &&
            (frag !== this.getFragment(this.getHash(this.iframe)))) {
          // Opening and closing the iframe tricks IE7 and earlier
          // to push a history entry on hash-tag change.
          // When replace is true, we don't want this.
          if (!options.replace) {
            this.iframe.document.open().close();
          }
          this._updateHash(this.iframe.location, frag, options.replace);
        }

      // If you've told us that you explicitly don't want fallback hashchange-
      // based history, then `navigate` becomes a page refresh.
      } else {
        window.location.assign(this.options.root + fragment);
      }
      if (options.trigger) {
        this.loadUrl(fragment);
      }
    },

    // Update the hash location, either replacing the current entry, or adding
    // a new one to the browser history.
    _updateHash: function(location, fragment, replace) {
      if (replace) {
        var s = location.toString().replace(/(javascript:|#).*$/, '');
        location.replace(s + '#' + fragment);
      } else {
        location.hash = fragment;
      }
    }
  });
}(this));


/************************************************** NCMB Geopoint class ************************************/

/*global navigator: false */
(function(root) {
  root.NCMB = root.NCMB || {};
  var NCMB = root.NCMB;
  var _ = NCMB._;

  /**
   * いずれの次のフォーマットで新しい GeoPoint　を作成:<br>
   *   <pre>
   *   new GeoPoint(arg1 , arg2)
   *
   *   new GeoPoint(otherPoint)
   *   new GeoPoint(30.0, 30.0)
   *   new GeoPoint([30.0, 30.0])
   *   new GeoPoint({latitude: 30.0, longitude: 30.0})
   *   new GeoPoint()  // デフォルトは(0, 0)
   *   </pre>
   * @class
   *
   * <p>緯度(latitude)/経度(longitude)の数値を表し、NCMBObjectのキーとして利用可能であり、
   * Geoクエリとして参照条件として利用することもできる。
   * 距離に基づいたクエリを作成可能である。</p>
   *
   * <p>例:<pre>
   *   var point = new NCMB.GeoPoint(30.0, -20.0);
   *   var object = new NCMB.Object("PlaceObject");
   *   object.set("location", point);
   *   object.save();</pre></p>
   */
  NCMB.GeoPoint = function(arg1, arg2) {
    if (_.isArray(arg1)) {
      NCMB.GeoPoint._validate(arg1[0], arg1[1]);
      this.latitude = arg1[0];
      this.longitude = arg1[1];
    } else if (_.isObject(arg1)) {
      NCMB.GeoPoint._validate(arg1.latitude, arg1.longitude);
      this.latitude = arg1.latitude;
      this.longitude = arg1.longitude;
    } else if (_.isNumber(arg1) && _.isNumber(arg2)) {
      NCMB.GeoPoint._validate(arg1, arg2);
      this.latitude = arg1;
      this.longitude = arg2;
    } else {
      this.latitude = 0;
      this.longitude = 0;
    }
  };

  /**
   * @lends NCMB.GeoPoint.prototype
   * @property {float} latitude North-south portion of the coordinate, in range
   *   [-90, 90].  Throws an exception if set out of range in a modern browser.
   * @property {float} longitude East-west portion of the coordinate, in range
   *   [-180, 180].  Throws if set out of range in a modern browser.
   */

  /**
   * Throws an exception if the given lat-long is out of bounds.
   */
  NCMB.GeoPoint._validate = function(latitude, longitude) {
    if (latitude < -90.0) {
      throw "NCMB.GeoPoint latitude " + latitude + " < -90.0.";
    }
    if (latitude > 90.0) {
      throw "NCMB.GeoPoint latitude " + latitude + " > 90.0.";
    }
    if (longitude < -180.0) {
      throw "NCMB.GeoPoint longitude " + longitude + " < -180.0.";
    }
    if (longitude > 180.0) {
      throw "NCMB.GeoPoint longitude " + longitude + " > 180.0.";
    }
  };

  /**
   * 可能であれば、ユーザーの現在地を利用し、GeoPointを作成.
   * 新しいインスタンスを作成し、作成が成功した場合、options.successが実行され、それ以外の場合 options.errorが実行される.
   * @param {Object} options successとerrorコールバックが定義されるオブジェクト.
   */
  NCMB.GeoPoint.current = function(options) {
    var promise = new NCMB.Promise();
    navigator.geolocation.getCurrentPosition(function(location) {
      promise.resolve(new NCMB.GeoPoint({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      }));
    }, function(error) {
      promise.reject(error);
    });

    return promise._thenRunCallbacks(options);
  };

  NCMB.GeoPoint.prototype = {
    /**
     * GeopointのJSON形式を返却.
     * @return {Object}
     */
    toJSON: function() {
      NCMB.GeoPoint._validate(this.latitude, this.longitude);
      return {
        "__type": "GeoPoint",
        latitude: this.latitude,
        longitude: this.longitude
      };
    },

  };
}(this));