<script>
	import { onMount } from 'svelte';
	import TableOfContents from '$lib/components/TOC.svelte';
	import MountainOfDebt from '$lib/components/historical/mountainofdebt/MountainOfDebt.svelte';
	import AssetsLiability from '$lib/components/historical/assetsliability/AssetsLiability.svelte';
	import GainLoss from '$lib/components/historical/gainloss/GainLoss.svelte';
	import UnpaidInterest from '$lib/components/historical/unpaidinterest/UnpaidInterest.svelte';
	import AmortizationPayments from '$lib/components/historical/amortizationpayments/AmortizationPayments.svelte';
	import InvestmentReturns from '$lib/components/historical/InvestmentReturns/InvestmentReturns.svelte';
	// import InvestmentReturnsTable from '$lib/components/historical/InvestmentReturnsTable.svelte';
	import AssetAllocation from '$lib/components/historical/assetallocation/AssetAllocation.svelte';
	// import ProbabilityTable from '$lib/components/historical/ProbabilityTable.svelte';
	import Probability from '$lib/components/historical/Probability.svelte';

	// State and plan name
	let stateName = 'Ohio';
	let planName = 'STRS';

	// Mobile detection
	let isMobile = false;

	const updateIsMobile = () => {
		isMobile = window.matchMedia('(max-width: 800px)').matches;
	};

	let dynamicWidth;

	const handleResize = () => {
		dynamicWidth = window.innerWidth;
	};

	onMount(() => {
		updateIsMobile();
		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	});

	let title = 'Historical Analysis';
	let sections = [
		{
			id: 'section1',
			title: 'Funding Status',
			content: [
				{
					type: 'text',
					value:
						'The <b>funded ratio</b> is calculated by dividing the value of plan assets by liabilities. When “Actuarial Value” is selected the actuarially smoothed assets are used. When “Market Value” is selected the market value of those assets are used. The difference between plan assets and liabilities is the <b>unfunded accrued liability (UAL)</b>. Again, when “Actuarial Value” is selected the actuarially smoothed assets are used. When “Market Value” is selected the market value of those assets are used.'
				},
				{
					type: 'component',
					component: MountainOfDebt,
					props: {
						/* props for MountainOfDebt */
						width: dynamicWidth
					}
				},
				{
					type: 'text',
					value:
						'This chart also shows the difference between plan assets and liabilities–looking at the difference between those assets and liabilities (UAL).When “Actuarial Value” is selected the actuarially smoothed assets are used. When “Market Value” is selected the market value of those assets are used.'
				},
				{
					type: 'component',
					component: AssetsLiability,
					props: {
						/* props for AssetsLiability */
						width: dynamicWidth
					}
				}
			]
		},
		{
			id: 'section2',
			title: 'Pension Debt Drivers',
			content: [
				{
					type: 'component',
					component: GainLoss,
					props: {
						/* props for GainLoss */
						width: dynamicWidth
					}
				},
				{
					type: 'component',
					component: UnpaidInterest,
					props: {
						/* props for UnpaidInterest */
						width: dynamicWidth
					}
				},
				{
					type: 'component',
					component: AmortizationPayments,
					props: {
						/* props for AmortizationPayments */
						width: dynamicWidth
					}
				}
			]
		},
		{
			id: 'section3',
			title: 'Assets & Returns',
			content: [
				{
					type: 'component',
					component: InvestmentReturns,
					props: {
						/* props for InvestmentReturns */
						width: dynamicWidth
					}
				},
				{
					type: 'component',
					component: AssetAllocation,
					props: {
						/* props for AssetAllocation */
						width: dynamicWidth
					}
				}
				// {
				// 	type: 'component',
				// 	component: InvestmentReturnsTable,
				// 	props: {
				// 		/* props for InvestmentReturnsTable */
				// 	}
				// }
			]
		},
		{
			id: 'section4',
			title: 'Return Probability',
			content: [
				{
					type: 'component',
					component: Probability,
					props: {
						/* props for Probability */
						// width: dynamicWidth
					}
				}
			]
		}
	];
</script>

<svelte:head>
	<title>Historical Analysis</title>
</svelte:head>

{#if !isMobile}
	<TableOfContents {sections} />
{/if}

<main class="container mx-auto px-4">
	<div class="grid grid-cols-12 gap-0 items-start mt-10 mb-10 lg:mx-auto lg:px-4 md:px-0">
		<div class="col-span-12 md:col-start-2 md:col-span-10">
			<h1 class="text-4xl font-extrabold mb-4">{title}</h1>
			<p class="mb-6">
				Highlights of {stateName}
				{planName} assets, liabilities, and other important funding metrics over the last two decades.
			</p>
			{#each sections as section}
				<div class="section p-6 mb-6 bg-white shadow-custom rounded-lg" id={section.id}>
					<h2 class="text-3xl font-bold mb-4">{section.title}</h2>
					{#each section.content as item}
						{#if item.type === 'text'}
							<p class="mb-4 mt-4">{@html item.value}</p>
						{:else if item.type === 'component'}
							<svelte:component this={item.component} {...item.props} />
						{/if}
					{/each}
				</div>
			{/each}
		</div>
	</div>
</main>

<style>
	main {
		max-width: 1100px;
	}
</style>
