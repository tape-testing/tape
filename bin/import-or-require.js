'use strict';

const { extname: extnamePath } = require('path');
const getPackageType = require('get-package-type');

// eslint-disable-next-line consistent-return
module.exports = function importOrRequire(file) {
    const ext = extnamePath(file);

    if (ext === '.mjs' || (ext === '.js' && getPackageType.sync(file) === 'module')) {
        return import(file);
    }
    require(file);
};
