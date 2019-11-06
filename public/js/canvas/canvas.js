var global_font = "monospace";
var focus_color = '#0000FF';

var draw_device = function(id, dev, data) {
    // clear all
    canvas_clear(id);

    // draw blocks
    dev.blocks.forEach(function(b){
        if (b.focus)
            canvas_draw_block(id, b.x, b.y, b.w, b.h, focus_color, b.text, b.text_size, b.align);
        else
            canvas_draw_block(id, b.x, b.y, b.w, b.h, '#000000', b.text, b.text_size, b.align);

        if (b.module === 'memory')
            canvas_draw_memory(id, b, data);
    });

    // draw lines
    dev.bus.forEach(function(b){
        if (b.focus)
            canvas_draw_line(id, b.x1, b.y1, b.x2, b.y2, focus_color);
        else
            canvas_draw_line(id, b.x1, b.y1, b.x2, b.y2, '#000000');
    });

    // draw labels
    dev.labels.forEach(function(l){
        if (l.focus)
            canvas_draw_text(id, l.x, l.y, focus_color, l.text, l.text_size, l.anchor);
        else
            canvas_draw_text(id, l.x, l.y, '#000000', l.text, l.text_size, l.anchor);
    });
}

var canvas_clear = function(id) {
    var canvas = document.getElementById(id);
    if (canvas === undefined)
       return;

    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);    
}

var canvas_draw_block = function(id, x, y, w, h, c, text, font_size, align) {
    var canvas = document.getElementById(id);
    if (canvas === undefined)
       return;

    var ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x, y, w, h);
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
        f_y = y + (h + font_size) / 2 - 4;
    }
    ctx.fillStyle = c;
    ctx.fillText(text, f_x, f_y);
}

var canvas_draw_text = function(id, x, y, c, text, font_size, anchor) {
    var canvas = document.getElementById(id);
    if (canvas === undefined)
       return;

    var ctx = canvas.getContext('2d');
    ctx.font = font_size + "px " + global_font;

    var f_x = 0, f_y = 0;

    if (anchor === 'left') {
        f_x = x - ctx.measureText(text).width;
        f_y = y + font_size;
    }
    else if (anchor === 'right') {
        f_x = x;
        f_y = y + font_size;
    }
    else {
        f_x = x - ctx.measureText(text).width/2;
        f_y = y + font_size;
    }

    ctx.fillStyle = c;
    ctx.fillText(text, f_x, f_y);
}

var canvas_draw_line = function(id, x1, y1, x2, y2, c) {
    var canvas = document.getElementById(id);
    if (canvas === undefined)
       return;

    var ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.strokeStyle = c;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

var canvas_draw_memory = function(id, block, data) {
    var canvas = document.getElementById(id);
    if (canvas === undefined)
       return;

    var ctx = canvas.getContext('2d');

    canvas_draw_line(id, block.x + 5, block.y + 36, block.x + block.w - 5, block.y + 36, '#000000');

    var pos_x = block.x + 10;
    var pos_y = block.y + 40;
    var addr = 0;

    for (var i=0 ; ; i+=16) {
        var j = i;
        var finish = false;

        if (addr >= 192) {
            break;
        }

        var addr_head = i.toString(16);
        do {
            addr_head = '0' + addr_head;
        }while(addr_head.length != 8);
        addr_head = '0x' + addr_head + ': ';

        canvas_draw_text(id, pos_x, pos_y, '#000000', addr_head, 14, 'right');
        pos_x += ctx.measureText(addr_head).width;

        for (var j=i ; j<i+16 ; j++) {
            if (j >= data.mem.length) {
                finish = true;
                break;
            }

            var byte = '';
            var color = '#000000';
            if (addr >= data.start)
                byte = data.mem[j] + ' ';
            else
                byte = '   ';

            if (data.focus_start >= 0 && data.focus_end >= 0) {
                if (addr >= data.focus_start && addr <= data.focus_end)
                    color = focus_color;
            }
            
            canvas_draw_text(id, pos_x, pos_y, color, byte, 14, 'right');
            pos_x += ctx.measureText(byte).width;
            addr = addr + 1;
        }

        pos_x = block.x + 10;
        pos_y += 20;
        if (finish)
            break;
    }

}