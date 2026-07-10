export function measureScrollbarAccountedWidth(): number {
	document.documentElement.style.overflowY = 'scroll';
	const clientWidth = document.documentElement.clientWidth;
	document.documentElement.style.overflowY = '';
	return clientWidth;
}
