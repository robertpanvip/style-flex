import 'core-js/es/set';
import 'core-js/es/map';
import 'core-js/es/weak-map';
import 'core-js/es/object/set-prototype-of';
//core-js/es/object/set-prototype-of 中的setPrototypeOf没有判断不支持的情况
if (!('__proto__' in {})) {
  Object.setPrototypeOf = (obj,proto) => {
    // 如果你想返回 prototype of Object.create(null):
    const Fn = function() {
      for (let key in obj) {
        Object.defineProperty(this, key, {
          value: obj[key],
        });
      }
    };
    Fn.prototype = proto;
    // @ts-ignore
    return new Fn();
  }
}
