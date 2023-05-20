<script>
	export let width;
	import { format } from 'd3-format';
	import { scaleLinear, scaleBand } from 'd3-scale';
	import { draw } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	import XAxis from '$lib/components/historical/gainloss/XAxis.svelte';
	import Axis from '$lib/components/historical/gainloss/Axis.svelte';

	let data = [
		{ label: 'Negative Amortization', value: 14.48 },
		{ label: 'Changes to Actuarial Methods & Assumptions	', value: 11.92 },
		{ label: 'Investment Performance', value: 8.83 },
		{ label: 'Deviations from Demographic Assumptions', value: 5.85 },
		{ label: 'Other', value: 0.45 },
		{ label: 'Benefit Changes	', value: -25.72 },
		{ label: 'Net Change to Unfunded Liability', value: -15.8 }
	];

	let height = 400;
	let margin = { top: 20, right: 50, bottom: 100, left: 50 };

	let xScale;
	let yScale;

	$: {
		xScale = scaleBand()
			.domain(data.map((d) => d.label))
			.range([margin.left, width - margin.right])
			.padding(0.04);

		yScale = scaleLinear()
			.domain([
				Math.min(0, ...data.map((d) => d.start + d.value)) * 1.1,
				Math.max(...data.map((d) => d.start + d.value)) * 1.1
			])
			.range([height - margin.bottom, margin.top]);
	}

	$: yTicks = yScale ? yScale.ticks(5) : [];

	let cumulative = 0;

	data.forEach((d) => {
		d.start = cumulative;
		cumulative += d.value;
	});

	// Tooltip
	let m = { x: 0, y: 0 };

	function handleMousemove(event) {
		m.x = event.clientX;
		m.y = event.clientY;
	}

	let tooltipData = false;
	let hover = false;
</script>

<p class="font-bold text-xl mt-10">What is driving STRS Debt? (2001 to 2022)</p>

<div class="chart" bind:clientWidth={width}>
	<svg {width} {height} on:mousemove={handleMousemove}>
		<!-- Y-axis line -->
		{#each yTicks as tick}
			<Axis
				axisType="yAxis"
				translate="translate(0, {yScale(tick)})"
				x1={margin.left / 4}
				x2={width - margin.right}
				x="40"
				y="-4"
				text={format('$,.0f')(tick) + ' B'}
			/>
		{/each}
		<XAxis {xScale} labels={data.map((data) => data.label)} {height} {margin} />
		<g>
			{#each data as item, index}
				<rect
					x={xScale(item.label)}
					y={yScale(Math.max(item.start, item.start + item.value))}
					width={xScale.bandwidth()}
					height={Math.abs(yScale(item.start) - yScale(item.start + item.value))}
					fill={item.value >= 0
						? 'red'
						: index === data.length - 1
						? 'rgba(255, 0, 0, 0.5)'
						: 'green'}
					opacity={tooltipData === item ? 0.5 : 0.75}
					on:mouseover={() => {
						tooltipData = item;
						hover = true;
					}}
					on:mousemove={() => {
						tooltipData = item;
					}}
					on:mouseleave={() => {
						tooltipData = false;
						hover = false;
					}}
				/>
				{#if hover}
					<path
						in:draw={{ duration: 1000 }}
						out:draw={{ duration: 0 }}
						d="M{xScale(item.label)} {yScale(
							Math.max(item.start, item.start + item.value)
						)} h{xScale.bandwidth()} v{Math.abs(
							yScale(item.start) - yScale(item.start + item.value)
						)} h{-xScale.bandwidth()} z"
						fill="none"
						opacity={tooltipData === item ? 1 : 0}
						stroke="#333"
						stroke-width="2"
					/>
				{/if}
			{/each}
		</g>
		<g>
			{#each data as item, index}
				<text
					x={xScale(item.label) + xScale.bandwidth() / 2}
					y={index === data.length - 1
						? yScale(-item.value) - 5
						: yScale(item.start + item.value) - 5}
					text-anchor="middle"
					fill="black"
					pointer-events="none"
					font-weight="bold"
				>
					{index === data.length - 1 ? format('$,.1f')(item.value) : format('$,.1f')(-item.value)}
				</text>
			{/each}
		</g>
	</svg>
	{#if tooltipData}
		<div
			class="tooltip bg-white border border-gray-300 p-2 shadow rounded text-sm"
			style="position: fixed; top:{m.y - 5}px; left:{m.x + 10}px;"
		>
			<span class="font-bold flex justify-center">{tooltipData.label}</span>
			<hr class="border border-t-2" />
			{format('$,.2f')(-tooltipData.value) + ' B'}
		</div>
	{/if}
</div>

<div>
	<ul class="list-disc px-10">
		<li class="py-1">
			<span class="text-reasonRed font-bold">Negative Amortization</span> has resulted in interest
			on STRS debt exceeding the actual debt payments (negative amortization), adding ${data[0]
				.value} billion in unfunded liabilities.
		</li>
		<li class="py-1">
			<span class="text-reasonRed font-bold">Changes to Actuarial Methods & Assumptions</span>
			revealed ${data[1].value} billion in previously unrecognized unfunded liabilities.
		</li>
		<li class="py-1">
			<span class="text-reasonRed font-bold">Investment Performance</span> below assumption has
			added ${data[2].value} billion to unfunded liabilities.
		</li>
		<li class="py-1">
			<span class="text-reasonRed font-bold">Deviations from Demographics Assumptions</span> exposed
			${data[3].value} billion in additional unfunded liabilities due to demographic experience not meeting
			expectations.
		</li>
		<li class="py-1">
			<span class="text-reasonRed font-bold">Other</span> unclassified changes to STRS over the last
			several decades have added ${data[4].value} billion in unfunded liabilities.
		</li>
		<li class="py-1">
			<span class="text-reasonGreen font-bold">Benefit Changes</span> reduced unfunded liabilities
			by ${data[5].value} billion.
		</li>
		<li class="py-1">
			<span class="text-reasonRed font-bold">Net Change</span>, from 2001 to 2022, unfunded
			liabilities increased by ${-data[6].value} billion.
		</li>
	</ul>
</div>

<style>
	.tooltip {
		background: white;
		border: 1px solid black;
		padding: 5px;
		pointer-events: none;
		z-index: 999;
		/* transition: top 300ms ease, left 300ms ease; */
		min-width: 50px;
	}
</style>
