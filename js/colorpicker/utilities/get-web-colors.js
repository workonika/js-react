const fs = require('fs');
const path = "colors-names.csv";

var request = require('request');

var URL = 'https://ru.wikipedia.org/wiki/%D0%A6%D0%B2%D0%B5%D1%82%D0%B0_HTML';

request(URL, function (err, res, body) {
    if (err) throw err;
    console.log(body);
    console.log(res.statusCode);
});

//Задача: на выходе получить следующую структуру данных
/*
    {
        groupName: {
            colorName: {
                r: number [0..255],
                g: number [0..255],
                b: number [0..255]
            }
        }
    }

    Где groupName - имя группы цветов, например red, где приводятся все красные цвета. 
    Группировка цветов и сами цвета взяты: https://ru.wikipedia.org/wiki/%D0%A6%D0%B2%D0%B5%D1%82%D0%B0_HTML 
*/
const rgb = ["r", "g", "b"];
/*
fs.readFile(path, "utf-8", function(error, data){
    if(error)
        console.error("error:", error.message);
    else {
        console.log("successfulle opened");
        const splitStream = data.split("\n");
        const colorsMap = {};
        
        splitStream.forEach(function(str){
            
            var split = str.split(",");
            
            if(split[3] !== ""){
                
                if("temp" in this){
                    delete this.temp;
                }
                this.temp = this[split[3]] = {};
            }

            this.temp[split[0]] = {};

            if(split[2].match(/\s/) === null)
                splitStr(split[2]).forEach((channel, idx)=>{
                    this.temp[split[0]][rgb[idx]] = + channel;
                });
            else{
                split[2].split(/\s/).forEach((channel, idx)=>{
                    this.temp[split[0]][rgb[idx]] =+ channel;
                });
            }
                
        }, colorsMap);

        console.log(colorsMap);
    }
});
*/
function splitStr(str, num = 3){

    const splitted = str.split("");
    const returnList = [];

    for(var i = 0; i < splitted.length; i += num )
        returnList.push(splitted.slice(i, i + num));

    return returnList;
}