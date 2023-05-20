<script>
	export let width;
	import { onMount } from 'svelte';
	import { tweened } from 'svelte/motion';
	import { linear } from 'svelte/easing';
	import { scaleLinear, scaleTime } from 'd3-scale';
	import { extent } from 'd3-array';
	import { line, area } from 'd3-shape';
	import { format } from 'd3-format';
	import { timeFormat, timeParse } from 'd3-time-format';
	import * as easings from 'svelte/easing';

	import Axis from '$lib/components/historical/general/Axis.svelte';
	import indexedMarketReturnData from '$lib/data/InvestmentReturns/marketReturn.js';
	import indexedInvestmentReturnData from '$lib/data/InvestmentReturns/assumedReturn.js';
	import indexedReturn5YearData from '$lib/data/InvestmentReturns/return5Year.js';
	import HoverEvents from '$lib/components/historical/InvestmentReturns/HoverEvents.svelte';

	let color1 = '#ff6633';
	let color2 = '#2879cb';
	let color3 = '#2e3745';

	let selectedKey = 'year5';
	// function switchKey() {
	// 	selectedKey = selectedKey === 'plan_1' ? 'plan_2' : 'plan_1';
	// }

	// Switch Key for 'year5', 'year10', and 'year15'
	function switchKey() {
		selectedKey =
			selectedKey === 'year5' ? 'year10' : selectedKey === 'year10' ? 'year15' : 'year5';
	}

	let points1 = indexedMarketReturnData[selectedKey];
	let points2 = indexedInvestmentReturnData[selectedKey];
	let points3 = indexedReturn5YearData[selectedKey];

	const tweenedPoints1 = tweened(points1, {
		delay: 0,
		duration: 400,
		easing: easings.easeCubicOut
	});

	const tweenedPoints2 = tweened(points2, {
		delay: 0,
		duration: 400,
		easing: easings.easeCubicOut
	});

	const tweenedPoints3 = tweened(points3, {
		delay: 0,
		duration: 400,
		easing: easings.easeCubicOut
	});

	const xExtent = extent(
		[
			...indexedMarketReturnData.year5,
			...indexedMarketReturnData.year10,
			...indexedInvestmentReturnData.year5,
			...indexedInvestmentReturnData.year10,
			...indexedReturn5YearData.year5,
			...indexedReturn5YearData.year10
		],
		(d) => new Date(d.x)
	);

	$: {
		xExtent[1] = new Date(xExtent[1].getFullYear() + 1, 0, 1);
	}

	const yExtent1 = [
		extent([...indexedMarketReturnData.year5, ...indexedMarketReturnData.year10], (d) => d.y)[0],
		extent([...indexedMarketReturnData.year5, ...indexedMarketReturnData.year10], (d) => d.y)[1]
	];

	let height = 350;
	let margin = { top: 20, right: 50, bottom: 40, left: 50 };
	let innerHeight = height - margin.top - margin.bottom;
	$: innerWidth = width - margin.left - margin.right;

	// Initialize the scales before using them
	$: xScale = scaleTime().range([0, innerWidth]);
	$: yScale1 = scaleLinear().range([innerHeight, margin.bottom]);

	$: {
		// Update the scales in a reactive statement
		xScale.range([0, innerWidth]);
		yScale1.range([innerHeight, 0]);

		xScale.domain(xExtent);
		yScale1.domain(yExtent1);
	}

	function setTween1(key) {
		tweenedPoints1.set(indexedMarketReturnData[key]);
	}

	function setTween2(key) {
		tweenedPoints2.set(indexedInvestmentReturnData[key]);
	}

	function setTween3(key) {
		tweenedPoints3.set(indexedReturn5YearData[key]);
	}

	$: {
		setTween1(selectedKey);
		setTween2(selectedKey);
		setTween3(selectedKey);
	}

	$: lineGenerator = line()
		.x((d) => xScale(new Date(d.x)))
		.y((d) => yScale1(d.y));

	$: yTicks1 = yScale1.ticks(5);
	$: xTicks = xScale.ticks(10);

	const minDate = new Date(xExtent[0]);
	const maxDate = new Date(xExtent[1]);

	let hoveredDate = maxDate;

	// Tooltip
	let m = { x: 0, y: 0 };

	function handleMousemove(event) {
		m.x = event.clientX;
		m.y = event.clientY;
	}

	let tooltipData = false;

	const getYValue1 = (date) =>
		indexedMarketReturnData[selectedKey].filter((d) => new Date(d.x) >= date)[0]?.y;
	const getYValue2 = (date) =>
		indexedInvestmentReturnData[selectedKey].filter((d) => new Date(d.x) >= date)[0]?.y;
	const getYValue3 = (date) =>
		indexedReturn5YearData[selectedKey].filter((d) => new Date(d.x) >= date)[0]?.y;

	function getNextYear(date) {
		let newDate = new Date(date);
		newDate.setDate(newDate.getDate() + 1);
		return newDate;
	}
