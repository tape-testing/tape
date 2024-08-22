import type { ThroughStream } from '@ljharb/through';

import type Test from './lib/test';
import type Results from './lib/results';

declare function harnessFunction(this: ThisType<Test>, name: string, opts: tape.TestOptions, cb: Test.Callback): Test;
declare function harnessFunction(this: ThisType<Test>, name: string, opts: tape.TestOptions): Test;
declare function harnessFunction(this: ThisType<Test>, name: string, cb: Test.Callback): Test;
declare function harnessFunction(this: ThisType<Test>, name: string): Test;
declare function harnessFunction(this: ThisType<Test>, opts: tape.TestOptions, cb: Test.Callback): Test;
declare function harnessFunction(this: ThisType<Test>, opts: tape.TestOptions): Test;
declare function harnessFunction(this: ThisType<Test>, cb: Test.Callback): Test;

declare namespace tape {
    export type TestOptions = {
        objectPrintDepth?: number | undefined;
        skip?: boolean | undefined;
        timeout?: number | undefined;
        todo?: boolean | undefined;
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

    function only(name: string, cb: Test.Callback): void;
    function only(name: string, opts: tape.TestOptions, cb: Test.Callback): void;
    function only(cb: Test.Callback): void;
    function only(opts: tape.TestOptions, cb: Test.Callback): void;

    export type HarnessCallSignatures = typeof harnessFunction;

    export interface Harness extends HarnessCallSignatures {
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
    const test: typeof tape;
    const skip: Test['skip'];
}

declare function tape(this: tape.Harness, name: string, opts: tape.TestOptions, cb: Test.Callback): Test;
declare function tape(this: tape.Harness, name: string, cb: Test.Callback): Test;
declare function tape(this: tape.Harness, opts?: tape.TestOptions): Test;
declare function tape(this: tape.Harness, opts: tape.TestOptions, cb: Test.Callback): Test;

export = tape;
