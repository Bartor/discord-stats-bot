window.addEventListener('load', (event) => {
    document.getElementById('tables').addEventListener('change', (event) => {
        let fieldList = document.getElementById('fieldList');

        while (fieldList.childElementCount != 1) {
            fieldList.removeChild(fieldList.firstChild);
        }
        updateFields(1);
    });
    updateFields(1);
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


    fieldList.appendChild(s);
    updateFields(fieldList.childElementCount);
}