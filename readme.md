## Dependencies


* gulp - pipeline task runner
    * gulp-connect - runs a local dev server
    * gulp-open - opens a URL in a web browser
    * gulp-concat - concatenates files
    * gulp-eslint - lint js files, included in jsx
* browserify - packages files
* reactify - compiles jsx into js
* vinyl-source-stream - use conventional text streams with gulp

## Notes

### Input Shell

````
"use strict";

var React = require('react');

var Input = React.createClass({
    render: function() {
        return (

        );
    }
});

module.exports = Input;
````

### React Order of Operations

Lifecycle is similar to ASP.NET web forms … each component has a lifecycle

- getInitialState function … initial state load
- getDefaultProps … return a set a properties to use by default if parent doesn't have value

- componentWillMount - runs immediately before rendering … good spot to set initial state (client and server) - like clearing fields on a login screen
- componentDidMount - runs immediately after rendering … access DOM, integrate, set timers, AJAX 
- componentWillReceiveProps - runs when component receiving props (when properties have changed), not called on initial render … set state before render
- shouldComponentUpdate - before render when new props or state are being received … not called on initial render … performance, return false to void  unnecessary renders (state changed, but don't want to render again)
- componentWillUpdate - before render when new props or state are being received … use to prepare for an update
- componentDidUpdate - after components updates are flushed to the DOM, not called for the initial render, works with the DOM after an update
- componentWillUnmount - Immediately before component removed from the DOM … use for cleanup


### Handling Transitions

willTransitionTo - determines if a page will be transitioned to, ex: useful for check a user has been authenticated before they can get to a page
willTransitionFrom - runs checks before user navigates away, ex: check form data is valid before leaving a page

````javascript
var Settings = React.createClass({
    statics: {
        willTransitionTo: function (transition, params, query, callback) {
            if (!isLoggedIn) {
                transition.abort();
                callback();
            }
        },
        willTransitionFrom: function (transition, component) {
            if (component.fromHasUnsavedData()) {
                if (!confirm('Are you sure you want to leave without saving?')) {
                    transition.about();
                }
            }
        }
    }

    // ...
});
````

### Hash History URL support

location:9005/#/authors

HTML5 History style, clean URL's, needs modern browsers (won't work on IE8)

location:9005/authors - uses HTML history push state

To enable this add this in react router: Router.run(routes, Router.HistoryLocation, function ...)

On the server need to route all requests to index.html so that react router can take over routing for the application

Note: hash based URL's do not require any configuration on the server and can be used as is

### Pages and Change Handlers

If you just create a form text input on a page, then the input will not be registered to accept any changes from the keyboard.

In order to accept input initial state must be defined for the properties that will be set on the form. 

This is done by creating a JSON object representing the state in the view controller, and handing it down as props to the child form.

The JSON looks like this:

````javascript
    getInitialState: function() {
        return {
            author: { id: '', firstName: '', lastName: '' }
        };
    },
````

To pass this down to the form replace this:

````javascript
    <AuthorForm/>
````

With this:

````javascript
    <AuthorForm author={this.state.author} />
````

Then update the author form component ... this is done by entering the props in the value field of the form text inputs like this:

````javascript
    value={this.props.author.firstName}
````

Once this is done, change handlers also need to be setup for the form. In the view controller create a setAuthorState function.

This takes the event that occurs (text entered in text box) ... in example below field is one of the text fields, and value is the key that was pressed.
The setState function updates the state, which gets passed as props to the value of the child form.
Function below called with every key press.

````javascript
    setAuthorState: function(event) {
        var field = event.target.name;
        var value = event.target.value;
        this.state.author[field] = value;
        return this.setState({author: this.state.author});
    },
````

A reference to this component has to be passed down to the child component. 

This is done here with an onChange handler:

````javascript
    <AuthorForm author={this.state.author} onChange={this.setAuthorState} />
````

This is used in the child component here:

````
    ref="firstName"
    onChange={this.props.onChange}
    value={this.props.author.firstName} />
````

### Creating Reusable Inputs

As the input for text can be very verbose we need a reusable React Component for text inputs.

Under common create a text input component.

Once the text input component has been created it can be used in the AuthorForm like this.

Add a reference to the component:

````javascript
var Input = require('../common/textInput');
````

Then add the new streamlined version of the component:

````javascript
<Input
    name="firstName"
    label="First Name"
    value={this.props.author.firstName}
    onChange={this.props.onChange}
    error={this.props.errors.firstName} />
````

### Saving Data

This is done with a function that takes one argument, event. This will be the event passed up from the child form.

This function just takes the current state and saves it. Note that the state has been changed with every change on the form.

The save event is triggered by the Save button on the form with fires an onSave event ... onClick={this.props.onSave}

Likewise the view controller is listening for onSave with an onSave handler here:

