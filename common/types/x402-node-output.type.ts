export type X402NodeOutput = {
	data: Record<string, unknown>;
	httpCode: number;
};

export class X402NodeOutputError extends Error {
	constructor(public output: X402NodeOutput) {
		super();
	}
}
