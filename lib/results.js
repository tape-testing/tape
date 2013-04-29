var Stream = require('stream');
var json = typeof JSON === 'object' ? JSON : require('jsonify');
var through = require('through');
var nextTick = typeof setImmediate !== 'undefined'
    ? setImmediate
    : process.nextTick
;

module.exports = function (test) {
    var output = through();
    output.pause();
    output.queue('TAP version 13\n');
    
    var results = new Results(output);
    var first = true;
    output.push = function (t) {
        results.push(t);
        if (first) {
            t.once('run', function () {
                output.resume();
            });
        }
        first = false;
    };
    return output;
};

function Results (stream) {
    this.count = 0;
    this.fail = 0;
    this.pass = 0;
    this.stream = stream;
    this.pending = 0;
}

Results.prototype.push = function (t) {
    var self = this;
    var write = function (s) { self.stream.queue(s) };
    write('# ' + t.name + '\n');
    self.pending ++;
    
    t.on('test', function (st) {
        self.push(st);
    });
    
    t.on('result', function (res) {
        if (typeof res === 'string') {
            write('# ' + res + '\n');
            return;
        }
        write(encodeResult(res, self.count + 1));
        self.count ++;
        
        if (res.ok) self.pass ++
        else self.fail ++
    });
    
    t.on('end', function () {
        nextTick(function () {
            if (--self.pending === 0) self.close();
        });
    });
};

Results.prototype.close = function () {
    var self = this;
    var write = function (s) { self.stream.queue(s) };
    
    write('\n1..' + self.count + '\n');
    write('# tests ' + self.count + '\n');
    write('# pass  ' + self.pass + '\n');
    if (self.fail) write('# fail  ' + self.fail + '\n')
    else write('\n# ok\n')
    
    self.stream.queue(null);
};

function encodeResult (res, count) {
    var output = '';
    output += (res.ok ? 'ok ' : 'not ok ') + count;
    output += res.name ? ' ' + res.name.replace(/\s+/g, ' ') : '';
    
    if (res.skip) output += ' # SKIP';
    else if (res.todo) output += ' # TODO';
    
    output += '\n';
    
    if (!res.ok) {
        var outer = '  ';
        var inner = outer + '  ';
        output += outer + '---\n';
        output += inner + 'operator: ' + res.operator + '\n';
        
        var ex = json.stringify(res.expected, getSerialize()) || '';
        var ac = json.stringify(res.actual, getSerialize()) || '';
        
        if (Math.max(ex.length, ac.length) > 65) {
            output += inner + 'expected:\n' + inner + '  ' + ex + '\n';
            output += inner + 'actual:\n' + inner + '  ' + ac + '\n';
        }
        else {
            output += inner + 'expected: ' + ex + '\n';
            output += inner + 'actual:   ' + ac + '\n';
        }
        if (res.at) {
            output += inner + 'at: ' + res.at + '\n';
        }
        if (res.operator === 'error' && res.actual && res.actual.stack) {
            var lines = String(res.actual.stack).split('\n');
            output += inner + 'stack:\n';
            output += inner + '  ' + lines[0] + '\n';
            for (var i = 1; i < lines.length; i++) {
                output += inner + lines[i] + '\n';
            }
        }
        
        output += outer + '...\n';
    }
    
    return output;
}

function getSerialize() {
    var seen = [];
    
    return function (key, value) {
        var ret = value;
        if (typeof value === 'object' && value) {
            var found = false
            for (var i = 0; i < seen.length; i++) {
                if (seen[i] === value) {
                    found = true
                    break;
                }
            }
            
            if (found) ret = '[Circular]'
            else seen.push(value)
        }
        return ret
    };
}
