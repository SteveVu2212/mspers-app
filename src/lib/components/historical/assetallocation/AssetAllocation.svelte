<script>
	export let width;
	import { onMount } from 'svelte';
	import { tweened } from 'svelte/motion';
	import { linear } from 'svelte/easing';
	import { scaleLinear, scaleTime } from 'd3-scale';
	import { extent } from 'd3-array';
	import { area, stack } from 'd3-shape';
	import { format } from 'd3-format';
	import { timeFormat, timeParse } from 'd3-time-format';
	import * as easings from 'svelte/easing';

	import Axis from '$lib/components/historical/assetallocation/Axis.svelte';
	import indexedFixedIncome from '$lib/data/AssetAllocation/fixedIncome.js';
	import indexedPublicEquities from '$lib/data/AssetAllocation/publicEquities.js';
	import indexedPrivateEquity from '$lib/data/AssetAllocation/privateEquity.js';
	import indexedAlternatives from '$lib/data/AssetAllocation/alternatives.js';
	import indexedRealEstate from '$lib/data/AssetAllocation/realEstate.js';
	import indexedCash from '$lib/data/AssetAllocation/cash.js';
	import HoverEvents from '$lib/components/historical/assetallocation/HoverEvents.svelte';

	let color1 = '#ff6633';
	let color2 = '#2879cb';
	let color3 = '#2e3745';
	let color4 = '#f6b941';
	let color5 = '#7a8ca9';
	let color6 = '#d3d3d3';

	let selectedKey = 'plan_1';
	// function switchKey() {
	// 	selectedKey = selectedKey === 'plan_1' ? 'plan_2' : 'plan_1';
	// }

	let points1 = indexedFixedIncome[selectedKey];
	let points2 = indexedPublicEquities[selectedKey];
	let points3 = indexedPrivateEquity[selectedKey];
	let points4 = indexedAlternatives[selectedKey];
	let points5 = indexedRealEstate[selectedKey];
	let points6 = indexedCash[selectedKey];

	const createCombinedData = (data1, data2, data3, data4, data5, data6) => {
		return data1.map((point1, index) => {
			return {
				x: point1.x,
				y1: point1.y,
				y2: data2[index].y,
				y3: data3[index].y,
				y4: data4[index].y,
				y5: data5[index].y,
				y6: data6[index].y
			};
		});
	};

	let combinedData = createCombinedData(points1, points2, points3, points4, points5, points6);

	$: stackedData = stack().keys(['y1', 'y2', 'y3', 'y4', 'y5', 'y6'])(combinedData);

	const tweenedCombinedData = tweened(combinedData, {
		delay: 0,
		duration: 400,
		easing: easings.easeCubicOut
	});

	$: {
		setTween(selectedKey);
	}

	$: areaGenerator = area()
		.x((d) => xScale(new Date(d.data.x)))
		.y0((d) => yScale1(d[0]))
		.y1((d) => yScale1(d[1]));

	// Update the d attribute of the path elements
	$: {
		tweenedCombinedData.subscribe(($tweenedCombinedData) => {
			stackedData = stack().keys(['y1', 'y2', 'y3', 'y4', 'y5', 'y6'])($tweenedCombinedData);
		});
	}

	const xExtent = extent(
		[
			...indexedFixedIncome.plan_1,
			...indexedFixedIncome.plan_2,
			...indexedPublicEquities.plan_1,
			...indexedPublicEquities.plan_2,
			...indexedPrivateEquity.plan_1,
			...indexedPrivateEquity.plan_2,
			...indexedAlternatives.plan_1,
			...indexedAlternatives.plan_2,
			...indexedRealEstate.plan_1,
			...indexedRealEstate.plan_2,
			...indexedCash.plan_1,
			...indexedCash.plan_2
		],
		(d) => new Date(d.x)
	);

	$: {
		xExtent[1] = new Date(xExtent[1].getFullYear() + 1, 0, 1);
	}

	const yExtent1 = [
		0,
		Math.max(...combinedData.map((d) => d.y1 + d.y2 + d.y3 + d.y4 + d.y5 + d.y6))
	];

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
		let newPoints1 = indexedFixedIncome[key];
		let newPoints2 = indexedPublicEquities[key];
		let newPoints3 = indexedPrivateEquity[key];
		let newPoints4 = indexedAlternatives[key];
		let newPoints5 = indexedRealEstate[key];
		let newPoints6 = indexedCash[key];
		let newCombinedData = createCombinedData(
			newPoints1,
			newPoints2,
			newPoints3,
			newPoints4,
			newPoints5,
			newPoints6
		);
		tweenedCombinedData.set(newCombinedData);
	}

	$: {
		setTween(selectedKey);
	}

	$: areaGenerator = area()
		.x((d) => xScale(new Date(d.data.x)))
		.y0((d) => yScale1(d[0]))
		.y1((d) => yScale1(d[1]));

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
		indexedFixedIncome[selectedKey].filter((d) => new Date(d.x) >= date)[0]?.y;
	const getYValue2 = (date) =>
		indexedPublicEquities[selectedKey].filter((d) => new Date(d.x) >= date)[0]?.y;
	const getYValue3 = (date) =>
		indexedPrivateEquity[selectedKey].filter((d) => new Date(d.x) >= date)[0]?.y;
	const getYValue4 = (date) =>
		indexedAlternatives[selectedKey].filter((d) => new Date(d.x) >= date)[0]?.y;
	const getYValue5 = (date) =>
		indexedRealEstate[selectedKey].filter((d) => new Date(d.x) >= date)[0]?.y;
	const getYValue6 = (date) => indexedCash[selectedKey].filter((d) => new Date(d.x) >= date)[0]?.y;

	function getNextYear(date) {
		let newDate = new Date(date);
		newDate.setDate(newDate.getDate() + 1);
		return newDate;
	}
