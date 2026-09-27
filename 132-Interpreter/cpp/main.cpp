#include <iostream>
#include <string>
#include "Context.h"
#include "Parser.h"

int main() {
    Context user;
    user.addRole("ADMIN");
    user.addRole("EDITOR");

    const std::string rule = "ADMIN AND (EDITOR OR MODERATOR)";

    try {
        Parser parser(rule);
        auto expression = parser.parse();
        bool result = expression->interpret(user);

        std::cout << "Role-Based Access Control Interpreter\n";
        std::cout << "-------------------------------------\n";
        std::cout << "User roles: ADMIN, EDITOR\n";
        std::cout << "Rule: " << rule << "\n\n";
        std::cout << "Result: "
                  << (result ? "ACCESS GRANTED" : "ACCESS DENIED")
                  << '\n';
    } catch (const std::exception& ex) {
        std::cerr << "Error: " << ex.what() << '\n';
        return 1;
    }

    return 0;
}