</script>

<!-- <button on:click={switchKey}>Switch</button> -->
<p class="font-bold text-xl mt-10">Investment Returns</p>
<p class="mb-5">
	The chart below compares assumed returns with market, actuarial, and geometric rolling returns.
</p>

<div
	on:mousemove={handleMousemove}
	on:mouseover={() => {
		tooltipData = true;
	}}
	on:mouseleave={() => {
		tooltipData = false;
	}}
>
	{#if tooltipData & (m.x > 0) & (m.y > 0)}
		<div
			class="tooltip bg-white border border-gray-300 p-2 shadow rounded text-sm"
			style="position: fixed; top:{m.y - 5}px; left:{m.x + 10}px;"
		>
			<span class="font-bold flex justify-center">{timeFormat('%Y')(getNextYear(hoveredDate))}</span
			>
			<hr class="border border-t-2" />
			<span
				style="width: 9px;
			height: 9px;
			display: inline-block;
			border-radius: 50%;background: {color1};"
			/>
			Market Return: {format('.1%')(getYValue1(hoveredDate))} <br />
			<span
				style="width: 9px;
			height: 9px;
			display: inline-block;
			border-radius: 50%;background: {color2};"
			/>
			Assumed Return: {format('.1%')(getYValue2(hoveredDate))} <br />
			<span
				style="width: 9px;
			height: 9px;
			display: inline-block;
			border-radius: 50%;background: {color3};"
			/>
			5-Year Average: {format('.1%')(getYValue3(hoveredDate))}
		</div>
	{/if}
	<div class="chart" bind:clientWidth={width}>
		<svg {width} {height}>
			<g transform="translate({(width - 390) / 2}, 0)">
				<svg class="legend font-sansSerif" width="600" height="20">
					<g>
						<circle cx="5" cy="5" r="4.5" fill={color1} />
						<text x="14" y="9" font-size="0.8rem">Market Return</text>
					</g>
					<g transform="translate(110)">
						<circle cx="5" cy="5" r="4.5" fill={color2} />
						<text x="14" y="9" font-size="0.8rem">Assumed Return</text>
					</g>
					<g transform="translate(235)">
						<circle cx="5" cy="5" r="4.5" fill={color3} />
						<text x="14" y="9" font-size="0.8rem">5-Year Geometric Rolling Return</text>
					</g>
				</svg>
			</g>
			<g transform="translate({margin.left} {margin.top})">
				{#each yTicks1 as tick}
					<Axis
						axisType="yAxis"
						translate="translate(0, {yScale1(tick)})"
						x1={xScale(minDate) - margin.left}
						x2={xScale(maxDate)}
						x="-10"
						y="-4"
						text={format('.0%')(tick)}
						width={innerWidth}
					/>
				{/each}
				<path d={lineGenerator($tweenedPoints1)} stroke={color1} stroke-width="3" fill="none" />
				<path d={lineGenerator($tweenedPoints2)} stroke={color2} stroke-width="3" fill="none" />
				<path d={lineGenerator($tweenedPoints3)} stroke={color3} stroke-width="3" fill="none" />

				{#each xTicks as tick}
					<Axis
						{width}
						axisType="xAxis"
						translate="translate({xScale(tick)},0)"
						y1={yScale1(yExtent1[0]) + 5}
						y2={yScale1(yExtent1[0])}
						y={innerHeight + 20}
						text={width < 750
							? tick.toLocaleString(undefined, {
									year: '2-digit'
							  })
							: tick.toLocaleString(undefined, {
									year: 'numeric'
							  })}
					/>
				{/each}
				<HoverEvents
					width={innerWidth}
					height={innerHeight}
					{xScale}
					{yScale1}
					{margin}
					{maxDate}
					data1={indexedMarketReturnData}
					data2={indexedInvestmentReturnData}
					data3={indexedReturn5YearData}
					{color1}
					{color2}
					{color3}
					{selectedKey}
					bind:hoveredDate
					{tooltipData}
				/>
			</g>
		</svg>
	</div>
</div>

<style>
	.graph-container {
		height: 375px;
	}

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
