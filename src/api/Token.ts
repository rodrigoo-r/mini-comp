// @ts-ignore
enum TokenType {
    Given,
    Reject,
    Strict,
    Such,

    Identifier,

    StringLiteral,
    NumberLiteral,

    LeftParen,
    LeftBrace,
    RightParen,
    RightBrace,
    Comma,
    Dot,
    Arrow,

    LessThan,
    GreaterThan,
    LessThanOrEqual,
    GreaterThanOrEqual,
    Equal,
    NotEqual,
    
    Plus,
    Minus,
    Multiply,
    Divide,
};

export default class Token {
    type: TokenType;
    value: string;
    col_start: number = 0;
    col_end: number = 0;

    constructor(
        type: TokenType, 
        value: string,
        col_start: number,
        col_end: number
    ) {
        this.type = type;
        this.value = value;
        this.col_start = col_start;
        this.col_end = col_end;
    }
}

export function tokenTypeToString(type: TokenType): string {
    switch (type) {
        case TokenType.Given: return "Given";
        case TokenType.Reject: return "Reject";
        case TokenType.Strict: return "Strict";
        case TokenType.Such: return "Such";

        case TokenType.Identifier: return "Identifier";

        case TokenType.LeftParen: return "LeftParen";
        case TokenType.RightParen: return "RightParen";
        case TokenType.LeftBrace: return "LeftBrace";
        case TokenType.RightBrace: return "RightBrace";
        case TokenType.Comma: return "Comma";
        case TokenType.Dot: return "Dot";
        case TokenType.Arrow: return "Arrow";

        case TokenType.LessThan: return "LessThan";
        case TokenType.GreaterThan: return "GreaterThan";
        case TokenType.LessThanOrEqual: return "LessThanOrEqual";
        case TokenType.GreaterThanOrEqual: return "GreaterThanOrEqual";
        case TokenType.Equal: return "Equal";
        case TokenType.NotEqual: return "NotEqual";

        case TokenType.Plus: return "Plus";
        case TokenType.Minus: return "Minus";
        case TokenType.Multiply: return "Multiply";
        case TokenType.Divide: return "Divide";

        case TokenType.StringLiteral: return "StringLiteral";
        case TokenType.NumberLiteral: return "NumberLiteral";
    }
}

export function getTokenClass(type: TokenType): string {
    switch (type) {
        case TokenType.Given:
        case TokenType.Reject:
        case TokenType.Strict: 
        case TokenType.Such: 
            return "token-keyword";

        case TokenType.StringLiteral:
        case TokenType.Identifier: 
            return "token-identifier";
        
        case TokenType.NumberLiteral:
        case TokenType.LeftBrace:
        case TokenType.RightBrace:
        case TokenType.Comma:
        case TokenType.Dot:
        case TokenType.Arrow:
        case TokenType.LessThan:
        case TokenType.GreaterThan:
        case TokenType.LessThanOrEqual:
        case TokenType.GreaterThanOrEqual:
        case TokenType.Equal:
        case TokenType.NotEqual:
        case TokenType.Plus:
        case TokenType.Minus:
        case TokenType.Multiply:
        case TokenType.Divide:
        case TokenType.LeftParen: 
        case TokenType.RightParen:
            return "token-punctuation";
    }
}

export { TokenType };