declare module 'lrc-kit' {
	export interface LrcLine {
		timestamp: number;
		content: string;
	}

	export interface LrcData {
		lyrics: LrcLine[];
	}

	export class Lrc {
		static parse(raw: string): LrcData;
	}
}
