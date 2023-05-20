<script>
	import { onMount } from 'svelte';
	let isMobile = false;

	onMount(() => {
		isMobile = window.innerWidth < 850;
	});

	// export let width;
	import { tidy, mutate, groupBy } from '@tidyjs/tidy';
	import { scaleQuantize } from 'd3-scale';
	import { schemeRdYlGn } from 'd3-scale-chromatic';
	import { format } from 'd3-format';

	import dataTemp from '$lib/data/Probability/simulation_data.js';

	$: returnInput = 7;

	$: groupedData = tidy(
		dataTemp,
		mutate({
			Data: (d) => +d.Data * 100,
			'Return Indicator': (d) => (+d.Data >= returnInput ? 1 : 0)
		}),
		groupBy('Plan Name')
	);

	$: summarizedData = Array.from(
		groupedData.reduce((acc, row) => {
			acc.set(row['Plan Name'], (acc.get(row['Plan Name']) || 0) + row['Return Indicator']);
			return acc;
		}, new Map()),
		([PlanName, sum]) => ({ PlanName, sum })
	);

	$: dataTable = summarizedData
		.map(({ PlanName, sum }) => ({
			PlanName,
			sum,
			Probability: sum / 10000
		}))
		.sort((a, b) => b.Probability - a.Probability);

	// Color scale
	$: fontColor = scaleQuantize([0, 1], ['#fff', '#000', '#000', '#000', '#fff']);
	$: color = scaleQuantize([0, 1], schemeRdYlGn[5]);

	// Beeswarm
	import data from '$lib/data/Probability/simulation_data_filter.js';
	import { fade } from 'svelte/transition';
	import { forceSimulation, forceX, forceY, forceCollide } from 'd3-force';
	import { scaleLinear, scaleBand, scaleOrdinal } from 'd3-scale';
	import { min, max } from 'd3-array';

	import AxisX from '$lib/components/historical/probability/AxisX.svelte';
	import AxisY from '$lib/components/historical/probability/AxisY.svelte';

	let width = 700;
	let height = 500;
	const margin = { top: 100, right: 50, bottom: 20, left: 120 };
	$: innerWidth = width - margin.left - margin.right;
	let innerHeight = height - margin.top - margin.bottom;

	const type = [
		'BlackRock',
		'Plan Assumptions',
		'Horizon20',
		'Historical',
		'Horizon10',
		'BNY Mellon',
		'JP Morgan',
		'Research Affiliates'
	];

	$: growthMin = min(data, (d) => d.growth);
	$: growthMax = max(data, (d) => d.growth);

	$: xScale = scaleLinear().domain([growthMin, growthMax]).range([0, innerWidth]);
	$: yScale = scaleBand().domain(type).range([0, innerHeight]).padding(0.1);

	$: simulation = forceSimulation(data)
		.force('x', forceX((d) => xScale(d.growth)).strength(0.8))
		.force(
			'y',
			forceY()
				.y((d) => yScale(d.type))
				.strength(0.2)
		)
		.force('collide', forceCollide(2))
		.stop();

	$: {
		for (let i = 0; i < 100; ++i) simulation.tick();
	}
</script>

<p class="mb-5">
	The boxes below represent the probability that STRS will hit a given assumed rate of return based
	on 10,000 simulations of various capital market assumptions, in addition to plan assumptions and
	historical data.
</p>
<!-- Add a numeric input for returnInput -->
<div class="flex justify-center">
	<div class="w-1/2">
		<label for="returnInput" class="block text-sm font-medium text-gray-700">
			Assumed Rate of Return
		</label>
		<div class="mt-1 relative rounded-md shadow-sm">
			<input
				type="number"
				name="returnInput"
				id="returnInput"
				class="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
				placeholder="7"
				step="0.25"
				min="0"
				max="16"
				bind:value={returnInput}
			/>
			<div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
				<span class="text-gray-500 sm:text-sm" id="price-currency"> % </span>
			</div>
		</div>
	</div>
</div>

<div class="grid grid-cols-4 gap-4 mt-2">
	<!-- Titles -->
	{#each dataTable.slice(0, 4) as item, index}
		<div
			class="text-center py-4 border-2 border-black"
			style="background-color: {color(item.Probability)}; color: {fontColor(item.Probability)};"
		>
			{item.PlanName}: {format('.0%')(item.Probability)}
		</div>
	{/each}

	{#each dataTable.slice(4, 8) as item, index}
		<div
			class="text-center py-4 border-2 border-black"
			style="background-color: {color(item.Probability)}; color: {fontColor(item.Probability)};"
		>
			{item.PlanName}: {format('.0%')(item.Probability)}
		</div>
	{/each}
</div>

{#if !isMobile}
	<div>
		<svg {width} {height}>
			<g transform="translate({margin.left}, {margin.top})">
				<AxisX {xScale} height={innerHeight} width={innerWidth} />
				<AxisY {yScale} width={innerWidth} />

				{#each data as d}
					<circle
						cx={d.x}
						cy={d.y}
						r="2"
						fill={d.growth > returnInput / 100 ? 'green' : 'red'}
						stroke="black"
						stroke-width="1"
						opacity="0.7"
					/>
				{/each}
				<line
					class="threshold-line"
					x1={xScale(returnInput / 100)}
					x2={xScale(returnInput / 100)}
					y1="-10"
					y2={innerHeight}
					stroke="black"
					stroke-width="2"
				/>
				<text
					class="threshold-label"
					x={xScale(returnInput / 100)}
					y="-15"
					font-size="14"
					fill="black"
					text-anchor="middle"
				>
					{returnInput}%
				</text>
			</g>
		</svg>
	</div>
{/if}
