// Keys ////////////////////////////////////////////////////////////////////////
keys.normal = {last: null, down:{}};
keys.special = {last: null, down: {}};
keys.lastCode = -1;
keys.got = "";
keys.input = null;
keys.inputOut = null;
keys.bWantsNewInput = true;

keys.readLine = function() {
    var retVal = "";
    
    retVal = keys.inputOut;
    keys.inputOut = null;
    
    return retVal;
};

keys.readKey = function() {
    var retVal = keys.got;
    
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
        }
    }
    else {
        // 'Normal' key.
        keys.got = String.fromCharCode(charCode);
        
        if (keys.bWantsNewInput) {
            keys.input = "";
            keys.bWantsNewInput = false;
        }
        
        keys.input += keys.got;
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

