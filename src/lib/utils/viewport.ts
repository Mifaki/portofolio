export function isMobileViewport(): boolean {
	return window.matchMedia('(max-width: 1023px)').matches;
}
