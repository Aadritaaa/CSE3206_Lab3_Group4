#include "Parser.h"
#include "AndExpression.h"
#include "OrExpression.h"
#include "RoleExpression.h"
#include <algorithm>
#include <cctype>
#include <stdexcept>

Parser::Parser(const std::string& input) : input(input), position(0) {}

void Parser::skipSpaces() {
    while (position < input.size() &&
           std::isspace(static_cast<unsigned char>(input[position]))) ++position;
}

bool Parser::matchWord(const std::string& word) {
    skipSpaces();
    if (input.compare(position, word.size(), word) != 0) return false;
    const std::size_t end = position + word.size();

    auto idChar = [](char c) {
        return std::isalnum(static_cast<unsigned char>(c)) || c == '_';
    };

    if (position > 0 && idChar(input[position - 1])) return false;
    if (end < input.size() && idChar(input[end])) return false;

    position = end;
    return true;
}

std::string Parser::parseRole() {
    skipSpaces();
    if (position >= input.size() ||
        !(std::isalpha(static_cast<unsigned char>(input[position])) ||
          input[position] == '_')) {
        throw std::runtime_error("Expected a role name.");
    }

    const std::size_t start = position;
    while (position < input.size() &&
           (std::isalnum(static_cast<unsigned char>(input[position])) ||
            input[position] == '_')) ++position;

    std::string role = input.substr(start, position - start);
    std::transform(role.begin(), role.end(), role.begin(),
                   [](unsigned char c) { return std::toupper(c); });

    if (role == "AND" || role == "OR")
        throw std::runtime_error("AND and OR are operators, not roles.");

    return role;
}

std::unique_ptr<Expression> Parser::parsePrimary() {
    skipSpaces();

    if (position < input.size() && input[position] == '(') {
        ++position;
        auto expression = parseOr();
        skipSpaces();
        if (position >= input.size() || input[position] != ')')
            throw std::runtime_error("Missing closing parenthesis.");
        ++position;
        return expression;
    }

    return std::make_unique<RoleExpression>(parseRole());
}

std::unique_ptr<Expression> Parser::parseAnd() {
    auto left = parsePrimary();

    while (true) {
        const std::size_t saved = position;
        if (!matchWord("AND")) {
            position = saved;
            break;
        }
        auto right = parsePrimary();
        left = std::make_unique<AndExpression>(std::move(left), std::move(right));
    }
    return left;
}

std::unique_ptr<Expression> Parser::parseOr() {
    auto left = parseAnd();

    while (true) {
        const std::size_t saved = position;
        if (!matchWord("OR")) {
            position = saved;
            break;
        }
        auto right = parseAnd();
        left = std::make_unique<OrExpression>(std::move(left), std::move(right));
    }
    return left;
}

std::unique_ptr<Expression> Parser::parse() {
    auto result = parseOr();
    skipSpaces();
    if (position != input.size())
        throw std::runtime_error("Unexpected token near position " +
                                 std::to_string(position) + ".");
    return result;
}
