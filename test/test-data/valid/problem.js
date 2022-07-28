

let singleKey = function singleKey(item, index, key, comp, verbose) {
  let k; let subquery; let
    v;
  let oper; let srcType; let srcVal; let tgtType; let
    tgtVal;
  if (verbose == null) {
    verbose = false;
  }
  const expectedValue = key === '$not';
  switch (key) {
    case '$and':
    case '$not':
      if (_.isArray(comp)) {
        for (subquery of comp) {
          if (singleQuery(item, index, subquery, verbose) === expectedValue) {
            return false;
          }
        }
      } else if (_.typeOf(comp === 'object')) {
        for (k of Object.keys(comp || {})) {
          v = comp[k];
          subquery = { [k]: v };
          if (singleQuery(item, index, subquery, verbose) === expectedValue) {
            return false;
          }
        }
      } else {
        throw Error('$and/$not');
      }

      return true;

    case '$or':
      if (_.isArray(comp)) {
        for (subquery of comp) {
          if (singleQuery(item, index, subquery, verbose) === true) {
            return true;
          }
        }
      } else if (_.typeOf(comp === 'object')) {
        for (k of Object.keys(comp || {})) {
          v = comp[k];
          subquery = { [k]: v };
          if (singleQuery(item, index, subquery, verbose) === true) {
            return true;
          }
        }
      } else {
        throw Error('$or');
      }

      return false;
    // no default
  }
  const type = _.typeOf(comp);

  switch (type) {
    case 'object':
      for (oper of Object.keys(comp || {})) {
        tgtVal = comp[oper];
        srcVal = _.get(item, key);
        srcType = _.typeOf(srcVal);
        tgtType = _.typeOf(tgtVal);
        if (
          // eslint-disable-next-line no-use-before-define
          singleVal(item, index, key, srcType, srcVal, oper, tgtType, tgtVal, verbose) === false
        ) {
          return false;
        }
      }
      return true;

    case 'undefined':
    case 'null':
    case 'boolean':
    case 'string':
    case 'number':
    case 'date':
    case 'array':
      // simple equality
      oper = '$eq';
      srcVal = _.get(item, key);
      srcType = _.typeOf(srcVal);
      tgtVal = comp;
      tgtType = type;
      return (
        // eslint-disable-next-line no-use-before-define
        singleVal(item, index, key, srcType, srcVal, oper, tgtType, tgtVal, verbose) === true
      );

    default:
      throw Error(`LoQueryError: unsupported type '${type}'`);
  }
};
