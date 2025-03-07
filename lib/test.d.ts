import type { EventEmitter } from 'events';
import mockProperty = require('mock-property');

import type {
	AssertOptions,
	TestOptions,
} from '../';
import type {
	Operator,
} from './results';

type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

declare class Test extends EventEmitter {
	constructor(name: string, opts?: TestOptions, cb?: Test.TestCase);
	constructor(name: string, cb: Test.TestCase);
	constructor(opts: TestOptions, cb?: Test.TestCase);
	constructor(cb: Test.TestCase);

	readable: boolean;
	name: string;
	assertCount: number;
	pendingCount: number;
	calledEnd?: boolean;
	ended: boolean;

	// "private" properties
	_cb: Test.TestCase | undefined;
	_objectPrintDepth: number | undefined;
	_ok: boolean;
	_plan: number | undefined;
	_planError: boolean | undefined;
	_progeny: Test[];
	_skip: boolean | string | undefined;
	_teardown: Test.TeardownHandler[];
	_timeout: number | undefined;
	_todo: boolean | string | undefined;

	captureFn<X extends Test.Callback>(
		this: void | Test,
		original: X,
	): Test.WrappedFn<X>;
	capture<T extends Test.Callback>(
		this: void | Test,
		obj: Record<PropertyKey, unknown> | unknown[],
		method: PropertyKey,
		implementation?: T,
	): Test.WrapResults;
	end(this: void | Test, err?: unknown): void;
	fail(this: void | Test, msg?: string, extra?: AssertOptions): void;
	intercept(
		this: void | Test,
		obj: Record<PropertyKey, unknown> | object,
		property: PropertyKey,
		desc?: PropertyDescriptor & { __proto__?: object | null; configurable?: true },
		strictMode?: boolean,
	): Test.InterceptResults;
	pass(this: void | Test, msg?: string, extra?: AssertOptions): void;
	run(this: void | Test): void;

	skip(this: void | Test, msg?: string, extra?: AssertOptions): void;
	// skip(this: void | Test, msg?: string, extra?: AssertOptions): void;

	timeoutAfter(this: void | Test, ms: number): void;
	plan(this: void | Test, n: number): void;
	comment(this: void | Test, msg: string): void;
	teardown(this: void | Test, fn: Test.TeardownHandler): void;

	test(this: void | Test, name: string): void;
	test(this: void | Test, cb: Test.TestCase): void;
	test(this: void | Test, name: string, cb: Test.TestCase): void;
	test(this: void | Test, name: string, opts: TestOptions, cb: Test.TestCase): void;
	test(this: void | Test, name: string, opts: WithRequired<TestOptions, 'skip'> | WithRequired<TestOptions, 'todo'>, cb?: Test.TestCase): void;

	// assertions

	ok(this: void | Test, value: unknown, msg?: string, extra?: AssertOptions): void;
	true: typeof this.ok;
	assert: typeof this.ok;

	notOk(this: void | Test, value: unknown, msg?: string, extra?: AssertOptions): void;
	false: typeof this.notOk;
	notok: typeof this.notOk;

	error(this: void | Test, err?: unknown, msg?: string, extra?: AssertOptions): void;
	ifError: typeof this.error;
	ifErr: typeof this.error;
	iferror: typeof this.error;

	equal(this: void | Test, a: unknown, b: unknown, msg?: string, extra?: AssertOptions): void;
	equals: typeof this.equal;
	isEqual: typeof this.equal;
	is: typeof this.equal;
	strictEqual: typeof this.equal;
	strictEquals: typeof this.equal;

	notEqual(this: void | Test, a: unknown, b: unknown, msg?: string, extra?: AssertOptions): void;
	notEquals: typeof this.notEqual;
	notStrictEqual: typeof this.notEqual;
	notStrictEquals: typeof this.notEqual;
	isNotEqual: typeof this.notEqual;
	isNot: typeof this.notEqual;
	not: typeof this.notEqual;
	doesNotEqual: typeof this.notEqual;
	isInequal: typeof this.notEqual;

	looseEqual(this: void | Test, a: unknown, b: unknown, msg?: string, extra?: AssertOptions): void;
	looseEquals: typeof this.looseEqual;

