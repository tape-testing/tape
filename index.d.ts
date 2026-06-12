import type { ThroughStream } from '@ljharb/through';

import Test from './lib/test';
import type Results from './lib/results';

declare function harnessFunction(this: Test, name: string, opts: tape.TestOptions, cb: Test.TestCase): Test;
declare function harnessFunction(this: Test, name: string, opts: tape.TestOptions): Test;
declare function harnessFunction(this: Test, name: string, cb: Test.TestCase): Test;
declare function harnessFunction(this: Test, name: string): Test;
declare function harnessFunction(this: Test, opts: tape.TestOptions, cb: Test.TestCase): Test;
declare function harnessFunction(this: Test, opts: tape.TestOptions): Test;
declare function harnessFunction(this: Test, cb: Test.TestCase): Test;

declare function harnessFunction(this: void, name: string, opts: tape.TestOptions, cb: Test.TestCase): Test;
declare function harnessFunction(this: void, name: string, opts: tape.TestOptions): Test;
declare function harnessFunction(this: void, name: string, cb: Test.TestCase): Test;
declare function harnessFunction(this: void, name: string): Test;
declare function harnessFunction(this: void, opts: tape.TestOptions, cb: Test.TestCase): Test;
declare function harnessFunction(this: void, opts: tape.TestOptions): Test;
declare function harnessFunction(this: void, cb: Test.TestCase): Test;

declare namespace tape {
    // both the runtime `Test` class, and, in type position, its instance type
    export { Test };

    // aliases of the `Test` namespace's types, for compatibility with `@types/tape`
    export type TestCase = Test.TestCase;
    export type SyncCallback = Test.SyncCallback;
    export type Callback = Test.Callback;
    export type SyncOrAsyncCallback = Test.Callback;
    export type RestoreFunction = Test.RestoreFunction;
    export type WrapResults = Test.WrapResults;
    export type WrappedFn<T extends Test.Callback> = Test.WrappedFn<T>;
    export type WrapObject<T extends Test.Callback> = Test.WrapObject<T>;
    export type WrappedCall = Test.WrappedCall;
    export type InterceptResults = Test.InterceptResults;

    export type TestOptions = {
        objectPrintDepth?: number | undefined;
        skip?: boolean | string | undefined;
        timeout?: number | undefined;
        ignoreSyncTimeout?: boolean;
        todo?: boolean | string | undefined;
    };

    export interface AssertOptions {
        skip?: boolean | string | undefined;
        todo?: boolean | string | undefined;
        message?: string | undefined;
        actual?: unknown;
        expected?: unknown;
        exiting?: boolean;
    }

    export interface StreamOptions {
        objectMode?: boolean | undefined;
    }

    export function createStream(opts?: StreamOptions): ThroughStream;

    export type CreateStream = typeof createStream;

    export type HarnessEventHandler = (cb: Test.SyncCallback, ...rest: unknown[]) => void;

    export function only(name: string, cb: Test.TestCase): void;
    export function only(name: string, opts: tape.TestOptions, cb: Test.TestCase): void;
    export function only(cb: Test.TestCase): void;
    export function only(opts: tape.TestOptions, cb?: Test.TestCase): void;

    export type Harness = typeof harnessFunction & {
        run?: () => void;
        only: typeof only;
        _exitCode: number;
        _results: Results;
        _tests: Test[];
        close: () => void;
        createStream: CreateStream;
        onFailure: HarnessEventHandler;
        onFinish: HarnessEventHandler;
    }

    export type HarnessConfig = {
        autoclose?: boolean;
        noOnly?: boolean;
        stream?: NodeJS.WritableStream | ThroughStream;
        exit?: boolean;
    } & StreamOptions;

    export function createHarness(conf_?: HarnessConfig): Harness;
    export const test: Harness;
    export const skip: typeof Test.skip;

	export function getHarness(opts?: HarnessConfig): Harness;
	export function run(): void;
	export function onFailure(cb: Test.SyncCallback, ...rest: unknown[]): void;
	export function onFinish(cb: Test.SyncCallback, ...rest: unknown[]): void
	export function wait(): void;
}

declare function tape(this: void | tape.Harness, name: string, opts: tape.TestOptions, cb: Test.TestCase): Test;
declare function tape(this: void | tape.Harness, name: string, cb: Test.TestCase): Test;
declare function tape(this: void | tape.Harness, opts?: tape.TestOptions): Test;
declare function tape(this: void | tape.Harness, opts: tape.TestOptions, cb: Test.TestCase): Test;
declare function tape(this: void | tape.Harness, cb: Test.TestCase): Test;
declare function tape(this: void | tape.Harness, name: string): Test;

export = tape;
