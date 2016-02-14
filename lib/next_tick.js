module.exports = typeof setImmediate !== 'undefined'
    ? setImmediate
    : process.nextTick
;
