#include "OrExpression.h"
#include "Context.h"

OrExpression::OrExpression(std::unique_ptr<Expression> left,
                           std::unique_ptr<Expression> right)
    : left(std::move(left)), right(std::move(right)) {}

bool OrExpression::interpret(const Context& context) const {
    return left->interpret(context) || right->interpret(context);
}
