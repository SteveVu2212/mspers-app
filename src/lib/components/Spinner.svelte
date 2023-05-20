<script>
	export let size = 24;
	export let color = '#333';
	export let borderWidth = 2;
	export let borderColor = '#ccc';
</script>

<div
	class="spinner"
	style="width: {size}px; height: {size}px; border: {borderWidth}px solid {borderColor}; border-top-color: {color};"
/>

<style>
	@keyframes spinner {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
	.spinner {
		animation: spinner 1s linear infinite;
		border-radius: 50%;
		margin: 100px auto;
	}
</style>
