#include "RoleExpression.h"
#include "Context.h"

RoleExpression::RoleExpression(const std::string& role) : role(role) {}

bool RoleExpression::interpret(const Context& context) const {
    return context.hasRole(role);
}

const std::string& RoleExpression::getRole() const {
    return role;
}
