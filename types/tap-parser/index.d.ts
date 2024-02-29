declare module 'tap-parser' {
  import { Writable } from 'readable-stream';

  type Parsed = [any, ok: boolean, id: number, rest: string, buffered: string];

  class Result {
	constructor(parsed: Parsed, count: number);
  }

  type OnComplete = (results: FinalResults) => void;
  type ParserOptions = {
	parent?: object;
	passes?: Result[];
	level?: number;
	bail?: boolean;
	omitVersion?: boolean;
	buffered?: string;
	preserveWhitespace?: boolean;
	strict?: boolean;

  }

  class FinalResults {
	constructor(skipAll: boolean, self: Result);
  }

  class Parser extends Writable {
	constructor(options: ParserOptions, onComplete?: OnComplete);
	constructor(onComplete?: OnComplete);

	tapError(error: unknown, line: string): void;

	parseTestPoint(testPoint: Parsed, line: string): void;

	nonTap(data: string, didLine: boolean): void;

	plan(start: number, end: number, comment: string, line: string): void;

	resetYamlish(): void;

	yamlGarbage(): void;

	yamlishLine(line: string): void;

	processYamlish(): void;

	write(chunk: string | Buffer, encoding: string, cb: (error: Error | null | undefined) => void): boolean;
	write(chunk: string | Buffer, cb?: (error: Error | null | undefined) => void): boolean;

	end(chunk: string | Buffer, encoding?: string, cb?: () => void): this;
	end(chunk: string | Buffer, cb?: () => void): this;
	end(cb: () => void): this;

	emitComplete(skipAll?: boolean): void;

	version(version: string, line: string): void;

	pragma(key: string, value: unknown, line: string): void;

	bailout(reason: string, synthetic: boolean): void;

	clearExtraQueue(): void;

	endChild(): void;

	emitResult(): void;

	startChild(line: string): void;

	abort(message: string, extra?: object): void;

	emitComment(line: string, skipLine: boolean, noDuplicate: boolean): void;

	parse(line: string): void;

	parseIndent(line: string, indent: string): void;
  }

  function tapParser(options: ParserOptions, onComplete?: OnComplete): Parser;
  function tapParser(onComplete?: OnComplete): Parser;


  export = tapParser;
}
