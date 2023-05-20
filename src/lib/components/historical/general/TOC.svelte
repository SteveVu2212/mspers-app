<script>
	import { onMount } from 'svelte';
	import { activeSection } from '$lib/stores/activeSection';
	let sections = [
		{ id: 'section1', title: 'Select State' },
		{ id: 'section2', title: 'Program Selection' },
		{ id: 'section3', title: 'Additional Variables' }
	];

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						activeSection.set(entry.target.id);
					}
				});
			},
			{ threshold: 0.5 }
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
</script>

<nav class="table-of-contents">
	<ul>
		{#each sections as section (section.id)}
			<li>
				<a
					href="#{section.id}"
					class="text-lg text-gray-500 hover:text-gray-800"
					class:active={$activeSection === section.id}
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
		color: #1f2937;
	}
	ul {
		font-size: 1.25rem; /* Increase the font size */
	}
</style>
