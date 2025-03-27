const exampleCells = [
    {
        id: 'c1',
        text: 'Cell 1',
        row: 1,
        column: 1,
        columnSpan: 3, // +1
        height: '50px'
        // grid-column: 1 / 4;
        // grid-row: 1;
        // height: 50px;
    }, {
        id: 'c2',
        text: 'Cell 2',
        row: 2,
        rowSpan: 3,
        column: 1,
        width: '50px'
        // grid-column: 1;
        // grid-row: 2 / 4;
        // width: 50px;
    }, {
        id: 'c3',
        text: 'Cell 3',
        row: 2,
        column: 2,
        columnSpan: 3,
        height: '100px'
        // grid-column: 2 / 4;
        // grid-row: 2;
        // height: 100px;
    }, {
        id: 'c4',
        text: 'Cell 4',
        row: 3,
        column: 2,
        // grid-column: 2;
        // grid-row: 3;
    }, {
        id: 'c5',
        text: 'Cell 5',
        row: 3,
        column: 3,
        width: '100px'
        // grid-column: 3;
        // grid-row: 3;
        // width: 100px;
    }, {
        id: 'c6',
        text: 'Cell 6',
        row: 4,
        column: 1,
        columnSpan: 3,
        height: '50px'
        // grid-column: 1 / 4;
        // grid-row: 4;
        // height: 50px;
    }
]
const gridSettings = {
    width: '500px',
    height: '500px',
    rows: ['auto', 'auto', '1fr', 'auto'],
    columns: ['auto', '1fr', 'auto']
}
const cells = [...exampleCells]; //[];

function createCell() {
    return {
        id: '',
        text: `Cell ${cells.length + 1}`,
        width: '100px',
        height: '100px',
        row: 1,
        rowSpan: 1,
        rowRule: 'auto',
        column: 1,
        columnSpan: 1,
        columnRule: 'auto',
        resizeBy: false
    }
}
function addCell() {
    const cell = createCell();
    cells.push(cell);
    renderGrid();
}
function deleteCell(index) {
    cells.splice(index, 1);
    renderGrid();
}
function renderGrid() {
    const grid = document.querySelector('.grid');
    grid.innerHTML = '';
    cells.forEach(cell => {
        const div = document.createElement('div');
        div.textContent = cell.text;
        if (cell.width) {
            div.style.width = cell.width;
        }
        if (cell.height) {
            div.style.height = cell.height;
        }
        let gridRow = cell.row;
        let gridColumn = cell.column;
        if (cell.rowSpan) {
            gridRow += ` / ${cell.rowSpan + 1}`;
        }
        if (cell.columnSpan) {
            gridColumn += ` / ${cell.columnSpan + 1}`;
        }
        div.style.gridRow = gridRow;
        div.style.gridColumn = gridColumn;
        grid.appendChild(div);
    });
}
renderGrid();