<script>
	import { page } from '$app/stores';
	import Close from '$lib/components/icon/Close.svelte';
	import Hamburger from '$lib/components/icon/Hamburger.svelte';

	let isNavShowing = false;
</script>

{#if isNavShowing}
	<button
		data-collapse-toggle="navbar-solid-bg"
		type="button"
		class="absolute top-0 right-0 p-2 ml-3 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
		class:text-reasonOrange={isNavShowing}
		class:text-reasonBlue={!isNavShowing}
		on:click={() => {
			isNavShowing = !isNavShowing;
		}}
	>
		<Close width={32} height={32} />
	</button>
{:else}
	<button
		data-collapse-toggle="navbar-solid-bg"
		type="button"
		class="absolute top-0 right-0 p-2 ml-3 text-sm md:hidden text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
		class:text-reasonOrange={isNavShowing}
		class:text-reasonBlue={!isNavShowing}
		on:click={() => {
			isNavShowing = !isNavShowing;
		}}
	>
		<Hamburger width={32} height={32} />
	</button>
{/if}

<nav class="p-3 border-gray-200 rounded bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
	<div class="container flex flex-wrap items-center justify-between mx-auto">
		<a href="/" class="flex items-center">
			<img
				src="/images/logo-horizontal.svg"
				class="h-6 mr-3 sm:h-10"
				alt="Reason Foundation Logo"
			/>
		</a>

		{#if isNavShowing}
			<div class="w-full">
				<ul class="flex flex-col mt-4 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
					<li>
						<a
							class:active={$page.url.pathname === '/historical'}
							href="/historical"
							aria-current="page">Historical</a
						>
					</li>
					<li>
						<a class:active={$page.url.pathname === '/funding'} href="/funding" aria-current="page"
							>Funding Model</a
						>
					</li>
					<li>
						<a class:active={$page.url.pathname === '/benefit'} href="/benefit" aria-current="page"
							>Benefit Model</a
						>
					</li>
				</ul>
			</div>
		{:else}
			<nav class="p-3 border-gray-200 rounded bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
				<div class="container flex flex-wrap items-center justify-between mx-auto">
					<div class="hidden w-full md:block md:w-auto" id="navbar-solid-bg">
						<ul
							class="flex flex-col mt-4 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-transparent dark:bg-gray-800 md:dark:bg-transparent dark:border-gray-700"
						>
							<li>
								<a
									class:active={$page.url.pathname === '/historical'}
									href="/historical"
									aria-current="page">Historical</a
								>
							</li>
							<li>
								<a
									class:active={$page.url.pathname === '/funding'}
									href="/funding"
									aria-current="page">Funding Model</a
								>
							</li>
							<li>
								<a
									class:active={$page.url.pathname === '/benefit'}
									href="/benefit"
									aria-current="page">Benefit Model</a
								>
							</li>
						</ul>
					</div>
				</div>
			</nav>
		{/if}
	</div>
</nav>

<style>
	/* nav ul li {
		@apply mb-6;
	} */

	nav ul li a {
		@apply font-bold text-black;
	}

	nav ul li a.active {
		@apply text-reasonOrange;
	}
</style>
