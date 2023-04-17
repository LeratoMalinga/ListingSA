export { matchers } from './matchers.js';

export const nodes = [() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10')];

export const server_loads = [];

export const dictionary = {
	"/": [2],
	"/AddProperty": [3],
	"/AgentDashboard": [4],
	"/ChatMessage": [6],
	"/Chat": [5],
	"/TenantDashboard": [9],
	"/UpdateProperty": [10],
	"/login": [7],
	"/register": [8]
};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
};

export { default as root } from '../root.svelte';