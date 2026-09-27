#ifndef OR_EXPRESSION_H
#define OR_EXPRESSION_H

#include "Expression.h"
#include <memory>

class OrExpression : public Expression {
private:
    std::unique_ptr<Expression> left;
    std::unique_ptr<Expression> right;

public:
    OrExpression(std::unique_ptr<Expression> left,
                  std::unique_ptr<Expression> right);
    bool interpret(const Context& context) const override;
};

#endif
