#include "Context.h"
#include <algorithm>
#include <cctype>

void Context::addRole(const std::string& role) {
    std::string normalized = role;
    std::transform(normalized.begin(), normalized.end(), normalized.begin(),
                   [](unsigned char c) { return std::toupper(c); });
    roles.insert(normalized);
}

bool Context::hasRole(const std::string& role) const {
    std::string normalized = role;
    std::transform(normalized.begin(), normalized.end(), normalized.begin(),
                   [](unsigned char c) { return std::toupper(c); });
    return roles.find(normalized) != roles.end();
}
