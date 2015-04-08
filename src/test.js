// Create commands.
code.start = function() {
    view.print("Testing...testing...`");
    view.print("Fred ate bread.`");
};

code.getInput = function() {
    code.message = null;
    code.message = keys.readLine();

    return code.message === null;
};

code.echoMessage = function() {
    view.print("`");
    view.print("You typed \"" + code.message + "\"");
};

// Create command list.
baja.add(code.start);
baja.addLoop(code.getInput);
baja.add(code.echoMessage);

baja.run();
