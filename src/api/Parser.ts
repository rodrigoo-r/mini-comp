import Token, { TokenType } from "./Token";
import AST, { ASTRule } from "./AST";
import Stream from "./Stream";

export default class Parser {

    private expect(tokens: Stream<Token>, expectedType: TokenType): Token {
        const token = tokens.next();
        if (!token || token.type !== expectedType) {
            throw new Error(`Expected token of type ${TokenType[expectedType]}, but got ${token ? TokenType[token.type] : "null"}`);
        }

        return token;
    }

    private parseGiven(tokens: Stream<Token>): AST {
        this.expect(tokens, TokenType.Given);
        const givenNode = new AST(ASTRule.EntityGroup);
        this.expect(tokens, TokenType.LeftParen);
        
        while (tokens.hasNext()) {
            let peek = tokens.peek();
            if (!peek || peek.type === TokenType.RightParen) {
                if (peek?.type === TokenType.RightParen) tokens.next();
                break;
            }

            const entityName = this.expect(tokens, TokenType.Identifier);
            const entityNode = new AST(ASTRule.Entity, entityName.value);

            const entityLocalName = this.expect(tokens, TokenType.Identifier);
            const localNameNode = new AST(ASTRule.Identifier, entityLocalName.value);
            entityNode.children.push(localNameNode);

            this.expect(tokens, TokenType.LeftBrace);
            while (tokens.hasNext()) {
                const next = tokens.next()!;
                if (next.type == TokenType.RightBrace) break;
                if (next.type !== TokenType.Identifier) {
                    throw new Error(`Expected identifier for entity property, but got ${TokenType[next.type]}`);
                }

                const propertyNode = new AST(ASTRule.EntityProperty, next.value);
                entityNode.children.push(propertyNode);

                const peek = tokens.peek();
                if (peek && peek.type === TokenType.Comma) {
                    tokens.next(); // Consume the comma
                }
            }

            givenNode.children.push(entityNode);
            peek = tokens.peek();
            if (!peek || peek.type !== TokenType.Comma) {
                if (peek?.type === TokenType.RightParen) tokens.next();
                break;
            }

            tokens.next(); // Consume the comma
        }
        
        return givenNode;
    }

    private parseSuch(tokens: Stream<Token>): AST {
        this.expect(tokens, TokenType.Such);
        this.expect(tokens, TokenType.LeftParen);
        
        const suchThatNode = new AST(ASTRule.Condition);
        suchThatNode.children.push(this.parseExpression(tokens));
        this.expect(tokens, TokenType.RightParen);

        return suchThatNode;
    }

