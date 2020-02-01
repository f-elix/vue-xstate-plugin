import Vue from "vue";
import { interpret } from "xstate";

const generateVueMachine = (machine, logState = false, logContext = false) => {
	return new Vue({
		created() {
			this.service
				.onTransition(state => {
					if (state.changed) {
						this.current = state;
						this.context = state.context;
						if (logState) {
							console.log(
								`%c [ ${machine.id.toUpperCase()} STATE ]`,
								"color: #1989ac",
								this.current.value
							);
						}
						if (logContext) {
							console.log(`%c [ ${machine.id.toUpperCase()} CONTEXT ]`, "color: #2b8528", this.context);
						}
					}
				})
				.start();
		},
		data() {
			return {
				current: machine.initialState,
				context: machine.initialState.context,
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
	install(Vue, options) {
		const { machines, logState, logContext } = options;
		machines.forEach(machine => {
			const machineName = `$${machine.id}Machine`;
			Vue.prototype[machineName] = generateVueMachine(machine, logState, logContext);
		});
	}
};
