# C++ Interpreter Implementation

Classes:
- `Expression` - abstract expression
- `RoleExpression` - terminal expression
- `AndExpression` - non-terminal expression
- `OrExpression` - non-terminal expression
- `Context` - stores roles
- `Parser` - builds an expression tree from a rule
- `main.cpp` - client/demo

Build:
```bash
g++ -std=c++17 *.cpp -o interpreter
```
