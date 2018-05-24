import isArray from 'lodash/isArray';
import isString from 'lodash/isString';

export const isEachArray = arr => {
    return isArray(arr) && arr.every(item => isArray(item));
};

export const isEachString = arr => {
    return isArray(arr) && arr.every(item => isString(item));
};

