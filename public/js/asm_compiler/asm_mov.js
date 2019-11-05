var toFixedHex = function(value) {
    value = value.toString(16);
    if (value.length == 4)
        return value;

    do {
        value = '0' + value;
    }while(value.length != 4);
    return value;
}

var asm_mov = function(index, p1, p1_addr, p2, p2_addr, codes, addr, machine_codes, cb) {
    console.log(p1.type + ',' + p2.type);
    console.log(p1.value + ',' + p2.value);

    var curr_machine_codes = [];
    
    if (p1.type === "register" && p2.type === "number") {
        var regs = {'ax' : 'b8','cx' : 'b9','dx' : 'ba','bx' : 'bb',
                    'sp' : 'bc','bp' : 'bd','si' : 'be','di' : 'bf',};
        curr_machine_codes.push(regs[p1.value]);
        curr_machine_codes.push(toFixedHex(p2.value).slice(2, 4));
        curr_machine_codes.push(toFixedHex(p2.value).slice(0, 2));
    }
    else if (p1.type === "register" && p2.type === "register") {
        var regs = {
                        'axsi' : 'f0', 'axbx' : 'd8', 'axbp' : 'e8', 'axdi' : 'f8',
                        'cxsi' : 'f1', 'cxbx' : 'd9', 'cxbp' : 'e9', 'cxdi' : 'f9',
                        'dxsi' : 'f2', 'dxbx' : 'da', 'dxbp' : 'ea', 'dxdi' : 'fa',
                        'bxsi' : 'f3', 'bxbx' : 'db', 'bxbp' : 'eb', 'bxdi' : 'fb',
                    };
        curr_machine_codes.push('89');
        curr_machine_codes.push(regs[p1.value + p2.value]);
    }
    else if (p1.type === "register" && p2.type === "address") {
        if (p1.value == 'ax') {
            curr_machine_codes.push('a1');
        }
        else {
            curr_machine_codes.push('8b');
            var regs = {'cx':'0e', 'dx':'16', 'bx':'1e', 'sp':'25', 'bp':'2e', 'si':'35', 'di':'3d'};
            curr_machine_codes.push(regs[p1.value]);
        }
        var operand2_addr = parseInt(p2_addr);
        curr_machine_codes.push(toFixedHex(operand2_addr).slice(2, 4));
        curr_machine_codes.push(toFixedHex(operand2_addr).slice(0, 2));
    }
    else if (p1.type === "register" && p2.type === "regaddress") {
        var regs = {
                        'axsi' : '04', 'axbx' : '07', 'axbp' : '46', 'axdi' : '05',
                        'cxsi' : '0c', 'cxbx' : '0f', 'cxbp' : '4e', 'cxdi' : '0d',
                        'dxsi' : '14', 'dxbx' : '17', 'dxbp' : '56', 'dxdi' : '15',
                        'bxsi' : '1c', 'bxbx' : '1f', 'bxbp' : '5e', 'bxdi' : '1d',
                    };
        curr_machine_codes.push('8b');
        curr_machine_codes.push(regs[p1.value + p2.value]);
        console.log(regs[p1.value + p2.value]);
        if (p2.value === 'bp')
            curr_machine_codes.push('00');
    }
    else {
        console.log('[' + p1.type + '],[' + p2.type + '] not support!!');
        return;
    }

    codes[addr] = index;
    addr += curr_machine_codes.length;
    machine_codes = machine_codes.concat(curr_machine_codes);
    
    cb(addr, codes, machine_codes);
}