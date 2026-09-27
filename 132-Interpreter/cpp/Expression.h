#ifndef EXPRESSION_H
#define EXPRESSION_H

class Context;

class Expression {
public:
    virtual bool interpret(const Context& context) const = 0;
    virtual ~Expression() = default;
};

#endif
