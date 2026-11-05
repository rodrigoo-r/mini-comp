enum ASTRule {
    Program,

    RejectConclusion,
    StrictConclusion,

    EntityGroup,
    Entity,
    EntityProperty,

    Identifier,

    Condition,
    PropAccess,

    Expression,
    LessThan,
    GreaterThan,
    LessThanOrEqual,
    GreaterThanOrEqual,
    Equal,
    NotEqual,
    
    Add,
    Subtract,
    Multiply,
    Divide
}

export default class AST {
    public rule: ASTRule = ASTRule.Program;
    public value?: string;

    public children: AST[] = [];

    constructor(rule: ASTRule, value?: string) {
        this.rule = rule;
        this.value = value;
    }
}

export function astRuleToString(rule: ASTRule): string {
    switch (rule) {
        case ASTRule.Program: return "Program";
        
        case ASTRule.EntityGroup: return "EntityGroup";
        case ASTRule.RejectConclusion: return "RejectConclusion";
        case ASTRule.StrictConclusion: return "StrictConclusion";
        case ASTRule.Entity: return "Entity";
        case ASTRule.EntityProperty: return "EntityProperty";

        case ASTRule.Identifier: return "Identifier";
        
        case ASTRule.Condition: return "Condition";
        case ASTRule.PropAccess: return "PropAccess";

        case ASTRule.Expression: return "Expression";
        case ASTRule.LessThan: return "LessThan";
        case ASTRule.GreaterThan: return "GreaterThan";
        case ASTRule.LessThanOrEqual: return "LessThanOrEqual";
        case ASTRule.GreaterThanOrEqual: return "GreaterThanOrEqual";
        case ASTRule.Equal: return "Equal";
        case ASTRule.NotEqual: return "NotEqual";
        
        case ASTRule.Add: return "Add";
        case ASTRule.Subtract: return "Subtract";
        case ASTRule.Multiply: return "Multiply";
        case ASTRule.Divide: return "Divide";

        default: return "Unknown";
    }
}

export { ASTRule };