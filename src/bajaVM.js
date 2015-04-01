// Virtual Machine /////////////////////////////////////////////////////////////
baja.instructions   = []
baja.bStarted       = false;
baja.pc             = -1;    // Program counter
baja.current        = null;
baja.loopID         = -1;

baja.add = function(label, fn) {
    baja.instructions.push({type: "block", code: fn});
};

baja.addLoop = function(label, loop) {
    baja.instructions.push({type: "loop", code: loop});
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

baja.nextInstruction = function() {
    var instr = null;

    for (baja.pc += 1; baja.pc<baja.instructions.length; baja.pc++) {
        instr = baja.instructions[baja.pc];

        if (instr.type === "block") {
            instr.code();
        }
        else {
            baja.loop(instr.code);
            break;
        }
    }
};

baja.loop = function(program) {
    baja.current = program;
    baja.exec();
};

baja.exitLoop = function() {
    if (baja.current) {
        cancelAnimationFrame(baja.loopID);
        baja.current = null;
    }
    else {
        baja.nextInstruction();
    }
};

baja.exec = function() {
    if (baja.current) {
        baja.loopID = requestAnimationFrame(baja.exec);
        baja.current();
    }
    else {
        baja.nextInstruction();
    }
};
