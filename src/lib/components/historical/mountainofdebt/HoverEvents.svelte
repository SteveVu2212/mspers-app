<script>
	export let xScale;
	export let yScale1;
	export let yScale2;
	export let margin;
	export let width;
	export let height;
	export let hoveredDate;
	export let maxDate;
	export let data1;
	export let data2;
	export let selectedKey;
	export let color1;
	export let color2;
	export let tooltipData;

	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';

	const dates = data1[selectedKey].map((d) => new Date(d.x));

	const closestDate = function (target, dates) {
		return dates.reduce((prev, curr) =>
			Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev
		);
	};

	const handleMousemove = function (e) {
		const mouseXDate = xScale.invert(e.offsetX - margin.left);
		hoveredDate = closestDate(mouseXDate, dates);
	};

	const handleMouseleave = function () {
		hoveredDate = maxDate;
	};

	let getYValue1 = (date) => data1[selectedKey].filter((d) => new Date(d.x) >= date)[0]?.y;
	let getYValue2 = (date) => data2[selectedKey].filter((d) => new Date(d.x) >= date)[0]?.y;

	let xPositionTween = tweened(xScale(hoveredDate), { duration: 200, easing: cubicOut });

	let y1PositionTween = tweened(yScale1(getYValue1(hoveredDate)), {
		duration: 300,
		easing: cubicOut
	});
	let y2PositionTween = tweened(yScale2(getYValue2(hoveredDate)), {
		duration: 300,
		easing: cubicOut
	});

	let xCirclePositionTween = tweened(xScale(hoveredDate), { duration: 300, easing: cubicOut });

	$: {
		xCirclePositionTween.set(xScale(hoveredDate));
		xPositionTween.set(xScale(hoveredDate));
		y1PositionTween.set(yScale1(getYValue1(hoveredDate)));
		y2PositionTween.set(yScale2(getYValue2(hoveredDate)));
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
{/if}
