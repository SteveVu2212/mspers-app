<div class="legend">
	<p>
		<span style="background: gray" />
		iShares Core S&P 500 ETF (IVV)
	</p>
	<p>
		<span style="background: green" />
		iShares ESG Screened S&P 500 ETF (XVV)
	</p>
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
