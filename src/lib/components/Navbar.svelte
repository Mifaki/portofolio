<script lang="ts">
	import logo from '$lib/assets/logo-black.png';
	import { page } from '$app/state';
	import { gsap } from 'gsap';
	import { onMount } from 'svelte';

	const links = [
		{ href: '/', label: 'Home' },
		{ href: '/about', label: 'About' },
		{ href: '/contact', label: 'Contact' }
	];

	let lineEls: HTMLSpanElement[] = [];
	let isOpen = $state(false);
	let drawerEl: HTMLDivElement;
	let strip1: HTMLSpanElement;
	let strip2: HTMLSpanElement;
	let drawerLinks: HTMLAnchorElement[] = [];

	function handleMouseEnter(index: number) {
		const isActive = page.url.pathname === links[index].href;
		if (isActive) return;
		gsap.fromTo(
			lineEls[index],
			{ scaleX: 0, transformOrigin: 'left center' },
			{ scaleX: 1, duration: 0.4, ease: 'power2.out' }
		);
	}

	function handleMouseLeave(index: number) {
		const isActive = page.url.pathname === links[index].href;
		if (isActive) return;
		gsap.to(lineEls[index], {
			scaleX: 0,
			transformOrigin: 'right center',
			duration: 0.3,
			ease: 'power2.in'
		});
	}

	function toggleMenu() {
		isOpen = !isOpen;

		if (isOpen) {
			gsap.to(strip1, { y: 4, rotate: 45, duration: 0.3, ease: 'power2.inOut' });
			gsap.to(strip2, { y: -4, rotate: -45, duration: 0.3, ease: 'power2.inOut' });

			gsap.set(drawerLinks, { opacity: 0, x: 40 });

			gsap.to(drawerEl, {
				x: '0%',
				duration: 0.5,
				ease: 'power3.out',
				onComplete: () => {
					gsap.to(drawerLinks, {
						x: 0,
						opacity: 1,
						duration: 0.4,
						ease: 'power2.out',
						stagger: 0.07
					});
				}
			});
		} else {
			gsap.to(strip1, { y: 0, rotate: 0, duration: 0.3, ease: 'power2.inOut' });
			gsap.to(strip2, { y: 0, rotate: 0, duration: 0.3, ease: 'power2.inOut' });

			gsap.to(drawerLinks, {
				opacity: 0,
				x: 40,
				duration: 0.25,
				ease: 'power2.in',
				stagger: { each: 0.07, from: 'end' },
				onComplete: () => {
					gsap.to(drawerEl, { x: '100%', duration: 0.4, ease: 'power3.in' });
				}
			});
		}
	}

	function closeMenu() {
		if (!isOpen) return;
		isOpen = false;
		gsap.to(strip1, { y: 0, rotate: 0, duration: 0.3, ease: 'power2.inOut' });
		gsap.to(strip2, { y: 0, rotate: 0, duration: 0.3, ease: 'power2.inOut' });

		gsap.to(drawerLinks, {
			opacity: 0,
			x: 40,
			duration: 0.25,
			ease: 'power2.in',
			stagger: { each: 0.07, from: 'end' },
			onComplete: () => {
				gsap.to(drawerEl, { x: '100%', duration: 0.4, ease: 'power3.in' });
			}
		});
	}

	onMount(() => {
		gsap.set(drawerEl, { x: '100%' });
		gsap.set(drawerLinks, { opacity: 0, x: 40 });
	});
</script>

<nav class="flex w-full flex-row items-center justify-between px-8 py-10">
	<a href="/" class="cursor-pointer">
		<img src={logo} alt="logo" class="h-8 w-12" />
	</a>

	<ul class="hidden flex-row gap-10 md:flex">
		{#each links as link, i}
			{@const isActive = page.url.pathname === link.href}
			<li class="tracking-[0.2em] uppercase">
				<a
					href={link.href}
					class="relative flex flex-col gap-[3px] opacity-50"
					class:opacity-100={isActive}
					onmouseenter={() => handleMouseEnter(i)}
					onmouseleave={() => handleMouseLeave(i)}
				>
					{link.label}
					<span
						bind:this={lineEls[i]}
						class="block h-[1.5px] w-full bg-black"
						style={isActive
							? 'transform: scaleX(1); transform-origin: left center;'
							: 'transform: scaleX(0); transform-origin: left center;'}
					></span>
				</a>
			</li>
		{/each}
	</ul>

	<button
		class="flex h-8 w-8 flex-col items-center justify-center gap-[6px] md:hidden"
		onclick={toggleMenu}
		aria-label="Toggle menu"
	>
		<span bind:this={strip1} class="block h-[1.5px] w-5 bg-black"></span>
		<span bind:this={strip2} class="block h-[1.5px] w-5 bg-black"></span>
	</button>
</nav>

<div
	bind:this={drawerEl}
	class="fixed top-[112px] right-0 z-50 flex h-full w-full flex-col bg-white px-10 pt-32"
>
	<ul class="flex flex-col gap-8">
		{#each links as link, i}
			{@const isActive = page.url.pathname === link.href}
			<li>
				<a
					bind:this={drawerLinks[i]}
					href={link.href}
					onclick={closeMenu}
					class="font-clash text-4xl tracking-widest uppercase opacity-40 transition-opacity"
					class:opacity-100={isActive}
					class:font-bold={isActive}
				>
					{link.label}
				</a>
			</li>
		{/each}
	</ul>
</div>
