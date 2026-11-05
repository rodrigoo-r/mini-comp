import { TokenType } from "./Token";

export default function TokenTypeToRegex(tokenType: TokenType): RegExp {
    switch (tokenType) {
        case TokenType.Given: return /Given/;
        case TokenType.Reject: return /Reject/;
        case TokenType.Strict: return /Strict/;
        case TokenType.Such: return /Such/;

        case TokenType.Identifier: return /[a-zA-Z_][a-zA-Z0-9_]*/;

        case TokenType.LeftParen: return /\(/;
        case TokenType.RightParen: return /\)/;
        case TokenType.LeftBrace: return /\{/;
        case TokenType.RightBrace: return /\}/;
        case TokenType.Comma: return /,/;
        case TokenType.Dot: return /\./;
        case TokenType.Arrow: return /->/;
        
        case TokenType.LessThan: return /</;
        case TokenType.GreaterThan: return />/;
        case TokenType.LessThanOrEqual: return /<=/;
        case TokenType.GreaterThanOrEqual: return />=/;
        case TokenType.Equal: return /=/;

        case TokenType.NotEqual: return /!=/;
        case TokenType.Plus: return /\+/;
        case TokenType.Minus: return /-/;
        case TokenType.Multiply: return /\*/;
        case TokenType.Divide: return /\//;

        case TokenType.StringLiteral: return /"(?:[^"\\]|\\.)*"/;
        case TokenType.NumberLiteral: return /[0-9]+/;

        default:
            throw new Error(`No regex defined for token type ${TokenType[tokenType]}`);
    }
}