const savebtn = document.getElementById("save-btn")
const textInput = document.getElementById("text");
const fileInput = document.getElementById("file");
const eraserbtn = document.getElementById("eraser-btn");
const destorybtn = document.getElementById("destroy-btn");
const modeBtn = document.getElementById("mode-btn");
const colorOptions = Array.from(document.getElementsByClassName("color-option"));  //자바스크립트 배열로 생성 
const color = document.getElementById("color");
const lineWidth = document.getElementById("line-width");
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d"); //캔버스에 그림을 그릴 때 사용하는 것 

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
ctx.lineWidth = lineWidth.value;
ctx.lineCap = "round";
let isPainting = false;  //마우스로 그리고 있는지 아닌지를 확인 
let isFilling = false;

function onMove(event) {
    if (isPainting) {
        ctx.lineTo(event.offsetX, event.offsetY);
        ctx.stroke();
        return;
    }
    ctx.beginPath();
    ctx.moveTo(event.offsetX, event.offsetY);  //isPainting이 false면 연필을 움직이기만 할 수 있게 한다. 
}

function startingPainting() {  //마우스를 누르는 순간 inPainting이 true가 된다. 
    isPainting = true;
}

function cancelPainting() {  //마우스를 떼는 순간 isPainting이 false가 된다. 
    isPainting = false;
}

function onLineWidthChange(event) {
    ctx.lineWidth = event.target.value;
}

function onColorChange(event) {
    ctx.strokeStyle = event.target.value;
    ctx.fillStyle = event.target.value;
}

function onColorClick(event) {
    const colorValue = event.target.dataset.color;
    ctx.strokeStyle = colorValue;
    ctx.fillStyle = colorValue;
    color.value = colorValue;  //사용자에게 선택한 색깔을 알려주기 위해 추가
}

function onModeClick(){
    if(isFilling) {
        isFilling = false;
        modeBtn.innerText = "Fill";
    } else{
        isFilling = true  ; 
        modeBtn.innerText = "Draw";
    }
}

function onCanvasClick(){
    if(isFilling) {
ctx.fillRect(0,0, CANVAS_WIDTH, CANVAS_HEIGHT );
    }
}

function onDestoryClick(){
    ctx.fillStyle = "white";
    ctx.fillRect(0,0, CANVAS_WIDTH, CANVAS_HEIGHT );
}

function onEraserClick() {
    ctx.strokeStyle = "white";
    isFilling = false;
    modeBtn.innerText = "Fill";
}

function onFileChange(event) {
    const file = event.target.files[0];  //파일을 가져오고 
    const url = URL.createObjectURL(file);  //파일을 가르키는 URL을 가져온다. 이미지를 만들기 위해서는 그 이미지의 URL로 설정해야하기 때문.  
    const image = new Image(); //html <img src=""/> 
    image.src = url;
    image.onload = function() {
        ctx.drawImage(image, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        fileInput.value = null;
    };
    
}

function onDoubleClick(event) {
    const text = textInput.value;
    if (text !== "") {
    ctx.save();  //ctx의 현재 상태를 저장 
    ctx.lineWidth = 1;
    ctx.font = "50px serif";
    ctx.strokeText(text, event.offsetX, event.offsetY);
    ctx.restore();  //저장했던 버전으로 되돌림
    }
}

function onSaveClick(){   //다시 공부하기!!!!! 3.3
    const url = canvas.toDataURL();     //그림을 URL로 변경 
    const a = document.createElement("a");    //a를 생서앻 가짜 링크를 생성 
    a.href = url;   //링크의 href는 그림 URL로 설정 
    a.download = "myDrawing.png";    //내그림png라는 파일명으로 저장시킨다고 설정 
    a.click();   //링크를 클릭히면 파일이 다운로드 된다. 
}

canvas.addEventListener("dblclick", onDoubleClick);
canvas.addEventListener("mousemove", onMove);  //canvus 위에서 마우스를 움직일 때마다 moveTo 호출 
canvas.addEventListener("mousedown", startingPainting);   //마우스를 누르고 있는 상태를 알기 위함 
canvas.addEventListener("mouseup", cancelPainting);
canvas.addEventListener("mouseleave", cancelPainting);
canvas.addEventListener("click", onCanvasClick);
lineWidth.addEventListener("change", onLineWidthChange);
color.addEventListener("change", onColorChange);
destorybtn.addEventListener("click", onDestoryClick);
eraserbtn.addEventListener("click", onEraserClick);
fileInput.addEventListener("change", onFileChange);
savebtn.addEventListener("click", onSaveClick);

colorOptions.forEach(color => color.addEventListener("click", onColorClick)); //color를 클릭할 때마다 호출
modeBtn.addEventListener("click", onModeClick);