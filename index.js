import Vue from 'vue';
import { interpret, State } from 'xstate';

const generateVueMachine = (machine, logState = false, logContext = false, persistState = false) => {
	let storedStateName = null;
	let storedState = null;
	const storeState = window && window.localStorage && persistState;

	if (storeState) {
		storedStateName = `${machine.id} machine state - ${window.location.hostname}`;
		storedState = JSON.parse(localStorage.getItem(storedStateName));
	}

	const startingState = State.create(storedState || machine.initialState);
	const resolvedState = machine.resolveState(startingState);

	return new Vue({
		created() {
			this.service
				.onTransition(state => {
					if (state.changed) {
						this.current = state;
						this.context = state.context;

						if (storeState) {
							try {
								localStorage.setItem(storedStateName, JSON.stringify(this.current));
							} catch (err) {
								console.error('Local storage is unavailable.');
							}
						}

						if (process.env.NODE_ENV === 'development') {
							if (logState) {
								console.log(
									`%c [ ${machine.id.toUpperCase()} STATE ]`,
									'color: #1989ac',
									this.current.value
								);
							}
							if (logContext) {
								console.log(
									`%c [ ${machine.id.toUpperCase()} CONTEXT ]`,
									'color: #2b8528',
									this.context
								);
							}
						}
					}
				})
				.start(resolvedState);
			console.log(`${machine.id}Machine started`);
		},
		data() {
			return {
				current: resolvedState,
				context: resolvedState.context,
				service: interpret(machine)
			};
		},
		methods: {
			send(event) {
				this.service.send(event);
			}
		}
	});
};

export const VueStateMachine = {
	install(Vue, machines) {
		machines.forEach(machine => {
			const { config, logState, logContext, persistState } = machine;
			const machineName = `$${config.id}Machine`;
			Vue.prototype[machineName] = generateVueMachine(config, logState, logContext, persistState);
		});
	}
};
