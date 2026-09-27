CXX = g++
CXXFLAGS = -std=c++17 -Wall -Wextra -pedantic
SRC = cpp/Context.cpp cpp/RoleExpression.cpp cpp/AndExpression.cpp cpp/OrExpression.cpp cpp/Parser.cpp

all:
	$(CXX) $(CXXFLAGS) $(SRC) cpp/main.cpp -o interpreter

test:
	$(CXX) $(CXXFLAGS) $(SRC) tests/test_interpreter.cpp -Icpp -o interpreter_tests
	./interpreter_tests

clean:
	rm -f interpreter interpreter_tests
