import { writable, get } from 'svelte/store';

type HitBoxOptions = {
	margin?: number;
	root?: HTMLElement;
};

type HitBoxDetail = {
	progress: number;
	hit: boolean;
};

type Rect = Pick<DOMRect, 'x' | 'y' | 'width' | 'height'>;

const normalize = (value: number, min: number, max: number) => (value - min) / (max - min);

const distance_to_closest_edge = (a: Rect, b: Rect) => {
	const dx = Math.max(b.x - a.x, 0, a.x - (b.x + b.width));
	const dy = Math.max(b.y - a.y, 0, a.y - (b.y + b.height));
	return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
};

const default_options = { margin: 300, root: null };

/** Action that creates a virtual hitbox around an element.
 *	When the mouse pointer is moved within the hitbox the element will emit a `hitbox` event.
 *	The `hitbox` event will provide a `hit` boolean value and a `progress` value which will give a value between `-1 - 1`,
 *	where `-1` is outside the hitbox, `0` is just inside the hitbox and `1` is that you are inside the element.
 */
export function hitbox(node: HTMLElement, user_options?: HitBoxOptions) {
	const state = writable({ hit: false, progress: -1 });
	let observer: IntersectionObserver | undefined;
	let options = user_options ? { ...default_options, ...user_options } : default_options;

	const dispatch_event = (detail: HitBoxDetail) =>
		node.dispatchEvent(new CustomEvent('hitbox', { detail }));

	const unsubscribe_state = state.subscribe(dispatch_event);

	const on_mouse_move = ({ x, y }: MouseEvent) => {
		const current_state = get(state);
		const { margin } = options;

		const mouse_rect = { x, y, width: 1, height: 1 };
		const node_rect = node.getBoundingClientRect();

		const distance = distance_to_closest_edge(mouse_rect, node_rect);
		const progress = distance < margin ? normalize(distance, margin, 0) : -1;
		const hit = progress > -1;

		if (current_state.progress !== progress || current_state.hit !== hit)
			state.update(() => ({ progress, hit }));
	};

	const track_mouse = (should_track_mouse: boolean) => {
		if (should_track_mouse) {
			window.addEventListener('mousemove', on_mouse_move);
		} else {
			window.removeEventListener('mousemove', on_mouse_move);
		}
	};

	const on_intersect = (entries: IntersectionObserverEntry[]) =>
		entries.forEach((entry) => track_mouse(entry.isIntersecting));

	const connect_observer = () => {
		if (observer) {
			observer.disconnect();
		}

		observer = new IntersectionObserver(on_intersect, {
			root: options.root,
			rootMargin: `${options.margin}px`
		});

		observer.observe(node);
	};

	connect_observer();

	return {
		update(user_options?: HitBoxOptions) {
			if (user_options) options = { ...options, ...user_options };
			connect_observer();
		},
		destroy() {
			track_mouse(false);
			observer?.disconnect();
			unsubscribe_state();
		}
	};
}
