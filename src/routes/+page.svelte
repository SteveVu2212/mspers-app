<script>
	let stateName = 'Ohio';
	let planName = 'STRS';
</script>

<svelte:head>
	<title>Reason Foundation - {stateName} {planName}</title>
</svelte:head>

<div class="main mx-auto py-10 h-screen max-w-7xl">
	<h4 class="text-center font-extrabold text-5xl mt-8 mb-4">{stateName} {planName} - Demo</h4>

	<h3 class="mx-[10vw] text-center italic text-xl mb-8">
		<span class="px-1">Data and modeling to better understand {stateName} {planName}</span>
	</h3>

	<hr class="mx-1 my-0 border-t-4 border-reasonOrange" />

	<ul class="cards flex flex-wrap list-none m-0 p-0 mt-8">
		<li class="cards-item flex p-4 w-full md:w-1/3 lg:w-1/3">
			<a href="/historical" class="no-underline w-full">
				<div
					class="card flex flex-col bg-white shadow-2xl border-gray-200 border overflow-hidden w-full rounded-lg hover:shadow-xl hover:-translate-y-1 transform transition-all duration-300 h-full"
				>
					<div class="card-image">
						<img src="./images/oh-historical.png" class="w-full h-48 object-cover" />
					</div>
					<div class="card-content p-4 bg-white flex flex-col justify-between">
						<h2 class="card-title text-black text-lg lg:text-xl font-bold mb-3">Historical Data</h2>
						<p
							class="card-text text-black text-sm lg:text-base leading-[1.5] mb-5 font-medium flex-grow"
						>
							Highlights of {planName} assets, liabilities and other important funding metrics over the
							last 20 years.
						</p>
					</div>
				</div>
			</a>
		</li>
		<li class="cards-item flex p-4 w-full md:w-1/3 lg:w-1/3">
			<a href="/funding" class="no-underline w-full">
				<div
					class="card flex flex-col bg-white shadow-2xl border-gray-200 border overflow-hidden w-full rounded-lg hover:shadow-xl hover:-translate-y-1 transform transition-all duration-300 h-full"
				>
					<div class="card-image">
						<img src="./images/oh-funding.png" class="w-full h-48 object-cover" />
					</div>
					<div class="card-content p-4 bg-white flex flex-col justify-between">
						<h2 class="card-title text-black text-lg lg:text-xl font-bold mb-3">Funding Model</h2>
						<p
							class="card-text text-black text-sm lg:text-base leading-[1.5] mb-5 font-medium flex-grow"
						>
							Funding modeling projects {planName} funded status with different funding policies and
							return assumptions.
						</p>
					</div>
				</div>
			</a>
		</li>
		<li class="cards-item flex p-4 w-full md:w-1/3 lg:w-1/3">
			<a href="/benefit" class="no-underline w-full">
				<div
					class="card flex flex-col bg-white shadow-2xl border-gray-200 border overflow-hidden w-full rounded-lg hover:shadow-xl hover:-translate-y-1 transform transition-all duration-300 h-full"
				>
					<div class="card-image">
						<img src="./images/oh-benefit.png" class="w-full h-48 object-cover" />
					</div>
					<div class="card-content p-4 bg-white flex flex-col justify-between">
						<h2 class="card-title text-black text-lg lg:text-xl font-bold mb-3">Benefit Model</h2>
						<p
							class="card-text text-black text-sm lg:text-base leading-[1.5] mb-5 font-medium flex-grow"
						>
							Benefit modeling includes current and new plan designs for employees and the potential
							cost to employers as well as benefit to the employees.
						</p>
					</div>
				</div>
			</a>
		</li>
	</ul>
</div>
