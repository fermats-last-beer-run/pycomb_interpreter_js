import {read} from './modules/reader.js'
import {global_env} from './modules/expr.js' 

// Program Start
// TODO: Ideally we want a test to make sure this is run as main

/* Run a read-eval-print-loop
repl.js to start an interactive REPL

TODO: Some sort of expression reading function that will print representations
*/
function displayREPL(string) {
    var ul = document.querySelector("#repl");
    var li = document.createElement("li");
    li.innerHTML(string);
    ul.appendChild(li);
}
while(true){
    try {
        user_input = window.prompt('> ');
        if (expr !== null) {
            displayREPL(repr(expr));
        } 
    } catch (err) {
        console.error("Something went wrong");
    }
}