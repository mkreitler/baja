// View ////////////////////////////////////////////////////////////////////////
// Get canvas and resize to fit window.
view.NEWLINE = "`";
view.canvas = null;
view.ctxt = null;
view.columns = 80;
view.rows = 25;
view.COL_TO_CHAR = 12 / 20;
view.COL_TO_CHAR_SPACING = 11.69 / 20;
view.BLINK_INTERVAL = 0.67; // 2/3 of a second
view.backColor = "black";
view.foreColor = "green";
view.fontSize = 1;
view.row = 0;
view.col = 0;
view.fontInfo = null;
view.bCursorOn = false;
view.blinkTimer = 0;
view.blinkClock = 0;
view.cellSize = {width: 0, height: 0};

view.create = function() {
    view.canvas = document.createElement('canvas');
    document.body.appendChild(view.canvas);
    view.ctxt = view.canvas.getContext("2d");
    view.ctxt.textBaseline = "top";
    view.resize();
};
view.resetBlink = function() {
    view.blinkTimer = 0;
    view.blinkClock = Date.now();
    view.bCursorOn = false;
};
view.clearBlink = function() {
    var x, y;

    view.ctxt.fillStyle = view.backColor;
    x = view.xFromCol(view.col);
    y = view.yFromRow(view.row);
    view.ctxt.fillRect(x, y, view.cellSize.width, view.cellSize.height);
};
view.blink = function() {
    var now = Date.now(),
              x,
              y;

    view.blinkTimer += (now - view.blinkClock) * 0.001;
    while (view.blinkTimer >= view.BLINK_INTERVAL) {
        view.blinkTimer -= view.BLINK_INTERVAL;
        view.bCursorOn = !view.bCursorOn;
    }

    view.blinkClock = now;

    if (view.bCursorOn) {
        view.ctxt.fillStyle = view.foreColor;
    }
    else {
        view.ctxt.fillStyle = view.backColor;
    }

    x = view.xFromCol(view.col);
    y = view.yFromRow(view.row);
    view.ctxt.fillRect(x, y, view.cellSize.width, view.cellSize.height);
};
view.xFromCol = function(col) {
    return col * view.cellSize.width;
};
view.yFromRow = function(row) {
    return row * view.cellSize.height;
};
view.setBackColor = function(newBack) {
    view.backColor = view.backColor;
};
view.setForeColor = function(newFore) {
    view.foreColor = newFore || view.foreColor;
}
view.setColumns = function(newCols) {
    view.columns = Math.max(1, newCols);
    view.resizeFont();
};
view.resize = function() {
    view.canvas.width = window.innerWidth * 0.95;
    view.canvas.height = window.innerHeight * 0.95;
    view.resizeFont();
};
view.resizeFont = function() {
    var fontInfo = null
    view.fontSize = Math.floor(view.canvas.width / view.columns / view.COL_TO_CHAR);
    view.ctxt.textBaseline = "top";
    view.fontInfo = "" + view.fontSize + "px Courier";
    view.ctxt.font = view.fontInfo;
    view.rows = Math.floor(view.canvas.height / view.columns / view.COL_TO_CHAR);
    view.cellSize.width = Math.round(view.fontSize * view.COL_TO_CHAR_SPACING);
    view.cellSize.height = Math.round(view.fontSize);
};
view.clear = function() {
    if (view.backColor) {
        view.ctxt.fillStyle = view.backColor;
        view.ctxt.fillRect(0, 0, view.canvas.width, view.canvas.height);
    }
    else {
        view.ctxt.clearRect(0, 0, view.canvas.width, view.canvas.height);
    }
    
    view.home();
}
view.home = function() {
    view.col = 0;
    view.row = 0;
};
view.cursorTo = function(row, col) {
    view.row = row >= 0 ? Math.min(row, view.rows) : view.row;
    view.col = col >= 0 ? Math.min(col, view.columns) : view.col;
};
view.cursorMove = function(dRow, dCol) {
    view.row = Math.max(0, Math.min(view.rows, view.row + dRow));
    view.col = Math.max(0, Math.min(view.columns, view.col + dCol));
};
view.print = function(text) {
    view.printAt(text, 0, 0);
};
view.printAt = function(text, newRow, newCol) {
    var x, y, cr;
    
    if (newRow > 0) {
        view.row = newRow - 1;
    }
    if (newCol > 0) {
        view.col = newCol - 1;
    }
    
    x = view.xFromCol(view.col);
    y = view.yFromRow(view.row);
    cr = text.indexOf(view.NEWLINE) >= 0;
    
    if (cr) {
        text = text.replace(view.NEWLINE, "");
    }

    view.ctxt.save();
    view.ctxt.fillStyle = view.foreColor;
    view.ctxt.strokeStyle = view.foreColor;
    view.ctxt.fillText(text, x, y);
    view.ctxt.strokeText(text, x, y);
    view.ctxt.restore();
    
    view.col += text.length;
    if (cr) {
        view.col = 0;
        view.row += 1;
    }
};

