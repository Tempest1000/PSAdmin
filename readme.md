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
    <AuthorPage/>
````

With this:

````
    <AuthorPage author={this.state.author} />
````

Then update the author form component ... this is done by entering the props in the value field of the form text inputs like this:

````
    value={this.props.author.firstName}
````

Once this is done, change handlers also need to be setup for the form. In the view controller create a setAuthorState function.

````
    setAuthorState: function(event) {
        var field = event.target.name;
        var value = event.target.value;
        this.state.author[field] = value;
        return this.setState({author: this.state.author});
    },
````

Stopped at 3:15 of 6:56
