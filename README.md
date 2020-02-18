# vue-xstate-plugin

A simple plugin to make your XState state machines available on the Vue instance.

## Usage

### Installation

This plugin requires XState already installed.

```
npm install --save xstate
```

Install the plugin.

```
npm install --save vue-xstate-plugin
```

### Typical use

Configure an XState machine that you want to pass to your Vue app and export it.

In fetchMachine.js :

```javascript
import { Machine } from 'xstate';

export const fetchMachine = Machine({
	/* machine config... */
});
```

The plugin takes in an array of objects, each containing a `config` property representing your XState machine and options that you can configure. You can integrate as many machines as you need.

In main.js :

```javascript
import { VueStateMachine } from 'vue-xstate-plugin';
import { fetchMachine } from './fetchMachine.js';
import { anotherMachine } from './anotherMachine.js';

Vue.use(VueStateMachine, [
	{
		config: fetchMachine,
		logState: true,
		logContext: true,
		persistState: true
	},
	{
		config: anotherMachine,
		persistState: true
	}
]);
```

The plugin makes your machines available as `$machineNameMachine` and you can now access them from any Vue component.

The plugin takes care of interpreting and starting the machine.

It exposes the current state, the context (which can be used as a global data store to replace Vuex or other state management libraries) and the `send()` method. It can also log state and context changes to the console (available in the options), as this makes it easier to debug.

In order for your component to receive and react to a machine state or context change, you should put these in computed properties.

In app.vue (or any Vue single-file component) :

```html
<template>
    <button @click="onFetch" v-if="!fetchState.matches('fetching')">
      Fetch
    <button>
    <p>{{ fetchContext.fetchResult }}</p>
</template>

<script>
export default {
    computed: {
        fetchState() {
            return this.$fetchMachine.current;
        },
        fetchContext() {
            return this.$fetchMachine.context;
        }
    },
    methods: {
        onFetch() {
            this.$fetchMachine.send({type: 'FETCH'});
        }
    }
};
</script>
```

You can now configure a machine with all the features that XState provides and use it as a reactive global store to manage your data and the state of your Vue app.

### Options

-   `logState` - Boolean (default: false): when true, outputs the new state value to the console on every state change (disabled in production);
-   `logContext` - Boolean (default: false): when true, outputs the updated context to the console on every state change (disabled in production);
-   `persistState` - Boolean (default: false): when true, stores the current state of the machine in `localStorage` (if available) and retrieves it from there on subsequent page loads.

### Usage with Nuxt.js

If Nuxt is used in SPA mode, nothing different needs to be done, just follow the usual way of integrating 3rd party plugins in a Nuxt app.

If Nuxt is used in Universal mode, the plugin needs to be transpiled. In your `nuxt.config.js` file, add `'vue-xstate-plugin'` to the `transpile` option.

## Contributions

Any contributions to make this plugin better and more extensive are welcome, just submit a pull request.
