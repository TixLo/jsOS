var dump = function(codes) {
    console.log('------- dump machine code start ----------');
    for (var i=0 ; ; i+=16) {
        var j = i;
        var finish = false;

        var addr = i.toString(16);
        do {
            addr = '0' + addr;
        }while(addr.length != 8);
        addr = '0x' + addr + ': ';

        for (var j=i ; j<i+16 ; j++) {
            if (j >= codes.length) {
                finish = true;
                break;
            }
            addr += codes[j] + ' ';
        }

        console.log(addr);
        if (finish)
            break;
    }
    console.log('------- dump machine code finish ----------');
}