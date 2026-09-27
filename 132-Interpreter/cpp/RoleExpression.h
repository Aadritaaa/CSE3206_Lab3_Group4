#ifndef ROLE_EXPRESSION_H
#define ROLE_EXPRESSION_H

#include "Expression.h"
#include <string>

class RoleExpression : public Expression {
private:
    std::string role;

public:
    explicit RoleExpression(const std::string& role);
    bool interpret(const Context& context) const override;
    const std::string& getRole() const;
};

#endif
