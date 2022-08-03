function GetString() {
    const msg = Module.GetString();
    console.log(msg);
    document.getElementById('output1').innerText = msg;
}

function CheckClass() {
    const myclass = new Module.MyClass(10);
    try {
        const x = myclass.GetX();
        console.log(x);
        document.getElementById('output2').innerText = x;
    }
    finally {
        myclass.delete();
    }
}

function GetSquare() {
    const msg = Module.GetSquare(10);
    console.log(msg);
    document.getElementById('output3').innerText = msg;
}
