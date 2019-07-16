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
        var DOMstack = [].slice.call(document.querySelectorAll(typeof params === "string" ? params : params.selector));
        if(!DOMstack.length){
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

        //К элементам input прикрепляем DOM-элементы для взаимодействия с виджетом и для этого меняем css-стили
        var df = document.createDocumentFragment(),
            panelStack = [];

        DOMstack.forEach(function(input){
            var position = getComputedStyle(input).getPropertyValue("position"),
                inputSize = getInputSizeAndPosition(input);

            if(position === "static"){
                input.style.position = "relative";
            }

            var panel = createWidfetPanel(inputSize, {width: 200, height: 200});
            var close = panel.querySelector(".close");

            panelStack.push(panel);

            addEventsListeners(input, panel, close, panelStack, DOMstack);

            df.appendChild(panel);
        });

        //Вставляем панели виджета в DOM
        document.body.appendChild(df);

    //конец функции colorPicker
    }

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

    function createWidfetPanel(inputSize, panelSize){
        var div = document.createElement("div"),
            mu = "px";
            div.style.position = "absolute";
            div.style.width = panelSize.width + mu;
            div.style.height = panelSize.height + mu;
            div.style.top = inputSize.top + inputSize.height + mu;
            div.style.left = inputSize.left + mu;
            div.style.border = "2px solid red";
            div.style.display = "none";

            div.innerHTML = "<div class='close'>x</div>";

        return div;
    }

    function addEventsListeners(input, panel, close, panelStack, DOMstack){
        
        input.addEventListener("click", clickInput, false);
        panel.addEventListener("click", clickPanel, false);
        close.addEventListener("click", clickClose, false);

        function clickInput(e){
            var t = e.target; 
            
            if(t.getAttribute("data-is-colorpicker-opened") === "true")
                return false;

            panelStack.forEach(function(input){ 
                input.style.display = "none"; 
            });

            DOMstack.forEach(function(input){input.removeAttribute("data-is-colorpicker-opened");})

            input.setAttribute("data-is-colorpicker-opened", true);
            panel.style.display = "block";
            
        }

        function clickPanel(e){}

        function clickClose(e){
            
            DOMstack.forEach(function(input){input.removeAttribute("data-is-colorpicker-opened");})
            panel.style.display = "none";
        }

        return input;
    }

    return colorPicker;
})();