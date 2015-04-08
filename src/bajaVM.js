// Virtual Machine /////////////////////////////////////////////////////////////
baja.instructions   = []
baja.bStarted       = false;
baja.pc             = -1;    // Program counter
baja.fnIndex        = 0;
baja.loopingRoutine = null;

// OS Commands /////////////////////////////////////////////////////////////////
baja.add = function(fn, label) {
    baja.instructions.push({type: "block", code: fn, label: label || "fn" + baja.fnIndex});
    baja.fnIndex += 1;
};

// Loop code, when added, will continue to execute as long as it returns 'true'.
baja.addLoop = function(loop, label) {
    baja.instructions.push({type: "loop", code: loop, label: label || "fn" + baja.fnIndex});
    baja.fnIndex += 1;
};

baja.run = function() {
    if (!baja.bStarted) {
        view.create();
        baja.bStarted = true;
    }

    baja.pc = -1;
    view.clear();
    baja.nextInstruction();
};

// Runtime Commands ////////////////////////////////////////////////////////////
baja.goto = function(label) {
    var i;

    label = label.toUpperCase();

    for (i=0; i<baja.instructions.length; ++i) {
        if (baja.instructions[i] &&
            baja.instructions[i].label.toUpperCase() === label) {
            baja.pc = i - 1;
            baja.loopingRoutine = false;
            break;
        }
    }
};

baja.end = function() {
    if (baja.loopingRoutine) {
        baja.loopingRoutine = null;
    }
    else {
        baja.nextInstruction();
    }
};

// Interal Methods /////////////////////////////////////////////////////////////
baja.loop = function() {
    if (baja.loopingRoutine) {
        if (baja.loopingRoutine()) {
            // Check for existence of loopingRoutine again, in case it was
            // nulled out during execution of the routine.
            if (baja.loopingRoutine) {
                requestAnimationFrame(baja.loop);
            }
            else {
                baja.nextInstruction();
            }
        }
        else {
            baja.nextInstruction();
        }
    }
    else {
        baja.nextInstruction();
    }
};

baja.nextInstruction = function() {
    var instr = null;

    for (baja.pc += 1; baja.pc<baja.instructions.length; baja.pc++) {
        instr = baja.instructions[baja.pc];

        view.resetBlink();
        baja.bForcedBreak = false;

        if (instr.type === "block") {
            instr.code();
        }
        else {
            baja.loopingRoutine = instr.code;
            baja.loop();
            break;
        }
    }
};
