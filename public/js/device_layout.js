var device_layout = function () {
    var reg = {x: 60, y:50, w: 100, h: 30};
    var blocks = [
        { module: 'cpu', focus: false, x: 10, y: 10, w: 180, h: 290, text: 'CPU', text_size: 24, align: 'top' },
        { module: 'memory', focus: false, x: 260, y: 10, w: 520, h: 290, text: 'Memory', text_size: 24, align: 'top' },
        { module: 'display', focus: false, x: 10, y: 320, w: 770, h: 160, text: 'Display', text_size: 24, align: 'top' },
        { module: 'ax', focus: false, x: reg.x, y: reg.y + reg.h * 0, w: reg.w, h: reg.h, text: '', text_size: 20, align: 'center' },
        { module: 'bx', focus: false, x: reg.x, y: reg.y + reg.h * 1, w: reg.w, h: reg.h, text: '', text_size: 20, align: 'center' },
        { module: 'cx', focus: false, x: reg.x, y: reg.y + reg.h * 2, w: reg.w, h: reg.h, text: '', text_size: 20, align: 'center' },
        { module: 'dx', focus: false, x: reg.x, y: reg.y + reg.h * 3, w: reg.w, h: reg.h, text: '', text_size: 20, align: 'center' },
        { module: 'si', focus: false, x: reg.x, y: reg.y + reg.h * 4, w: reg.w, h: reg.h, text: '', text_size: 20, align: 'center' },
        { module: 'di', focus: false, x: reg.x, y: reg.y + reg.h * 5, w: reg.w, h: reg.h, text: '', text_size: 20, align: 'center' },
        { module: 'sp', focus: false, x: reg.x, y: reg.y + reg.h * 6, w: reg.w, h: reg.h, text: '', text_size: 20, align: 'center' },
        { module: 'bp', focus: false, x: reg.x, y: reg.y + reg.h * 7, w: reg.w, h: reg.h, text: '', text_size: 20, align: 'center' },
    ];

    var labels = [
        { module: 'l_ax', focus: false, x: reg.x - 5, y: reg.y + reg.h * 0, text: 'AX', text_size: 20, anchor: 'left' },
        { module: 'l_bx', focus: false, x: reg.x - 5, y: reg.y + reg.h * 1, text: 'BX', text_size: 20, anchor: 'left' },
        { module: 'l_cx', focus: false, x: reg.x - 5, y: reg.y + reg.h * 2, text: 'CX', text_size: 20, anchor: 'left' },
        { module: 'l_dx', focus: false, x: reg.x - 5, y: reg.y + reg.h * 3, text: 'DX', text_size: 20, anchor: 'left' },
        { module: 'l_si', focus: false, x: reg.x - 5, y: reg.y + reg.h * 4, text: 'SI', text_size: 20, anchor: 'left' },
        { module: 'l_di', focus: false, x: reg.x - 5, y: reg.y + reg.h * 5, text: 'DI', text_size: 20, anchor: 'left' },
        { module: 'l_sp', focus: false, x: reg.x - 5, y: reg.y + reg.h * 6, text: 'SP', text_size: 20, anchor: 'left' },
        { module: 'l_bp', focus: false, x: reg.x - 5, y: reg.y + reg.h * 7, text: 'BP', text_size: 20, anchor: 'left' },
    ];

    var bus = [
        { module: 'si-memory', x1: reg.x + reg.w , y1: reg.y + reg.h/2 + reg.h * 4, x2: blocks[1].x, y2: reg.y + reg.h/2 + reg.h * 4, focus: false },
        { module: 'di-memory', x1: reg.x + reg.w , y1: reg.y + reg.h/2 + reg.h * 5, x2: blocks[1].x, y2: reg.y + reg.h/2 + reg.h * 5, focus: false },
        { module: 'sp-memory', x1: reg.x + reg.w , y1: reg.y + reg.h/2 + reg.h * 6, x2: blocks[1].x, y2: reg.y + reg.h/2 + reg.h * 6, focus: false },
        { module: 'bp-memory', x1: reg.x + reg.w , y1: reg.y + reg.h/2 + reg.h * 7, x2: blocks[1].x, y2: reg.y + reg.h/2 + reg.h * 7, focus: false },
    ];

    var device = {
        blocks: blocks,
        labels: labels,
        bus: bus
    };

    return device;
}