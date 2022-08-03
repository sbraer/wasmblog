#include <iostream>
#include <emscripten/emscripten.h>
#include <emscripten/bind.h>

std::string GetString() {
    return "Hello World! from GetString";
}

class MyClass {
private:
    int _x;
public:
    MyClass(int x): _x{x} {}
    int GetX() const {
        return _x;
    }
};

template<typename T>
concept IsNumeric = std::is_arithmetic_v<T>;

IsNumeric auto GetSquare(IsNumeric auto num) {
    return num * num;
}
    
EMSCRIPTEN_BINDINGS(simple_example) {
    emscripten::function("GetString", &GetString);
    emscripten::class_<MyClass>("MyClass")
	    .constructor<int>()
        .function("GetX", &MyClass::GetX);
    emscripten::function("GetSquare", &GetSquare<int>);
}