# Role-Based Access Control Interpreter

CSE 3206 Software Engineering Sessional - Lab 3
Group 4 - Interpreter Pattern
Rajshahi University of Engineering & Technology (RUET)

## Overview
A demonstration of the Interpreter Design Pattern through a role-based access-control system.

Supported rules:
- `ADMIN`
- `ADMIN AND EDITOR`
- `EDITOR OR MODERATOR`
- `ADMIN AND (EDITOR OR MODERATOR)`

## Pattern Mapping
| Interpreter Role | Project Class |
|---|---|
| Abstract Expression | `Expression` |
| Terminal Expression | `RoleExpression` |
| Non-Terminal Expression | `AndExpression`, `OrExpression` |
| Context | `Context` |
| Client / Parser | `main.cpp`, `Parser` |

## C++ Build
```bash
g++ -std=c++17 cpp/*.cpp -o interpreter
./interpreter
```

## Tests
```bash
g++ -std=c++17 cpp/*.cpp tests/test_interpreter.cpp -Icpp -o interpreter_tests
./interpreter_tests
```

## Web Demo
Open `web/index.html` in a modern browser. No server is required.

## Grammar
```text
expression := orExpression
orExpression := andExpression ("OR" andExpression)*
andExpression := primary ("AND" primary)*
primary := ROLE | "(" expression ")"
```

## Repository
```text
interpreter-access-control/
├── README.md
├── QUICK_START.md
├── LICENSE
├── .gitignore
├── Makefile
├── cpp/
├── web/
├── tests/
├── docs/
└── screenshots/
```

The project is a CSE 3206 design-pattern demonstration, not a production authentication framework.
