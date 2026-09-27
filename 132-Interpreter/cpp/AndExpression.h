#ifndef AND_EXPRESSION_H
#define AND_EXPRESSION_H

#include "Expression.h"
#include <memory>

class AndExpression : public Expression {
private:
    std::unique_ptr<Expression> left;
    std::unique_ptr<Expression> right;

public:
    AndExpression(std::unique_ptr<Expression> left,
                   std::unique_ptr<Expression> right);
    bool interpret(const Context& context) const override;
};

#endif
