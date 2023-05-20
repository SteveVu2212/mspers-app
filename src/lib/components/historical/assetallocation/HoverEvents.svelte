<script>
	export let xScale;
	export let yScale1;
	export let margin;
	export let width;
	export let height;
	export let hoveredDate;
	export let maxDate;
	export let data1;
	export let data2;
	export let data3;
	export let data4;
	export let data5;
	export let data6;
	export let selectedKey;
	export let color1;
	export let color2;
	export let color3;
	export let color4;
	export let color5;
	export let color6;
	export let tooltipData;

	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';

	const dates = data1[selectedKey].concat(data2[selectedKey]).map((d) => new Date(d.x));

	const closestDate = function (target, dates) {
		return dates.reduce((prev, curr) =>
			Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev
		);
	};

	const handleMousemove = function (e) {
		const mouseXDate = xScale.invert(e.offsetX - margin.left);
		hoveredDate = closestDate(mouseXDate, dates);
		console.log('tooltipData:', tooltipData); // Add this line
	};

	const handleMouseleave = function () {
		hoveredDate = maxDate;
	};

	let getYValue1 = (date) => data1[selectedKey].filter((d) => new Date(d.x) >= date)[0]?.y;

	let getYValue2 = (date) => {
		const value1 = data1[selectedKey].filter((d) => new Date(d.x) >= date)[0]?.y || 0;
		const value2 = data2[selectedKey].filter((d) => new Date(d.x) >= date)[0]?.y || 0;
		return value1 + value2;
	};

	let getYValue3 = (date) => {
		const value1 = data1[selectedKey].filter((d) => new Date(d.x) >= date)[0]?.y || 0;
		const value2 = data2[selectedKey].filter((d) => new Date(d.x) >= date)[0]?.y || 0;
		const value3 = data3[selectedKey].filter((d) => new Date(d.x) >= date)[0]?.y || 0;
		return value1 + value2 + value3;
	};

	let getYValue4 = (date) => {
		const value1 = data1[selectedKey].filter((d) => new Date(d.x) >= date)[0]?.y || 0;
		const value2 = data2[selectedKey].filter((d) => new Date(d.x) >= date)[0]?.y || 0;
		const value3 = data3[selectedKey].filter((d) => new Date(d.x) >= date)[0]?.y || 0;
		const value4 = data4[selectedKey].filter((d) => new Date(d.x) >= date)[0]?.y || 0;
		return value1 + value2 + value3 + value4;
	};

	let getYValue5 = (date) => {
		const value1 = data1[selectedKey].filter((d) => new Date(d.x) >= date)[0]?.y || 0;
		const value2 = data2[selectedKey].filter((d) => new Date(d.x) >= date)[0]?.y || 0;
		const value3 = data3[selectedKey].filter((d) => new Date(d.x) >= date)[0]?.y || 0;
		const value4 = data4[selectedKey].filter((d) => new Date(d.x) >= date)[0]?.y || 0;
		const value5 = data5[selectedKey].filter((d) => new Date(d.x) >= date)[0]?.y || 0;
		return value1 + value2 + value3 + value4 + value5;
	};

	let getYValue6 = (date) => {
		const value1 = data1[selectedKey].filter((d) => new Date(d.x) >= date)[0]?.y || 0;
		const value2 = data2[selectedKey].filter((d) => new Date(d.x) >= date)[0]?.y || 0;
		const value3 = data3[selectedKey].filter((d) => new Date(d.x) >= date)[0]?.y || 0;
		const value4 = data4[selectedKey].filter((d) => new Date(d.x) >= date)[0]?.y || 0;
		const value5 = data5[selectedKey].filter((d) => new Date(d.x) >= date)[0]?.y || 0;
		const value6 = data6[selectedKey].filter((d) => new Date(d.x) >= date)[0]?.y || 0;
		return value1 + value2 + value3 + value4 + value5 + value6;
	};

	let xPositionTween = tweened(xScale(hoveredDate), { duration: 200, easing: cubicOut });

	let y1PositionTween = tweened(yScale1(getYValue1(hoveredDate)), {
		duration: 300,
		easing: cubicOut
	});

	let y2PositionTween = tweened(yScale1(getYValue2(hoveredDate)), {
		duration: 300,
		easing: cubicOut
	});

	let y3PositionTween = tweened(yScale1(getYValue3(hoveredDate)), {
		duration: 300,
		easing: cubicOut
	});

	let y4PositionTween = tweened(yScale1(getYValue4(hoveredDate)), {
		duration: 300,
		easing: cubicOut
	});

	let y5PositionTween = tweened(yScale1(getYValue5(hoveredDate)), {
		duration: 300,
		easing: cubicOut
	});

	let y6PositionTween = tweened(yScale1(getYValue6(hoveredDate)), {
		duration: 300,
		easing: cubicOut
	});

	let xCirclePositionTween = tweened(xScale(hoveredDate), { duration: 300, easing: cubicOut });

	$: {
		xCirclePositionTween.set(xScale(hoveredDate));
		xPositionTween.set(xScale(hoveredDate));
		y1PositionTween.set(yScale1(getYValue1(hoveredDate)));
		y2PositionTween.set(yScale1(getYValue2(hoveredDate)));
		y3PositionTween.set(yScale1(getYValue3(hoveredDate)));
		y4PositionTween.set(yScale1(getYValue4(hoveredDate)));
		y5PositionTween.set(yScale1(getYValue5(hoveredDate)));
		y6PositionTween.set(yScale1(getYValue6(hoveredDate)));
	}
</script>

<rect
	class="hover-listener"
	fill="transparent"
	{width}
	{height}
	on:mousemove={handleMousemove}
	on:mouseleave={handleMouseleave}
/>

{console.log($y2PositionTween)}

{#if tooltipData}
	<line
		x1={$xPositionTween}
		x2={$xPositionTween}
		y1={0}
		y2={height}
		stroke="darkgrey"
		stroke-width="3"
		opacity="0.5"
		pointer-events="none"
	/>

	<circle
		cx={$xCirclePositionTween}
		cy={$y1PositionTween}
		r="4"
		fill={color1}
		stroke="#f0f0f0"
		pointer-events="none"
	/>

	<circle
		cx={$xCirclePositionTween}
		cy={$y2PositionTween}
		r="4"
		fill={color2}
		stroke="#f0f0f0"
		pointer-events="none"
	/>

	<circle
		cx={$xCirclePositionTween}
		cy={$y3PositionTween}
		r="4"
		fill={color3}
		stroke="#f0f0f0"
		pointer-events="none"
	/>

	<circle
		cx={$xCirclePositionTween}
		cy={$y4PositionTween}
		r="4"
		fill={color4}
		stroke="#f0f0f0"
		pointer-events="none"
	/>

	<circle
		cx={$xCirclePositionTween}
		cy={$y5PositionTween}
		r="4"
		fill={color5}
		stroke="#f0f0f0"
		pointer-events="none"
	/>

	<circle
		cx={$xCirclePositionTween}
		cy={$y6PositionTween}
		r="4"
		fill={color6}
		stroke="#f0f0f0"
		pointer-events="none"
	/>
{/if}

<style>
	rect {
		cursor: crosshair;
	}
</style>
