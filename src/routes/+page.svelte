<script lang="ts">
	import type { HitBoxEvent } from '$lib/types';
	import { hitbox } from '$lib/hitbox';

	let state = {
		first: { progress: -1, hit: false },
		second: { progress: -1, hit: false },
		third: { progress: -1, hit: false }
	};

	const within = (value: number, min: number, max: number) => value >= min && value < max;

	const handle_hitbox = (id: string) => (event: HitBoxEvent) => {
		state = { ...state, [id]: event.detail };
		console.log(event.detail);
	};
</script>

<div>
	<button
		class="first"
		use:hitbox
		on:hitbox={handle_hitbox('first')}
		style={`--progress: ${state.first.progress}`}>Touch me</button
	>
	<button class="second" use:hitbox on:hitbox={handle_hitbox('second')}>
		<span class:hidden={!(state.second.progress < 0)}>😭</span>
		<span class:hidden={!within(state.second.progress, 0, 0.25)}>😔</span>
		<span class:hidden={!within(state.second.progress, 0.25, 0.5)}>😐</span>
		<span class:hidden={!within(state.second.progress, 0.5, 0.75)}>😊</span>
		<span class:hidden={!within(state.second.progress, 0.75, 1)}>🤣</span>
		<span class:hidden={!(state.second.progress === 1)}>😍</span>
	</button>
	<button
		class="third"
		class:third_shake={state.third.hit}
		use:hitbox
		on:hitbox={handle_hitbox('third')}
		style={`--progress: ${1 - state.third.progress}`}>🐶</button
	>
</div>

<style>
	:global(body) {
		font-family: sans-serif;
		background-color: black;
		padding-top: 250vh;
		padding-bottom: 10em;
	}

	div,
	button {
		display: flex;
	}

	div {
		margin: 0 auto;
		justify-content: space-between;
		max-width: 80%;
	}

	button {
		align-items: center;
		padding: 1em;
		font-size: 1.5em;
		border-radius: 0.25em;
		cursor: pointer;
		text-transform: uppercase;
		font-weight: bold;
		border: 0;
	}

	.first {
		--progress: 0;
		border: 2px solid hotpink;
		background-color: transparent;
		color: hotpink;
		box-shadow: 0px 0px calc(50px * var(--progress)) hotpink,
			0px 0px calc(50px * var(--progress)) hotpink;
	}

	.second {
		background-color: springgreen;
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

	.third {
		background-color: goldenrod;
		font-size: 3em;
	}

	.third_shake {
		animation: shake calc(1000ms * var(--progress)) infinite;
	}

	@keyframes shake {
		0%,
		100% {
			transform: translate3d(-1px, 0, 0);
		}

		20%,
		80% {
			transform: translate3d(2px, 0, 0);
		}

		30%,
		50%,
		70% {
			transform: translate3d(-4px, 0, 0);
		}

		40%,
		60% {
			transform: translate3d(4px, 0, 0);
		}
	}
</style>