	notLooseEqual(this: void | Test, a: unknown, b: unknown, msg?: string, extra?: AssertOptions): void;
	notLooseEquals: typeof this.notLooseEqual;

	deepEqual(this: void | Test, a: unknown, b: unknown, msg?: string, extra?: AssertOptions): void;
	deepEquals: typeof this.deepEqual;
	isEquivalent: typeof this.deepEqual;
	same: typeof this.deepEqual;

	notDeepEqual(this: void | Test, a: unknown, b: unknown, msg?: string, extra?: AssertOptions): void;
	notDeepEquals: typeof this.notDeepEqual;
	notEquivalent: typeof this.notDeepEqual;
	notDeeply: typeof this.notDeepEqual;
	notSame: typeof this.notDeepEqual;
	isNotDeepEqual: typeof this.notDeepEqual;
	isNotDeeply: typeof this.notDeepEqual;
	isNotEquivalent: typeof this.notDeepEqual;
	isInequivalent: typeof this.notDeepEqual;

	deepLooseEqual(this: void | Test, a: unknown, b: unknown, msg?: string, extra?: AssertOptions): void;

	notDeepLooseEqual(this: void | Test, a: unknown, b: unknown, msg?: string, extra?: AssertOptions): void;

	throws(
		this: void | Test,
		fn: () => void,
		exceptionExpected: Test.ThrowsExpected,
		msg?: string,
		extra?: AssertOptions,
	): void;
	throws(
		this: void | Test,
		fn: () => void,
		msg?: string,
		extra?: AssertOptions,
	): void;

	doesNotThrow(
		this: void | Test,
		fn: () => void,
		exceptionExpected: RegExp | Function | undefined,
		msg?: string,
		extra?: AssertOptions,
	): void;
	doesNotThrow(
		this: void | Test,
		fn: () => void,
		msg?: string,
		extra?: AssertOptions,
	): void;

	match(
		this: void | Test,
		actual: string,
		expected: RegExp,
		msg?: string,
		extra?: AssertOptions,
	): void;

	doesNotMatch(
		this: void | Test,
		actual: string,
		expected: RegExp,
		msg?: string,
		extra?: AssertOptions,
	): void;

	assertion<Args extends readonly unknown[], R>(
		this: void | Test,
		fn: Test.AssertionFunction<Args, R>,
		...args: Args,
	): R;

	static skip(
		name: string,
		opts: TestOptions,
		cb: Test.TestCase,
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
	export interface TestCase {
		(test: Test): void | any | Promise<void> | Promise<any>;
    }

	export type SyncCallback = (...args: unknown[]) => unknown;
	export type Callback = (...args: unknown[]) => unknown | Promise<unknown>;

	type CallObject = {
		args: unknown[];
		receiver: unknown;
	};

	type ReturnCall = {
		returned: unknown;
	} | {
		value: unknown;
	};

	type ThrowCall = {
		threw: true;
	};

	export type PropertyCall = CallObject & {
		type: 'get' | 'set';
		success: boolean;
	} & (ReturnCall | ThrowCall);

	export type WrappedCall = CallObject & (PropertyCall | ThrowCall | ReturnCall);

	export type RestoreFunction = ReturnType<typeof mockProperty>;

	export type WrapResults = {
		(): WrappedCall[];
		restore?: RestoreFunction;
	};

	export type WrappedFn<T extends Callback> = {
		(this: ThisParameterType<T>, ...args: Parameters<T>): ReturnType<T>;
		calls?: WrappedCall[];
	};

	export type WrapObject<T extends Callback> = {
		__proto__: null;
		wrapped: WrappedFn<T>;
		calls: WrappedCall[];
		results: Test.WrapResults;
	};

	export type InterceptResults = {
		(): WrappedCall[];
		restore: RestoreFunction;
	}

	export type AssertionFunction<Args extends readonly unknown[], R> = (this: Test, ...args: Args) => R;

	export type ThrowsExpected = object | RegExp | ((err: unknown) => true | never) | Error | string | undefined;

	export type TeardownHandler = () => void | any | Promise<void> | Promise<any>;
}

export = Test;
