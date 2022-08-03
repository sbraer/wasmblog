const bt1 = document.getElementById('bt1');
const btFetch1 = document.getElementById('btFetch1');
const btFetch2 = document.getElementById('btFetch2');
const btStartMainLoop = document.getElementById('btStartMainLoop');
const btBubbleSortJs = document.getElementById('btBubbleSortJs');
const btBubbleSortWasm = document.getElementById('btBubbleSortWasm');
const btQuickSortJs = document.getElementById('btQuickSortJs');
const btQuickSortWasm = document.getElementById('btQuickSortWasm');

const spanDate = document.getElementById('spanDate');
const spanFetch1 = document.getElementById('spanFetch1');
const spanFetch2 = document.getElementById('spanFetch2');
const spanMainLoop = document.getElementById('spanMainLoop');
const spanBubbleSortJs = document.getElementById('spanBubbleSortJs');
const spanBubbleSortWasm = document.getElementById('spanBubbleSortWasm');
const spanQuickSortJs = document.getElementById('spanQuickSortJs');
const spanQuickSortWasm = document.getElementById('spanQuickSortWasm');

const txtBubbleSortJs = document.getElementById('txtBubbleSortJs');
const txtBubbleSortWasm = document.getElementById('txtBubbleSortWasm');
const txtQuickSortJs = document.getElementById('txtQuickSortJs');
const txtQuickSortWasm = document.getElementById('txtQuickSortWasm');

/****************************************************************/
// Get date
bt1.addEventListener('click', (e) => {
    e.preventDefault();
    Module.GetDate();
});

function SetDate(date) {
    spanDate.innerText = date;
}

/****************************************************************/
// Fetch
btFetch1.addEventListener('click', (e) => {
    e.preventDefault();
    Module.LoadFile1();
});

btFetch2.addEventListener('click', (e) => {
    e.preventDefault();
    Module.LoadFile2();
});

function WriteFetchResult1(text) {
    spanFetch1.innerText = text;
}

function WriteFetchResult2(text) {
    spanFetch2.innerText = text;
}

/****************************************************************/
// Mainloop

let mainLoopStarted = false;
btStartMainLoop.addEventListener('click', (e) => {
    e.preventDefault();

    if (mainLoopStarted) {
        Module.StopMainLoop();
        mainLoopStarted = false;
    }
    else {
        Module.StartMainLoop();
        mainLoopStarted = true;
    }
});

function WriteInfoMainLoop(text) {
    spanMainLoop.innerText = text;
}

/****************************************************************/
// Bubble sort
const numbersElements = 80000;
// Js
btBubbleSortJs.addEventListener('click', (e) => {
    e.preventDefault();
    txtBubbleSortJs.value = '';
    spanBubbleSortJs.innerText = '';

    const startTime = performance.now()
    
    const arr = GetRandomNumbers(numbersElements, numbersElements);    
    const arrOrdered = OrderArrayBubbleSortJs(arr);
    
    const endTime = performance.now()
    const time = endTime - startTime;
    spanBubbleSortJs.innerText = `${time.toFixed(2)} ms`;

    for (let i=0;i< arrOrdered.length && i < 220; i++) {
        txtBubbleSortJs.value += arrOrdered[i];
        txtBubbleSortJs.value += ' ';
    }
});

function GetRandomNumbers(arrayLength, maxValue) {
    const arr=[];
    for (let i=0; i<arrayLength; i++) {
        arr[i] = Math.floor(Math.random() * maxValue) + 1;
    }

    return arr;
}

function OrderArrayBubbleSortJs(arr) {
    const length=arr.length;
    for (let x = 0; x<length-1; x++) {
        for (let y=x+1; y<length; y++) {
            if (arr[x] > arr[y]) {
                const tmp = arr[x];
                arr[x] = arr[y];
                arr[y]=tmp;
            }
        }
    }

    return arr;
}

// WASM
btBubbleSortWasm.addEventListener('click', (e) => {
    e.preventDefault();

    txtBubbleSortWasm.value = '';
    spanBubbleSortWasm.innerText = '';

    const startTime = performance.now()

    const arr = Module.GetBubbleSort(numbersElements);
    
    const endTime = performance.now()
    const time = endTime - startTime;
    spanBubbleSortWasm.innerText = `${time.toFixed(2)} ms`;

    for (let i=0; i < arr.size() && i < 220; i++) {
        txtBubbleSortWasm.value += arr.get(i);
        txtBubbleSortWasm.value += ' ';
    }
});

/****************************************************************/
// Quick sort

// Js
btQuickSortJs.addEventListener('click', (e) => {
    e.preventDefault();
    txtQuickSortJs.value = '';
    spanQuickSortJs.innerText = '';

    const startTime = performance.now()

    const arr = GetRandomNumbers(numbersElements, numbersElements);    
    const arrOrdered = quickSort(arr, 0 , arr.length - 1);

    const endTime = performance.now()
    const time = endTime - startTime;
    spanQuickSortJs.innerText = `${time.toFixed(2)} ms`;

    for (let i=0;i< arrOrdered.length && i < 220; i++) {
        txtQuickSortJs.value += arrOrdered[i];
        txtQuickSortJs.value += ' ';
    }
});

// https://www.guru99.com/quicksort-in-javascript.html
function swap(items, leftIndex, rightIndex){
    var temp = items[leftIndex];
    items[leftIndex] = items[rightIndex];
    items[rightIndex] = temp;
}

function partition(items, left, right) {
    var pivot   = items[Math.floor((right + left) / 2)], //middle element
        i       = left, //left pointer
        j       = right; //right pointer
    while (i <= j) {
        while (items[i] < pivot) {
            i++;
        }
        while (items[j] > pivot) {
            j--;
        }
        if (i <= j) {
            swap(items, i, j); //sawpping two elements
            i++;
            j--;
        }
    }
    return i;
}

function quickSort(items, left, right) {
    var index;
    if (items.length > 1) {
        index = partition(items, left, right); //index returned from partition
        if (left < index - 1) { //more elements on the left side of the pivot
            quickSort(items, left, index - 1);
        }
        if (index < right) { //more elements on the right side of the pivot
            quickSort(items, index, right);
        }
    }
    return items;
}

// Wasm
btQuickSortWasm.addEventListener('click', (e) => {
    e.preventDefault();

    txtQuickSortWasm.value = '';
    spanQuickSortWasm.innerText = '';

    const startTime = performance.now()

    const arr = Module.GetQuickSort(numbersElements);
    
    const endTime = performance.now()
    const time = endTime - startTime;
    spanQuickSortWasm.innerText = `${time.toFixed(2)} ms`;

    for (let i=0; i< arr.size() && i < 220; i++) {
        txtQuickSortWasm.value += arr.get(i);
        txtQuickSortWasm.value += ' ';
    }

    const arrx = [1, 2, 3];
    Module.ReadThisArr(arrx);
});
