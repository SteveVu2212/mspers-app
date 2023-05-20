<script>
	export let labels = [];
	export let yScale;
	export let height;
	export let margin;

	let yAxisXPosition = 0;
</script>

<g transform="translate({yAxisXPosition}, 0)">
	{#each labels as label, i}
		<text x="-5" y={yScale(Number(label))} text-anchor="end" dy=".32em">
			{label}
		</text>
	{/each}
</g>
