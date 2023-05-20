<script>
	export let width;
	import { onMount } from 'svelte';
	import { tweened } from 'svelte/motion';
	import { linear } from 'svelte/easing';
	import { scaleLinear, scaleTime } from 'd3-scale';
	import { extent } from 'd3-array';
	import { area, stack, curveCardinal } from 'd3-shape';
	import { format } from 'd3-format';
	import { timeFormat, timeParse } from 'd3-time-format';
	import * as easings from 'svelte/easing';

	import Axis from '$lib/components/historical/unpaidinterest/Axis.svelte';
	import unpaidLiabilities from '$lib/data/UnpaidInterest/UnpaidInterest.js';
	import unpaidInterest from '$lib/data/UnpaidInterest/otherUAL.js';
	import HoverEvents from '$lib/components/historical/unpaidinterest/HoverEvents.svelte';

	let color1 = '#ff6633';
	let color2 = '#7a8ca9';

	let selectedKey = 'plan_1';
	// function switchKey() {
	// 	selectedKey = selectedKey === 'market' ? 'actuarial' : 'market';
	// }

	let points1 = unpaidLiabilities[selectedKey];
	let points2 = unpaidInterest[selectedKey];

	const createCombinedData = (data1, data2) => {
		return data1.map((point1, index) => {
			return { x: point1.x, y1: point1.y, y2: data2[index].y };
		});
	};

	let combinedData = createCombinedData(points1, points2);

	$: stackedData = stack().keys(['y1', 'y2'])(combinedData);

	const tweenedCombinedData = tweened(combinedData, {
		delay: 0,
		duration: 400,
		easing: easings.easeCubicOut
	});

	$: {
		setTween(selectedKey);
	}

	$: {
		tweenedCombinedData.subscribe(($tweenedCombinedData) => {
			stackedData = stack().keys(['y1', 'y2'])($tweenedCombinedData);
		});
	}

	const xExtent = extent(
		[
			...unpaidLiabilities.plan_1,
			...unpaidLiabilities.plan_2,
			...unpaidInterest.plan_1,
			...unpaidInterest.plan_2
		],
		(d) => new Date(d.x)
	);

	$: {
		xExtent[1] = new Date(xExtent[1].getFullYear() + 1, 0, 1);
	}

	const yExtent1 = [0, Math.max(...combinedData.map((d) => d.y1 + d.y2))];

	let height = 350;
	let margin = { top: 20, right: 50, bottom: 40, left: 50 };
	let innerHeight = height - margin.top - margin.bottom;
	$: innerWidth = width - margin.left - margin.right;

	$: xScale = scaleTime().range([0, innerWidth]);
	$: yScale1 = scaleLinear().range([innerHeight, margin.bottom]);

	$: {
		xScale.range([0, innerWidth]);
		yScale1.range([innerHeight, 0]);

		xScale.domain(xExtent);
		yScale1.domain(yExtent1);
	}

	function setTween(key) {
		let newPoints1 = unpaidLiabilities[key];
		let newPoints2 = unpaidInterest[key];
		let newCombinedData = createCombinedData(newPoints1, newPoints2);
		tweenedCombinedData.set(newCombinedData);
	}

	$: {
		setTween(selectedKey);
	}

	$: areaGenerator = area()
		.x((d) => xScale(new Date(d.data.x)))
		.y0((d) => yScale1(d[0]))
		.y1((d) => yScale1(d[1]))
		.curve(curveCardinal.tension(0.9));

	$: yTicks1 = yScale1.ticks(5);
	$: xTicks = xScale.ticks(5);
	$: xTicks = xScale ? xScale.ticks(10) : [];

	$: {
		xTicks = xTicks.filter((tick) => tick.getFullYear() !== xExtent[1].getFullYear());
		xTicks.push(xExtent[1]);
	}

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
		unpaidLiabilities[selectedKey].filter((d) => new Date(d.x) >= date)[0]?.y;
	const getYValue2 = (date) =>
		unpaidInterest[selectedKey].filter((d) => new Date(d.x) >= date)[0]?.y;

	function getNextYear(date) {
		let newDate = new Date(date);
		newDate.setDate(newDate.getDate() + 1);
		return newDate;
	}
</script>

<p class="font-bold text-xl mt-10">Unpaid Interest</p>

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
			Unfunded Liabilities from Other Sources: {format('$,.3s')(getYValue1(hoveredDate)).replace(
				'G',
				' B'
			)} <br />
			<span
				style="width: 9px;
			height: 9px;
			display: inline-block;
			border-radius: 50%;background: {color2};"
			/>
			Unpaid Interest on Unfunded Liabilities: {format('$,.3s')(getYValue2(hoveredDate)).replace(
				'G',
				' B'
			)}
		</div>
	{/if}
	<div class="chart" bind:clientWidth={width}>
		<svg {width} {height}>
			<g transform="translate({(width - 550) / 2}, 0)">
				<svg class="legend font-sansSerif" width="550" height="20">
					<g>
						<circle cx="5" cy="5" r="4.5" fill={color1} />
						<text x="14" y="10" font-size="0.8rem">Unfunded Liabilities from Other Sources</text>
					</g>
					<g transform="translate(270)">
						<circle cx="5" cy="5" r="4.5" fill={color2} />
						<text x="14" y="10" font-size="0.8rem">Unpaid Interest on Unfunded Liabilities</text>
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
						text={format('$,.2s')(tick).replace('G', ' B')}
						width={innerWidth}
					/>
				{/each}
				{#if $tweenedCombinedData}
					<path
						d={areaGenerator(stackedData[0])}
						stroke={color1}
						stroke-width="2"
						fill={color1}
						opacity="0.85"
					/>
					<path
						d={areaGenerator(stackedData[1])}
						stroke={color2}
						stroke-width="2"
						fill={color2}
						opacity="0.85"
					/>
				{/if}

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
					data1={unpaidLiabilities}
					data2={unpaidInterest}
					{color1}
					{color2}
					{selectedKey}
					bind:hoveredDate
					{tooltipData}
				/>
			</g>
		</svg>
	</div>
</div>

<style>
	.chart {
		position: relative;
	}

	.tooltip {
		background: white;
		border: 1px solid black;
		padding: 5px;
		pointer-events: none;
		z-index: 999;
		/* transition: top 300ms ease, left 300ms ease; */
		min-width: 50px;
		max-width: 200px;
	}
</style>
