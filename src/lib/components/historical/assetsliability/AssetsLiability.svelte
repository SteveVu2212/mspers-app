<script>
	export let width;
	import { onMount } from 'svelte';
	import { tweened } from 'svelte/motion';
	import { linear } from 'svelte/easing';
	import { scaleLinear, scaleTime } from 'd3-scale';
	import { extent } from 'd3-array';
	import { line, area, curveCardinal } from 'd3-shape';
	import { format } from 'd3-format';
	import { timeFormat, timeParse } from 'd3-time-format';
	import * as easings from 'svelte/easing';

	import Axis from '$lib/components/historical/assetsliability/Axis.svelte';
	import liabilityData from '$lib/data/AssetsLiability/liabilities.js';
	import assetsData from '$lib/data/AssetsLiability/assets.js';
	import HoverEvents from '$lib/components/historical/assetsliability/HoverEvents.svelte';

	let color1 = '#c60000';
	let color2 = '#379070';

	$: selectedKey = 'actuarial';

	function switchKey() {
		selectedKey = selectedKey === 'market' ? 'actuarial' : 'market';
	}

	let points1 = liabilityData[selectedKey];
	let points2 = assetsData[selectedKey];

	const tweenedPoints1 = tweened(points1, {
		delay: 0,
		duration: 500,
		easing: easings.easeCubicOut
	});

	const tweenedPoints2 = tweened(points2, {
		delay: 0,
		duration: 500,
		easing: easings.easeCubicOut
	});

	const xExtent = extent(
		[
			...liabilityData.market,
			...liabilityData.actuarial,
			...assetsData.market,
			...assetsData.actuarial
		],
		(d) => new Date(d.x)
	);

	$: {
		xExtent[1] = new Date(xExtent[1].getFullYear() + 1, 0, 1);
	}

	const yExtent1 = [
		0,
		extent([...liabilityData.market, ...liabilityData.actuarial], (d) => d.y)[1]
	];

	const yExtent2 = [0, extent([...assetsData.market, ...assetsData.actuarial], (d) => d.y)[1]];

	// let containerWidth;
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
		tweenedPoints1.set(liabilityData[key]);
	}

	function setTween2(key) {
		tweenedPoints2.set(assetsData[key]);
	}

	$: {
		setTween1(selectedKey);
		setTween2(selectedKey);
	}

	$: lineGenerator1 = line()
		.x((d) => xScale(new Date(d.x)))
		.y((d) => yScale1(d.y))
		.curve(curveCardinal.tension(0.9));

	$: lineGenerator2 = line()
		.x((d) => xScale(new Date(d.x)))
		.y((d) => yScale1(d.y))
		.curve(curveCardinal.tension(0.9));

	$: areaGenerator = area()
		.x((d) => xScale(new Date(d.x)))
		.y0((d) => yScale1(d.y1))
		.y1((d) => yScale1(d.y2))
		.curve(curveCardinal.tension(0.9));

	$: combinedPoints = $tweenedPoints1.map((point1, index) => ({
		x: point1.x,
		y1: point1.y,
		y2: $tweenedPoints2[index].y
	}));

	$: yTicks1 = yScale1.ticks(5);
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
		liabilityData[selectedKey].filter((d) => new Date(d.x) >= date)[0]?.y;
	const getYValue2 = (date) => assetsData[selectedKey].filter((d) => new Date(d.x) >= date)[0]?.y;

	function getNextYear(date) {
		let newDate = new Date(date);
		newDate.setDate(newDate.getDate() + 1);
		return newDate;
	}
</script>

<div class="col-start-1 col-end-3 mb-3">
	<ul class="grid gap-0 md:grid-cols-6">
		<li />
		<li />
		<li />
		<li />
		<li>
			<input
				type="radio"
				id="market-al"
				checked={selectedKey === 'market'}
				on:change={switchKey}
				name="amount"
				value="market"
				class="hidden peer"
			/>
			<label
				for="market-al"
				class="inline-flex items-center justify-between w-full p-2 rounded-l-xl text-gray-700 border border-gray-200 cursor-pointer {selectedKey ===
				'market'
					? 'bg-gray-200 text-gray-600'
					: ''} hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
			>
				<div class="w-full text-center text-md font-semibold">Market</div>
			</label>
		</li>
		<li>
			<input
				type="radio"
				id="actuarial-al"
				checked={selectedKey === 'actuarial'}
				on:change={switchKey}
				name="amount"
				value="actuarial"
				class="hidden peer"
			/>
			<label
				for="actuarial-al"
				class="inline-flex items-center justify-between w-full p-2 rounded-r-xl text-gray-700 border border-gray-200 cursor-pointer {selectedKey ===
				'actuarial'
					? 'bg-gray-200 text-gray-600'
					: ''} hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
			>
				<div class="w-full text-center text-md font-semibold">Actuarial</div>
			</label>
		</li>
	</ul>
</div>

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
			Actuarial Accrued Liability: {format('$,.5s')(getYValue1(hoveredDate)).replace('G', ' B')}
			<br />
			<span
				style="width: 9px;
			height: 9px;
			display: inline-block;
			border-radius: 50%;background: {color2};"
			/>
			({selectedKey.slice(0, 1).toUpperCase() + selectedKey.slice(1)}) Value of Assets: {format(
				'$,.5s'
			)(getYValue2(hoveredDate)).replace('G', ' B')}
		</div>
	{/if}
	<div class="chart" bind:clientWidth={width}>
		<svg {width} {height}>
			<g transform="translate({(width - 350) / 2}, 0)">
				<svg class="legend font-sansSerif" width="450" height="20">
					<g>
						<circle cx="5" cy="5" r="4.5" fill={color1} />
						<text x="14" y="10" font-size="0.8rem">Actuarial Accrued Liability</text>
					</g>
					<g transform="translate(190)">
						<circle cx="5" cy="5" r="4.5" fill={color2} />
						<text x="14" y="10" font-size="0.8rem"
							>({selectedKey.slice(0, 1).toUpperCase() + selectedKey.slice(1)}) Value of Assets</text
						>
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
				<path d={lineGenerator1($tweenedPoints1)} stroke={color1} stroke-width="3" fill="none" />
				<path d={lineGenerator2($tweenedPoints2)} stroke={color2} stroke-width="3" fill="none" />
				<path d={areaGenerator(combinedPoints)} fill="rgba(128, 128, 128, 0.2)" />

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
					data1={liabilityData}
					data2={assetsData}
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
