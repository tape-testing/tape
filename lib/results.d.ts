import through from '@ljharb/through';
import type { EventEmitter } from 'events';

import type { StreamOptions } from '../';
import Test = require('./test');

declare class Results extends EventEmitter {
    constructor(options?: { todoIsOK?: boolean });

    count: number;
    fail: number;
    pass: number;
    tests: Test[];
    todo: number;
    todoIsOK: boolean;
    closed?: boolean;

    _isRunning: boolean;
    _only: Test | null;
    _stream: through.ThroughStream;

    close(this: Results): void;
    createStream(this: Results, opts?: StreamOptions): through.ThroughStream;
    only(this: Results, t: Test): void;
    push(this: Results, t: Test): void;

    _watch(this: Results, t: Test): void;
}

declare namespace Results {
    export type Operator = string;

    export type Result = {
        id: number;
        ok: boolean;
        skip: unknown;
        todo: unknown;
        name?: string;
        operator: undefined | Operator;
        objectPrintDepth?: number;
        actual?: unknown;
        expected?: unknown;
        error?: unknown;
        functionName?: string;
        file?: string;
        line?: number;
        column?: number;
        at?: string;
    };
}

export = Results;