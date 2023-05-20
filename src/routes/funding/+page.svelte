<script>
	import { onMount } from 'svelte';
	import Select from 'svelte-select';

	import Chart1 from '$lib/components/funding/chart1/Chart1.svelte';
	import Chart2 from '$lib/components/funding/chart2/Chart2.svelte';
	import Chart3 from '$lib/components/funding/chart3/Chart3.svelte';
	import Chart4 from '$lib/components/funding/chart4/Chart4.svelte';
	import Chart5 from '$lib/components/funding/chart5/Chart5.svelte';

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
			mobileHeight = Math.max(window.innerHeight * 0.2, 200);
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
		{ label: 'Status Quo - Baseline', value: 'scenario_a' },
		{ label: 'ADEC - Baseline', value: 'scenario_b' },
		{ label: 'Status Quo - Double Recession', value: 'scenario_c' },
		{ label: 'ADEC - Double Recession', value: 'scenario_d' }
	];

	let lineOne = { label: 'Status Quo - Baseline', value: 'scenario_a' };
	let lineTwo = { label: 'ADEC - Baseline', value: 'scenario_b' };
	let lineThree = { label: 'Status Quo - Double Recession', value: 'scenario_c' };
	let lineFour = { label: 'ADEC - Double Recession', value: 'scenario_d' };

	let checkboxOne = true;
	let checkboxTwo = true;
	let checkboxThree = false;
	let checkboxFour = false;

	let showChart3 = true;

	const panels = [
		{ title: 'Panel 1', content: Chart1 },
		{ title: 'Panel 2', content: Chart2 },
		{ title: 'Panel 3', content: Chart3 },
		{ title: 'Panel 4', content: Chart5 }
	];
</script>

<svelte:head>
	<title>Funding Model</title>
</svelte:head>

