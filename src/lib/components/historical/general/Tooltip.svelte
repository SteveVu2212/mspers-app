<script>
	export let xScale;
	export let yScale1;
	export let yScale2;
	export let hoveredDate;
	export let data1;
	export let data2;
	export let color1;
	export let color2;
	export let selectedKey;
	export let innerWidth;

	function interpolateData(data, key, date) {
		const prevPoint = data[key].filter((d) => new Date(d.x) <= date).slice(-1)[0];
		const nextPoint = data[key].filter((d) => new Date(d.x) >= date)[0];

		if (!prevPoint || !nextPoint) return null;

		const prevTime = new Date(prevPoint.x).getTime();
		const nextTime = new Date(nextPoint.x).getTime();
		const currentTime = date.getTime();

		const ratio = (currentTime - prevTime) / (nextTime - prevTime);

		return prevPoint.y + ratio * (nextPoint.y - prevPoint.y);
	}

	const interpYValue1 = (date) => interpolateData(data1, selectedKey, date);
	const interpYValue2 = (date) => interpolateData(data2, selectedKey, date);
	const getYValue1 = (date) => data1[selectedKey].filter((d) => new Date(d.x) >= date)[0]?.y;
	const getYValue2 = (date) => data2[selectedKey].filter((d) => new Date(d.x) >= date)[0]?.y;

	let xPosition;
	let yPosition;
	let isNearRightEdge;
	let formattedText = '';

	$: {
		xPosition = xScale(hoveredDate) + (isNearRightEdge ? -5 : 10);
		yPosition = yScale1(interpYValue1(hoveredDate)) - 10;
	}
</script>

<circle
	cx={xScale(hoveredDate)}
	cy={yScale1(getYValue1(hoveredDate))}
	r="4"
	fill={color1}
	stroke="#f0f0f0"
	pointer-events="none"
/>
