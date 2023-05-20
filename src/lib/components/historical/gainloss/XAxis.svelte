<script>
	export let labels = [];
	export let xScale;
	export let height;
	export let margin;

	const maxLabelLength = 15;
</script>

<g transform="translate(0, {height - margin.bottom})">
	{#each labels as label, i}
		<foreignObject x={xScale(label)} y="10" width={xScale.bandwidth()} height="100">
			<div
				xmlns="http://www.w3.org/1999/xhtml"
				style="width: 100%; text-align: center; word-wrap: break-word;"
				class="text-xs"
			>
				{label}
			</div>
		</foreignObject>
	{/each}
</g>
