var browserify = require('browserify');
var fs = require('fs');

var BUNDLE_INPUT = 'index-browser.js';
var BUNDLE_OUTPUT = './dist/bundle.js';

//Helper method that modifies package.json on disk.
function modifyPackageJson(cb) {
    var packageStr = fs.readFileSync('package.json', { encoding: 'utf8' });
    var packageJson = JSON.parse(packageStr);
    var modifiedPackageJson  = cb(packageJson);
    packageStr = JSON.stringify(modifiedPackageJson, null, 4);
    fs.writeFileSync('package.json', packageStr, { encoding: 'utf8' });
}

// Having the `browser` field in package.json breaks browserify,
// Temporarily remove it so we can run the bundle
modifyPackageJson(function(packageJson) {
    var clone = JSON.parse(JSON.stringify(packageJson));
    delete clone.browser;
    return clone;
});

var b = browserify(BUNDLE_INPUT, { standalone: 'tape' })
    .bundle((err, buff) => {
        if(err) { throw err; }

        fs.writeFileSync(BUNDLE_OUTPUT, buff, { encoding: 'utf8' });
        modifyPackageJson(function(packageJson) {
            var clone = JSON.parse(JSON.stringify(packageJson));
            clone["browser"] = BUNDLE_OUTPUT;
            return clone;
        });
    })