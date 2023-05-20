<script>
	export let labels = [];
	export let xScale;
	export let height;
	export let margin;

	let xAxisYPosition = 0;
</script>

<g transform="translate(0, {height - margin.bottom})">
	{#each labels as label, i}
		<text x={xScale(label) + xScale.bandwidth() / 2} y="20" text-anchor="middle" font-size="12">
			{#if label.length > 10}
				<tspan x={xScale(label) + xScale.bandwidth() / 2}>{label.slice(0, 10)}</tspan>
				<tspan x={xScale(label) + xScale.bandwidth() / 2} dy="1.2em">{label.slice(10)}</tspan>
			{:else}
				<tspan>{label}</tspan>
			{/if}
		</text>
	{/each}
</g>
