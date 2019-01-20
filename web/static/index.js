window.addEventListener('load', (event) => {
    document.getElementById('tables').addEventListener('change', (event) => {
        let fieldList = document.getElementById('fieldList');
        while (fieldList.childElementCount != 1) {
            fieldList.removeChild(fieldList.firstChild);
        }
        updateFields(1);
        updateQuery();
    });

    addField();
    updateFields(1);
    updateQuery();
});

const updateFields = (child) => {
    let fields = document.querySelector(`#fieldList > select:nth-child(${child})`);
    let tables = document.getElementById('tables');

    while (fields.firstChild) {
        fields.removeChild(fields.firstChild);
    }

    for (let s of schema) {
        if (s.TABLE_NAME === tables[tables.selectedIndex].value) {
            let o = document.createElement('option');
            o.setAttribute('value', s.COLUMN_NAME);
            o.appendChild(document.createTextNode(s.COLUMN_NAME));

            fields.appendChild(o);
        }
    }
}

const addField = () => {
    let fieldList = document.getElementById('fieldList');

    let s = document.createElement('select');
    s.classList.add('margin-sides');

    s.addEventListener('change', (event) => {
        updateQuery();
    });

    fieldList.appendChild(s);
    updateFields(fieldList.childElementCount);
    updateQuery();
}

const updateQuery = () => {
    let table = document.getElementById('tables').value;
    let colums = [...(document.getElementById('fieldList').children)].map(e => e.value);

    document.getElementById('query').value = 'SELECT ' + colums.join(', ') + ' FROM ' + table + ';';
}

const query = () => {
    let list = document.getElementById('results');

    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }

    document.getElementById('error').textContent = '';
    let q = document.getElementById('query').value;

    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/query/', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
        let results = JSON.parse(xhr.responseText);
        if (xhr.readyState == 4 && xhr.status == "200") {
            let line = document.createElement('div');
            line.classList.add('item');
            for (let f of results.fields) {
                let field = document.createElement('p');
                field.classList.add('flex-one');
                field.classList.add('strong');
                field.append(document.createTextNode(f.name));

                line.append(field);
            }
            list.append(line);

            for (let r of results.rows) {
                line = document.createElement('div');
                line.classList.add('item');
                for (let i = 0; i < results.fields.length; i++) {
                    let field = document.createElement('p');
                    field.classList.add('flex-one');
                    field.append(document.createTextNode(r[results.fields[i].name]));

                    line.append(field);
                }
                list.append(line);
            }
        } else {
            document.getElementById('error').textContent = 'ERROR: ' + results.sqlMessage;
        }
    }
    xhr.send(JSON.stringify({query: q}));
}