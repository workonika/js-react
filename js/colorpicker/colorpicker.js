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

        var colorNames = JSON.parse('{"stack":[{"groupName":"Красные","colors":[{"name":"indianred","dec":{"r":205,"g":92,"b":92}},{"name":"lightcoral","dec":{"r":240,"g":128,"b":128}},{"name":"salmon","dec":{"r":250,"g":128,"b":114}},{"name":"darksalmon","dec":{"r":233,"g":150,"b":122}},{"name":"lightsalmon","dec":{"r":255,"g":160,"b":122}},{"name":"crimson","dec":{"r":220,"g":20,"b":60}},{"name":"red","dec":{"r":255,"g":0,"b":0}},{"name":"firebrick","dec":{"r":178,"g":34,"b":34}},{"name":"darkred","dec":{"r":139,"g":0,"b":0}}]},{"groupName":"Розовые","colors":[{"name":"pink","dec":{"r":255,"g":192,"b":203}},{"name":"lightpink","dec":{"r":255,"g":182,"b":193}},{"name":"hotpink","dec":{"r":255,"g":105,"b":180}},{"name":"deeppink","dec":{"r":255,"g":20,"b":147}},{"name":"mediumvioletred","dec":{"r":199,"g":21,"b":133}},{"name":"palevioletred","dec":{"r":219,"g":112,"b":147}}]},{"groupName":"Оранжевые","colors":[{"name":"coral","dec":{"r":255,"g":127,"b":80}},{"name":"tomato","dec":{"r":255,"g":99,"b":71}},{"name":"orangered","dec":{"r":255,"g":69,"b":0}},{"name":"darkorange","dec":{"r":255,"g":140,"b":0}},{"name":"orange","dec":{"r":255,"g":165,"b":0}}]},{"groupName":"Жёлтые","colors":[{"name":"gold","dec":{"r":255,"g":215,"b":0}},{"name":"yellow","dec":{"r":255,"g":255,"b":0}},{"name":"lightyellow","dec":{"r":255,"g":255,"b":224}},{"name":"lemonchiffon","dec":{"r":255,"g":250,"b":205}},{"name":"lightgoldenrodyellow","dec":{"r":250,"g":250,"b":210}},{"name":"papayawhip","dec":{"r":255,"g":239,"b":213}},{"name":"moccasin","dec":{"r":255,"g":228,"b":181}},{"name":"peachpuff","dec":{"r":255,"g":218,"b":185}},{"name":"palegoldenrod","dec":{"r":238,"g":232,"b":170}},{"name":"khaki","dec":{"r":240,"g":230,"b":140}},{"name":"darkkhaki","dec":{"r":189,"g":183,"b":107}}]},{"groupName":"Фиолетовые","colors":[{"name":"lavender","dec":{"r":230,"g":230,"b":250}},{"name":"thistle","dec":{"r":216,"g":191,"b":216}},{"name":"plum","dec":{"r":221,"g":160,"b":221}},{"name":"violet","dec":{"r":238,"g":130,"b":238}},{"name":"orchid","dec":{"r":218,"g":112,"b":214}},{"name":"fuchsia","dec":{"r":255,"g":0,"b":255}},{"name":"mediumorchid","dec":{"r":186,"g":85,"b":211}},{"name":"mediumpurple","dec":{"r":147,"g":112,"b":219}},{"name":"blueviolet","dec":{"r":138,"g":43,"b":226}},{"name":"darkviolet","dec":{"r":148,"g":0,"b":211}},{"name":"darkorchid","dec":{"r":153,"g":50,"b":204}},{"name":"darkmagenta","dec":{"r":139,"g":0,"b":139}},{"name":"purple","dec":{"r":128,"g":0,"b":128}},{"name":"indigo","dec":{"r":75,"g":0,"b":130}},{"name":"slateblue","dec":{"r":106,"g":90,"b":205}},{"name":"darkslateblue","dec":{"r":72,"g":61,"b":139}}]},{"groupName":"Зелёные","colors":[{"name":"greenyellow","dec":{"r":173,"g":255,"b":47}},{"name":"chartreuse","dec":{"r":127,"g":255,"b":0}},{"name":"lawngreen","dec":{"r":124,"g":252,"b":0}},{"name":"lime","dec":{"r":0,"g":255,"b":0}},{"name":"limegreen","dec":{"r":50,"g":205,"b":50}},{"name":"palegreen","dec":{"r":152,"g":251,"b":152}},{"name":"lightgreen","dec":{"r":144,"g":238,"b":144}},{"name":"mediumspringgreen","dec":{"r":0,"g":250,"b":154}},{"name":"springgreen","dec":{"r":0,"g":255,"b":127}},{"name":"mediumseagreen","dec":{"r":60,"g":179,"b":113}},{"name":"seagreen","dec":{"r":46,"g":139,"b":87}},{"name":"forestgreen","dec":{"r":34,"g":139,"b":34}},{"name":"green","dec":{"r":0,"g":128,"b":0}},{"name":"darkgreen","dec":{"r":0,"g":100,"b":0}},{"name":"yellowgreen","dec":{"r":154,"g":205,"b":50}},{"name":"olivedrab","dec":{"r":107,"g":142,"b":35}},{"name":"olive","dec":{"r":128,"g":128,"b":0}},{"name":"darkolivegreen","dec":{"r":85,"g":107,"b":47}},{"name":"mediumaquamarine","dec":{"r":102,"g":205,"b":170}},{"name":"darkseagreen","dec":{"r":143,"g":188,"b":143}},{"name":"lightseagreen","dec":{"r":32,"g":178,"b":170}},{"name":"darkcyan","dec":{"r":0,"g":139,"b":139}},{"name":"teal","dec":{"r":0,"g":128,"b":128}}]},{"groupName":"Синие","colors":[{"name":"aqua","dec":{"r":0,"g":255,"b":255}},{"name":"lightcyan","dec":{"r":224,"g":255,"b":255}},{"name":"paleturquoise","dec":{"r":175,"g":238,"b":238}},{"name":"aquamarine","dec":{"r":127,"g":255,"b":212}},{"name":"turquoise","dec":{"r":64,"g":224,"b":208}},{"name":"mediumturquoise","dec":{"r":72,"g":209,"b":204}},{"name":"darkturquoise","dec":{"r":0,"g":206,"b":209}},{"name":"cadetblue","dec":{"r":95,"g":158,"b":160}},{"name":"steelblue","dec":{"r":70,"g":130,"b":180}},{"name":"lightsteelblue","dec":{"r":176,"g":196,"b":222}},{"name":"powderblue","dec":{"r":176,"g":224,"b":230}},{"name":"lightblue","dec":{"r":173,"g":216,"b":230}},{"name":"skyblue","dec":{"r":135,"g":206,"b":235}},{"name":"lightskyblue","dec":{"r":135,"g":206,"b":250}},{"name":"deepskyblue","dec":{"r":0,"g":191,"b":255}},{"name":"dodgerblue","dec":{"r":30,"g":144,"b":255}},{"name":"cornflowerblue","dec":{"r":100,"g":149,"b":237}},{"name":"mediumslateblue","dec":{"r":123,"g":104,"b":238}},{"name":"royalblue","dec":{"r":65,"g":105,"b":225}},{"name":"blue","dec":{"r":0,"g":0,"b":255}},{"name":"mediumblue","dec":{"r":0,"g":0,"b":205}},{"name":"darkblue","dec":{"r":0,"g":0,"b":139}},{"name":"navy","dec":{"r":0,"g":0,"b":128}},{"name":"midnightblue","dec":{"r":25,"g":25,"b":112}}]},{"groupName":"Коричневые","colors":[{"name":"cornsilk","dec":{"r":255,"g":248,"b":220}},{"name":"blanchedalmond","dec":{"r":255,"g":235,"b":205}},{"name":"bisque","dec":{"r":255,"g":228,"b":196}},{"name":"navajowhite","dec":{"r":255,"g":222,"b":173}},{"name":"wheat","dec":{"r":245,"g":222,"b":179}},{"name":"burlywood","dec":{"r":222,"g":184,"b":135}},{"name":"tan","dec":{"r":210,"g":180,"b":140}},{"name":"rosybrown","dec":{"r":188,"g":143,"b":143}},{"name":"sandybrown","dec":{"r":244,"g":164,"b":96}},{"name":"goldenrod","dec":{"r":218,"g":165,"b":32}},{"name":"darkgoldenrod","dec":{"r":184,"g":134,"b":11}},{"name":"peru","dec":{"r":205,"g":133,"b":63}},{"name":"chocolate","dec":{"r":210,"g":105,"b":30}},{"name":"saddlebrown","dec":{"r":139,"g":69,"b":19}},{"name":"sienna","dec":{"r":160,"g":82,"b":45}},{"name":"brown","dec":{"r":165,"g":42,"b":42}},{"name":"maroon","dec":{"r":128,"g":0,"b":0}}]},{"groupName":"Белые","colors":[{"name":"white","dec":{"r":255,"g":255,"b":255}},{"name":"snow","dec":{"r":255,"g":250,"b":250}},{"name":"honeydew","dec":{"r":240,"g":255,"b":240}},{"name":"mintcream","dec":{"r":245,"g":255,"b":250}},{"name":"azure","dec":{"r":240,"g":255,"b":255}},{"name":"aliceblue","dec":{"r":240,"g":248,"b":255}},{"name":"ghostwhite","dec":{"r":248,"g":248,"b":255}},{"name":"whitesmoke","dec":{"r":245,"g":245,"b":245}},{"name":"seashell","dec":{"r":255,"g":245,"b":238}},{"name":"beige","dec":{"r":245,"g":245,"b":220}},{"name":"oldlace","dec":{"r":253,"g":245,"b":230}},{"name":"floralwhite","dec":{"r":255,"g":250,"b":240}},{"name":"ivory","dec":{"r":255,"g":255,"b":240}},{"name":"antiquewhite","dec":{"r":250,"g":235,"b":215}},{"name":"linen","dec":{"r":250,"g":240,"b":230}},{"name":"lavenderblush","dec":{"r":255,"g":240,"b":245}},{"name":"mistyrose","dec":{"r":255,"g":228,"b":225}}]}]}');

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
            cssClassesForControl: cssClassesForControl,
            startWayName: "square"
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

        var display = function(wayName){
            return wayName === p.startWayName ? "block" : "none";
        };

        var border = function(wayName){
            return wayName === p.startWayName ? "1px solid black" : "none";
        }
    
        waysOfGettingColorKeys.sort(function(a,b){
            return p.wayOfGettingColor[p.lang][a].order - p.wayOfGettingColor[p.lang][b].order
        });

        cssClassesForControl.forEach(function(cssClass){
            
            this.innerHTML += "<div class='" + cssClass + "'>" + 
                
                waysOfGettingColorKeys.reduce({
                    "way-of-getting-color" : function(curr, next){
                        return curr + "<div class='" + next + "' title='" 
                            + p.wayOfGettingColor[p.lang][next].name + "' style='border:" + border(next) + "'>"
                            + p.wayOfGettingColor[p.lang][next].name + "</div>";
                    },
                    "color-formats" : function(curr, next){
                        var matchFormat = p.matchFormatToMethod[next]
                            .filter(function(format){ return format.match})
                            .sort(function(a,b){return a.order-b.order});

                        var str = curr + "<div class='" + next + "' title='" 
                            + p.wayOfGettingColor[p.lang][next].name + "' style='display:" + display(next) + "'>";

                        matchFormat.forEach(function(format){
                            str += "<div class='" + format.name + "' title='" + format.name + "'>" 
                            + format.name + "</div>";
                        });

                        return str + "</div>";
                    },
                    "content-of-way" : function(curr, next){
                        return curr + "</div><div class='" + next + "' style='display:" + display(next) + "'>" + next + "</div>";
                    }

                }[cssClass], "")
                
                + "</div>";

        }, innerHTML);

        div.innerHTML = innerHTML.innerHTML;

        return div;
    }

    function bindEventListeners(widgetDOM, inputStackDOM, getInputSizeAndPosition, cssClassesForControl){
        
        inputStackDOM.forEach(function(input){ 
            input.addEventListener("click", clickInput, false); 
        });

        var close = widgetDOM.querySelector(".close");
        close.addEventListener("click", clickClose, false);

        widgetDOM.addEventListener("click", clickWidget, false);

        //Клик на input type=text
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
        //Клик на colorpicker
        function clickWidget(e){

        }
        //Клик на 
        function clickClose(e){

            var t = e.target;
            hideWidget();
        }
        //Проверка, где сделан клик и если вне colorpicker, то закрывается colorpicker
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

        function hideWidget(){
            document.removeEventListener("click", clickOutOfWidget, false);
            widgetDOM.style.display = "none";
            inputStackDOM.forEach(function(input){input.removeAttribute("data-is-colorpicker-opened");});
        }

        function displayWidget(){
            document.addEventListener("click", clickOutOfWidget, false);
            widgetDOM.style.display = "block";
        }

        return {inputStackDOM: inputStackDOM, widgetDOM: widgetDOM};
    }

    return colorPicker;
})();