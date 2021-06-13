const start = document.querySelector("#start");
const timer = document.querySelector("#timer");
const timeSel = document.querySelectorAll(".timeSel");
const diff = document.querySelectorAll(".diff");
const nums = document.querySelectorAll(".nums");
const gen = document.querySelector("#gen");
const inp=document.querySelectorAll(".input-button");
const hintnum=document.querySelector("#hintnum");

let hide=0;

inp.forEach(ipt =>{
    ipt.disabled=true;
})

let selOPT="00";
const difficulty = {
    easy: {
        hints: 3,
        len: 40
    },
    medium: {
        hints: 4,
        len: 30
    },
    hard: {
        hints: 5,
        len: 20
    }
};
const setTime = {
    five: 300,
    ten: 600,
    twenty: 1200
}

let hints = 3, dif = "EASY"; let time = 600;
let solved,unsolved;
let mfd=dif.toLowerCase();
let left=81-parseInt(difficulty[`${mfd}`].len);
let x;


// SUDOKU GRID GENERATOR FUNCTION TILL LINE 246
// MAIN IMPLEMENTATION CODE FROM LINE 248 !!!


let Sudoku = /** @class */ (function () {
    function Sudoku(N, K) {
        if (this.mat === undefined) {
            this.mat = null;
        }
        if (this.N === undefined) {
            this.N = 0;
        }
        if (this.SRN === undefined) {
            this.SRN = 0;
        }
        if (this.K === undefined) {
            this.K = 0;
        }
        this.N = N;
        this.K = K;
        let SRNd = Math.sqrt(N);
        this.SRN = /* intValue */ (SRNd | 0);
        this.mat = (function (dims) { let allocate = function (dims) { if (dims.length === 0) {
            return 0;
        }
        else {
            let array = [];
            for (let i = 0; i < dims[0]; i++) {
                array.push(allocate(dims.slice(1)));
            }
            return array;
        } }; return allocate(dims); })([N, N]);
    }
    Sudoku.prototype.fillValues = function () {
      let str="";
        this.fillDiagonal();
        this.fillRemaining(0, this.SRN);
        for (let i = 0; i < this.N; i++) {
            {
                for (let j = 0; j < this.N; j++) {
                    str+=this.mat[i][j].toString();
                }
                
            }
            ;
        }
        this.removeKDigits();
        return str;
    };
    Sudoku.prototype.fillDiagonal = function () {
        for (let i = 0; i < this.N; i = i + this.SRN) {
            this.fillBox(i, i);
        }
    };
    Sudoku.prototype.unUsedInBox = function (rowStart, colStart, num) {
        for (let i = 0; i < this.SRN; i++) {
            for (let j = 0; j < this.SRN; j++) {
                if (this.mat[rowStart + i][colStart + j] === num)
                    return false;
                ;
            }
            ;
        }
        return true;
    };
    Sudoku.prototype.fillBox = function (row, col) {
        let num;
        for (let i = 0; i < this.SRN; i++) {
            {
                for (let j = 0; j < this.SRN; j++) {
                    {
                        do {
                            {
                                num = this.randomGenerator(this.N);
                            }
                        } while ((!this.unUsedInBox(row, col, num)));
                        this.mat[row + i][col + j] = num;
                    }
                    ;
                }
            }
            ;
        }
    };
    Sudoku.prototype.randomGenerator = function (num) {
        return (Math.floor((Math.random() * num +1)) | 0);
    };
    Sudoku.prototype.CheckIfSafe = function (i, j, num) {
        return (this.unUsedInRow(i, num) && this.unUsedInCol(j, num) && this.unUsedInBox(i - i % this.SRN, j - j % this.SRN, num));
    };
    Sudoku.prototype.unUsedInRow = function (i, num) {
        for (let j = 0; j < this.N; j++) {
            if (this.mat[i][j] === num)
                return false;
            ;
        }
        return true;
    };
    Sudoku.prototype.unUsedInCol = function (j, num) {
        for (let i = 0; i < this.N; i++) {
            if (this.mat[i][j] === num)
                return false;
            ;
        }
        return true;
    };
    Sudoku.prototype.fillRemaining = function (i, j) {
        if (j >= this.N && i < this.N - 1) {
            i = i + 1;
            j = 0;
        }
        if (i >= this.N && j >= this.N)
            return true;
        if (i < this.SRN) {
            if (j < this.SRN)
                j = this.SRN;
        }
        else if (i < this.N - this.SRN) {
            if (j === (((i / this.SRN | 0)) | 0) * this.SRN)
                j = j + this.SRN;
        }
        else {
            if (j === this.N - this.SRN) {
                i = i + 1;
                j = 0;
                if (i >= this.N)
                    return true;
            }
        }
        for (let num = 1; num <= this.N; num++) {
            {
                if (this.CheckIfSafe(i, j, num)) {
                    this.mat[i][j] = num;
                    if (this.fillRemaining(i, j + 1))
                        return true;
                    this.mat[i][j] = 0;
                }
            }
            ;
        }
        return false;
    };
    Sudoku.prototype.removeKDigits = function () {
        let count = this.K;
        let l=0;
        while ((count > 0)) {
            {
                let cellId = this.randomGenerator(this.N * this.N);
                let i = ((cellId / this.N | 0));
                let j = cellId % 9;
                if(hide%3 === 0 && l===0){this.mat[0][0]=0;--count;l=1;}
                if (i<9 && j<9 && this.mat[i][j] !== 0) {
                    count--;
                    this.mat[i][j] = 0;
                }
            }
        }
        ;
    };
    Sudoku.prototype.printSudoku = function () {
      let str="";
        for (let i = 0; i < this.N; i++) {
            {
                for (let j = 0; j < this.N; j++) {
                    if(this.mat[i][j].toString()==="0") str+=".";
                    else str+=this.mat[i][j].toString();
                }
                
            }
            ;
        }
        return str;
    };
    Sudoku.generate = function (mode) {
      const difficulty = {
    easy: {
        hints: 3,
        len: 40
    },
    medium: {
        hints: 4,
        len: 30
    },
    hard: {
        hints: 5,
        len: 20
    }
};
    let K=81-difficulty[mode].len;
      let grid=["",""];
        let N = 9;
        
        let sudoku = new Sudoku(N, K);
        grid[1]=sudoku.fillValues();
        grid[0]=sudoku.printSudoku();
        return grid;
    };
    return Sudoku;
}());
Sudoku["__class"] = "Sudoku";


