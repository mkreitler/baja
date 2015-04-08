// Keys ////////////////////////////////////////////////////////////////////////
keys.normal = {last: null, down:{}};
keys.special = {last: null, down: {}};
keys.lastCode = -1;
keys.got = "";
keys.input = null;
keys.inputOut = null;
keys.minCol = 0;
keys.bWantsNewInput = true;
keys.INPUT_STATES = {NONE: 0,
                     READ_LINE: 1,
                     READ_KEY: 2};
keys.inputState = keys.INPUT_STATES.NONE;

keys.readLine = function() {
    var retVal = "";

    if (keys.inputState != keys.INPUT_STATES.READ_LINE) {
        keys.minCol = view.col;
    }

    keys.inputState = keys.INPUT_STATES.READ_LINE;
    
    retVal = keys.inputOut;
    keys.inputOut = null;
    view.blink();
    
    return retVal;
};

keys.readKey = function() {
    var retVal = keys.got;

    keys.inputState = keys.INPUT_STATES.READ_KEY;
    
    if (retVal.length > 1) {
        if (retVal === "space") {
            retVal = " ";
        }
    }

    keys.got = "";
    return retVal;
};

keys.readInput = function() {   // Legacy
    return keys.readLine();
};

keys.get = function() {         // Legacy
    return keys.readKey();
};

keys.onPress = function(e) {
    var charCode = e.which || e.keyCode,
        specialCode = keys.special.last;
    
    if (specialCode) {
        // User pressed a special key.
        keys.got = specialCode;
        
        if (specialCode === "enter" || specialCode === "return") {
            keys.inputOut = keys.input;
            keys.bWantsNewInput = true;
            keys.got = view.NEWLINE;
            keys.inputState = keys.INPUT_STATES.NONE;
        }
        else if (specialCode === "space") {
            if (keys.bWantsNewInput) {
                keys.input = "";
                keys.bWantsNewInput = false;
            }

            view.clearBlink();
            keys.input += " ";
        }
    }
    else {
        // 'Normal' key.
        keys.got = String.fromCharCode(charCode);
        
        if (keys.bWantsNewInput) {
            keys.input = "";
            keys.bWantsNewInput = false;
        }
        
        view.clearBlink();
        keys.input += keys.got;
    }

    if (keys.inputState === keys.INPUT_STATES.READ_LINE) {
        view.cursorTo(view.row, keys.minCol);
        view.print(keys.input);
        view.cursorTo(view.row, keys.minCol + keys.input.length);
    }
};

keys.onDown = function(e) {
    var keyCode = e.which || e.keyCode,
        specialCode = keys.codes["" + keyCode];
    
    keys.lastCode = keyCode;
    
    if (specialCode) {
        // User pressed a special key.
        keys.special.last = specialCode;
        keys.special.down[specialCode] = true;
        keys.normal.last = "";
        keys.got = specialCode;

        if (keys.inputState === keys.INPUT_STATES.READ_LINE) {
            if (specialCode === "left" ||
                specialCode === "backspace" ||
                specialCode === "del") {

                view.clearBlink();
                keys.input = keys.input.substring(0, keys.input.length - 1);
                if (view.col > keys.minCol) {
                    view.cursorMove(0, -1);
                }
            }
        }
    }
    else {
        // 'Normal' key.
        keys.normal.last = String.fromCharCode(keys.lastCode);
        keys.normal.down[keys.normal.last] = true;
        keys.special.last = "";
    }
};

keys.onUp = function(e) {
    var keyCode = e.which || e.keyCode,
        specialCode = keys.codes["" + keyCode];
    
    keys.lastCode = keyCode;
    
    if (specialCode) {
        // User pressed a special key.
        keys.special.down[specialCode] = false;
    }
    else {
        // 'Normal' key.
        keys.normal.down[String.fromCharCode(keys.lastCode)] = false;
    }
};

keys.codes = {
  3:  "cancel",
  6:  "help",
  8:  "backspace",
  9:  "tab",
  12: "clear",
  13: "return",
  14: "enter",
  16: "shift",
  17: "control",
  18: "alt",
  19: "pause",
  20: "caps lock",
  27: "escape",
  32: "space",
  33: "page up",
  34: "page down",
  35: "end",
  36: "home",
  37: "left",
  38: "up",
  39: "right",
  40: "down",
  44: "printscreen",
  45: "insert",
  46: "delete",
};

document.addEventListener("keydown", keys.onDown, true);
document.addEventListener("keyup", keys.onUp, true);
document.addEventListener("keypress", keys.onPress, true);

