import type { EventEmitter } from 'events';
import type mockProperty from 'mock-property';

import type {
    AssertOptions,
    TestOptions,
} from '../';
import type {
    Operator,
} from './results';

declare class Test extends EventEmitter {
	constructor(name: string, opts?: TestOptions, cb?: Test.Callback);
    constructor(name: string, cb: Test.Callback);
    constructor(opts: TestOptions, cb?: Test.Callback);
    constructor(cb: Test.Callback);

    readable: boolean;
    name: string;
    assertCount: number;
    pendingCount: number;
    calledEnd?: boolean;
    ended: boolean;

    // "private" properties
    _cb: Test.Callback | undefined;
    _objectPrintDepth: number | undefined;
    _ok: boolean;
    _plan: number | undefined;
    _planError: boolean | undefined;
    _progeny: Test[];
    _skip: boolean | undefined;
    _teardown: Test.Callback[];
    _timeout: number | undefined;
    _todo: boolean | undefined;

    captureFn<X extends Test.Callback>(this: Test, original: X): Test.WrappedFn<X>;
    capture<T extends Test.Callback>(this: Test, obj: object, method: PropertyKey, implementation?: T): Test.WrapResults;
    end(this: Test, err?: unknown): void;
    fail(this: Test, msg: string, extra?: AssertOptions): void;
    intercept(this: Test, obj: object, property: PropertyKey, desc?: PropertyDescriptor): Test.InterceptResults;
    pass(this: Test, msg: string, extra?: AssertOptions): void;
    run(this: Test): void;
    skip(this: Test, msg: string, extra?: AssertOptions): void;
    timeoutAfter(this: Test, ms: number): void;
    plan(this: Test, n: number): void;
    comment(this: Test, msg: string): void;
    teardown(this: Test, fn: Test.Callback): void;
    test(this: Test, name: string, cb: Test.Callback): void;
    test(this: Test, name: string, opts: TestOptions, cb: Test.Callback): void;

    // assertions

    ok(this: Test, value: unknown, msg: string, extra?: AssertOptions): void;
    true: typeof this.ok;
    assert: typeof this.ok;

    notOK(this: Test, value: unknown, msg: string, extra?: AssertOptions): void;
    false: typeof this.notOK;
    notok: typeof this.notOK;

    error(this: Test, err?: unknown, msg?: string, extra?: AssertOptions): void;
    ifError: typeof this.error;
    ifErr: typeof this.error;
    iferror: typeof this.error;

    equal(this: Test, a: unknown, b: unknown, msg: string, extra?: AssertOptions): void;
    equals: typeof this.equal;
    isEqual: typeof this.equal;
    is: typeof this.equal;
    strictEqual: typeof this.equal;
    strictEquals: typeof this.equal;

    notEqual(this: Test, a: unknown, b: unknown, msg: string, extra?: AssertOptions): void;
    notEquals: typeof this.notEqual;
    notStrictEqual: typeof this.notEqual;
    notStrictEquals: typeof this.notEqual;
    isNotEqual: typeof this.notEqual;
    isNot: typeof this.notEqual;
    not: typeof this.notEqual;
    doesNotEqual: typeof this.notEqual;
    isInequal: typeof this.notEqual;

    looseEqual(this: Test, a: unknown, b: unknown, msg: string, extra?: AssertOptions): void;
    looseEquals: typeof this.looseEqual;

    notLooseEqual(this: Test, a: unknown, b: unknown, msg: string, extra?: AssertOptions): void;
    notLooseEquals: typeof this.notLooseEqual;

    deepEqual(this: Test, a: unknown, b: unknown, msg: string, extra?: AssertOptions): void;
    deepEquals: typeof this.deepEqual;
    isEquivalent: typeof this.deepEqual;
    same: typeof this.deepEqual;

    notDeepEqual(this: Test, a: unknown, b: unknown, msg: string, extra?: AssertOptions): void;
    notDeepEquals: typeof this.notDeepEqual;
    notEquivalent: typeof this.notDeepEqual;
    notDeeply: typeof this.notDeepEqual;
    notSame: typeof this.notDeepEqual;
    isNotDeepEqual: typeof this.notDeepEqual;
    isNotDeeply: typeof this.notDeepEqual;
    isNotEquivalent: typeof this.notDeepEqual;
    isInequivalent: typeof this.notDeepEqual;

    deepLooseEqual(this: Test, a: unknown, b: unknown, msg: string, extra?: AssertOptions): void;

    notDeepLooseEqual(this: Test, a: unknown, b: unknown, msg: string, extra?: AssertOptions): void;

    throws(
        this: Test,
        fn: () => void,
        exceptionExpected: RegExp | Function | Error | string | undefined,
        msg: string,
        extra?: AssertOptions,
    ): void;
    throws(
        this: Test,
        fn: () => void,
        msg: string,
        extra?: AssertOptions,
    ): void;

    doesNotThrow(
        this: Test,
        fn: () => void,
        exceptionExpected: RegExp | Function | undefined,
        msg: string,
        extra?: AssertOptions,
    ): void;
    doesNotThrow(
        this: Test,
        fn: () => void,
        msg: string,
        extra?: AssertOptions,
    ): void;

    match(
        this: Test,
        actual: string,
        expected: RegExp,
        msg: string,
        extra?: AssertOptions,
    ): void;

    doesNotMatch(
        this: Test,
        actual: string,
        expected: RegExp,
        msg: string,
        extra?: AssertOptions,
    ): void;

	assertion(
		this: Test,
		fn: <T = unknown, U = unknown>(this: Test, ...args: T[]) => U,
	): ReturnType<typeof fn>;

    static skip(
        name: string,
        opts: TestOptions,
        cb: Test.Callback,
    ): Test;

    // "private" methods

    _assert(
        this: Test,
        maybeOK: boolean | unknown,
        opts: TestOptions & {
            message?: string;
            operator?: Operator;
            error?: unknown;
            actual?: unknown;
            expected?: unknown;
            extra?: AssertOptions & {
                operator?: Operator;
                error?: unknown;
            };
        },
    ): void;
    _end(this: Test, err?: unknown): void;
    _exit(this: Test): void;
    _pendingAsserts(this: Test): number;
}

declare namespace Test {
    export type SyncCallback = (...args: unknown[]) => unknown;
    export type Callback = (...args: unknown[]) => unknown | Promise<unknown>;

    export type ReturnCall = {
        args: unknown[];
        receiver: {};
        returned: unknown;
    };

    export type ThrowCall = {
        args: unknown[];
        receiver: {};
        threw: true;
    };

    export type Call = {
        type: 'get' | 'set';
        success: boolean;
        value: unknown;
        args: unknown[];
        receiver: unknown;
    }

    export type RestoreFunction = Exclude<ReturnType<typeof mockProperty>, undefined>;

    export type WrapResults = {
        (): WrappedCall[];
        restore?: RestoreFunction;
    };

    export type WrappedFn<T extends Callback> = { (): T; calls?: WrappedCall[] };

    export type WrapObject<T extends Callback> = {
        __proto__: null;
        wrapped: WrappedFn<T>;
        calls: WrappedCall[];
        results: Test.WrapResults;
    };

    export type WrappedCall = ReturnCall | ThrowCall;

    export type InterceptResults = {
        (): Call[];
        restore: RestoreFunction;
    }
}

export = Test;
