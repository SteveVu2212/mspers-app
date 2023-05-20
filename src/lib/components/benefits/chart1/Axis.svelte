<script>
	export let axisType = 'xAxis';
	export let translate = 'translate(0, 0)';
	export let x = 0;
	export let x1 = 0;
	export let x2 = 0;
	export let y;
	export let y1;
	export let y2;
	export let text = '';
	export let width;
</script>

{#if axisType == 'xAxis'}
	<g class="tick" transform={translate}>
		<line {y1} {y2} />
		<text {y} style="font-size:{width < 750 ? '10px' : '12px'};fill:#82828;text-anchor:middle;"
			>{text}</text
		>
	</g>
{:else}
	<g class="tick" transform={translate}>
		<line
			{x1}
			{x2}
			style="stroke:{text === '$0.0' ? '#333' : '#82828'}; stroke-width: {text === '$0.0'
				? '1.5'
				: '1'};"
		/>
		<text {x} {y} dx="2" style="font-size:13px;fill:#82828;text-anchor:end;">{text}</text>
	</g>
{/if}

<style>
	.tick line {
		stroke: #a3a3a3;
		opacity: 0.4;
	}
</style>
