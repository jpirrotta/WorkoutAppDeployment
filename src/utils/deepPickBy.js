// src/utils/deepPickBy.js
const _ = require('lodash');

const deepPickBy = (value, predicate) => {
  return _.transform(value, function (result, val, key) {
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

module.exports = deepPickBy;