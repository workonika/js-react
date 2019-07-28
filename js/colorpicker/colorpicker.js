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
                    name: "Заготовленные цвета",
                    order: 0
                },
                rect: {
                    name: "Спектр",
                    order: 1
                },
                slider: {
                    name: "Слайдер",
                    order: 2
                },
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
                    name: "html названия цветов",
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
            rect: [ 
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
        };

        var colorNames = JSON.parse('{"stack":[{"groupName":"Красные","colors":[{"name":"indianred","dec":{"r":205,"g":92,"b":92}},{"name":"lightcoral","dec":{"r":240,"g":128,"b":128}},{"name":"salmon","dec":{"r":250,"g":128,"b":114}},{"name":"darksalmon","dec":{"r":233,"g":150,"b":122}},{"name":"lightsalmon","dec":{"r":255,"g":160,"b":122}},{"name":"crimson","dec":{"r":220,"g":20,"b":60}},{"name":"red","dec":{"r":255,"g":0,"b":0}},{"name":"firebrick","dec":{"r":178,"g":34,"b":34}},{"name":"darkred","dec":{"r":139,"g":0,"b":0}}]},{"groupName":"Розовые","colors":[{"name":"pink","dec":{"r":255,"g":192,"b":203}},{"name":"lightpink","dec":{"r":255,"g":182,"b":193}},{"name":"hotpink","dec":{"r":255,"g":105,"b":180}},{"name":"deeppink","dec":{"r":255,"g":20,"b":147}},{"name":"mediumvioletred","dec":{"r":199,"g":21,"b":133}},{"name":"palevioletred","dec":{"r":219,"g":112,"b":147}}]},{"groupName":"Оранжевые","colors":[{"name":"coral","dec":{"r":255,"g":127,"b":80}},{"name":"tomato","dec":{"r":255,"g":99,"b":71}},{"name":"orangered","dec":{"r":255,"g":69,"b":0}},{"name":"darkorange","dec":{"r":255,"g":140,"b":0}},{"name":"orange","dec":{"r":255,"g":165,"b":0}}]},{"groupName":"Жёлтые","colors":[{"name":"gold","dec":{"r":255,"g":215,"b":0}},{"name":"yellow","dec":{"r":255,"g":255,"b":0}},{"name":"lightyellow","dec":{"r":255,"g":255,"b":224}},{"name":"lemonchiffon","dec":{"r":255,"g":250,"b":205}},{"name":"lightgoldenrodyellow","dec":{"r":250,"g":250,"b":210}},{"name":"papayawhip","dec":{"r":255,"g":239,"b":213}},{"name":"moccasin","dec":{"r":255,"g":228,"b":181}},{"name":"peachpuff","dec":{"r":255,"g":218,"b":185}},{"name":"palegoldenrod","dec":{"r":238,"g":232,"b":170}},{"name":"khaki","dec":{"r":240,"g":230,"b":140}},{"name":"darkkhaki","dec":{"r":189,"g":183,"b":107}}]},{"groupName":"Фиолетовые","colors":[{"name":"lavender","dec":{"r":230,"g":230,"b":250}},{"name":"thistle","dec":{"r":216,"g":191,"b":216}},{"name":"plum","dec":{"r":221,"g":160,"b":221}},{"name":"violet","dec":{"r":238,"g":130,"b":238}},{"name":"orchid","dec":{"r":218,"g":112,"b":214}},{"name":"fuchsia","dec":{"r":255,"g":0,"b":255}},{"name":"mediumorchid","dec":{"r":186,"g":85,"b":211}},{"name":"mediumpurple","dec":{"r":147,"g":112,"b":219}},{"name":"blueviolet","dec":{"r":138,"g":43,"b":226}},{"name":"darkviolet","dec":{"r":148,"g":0,"b":211}},{"name":"darkorchid","dec":{"r":153,"g":50,"b":204}},{"name":"darkmagenta","dec":{"r":139,"g":0,"b":139}},{"name":"purple","dec":{"r":128,"g":0,"b":128}},{"name":"indigo","dec":{"r":75,"g":0,"b":130}},{"name":"slateblue","dec":{"r":106,"g":90,"b":205}},{"name":"darkslateblue","dec":{"r":72,"g":61,"b":139}}]},{"groupName":"Зелёные","colors":[{"name":"greenyellow","dec":{"r":173,"g":255,"b":47}},{"name":"chartreuse","dec":{"r":127,"g":255,"b":0}},{"name":"lawngreen","dec":{"r":124,"g":252,"b":0}},{"name":"lime","dec":{"r":0,"g":255,"b":0}},{"name":"limegreen","dec":{"r":50,"g":205,"b":50}},{"name":"palegreen","dec":{"r":152,"g":251,"b":152}},{"name":"lightgreen","dec":{"r":144,"g":238,"b":144}},{"name":"mediumspringgreen","dec":{"r":0,"g":250,"b":154}},{"name":"springgreen","dec":{"r":0,"g":255,"b":127}},{"name":"mediumseagreen","dec":{"r":60,"g":179,"b":113}},{"name":"seagreen","dec":{"r":46,"g":139,"b":87}},{"name":"forestgreen","dec":{"r":34,"g":139,"b":34}},{"name":"green","dec":{"r":0,"g":128,"b":0}},{"name":"darkgreen","dec":{"r":0,"g":100,"b":0}},{"name":"yellowgreen","dec":{"r":154,"g":205,"b":50}},{"name":"olivedrab","dec":{"r":107,"g":142,"b":35}},{"name":"olive","dec":{"r":128,"g":128,"b":0}},{"name":"darkolivegreen","dec":{"r":85,"g":107,"b":47}},{"name":"mediumaquamarine","dec":{"r":102,"g":205,"b":170}},{"name":"darkseagreen","dec":{"r":143,"g":188,"b":143}},{"name":"lightseagreen","dec":{"r":32,"g":178,"b":170}},{"name":"darkcyan","dec":{"r":0,"g":139,"b":139}},{"name":"teal","dec":{"r":0,"g":128,"b":128}}]},{"groupName":"Синие","colors":[{"name":"aqua","dec":{"r":0,"g":255,"b":255}},{"name":"lightcyan","dec":{"r":224,"g":255,"b":255}},{"name":"paleturquoise","dec":{"r":175,"g":238,"b":238}},{"name":"aquamarine","dec":{"r":127,"g":255,"b":212}},{"name":"turquoise","dec":{"r":64,"g":224,"b":208}},{"name":"mediumturquoise","dec":{"r":72,"g":209,"b":204}},{"name":"darkturquoise","dec":{"r":0,"g":206,"b":209}},{"name":"cadetblue","dec":{"r":95,"g":158,"b":160}},{"name":"steelblue","dec":{"r":70,"g":130,"b":180}},{"name":"lightsteelblue","dec":{"r":176,"g":196,"b":222}},{"name":"powderblue","dec":{"r":176,"g":224,"b":230}},{"name":"lightblue","dec":{"r":173,"g":216,"b":230}},{"name":"skyblue","dec":{"r":135,"g":206,"b":235}},{"name":"lightskyblue","dec":{"r":135,"g":206,"b":250}},{"name":"deepskyblue","dec":{"r":0,"g":191,"b":255}},{"name":"dodgerblue","dec":{"r":30,"g":144,"b":255}},{"name":"cornflowerblue","dec":{"r":100,"g":149,"b":237}},{"name":"mediumslateblue","dec":{"r":123,"g":104,"b":238}},{"name":"royalblue","dec":{"r":65,"g":105,"b":225}},{"name":"blue","dec":{"r":0,"g":0,"b":255}},{"name":"mediumblue","dec":{"r":0,"g":0,"b":205}},{"name":"darkblue","dec":{"r":0,"g":0,"b":139}},{"name":"navy","dec":{"r":0,"g":0,"b":128}},{"name":"midnightblue","dec":{"r":25,"g":25,"b":112}}]},{"groupName":"Коричневые","colors":[{"name":"cornsilk","dec":{"r":255,"g":248,"b":220}},{"name":"blanchedalmond","dec":{"r":255,"g":235,"b":205}},{"name":"bisque","dec":{"r":255,"g":228,"b":196}},{"name":"navajowhite","dec":{"r":255,"g":222,"b":173}},{"name":"wheat","dec":{"r":245,"g":222,"b":179}},{"name":"burlywood","dec":{"r":222,"g":184,"b":135}},{"name":"tan","dec":{"r":210,"g":180,"b":140}},{"name":"rosybrown","dec":{"r":188,"g":143,"b":143}},{"name":"sandybrown","dec":{"r":244,"g":164,"b":96}},{"name":"goldenrod","dec":{"r":218,"g":165,"b":32}},{"name":"darkgoldenrod","dec":{"r":184,"g":134,"b":11}},{"name":"peru","dec":{"r":205,"g":133,"b":63}},{"name":"chocolate","dec":{"r":210,"g":105,"b":30}},{"name":"saddlebrown","dec":{"r":139,"g":69,"b":19}},{"name":"sienna","dec":{"r":160,"g":82,"b":45}},{"name":"brown","dec":{"r":165,"g":42,"b":42}},{"name":"maroon","dec":{"r":128,"g":0,"b":0}}]},{"groupName":"Белые","colors":[{"name":"white","dec":{"r":255,"g":255,"b":255}},{"name":"snow","dec":{"r":255,"g":250,"b":250}},{"name":"honeydew","dec":{"r":240,"g":255,"b":240}},{"name":"mintcream","dec":{"r":245,"g":255,"b":250}},{"name":"azure","dec":{"r":240,"g":255,"b":255}},{"name":"aliceblue","dec":{"r":240,"g":248,"b":255}},{"name":"ghostwhite","dec":{"r":248,"g":248,"b":255}},{"name":"whitesmoke","dec":{"r":245,"g":245,"b":245}},{"name":"seashell","dec":{"r":255,"g":245,"b":238}},{"name":"beige","dec":{"r":245,"g":245,"b":220}},{"name":"oldlace","dec":{"r":253,"g":245,"b":230}},{"name":"floralwhite","dec":{"r":255,"g":250,"b":240}},{"name":"ivory","dec":{"r":255,"g":255,"b":240}},{"name":"antiquewhite","dec":{"r":250,"g":235,"b":215}},{"name":"linen","dec":{"r":250,"g":240,"b":230}},{"name":"lavenderblush","dec":{"r":255,"g":240,"b":245}},{"name":"mistyrose","dec":{"r":255,"g":228,"b":225}}]}]}');
        colorNames = colorNames.stack;

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

        var cssClassesForControl = {
                area: ["way-of-getting-color", "color-formats", "content-of-way"],
                square: ["webnames", "rgb"],
                rect: ["rectangle-chooser-color", "rectangle-color", "pointer-color", "spectr-color", 
                        "slider-color", "choosed-color", "button-choose-result-color"],
                slider: ["parent-red", "slide-red", "parent-green", "slide-green", "parent-blue", "slide-blue"]
            },
            waysOfGettingColorKeys = Object.keys(wayOfGettingColor[lang]),
            startWayName = "square",
            startColorFormat = "hex";

        var paramsOfcreateWidgetDOMElement = {
            widgetSize: { width: 350, height: 300 },
            wayOfGettingColor: wayOfGettingColor, 
            matchFormatToMethod: matchFormatToMethod, 
            lang: lang,
            colorFormats: colorFormats,
            cssClassesForControl: cssClassesForControl,
            waysOfGettingColorKeys: waysOfGettingColorKeys,
            startWayName: startWayName,
            startColorFormat: startColorFormat,
            colorNames: colorNames
        };

        var widgetDOM = createWidgetDOMElement(paramsOfcreateWidgetDOMElement);
        document.body.appendChild(widgetDOM);

        var paramsOfBindEventListeners = {
            widgetDOM: widgetDOM,
            inputStackDOM: inputStackDOM,
            getInputSizeAndPosition: getInputSizeAndPosition,
            cssClassesForControl: cssClassesForControl,
            waysOfGettingColorKeys: waysOfGettingColorKeys,
            colorFormatsKeys: Object.keys(colorFormats[lang]),
            startWayName: startWayName,
            startColorFormat: startColorFormat
        };

        bindEventListeners(paramsOfBindEventListeners);

    //конец функции colorPicker
    }

    var display = function(isTrue, displayAs){
        return isTrue ? (displayAs || "block") : "none";
    };

    var border = function(isTrue){
        return isTrue ? "1px solid black" : "none";
    };

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
        div.style.border = "1px solid #aaabaa";
        div.style.display = "none";
        div.style.fontFamily = "sans-serif";
        div.style.fontSize = ".8em";
        div.style.marginTop = "2px";
        div.style.padding = "5px";
        div.style.color = "#4e4d4d";

        var innerHTML = { innerHTML: "<div style='position: absolute; width: 20px; height: 20px; right: 0; rotate: 45deg; font-size: 1.4em' class='close'>&times;</div>", },
            waysOfGettingColorKeys = p.waysOfGettingColorKeys,
            cssClassesForControl = p.cssClassesForControl,
            matchFormatToMethod = p.matchFormatToMethod,
            colorFormats = p.colorFormats;

        var contentMap = {
            square: buildSquare.bind({cssClasses: cssClassesForControl.square, colors: p.colorNames, size: {width: 20, height: 20}}),
            rect: buildRect.bind({cssClasses: cssClassesForControl.rect}),
            slider: buildSlider.bind({cssClasses: cssClassesForControl.slider}),
        };
        
        var widgetAreaMap = {
            "way-of-getting-color" : function(curr, next){
                return curr + "<div class='" + next + "' title='" 
                    + p.wayOfGettingColor[p.lang][next].name + "' style='display: inline-block; margin-right: 15px; border:" 
                    + border(next === p.startWayName) + "'>"
                    + p.wayOfGettingColor[p.lang][next].name + "</div>";
            },
            "color-formats" : function(curr, next){
                var matchFormat = matchFormatToMethod[next]
                    .filter(function(format){ return format.match})
                    .sort(function(a,b){return a.order-b.order});

                var _display = display(next === p.startWayName);

                var str = curr + "<div class='" + next + "' title='" 
                    + p.wayOfGettingColor[p.lang][next].name + "' style='display:" + _display + "'>";

                matchFormat.forEach(function(format){
                    str += "<div class='" + format.name + "' title='" + colorFormats[p.lang][format.name].name + "' style='border:" 
                    + border(_display === "block" && format.name === p.startColorFormat) 
                    + "; display: inline-block; margin-right: 15px;'>"
                    + colorFormats[p.lang][format.name].name + "</div>";
                });

                return str + "</div>";
            },
            "content-of-way" : function(curr, next){
                return curr + "<div class='" + next + "' style='display:" + display(next === p.startWayName) + "'>" + contentMap[next]() + "</div>";
            }
        };

        waysOfGettingColorKeys.sort(function(a,b){
            return p.wayOfGettingColor[p.lang][a].order - p.wayOfGettingColor[p.lang][b].order
        });

        cssClassesForControl.area.forEach(function(cssClass){
            
            this.innerHTML += "<div class='" + cssClass + "' style='margin-top: 20px;'>" +
                
                waysOfGettingColorKeys.reduce(widgetAreaMap[cssClass], "")
                
                + "</div>";

        }, innerHTML);

        div.innerHTML = innerHTML.innerHTML;

        return div;
    }

    function buildSquare(){
        var innerHTML = "";

        this.colors.forEach(function(colorGroup){
            //innerHTML += "<div>" + colorGroup.groupName + "</div>";
            //При необходимости можно выводить имена групп цветов - тогда нужно расскомментировать предыдущую строку
            colorGroup.colors.forEach(function(color){
                innerHTML += "<div style='width:" + this.size.width + "px; height:" 
                    + this.size.height + "px; background:" 
                    + color.name + "; display: inline-block;' data-value='" + color.name 
                    + "' title='" + color.name + " rgb(" + color.dec.r + ", " + color.dec.g + ", " + color.dec.b + ")'"
                    + "' data-r='" + color.dec.r + "' data-g='" + color.dec.g + "' data-b='" + color.dec.b + "'>"
                    + "</div>";
            }, this);
        }, this);

        return innerHTML;
    }

    function buildRect(){
        var innerHTML = "",
            gradientColors = "#ff0000, #ff00ff, #0000ff, #00ffff, #00ff00, #ffff00, #ff0000";

            //Меняться будет цвет только у верхнего div
            innerHTML +=
                "<div class='" + this.cssClasses[0] + "'>"
                    + "<div class='" + this.cssClasses[1] + "' style='position: relative; background: #ff0000; width: 100%; height: 110px; margin-bottom: 15px;'>"
                        + "<div class='" + this.cssClasses[2] + "' style='position: absolute; z-index: 4; top: 0; left: 0; \
                        border-radius:100%; width: 6px; height: 6px; border: 4px solid white;'></div>"
                        + "<div style='position: absolute; width: 100%; height: 100%; \
                        background: linear-gradient(to right, #fff 0%, rgba(255,255,255,0) 100%);'></div>"
                        + "<div style='position: absolute; width: 100%; height: 100%; \
                        background: linear-gradient(to bottom, transparent 0%, #000 100%);'></div>"
                    + "</div>"
                    + "<div class='" + this.cssClasses[3] + "' style='position: relative; width: 100%; height: 30px; border-top: 1px solid transparent'>"
                        + "<div class='" + this.cssClasses[4] + "' style='position: absolute; width: 7px; height: 28px; border: 1px solid black; left: 0; top: 0'></div>"
                        + "<div style='margin-top:4px; background:linear-gradient(to right," 
                        + gradientColors + "); width: 100%; height: 20px;'></div>"
                    + "</div>"

                    + createResult(this.cssClasses[5], this.cssClasses[6])
                    
                + "</div>";

        return innerHTML;
    }

    function buildSlider(){
        var innerHTML = "";

            innerHTML += "<div style='display: inline-block; width: 80%;'>" 
                + createSlide(this.cssClasses[0], this.cssClasses[1], "#cc7070")
                + createSlide(this.cssClasses[2], this.cssClasses[3], "#7ec77e")
                + createSlide(this.cssClasses[4], this.cssClasses[5], "#5757a5")
                + createSlide() + "</div>";

            innerHTML += "<div style='display: inline-block; width: 18%;'>" + createInput() + createInput() + createInput() + createInput() + "</div>";
            innerHTML += createResult("this.cssClasses[5]", "this.cssClasses[6]");

        return innerHTML;
    }

    function createResult(first, second){
        return "<div style='border-top:1px solid transparent; margin-top: 5px;'>"
                + "<div style='display: inline-block; vertical-align: top; margin: 12px 10px 0 0;'>Результат:</div>"
                + "<div class='" + first + "' style='display:inline-block; width: 40px; \
                height: 40px; border-radius: 100%; border: 1px solid black'></div>"
                + "<button class='" + second + "' style='display: inline-block;\
                    vertical-align: top; margin: 4px 0 0 44px; background-color: inherit;\
                    border: 1px solid rgb(170, 171, 170); color: rgb(88, 90, 88); padding: 8px;'>Выбрать этот цвет</button>"
            + "</div>";
    }

    function createSlide(parent, slide, color){
        return "<div class='" + parent + "' style='position: relative; width: 98%; height: 30px; border-top: 1px solid transparent; margin-bottom: 5px;'>"
                + "<div class='" + slide + "' style='position: absolute; width: 7px; height: 28px; border: 1px solid black; left: 0; top: 0'></div>"
                + "<div style='margin-top:4px; width: 100%; height: 20px; box-sizing: border-box; border: 1px solid grey; background-color:" + color + ";'></div>"
            + "</div>"
    }

    function createInput(first, second){
        return "<div class='" + first + "' style='position: relative; width: 100%; height: 30px; border-top: 1px solid transparent; margin-bottom: 5px;'>"
                + "<input class='" + second + "' style='position: absolute; width: 100%; height: 28px; border: 1px solid black; left: 0; top: 0' />"
            + "</div>"
    }

    function bindEventListeners(params){

        var p = params,
            widgetDOM = p.widgetDOM,
            inputStackDOM = p.inputStackDOM,
            getInputSizeAndPosition = p.getInputSizeAndPosition,
            cssClassesForControl = p.cssClassesForControl,
            waysOfGettingColorKeys = p.waysOfGettingColorKeys,
            colorFormatsKeys = p.colorFormatsKeys,
            startWayName = p.startWayName,
            startColorFormat = p.startColorFormat,
            commonColorFormatByDefault = "", //Нужно ли это?
            startValue = "",
            currentInput = undefined;

        var oneWayDifferrentAreas, 
            squareDOMList, 
            rectDOMList,
            sliderDOMList; 

        oneWayDifferrentAreas = [squareDOMList, rectDOMList, sliderDOMList];

        oneWayDifferrentAreas = waysOfGettingColorKeys.map(function(cssClass){
            return [].slice.call(widgetDOM.querySelectorAll("." + cssClass));
        });

        //oneAreaDifferentWays
        //Нет никакого смысла запихивать в массив, так как formats уже является двумерным массивом
        var waysDOM = getNestedElems(cssClassesForControl.area[0]),
            formatsDOM = getDeepNestedElems(cssClassesForControl.area[1]),
            contentDOM = getNestedElems(cssClassesForControl.area[2]);

        var contentAreaEventsHandles = [squareFn, rectFn, sliderFn];

        var stackOfElemsForMousemoveEvent = [
                { 
                    cssClass: cssClassesForControl.rect[2], 
                    y: true 
                },
                { 
                    cssClass: cssClassesForControl.rect[4], 
                    y: false 
                },
                { 
                    cssClass: cssClassesForControl.slider[1], 
                    y: false 
                },
                { 
                    cssClass: cssClassesForControl.slider[3], 
                    y: false 
                },
                { 
                    cssClass: cssClassesForControl.slider[5], 
                    y: false 
                }
            ].map(function(obj){
                return { DOM: widgetDOM.querySelector("." + obj.cssClass), y: obj.y };
            });

        
        var currentMousemoveElem,
            y = false;

        inputStackDOM.forEach(function(input){
            input.addEventListener("click", clickInput, false); 
        });

        var close = widgetDOM.querySelector(".close");
        close.addEventListener("click", clickClose, false);

        ["click", "mousedown", "mouseup"].forEach(function(eventType){
            widgetDOM.addEventListener(eventType, widgetEventsHandler, false);
        });

        function getNestedElems(cssClass){
            var _widgetDOM = widgetDOM.querySelector("." + cssClass);
            return [].concat.apply([], waysOfGettingColorKeys.map(function(key){
                return [].slice.call(_widgetDOM.querySelectorAll("." + key));
            }));
        }

        function getDeepNestedElems(cssClass){
            
            var nestedElems = getNestedElems(cssClass);

            return nestedElems.map(function(parentNode){
                var elementsByFormat = colorFormatsKeys
                    .map(function(key){return parentNode.querySelector("." + key)})
                    .filter(function(node){return !!node});
                
                return elementsByFormat;
            });
        }

        function matchingElements(arr1, arr2, callback){
            arr1.forEach(function(arr1DOMElem, ndx){
                arr2.forEach(function(arr2DOMElem, idx){
                    if(arr1DOMElem === arr2DOMElem){
                        callback({ match: arr1DOMElem, arrs: [{arr: arr1, idx: ndx}, {arr: arr2, idx: idx}] });
                    }
                });
            });
        }

        //Клик на input type=text
        function clickInput(e){
            var t = currentInput = e.target;
            
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
        //События на colorpicker
        function widgetEventsHandler(e){
            var 
                type = e.type,
                stack = traversalDOMUp(e.target, widgetDOM, []),
                fns = {
                    0 : switchWay,
                    1 : chooseFormat,
                    2 : getValue
                };

            stack.forEach(function(elem){
                cssClassesForControl.area.forEach(function(cssClass){
                    if(elem.getAttribute("class") === cssClass){
                        stack.pop();
                        fns[cssClassesForControl.area.indexOf(cssClass)](stack, type);
                    }
                });
            });
        }

        function switchWay(stack){
                
            var index = -1; 
            
            stack.forEach(function(DOMElem){
                waysOfGettingColorKeys.forEach(function(cssClass, idx){
                    
                    var cssClassOfElement = DOMElem.getAttribute("class");
                    
                    if(cssClassOfElement && cssClassOfElement.indexOf(cssClass) !== -1){
                        index = idx;
                        startWayName = cssClass;
                    }
                });
            })
          
            oneWayDifferrentAreas.forEach(function(elemsGroup, idx){
                elemsGroup.forEach(function(elem, ndx){
                    if(ndx !== 0)
                        elem.style.display = display(idx === index);
                    else
                        elem.style.border = border(idx === index);
                });
            });

            chooseFormat(stack);
        }

        function chooseFormat(stack){
            
            var index = waysOfGettingColorKeys.indexOf(startWayName);
            
            var isAnyFormatDOMElemInStack = false,
                isAnyFormatDOMElemEqualToStartColor = false;
            
            formatsDOM[index].forEach(function(formatDOMElem){
               
                formatDOMElem.style.border = border(false);
                
                stack.forEach(function(stackDOMElem){
                    
                    if(formatDOMElem === stackDOMElem){
                        formatDOMElem.style.border = border(true);
                        isAnyFormatDOMElemInStack = true;
                        startColorFormat = formatDOMElem.getAttribute("class");
                    }
                });
            });

            if(!isAnyFormatDOMElemInStack){
                
                isAnyFormatDOMElemEqualToStartColor = formatsDOM[index].some(function(formatDOMElem){
                    
                    var cssClass = formatDOMElem.getAttribute("class"),
                        isEqual = cssClass.indexOf(startColorFormat) !== -1;

                    if(isEqual){
                        startColorFormat = cssClass;
                        formatDOMElem.style.border = border(true);
                    }

                    return isEqual;
                });
                
                if(!isAnyFormatDOMElemEqualToStartColor){
                    
                    colorFormatsKeys.forEach(function(colorFormat){
                        formatsDOM[index].forEach(function(DOMElem){
                            if(DOMElem.getAttribute("class").indexOf(colorFormat) !== -1){
                                if(!isAnyFormatDOMElemEqualToStartColor){
                                    //Эта проверка может показаться излишней, но в массиве colorFormatsKeys
                                    //совпадения со значениями атрибута class в DOM-элементах может быть более одного
                                    
                                    //Также, для большего контроля можно использовать переменную со значением
                                    //того формат, который назначается по умолчанию в случае отсутствия у способа
                                    DOMElem.style.border = border(true);
                                    startColorFormat = colorFormat;
                                    isAnyFormatDOMElemEqualToStartColor = true;
                                }
                            }
                        });
                    });
                }
            } 
        }

        function getValue(stack, eventType){
            
        console.log("stackOfElemsForMousemoveEvent", stackOfElemsForMousemoveEvent);

            //currentInput.value = startValue;
            
            switch(eventType){
                case "mousedown": mousedown(stack); break;
                case "mouseup"  : mouseup(stack); break;
                default: click(stack);
            }
        }

        function mousedown(stack){

            // matchingElements(stack, stackOfElemsForMousemoveEvent, function(){
            //     var arg = [].slice.call(arguments)[0];
            //     currentMousemoveElem = arg.match;
            // });

            stack.forEach(function(arr1DOMElem){
                stackOfElemsForMousemoveEvent.forEach(function(arr2DOMElem){
                    if(arr1DOMElem === arr2DOMElem.DOM){
                        currentMousemoveElem = arr2DOMElem.DOM;
                        y = arr2DOMElem.y;
                    }
                });
            });

            if(currentMousemoveElem){
                stack[stack.length - 2].onmousemove = mousemove;
                stack[stack.length - 2].ondragstart = function(){return false;}
            }
        }

        function mouseup(stack){
            
            if(currentMousemoveElem){ 
                stack[stack.length - 2].onmousemove = undefined;
                stack[stack.length - 2].ondragstart = undefined;
                currentMousemoveElem = undefined;
                y = false;
            }
        }

        function mousemove(e){
           
            var t = currentMousemoveElem,
                parent = t.parentNode,
                geometryParent = parent.getBoundingClientRect(),
                geometryTarget = t.getBoundingClientRect();

            var deltaX = e.pageX - (pageXOffset + geometryParent.left);
            
            var deltaY = e.pageY - (pageYOffset + geometryParent.top);

            //console.log("e.pageY", e.pageY, "geometryParent.top", geometryParent.top, "parent.clientHeight", parent.clientHeight, "pageYOffset", pageYOffset);
            //console.log("e.pageX", e.pageX, "geometryParent.left", geometryParent.left, "parent.clientWidth", parent.clientWidth, "pageXOffset", pageXOffset);
            
            if(y){
                t.style.top = ((deltaY >= geometryParent.height - geometryTarget.height) ?
                    geometryParent.height - geometryTarget.height : deltaY) + "px";
            }
            
            t.style.left = ((deltaX >= geometryParent.width - geometryTarget.width) ? 
                    geometryParent.width - geometryTarget.width : deltaX) + "px";
        }

        function click(stack){
            
            matchingElements(stack, contentDOM, function(){
                var arg = [].slice.call(arguments)[0];
                contentAreaEventsHandles[arg.arrs[1].idx](stack);
            });
        }

        
        //Функции вызываемые на событие клик в области content
        function squareFn(stack){
            console.log(this, stack);
                          
            //waysOfGettingColorKeys = p.waysOfGettingColorKeys,
            //colorFormatsKeys = p.colorFormatsKeys,
            //startWayName = p.startWayName,
            //startColorFormat = p.startColorFormat,
            //startValue = "",
            //currentInput 

            //hideWidget();
        }

        function rectFn(e){
            console.log(this, e);
        }

        function sliderFn(e){
            console.log(this, e);
        }
        //Клик на элементе close
        function clickClose(){
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

                var stack = traversalDOMUp(t, widgetDOM, []);

                var filteredStack = stack.filter(function(DOMElement){ return DOMElement === widgetDOM});

                if(!filteredStack.length)
                    hideWidget();
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

        function traversalDOMUp(DOMElement, targetElement, stack){
            
            stack.push(DOMElement);

            if(DOMElement === targetElement){
                return stack;
            }
           
            DOMElement = DOMElement.parentNode;

            if(!DOMElement)
                return stack;

            return traversalDOMUp(DOMElement, targetElement, stack);
        }

        return {inputStackDOM: inputStackDOM, widgetDOM: widgetDOM};
    }

    return colorPicker;
})();