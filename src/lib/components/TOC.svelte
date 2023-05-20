<script>
	import { onMount } from 'svelte';
	import { activeSection } from '$lib/stores/activeSection';
	export let sections = [];

	let isInitialLoad = true;

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (isInitialLoad) {
					isInitialLoad = false;
					return;
				}

				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						activeSection.set(entry.target.id);
					}
				});
			},
			{ threshold: 0.2 }
		);

		sections.forEach((section) => {
			const el = document.getElementById(section.id);
			if (el) {
				observer.observe(el);
			}
		});

		return () => {
			sections.forEach((section) => {
				const el = document.getElementById(section.id);
				if (el) {
					observer.unobserve(el);
				}
			});
		};
	});

	function scrollToSection(id) {
		const sectionElement = document.getElementById(id);
		if (sectionElement) {
			sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	}
</script>

<nav class="table-of-contents bg-white bg-opacity-75 shadow-md rounded-lg">
	<ul>
		{#each sections as section (section.id)}
			<li>
				<a
					href="#{section.id}"
					class="text-sm text-gray-500 hover:text-gray-800"
					class:active={$activeSection === section.id}
					on:click|preventDefault={() => scrollToSection(section.id)}
				>
					{section.title}
				</a>
			</li>
		{/each}
	</ul>
</nav>

<style>
	.table-of-contents {
		position: fixed;
		top: 4rem; /* Increase the top offset to avoid overlapping with the Navbar */
		left: 1rem;
		z-index: 10;
		padding: 10px;
	}
	.active {
		font-weight: bold;
		color: #f63;
	}
	ul {
		font-size: 1.25rem; /* Increase the font size */
	}
</style>
