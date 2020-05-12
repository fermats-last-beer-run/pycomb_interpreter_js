class Buffer {
    constructor(source) {
        this.index = 0;
        this.source = source;
    }

    pop_first() {
        /* Remove the next item from this and return it. If this has
        exhausted its source, returns null. */
        let current = this.current();
        this.index += 1
        return current
    }

    current() {
        if (this.index >= this.source.length) {
            return null;
        } else {
            return this.source[this.index];
        }
    }

    expect(expected) {
        actual = this.pop_first()
        if (expected !== actual) {
            Console.log("Big error");
        } else {
            return actual;
        }
    }
}