#include "AndExpression.h"
#include "Context.h"

AndExpression::AndExpression(std::unique_ptr<Expression> left,
                             std::unique_ptr<Expression> right)
    : left(std::move(left)), right(std::move(right)) {}

bool AndExpression::interpret(const Context& context) const {
    return left->interpret(context) && right->interpret(context);
}
