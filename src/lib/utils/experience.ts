export type ExperienceMode = 'rich' | 'simple';

const STORAGE_KEY = 'portfolio-experience';

export function getExperience(): ExperienceMode | null {
	const value = localStorage.getItem(STORAGE_KEY);
	return value === 'rich' || value === 'simple' ? value : null;
}

export function setExperience(mode: ExperienceMode) {
	if (window.parent !== window) return;
	localStorage.setItem(STORAGE_KEY, mode);
}
