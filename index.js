const colors=require("colors");

let rangeMin = process.argv[2]||2;
let rangeMax = process.argv[3]||100;

if (checkRange(rangeMin,rangeMax)){
   let count=0, result="";
   for (let i=rangeMin;i<=rangeMax;i++){
        if (isSimple(i)) result+=colored(++count,i)+" ";
    }
    output(result);
}

function isSimple(num){
    for (let i=2;i<num/2+1;i++){
        if (num%i===0) return false;
    }
    return true;
}
function colored(count,num){
    if (count%3==1) return colors.green(num);
    if (count%3==2) return colors.yellow(num);
    if (count%3==0) return colors.red(num);
}

function output(result){
    console.group(`Простые числа диапазона от ${colors.yellow(rangeMin)} до ${colors.yellow(rangeMax)}`);
    if (result) {
        console.log(result);
    } else {
        console.log(colors.red("НЕт простых чисел"));
    }
    console.groupEnd();
}

function checkRange(rangeMin,rangeMax){
    if (rangeMin==1) rangeMin=2;
    if (isNaN(rangeMin)||isNaN(rangeMax)||rangeMin>rangeMax) {
        console.log(colors.red("Ошибка "));
        return false;
    }
    return true;
}


