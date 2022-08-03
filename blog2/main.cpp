#include <iostream>
#include <chrono> 
#include <iomanip>
#include <string>
#include <sstream>
#include <random>
#include <vector>
#include <emscripten/emscripten.h>
#include <emscripten/bind.h>
#include <emscripten/fetch.h>

/****************************************************************/
// Get date

std::string GetDateTime() {
    auto now = std::chrono::system_clock::now(); 
    auto in_time_t = std::chrono::system_clock::to_time_t(now); 

    std::stringstream s{}; 
    s << std::put_time(std::localtime(&in_time_t), "%Y-%m-%d %H:%M:%S %z"); 
    return s.str(); 
}

void GetDate() {
    std::string w = GetDateTime();
    const std::string finalText = "SetDate('" + w + "');";
    emscripten_run_script(finalText.c_str());
}

/****************************************************************/
// Fetch

void downloadSucceeded(emscripten_fetch_t *fetch) {
    printf("Finished downloading %llu bytes from URL %s.\n", fetch->numBytes, fetch->url);

    std::string s(fetch->data, fetch->numBytes);
    std::cout << s <<"\n";
    const std::string finalText = "WriteFetchResult1('" + s + "');";
    emscripten_run_script(finalText.c_str());

    emscripten_fetch_close(fetch); // Free data associated with the fetch.
}

void downloadFailed(emscripten_fetch_t *fetch) {
    printf("Downloading %s failed, HTTP failure status code: %d.\n", fetch->url, fetch->status);
    std::string s = std::to_string(fetch->status);
    const std::string finalText = "WriteFetchResult2('" + s + "');";
    emscripten_run_script(finalText.c_str());

    emscripten_fetch_close(fetch); // Also free data on failure.
}

void LoadFile1() {
    emscripten_fetch_attr_t attr;
    emscripten_fetch_attr_init(&attr);
    strcpy(attr.requestMethod, "GET");
    attr.attributes = EMSCRIPTEN_FETCH_LOAD_TO_MEMORY | EMSCRIPTEN_FETCH_PERSIST_FILE;
    attr.onsuccess = downloadSucceeded;
    attr.onerror = downloadFailed;
    emscripten_fetch(&attr, "data.json");
}
   
void LoadFile2() {
    emscripten_fetch_attr_t attr;
    emscripten_fetch_attr_init(&attr);
    strcpy(attr.requestMethod, "GET");
    attr.attributes = EMSCRIPTEN_FETCH_LOAD_TO_MEMORY | EMSCRIPTEN_FETCH_PERSIST_FILE;
    attr.onsuccess = downloadSucceeded;
    attr.onerror = downloadFailed;
    emscripten_fetch(&attr, "data_not_exist.json");
}

/****************************************************************/
// Mainloop
int _counter = 0;
void WriteMessageInBrowser() {
    std::string s = std::to_string(_counter);
    const std::string finalText = "WriteInfoMainLoop('" +  s + "');";
    emscripten_run_script(finalText.c_str());
    _counter += 1;
}

void StartMainLoop() {
    emscripten_set_main_loop(WriteMessageInBrowser,
        0,
        false);
}

void StopMainLoop() {
    emscripten_cancel_main_loop();
}

/****************************************************************/
// Bubble Sort
template<typename T>   
concept IsComparable = requires(T t)   
{   
    std::is_arithmetic_v<T>;
    t <=> t; 
}; 

template<IsComparable T>
void BubbleSortOrder(std::vector<T>& data)  {
    auto size = data.size();
    for (auto x = 0; x < size - 1; ++x) {
        for (auto y = x + 1; y < size; ++y) {
            if (data[x] > data[y]) {
                std::swap(data[x], data[y]);
            }
        }
    }
}

template<IsComparable T>
std::vector<T> GetBubbleSort(int size) {
    auto arr = std::vector<T>(size);
    srand (time(NULL));
    for (auto i = 0; i < size; ++i) {
        auto n = rand() % size + 1;
        arr[i] = n;
    }

    BubbleSortOrder(arr);
    return arr;
}

/****************************************************************/
// Quick sort
template<IsComparable T>
int Partition(std::vector<T> &v, int start, int end) {
	
	int pivot = end;
	int j = start;
	for(int i=start;i<end;++i){
		if(v[i]<v[pivot]){
			std::swap(v[i],v[j]);
			++j;
		}
	}
	std::swap(v[j],v[pivot]);
	return j;
	
}

// https://slaystudy.com/c-vector-quicksort/
template<IsComparable T>
void Quicksort(std::vector<T> &v, int start, int end ) {

	if(start<end){
		int p = Partition(v,start,end);
		Quicksort(v,start,p-1);
		Quicksort(v,p+1,end);
	}
	
}

template<IsComparable T>
std::vector<T> GetQuickSort(int size) {
    auto arr = std::vector<int>(size);
    srand (time(NULL));
    for (auto i = 0; i < size; ++i) {
        auto n = rand() % size + 1;
        arr[i] = n;
    }

    Quicksort(arr, 0, size - 1);
    return arr;
}

/****************************************************************/
// Binding

EMSCRIPTEN_BINDINGS(simple_example) {
    emscripten::function("GetDate", &GetDate);
    emscripten::function("LoadFile1", &LoadFile1);
    emscripten::function("LoadFile2", &LoadFile2);
    emscripten::function("StartMainLoop", &StartMainLoop);
    emscripten::function("StopMainLoop", &StopMainLoop);
    emscripten::function("GetBubbleSort", &GetBubbleSort<int>);
    emscripten::function("GetQuickSort", &GetQuickSort<int>);
    emscripten::register_vector<int>("vector<int>");
}