<script>
	export let width;
	import { format } from 'd3-format';
	import { draw } from 'svelte/transition';
	import { scaleLinear, scaleBand } from 'd3-scale';

	import XAxis from '$lib/components/historical/amortizationpayments/XAxis.svelte';
	import Axis from '$lib/components/historical/amortizationpayments/Axis.svelte';

	import data from '$lib/data/AmortizationPayments/amortizationPayments.js';

	let color1 = '#2879cb';
	let color2 = '#ff6633';
	let color3 = '#00b0f0';

	// let data = [
	// 	{ label: 2013, group1: 1000, group2: 500, group3: 600 },
	// 	{ label: 2014, group1: 1000, group2: 500, group3: 600 },
	// 	{ label: 2015, group1: 1000, group2: 500, group3: 600 },
	// 	{ label: 2016, group1: 1000, group2: 500, group3: 600 },
	// 	{ label: 2017, group1: 500, group2: 1000, group3: 800 },
	// 	{ label: 2018, group1: 200, group2: 300, group3: 250 },
	// 	{ label: 2019, group1: -100, group2: -200, group3: -150 },
	// 	{ label: 2020, group1: -300, group2: -400, group3: -350 },
	// 	{ label: 2021, group1: -400, group2: -500, group3: -450 },
	// 	{ label: 2022, group1: -900, group2: -800, group3: -850 }
	// ];

	let height = 350;
	let margin = { top: 20, right: 50, bottom: 40, left: 50 };

	let xScale;
	let yScale;
	let xGroupScale;

	$: {
		xScale = scaleBand()
			.domain(data.map((d) => d.year))
			.range([margin.left, width - margin.right])
			.padding(0);

		xGroupScale = scaleBand()
			.domain(['amo_cont', 'interest', 'net_amo'])
			.range([0, xScale.bandwidth()])
			.padding(0.05);

		const maxValue = Math.max(
			Math.abs(Math.min(...data.map((d) => Math.min(d.amo_cont, d.interest, d.net_amo)))),
			Math.abs(Math.max(...data.map((d) => Math.max(d.amo_cont, d.interest, d.net_amo))))
		);

		yScale = scaleLinear()
			.domain([-maxValue * 1.1, maxValue * 1.1])
			.range([height - margin.bottom, margin.top]);
	}

	$: yTicks = yScale ? yScale.ticks(5) : [];

	// Tooltip
	let m = { x: 0, y: 0 };

	function handleMousemove(event) {
		m.x = event.clientX;
		m.y = event.clientY;
	}

	let tooltipData = false;
	let hover = false;
</script>

<p class="font-bold text-xl mt-10">Amortization Payments</p>

<div class="chart" bind:clientWidth={width}>
	<svg {width} {height} on:mousemove={handleMousemove}>
		<g transform="translate({(width - 400) / 2}, 0)">
			<svg class="legend font-sansSerif" width="500" height="20">
				<g>
					<circle cx="5" cy="5" r="4.5" fill={color1} />
					<text x="14" y="9" font-size="0.8rem">Amortization Contributions</text>
				</g>
				<g transform="translate(190)">
					<circle cx="5" cy="5" r="4.5" fill={color2} />
					<text x="14" y="9" font-size="0.8rem">Interest on Debt</text>
				</g>
				<g transform="translate(320)">
					<circle cx="5" cy="5" r="4.5" fill={color3} />
					<text x="14" y="9" font-size="0.8rem">Net Amortization</text>
				</g>
			</svg>
		</g>
		<XAxis {xScale} labels={data.map((data) => data.year)} {height} {margin} />
		{#each yTicks as tick}
			<Axis
				axisType="yAxis"
				translate="translate(0, {yScale(tick)})"
				x1={margin.left / 4}
				x2={width - margin.right}
				x="30"
				y="-4"
				text={format('$,.0s')(tick).replace('G', ' B')}
			/>
		{/each}
		<g>
			{#each data as item}
				<rect
					x={xScale(item.year)}
					y={margin.top}
					width={xScale.bandwidth()}
					height={height - margin.top - margin.bottom}
					fill="transparent"
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
				{#if item.year == tooltipData.year}
					<rect
						x={xScale(item.year)}
						y={margin.top}
						width={xScale.bandwidth()}
						height={height - margin.top - margin.bottom}
						fill={hover ? 'rgba(0,0,0,0.1)' : 'transparent'}
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
						pointer-events="none"
					/>
				{/if}
				<rect
					x={xScale(item.year) + xGroupScale('amo_cont')}
					y={yScale(Math.max(0, item.amo_cont))}
					width={xGroupScale.bandwidth()}
					height={Math.abs(yScale(item.amo_cont) - yScale(0))}
					fill={color1}
					opacity={tooltipData === item ? 1 : 0.85}
					pointer-events="none"
				/>
				<rect
					x={xScale(item.year) + xGroupScale('interest')}
					y={yScale(Math.max(0, item.interest))}
					width={xGroupScale.bandwidth()}
					height={Math.abs(yScale(item.interest) - yScale(0))}
					fill={color2}
					opacity={tooltipData === item ? 1 : 0.85}
					pointer-events="none"
				/>
				<rect
					x={xScale(item.year) + xGroupScale('net_amo')}
					y={yScale(Math.max(0, item.net_amo))}
					width={xGroupScale.bandwidth()}
					height={Math.abs(yScale(item.net_amo) - yScale(0))}
					fill={color3}
					opacity={tooltipData === item ? 1 : 0.85}
					pointer-events="none"
				/>
			{/each}
		</g>
	</svg>
	{#if tooltipData}
		<div
			class="tooltip bg-white border border-gray-300 p-2 shadow rounded text-sm"
			style="position: fixed; top:{m.y - 5}px; left:{m.x + 10}px; "
		>
			<span class="font-bold flex justify-center">{tooltipData.year}</span>
			<hr class="border border-t-2" />
			<span
				style="width: 9px;
			height: 9px;
			display: inline-block;
			border-radius: 50%;background: {color1};"
			/>
			Amortization Contributions: {format('$,.3s')(-tooltipData.amo_cont).replace('G', ' B')}<br />
			<span
				style="width: 9px;
			height: 9px;
			display: inline-block;
			border-radius: 50%;background: {color2};"
			/>
			Interest on Debt: {format('$,.3s')(-tooltipData.interest).replace('G', ' B')}<br />
			<span
				style="width: 9px;
			height: 9px;
			display: inline-block;
			border-radius: 50%;background: {color3};"
			/>
			Net Amortization: {format('$,.3s')(-tooltipData.net_amo).replace('G', ' B')}
		</div>
	{/if}
</div>

<style>
	.tick line {
		stroke: #a3a3a3;
		opacity: 0.4;
	}

	.y-tick-text {
		font-size: 13px;
		fill: #82828;
	}

	.tooltip {
		background: white;
		border: 1px solid black;
		padding: 5px;
		pointer-events: none;
		z-index: 999;
		/* transition: top 100ms ease, left 100ms ease; */
		min-width: 50px;
	}
</style>
