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
import { Machine } from "xstate";

export const fetchMachine = Machine({
	/* machine config... */
});
```

The plugin takes in an `options` object with a `machines` array, so you can integrate multiple machines in your app if needed.

In main.js :

```javascript
import { VueStateMachine } from "vue-xstate-plugin";
import { fetchMachine } from "./fetchMachine.js";
import { anotherMachine } from "./anotherMachine.js";

Vue.use(VueStateMachine, {
	machines: [fetchMachine, anotherMachine]
});
```

Now the plugin makes your machines available as `$machineNameMachine`.

You can now access them from any Vue component.

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

### Multiple machines

If you have a lot of machines to integrate, it is a good idea to import them all in an index file first.

fsm/index.js :

```javascript
import { firstMachine } from "./firstMachine.js";
import { secondMachine } from "./secondMachine.js";
/* etc. */

export const machines = [
	firstMachine,
	secondMachine
	/* etc. */
];
```

main.js :

```javascript
import { VueStateMachine } from "vue-xstate-plugin";
import { machines } from "./fsm";

Vue.use(VueStateMachine, {
	machines
});
```

### Options

-   `machines` - Array : an array of state machines to be added on the Vue instance;
-   `logState` - Boolean (default: false): when true, outputs the state value to the console on every state change;
-   `logContext` - Boolean (default: false): when true, outputs the updated context to the console on every state change;

### Usage with Nuxt.js

If Nuxt is used in SPA mode, nothing different needs to be done, just follow the usual way of integrating 3rd party plugins in a Nuxt app.

If Nuxt is used in Universal mode, the plugin needs to be transpiled. In your `nuxt.config.js` file, add `'vue-xstate-plugin'` to the `transpile` option.

## Contributions

Any contributions to make this plugin better and more extensive are welcome, just submit a pull request.
