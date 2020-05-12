import {comma_separated} from "./module/utils.js"
import {abs, add, subtract, multiply, mod} from "./package/dist/math.js";

class Expr {
    /* This is the big one, huh?

    When you type input into this interpreter, it is parsed into an
    expression. This expression is represented in our code as an instance
    of this 'Expr' class.

    In this interpreter, there are four types of expressions:
        - literals, which are simply numbers
        - names (e.g. my_var_name)
        - call expressions (e.g add(3,4))
        - lambda expressions (e.g lambda x: x)
    Call expressions and lambda expressions are built from simpler
    expressions. A lambda's body and a call expression's operator and 
    operands are expressions as well. This means 'Expr' is a 
    recursive data structure, similar to at tree (specifically an
        abstract syntax tree, if I can remember that).

    In this code, the four expressions are going to be subclasses of
    the Expr class: 'Literal', 'Name', 'CallExpr', and 'LambdaExpr'

    */

    constructor(args){
        this.args = args;
    }

    eval(env){
        throw {name : "NotImplementedError", message : "Prototype for Expr class"};  
    }
}

class Literal extends Expr {
    /* A literal is notation for representing a fixed value in code.
    In PyCombinator, the only literals are numbers. A 'Literal' should
    always eval to a 'Number" value. */
    constructor(value) {
        super(value);
        this.value = value;
    }

    eval(env) {
        return Number(this.value);
    }
}

class Name extends Expr {
    /* A name is a variable. When evaluated, we look up the 
    value in the current environment.
    
    The string attribute contains the name of the variable. */
    constructor(string) {
        super(string);
        this.string = string;
    }

    eval(env) {
        if (this.string in env) {
            return env.this.string
        }
    }
}

class LambdaExpr extends Expr {
    /* A lambda expression, which evaluates to a `LambdaFunction`.

    The `parameters` attribute is a list of variable names (a list of strings).
    The `body` attribute is an instance of `Expr`.

    For example, the lambda expression `lambda x, y: add(x, y)` is parsed as

    LambdaExpr(['x', 'y'], CallExpr(Name('add'), [Name('x'), Name('y')]))

    where `parameters` is the list ['x', 'y'] and `body` is the expression
    CallExpr('add', [Name('x'), Name('y')]). */
    constructor(parameters,body) {
        super(parameters,body);
        this.parameters = parameters;
        this.body = body;
    }

    eval(env) {
        return LamdbaFunction(this.parameters, this.body, env);
    }
}

class CallExpr extends Expr {
    /* A call expression represents a function call.

    The `operator` attribute is an instance of `Expr`.
    The `operands` attribute is a list of `Expr` instances.

    For example, the call expression `add(3, 4)` is parsed as

    CallExpr(Name('add'), [Literal(3), Literal(4)])

    where `operator` is Name('add') and `operands` are [Literal(3), Literal(4)].

    If that feels like a lot of comment, it's because I'm most worried about this one.
    */
    constructor(operator,operands) {
        super(operator,operands);
        this.operator = operator;
        this.operands = operands;
    }

    eval(env) {
        let func = this.operator.eval(env);
        let arguments = this.operands.map(this.operands.eval(env));
        return func.apply(arguments);
    }
}

class Value {
    /*(Values are the result of evaluating expressions. In an environment diagram,
    values appear on the right (either in a binding or off in the space to the
    right).

    In our interpreter, there are three types of values:
        - numbers (e.g. 42)
        - lambda functions, which are created by lambda expressions
        - primitive functions, which are functions that are built into the
            interpreter (e.g. add)

    In our code, the three types of values are subclasses of the `Value` class:
    Number, LambdaFunction, and PrimitiveFunction. */

    constructor(args) {
        this.args = args;
    }

    apply(arguments) {
        /*   Each subclass of Value implements its own apply method.

        Note that only functions can be "applied"; attempting to apply a
        `Number` (e.g. as in 4(2, 3)) will error.

        For functions, `arguments` is a list of `Value` instances, the
        arguments to the function. It should return a `Value` instance, the
        result of applying the function to the arguments.
        """ */
        throw {name : "NotImplementedError", message : "Prototype for value class"};  

    }
}

class Number extends Value {
    // A plain number
    constructor(value) {
        super(value);
        this.value = value;
    }
}

class LambdaFunction extends Value {
    /* A lambda function. Lambda functions are created in the LambdaExpr.eval
    method. A lambda function is a lambda expression that knows the
    environment in which it was evaluated in.

    The `parameters` attribute is a list of variable names (a list of strings).
    The `body` attribute is an instance of `Expr`, the body of the function.
    The `parent` attribute is an environment, a dictionary with variable names
        (strings) as keys and instances of the class Value as values. 

    I'm tired of writing these, are you tired of reading them? */

    constructor(parameters, body, parent) {
        super(parameters, body, parent);
        this.parameters = parameters;
        this.body = body;
        this.parent = parent;
    }

    apply(arguments) {
        if (this.parameters.length != arguments.length) {
            throw new TypeError("Mismatched number of args");
        }
        // TODO: THIS
    }
}

class PrimitiveFunction extends Value {
    constructor(operator) {
        super(operator);
        this.operator = operator;
    }

    apply(arguments) {
        let args = []
        for(const arg of arguments) {
            args.concat(arg);
        }
        return Number(this.operator(args));
    }
}

let global_env = {
    abs: PrimitiveFunction(operator.abs),
    add: PrimitiveFunction(operator.add),
    float: PrimitiveFunction(float),
    floordiv: PrimitiveFunction(operator.floordiv),
    int:  PrimitiveFunction(int),
    max: PrimitiveFunction(max),
    min: PrimitiveFunction(min),
    mod: PrimitiveFunction(operator.mod),
    mul: PrimitiveFunction(operator.multiply),
    pow: PrimitiveFunction(pow),
    sub: PrimitiveFunction(operator.subtract),
    truediv: PrimitiveFunction(operator.divide),
}
