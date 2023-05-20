<script>
	export let yScale;
	export let width;

	$: ticks = yScale.domain();
	import { fade } from 'svelte/transition';
</script>

<g class="axis y">
	{#each ticks as tick, index}
		<g class="tick" in:fade={{ delay: index * 100 }} out:fade={{ duration: 200 }}>
			<text x="-100" y={yScale(tick)}>{tick}</text>
			<line x1="0" x2={width} y1={yScale(tick)} y2={yScale(tick)} stroke="hsla(215, 15%, 91%, 1)" />
		</g>
	{/each}
</g>

<style>
	.axis.y {
		font-size: 0.7rem;
	}
</style>
