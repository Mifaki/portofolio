const SAMPLE_WIDTH = 120;
const OUTPUT_WIDTH = 640;

export const BLUR_PLACEHOLDER =
	"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='6'%3E%3Crect width='4' height='6' fill='%23e8e8e8'/%3E%3C/svg%3E";

const cache = new Map<string, Promise<string>>();

export function isBlurredProject(p: { visibility?: 'public' | 'private'; blur?: boolean }) {
	return p.visibility === 'private' && p.blur === true;
}

export function blurImage(url: string): Promise<string> {
	let pending = cache.get(url);
	if (!pending) {
		pending = createBlurredDataUrl(url);
		pending.catch(() => cache.delete(url));
		cache.set(url, pending);
	}
	return pending;
}

async function createBlurredDataUrl(url: string): Promise<string> {
	const img = new Image();
	img.crossOrigin = 'anonymous';
	img.src = url;
	await img.decode();

	const ratio = img.naturalHeight / img.naturalWidth;
	const sample = document.createElement('canvas');
	sample.width = SAMPLE_WIDTH;
	sample.height = Math.max(1, Math.round(SAMPLE_WIDTH * ratio));
	const sampleCtx = sample.getContext('2d')!;
	sampleCtx.drawImage(img, 0, 0, sample.width, sample.height);

	const out = document.createElement('canvas');
	out.width = OUTPUT_WIDTH;
	out.height = Math.max(1, Math.round(OUTPUT_WIDTH * ratio));
	const outCtx = out.getContext('2d')!;
	outCtx.imageSmoothingEnabled = true;
	outCtx.imageSmoothingQuality = 'high';
	outCtx.filter = 'blur(4px)';
	outCtx.drawImage(sample, 0, 0, out.width, out.height);

	return out.toDataURL('image/jpeg', 0.75);
}