````javascript
    <AuthorForm 
        author={this.state.author} 
        onChange={this.setAuthorState}
        onSave={this.saveAuthor}
        />
````

### Programmatic Redirects with React Router

To redirect the user to the list of authors after they click save author React Router can be used.

This is done with the navigation mixin for React Router and this statement in the saveAuthor method:

````javascript
this.transitionTo('authors');
````

### Notifications

Visual feedback of save confirm with toastr.

Go back to the command line and use npm to add toastr

````
npm install --save toastr@2.1.0
````

Once this is installed some changes need to be added to the gulpfile.

Add the toastr css here to add it to the css bundle:

````javascript
var config = {
    port: 9005,
    devBaseUrl: 'http://localhost',
    paths: {
        html: './src/*.html',
        js: './src/**/*.js',
        images: './src/images/*',
        css: [
            'node_modules/bootstrap/dist/css/bootstrap.min.css',
            'node_modules/bootstrap/dist/css/bootstrap-theme.min.css',
            'node_modules/toastr/toastr.css'
        ],
````

Then in the manageAuthorPage reference the toastr library and then call it with toastr.success('Author saved.')

### Validation

Like an author state with an author object was created and passed to the child component as props, the same thing is done with an errors object.
This are also added to the AuthorForm's children, the inputs. 

### PropTypes

    author - it is required an author object is passed from the parent
    errors - it is optional an errors object is passed from the parent
    onSave/onChange - it is required an onSave and onChange function are passed from the parent

### Transitions

To prevent a user from navigating away from a page and losing data before they save the form, transistions can be used.

To do this add a new statics function.

````javascript
statics: {
    willTransitionFrom: function(transition, component) {
        if (component.state.dirty) {
            
        }
    }
}
````

Start tracking a state of dirty along with author and errors.

````javascript
author: {},
errors: {},
dirty: false
````

Make a call to set state in the change handler setAuthorState and the saveAuthor function.

### Editing Existing Data

Define a route to handle editing authors in routes, note special path.

````javascript
<Route name="manageAuthor" path="author/:id" handler={require('./components/authors/manageAuthorPage')} />
````

The best place to hydrate components is inside of componentWillMount, which is run immediatly before the page is rendered.
Setting state in this function will not trigger the page to re-render. If called in componentDidMount the page would re-render.

To pull the authorId from the URL do this:

````javascript
var authorId = this.props.params.id
````

### Flux

Flux is a name for a pattern of unidirectional data flow ... note: this means one way (unlike Angular).

Changes to application state are controlled by a centralized dispatcher.

Will combine the Flux dispatcher and a javascript event library.

Redux is a Flux implementation. Others are Alt, Reflux, Flummox, etc ...

In flux when something is changed in a textbox the store is not immediately changed.

In two way binding the view model is updated by the view directly.

With unidirectional dataflow this the change looks like this:

````
Action --> Dispatcher --> Store --> React View
  ^                                     |
  |--------------------------------------
````

Actions occur and dispatcher notifies any stores that have registered with the dispatcher that an action occurred.

When the store changes the React component is updated and the user sees the change in the UI.

The view doesn't directly update state, it fires off actions which ultimately update that state. 

This makes debugging easier as actions are easier to trace.

Two way binding is simplier conceptually and requires less binding, but unidirectional flows make you application easier to work with. 

Undirectional flows also make it easier to update multiple stores when an action occurs.

### Three Core Flux Concepts

#### Actions

Actions describe user interactions that happen in your React components, for example a button that is clicked to delete a user.

These actions are handled by a centralized dispatcher, who notifies anyone that cares. The dispatcher is a singleton registry, which is a centralized list of callbacks.

The dispatcher makes calls to stores, stores hold the application state (application data) and when these are updated the React view is updated with the changes.

The UI never updates the data directly, and the data never updates the UI directly ... updates to the UI are rendered due to changes to the store.

The dispatcher exposes a method that allows us to trigger a dispatch to the stores, and to include a payload of data which is the action. 

Action creators are dispatcher helper methods that describe all of the actions that are possible in the application (like add user, update user, etc).

Actions can be triggered from the UI or the server.

Actions define a CONSTANT that is the action type. An action payload always has a type and data.

Here is an example:

````javascript
{
    type: USER_SAVED
    data: {
        firstName: 'John',
        lastName: 'Smith'
    }
}
````

#### Dispatcher

Stores register with the dispatcher so they can be notified when data changes. The dispatcher holds a list of callbacks.

The dispatcher sends actions to the stores.

With Flux a constants file should be created in a single place.

#### Stores

Stores hold app state, logic, and data retrieval. A store is not a model, a store contains models.

Over time large apps create multiple stores.

Stores get updated because they have callbacks that are registered with the dispatcher.

React components should never try to register with the dispatcher directly.

Flux stores are extended with Node's EventEmitter, this allows stores to both listen for and broadcast events, and it allows React components to update based on those events. The React components listen to the stores, which is how they know application state has changed. 

The store is the only thing in the application that knows how to update data, and this is the most important part of Flux.

Every store does the following

1. Extend EventEmitter
2. addChangeListener and removeChangeListener - ties React component to store so it knows when something changes
3. emitChange

### Controller Views

Top level component that composes child components. These should interact with stores, and pass the updates to their children via props.

Controller views hold data in state and send data to children as props. It is recommended to have a controller view at the top that interacts with the store, holds data in its state, and passes this data down to its children as props.

It is helpful to pass a single large object down to all children so you don't have to change code in multiple children as new properties are added.

### Flux Flow in Detail

Action - commonly talk to WebAPI's to get and receive data as well as sending action payloads to the dispatcher
Send Action Payload - JSON above
Dispatcher - checks list of registered callbacks
Send Action Payload to registered callbacks
Store updates internal storage based on payload
The Store emits (fires) a change event
React View

For example, in promproject the userActions action calls the loginApi on login and then calls dispatch with action of either loginSuccess or loginError (failure). The JSON payload for success is the type USER_LOGGED_IN_SUCCESS and the user object.

### A Chat with Flux

Another way to think about Flux, as a conversation.

- **React**      Hey CourseAction, someone just clicked the "Save Course" button. 
- **Action**     Thanks React! I registered an action creator with the dispatcher, so the dispatcher shoudl take care of notifying all the stores that care.
- **Dispatcher** Let me see who cares about a course being saved. Ah! Looks like CourseStore has registered a callback with me, I let her know.
- **Store**      Hi dispatcher! Thanks for the update, I'll update my data with the payload you sent. Then I'll emit an event to the React components that care.
- **React**      New data from the store! I'll update the UI to reflect this. 

### Flux API

Contains five functions.

1. register(function callback) - "Hey dispatcher, run me when actions happen." - Store
2. unregister(function callback) - "Hey dispatcher, I don't want to know about this action." - Store
3. waitFor(array<string> ids) - "Update this store first." - Store
4. dispatch(object payload) - "Hey dispatcher, tell the stores about this action." - Action
5. isDispatching() - "I'm busy dispatching callbacks right now."

### Action

Under src/actions an authorAction is defined this is an Action Creator.

This contains an action to createAuthor which fires off a call to the author API to save the author.

Then the actual action is dispatched with the dispatcher, this tells the stores that an author was created.

### Store

The store defines an object-assign polyfill. This is used to glue two objects together.
 
Here it is used to glue together a store (author store for example) and an event emitter into a single object. 

This allows us to add event emitter capabilities to the author store we are creating. 

Inside the author store three functions are supported:

1. addChangeListener - for components to say: I would like to know when this store changes
2. removeChangeListener - mirror image of add change listener
3. emitChange - this.emit('change') ... the store changed, emit event

Store must be registered with the dispatcher so it is notified when an action happens.

This is done with a Dispatcher.register statement at the bottom of the store.

Since every store that is registered with the dispatcher is notified on **every** action, some special logic is need to only respond to events the store cares about.

A switch statement is used to do this. 

All of the other Flux implementations build on the principals of the action/dispatcher/store concept.

The **public API** of the store are the three functions above. 

The actual author data in the store is **private**. At the top of the file a private author array is declared.

Only the AuthorStore is exported, so no one can mess with the private author data in the class in a private author array.

Altering the author data must be done through the methods exposed in the AuthorStore API. 

To getAuthors from the store a getAllAuthors function is exposed. The store is called to get authors instead of the API in the author pages.

When the private data is altered the change is then  emitted with a call to emitChange. Any classes that have used AuthorStore.addChangeListener will receive the changes.

One such place is the AuthorPage which is the View Controller that sits on top of the AuthorList. Here the list of authors is maintained in state, and passed to the author list as props.

When the underlying author data changes in the AuthorStore the change is emitted, and is captured in the addChangeListener that is wired up in the AuthorPage and the _onChange method is called.

In the _onChange method, set state is called and the author data in state is refreshed with the current data from the AuthorStore. Additional info on this is in the listeners section below. 

### Stores: Initialization

Initialization will now occur in main.js

Create an initialization actions file that will be used to bootstrap the application.

The author store needs to know when initialActions is called when the app starts.

To do this register the action in the Dispatcher register section of the authorStore.

### Stores: Listeners

When a store changes React components need to be notified, for example the author list needs to know that it needs to reload when and author is deleted.

To do this add a _onChange method to the authorPage which sets to the author state to the getAllAuthors method of the AuthorStore, then call this method whenever the list is altered.

In addition to this on componentWillMount add the AuthorStore addChangeListener, this points to _onChange.