    private parseExpression(tokens: Stream<Token>): AST {
        const statementNode = new AST(ASTRule.Expression);
        
        const candidateToken = tokens.next()!;
        if (
            !candidateToken || 
            (
                candidateToken.type !== TokenType.Identifier &&
                candidateToken.type !== TokenType.NumberLiteral &&
                candidateToken.type !== TokenType.StringLiteral
            )
        ) {
            throw new Error(`Expected identifier, number literal, or string literal, but got ${candidateToken ? TokenType[candidateToken.type] : "null"}`);
        }

        let candidate = new AST(ASTRule.Identifier, candidateToken.value);
        switch (candidateToken.type) {
            case TokenType.Identifier:
                candidate.rule = ASTRule.Identifier;
                break;
            case TokenType.NumberLiteral:
                candidate.rule = ASTRule.NumberLiteral;
                break;
            case TokenType.StringLiteral:
                candidate.rule = ASTRule.StringLiteral;
                break;
        }

        if (candidate.rule !== ASTRule.Identifier) return candidate;

        if (tokens.hasNext()) {
            let nextToken = tokens.peek()!;
            
            while (nextToken.type === TokenType.Dot) {
                tokens.next(); // Consume the dot
                const propertyToken = this.expect(tokens, TokenType.Identifier);
                const propertyNode = new AST(ASTRule.PropAccess, propertyToken.value);

                propertyNode.children.push(candidate);
                propertyNode.children.push(new AST(ASTRule.Identifier, propertyToken.value));

                candidate = propertyNode;
                nextToken = tokens.peek()!;

                if (!nextToken) break;
            }

            while (
                nextToken.type == TokenType.Plus ||
                nextToken.type == TokenType.Minus ||
                nextToken.type == TokenType.Multiply ||
                nextToken.type == TokenType.Divide
            ) {
                tokens.next(); // Consume the operator
                const operatorNode = new AST(ASTRule.Add, nextToken.value);

                switch (nextToken.type) {
                    case TokenType.Plus:
                        operatorNode.rule = ASTRule.Add;
                        break;
                    case TokenType.Minus:
                        operatorNode.rule = ASTRule.Subtract;
                        break;
                    case TokenType.Multiply:
                        operatorNode.rule = ASTRule.Multiply;
                        break;
                    case TokenType.Divide:
                        operatorNode.rule = ASTRule.Divide;
                        break;
                }

                operatorNode.children.push(candidate);
                operatorNode.children.push(this.parseExpression(tokens));

                candidate = operatorNode;
                nextToken = tokens.peek()!;
                if (!nextToken) break;
            }

            if (
                nextToken.type === TokenType.Equal ||
                nextToken.type === TokenType.NotEqual ||
                nextToken.type === TokenType.LessThan ||
                nextToken.type === TokenType.GreaterThan ||
                nextToken.type === TokenType.LessThanOrEqual ||
                nextToken.type === TokenType.GreaterThanOrEqual
            ) {
                tokens.next(); // Consume the operator
                const operatorNode = new AST(ASTRule.Add, nextToken.value);

                switch (nextToken.type) {
                    case TokenType.Equal:
                        operatorNode.rule = ASTRule.Equal;
                        break;
                    case TokenType.NotEqual:
                        operatorNode.rule = ASTRule.NotEqual;
                        break;
                    case TokenType.LessThan:
                        operatorNode.rule = ASTRule.LessThan;
                        break;
                    case TokenType.GreaterThan:
                        operatorNode.rule = ASTRule.GreaterThan;
                        break;
                    case TokenType.LessThanOrEqual:
                        operatorNode.rule = ASTRule.LessThanOrEqual;
                        break;
                    case TokenType.GreaterThanOrEqual:
                        operatorNode.rule = ASTRule.GreaterThanOrEqual;
                        break;
                }

                operatorNode.children.push(candidate);
                operatorNode.children.push(this.parseExpression(tokens));
                candidate = operatorNode;

                nextToken = tokens.peek()!;
                if (!nextToken) {
                    statementNode.children.push(operatorNode);
                    return statementNode;
                }
            }
        }

        statementNode.children.push(candidate);
        return statementNode;
    }

    private parseConclusion(tokens: Stream<Token>): AST {
        const conclusionNode = new AST(ASTRule.RejectConclusion);
        const conclusionToken = tokens.hasNext() ? tokens.next()! : null;

        if (
            !conclusionToken || 
            (
                conclusionToken.type !== TokenType.Reject &&
                conclusionToken.type !== TokenType.Strict
            )
        ) {
            throw new Error(`Expected conclusion token (Reject or Strict), but got ${conclusionToken ? TokenType[conclusionToken.type] : "null"}`);
        }

        switch (conclusionToken.type) {
            case TokenType.Reject:
                conclusionNode.rule = ASTRule.RejectConclusion;
                break;
            case TokenType.Strict:
                conclusionNode.rule = ASTRule.StrictConclusion;
                break;
        }
        
        conclusionNode.value = conclusionToken.value;
        return conclusionNode;
    }

    public parse(base: Token[]): AST {
        let tokens = new Stream(base);
        let res = new AST(ASTRule.Program);

        res.children.push(this.parseGiven(tokens));
        this.expect(tokens, TokenType.Arrow);
        res.children.push(this.parseSuch(tokens));
        this.expect(tokens, TokenType.Arrow);
        const conclusionNode = this.parseConclusion(tokens);

        while (res.children.length > 0) {
            conclusionNode.children.push(res.children.pop()!);
        }
        
        return conclusionNode;
    }

}