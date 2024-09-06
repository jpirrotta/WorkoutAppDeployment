// src/utils/deepPickBy.ts
import _ from 'lodash';

type Predicate = (value: any, key: string) => boolean;

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