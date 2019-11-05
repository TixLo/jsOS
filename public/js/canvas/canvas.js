var global_font = "Arial";

var draw_device = function(dev) {
    dev.blocks.forEach(function(b){
        canvas_draw_block(b.id, b.x, b.y, b.w, b.h, b.c, b.text, b.text_size, b.align);
    });
}

var canvas_draw_block = function(id, x, y, w, h, c, text, font_size, align) {
    var canvas = document.getElementById(id);
    if (canvas === undefined)
       return;

    var ctx = canvas.getContext('2d');
    ctx.strokeStyle = c;
    ctx.strokeRect(x, y, w, h);
    ctx.font = font_size + "px " + global_font;

    var f_x = 0, f_y = 0;

    if (align === 'top') {
        f_x = x + (w - ctx.measureText(text).width)/2;
        f_y = y + font_size;
    }
    else if (align === 'bottom') {
        f_x = x + (w - ctx.measureText(text).width)/2;
        f_y = y + h - 5;
    }
    else {
        f_x = x + (w - ctx.measureText(text).width)/2;
        f_y = y + (h + font_size) / 2
    }
    
    ctx.fillText(text, f_x, f_y);
}

var canvas_draw_line = function(id, x, y, w, h, c) {
    var canvas = document.getElementById(id);
    if (canvas === undefined)
       return;

    var ctx = canvas.getContext('2d');
    ctx.strokeStyle = c;
    ctx.moveTo(x, y);
    ctx.lineTo(x + w, y + h);
    ctx.stroke();
}