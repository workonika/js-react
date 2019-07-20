/*
Отталкиваясь от источника данных, создаю следующую структуру: 

[{
    groupName: string,
    colors: [{
        name: string,
        dec: {
            r: number,
            g: number,
            b: number
        }
    }]
}]

*/

function assignNewObj(tr){
    return {groupName: tr.querySelector("b").textContent, colors:[]};
}

const trMap = Array.from(document.querySelectorAll("table[cellpadding='4'] tr:not(:first-child)"));

const colorsGroupped = {temp: undefined, stack: []};

trMap.forEach(function(tr){
    
    if(!tr.style.background){

        if(!this.temp)
            this.temp = assignNewObj(tr);
        else {
            this.stack.push(this.temp);
            this.temp = assignNewObj(tr);
        }

    } else {

        const 
            tdText = tr.querySelector("td:last-child").textContent,
            rgb = tdText.split(/\s/);

        this.temp.colors.push({
            name: tr.style.background,
            dec: {
                r: +rgb[0],
                g: +rgb[1],
                b: +rgb[2]
            }
        });
    }
}, colorsGroupped);

delete colorsGroupped.temp;

//JSON.stringify(colorsGroupped);
console.dir(colorsGroupped);
