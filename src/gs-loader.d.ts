export {};

declare global {
	interface Window {
		_gs: (event: string, extra?: string | {[key: string]: any}, debug?: {[key: string]: any}) => void
	}
}
