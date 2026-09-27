#ifndef PARSER_H
#define PARSER_H

#include <memory>
#include <string>
#include "Expression.h"

class Parser {
private:
    std::string input;
    std::size_t position;

    void skipSpaces();
    bool matchWord(const std::string& word);
    std::string parseRole();
    std::unique_ptr<Expression> parseOr();
    std::unique_ptr<Expression> parseAnd();
    std::unique_ptr<Expression> parsePrimary();

public:
    explicit Parser(const std::string& input);
    std::unique_ptr<Expression> parse();
};

#endif
