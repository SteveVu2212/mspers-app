<script>
	export let width;
	export let height;
	export let selectedKey1 = 'scenario_a';
	export let selectedKey2 = 'scenario_b';
	export let selectedKey3 = 'scenario_c';
	export let selectedKey4 = 'scenario_d';
	export let checkboxOne;
	export let checkboxTwo;
	export let checkboxThree;
	export let checkboxFour;

	import { onMount } from 'svelte';
	import { tweened } from 'svelte/motion';
	import { linear } from 'svelte/easing';
	import { scaleLinear, scaleTime } from 'd3-scale';
	import { extent } from 'd3-array';
	import { line, area } from 'd3-shape';
	import { format } from 'd3-format';
	import { timeFormat, timeParse } from 'd3-time-format';
	import * as easings from 'svelte/easing';

	import Axis from '$lib/components/benefits/chart1//Axis.svelte';
	import benefitsData from '$lib/data/Benefit/attrition_indexed.js';
	import HoverEvents from '$lib/components/benefits/chart1/HoverEvents.svelte';

	let color1 = '#ff6633';
	let color2 = '#2879cb';
	let color3 = '#2e3745';
	let color4 = '#f6b941';

	$: if (height) {
		innerHeight = height - margin.top - margin.bottom;
	}

	let points1 = benefitsData[selectedKey1];
	let points2 = benefitsData[selectedKey2];
	let points3 = benefitsData[selectedKey3];
	let points4 = benefitsData[selectedKey4];

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

	const tweenedPoints4 = tweened(points4, {
		delay: 0,
		duration: 400,
		easing: easings.easeCubicOut
	});

	const xExtent = extent(
		[
			...benefitsData[selectedKey1],
			...benefitsData[selectedKey2],
			...benefitsData[selectedKey3],
			...benefitsData[selectedKey4]
		],
		(d) => d.x
	);

	const yExtent1 = [
		0,
		extent(
			[
				...benefitsData[selectedKey1],
				...benefitsData[selectedKey2],
				...benefitsData[selectedKey3],
				...benefitsData[selectedKey4]
			],
			(d) => d.y
		)[1]
	];

	let margin = { top: 20, right: 50, bottom: 40, left: 50 };
	$: innerHeight = height - margin.top - margin.bottom;
	$: innerWidth = width - margin.left - margin.right;

	// Initialize the scales before using them
	$: xScale = scaleLinear().range([0, innerWidth]);
	$: yScale1 = scaleLinear().range([innerHeight, margin.bottom]);

	$: {
		// Update the scales in a reactive statement
		xScale.range([0, innerWidth]);
		yScale1.range([innerHeight, 0]);

		xScale.domain(xExtent);
		yScale1.domain([0, 1]);
	}

	function setTween1(key) {
		tweenedPoints1.set(benefitsData[key]);
	}

	function setTween2(key) {
		tweenedPoints2.set(benefitsData[key]);
	}

	function setTween3(key) {
		tweenedPoints3.set(benefitsData[key]);
	}

	function setTween4(key) {
		tweenedPoints4.set(benefitsData[key]);
	}

	$: {
		setTween1(selectedKey1);
		setTween2(selectedKey2);
		setTween3(selectedKey3);
		setTween4(selectedKey4);
	}

	$: lineGenerator = line()
		.x((d) => xScale(d.x))
		.y((d) => yScale1(d.y));

	$: yTicks1 = yScale1.ticks(5);
	$: xTicks = xScale.ticks(5);

	const minDate = xExtent[0];
	const maxDate = xExtent[1];

	let hoveredDate = maxDate;

	// Tooltip
	let m = { x: 0, y: 0 };

	function handleMousemove(event) {
		m.x = event.clientX;
		m.y = event.clientY;
	}

	let tooltipData = false;

	const getYValue1 = (date) => benefitsData[selectedKey1].filter((d) => d.x >= date)[0]?.y;
	const getYValue2 = (date) => benefitsData[selectedKey2].filter((d) => d.x >= date)[0]?.y;
	const getYValue3 = (date) => benefitsData[selectedKey3].filter((d) => d.x >= date)[0]?.y;
	const getYValue4 = (date) => benefitsData[selectedKey4].filter((d) => d.x >= date)[0]?.y;

	// function getNextYear(date) {
	// 	let newDate = new Date(date);
	// 	newDate.setDate(newDate.getDate() + 1);
	// 	return newDate;
	// }

	$: console.log('benefitsData', benefitsData);
</script>

<div
	on:mousemove={handleMousemove}
	on:mouseover={() => {
		tooltipData = true;
	}}
	on:mouseleave={() => {
		tooltipData = false;
	}}
>
	{#if tooltipData}
		<div
			class="tooltip bg-white border border-gray-300 p-2 shadow rounded text-sm"
			style="position: fixed; top:{m.y - 5}px; left:{m.x + 10}px;"
		>
			<span class="font-bold flex justify-center">Age: {hoveredDate}</span>
			<hr class="border border-t-2" />
			{#if checkboxOne}
				<span
					style="width: 9px;
					height: 9px;
					display: inline-block;
					border-radius: 50%;background: {color1};"
				/>
				Line 1: {format('.1%')(getYValue1(hoveredDate))}<br />
			{/if}
			{#if checkboxTwo}
				<span
					style="width: 9px;
					height: 9px;
					display: inline-block;
					border-radius: 50%;background: {color2};"
				/>
				Line 2: {format('.1%')(getYValue2(hoveredDate))}<br />
			{/if}
			{#if checkboxThree}
				<span
					style="width: 9px;
					height: 9px;
					display: inline-block;
					border-radius: 50%;background: {color3};"
				/>
				Line 3: {format('.1%')(getYValue3(hoveredDate))}<br />
			{/if}
			{#if checkboxFour}
				<span
					style="width: 9px;
			height: 9px;
			display: inline-block;
			border-radius: 50%;background: {color4};"
				/>
				Line 4: {format('.1%')(getYValue4(hoveredDate))}
			{/if}
		</div>
	{/if}
	<div class="chart" style="width: {width}px; height: {height}px;">
		<svg {width} {height}>
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
				{#if checkboxOne}
					<path d={lineGenerator($tweenedPoints1)} stroke={color1} stroke-width="3" fill="none" />
				{/if}
				{#if checkboxTwo}
					<path d={lineGenerator($tweenedPoints2)} stroke={color2} stroke-width="3" fill="none" />
				{/if}
				{#if checkboxThree}
					<path d={lineGenerator($tweenedPoints3)} stroke={color3} stroke-width="3" fill="none" />
				{/if}
				{#if checkboxFour}
					<path d={lineGenerator($tweenedPoints4)} stroke={color4} stroke-width="3" fill="none" />
				{/if}

				{#each xTicks as tick}
					<Axis
						{width}
						axisType="xAxis"
						translate="translate({xScale(tick)},0)"
						y1={yScale1(yExtent1[0]) + 5}
						y2={yScale1(yExtent1[0])}
						y={innerHeight + 20}
						text={width < 450
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
					data1={benefitsData}
					data2={benefitsData}
					data3={benefitsData}
					data4={benefitsData}
					{color1}
					{color2}
					{color3}
					{color4}
					{selectedKey1}
					{selectedKey2}
					{selectedKey3}
					{selectedKey4}
					{checkboxOne}
					{checkboxTwo}
					{checkboxThree}
					{checkboxFour}
					{tooltipData}
					bind:hoveredDate
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
	}
</style>
