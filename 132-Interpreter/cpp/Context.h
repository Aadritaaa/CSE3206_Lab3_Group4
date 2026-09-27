#ifndef CONTEXT_H
#define CONTEXT_H

#include <set>
#include <string>

class Context {
private:
    std::set<std::string> roles;

public:
    void addRole(const std::string& role);
    bool hasRole(const std::string& role) const;
};

#endif
