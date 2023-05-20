<script>
	export let returnInput;

	import {
		tidy,
		summarize,
		sum,
		last,
		mean,
		// max,
		mutate,
		mutateWithSummary,
		rowNumber,
		leftJoin,
		slice,
		lag,
		lead,
		roll,
		arrange,
		desc,
		groupBy
	} from '@tidyjs/tidy';
	import { scaleQuantize } from 'd3-scale';
	import { schemeRdYlGn } from 'd3-scale-chromatic';
	import { format } from 'd3-format';

	import dataTemp from '$lib/data/Probability/simulationData.js';

	$: returnInput = 6.5;

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

	$: data = summarizedData.map(({ PlanName, sum }) => ({
		PlanName,
		sum,
		Probability: sum / 10000
	}));

	$: console.log('data', data);

	// Color scale
	let fontColor = scaleQuantize([0, 1], ['#fff', '#000', '#000', '#000', '#fff']);
	let color = scaleQuantize([0, 1], schemeRdYlGn[5]);
</script>

<!-- Add a numeric input for returnInput -->
<div class="flex justify-center">
	<div class="w-1/2">
		<label for="returnInput" class="block text-sm font-medium text-gray-700"> Return Input </label>
		<div class="mt-1 relative rounded-md shadow-sm">
			<input
				type="number"
				name="returnInput"
				id="returnInput"
				class="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
				placeholder="6.5"
				min="0"
				max="25"
				bind:value={returnInput}
			/>
			<div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
				<span class="text-gray-500 sm:text-sm" id="price-currency"> % </span>
			</div>
		</div>
	</div>
</div>

<div class="grid grid-cols-4 gap-4">
	<!-- Titles -->
	<div class="text-center font-semibold">Horizon 10-Year Forecast</div>
	<div class="text-center font-semibold">BNY 10-Year Forecast</div>
	<div class="text-center font-semibold">JP Morgan 10-15-Year Forecast</div>
	<div class="text-center font-semibold">Research Affiliates 10-Year Forecast</div>

	{#each data.slice(0, 4) as item, index}
		<div
			class="text-center py-2 rounded"
			style="background-color: {color(item.Probability)}; color: {fontColor(item.Probability)};"
		>
			{@html format('.0%')(item.Probability)}
		</div>
	{/each}

	<!-- Titles -->
	<div class="text-center font-semibold">Horizon 20-Year Forecast</div>
	<div class="text-center font-semibold">BlackRock 20-Year Forecast</div>
	<div class="text-center font-semibold">Plan Assumptions</div>
	<div class="text-center font-semibold">Historical</div>

	{#each data.slice(4, 8) as item, index}
		<div
			class="text-center py-2 rounded"
			style="background-color: {color(item.Probability)}; color: {fontColor(item.Probability)};"
		>
			{@html format('.0%')(item.Probability)}
		</div>
	{/each}
</div>
