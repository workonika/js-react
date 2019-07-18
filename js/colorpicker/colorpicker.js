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
            //Сначала с меньшим индексом
            square: [ 
                {
                    name: "rgb", match: true, order: 2
                }, 
                {
                    name: "hex", match: true, order: 1
                }, 
                {
                    name: "rgba", match: false, order: 0
                }, 
                {
                    name: "webnames", match: true, order: 0
                }
            ],
            circle: [ 
                {
                    name: "rgb", match: true, order: 2
                }, 
                {
                    name: "hex", match: true, order: 1
                }, 
                {
                    name: "rgba", match: false, order: 0
                }, 
                {
                    name: "webnames", match: false, order: 0
                }
            ],
            slider: [ 
                {
                    name: "rgb", match: true, order: 2
                }, 
                {
                    name: "hex", match: true, order: 1
                }, 
                {
                    name: "rgba", match: true, order: 0
                }, 
                {
                    name: "webnames", match: false, order: 0
                }
            ],
            dropper: [ 
                {
                    name: "rgb", match: true, order: 2
                }, 
                {
                    name: "hex", match: true, order: 1
                }, 
                {
                    name: "rgba", match: false, order: 0
                }, 
                {
                    name: "webnames", match: false, order: 0
                }
            ],
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

        var cssClassesForControl = ["way-of-getting-color", "color-formats", "content-of-way"];

        var paramsOfcreateWidgetDOMElement = {
            widgetSize: { width: 200, height: 200 },
            wayOfGettingColor: wayOfGettingColor, 
            colorFormats: colorFormats, 
            matchFormatToMethod: matchFormatToMethod, 
            lang: lang,
            cssClassesForControl: cssClassesForControl
        };

        var widgetDOM = createWidgetDOMElement(paramsOfcreateWidgetDOMElement);
        document.body.appendChild(widgetDOM); 
        bindEventListeners(widgetDOM, inputStackDOM, getInputSizeAndPosition, cssClassesForControl);

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
        
        var p = params, 
            div = document.createElement("div"),
            mu = "px";

        div.style.position = "absolute";
        div.style.width = p.widgetSize.width + mu;
        div.style.height = p.widgetSize.height + mu;
        div.style.border = "2px solid red";
        div.style.display = "none";

        var innerHTML = { innerHTML: "<div class='close'>x</div>", },
            waysOfGettingColorKeys = Object.keys(p.wayOfGettingColor[p.lang]),
            cssClassesForControl = p.cssClassesForControl;

            waysOfGettingColorKeys.sort(function(a,b){
                return p.wayOfGettingColor[p.lang][a].order - p.wayOfGettingColor[p.lang][b].order
            });

        waysOfGettingColorKeys.forEach(function(wayName){
            
            this.innerHTML += "<div class='" + cssClassesForControl[0] + "' title='" + p.wayOfGettingColor[p.lang][wayName].name
            + "'>" + p.wayOfGettingColor[p.lang][wayName].name + "</div>";

            var matchFormat = p.matchFormatToMethod[wayName]
                .filter(function(format){ return format.match})
                .sort(function(a,b){return a.order-b.order});

            this.innerHTML += "<div class='" + cssClassesForControl[1] + " " + wayName + "'>"
            
            matchFormat.forEach(function(format){
                this.innerHTML += "<div class='" + format.name + "' title='" + format.name + "'>" 
                + format.name + "</div>";
            }, this);

            this.innerHTML += "</div><div class='" + cssClassesForControl[2] + " " + wayName + "'>" + wayName + "</div>";

        }, innerHTML);

        div.innerHTML = innerHTML.innerHTML;

        return div;
    }

    function bindEventListeners(widgetDOM, inputStackDOM, getInputSizeAndPosition){
        
        inputStackDOM.forEach(function(input){ 
            input.addEventListener("click", clickInput, false); 
        });

        var close = widgetDOM.querySelector(".close");
        close.addEventListener("click", clickClose, false);

        document.addEventListener("click", clickOutOfWidget, false);
        
        function clickInput(e){
            var t = e.target;
            
            if(t.getAttribute("data-is-colorpicker-opened") === "true")
                return false;

            var 
                inputSizeAndPosition = getInputSizeAndPosition(t), 
                mu = "px"

            hideWidget();

            inputStackDOM.forEach(function(input){
                input.removeAttribute("data-is-colorpicker-opened");
            });

            t.setAttribute("data-is-colorpicker-opened", true);

            widgetDOM.style.top = inputSizeAndPosition.top + inputSizeAndPosition.height + mu;
            widgetDOM.style.left = inputSizeAndPosition.left + mu;
            displayWidget();
        }

        function clickWidget(e){}

        function clickClose(e){

            var t = e.target;
            hideWidget();
        }

        function hideWidget(){
            widgetDOM.style.display = "none";
            inputStackDOM.forEach(function(input){input.removeAttribute("data-is-colorpicker-opened");});
        }

        function displayWidget(){
            widgetDOM.style.display = "block";
        }

        function clickOutOfWidget(e){

            var t = e.target;

            var isClickInInput = inputStackDOM.some(function(input){
                return input === t;
            });

            var isInputOpen = inputStackDOM.some(function(input){
                return input.hasAttribute("data-is-colorpicker-opened");
            });

            if(!isClickInInput && isInputOpen){

                var stack = traversalDOMUp(t, []);

                var filteredStack = stack.filter(function(DOMElement){ return DOMElement === widgetDOM});

                if(!filteredStack.length)
                    hideWidget();
            }

            function traversalDOMUp(DOMElement, stack){
            
                if(DOMElement === widgetDOM){
                    stack.push(DOMElement);
                    return stack;
                }
                
                if(!DOMElement)
                    return stack;
    
                DOMElement = DOMElement.parentNode;
    
                return traversalDOMUp(DOMElement, stack);
            }
    
        }

        return {inputStackDOM: inputStackDOM, widgetDOM: widgetDOM};
    }

    return colorPicker;
})();