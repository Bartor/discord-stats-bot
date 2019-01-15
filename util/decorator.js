module.exports = function(fields, rows) {
    let MAX_LENGTH = 20;

    let string = '\n```html\n';
    let localString = '';
    for (let f of fields) localString += `${('<'+f.name+'>').substring(0, MAX_LENGTH).padEnd(MAX_LENGTH, ' ')}`;
    string += `${localString.trim()}\n\n`;
    for (let r of rows) {
        localString = '';
        for (let p in r) {
            if (r.hasOwnProperty(p)) {
                localString += `${r[p] !== null ?
                     r[p] instanceof Date ? 
                     r[p].getDate() + '-' + (r[p].getMonth()+1) + '-' + (r[p].getYear()-100) + ' ' + r[p].getHours() + ':' + r[p].getMinutes() + ':' + r[p].getSeconds()
                      : r[p].toString().substring(0, MAX_LENGTH).padEnd(MAX_LENGTH, ' ') 
                    : 'NULL'.padEnd(MAX_LENGTH, ' ')}`;
            }
        }
        string += `${localString.trim()}\n`;
    }
    string += '```';
    return string;
}