// END

// IMPLEMENTATION CODE



gen.addEventListener("click", chngBoard);

nums.forEach(numt => {
    numt.addEventListener("mouseover",(e) =>{
        let pg=parseInt(numt.id);
        if(start.innerHTML==="SOLVE" && unsolved[pg]===".") numt.style.backgroundColor="rgb(137, 224, 195)";
    })
    numt.addEventListener("mouseout",() =>{
        let pg=parseInt(numt.id)
        if(unsolved[pg]===".") numt.style.backgroundColor="";
    })
});

inp.forEach(but =>{
    but.addEventListener("click", () =>{
        selOpt=but.id;
    })
})


function returnBlock(cell) {
	return Math.floor(Math.floor(cell / 9)/ 3) * 3 + Math.floor(cell % 9 / 3);
}
let pnt=0;

nums.forEach(ent =>{
    ent.addEventListener("click", () =>{
        let pg=parseInt(ent.id);
        if(selOpt==="NA") ++pnt;
        else if(unsolved[pg]==="." && selOpt==="00" && ent.style.backgroundColor!=="#e9d8a6"){
            ++left;
            ent.innerHTML="";
            ent.style.backgroundColor=""
        }
        else if(unsolved[pg]==="." && ent.style.backgroundColor!=="#e9d8a6"){
            ent.style.backgroundColor="";
            let l=0;
            for (let i=0; i<=8; i++) {
                if (document.getElementById(`${pg%9+9*i}`).innerHTML === selOpt[1]) {
                    ent.style.backgroundColor="#da5552";
                    ++left;
                    l=1;
                    break;
                }
            }
            for (let i=0;l===0 && i<=8; i++) {
                if (document.getElementById(`${parseInt(pg/9)*9+i}`).innerHTML === selOpt[1]) {
                    ent.style.backgroundColor="#da5552";
                    ++left;
                    l=1;
                    break;
                }
            }
            block=returnBlock(pg);
            for (let i=0;l===0 && i<=8; i++) {
                if (document.getElementById(`${Math.floor(block/3)*27+i%3+9*Math.floor(i/3)+3*(block%3)}`).innerHTML === selOpt[1]) {
                    ent.style.backgroundColor="#da5552";++left;break;
                }
            }
            ent.innerHTML=selOpt[1];--left;selOpt="NA";
            // if(solved[pg]!==selOpt[1]) ent.style.color="red";
        }
        if(left===0){
            let won=1;
            for (let i = 0; i < 81; i++) {
                let chk=document.getElementById(`${i}`).innerHTML;
                for (let j=0;j!==i && j<=8; j++) {
                    if (document.getElementById(`${pg%9+9*i}`).innerHTML === chk) {
                        won=0;
                        break;
                    }
                }
                for (let j=0;j!==i && j<=8; j++) {
                    if (document.getElementById(`${parseInt(pg/9)*9+i}`).innerHTML === chk) {
                        won=0;
                        break;
                    }
                }
                block=returnBlock(i);
                for (let j=0;j!==i && j<=8; j++) {
                    if (document.getElementById(`${Math.floor(block/3)*27+i%3+9*Math.floor(i/3)+3*(block%3)}`).innerHTML === chk) {
                        won=0;
                    }
                }
                if(won===0) break;
            }
            if(won===1){
                clearInterval(x);
                alert("YOU WON!");               
            }else{
                clearInterval(x);
                alert("YOU LOSE!"); 
            }
        }
    })
})

