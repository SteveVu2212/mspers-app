<script>
	export let colorScale;
	export let hoveredStaff;
</script>

<div class="legend" on:mouseleave={() => (hoveredStaff = null)}>
	{#each colorScale.domain() as name}
		<p
			class:unhovered={hoveredStaff && hoveredStaff !== name}
			on:mouseover={() => (hoveredStaff = name)}
		>
			<span style="background: {colorScale(name)}" />
			{name}
		</p>
	{/each}
</div>

<style>
	.legend {
		display: flex;
		place-items: center;
		justify-content: center;
		flex-direction: row;
		flex-wrap: wrap;
		column-gap: 10px;
		row-gap: 5px;
		margin-bottom: 0.25rem;
	}

	p {
		margin: 0;
		font-size: 0.8rem;
		cursor: pointer;
		transition: opacity 300ms ease;
		display: flex;
		place-items: center;
		column-gap: 3px;
	}

	p.unhovered {
		opacity: 0.3;
	}

	span {
		width: 9px;
		height: 9px;
		display: inline-block;
		border-radius: 50%;
	}
</style>
