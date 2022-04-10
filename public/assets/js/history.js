// history array
let history = [];
// current history idx
let historyIdx = -1;
// history length
let historyLength = 0;

let historyPush = (val) => {
    if (historyLength > 19) { //history array size is 20.
        //shift one element, push the current element
        history.shift(); history.push(val);
    }
    else {
        //increase the length and then push the current element
        historyLength++; history.push(val);
    }
}

// responsible for history push & pop
terminalInput.addEventListener('keydown', (event) => {
    // up key 
    if (event.keyCode == 38) { // 38 = arrow up key
        if (historyIdx > 0) historyIdx--;
        terminalInput.value = history[historyIdx];
    }
    // down key
    else if (event.keyCode == 40) { // 40 = arrow down key
        if (historyIdx < historyLength - 1) historyIdx++;
        terminalInput.value = history[historyIdx];
    }
    // enter key
    else if (event.keyCode == 13 && event.target.value !== '') { // 13 = enter key
        // if two consequetive inputs are not same then only push it to
        if (history[historyLength - 1] != event.target.value) {
            historyIdx = historyLength + 1;
            historyPush(event.target.value);
        }
        historyIdx = history.length;
    }
})
