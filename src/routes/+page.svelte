<script lang="ts">
	import type { HitBoxEvent } from '$lib/types';
	import { hitbox } from '$lib/hitbox';
	let state = {
		first: -1,
		second: -1
	};

	const handle_hitbox = (id: string) => (event: HitBoxEvent) => {
		state = { ...state, [id]: Math.round(event.detail.progress * 100) / 100 };
		console.log(event.detail);
	};
</script>

<main>
	<div>
		<button
			class="first"
			use:hitbox
			on:hitbox={handle_hitbox('first')}
			style={`--progress: ${state.first}`}>Touch me</button
		>
		<button class="second" use:hitbox on:hitbox={handle_hitbox('second')}>
			<span class:hidden={!(state.second < 0)}>😭</span>
			<span class:hidden={!(state.second > 0 && state.second < 0.25)}>😔</span>
			<span class:hidden={!(state.second >= 0.25 && state.second < 0.5)}>😐</span>
			<span class:hidden={!(state.second >= 0.5 && state.second < 0.75)}>😊</span>
			<span class:hidden={!(state.second >= 0.75 && state.second < 1)}>🤣</span>
			<span class:hidden={!(state.second === 1)}>😍</span>
		</button>
	</div>
</main>

<style>
	:global(body) {
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
		background-color: #000;
	}

	main,
	div,
	button {
		display: flex;
	}

	main {
		flex-direction: column;
		justify-content: flex-end;
		align-items: center;
		min-height: 250vh;
		padding-bottom: 10em;
	}

	div {
		justify-content: space-between;
		min-width: 50%;
		max-width: 80%;
	}

	button {
		align-items: center;
		padding: 1em;
		font-size: 1.5em;
		border-radius: 0.25em;
		cursor: pointer;
		text-transform: uppercase;
	}

	.first {
		--progress: 0;
		border: 1px solid hotpink;
		background-color: transparent;
		color: hotpink;
		outline: calc(5px * var(--progress)) solid hotpink;
		box-shadow: 0px 0px calc(50px * var(--progress)) hotpink,
			0px 0px calc(50px * var(--progress)) hotpink;
	}

	.second {
		border: 0;
		background-color: yellow;
		position: relative;
		min-width: 3em;
		font-size: 3em;
	}

	button > span {
		position: absolute;
		opacity: 1;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		transition: opacity 50ms ease;
	}

	button > span.hidden {
		opacity: 0;
	}
</style>
