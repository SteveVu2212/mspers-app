<script>
	import { onMount } from 'svelte';
	import Select from 'svelte-select';

	import Chart1 from '$lib/components/benefits/chart1/Chart1.svelte';
	import Chart2 from '$lib/components/benefits/chart2/Chart2.svelte';
	import { line } from 'd3-shape';

	import Switch from '$lib/components/Switch.svelte';

	// Mobile detection
	let isMobile = false;

	const updateIsMobile = () => {
		isMobile = window.matchMedia('(max-width: 800px)').matches;
	};

	let width;
	let height;
	let mobileWidth;
	let mobileHeight;

	onMount(() => {
		updateIsMobile();
		const handleResize = () => {
			width = window.innerWidth * 0.45;
			mobileWidth = window.innerWidth * 0.65;
			mobileHeight = Math.max(window.innerHeight * 0.35, 200);
			height = Math.max(window.innerHeight * 0.35, 200);
		};

		window.addEventListener('resize', handleResize);
		handleResize();

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	});

	let showInputPanel = true;
	function toggleInputPanel() {
		showInputPanel = !showInputPanel;
	}

	let variables = [
		{ label: 'Scenario A', value: 'scenario_a' },
		{ label: 'Scenario B', value: 'scenario_b' },
		{ label: 'Scenario C', value: 'scenario_c' },
		{ label: 'Scenario D', value: 'scenario_d' }
	];

	let lineOne = { label: 'Scenario A', value: 'scenario_a' };
	let lineTwo = { label: 'Scenario B', value: 'scenario_b' };
	let lineThree = { label: 'Scenario C', value: 'scenario_c' };
	let lineFour = { label: 'Scenario D', value: 'scenario_d' };

	let checkboxOne = true;
	let checkboxTwo = true;
	let checkboxThree = false;
	let checkboxFour = false;

	let showChart3 = true;

	const panels = [
		{ title: 'Panel 1', content: Chart1 },
		{ title: 'Panel 2', content: Chart2 }
	];
</script>

<svelte:head>
	<title>Benefit Model</title>
</svelte:head>

<button
	class="fixed bottom-0 right-0 mx-auto my-2 px-4 py-2 bg-gray-600 text-white text-sm rounded-md shadow-md"
	on:click={toggleInputPanel}
>
	{showInputPanel ? 'Hide' : 'Show'} Inputs
</button>

<div class="h-[5rem] flex flex-wrap items-stretch justify-center">
	{#if showInputPanel}
		<div
			class="w-full mx-10 my-2 p-0 grid grid-cols-1 md:grid-cols-4 sm:grid-cols-2 gap-4 bg-bgLightGray p-2 rounded-md shadow-lg border-3 border-[#d3d3d3]"
		>
			<div class="text-sm text-center flex items-center space-x-2">
				<Select
					items={variables}
					clearable={false}
					bind:value={lineOne}
					containerStyles="width: 200px;"
				/>
				<Switch bind:checked={checkboxOne} />
			</div>
			<div class="text-sm text-center flex items-center space-x-2">
				<Select
					items={variables}
					clearable={false}
					bind:value={lineTwo}
					containerStyles="width: 200px;"
				/>
				<Switch bind:checked={checkboxTwo} />
			</div>
			<div class="text-sm text-center flex items-center space-x-2">
				<Select
					items={variables}
					clearable={false}
					bind:value={lineThree}
					containerStyles="width: 200px;"
				/>
				<Switch bind:checked={checkboxThree} />
			</div>
			<div class="text-sm text-center flex items-center space-x-2">
				<Select
					items={variables}
					clearable={false}
					bind:value={lineFour}
					containerStyles="width: 200px;"
				/>
				<Switch bind:checked={checkboxFour} />
			</div>
		</div>
	{/if}
</div>

{#if isMobile}
	{#each panels as panel}
		<!-- Mobile Layout: Single chart per row -->
		<div class="w-full px-2 min-h-[270px]">
			{#if panel.content === Chart1}
				<div class="h-full flex flex-col justify-center items-center rounded-md p-2 shadow-custom">
					<div class="w-full">
						<h3 class="text-left text-lg font-bold">Benefit Chart 1</h3>
					</div>
					<Chart1
						width={mobileWidth}
						height={mobileHeight}
						selectedKey1={lineOne.value}
						selectedKey2={lineTwo.value}
						selectedKey3={lineThree.value}
						selectedKey4={lineFour.value}
						{checkboxOne}
						{checkboxTwo}
						{checkboxThree}
						{checkboxFour}
					/>
				</div>
			{:else}
				<div class="h-full flex flex-col justify-center items-center rounded-md p-2 shadow-custom">
					<div class="w-full">
						<h3 class="text-left text-lg font-bold">Benefit Chart 2</h3>
					</div>
					<Chart2
						width={mobileWidth}
						height={mobileHeight}
						selectedKey1={lineOne.value}
						selectedKey2={lineTwo.value}
						selectedKey3={lineThree.value}
						selectedKey4={lineFour.value}
						{checkboxOne}
						{checkboxTwo}
						{checkboxThree}
						{checkboxFour}
					/>
				</div>
			{/if}
		</div>
	{/each}
{:else}
	<div class="h-[calc(100vh-10rem)] flex flex-col items-center justify-center">
		{#each panels as panel}
			{#if panel.content === Chart1 || panel.content === Chart2}
				<div class="w-full px-2 min-h-[270px] mb-4" style="max-width: 48%;">
					{#if panel.content === Chart1}
						<div
							class="h-full flex flex-col justify-center items-center rounded-md p-2 shadow-custom"
						>
							<div class="w-full">
								<h3 class="text-left text-lg font-bold">Benefit Chart 1</h3>
							</div>
							<Chart1
								{width}
								{height}
								selectedKey1={lineOne.value}
								selectedKey2={lineTwo.value}
								selectedKey3={lineThree.value}
								selectedKey4={lineFour.value}
								{checkboxOne}
								{checkboxTwo}
								{checkboxThree}
								{checkboxFour}
							/>
						</div>
					{:else if panel.content === Chart2}
						<div
							class="h-full flex flex-col justify-center items-center rounded-md p-2 shadow-custom"
						>
							<div class="w-full">
								<h3 class="text-left text-lg font-bold">Benefit Chart 2</h3>
							</div>
							<Chart2
								{width}
								{height}
								selectedKey1={lineOne.value}
								selectedKey2={lineTwo.value}
								selectedKey3={lineThree.value}
								selectedKey4={lineFour.value}
								{checkboxOne}
								{checkboxTwo}
								{checkboxThree}
								{checkboxFour}
							/>
						</div>
					{/if}
				</div>
			{/if}
		{/each}
	</div>
{/if}
