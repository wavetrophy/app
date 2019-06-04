/**
 * Check if something is empty
 * @param {Object} obj
 * @return {boolean}
 */
export function empty(obj: Object) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false;
    }
  }

  return true;
}

/**
 * Get the value out of an object
 * @param object
 * @param {string} key
 * @return {null | any}
 */
export function e(object?: any, key?: string) {
  if (object && key && key in object) {
    return object[key];
  }

  return null;
}

/**
 * Translation method
 * @param {string} message
 * @param fill
 * @private
 */
export function __(message: string, ...fill: any[]): string {
  // @ts-ignore
  return message.format(...fill);
}
