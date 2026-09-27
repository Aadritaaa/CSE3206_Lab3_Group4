#include <cassert>
#include <iostream>
#include "../cpp/Context.h"
#include "../cpp/Parser.h"

void testAdminAndEditorTrue() {
    Context c; c.addRole("ADMIN"); c.addRole("EDITOR");
    Parser p("ADMIN AND EDITOR");
    auto e = p.parse();
    assert(e->interpret(c));
}

void testAdminAndEditorFalse() {
    Context c; c.addRole("ADMIN");
    Parser p("ADMIN AND EDITOR");
    auto e = p.parse();
    assert(!e->interpret(c));
}

void testEditorOrModeratorTrue() {
    Context c; c.addRole("EDITOR");
    Parser p("EDITOR OR MODERATOR");
    auto e = p.parse();
    assert(e->interpret(c));
}

void testNestedTrue() {
    Context c; c.addRole("ADMIN"); c.addRole("EDITOR");
    Parser p("ADMIN AND (EDITOR OR MODERATOR)");
    auto e = p.parse();
    assert(e->interpret(c));
}

void testNestedFalse() {
    Context c; c.addRole("ADMIN");
    Parser p("ADMIN AND (EDITOR OR MODERATOR)");
    auto e = p.parse();
    assert(!e->interpret(c));
}

void testPrecedence() {
    Context c; c.addRole("ADMIN");
    Parser p("ADMIN OR EDITOR AND MODERATOR");
    auto e = p.parse();
    assert(e->interpret(c));
}

int main() {
    testAdminAndEditorTrue();
    testAdminAndEditorFalse();
    testEditorOrModeratorTrue();
    testNestedTrue();
    testNestedFalse();
    testPrecedence();

    std::cout << "All Interpreter tests passed.\n";
    return 0;
}
