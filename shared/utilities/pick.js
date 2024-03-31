const pick = (object, keys) => {
    const validSchema = keys.reduce((obj, key) => {
      if (object && object.hasOwnProperty(key)) {
        obj[key] = object[key];
      }
      return obj;
    }, {});
    return validSchema;
  };
  
  
  module.exports = pick