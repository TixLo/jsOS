//
// the index of match array from regex
//
var INPUT               = 0;
var LABEL               = 1;
var OPCODE              = 2;
var OPERAND1            = 3;
var OPERAND1_ADDR       = 4;
var OPERAND2            = 7;
var OPERAND2_ADDR       = 8;

//
// keep compiling results
//
var addr = 0;
var machine_codes = [];
var labels = {}; // {'label string' : address}
var codes = {}; // {address : 'code line number'}

// parse asm line by line
// reference from https://github.com/Schweigi/assembler-simulator/blob/master/src/assembler/asm.js
var parsing = function(line, index) {
    line = line.trim();
    // console.log('[' + index + '] ' + line);
    // Use https://www.debuggex.com/
    // Matches: "label: INSTRUCTION (["')OPERAND1(]"'), (["')OPERAND2(]"')
    // GROUPS:      1       2               3                    7
    var regex = /^[\t ]*(?:([.A-Za-z]\w*)[:])?(?:[\t ]*([A-Za-z]{2,4})(?:[\t ]+(\[(\w+((\+|-)\d+)?)\]|\".+?\"|\'.+?\'|[.A-Za-z0-9]\w*)(?:[\t ]*[,][\t ]*(\[(\w+((\+|-)\d+)?)\]|\".+?\"|\'.+?\'|[.A-Za-z0-9]\w*))?)?)?/;
    // MATCHES: "(+|-)INTEGER"
    var regexNum = /^[-+]?[0-9]+$/;
    // MATCHES: "(.L)abel"
    var regexLabel = /^[.A-Za-z]\w*$/;

    try {
        var match = regex.exec(line);
        // console.log(match);

        // Allowed formats: 200, 200d, 0xA4, 0o48, 101b
        var parseNumber = function (input) {
            if (input.slice(0, 2) === "0x") {
                return parseInt(input.slice(2), 16);
            } else if (input.slice(0, 2) === "0o") {
                return parseInt(input.slice(2), 8);
            } else if (input.slice(input.length - 1) === "b") {
                return parseInt(input.slice(0, input.length - 1), 2);
            } else if (input.slice(input.length - 1) === "d") {
                return parseInt(input.slice(0, input.length - 1), 10);
            } else if (regexNum.exec(input)) {
                return parseInt(input, 10);
            } else {
                throw "Invalid number format";
            }
        };

        var parseRegister = function (input) {
            input = input.toLowerCase();
            var regs = ['ax', 'bx', 'cx', 'dx', 'sp', 'bp', 'si', 'di'];
            for (var i=0 ; i<regs.length ; i++) {
                if (regs[i] === input)
                    return regs[i];
            }
            return undefined;
        };

        var parseOffsetAddressing = function (input) {
            input = input.toLowerCase();
            var m = 0;
            var base = 0;

            if (input[0] === 'ax') {
                base = 0;
            } else if (input[0] === 'bx') {
                base = 1;
            } else if (input[0] === 'cx') {
                base = 2;
            } else if (input[0] === 'dx') {
                base = 3;
            } else if (input.slice(0, 2) === "sp") {
                base = 4;
            } else {
                return undefined;
            }
            var offset_start = 1;
            if (base === 4) {
                offset_start = 2;
            }

            if (input[offset_start] === '-') {
                m = -1;
            } else if (input[offset_start] === '+') {
                m = 1;
            } else {
                return undefined;
            }

            var offset = m * parseInt(input.slice(offset_start + 1), 10);

            if (offset < -16 || offset > 15)
                throw "offset must be a value between -16...+15";

            if (offset < 0) {
                offset = 32 + offset; // two's complement representation in 5-bit
            }

            return offset * 8 + base; // shift offset 3 bits right and add code for register
        };

        // Allowed: Register, Label or Number; SP+/-Number is allowed for 'regaddress' type
        var parseRegOrNumber = function (input, typeReg, typeNumber) {
            var register = parseRegister(input);

            if (register !== undefined) {
                return {type: typeReg, value: register};
            } else {
                var label = parseLabel(input);
                if (label !== undefined) {
                    return {type: typeNumber, value: label};
                } else {
                    if (typeReg === "regaddress") {

                        register = parseOffsetAddressing(input);

                        if (register !== undefined) {
                            return {type: typeReg, value: register};
                        }
                    }

                    var value = parseNumber(input);

                    if (isNaN(value)) {
                        throw "Not a " + typeNumber + ": " + value;
                    }
                    else if (value < 0 || value > 65535)
                        throw typeNumber + " must have a value between 0-65535";

                    return {type: typeNumber, value: value};
                }
            }
        };

        var parseLabel = function (input) {
            return regexLabel.exec(input) ? input : undefined;
        };

        var getValue = function (input) {
            switch (input.slice(0, 1)) {
                case '[': // [number] or [register]
                    var address = input.slice(1, input.length - 1);
                    return parseRegOrNumber(address, "regaddress", "address");
                case '"': // "String"
                    var text = input.slice(1, input.length - 1);
                    var chars = [];

                    for (var i = 0, l = text.length; i < l; i++) {
                        chars.push(text.charCodeAt(i));
                    }

                    return {type: "numbers", value: chars};
                case "'": // 'C'
                    var character = input.slice(1, input.length - 1);
                    if (character.length > 1)
                        throw "Only one character is allowed. Use String instead";

                    return {type: "number", value: character.charCodeAt(0)};
                default: // REGISTER, NUMBER or LABEL
                    return parseRegOrNumber(input, "register", "number");
            }
        };

        // return if cant not find label or opcode.
        if (match[LABEL] === undefined && match[OPCODE] === undefined) {
            return;
        }

        if (match[LABEL] !== undefined) {
            var label = match[LABEL].toLowerCase();
            if (labels[label] !== undefined) {
                return;
            }
            labels[label] = addr;
            return;
        }

        if (match[OPCODE] !== undefined) {
            var opcode = match[OPCODE].toLowerCase();
            var operand1 = match[OPERAND1].toLowerCase();
            var operand2 = match[OPERAND2].toLowerCase();

            switch (opcode) {
                case 'mov':
                    asm_mov(index,
                            getValue(operand1), match[OPERAND1_ADDR],
                            getValue(operand2), match[OPERAND2_ADDR],
                            codes, addr, machine_codes,
                            function(_addr, _codes, _machine_codes){
                                addr = _addr;
                                codes = _codes;
                                machine_codes = _machine_codes;
                            });
                    break;
            }
        }
    } catch (e) {
        console.log(line);
        console.log(e);
    }
}

var asm_compile = function(asm) {
    // initialize compiling results
    addr = 0;
    machine_codes = [];
    labels = {};
    codes = {};

    // start parsing asm code
    var lines = asm.split('\n');
    for (var i=0 ; i<lines.length ; i++) {
        parsing(lines[i], i)
    }

    // dump machine_codes
    dump(machine_codes);

    return machine_codes;
}