# Tests

The tests use standard C++ `assert`.

Build from the repository root:
```bash
g++ -std=c++17 cpp/*.cpp tests/test_interpreter.cpp -Icpp -o interpreter_tests
```

Run:
```bash
./interpreter_tests
```
