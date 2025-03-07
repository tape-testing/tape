import type { ThroughStream } from '@ljharb/through';

import type Test from './lib/test';
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
    export type TestOptions = {
        objectPrintDepth?: number | undefined;
        skip?: boolean | string | undefined;
        timeout?: number | undefined;
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

    function createStream(opts?: StreamOptions): ThroughStream;

    export type CreateStream = typeof createStream;

    export type HarnessEventHandler = (cb: Test.SyncCallback, ...rest: unknown[]) => void;

    function only(name: string, cb: Test.TestCase): void;
    function only(name: string, opts: tape.TestOptions, cb: Test.TestCase): void;
    function only(cb: Test.TestCase): void;
    function only(opts: tape.TestOptions, cb?: Test.TestCase): void;

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

    function createHarness(conf_?: HarnessConfig): Harness;
    const Test: Test;
    const test: Harness;
    const skip: Test['skip'];

	function getHarness(opts?: HarnessConfig): Harness;
	function run(): void;
	function onFailure(cb: Test.SyncCallback, ...rest: unknown[]): void;
	function onFinish(cb: Test.SyncCallback, ...rest: unknown[]): void
	function wait(): void;
}

declare function tape(this: void | tape.Harness, name: string, opts: tape.TestOptions, cb: Test.TestCase): Test;
declare function tape(this: void | tape.Harness, name: string, cb: Test.TestCase): Test;
declare function tape(this: void | tape.Harness, opts?: tape.TestOptions): Test;
declare function tape(this: void | tape.Harness, opts: tape.TestOptions, cb: Test.TestCase): Test;
declare function tape(this: void | tape.Harness, cb: Test.TestCase): Test;
declare function tape(this: void | tape.Harness, name: string): Test;

export = tape;
