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

### React Order of Operations

Lifecycle is similar to ASP.NET web forms … each component has a lifecycle

getInitialState function … initial state load
getDefaultProps … return a set a properties to use by default if parent doesn't have value

componentWillMount - runs immediately before rendering … good spot to set initial state (client and server) - like clearing fields on a login screen
componentDidMount - runs immediately after rendering … access DOM, integrate, set timers, AJAX 
componentWillReceiveProps - runs when component receiving props (when properties have changed), not called on initial render … set state before render
shouldComponentUpdate - before render when new props or state are being received … not called on initial render … performance, return false to void unnecessary renders (state changed, but don't want to render again)
componentWillUpdate - before render when new props or state are being received … use to prepare for an update
componentDidUpdate - after components updates are flushed to the DOM, not called for the initial render, works with the DOM after an update
componentWillUnmount - Immediately before component removed from the DOM … use for cleanup


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

````
    getInitialState: function() {
        return {
            author: { id: '', firstName: '', lastName: '' }
        };
    },
````

To pass this down to the form replace this:

````
    <AuthorForm/>
````

With this:

````
    <AuthorForm author={this.state.author} />
````

Then update the author form component ... this is done by entering the props in the value field of the form text inputs like this:

````
    value={this.props.author.firstName}
````

Once this is done, change handlers also need to be setup for the form. In the view controller create a setAuthorState function.

This takes the event that occurs (text entered in text box) ... in example below field is one of the text fields, and value is the key that was pressed.
The setState function updates the state, which gets passed as props to the value of the child form.
Function below called with every key press.

````
    setAuthorState: function(event) {
        var field = event.target.name;
        var value = event.target.value;
        this.state.author[field] = value;
        return this.setState({author: this.state.author});
    },
````

A reference to this component has to be passed down to the child component. 

This is done here with an onChange handler:

````
    <AuthorForm author={this.state.author} onChange={this.setAuthorState} />
````

This is used in the child component here:

````
    ref="firstName"
    onChange={this.props.onChange}
    value={this.props.author.firstName} />
````

Stopped at 3:15 of 6:56
