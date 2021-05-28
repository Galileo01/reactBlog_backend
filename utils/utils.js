//转义特殊字符
function translate(str, mode = 1) {
    if (mode === 1) {
        //sql 写入
        str = str.replace(/'/g, '$@');
        // str = str.replace('\r', 'CHAR(10)');
        // str = str.replace('\n', 'CHAR(13)');
    } else {
        str = str.replace(/\$@/g, "'");
        // str = str.replace(/CHAR(10)/g, '\r');
        // str = str.replace(/CHAR(13)/g, '\n');
    }
    return str;
}

module.exports={
    translate
}