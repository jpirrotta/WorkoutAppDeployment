// src/utils/deepPickBy.ts
import _ from 'lodash';

type Predicate = (value: any, key: string) => boolean;

/**
 * Recursively picks properties from an object based on a predicate function.
 *
 * @param {any} value - The object to pick properties from.
 * @param {Predicate} predicate - The predicate function to determine which properties to pick.
 * @returns {any} - A new object with only the properties that satisfy the predicate.
 *
 * @example
 * const obj = {
 *   a: 1,
 *   b: {
 *     c: 2,
 *     d: 3,
 *   },
 *   e: 4,
 * };
 * const predicate = (value, key) => value > 2;
 * const result = deepPickBy(obj, predicate);
 * console.log(result); // { b: { d: 3 }, e: 4 }
 */
const deepPickBy = (value: any, predicate: Predicate): any => {
  return _.transform(value, (result: any, val: any, key: string) => {
    const isObject = _.isObject(val);
    const valid = predicate(val, key);

    if (isObject) {
      const picked = deepPickBy(val, predicate);
      if (!_.isEmpty(picked)) {
        _.set(result, key, picked);
      }
    } else if (valid) {
      _.set(result, key, val);
    }
  });
};

export default deepPickBy;