</script>

<!-- Button to active switchKey -->
<!-- <button on:click={switchKey}>Switch</button> -->
<p class="font-bold text-xl mt-10">Asset Allocation</p>
<ul class="list-disc px-10 mb-4">
	<li class="py-1">
		<span class="text-reasonOrange font-bold">Fixed Income:</span> Government securities, corporate bonds,
		mortgage-backed securities, asset backed securities, etc.
	</li>
	<li class="py-1">
		<span class="text-reasonBlue font-bold">Public Equities:</span> Publicly reported and traded stocks.
	</li>
	<li class="py-1">
		<span class="text-reasonDarkBlue font-bold">Private Equity:</span> Investments in funds managed by
		private firms such as Blackrock, StateStreet, and The Vanguard Group.
	</li>
	<li class="py-1">
		<span class="text-reasonYellow font-bold">Other Alternatives:</span> Hedge funds, commodities, and
		other investments.
	</li>
	<li class="py-1">
		<span class="text-[#7a8ca9] font-bold">Real Estate:</span> Investments in REITs and other real estate
		funds.
	</li>
	<li class="py-1">
		<span class="text-reasonGray font-bold">Cash:</span> Cash and cash equivalents.
	</li>
</ul>

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
			Fixed Income: {format('.1%')(getYValue1(hoveredDate))} <br />
			<span
				style="width: 9px;
			height: 9px;
			display: inline-block;
			border-radius: 50%;background: {color2};"
			/>
			Public Equities: {format('.1%')(getYValue2(hoveredDate))} <br />
			<span
				style="width: 9px;
			height: 9px;
			display: inline-block;
			border-radius: 50%;background: {color3};"
			/>
			Private Equity: {format('.1%')(getYValue3(hoveredDate))} <br />
			<span
				style="width: 9px;
			height: 9px;
			display: inline-block;
			border-radius: 50%;background: {color4};"
			/>
			Other Alternatives: {format('.1%')(getYValue4(hoveredDate))}<br />
			<span
				style="width: 9px;
			height: 9px;
			display: inline-block;
			border-radius: 50%;background: {color5};"
			/>
			Real Estate: {format('.1%')(getYValue5(hoveredDate))}<br />
			<span
				style="width: 9px;
			height: 9px;
			display: inline-block;
			border-radius: 50%;background: {color6};"
			/>
			Cash: {format('.1%')(getYValue6(hoveredDate))}
		</div>
	{/if}

	<div class="chart" bind:clientWidth={width}>
		<svg {width} {height}>
			<g transform="translate({(width - 450) / 2}, 0)">
				<svg class="legend font-sansSerif" width="600" height="20">
					<g>
						<circle cx="5" cy="5" r="4.5" fill={color1} />
						<text x="14" y="9" font-size="0.8rem">Fixed Income</text>
					</g>
					<g transform="translate(110)">
						<circle cx="5" cy="5" r="4.5" fill={color2} />
						<text x="14" y="9" font-size="0.8rem">Public Equities</text>
					</g>
					<g transform="translate(230)">
						<circle cx="5" cy="5" r="4.5" fill={color3} />
						<text x="14" y="9" font-size="0.8rem">Private Equity</text>
					</g>
					<g transform="translate(350)">
						<circle cx="5" cy="5" r="4.5" fill={color4} />
						<text x="14" y="9" font-size="0.8rem">Other Alternatives</text>
					</g>
				</svg>
			</g>
			<g transform="translate({(width - 200) / 2}, 20)">
				<svg class="legend font-sansSerif" width="450" height="20">
					<g>
						<circle cx="5" cy="5" r="4.5" fill={color5} />
						<text x="14" y="9" font-size="0.8rem">Real Estate</text>
					</g>
					<g transform="translate(110)">
						<circle cx="5" cy="5" r="4.5" fill={color6} />
						<text x="14" y="9" font-size="0.8rem">Cash</text>
					</g>
				</svg>
			</g>
			<g transform="translate({margin.left} {margin.top + 20})">
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
				{#if $tweenedCombinedData && stackedData[0] && stackedData[1] && stackedData[2] && stackedData[3]}
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
					<path
						d={areaGenerator(stackedData[2])}
						stroke={color3}
						stroke-width="2"
						fill={color3}
						opacity="0.85"
					/>
					<path
						d={areaGenerator(stackedData[3])}
						stroke={color4}
						stroke-width="2"
						fill={color4}
						opacity="0.85"
					/>
					<path
						d={areaGenerator(stackedData[4])}
						stroke={color5}
						stroke-width="2"
						fill={color5}
						opacity="0.85"
					/>
					<path
						d={areaGenerator(stackedData[5])}
						stroke={color6}
						stroke-width="2"
						fill={color6}
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
					data1={indexedFixedIncome}
					data2={indexedPublicEquities}
					data3={indexedPrivateEquity}
					data4={indexedAlternatives}
					data5={indexedRealEstate}
					data6={indexedCash}
					{color1}
					{color2}
					{color3}
					{color4}
					{color5}
					{color6}
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
	}

	.switch-button {
		background-color: #c60000;
		color: white;
		padding: 5px 10px;
		border-radius: 5px;
		border: none;
		font-size: 0.9rem;
		cursor: pointer;
	}
</style>
