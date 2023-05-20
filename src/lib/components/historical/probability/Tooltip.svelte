<script>
	export let width;
	export let data;
	export let colorScale;

	import { fly, fade } from 'svelte/transition';
	import { format } from 'd3-format';

	let tooltipWidth;

	const xNudge = 5;
	const yNudge = 5;

	// If the x position + the tooltip width exceeds the chart width, offset backward to prevent overflow
	$: xPosition =
		data.x + tooltipWidth + xNudge + 100 > width ? data.x - tooltipWidth - xNudge : data.x + xNudge;
	$: yPosition = data.y + yNudge;
</script>

<div
	class="tooltip shadow-lg"
	in:fly={{ y: 10, duration: 200 }}
	out:fade
	style="left:{xPosition + 120}px; top:{yPosition + 40}px;"
	bind:clientWidth={tooltipWidth}
>
	<!-- Country name -->
	<h1>
		{data.name}
	</h1>
	<!-- Additional info under the country name -->
	<div class="info">
		{format(',.0f')(data.staff)} -
		{format('.1%')(data.growth)}
	</div>
</div>

<style>
	.tooltip {
		position: absolute;
		padding: 4px;
		background: white;
		border: 1px solid #d3d3d3;
		pointer-events: none;
		min-width: 100px;
		transition: top 200ms ease, left 200ms ease;
	}

	h1 {
		margin: 0;
		font-size: 1rem;
		font-weight: 500;
		margin-bottom: 3px;
	}

	.info {
		display: flex;
		justify-content: space-between;
		column-gap: 8px;
	}

	.score {
		font-size: 0.8rem;
	}

	.continent {
		font-size: 0.65rem;
		padding: 3px 4px 2px 4px;
		border-radius: 3px;
		text-transform: uppercase;
		white-space: nowrap;
	}

	.bar {
		position: absolute;
		bottom: 0;
		left: 0;
		height: 3px;
		width: 100%;
	}

	.bar.background {
		background: #eee;
	}
</style>
