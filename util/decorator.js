module.exports = function(fields, rows) {
    let MAX_LENGTH = 20;

    let string = '\n```html\n';
    for (let f of fields) string += `${('<'+f.name+'>').substring(0, MAX_LENGTH).padEnd(MAX_LENGTH, ' ')}`;
    string += '\n\n';
    for (let r of rows) {
        for (let p in r) {
            if (r.hasOwnProperty(p)) {
                string += `${r[p] !== null ? r[p].toString().substring(0, MAX_LENGTH).padEnd(MAX_LENGTH, ' ') : 'NULL'.padEnd(MAX_LENGTH, ' ')}` ;
            }
        }
        string += '\n';
    }
    string += '```';
    return string;
}