timeSel.forEach(opt => {
    opt.addEventListener("click", () => {
        let sel = opt.value;
        if (sel === "five") { time = setTime.five; document.querySelector("#times").innerHTML = "5 min"; }
        else if (sel === "ten") { time = setTime.ten; document.querySelector("#times").innerHTML = "10 min"; }
        else if (sel === "twenty") { time = setTime.twenty; document.querySelector("#times").innerHTML = "20 min"; }

    })

})
let hnleft;
hintnum.addEventListener("click",() =>{
    if(start.innerHTML==="SOLVE"){
        
        if(hnleft){
            if(hnleft%2){
                for(let i=0;i<81;i++){
                    let cell=document.getElementById(`${i}`);
                    if(cell.innerHTML!==solved[i] && cell.style.backgroundColor!=="#e9d8a6"){
                        cell.innerHTML=solved[i];
                        cell.style.backgroundColor="#e9d8a6"
                        break;
                    }
                }
            }else{
                for(let i=80;i>-1;i--){
                    let cell=document.getElementById(`${i}`);
                    if(solved[i]!==cell.innerHTML && cell.style.backgroundColor!=="#e9d8a6"){
                        cell.innerHTML=solved[i];
                        cell.style.backgroundColor="#e9d8a6"
                        break;
                    }
                }
            }
            --hnleft;
            document.querySelector("#hints").innerHTML = hnleft;
        }else{
            alert("No More Hints Left !")
        }
    }
    
})

function startTimer(time) {

    let now = 1;

    x = setInterval(function () {
        let distance = time - now;
        ++now;
        let minutes = parseInt(distance / 60);
        let seconds = distance % 60;
        if(seconds<10) timer.innerHTML = `${minutes}:0${seconds}`;
        else timer.innerHTML = `${minutes}:${seconds}`;
        if (distance === 0) {
            clearInterval(x);
            timer.innerHTML = "Time Up!";
        }
        if (distance < time / 2) {
            start.disabled = false;
            start.style.backgroundColor="#00b4d8"
        }
    }, 1000);
}




diff.forEach(opt => {
    opt.addEventListener("click", () => {
        let sel = opt.value;
        if (sel === "easy") { len = difficulty.easy.len; hints = difficulty.easy.hints; dif = "EASY"; document.querySelector("#diff").innerHTML = "EASY"; }
        else if (sel === "medium") { len = difficulty.medium.len; hints = difficulty.medium.hints; dif = "MEDIUM"; document.querySelector("#diff").innerHTML = "MEDIUM"; }
        else if (sel === "hard") { len = difficulty.hard.len; hints = difficulty.hard.hints; dif = "HARD"; document.querySelector("#diff").innerHTML = "HARD"; }

    })
})

function setDif(dif, hints) {
    document.querySelector("#dif").innerHTML = dif;
    document.querySelector("#hints").innerHTML = hints;
}

function solveBoard(solved) {
    for (let i = 0; i < 81; i++) {
        if (document.getElementById(`${i}`).innerHTML === "") {
            document.getElementById(`${i}`).innerHTML = solved[i];
        }
    }
}



newBoard("easy");

function newBoard(mode) {
    start.disabled=false;
    ++hide;selOpt="00";
    inp.forEach(ipt =>{
        ipt.disabled=true;
    })
    let newGrid=Sudoku.generate(mode);
    unsolved = newGrid[0];
    solved = newGrid[1];
    mfd=dif.toLowerCase();
    left=81-parseInt(difficulty[`${mfd}`].len);
    for (let i = 0; i < 81; i++) {
        if (unsolved[i] !== ".") {
            document.getElementById(`${i}`).innerHTML = parseInt(unsolved[i]);
            document.getElementById(`${i}`).style.backgroundColor = "rgba(52, 196, 206,0.3)";
        } 
        else {
            document.getElementById(`${i}`).innerHTML = "";
            document.getElementById(`${i}`).style.backgroundColor = "#e5ecf3";
        }
    }
    console.log(solved);
}

function chngBoard() {

    clearInterval(x);
    
    timer.innerHTML = `${time / 60}:00`;
    setDif(dif, hints);
    start.innerHTML = "START";
    start.disabled=false;
    start.style.backgroundColor = "rgb(76, 201, 59)";
    let md = dif.toLowerCase();
    newBoard(md);
}

start.addEventListener("click", () => {

    if (start.innerHTML !== "SOLVE") {
        hnleft=hints;
        nums.forEach(nump =>{
            nump.disabled=false;
        })
        inp.forEach(ipt =>{
            ipt.disabled=false;
        })
        startTimer(time);
        start.disabled = true;
        start.innerHTML = "SOLVE";
        start.style.backgroundColor = "rgb(176, 190, 181)";
    }else{
        clearInterval(x);
        nums.forEach(nump =>{
            nump.disabled=true;
        })
        inp.forEach(ipt =>{
            ipt.disabled=true;
        })
        solveBoard(solved);
        start.innerHTML = "START";
        start.style.backgroundColor = "rgb(76, 201, 59)";
        start.disabled=true;
    }
})

