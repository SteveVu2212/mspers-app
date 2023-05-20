<script>
	import { index } from 'd3-array';

	export let width;
	export let height;
	export let checkboxOne;
	export let checkboxTwo;
	export let checkboxThree;
	export let checkboxFour;
	export let lineOne;
	export let lineTwo;
	export let lineThree;
	export let lineFour;

	import { format } from 'd3-format';

	let data = {
		scenario_a: [
			{
				Scenario: lineOne.label,
				'Total ER Contribution (infl adj)': 55414114590,
				'Ending UAL (infl adj)': -44468381142,
				'All-in ER Cost (infl adj)': 10945733448
			}
		],
		scenario_b: [
			{
				Scenario: lineTwo.label,
				'Total ER Contribution (infl adj)': 34972003724,
				'Ending UAL (infl adj)': 473986895,
				'All-in ER Cost (infl adj)': 34498016829
			}
		],
		scenario_c: [
			{
				Scenario: lineThree.label,
				'Total ER Contribution (infl adj)': 161613193250,
				'Ending UAL (infl adj)': 53099539330,
				'All-in ER Cost (infl adj)': 108513653920
			}
		],
		scenario_d: [
			{
				Scenario: lineFour.label,
				'Total ER Contribution (infl adj)': 120087458817,
				'Ending UAL (infl adj)': 19622719276,
				'All-in ER Cost (infl adj)': 100464739540
			}
		]
	};

	$: console.log(lineOne.value);
	$: console.log('indexedData', data);
</script>

<div class="max-w-7xl m-0">
	<div
		class="bg-white shadow-xl sm:rounded-lg m-0 p-0"
		style="width: {width}px; height: {height}px"
	>
		<div class="overflow-x-auto overflow-y-auto">
			<table class="min-w-full divide-y divide-gray-200">
				<thead class="bg-gray-50">
					<tr>
						<th
							scope="col"
							class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
						>
							Scenario
						</th>
						<th
							scope="col"
							class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
						>
							Total ER Contribution (infl adj)
						</th>
						<th
							scope="col"
							class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
						>
							Ending UAL (infl adj)
						</th>
						<th
							scope="col"
							class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
						>
							All-in ER Cost (infl adj)
						</th>
					</tr>
				</thead>
				<tbody class="bg-white divide-y divide-gray-200">
					{#if checkboxOne}
						<tr>
							<td class="px-6 py-2 whitespace-nowrap">
								<div class="text-sm text-gray-900">{data[lineOne.value][0].Scenario}</div>
							</td>
							<td class="px-6 py-2 whitespace-nowrap">
								<div class="text-sm text-gray-900">
									{format('$,.3s')(data[lineOne.value][0]['Total ER Contribution (infl adj)'])
										.replace('G', ' B')
										.replace('M', ' M')}
								</div>
							</td>
							<td class="px-6 py-2 whitespace-nowrap">
								<div class="text-sm text-gray-900">
									{format('$,.3s')(data[lineOne.value][0]['Ending UAL (infl adj)'])
										.replace('G', ' B')
										.replace('M', ' M')}
								</div>
							</td>
							<td class="px-6 py-2 whitespace-nowrap">
								<div class="text-sm text-gray-900">
									{format('$,.3s')(data[lineOne.value][0]['All-in ER Cost (infl adj)'])
										.replace('G', ' B')
										.replace('M', ' M')}
								</div>
							</td>
						</tr>
					{/if}
					{#if checkboxTwo}
						<tr>
							<td class="px-6 py-2 whitespace-nowrap">
								<div class="text-sm text-gray-900">{data[lineTwo.value][0].Scenario}</div>
							</td>
							<td class="px-6 py-2 whitespace-nowrap">
								<div class="text-sm text-gray-900">
									{format('$,.3s')(data[lineTwo.value][0]['Total ER Contribution (infl adj)'])
										.replace('G', ' B')
										.replace('M', ' M')}
								</div>
							</td>
							<td class="px-6 py-2 whitespace-nowrap">
								<div class="text-sm text-gray-900">
									{format('$,.3s')(data[lineTwo.value][0]['Ending UAL (infl adj)'])
										.replace('G', ' B')
										.replace('M', ' M')}
								</div>
							</td>
							<td class="px-6 py-2 whitespace-nowrap">
								<div class="text-sm text-gray-900">
									{format('$,.3s')(data[lineTwo.value][0]['All-in ER Cost (infl adj)'])
										.replace('G', ' B')
										.replace('M', ' M')}
								</div>
							</td>
						</tr>
					{/if}
					{#if checkboxThree}
						<tr>
							<td class="px-6 py-2 whitespace-nowrap">
								<div class="text-sm text-gray-900">{data[lineThree.value][0].Scenario}</div>
							</td>
							<td class="px-6 py-2 whitespace-nowrap">
								<div class="text-sm text-gray-900">
									{format('$,.3s')(data[lineThree.value][0]['Total ER Contribution (infl adj)'])
										.replace('G', ' B')
										.replace('M', ' M')}
								</div>
							</td>
							<td class="px-6 py-2 whitespace-nowrap">
								<div class="text-sm text-gray-900">
									{format('$,.3s')(data[lineThree.value][0]['Ending UAL (infl adj)'])
										.replace('G', ' B')
										.replace('M', ' M')}
								</div>
							</td>
							<td class="px-6 py-2 whitespace-nowrap">
								<div class="text-sm text-gray-900">
									{format('$,.3s')(data[lineThree.value][0]['All-in ER Cost (infl adj)'])
										.replace('G', ' B')
										.replace('M', ' M')}
								</div>
							</td>
						</tr>
					{/if}
					{#if checkboxFour}
						<tr>
							<td class="px-6 py-2 whitespace-nowrap">
								<div class="text-sm text-gray-900">{data[lineFour.value][0].Scenario}</div>
							</td>
							<td class="px-6 py-2 whitespace-nowrap">
								<div class="text-sm text-gray-900">
									{format('$,.3s')(data[lineFour.value][0]['Total ER Contribution (infl adj)'])
										.replace('G', ' B')
										.replace('M', ' M')}
								</div>
							</td>
							<td class="px-6 py-2 whitespace-nowrap">
								<div class="text-sm text-gray-900">
									{format('$,.3s')(data[lineFour.value][0]['Ending UAL (infl adj)'])
										.replace('G', ' B')
										.replace('M', ' M')}
								</div>
							</td>
							<td class="px-6 py-2 whitespace-nowrap">
								<div class="text-sm text-gray-900">
									{format('$,.3s')(data[lineFour.value][0]['All-in ER Cost (infl adj)'])
										.replace('G', ' B')
										.replace('M', ' M')}
								</div>
							</td>
						</tr>
					{/if}
				</tbody>
			</table>
		</div>
	</div>
</div>
