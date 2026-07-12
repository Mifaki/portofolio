import { writable } from 'svelte/store';
export const loaderDone = writable(false);
export const skipNextLoader = writable(false);
export const loaderHold = writable(false);