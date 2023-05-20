<script>
	import { format } from 'd3-format';

	export let xScale;
	export let width;
	export let height;

	$: ticks = xScale.ticks(10);
</script>

<g class="axis x">
	{#each ticks as tick}
		<g class="tick" transform="translate({xScale(tick)}, 0)">
			<text x="-10" y={height + 15}>{format('.0%')(tick)}</text>
			<line x1="0" x2="0" y1="0" y2={height} stroke="hsla(215, 15%, 91%, 1)" />
		</g>
	{/each}
	<text
		class="axis-title"
		x={width}
		y={height}
		dy="-15"
		dominant-baseline="hanging"
		text-anchor="end"
	>
		% change
	</text>
</g>

<style>
	.axis.x {
		font-size: 0.8rem;
	}
</style>
