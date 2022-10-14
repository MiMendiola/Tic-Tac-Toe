

const board = [
    ['','',''],
    ['','',''],
    ['','',''],
];

// 0 = user, 1 = pc
let turn = 0;
const boardContainer = document.querySelector('#board');
const playerDiv = document.querySelector('#player');

startGame();

function startGame(){
    renderBoard();
    turn = Math.random() <= 0.5 ? 0: 1;

    renderCurrentPlayer();

    if(turn == 0){
        playerPlays();
    }else{
        pcPlays();
    };
};


function renderBoard(){
    const html = board.map(row => {
        const cells = row.map(cell => {
            return `<button class="cell">${cell}</button>`;
        });

        return `<div class="row">${cells.join("")}</div>`;
    });

    boardContainer.innerHTML = html.join("");
};

function renderCurrentPlayer(){
    playerDiv.textContent = `${turn == 0 ? 'Player Turn': 'PC Turn'}`;
};

function playerPlays(){
    const cells = document.querySelectorAll('.cell');

    cells.forEach((cell, i) => {
        const row = i % 3;
        const column = parseInt(i/3);

        if(board[column][row] == ''){
            cell.addEventListener('click', e => {
                board[column][row] = "O";
                cell.textContent = board[column][row];

                turn = 1;
                const won = checkIfWinner();

                if(won == 'none'){
                    pcPlays();
                    return;
                };
        
                if(won == 'draw'){
                    renderDraw();
                    cell.removeEventListener('click', this);
                    return;
                };
            });
        };
    });
};

function pcPlays(){
    renderCurrentPlayer();

    setTimeout(() => {
        let played = false;
        const options = checkIfWin();

        if(options.length > 0){
            const bestOption = options[0];
            for(let i = 0; i < bestOption.length; i++){
                if(bestOption[i].value == 0){
                    const posi = bestOption[i].i;
                    const posj = bestOption[i].j;

                    board[posi][posj] = 'X';
                    played = true;
                    break;
                }
            }
        }else{
            for(let i = 0; i < board.length; i++){
                for(let j = 0; j < board[i].length; j++){
                    if(board[i][j] == '' && !played){
                        board[i][j] = 'X';
                        played = true;
                    };
                };
            };
        };

        turn = 0;
        renderBoard();
        renderCurrentPlayer();

        const won = checkIfWinner();

        if(won == 'none'){
            playerPlays();
            return;
        };

        if(won == 'draw'){
            renderDraw();
            return;
        };
    }, 1500);
};

// For check if the pc can win doing 3
function checkIfWin(){
    // copy of our array board
    const arr = JSON.parse(JSON.stringify(board));

    for(let i = 0; i < arr.length; i++){
        for(let j = 0; j < arr.length; j++){
            if (arr[i][j] == "X"){
                arr[i][j] = { value: 1, i, j};

            }else if (arr[i][j] == ""){
                arr[i][j] = { value: 0, i, j};

            }else if (arr[i][j] == "O"){
                arr[i][j] = { value: -2, i, j};

            };
        };
    };

    const p1 = arr[0][0];
    const p2 = arr[0][1];
    const p3 = arr[0][2];
    const p4 = arr[1][0];
    const p5 = arr[1][1];
    const p6 = arr[1][2];
    const p7 = arr[2][0];
    const p8 = arr[2][1];
    const p9 = arr[2][2];

    const s1 = [p1, p2, p3];
    const s2 = [p4, p5, p6];
    const s3 = [p7, p8, p9];
    const s4 = [p1, p4, p7];
    const s5 = [p2, p5, p8];
    const s6 = [p3, p6, p9];
    const s7 = [p1, p5, p9];
    const s8 = [p3, p5, p7];

    const res = [s1,s2,s3,s4,s5,s6,s7,s8].filter(line => {
        return (
            line[0].value + line[1].value + line[2].value == 2 || 
            line[0].value + line[1].value + line[2].value == -4
        );
    });

    return res;
};

function checkIfWinner(){

    const p1 = board[0][0];
    const p2 = board[0][1];
    const p3 = board[0][2];
    const p4 = board[1][0];
    const p5 = board[1][1];
    const p6 = board[1][2];
    const p7 = board[2][0];
    const p8 = board[2][1];
    const p9 = board[2][2];

    //All the options to win
    const s1 = [p1, p2, p3];
    const s2 = [p4, p5, p6];
    const s3 = [p7, p8, p9];
    const s4 = [p1, p4, p7];
    const s5 = [p2, p5, p8];
    const s6 = [p3, p6, p9];
    const s7 = [p1, p5, p9];
    const s8 = [p3, p5, p7];

    const res = [s1,s2,s3,s4,s5,s6,s7,s8].filter(line => {
        return (line[0] + line[1] + line[2] == 'XXX' || line[0] + line[1] + line[2] == 'OOO');
    });

    // We have a winner
    if (res.length > 0){
        if(res[0][0] == 'X'){
            playerDiv.textContent = 'PC WINS';
            return "pcWon";
        }else{
            playerDiv.textContent = 'USER WINS';
            return 'userWon';
        };
    }else{
        let draw = true;
        for(let i = 0; i < board.length; i++){
            for(let j = 0; j < board.length; j++){
                if (board[i][j] == ""){
                    draw = false;    
                };
            };
        };

        return draw ? 'draw' : 'none';
    }
};

function renderDraw(){
    playerDiv.textContent = 'DRAW';
}