# Dedux

Tiny library, based on the ideas of redux, but with fewer options and less extensibility, but also with less overhead.

The goal is to create a single store, that keeps track of state. The store can notify subscribers of changes to state.

There are three important concepts for this library.

## actions
The action is a function to which you can subscribe. Running the action will notify subscribers with the provided argument.

Dedux actions are created by running the createActions function. It takes an array of action names, and returns an object with the names as properties and the action functions as values.
```js
import { createActions } from 'dedux';

const actions = createActions(['firstAction', 'secondAction']);
actions.firstAction.subscribe(payload => {
  console.log(payload);
});
actions.firstAction('hello'); // will log hello
```

## modifiers
A modifier is an object containing pure functions that return a small part of the state.

Modifiers are combined into one object by running the combineModifiers function. It takes an object, with all modifiers as values. The keys will later be used to divide the state into different parts.

## store
The store keeps track of a state object. It exposes two functions.
* subscribe: Will run the provided callback with the latest state whenever it changes. Returns an unsubscribe function.
* getState: Returns the current state.

When created, the store will set up subscriptions for the provided actions. Whenever an action is run, the store will look for modifiers with the same name, and run them to modify the state. The store will also run any modifier called initialState, to use as a base.

There is also an option to provide an existing initial state object. This is useful when server rendering, or when reloading from local storage or similar.

## examples

### Todo MVC
[Riot TodoMVC](https://github.com/jsannerstedt/dedux-TodoMVC), adaptation of existing riot TodoMVC app, to show dedux structure... 

### complete riot based app
[riot-spa-example](https://github.com/jsannerstedt/riot-spa-example) - Shows some suggestions for structuring, as well as rendering client/server with shared state and routes.


### basic sync use case
```js
import { combineModifiers, createActions, createStore } from 'dedux';

const modifiers = combineModifiers({
  menu: {
    initialState: () => ({ menuOpen: false }),
    toggleMenu: payload => ({ menuOpen: payload })
  }
});

const actions = createActions(Object.keys(modifiers));

const store = createStore(modifiers, actions);

store.subscribe(state => {
  // do something intersting here, like re-rendering a view
  console.log(state);
});

actions.toggleMenu(true);
// will log { menu: { menuOpen: true } }
```


### basic async use case
```js
import { combineModifiers, createActions, createStore } from 'dedux';

const modifiers = combineModifiers({
  customers: {
    initialState: () => ({ customers: [], isLoading: false }),
    fetchCustomers: () => ({ isLoading: true }),
    fetchCustomersSuccess: payload => ({ isLoading: false, customers: payload }),
    fetchCustomersError: payload => ({ isLoading: false, error: payload })
  }
});

const actions = createActions(Object.keys(modifiers));

const store = createStore(modifiers, actions);

actions.fetchCustomers.subscribe(() => fetch('/customer')
  .then(actions.fetchCustomersSuccess)
  .catch(actions.fetchCustomersError);

store.subscribe(state => {
  console.log(state.customers);
});

actions.fetchCustomers();
// will log { customers: [], isLoading: true }
// and eventually if successful { customers: [/*data*/], isLoading: false }
```

## the name...
... is very much up for debate, just went with the current -ux trend....

## TODO
* tests
* more documentation
* more examples
* publish

## License
ISC
