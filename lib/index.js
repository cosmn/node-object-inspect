function traverse(
  data,
  currentKey,
  seenObjects,
  seenObjectsIdent,
  currentDepth,
  maxDepth
) {
  if (currentDepth >= maxDepth) return "[object Object]";

  const json = {};

  for (let key in data) {
    const value = data[key];
    const type = Object.prototype.toString.call(value);
    const seenObjectAt = seenObjects.indexOf(value);
    const objectAbsoluteKey = currentKey + "." + key;

    switch (type) {
      case "[object String]":
      case "[object Number]":
      case "[object Boolean]":
        json[key] = value;
        break;

      case "[object Null]":
        json[key] = null;
        break;

      case "[object Undefined]":
        json[key] = "[object Undefined]";
        break;

      case "[object Function]":
        json[key] = "[Function: " + (value.name || "anonymous") + "]";
        break;

      case "[object Object]":
      case "[object Array]":
      case "[object HTMLCollection]":
      case "[object HTMLDocument]":
      case "[object HTMLBodyElement]":
      case "[object HTMLInputElement]":
      case "[object HTMLDivElement]":
      case "[object NamedNodeMap]":
      case "[object NodeList]":
      case "[object DOMTokenList]":
      case "[object DOMStringMap]":
      case "[object CSSStyleDeclaration]":
      case "[object ValidityState]":
      case "[object Arguments]":
        if (seenObjectAt > 0) {
          json[key] =
            "[object Circular > " + seenObjectsIdent[seenObjectAt] + "]";
        } else {
          seenObjectsIdent.push(objectAbsoluteKey);
          seenObjects.push(value);
          json[key] = traverse(
            value,
            objectAbsoluteKey,
            seenObjects,
            seenObjectsIdent,
            currentDepth + 1,
            maxDepth
          );
        }
        break;
      case "[object Symbol]":
        json[key] = "[object Symbol]";
        break;
      default:
        json[key] = "[unhandled typeof > " + type + "]";
    }
  }

  return json;
}

module.exports = function parse(data, depth) {
  const maxDepth = depth || 4;
  const seenObjects = [data]; // start with itself
  const seenObjectsIdent = ["."];

  return traverse(data, "", seenObjects, seenObjectsIdent, 0, maxDepth);
};
