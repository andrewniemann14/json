# JSON Station
live at https://json.niemann.app/

main documentation at https://niemann.app/projects/json.html/
# File Summary
## input-output.js
provides the json object state, and functions for
- reading JSON file
- fetching JSON from URL
- downloading JSON file
## json-to-html.js
recursively analyzes JSON object and builds HTML divs, input fields, and buttons to mirror the data
## html-to-json.js
reads what is in the HTML and builds a JSON object based on it
## listeners.js
event listeners for the toolbar and input section
## scope.js
snippet that allows use of the :scope pseudoclass in IE and older browsers