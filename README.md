# Test code for my blog:
https://blogs.aspitalia.com/az/

# Static server
To install static server:
```
npm -g install static-server
```

# Blog1
To compile example with PowerShell:
```
cd blog1

docker run `
  --rm `
  -v ${PWD}:/src `
  emscripten/emsdk:3.1.17 `
  emcc main.cpp -o main.js  -O3 --std=c++20 --bind
```

To compile with Bash:
```
cd blog1

docker run \
  --rm \
  -v $(pwd):/src \
  emscripten/emsdk:3.1.17 \
  emcc main.cpp -o main.js  -O3 --std=c++20 --bind
```

# Blog2
To compile:
```
cd Blog2

docker run `
  --rm `
  -v ${PWD}:/src `
  emscripten/emsdk:3.1.17 `
  emcc main.cpp -o main.js  -O3 --std=c++20 --bind  -s FETCH=1
```

To compile with debug and map:
```
docker run `
  --rm `
  -v ${PWD}:/src `
  -e EMCC_DEBUG=1 `
  -e EMCC_AUTODEBUG=1 `
  emscripten/emsdk:3.1.17 `
  emcc main.cpp -o main.js --std=c++20 --bind  -s FETCH=1 -gsource-map
```
