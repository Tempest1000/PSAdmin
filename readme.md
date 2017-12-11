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

