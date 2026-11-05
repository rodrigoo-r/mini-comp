import Token, { TokenType } from './Token'

const tokenMap: Record<string, TokenType> = {
    "Given": TokenType.Given,
    "Reject": TokenType.Reject,
    "Strict": TokenType.Strict,
    "Such": TokenType.Such,

    "(": TokenType.LeftParen,
    ")": TokenType.RightParen,
    "{": TokenType.LeftBrace,
    "}": TokenType.RightBrace,
    ",": TokenType.Comma,
    ".": TokenType.Dot,
    "->": TokenType.Arrow,

    "<": TokenType.LessThan,
    ">": TokenType.GreaterThan,
    "<=": TokenType.LessThanOrEqual,
    ">=": TokenType.GreaterThanOrEqual,
    "==": TokenType.Equal,
    "!=": TokenType.NotEqual,
    
    "+": TokenType.Plus,
    "-": TokenType.Minus,
    "*": TokenType.Multiply,
    "/": TokenType.Divide
};

export default class Lexer {

    private current: string = "";
    private col: number = 1;

    private flush(res: Token[]) {
        if (this.current.length == 0) return;
        const token = tokenMap[this.current];
        
        if (token !== undefined) {
            res.push(
                new Token(
                    token, 
                    this.current,
                    this.col,
                    this.col + this.current.length
                )
            );
        }
        else {
            res.push(
                new Token(
                    TokenType.Identifier, 
                    this.current, 
                    this.col, 
                    this.col + 
                    this.current.length
                )
            );
        }

        this.col += this.current.length + 1;
        this.current = "";
    }

    public lex(input: string): Token[] {
        const tokens: Token[] = [];

        for (let i = 0; i < input.length; i++) {
            const char = input[i];

            if (
                (char === '-' && input[i + 1] === '>') ||
                (char === '<' && input[i + 1] === '=') ||
                (char === '>' && input[i + 1] === '=') ||
                (char === '=' && input[i + 1] === '=') ||
                (char === '!' && input[i + 1] === '=')
            ) {
                this.flush(tokens);
                this.current += char;
                this.current += input[i + 1];
                this.flush(tokens);
                i++; // Skip the next character
                continue;
            }

            if (
                char === '(' || char === ')' ||
                char === '{' || char === '}' ||
                char === ',' || char === '.' ||
                char === '<' || char === '>' ||
                char === '+' || char === '-' ||
                char === '*' || char === '/'
            ) {
                this.flush(tokens);
                this.current += char;
                this.flush(tokens);
                continue;
            }


            if (char === ' ' || char === '\n' || char === '\t') {
                this.flush(tokens);
                this.col++;
                continue;
            }

            if (
                char.charAt(0).toUpperCase() >= 'A'.charAt(0) && 
                char.charAt(0).toUpperCase() <= 'Z'.charAt(0)
            ) {
                this.current += char;
                continue;
            }

            // invalid token
            throw new Error(`Invalid token: ${char} @ index ${i}`);
        }

        // Flush any remaining token
        this.flush(tokens);
        this.col = 1;

        return tokens;
    }
    
}