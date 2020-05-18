import {Buffer} from './module/buffer.js'
import * as expr from './module/expr.js'

const lower_alphabet = "abcdefghijklmnopqrstuvwxyz";
const upper_alphabet = lower_alphabet.toUpperCase();
const digits = "0123456789";
const SYMBOL_STARTS = new Set(upper_alphabet + lower_alphabet + '_');
const SYMBOL_INNERS = new Set(SYMBOL_STARTS + digits);
const NUMERAL = new Set(digits + '.-');
const WHITESPACE = new Set('\t\n\r');
const DELIMITERS = new Set('(),:');

function read(s) {
    /* Parse an expression from a string. If the string does
    not contain an expression, null is returned. If the string
    cannot be parsed, an error is raised. */

    let src = Buffer(tokenize(s));
    if (src.current() !== null) {
        return read_expr(src);
    }
}

// ############### LEXER #######################
function tokenize(s) {
    // Splits the string s into tokens and returns a list of them

    let src = Buffer(s);
    let tokens = [];
    while(true) {
        token = next_token(src);
        if(token === null) {
            return tokens;
        }
        tokens.concat(token);
    }
}

function take(src, allowed_characters) {
    let result = '';
    while (allowed_characters.includes(src.current())) {
        result = result + src.pop_first();
    }
    return result;
}

function next_token(src) {
    take(src, WHITESPACE);
    let c = src.current();
    if(c === null) {
        return null;
    } else if (NUMERAL.includes(c)) {
        literal = take(src, NUMERAL);
        return int(literal);
    } else if (SYMBOL_STARTS.includes(c)){
        return take(src, SYMBOL_INNERS);
    } else if (DELIMITERS.includes(c)) {
        src.pop_first();
        return c;
    }
}

function is_literal(s) {
    return typeof s == 'number';
}

function is_name(s) {
    return typeof s == 'string' && !DELIMITERS.includes(s) && s !== 'lambda';
}

// ################### PARSER ####################
function read_expr(src) {
    let token = src.pop_first();
    if(token === null) {
        throw new SyntaxError('Incomplete expression');
    } else if(is_literal(token)) {
        return read_call_expr(src, Literal(token));
    } else if(is_name(token)) {
        return read_call_expr(src, Name(token));
    } else if(token == 'lambda') {
        let params = read_comma_separated(src, read_param);
        src.expect(':');
        let body = read_expr(src);
        return LambdaExpr(parms, body);
    } else if(token == '(') {
        let inner_expr = read_expr(src)
        src.expect(')');
        return read_call_expr(src, inner_expr);
    } else {
        throw new SyntaxError("Not the start of an expression!");
    }
}

function read_comma_separated(src, reader) {
    if (':)'.includes(src.current())){
        return [];
    }
    else {
        let s = [reader(src)];
        while(src.current() == ',') {
            src.pop_first();
            s.concat(reader(src));
        }
        return s;
    }
}

function read_call_expr(src,operator) {
    while(src.current() == '(' ){
        src.pop_first()
        let operands = read_comma_separated(src, read_expr);
        src.expect(')');
        let operator = CallExpr(operator, operands);
    }
}

function read_param(src) {
    let token = src.pop_first();
    if (is_name(token)) {
        return token;
    } else {
        throw new SyntaxError("Got wrong parameter name!");
    }
}
