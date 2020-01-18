export class StringReader {
    private string: string;
    private cursor: number;

    constructor(string: string | StringReader) {
        if (string instanceof StringReader) {
            this.string = string.getString();
            this.cursor = string.getCursor();
        } else {
            this.string = string;
            this.cursor = 0;
        }
    }

    getString(): string {
        return this.string;
    }

    getCursor(): number {
        return this.cursor;
    }

    setCursor(cursor: number): void {
        this.cursor = cursor;
    }

    getRemainingLength(): number {
        return this.string.length - this.cursor;
    }

    getTotalLength(): number {
        return this.string.length;
    }

    getRead(): string {
        return this.string.substring(0, this.cursor);
    }

    getRemaining(): string {
        return this.string.substring(this.cursor);
    }

    canRead(length = 1): boolean {
        return this.cursor + length <= this.string.length;
    }

    peek(offset = 0): string {
        return this.string.charAt(this.cursor + offset);
    }

    read(): string {
        const char =  this.string.charAt(this.cursor);
        this.cursor += 1;
        return char;
    }

    skip(): void {
        this.cursor += 1;
    }

    isAllowedNumber(c: string): boolean {
        return c >= "0" && c <= "9" || c === "." || c === "-";
    }

    readInt(): number {
        const start = this.cursor;
        while (this.canRead() && this.isAllowedNumber(this.peek())) {
            this.skip();
        }
        const number = this.string.substring(start, this.cursor);
        // TODO: Throw exceptions
        return parseInt(number);
    }
    
    isAllowedInUnquotedString(c: string): boolean {
        return c >= "0" && c <= "9"
            || c >= "A" && c <= "Z"
            || c >= "a" && c <= "z"
            || c == "_" || c == "-"
            || c == "." || c == "+";
    }

    isQuotedStringStart(c: string): boolean {
        return c === "'" || c === "\"";
    }

    readUnquotedString(): string {
        const start = this.cursor;
        while (this.canRead() && this.isAllowedInUnquotedString(this.peek())) {
            this.skip();
        }
        return this.string.substring(start, this.cursor);
    }

    readStringUntil(terminator: string): string {
        let result = [];
        let escaped = false;
        while (this.canRead()) {
            const c = this.read();
            if (escaped) {
                if (c === terminator || c === "\\") {
                    result.push(c);
                    escaped = false;
                } else {
                    this.setCursor(this.cursor - 1);
                    // TODO: Throw exception
                }
            } else if (c === "\\") {
                escaped = true;
            } else if (c === terminator) {
                return result.join("");
            } else {
                result.push(c);
            }
        }
    }

    readString(): string {
        if (!this.canRead()) {
            return "";
        }
        const next = this.peek();
        if (this.isQuotedStringStart(next)) {
            this.skip();
            return this.readStringUntil(next);
        }
        return this.readUnquotedString();
    }

    readBoolean(): boolean {
        const start = this.cursor;
        const value = this.readUnquotedString();
        if (value === "true") {
            return true
        } else if (value === "false") {
            return false
        } else {
            // TODO: Throw exception
        }
    }

}