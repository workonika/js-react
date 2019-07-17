var colorPicker = (function(){
    function colorPicker(params){
        if(typeof params === undefined || typeof params !== "string" && typeof params !== "object"){
            throw new Error("Параметр должен быть или объектом или строкой и не должен быть null");
        }

        //Язык интерфейса
        var lang = params.lang || "ru";
        //Способы получения цвета
        var wayOfGettingColor = {
            ru: {
                square: {
                    name: "Квадраты с web именами",
                    order: 0
                },
                circle: {
                    name: "Цветовой круг",
                    order: 1
                },
                slider: {
                    name: "Слайдер",
                    order: 2
                },
                dropper: {
                    name: "Пипетка",
                    order: 3
                }
            }
        };
        //Форматы цветов
        var colorFormats = {
            ru: {
                rgb: {
                    name: "rgb",
                    order: 0
                }, 
                hex: {
                    name: "hex",
                    order: 1
                }, 
                rgba: {
                    name: "rgba", 
                    order: 2
                }, 
                webnames: {
                    name: "web имена",
                    order: 3
                }
            }
        };
        //Соответствие доступных форматов цветов способу получения цвета
        var matchFormatToMethod = {
            //rgb, hex, rgba, webnames
            square: [{match: true, order: 2}, {match: true, order: 1}, {match: false, order: 0}, {match: true, order: 0}],
            circle: [{match: true, order: 2}, {match: true, order: 1}, {match: false, order: 0}, {match: false, order: 0}],
            slider: [{match: true, order: 2}, {match: true, order: 1}, {match: true, order: 0}, {match: false, order: 0}],
            dropper: [{match: true, order: 2}, {match: true, order: 1}, {match: false, order: 0}, {match: false, order: 0}]
        };

        //Получаем стэк полей input к которым прикрепляется виджет
        var inputStackDOM = [].slice.call(document.querySelectorAll(typeof params === "string" ? params : params.selector));
        if(!inputStackDOM.length){
            var input = document.querySelectorAll("input");
            if(input.length){
                console.warn("Вы передали некорректный селектор!\nВиджет colorpicker не прикреплён ни к одному из DOM-элементов input\n\
                в текущем документе присутствуют следующие элементы input");
                console.group("Элументы input");
                [].slice.call(input).forEach(function(el){console.log(el)});
                console.groupEnd();
            } else {
                console.warn("В текущем документе нет ни одного элемента input!!!\nПоэтому виджет colorpicker не к чему прикрепить");
            }

            return undefined;
        }

        //Элементам input назначается событие клик, при клике на котором появляется colorPicker
        inputStackDOM.forEach(function(input){

            var position = getComputedStyle(input).getPropertyValue("position");

            if(position === "static"){
                input.style.position = "relative";
            }

        });

        var paramsOfcreateWidgetDOMElement = {
            widgetSize: {width: 200, height: 200},
            wayOfGettingColor: wayOfGettingColor, 
            colorFormats: colorFormats, 
            matchFormatToMethod: matchFormatToMethod, 
            lang: lang
        };

        var widgetDOM = createWidgetDOMElement(paramsOfcreateWidgetDOMElement); //Задаются размеры виджета то есть окошка colorPicker
        document.body.appendChild(widgetDOM); //Помещаем colorPicker в DOM-дерево
        bindEventListeners(widgetDOM, inputStackDOM, getInputSizeAndPosition);

    //конец функции colorPicker
    }

    //Получить размеры DOM-элемента, а также абсолютную позицию top, left
    //определенного как параметр и конечно переданного в качестве аргумента при вызове ф-ии
    function getInputSizeAndPosition(input){
        var
            rect = input.getBoundingClientRect(),
            width = rect.width,
            height = rect.height,
            top = input.offsetTop,
            left = input.offsetLeft;

        return {
            width: width, height: height, top: top, left: left
        };
    }

    function createWidgetDOMElement(params){
        var p = params; 
        
        var div = document.createElement("div"),
            mu = "px";
            div.style.position = "absolute";
            div.style.width = panelSize.width + mu;
            div.style.height = panelSize.height + mu;
            div.style.border = "2px solid red";
            div.style.display = "none";

            div.innerHTML = "<div class='close'>x</div>";

        return div;
    }

    function bindEventListeners(widgetDOM, inputStackDOM, getInputSizeAndPosition){
        
        inputStackDOM.forEach(function(input){ 
            input.addEventListener("click", clickInput, false); 
        });

        var close = widgetDOM.querySelector(".close");
        close.addEventListener("click", clickClose, false);
        
        function clickInput(e){
            var t = e.target,
                inputSizeAndPosition = getInputSizeAndPosition(t), 
                mu = "px";
            
            if(t.getAttribute("data-is-colorpicker-opened") === "true")
                return false;

            widgetDOM.style.display = "none";

            inputStackDOM.forEach(function(input){
                input.removeAttribute("data-is-colorpicker-opened");
            });

            t.setAttribute("data-is-colorpicker-opened", true);

            widgetDOM.style.top = inputSizeAndPosition.top + inputSizeAndPosition.height + mu;
            widgetDOM.style.left = inputSizeAndPosition.left + mu;
            widgetDOM.style.display = "block";
        }

        function clickPanel(e){}

        function clickClose(e){

            var t = e.target;
            
            inputStackDOM.forEach(function(input){input.removeAttribute("data-is-colorpicker-opened");});
            panelStackDOM.forEach(function(panel){panel.style.display = "none";});
        }

        return {inputStackDOM: inputStackDOM, panelStackDOM: panelStackDOM};
    }

    return colorPicker;
})();