<div class="h-[5rem] flex flex-wrap items-stretch justify-center">
	{#if showInputPanel}
		<div
			class="w-full mx-5 my-2 p-0 grid grid-cols-1 md:grid-cols-4 sm:grid-cols-2 gap-4 bg-bgLightGray p-2 rounded-md shadow-lg border-3 border-[#d3d3d3]"
		>
			<div class="text-sm text-center flex items-center space-x-2">
				<span
					class="mr-1 bg-reasonOrange"
					style="width: 12px;
					height: 12px;
					display: inline-block;
					border-radius: 50%;"
				/>
				<Select
					items={variables}
					clearable={false}
					bind:value={lineOne}
					containerStyles="width: 200px;"
				/>
				<Switch bind:checked={checkboxOne} color={'#ff6633'} />
			</div>
			<div class="text-sm text-center flex items-center space-x-2">
				<span
					class="mr-1 bg-reasonBlue"
					style="width: 12px;
					height: 12px;
					display: inline-block;
					border-radius: 50%;"
				/>
				<Select
					items={variables}
					clearable={false}
					bind:value={lineTwo}
					containerStyles="width: 200px;"
				/>
				<Switch bind:checked={checkboxTwo} />
			</div>
			<div class="text-sm text-center flex items-center space-x-2">
				<span
					class="mr-1 bg-reasonDarkBlue"
					style="width: 12px;
					height: 12px;
					display: inline-block;
					border-radius: 50%;"
				/>
				<Select
					items={variables}
					clearable={false}
					bind:value={lineThree}
					containerStyles="width: 200px;"
				/>
				<Switch bind:checked={checkboxThree} />
			</div>
			<div class="text-sm text-center flex items-center space-x-2">
				<span
					class="mr-1 bg-reasonYellow"
					style="width: 12px;
					height: 12px;
					display: inline-block;
					border-radius: 50%;"
				/>
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
						<h3 class="text-left text-lg font-bold">Funded Ratio (MVA Basis)</h3>
					</div>
					<Chart1
						width={mobileWidth}
						height={mobileHeight}
						selectedKey1={lineOne.value}
						selectedKey2={lineTwo.value}
						selectedKey3={lineThree.value}
						selectedKey4={lineFour.value}
						name1={lineOne.label}
						name2={lineTwo.label}
						name3={lineThree.label}
						name4={lineFour.label}
						{checkboxOne}
						{checkboxTwo}
						{checkboxThree}
						{checkboxFour}
					/>
				</div>
			{:else if panel.content === Chart2}
				<div class="h-full flex flex-col justify-center items-center rounded-md p-2 shadow-custom">
					<div class="w-full">
						<h3 class="text-left text-lg font-bold">Funded Ratio (MVA Basis)</h3>
					</div>
					<Chart2
						width={mobileWidth}
						height={mobileHeight}
						selectedKey1={lineOne.value}
						selectedKey2={lineTwo.value}
						selectedKey3={lineThree.value}
						selectedKey4={lineFour.value}
						name1={lineOne.label}
						name2={lineTwo.label}
						name3={lineThree.label}
						name4={lineFour.label}
						{checkboxOne}
						{checkboxTwo}
						{checkboxThree}
						{checkboxFour}
					/>
				</div>
			{:else if panel.content === Chart3 && showChart3}
				<div
					class="h-full flex flex-col justify-center items-center rounded-md p-2 shadow-custom relative"
				>
					<div class="w-full">
						<h3 class="text-left text-lg font-bold">Employer Contribution ($, Infl. Adjusted)</h3>
						<button
							class="absolute top-2 right-2 w-20 px-2 py-1 bg-gray-600 text-white text-sm rounded-md shadow-md"
							on:click={() => (showChart3 = !showChart3)}
						>
							{showChart3 ? 'Percent' : 'Dollar'}
						</button>
					</div>
					<Chart3
						width={mobileWidth}
						height={mobileHeight}
						selectedKey1={lineOne.value}
						selectedKey2={lineTwo.value}
						selectedKey3={lineThree.value}
						selectedKey4={lineFour.value}
						name1={lineOne.label}
						name2={lineTwo.label}
						name3={lineThree.label}
						name4={lineFour.label}
						{checkboxOne}
						{checkboxTwo}
						{checkboxThree}
						{checkboxFour}
					/>
				</div>
			{:else if panel.content === Chart3 && !showChart3}
				<div
					class="h-full flex flex-col justify-center items-center rounded-md p-2 shadow-custom relative"
				>
					<div class="w-full">
						<div class="w-2/3">
							<h3 class="text-left text-lg font-bold">Employer Contribution (% of Payroll)</h3>
						</div>
						<button
							class="absolute top-2 right-2 w-20 px-2 py-1 bg-gray-600 text-white text-sm rounded-md shadow-md"
							on:click={() => (showChart3 = !showChart3)}
						>
							{showChart3 ? 'Percent' : 'Dollar'}
						</button>
					</div>
					<Chart4
						width={mobileWidth}
						height={mobileHeight}
						selectedKey1={lineOne.value}
						selectedKey2={lineTwo.value}
						selectedKey3={lineThree.value}
						selectedKey4={lineFour.value}
						name1={lineOne.label}
						name2={lineTwo.label}
						name3={lineThree.label}
						name4={lineFour.label}
						{checkboxOne}
						{checkboxTwo}
						{checkboxThree}
						{checkboxFour}
					/>
				</div>
			{:else}
				<div class="h-full flex flex-col justify-center items-center rounded-md p-2 relative">
					<Chart5
						width={mobileWidth}
						height={mobileHeight}
						{checkboxOne}
						{checkboxTwo}
						{checkboxThree}
						{checkboxFour}
						{lineOne}
						{lineTwo}
						{lineThree}
						{lineFour}
					/>
				</div>
			{/if}
		</div>
	{/each}
{:else}
	<div class="h-[calc(100vh-10rem)] flex flex-wrap items-stretch">
		{#each panels as panel}
			<div class="w-1/2 h-[48%] px-2 min-h-[270px]">
				{#if panel.content === Chart1}
					<div
						class="h-full flex flex-col justify-center items-center rounded-md p-2 shadow-custom"
					>
						<div class="w-full">
							<h3 class="text-left text-lg font-bold">Funded Ratio (MVA Basis)</h3>
						</div>
						<Chart1
							{width}
							{height}
							selectedKey1={lineOne.value}
							selectedKey2={lineTwo.value}
							selectedKey3={lineThree.value}
							selectedKey4={lineFour.value}
							name1={lineOne.label}
							name2={lineTwo.label}
							name3={lineThree.label}
							name4={lineFour.label}
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
							<h3 class="text-left text-lg font-bold">
								Unfunded Market Liability (Infl. Adjusted)
							</h3>
						</div>
						<Chart2
							{width}
							{height}
							selectedKey1={lineOne.value}
							selectedKey2={lineTwo.value}
							selectedKey3={lineThree.value}
							selectedKey4={lineFour.value}
							name1={lineOne.label}
							name2={lineTwo.label}
							name3={lineThree.label}
							name4={lineFour.label}
							{checkboxOne}
							{checkboxTwo}
							{checkboxThree}
							{checkboxFour}
						/>
					</div>
				{:else if panel.content === Chart3 && showChart3}
					<div
						class="h-full flex flex-col justify-center items-center rounded-md p-2 shadow-custom relative"
					>
						<div class="w-full">
							<h3 class="text-left text-lg font-bold">Employer Contribution (% of Payroll)</h3>
							<button
								class="absolute top-2 right-2 w-20 px-2 py-1 bg-gray-600 text-white text-sm rounded-md shadow-md"
								on:click={() => (showChart3 = !showChart3)}
							>
								{showChart3 ? 'Dollar' : 'Percent'}
							</button>
						</div>
						<Chart3
							{width}
							{height}
							selectedKey1={lineOne.value}
							selectedKey2={lineTwo.value}
							selectedKey3={lineThree.value}
							selectedKey4={lineFour.value}
							name1={lineOne.label}
							name2={lineTwo.label}
							name3={lineThree.label}
							name4={lineFour.label}
							{checkboxOne}
							{checkboxTwo}
							{checkboxThree}
							{checkboxFour}
						/>
					</div>
				{:else if panel.content === Chart3 && !showChart3}
					<div
						class="h-full flex flex-col justify-center items-center rounded-md p-2 shadow-custom relative"
					>
						<div class="w-full">
							<h3 class="text-left text-lg font-bold">Employer Contribution ($, Infl. Adjusted)</h3>
							<button
								class="absolute top-2 right-2 w-20 px-2 py-1 bg-gray-600 text-white text-sm rounded-md shadow-md"
								on:click={() => (showChart3 = !showChart3)}
							>
								{showChart3 ? 'Dollar' : 'Percent'}
							</button>
						</div>
						<Chart4
							{width}
							{height}
							selectedKey1={lineOne.value}
							selectedKey2={lineTwo.value}
							selectedKey3={lineThree.value}
							selectedKey4={lineFour.value}
							name1={lineOne.label}
							name2={lineTwo.label}
							name3={lineThree.label}
							name4={lineFour.label}
							{checkboxOne}
							{checkboxTwo}
							{checkboxThree}
							{checkboxFour}
						/>
					</div>
				{:else}
					<div class="h-full flex flex-col justify-center items-center rounded-md p-2 relative">
						<Chart5
							{height}
							{width}
							{checkboxOne}
							{checkboxTwo}
							{checkboxThree}
							{checkboxFour}
							{lineOne}
							{lineTwo}
							{lineThree}
							{lineFour}
						/>
					</div>
				{/if}
			</div>
		{/each}
	</div>
{/if}

<button
	class="fixed bottom-0 right-0 mx-auto my-2 px-4 py-2 bg-gray-600 text-white text-sm rounded-md shadow-md"
	on:click={toggleInputPanel}
>
	{showInputPanel ? 'Hide' : 'Show'} Inputs
</button>

<style>
	:root {
		--font-size: 13px;
	}
</style>
