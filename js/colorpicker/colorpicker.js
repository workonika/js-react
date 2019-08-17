var colorPicker = (function(){
    //Способы получения цвета
    var wayOfGettingColorMap = {
        ru: {
            square: {
                name: "Заготовленные цвета",
                order: 0
            },
            slider: {
                name: "Слайдер",
                order: 2
            },
        }
    };
    //Форматы цветов
    var colorFormatsMap = {
        ru: {
            rgb: {
                name: "rgb",
                order: 0
            }, 
            hex: {
                name: "hex",
                order: 1
            }, 
            webnames: {
                name: "html названия цветов",
                order: 3
            }
        }
    };
    //Соответствие доступных форматов цветов способу получения цвета
    //Имена свойств в структуре matchFormatToMethodMap должны полностью совпадать 
    //с именами в структуре wayOfGettingColorMap
    var matchFormatToMethodMap = {
        //Сначала с меньшим индексом
        square: [ 
            {
                name: "rgb", match: true, order: 2
            }, 
            {
                name: "hex", match: true, order: 1
            }, 
            {
                name: "webnames", match: true, order: 0
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
                name: "webnames", match: false, order: 0
            }
        ],
    };

    /**В этой структуре значениями свойств (речь о примитивах) являются имена классов в css-файле*/
    var cssClassesMap = {
        struct: {
            widget: { colorpicker: "__colorpicker__", },
            zones: { way: "__way-of-getting-color__", format: "__color-formats__", 
                content: "__content-of-way__" },
            
            ways: { square: "__square__", slider: "__slider__" },
            /**Имена свойств способов получения цвета соответствуют именам свойств в структуре wayOfGettingColor */
            
            formats: { rgb: "__rgb__", hex: "__hex__", webnames: "__webnames__" },
            /**Имена свойств форматов соответствуют именам свойств в структуре colorFormats */
        },
        content: {
            widget: {
                close: "__close__"
            },
            square: {
                webnames: "__webnames__", rgb: "__rgb__", value: "__webname-value__" 
            },
            slider: {
                r: "__r__", g: "__g__", b: "__b__",
                parentR: "__parent-r__", parentG: "__parent-g__", parentB: "__parent-b__",
                pathR: "__path-r__", pathG: "__path-g__", pathB: "__path-b__",
                inputs: "__inputs__", slideInput: "__slide-input__", slide: "__slide__", 
            },
            result: {
                result: "__result__", resultText: "__result-text__", 
                choosed: "__slider-result__", confirm: "__confirm-button__", 
            }
        },
        look: {
            square: {
                borderFocus: "__border-focus__"
            }
        },
        control: {
            hide: "__hide__", border: "__border__", displayBlock: "__display-block__", 
            displayInlineBlock: "__display-inline-block__"
        },
    };

    var colorNamesMap = JSON.parse('{"stack":[{"groupName":"Красные","colors":[{"name":"indianred","dec":{"r":205,"g":92,"b":92}},{"name":"lightcoral","dec":{"r":240,"g":128,"b":128}},{"name":"salmon","dec":{"r":250,"g":128,"b":114}},{"name":"darksalmon","dec":{"r":233,"g":150,"b":122}},{"name":"lightsalmon","dec":{"r":255,"g":160,"b":122}},{"name":"crimson","dec":{"r":220,"g":20,"b":60}},{"name":"red","dec":{"r":255,"g":0,"b":0}},{"name":"firebrick","dec":{"r":178,"g":34,"b":34}},{"name":"darkred","dec":{"r":139,"g":0,"b":0}}]},{"groupName":"Розовые","colors":[{"name":"pink","dec":{"r":255,"g":192,"b":203}},{"name":"lightpink","dec":{"r":255,"g":182,"b":193}},{"name":"hotpink","dec":{"r":255,"g":105,"b":180}},{"name":"deeppink","dec":{"r":255,"g":20,"b":147}},{"name":"mediumvioletred","dec":{"r":199,"g":21,"b":133}},{"name":"palevioletred","dec":{"r":219,"g":112,"b":147}}]},{"groupName":"Оранжевые","colors":[{"name":"coral","dec":{"r":255,"g":127,"b":80}},{"name":"tomato","dec":{"r":255,"g":99,"b":71}},{"name":"orangered","dec":{"r":255,"g":69,"b":0}},{"name":"darkorange","dec":{"r":255,"g":140,"b":0}},{"name":"orange","dec":{"r":255,"g":165,"b":0}}]},{"groupName":"Жёлтые","colors":[{"name":"gold","dec":{"r":255,"g":215,"b":0}},{"name":"yellow","dec":{"r":255,"g":255,"b":0}},{"name":"lightyellow","dec":{"r":255,"g":255,"b":224}},{"name":"lemonchiffon","dec":{"r":255,"g":250,"b":205}},{"name":"lightgoldenrodyellow","dec":{"r":250,"g":250,"b":210}},{"name":"papayawhip","dec":{"r":255,"g":239,"b":213}},{"name":"moccasin","dec":{"r":255,"g":228,"b":181}},{"name":"peachpuff","dec":{"r":255,"g":218,"b":185}},{"name":"palegoldenrod","dec":{"r":238,"g":232,"b":170}},{"name":"khaki","dec":{"r":240,"g":230,"b":140}},{"name":"darkkhaki","dec":{"r":189,"g":183,"b":107}}]},{"groupName":"Фиолетовые","colors":[{"name":"lavender","dec":{"r":230,"g":230,"b":250}},{"name":"thistle","dec":{"r":216,"g":191,"b":216}},{"name":"plum","dec":{"r":221,"g":160,"b":221}},{"name":"violet","dec":{"r":238,"g":130,"b":238}},{"name":"orchid","dec":{"r":218,"g":112,"b":214}},{"name":"fuchsia","dec":{"r":255,"g":0,"b":255}},{"name":"mediumorchid","dec":{"r":186,"g":85,"b":211}},{"name":"mediumpurple","dec":{"r":147,"g":112,"b":219}},{"name":"blueviolet","dec":{"r":138,"g":43,"b":226}},{"name":"darkviolet","dec":{"r":148,"g":0,"b":211}},{"name":"darkorchid","dec":{"r":153,"g":50,"b":204}},{"name":"darkmagenta","dec":{"r":139,"g":0,"b":139}},{"name":"purple","dec":{"r":128,"g":0,"b":128}},{"name":"indigo","dec":{"r":75,"g":0,"b":130}},{"name":"slateblue","dec":{"r":106,"g":90,"b":205}},{"name":"darkslateblue","dec":{"r":72,"g":61,"b":139}}]},{"groupName":"Зелёные","colors":[{"name":"greenyellow","dec":{"r":173,"g":255,"b":47}},{"name":"chartreuse","dec":{"r":127,"g":255,"b":0}},{"name":"lawngreen","dec":{"r":124,"g":252,"b":0}},{"name":"lime","dec":{"r":0,"g":255,"b":0}},{"name":"limegreen","dec":{"r":50,"g":205,"b":50}},{"name":"palegreen","dec":{"r":152,"g":251,"b":152}},{"name":"lightgreen","dec":{"r":144,"g":238,"b":144}},{"name":"mediumspringgreen","dec":{"r":0,"g":250,"b":154}},{"name":"springgreen","dec":{"r":0,"g":255,"b":127}},{"name":"mediumseagreen","dec":{"r":60,"g":179,"b":113}},{"name":"seagreen","dec":{"r":46,"g":139,"b":87}},{"name":"forestgreen","dec":{"r":34,"g":139,"b":34}},{"name":"green","dec":{"r":0,"g":128,"b":0}},{"name":"darkgreen","dec":{"r":0,"g":100,"b":0}},{"name":"yellowgreen","dec":{"r":154,"g":205,"b":50}},{"name":"olivedrab","dec":{"r":107,"g":142,"b":35}},{"name":"olive","dec":{"r":128,"g":128,"b":0}},{"name":"darkolivegreen","dec":{"r":85,"g":107,"b":47}},{"name":"mediumaquamarine","dec":{"r":102,"g":205,"b":170}},{"name":"darkseagreen","dec":{"r":143,"g":188,"b":143}},{"name":"lightseagreen","dec":{"r":32,"g":178,"b":170}},{"name":"darkcyan","dec":{"r":0,"g":139,"b":139}},{"name":"teal","dec":{"r":0,"g":128,"b":128}}]},{"groupName":"Синие","colors":[{"name":"aqua","dec":{"r":0,"g":255,"b":255}},{"name":"lightcyan","dec":{"r":224,"g":255,"b":255}},{"name":"paleturquoise","dec":{"r":175,"g":238,"b":238}},{"name":"aquamarine","dec":{"r":127,"g":255,"b":212}},{"name":"turquoise","dec":{"r":64,"g":224,"b":208}},{"name":"mediumturquoise","dec":{"r":72,"g":209,"b":204}},{"name":"darkturquoise","dec":{"r":0,"g":206,"b":209}},{"name":"cadetblue","dec":{"r":95,"g":158,"b":160}},{"name":"steelblue","dec":{"r":70,"g":130,"b":180}},{"name":"lightsteelblue","dec":{"r":176,"g":196,"b":222}},{"name":"powderblue","dec":{"r":176,"g":224,"b":230}},{"name":"lightblue","dec":{"r":173,"g":216,"b":230}},{"name":"skyblue","dec":{"r":135,"g":206,"b":235}},{"name":"lightskyblue","dec":{"r":135,"g":206,"b":250}},{"name":"deepskyblue","dec":{"r":0,"g":191,"b":255}},{"name":"dodgerblue","dec":{"r":30,"g":144,"b":255}},{"name":"cornflowerblue","dec":{"r":100,"g":149,"b":237}},{"name":"mediumslateblue","dec":{"r":123,"g":104,"b":238}},{"name":"royalblue","dec":{"r":65,"g":105,"b":225}},{"name":"blue","dec":{"r":0,"g":0,"b":255}},{"name":"mediumblue","dec":{"r":0,"g":0,"b":205}},{"name":"darkblue","dec":{"r":0,"g":0,"b":139}},{"name":"navy","dec":{"r":0,"g":0,"b":128}},{"name":"midnightblue","dec":{"r":25,"g":25,"b":112}}]},{"groupName":"Коричневые","colors":[{"name":"cornsilk","dec":{"r":255,"g":248,"b":220}},{"name":"blanchedalmond","dec":{"r":255,"g":235,"b":205}},{"name":"bisque","dec":{"r":255,"g":228,"b":196}},{"name":"navajowhite","dec":{"r":255,"g":222,"b":173}},{"name":"wheat","dec":{"r":245,"g":222,"b":179}},{"name":"burlywood","dec":{"r":222,"g":184,"b":135}},{"name":"tan","dec":{"r":210,"g":180,"b":140}},{"name":"rosybrown","dec":{"r":188,"g":143,"b":143}},{"name":"sandybrown","dec":{"r":244,"g":164,"b":96}},{"name":"goldenrod","dec":{"r":218,"g":165,"b":32}},{"name":"darkgoldenrod","dec":{"r":184,"g":134,"b":11}},{"name":"peru","dec":{"r":205,"g":133,"b":63}},{"name":"chocolate","dec":{"r":210,"g":105,"b":30}},{"name":"saddlebrown","dec":{"r":139,"g":69,"b":19}},{"name":"sienna","dec":{"r":160,"g":82,"b":45}},{"name":"brown","dec":{"r":165,"g":42,"b":42}},{"name":"maroon","dec":{"r":128,"g":0,"b":0}}]},{"groupName":"Белые","colors":[{"name":"white","dec":{"r":255,"g":255,"b":255}},{"name":"snow","dec":{"r":255,"g":250,"b":250}},{"name":"honeydew","dec":{"r":240,"g":255,"b":240}},{"name":"mintcream","dec":{"r":245,"g":255,"b":250}},{"name":"azure","dec":{"r":240,"g":255,"b":255}},{"name":"aliceblue","dec":{"r":240,"g":248,"b":255}},{"name":"ghostwhite","dec":{"r":248,"g":248,"b":255}},{"name":"whitesmoke","dec":{"r":245,"g":245,"b":245}},{"name":"seashell","dec":{"r":255,"g":245,"b":238}},{"name":"beige","dec":{"r":245,"g":245,"b":220}},{"name":"oldlace","dec":{"r":253,"g":245,"b":230}},{"name":"floralwhite","dec":{"r":255,"g":250,"b":240}},{"name":"ivory","dec":{"r":255,"g":255,"b":240}},{"name":"antiquewhite","dec":{"r":250,"g":235,"b":215}},{"name":"linen","dec":{"r":250,"g":240,"b":230}},{"name":"lavenderblush","dec":{"r":255,"g":240,"b":245}},{"name":"mistyrose","dec":{"r":255,"g":228,"b":225}}]}]}');
    colorNamesMap = colorNamesMap.stack;

    function colorPicker(params){
        if(typeof params === undefined || typeof params !== "string" && typeof params !== "object"){
            throw new Error("Параметр должен быть или объектом или строкой и не должен быть null");
        }

        //Язык интерфейса
        var lang = params.lang || "ru";

        //Получаем стэк полей input к которым прикрепляется виджет
        var inputStackDOMList = [].slice.call(document.querySelectorAll(typeof params === "string" ? params : params.selector));
        if(!inputStackDOMList.length){
            var input = document.querySelectorAll("input");
            if(input.length){
                console.warn("Вы передали некорректный селектор!\nВиджет colorpicker не прикреплён ни к одному из DOM-элементов input\n\
                в текущем документе присутствуют следующие элементы input");
                console.group("Элементы input");
                [].slice.call(input).forEach(function(el){console.log(el)});
                console.groupEnd();
            } else {
                console.warn("В текущем документе нет ни одного элемента input!!!\nПоэтому виджет colorpicker не к чему прикрепить");
            }

            return undefined;
        }

        if(params.custom){
            cssClassesMap.custom = params.custom;
        }

        inputStackDOMList.forEach(function(input){

            var position = getComputedStyle(input).getPropertyValue("position");

            if(position === "static"){
                input.style.position = "relative";
            }
        });

        var commonParamsMap = {
            lang: lang,
            startWayName: params.startWayName || "square",
            startColorFormat: params.startColorFormat || "hex"
        };

        var paramsOfcreateWidgetDOMElement = {
            widgetSize: { width: params.width || 350, height: params.height || 300 },
        };

        var widgetDOM = createWidgetDOMElement( copyObject(commonParamsMap, paramsOfcreateWidgetDOMElement) );
        document.body.appendChild(widgetDOM);

        var paramsOfBindEventListeners = {
            widgetDOM: widgetDOM,
            inputStackDOMList: inputStackDOMList,
        };

        bindEventListeners( copyObject(commonParamsMap, paramsOfBindEventListeners) );

    //конец функции colorPicker
    }

    function copyObject(from, to){
        var keys = Object.keys(from);
        
        keys.forEach(function(key){
            to[key] = from[key];
        });
        
        return to;
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
            css = cssClassesMap,
            cssWays = css.struct.ways,
            cssFormats = css.struct.formats;

            div.classList.add(css.struct.widget.colorpicker);

        var innerHTML = { innerHTML: "<div class=" + css.content.widget.close + ">&times;</div>", },
            waysOfGettingColorKeys = Object.keys(wayOfGettingColorMap[p.lang]);

        var contentMapFn = {
            square: buildSquare.bind({css: css, colors: colorNamesMap, }),
            slider: buildSlider.bind({css: css}),
        };
        
        var widgetAreaMap = {};

        widgetAreaMap[css.struct.zones.way] = function(curr, next){
                return curr + "<div class='" + cssWays[next] + "' title='" 
                    + wayOfGettingColorMap[p.lang][next].name + "'>"
                    + wayOfGettingColorMap[p.lang][next].name + "</div>";
            };
        
        widgetAreaMap[css.struct.zones.format] = function(curr, next){
                var matchFormat = matchFormatToMethodMap[next]
                    .filter(function(format){ return format.match})
                    .sort(function(a,b){return a.order-b.order});

                var str = curr + "<div class='" + cssWays[next] + "' title='" 
                    + wayOfGettingColorMap[p.lang][next].name + "'>";

                matchFormat.forEach(function(format){
                    str += "<div class='" + cssFormats[format.name] + "' title='" 
                    + colorFormatsMap[p.lang][format.name].name + "'>"
                    + colorFormatsMap[p.lang][format.name].name + "</div>";
                });

                return str + "</div>";
            };
        
        widgetAreaMap[css.struct.zones.content] =  function(curr, next){
                return curr + "<div class='" + cssWays[next] + "'>" + contentMapFn[next]() + "</div>";
            };
        
        waysOfGettingColorKeys.sort(function(a,b){
            return wayOfGettingColorMap[p.lang][a].order - wayOfGettingColorMap[p.lang][b].order
        });

        Object.keys(css.struct.zones).forEach(function(zone){
            
            var cssClass = css.struct.zones[zone];

            this.innerHTML += "<div class='" + cssClass + "'>" +
                
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
                innerHTML += "<div class='" + this.css.content.square.value + "' style='background:" + color.name 
                    + "' data-colorname='" + color.name 
                    + "' title='" + color.name + " rgb(" + color.dec.r + ", " + color.dec.g + ", " + color.dec.b + ")'"
                    + " data-r='" + color.dec.r + "' data-g='" + color.dec.g + "' data-b='" + color.dec.b + "'>"
                    + "</div>";
            }, this);
        }, this);

        return innerHTML;
    }

    function buildSlider(){
        var innerHTML = "",
            css = this.css.content.slider;


            innerHTML += "<div class='" + css.slide + "'>"
                + createSlide(css.parentR, css.r, css.pathR)
                + createSlide(css.parentG, css.g, css.pathG)
                + createSlide(css.parentB, css.b, css.pathB) + "</div>";

            innerHTML += "<div class='" + css.inputs + "'>" 
                + createInput(css.slideInput, css.r) 
                + createInput(css.slideInput, css.g) 
                + createInput(css.slideInput, css.b) + "</div>";

            innerHTML += createResult(this.css.content.result.result, this.css.content.result.resultText, 
                this.css.content.result.choosed, this.css.content.result.confirm);

        return innerHTML;
    }

    function createResult(result, result_text, choosed_result, confirm){
        return "<div class='" + result + "'>"
                + "<div class='" + result_text + "'>Результат:</div>"
                + "<div class='" + choosed_result + "'></div>"
                + "<button class='" + confirm + "'>Выбрать этот цвет</button>"
            + "</div>";
    }

    function createSlide(parent, slide, path){
        return "<div class='" + parent + "'>"
                + "<div data-channel='" + slide + "' class='" + slide + "'></div>"
                + "<div class='" + path + "'></div>"
            + "</div>"
    }

    function createInput(container, input){
        return "<div class='" + container + "'>"
                + "<input name='" + input + "' class='" + input + "' />"
            + "</div>"
    }

    function restructurize(structure){
        var returnMap = {};

        structure.forEach(function(group){
            group.colors.forEach(function(color){
                this[color.name] = color.dec;
            }, this);
        }, returnMap);
            
        return returnMap;
    }

    function bindEventListeners(params){
        //Переменные значения которых переданы через параметр
        var p = params,
            widgetDOM = p.widgetDOM,
            inputStackDOMList = p.inputStackDOMList,
            colorFormat = p.startColorFormat,
            lang = p.lang,
            startWayName = p.startWayName;

        var css = cssClassesMap,
            _colorNamesMap = restructurize(colorNamesMap),
            currentInput = undefined,
            waysOfGettingColorKeys = Object.keys(wayOfGettingColorMap[lang]),
            colorFormatsKeysList = Object.keys(colorFormatsMap[lang]),
            colorNamesList = Object.keys(_colorNamesMap);

        var rgbMap = {r: undefined, g: undefined, b: undefined, colorname: undefined};

        var oneWayDifferrentAreasList, 
            squareDOMList,
            sliderDOMList;

        oneWayDifferrentAreasList = [squareDOMList, sliderDOMList];

        oneWayDifferrentAreasList = waysOfGettingColorKeys.map(function(wayName){
            return [].slice.call(widgetDOM.querySelectorAll("." + css.struct.ways[wayName]));
        });

        var wayOfGettingColorDOMList = oneWayDifferrentAreasList.map(function(list){
            return list[0];
        });

        var waysDOMList = getElemsByWay(css.struct.zones.way),
            formatsDOMList = getElemsByColorFormat(css.struct.zones.format),
            formatsDOMByWayList = getElemsByWay(css.struct.zones.format),
            contentsDOMList = getElemsByWay(css.struct.zones.content);
            
        var contentAreaEventsHandlesFnList = [handleClickOnContentSquare, handleClickOnContentSlider];
       
        var currentMousemoveElem;
        
        var rgbInputsList = [css.content.slider.r, css.content.slider.g, css.content.slider.b].map(function(name){
            return widgetDOM.querySelector("[name='" + name + "']");
        });
   
        var slidersList = [
            { slider: css.content.slider.r, parent: css.content.slider.parentR }, 
            { slider: css.content.slider.g, parent: css.content.slider.parentG }, 
            { slider: css.content.slider.b, parent: css.content.slider.parentB },
        ].map(function(obj){
            slider =  widgetDOM.querySelector("[data-channel='" + obj.slider + "']"),
            parent = getDOM(obj.parent);

            return { slider: slider, parent: parent };
        });

        var sliderResultDOM = getDOM(css.content.result.choosed);
        
        var confirmButtonsList = [css.content.result.confirm, ].map(function(cssClass){
            return getDOM(cssClass);
        });

        var webnamesDOMList = [].slice.call(widgetDOM.querySelectorAll("." + css.content.square.value));
        
        inputStackDOMList.forEach(function(input){
            input.addEventListener("click", clickInput, false); 
        });
        /**
         * @todo Сделать единообразную обработку события клик -> в handleAllWidgetEvents
         */
        var close = widgetDOM.querySelector("." + css.content.widget.close);
        close.addEventListener("click", clickClose, false);
        
        ["click", "mousedown", "mouseup"].forEach(function(eventType){
            widgetDOM.addEventListener(eventType, handleAllWidgetEvents, false);
        });

        applyDefaultValues();

        function getDOM(cssClass){
            return widgetDOM.querySelector("." + cssClass);
        }

        function getElemsByWay(cssClass){
            var _widgetDOM = widgetDOM.querySelector("." + cssClass);
            return [].concat.apply([], waysOfGettingColorKeys.map(function(way){
                return [].slice.call(_widgetDOM.querySelectorAll("." + css.struct.ways[way]));
            }));
        }

        function getElemsByColorFormat(cssClass){
            
            var nestedElems = getElemsByWay(cssClass);

            return nestedElems.map(function(parentNode){
                var elementsByFormat = colorFormatsKeysList
                    .map(function(format){return parentNode.querySelector("." + css.struct.formats[format])})
                    .filter(function(node){return !!node});
                
                return elementsByFormat;
            });
        }

        function matchElements(arr1, arr2, callback){
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

            inputStackDOMList.forEach(function(input){
                input.removeAttribute("data-is-colorpicker-opened");
            });

            t.setAttribute("data-is-colorpicker-opened", true);

            widgetDOM.style.top = inputSizeAndPosition.top + inputSizeAndPosition.height + mu;
            widgetDOM.style.left = inputSizeAndPosition.left + mu;
            
            initRGB();
            setWebnameFocus();
            displayWidget();
            setValueSliderInput();
            setSlidersPosition();
        }
        //События на colorpicker
        /**
         * Обрабатываются события всех типов. Но не очевидно, какие события допущены к обработке тем или иным 
         * разделом. @todo Поставить 
         * @param {Event} e 
         */
        function handleAllWidgetEvents(e){
            var 
                type = e.type,
                stack = goThroughDOMNodesUp(e.target, widgetDOM, []),
                fns = {};

                fns[css.struct.zones.way] = switchWay;
                fns[css.struct.zones.format] = chooseFormat;
                fns[css.struct.zones.content] = getValue;

            stack.forEach(function(elem){
                Object.keys(css.struct.zones).forEach(function(zone){
                    
                    var cssClass = css.struct.zones[zone];

                    if(elem.getAttribute("class") === cssClass){
                        stack.pop();
                        fns[cssClass](stack, type);
                    }
                });
            });
        }

        function switchWay(stack){
                
            var index = -1,
                currentCssClass,
                matchDOM;
            
            stack.forEach(function(DOMElem){
                waysOfGettingColorKeys.forEach(function(key, idx){

                    var cssClass = css.struct.ways[key];
                    
                    var cssClassOfElement = DOMElem.getAttribute("class");
                    
                    if(cssClassOfElement && cssClassOfElement.indexOf(cssClass) !== -1){
                        currentCssClass = cssClass;
                        index = idx;
                        startWayName = key;
                    }
                });
            })

            matchElements(stack, wayOfGettingColorDOMList, function(param){
                matchDOM = param.match;
            });

            if(!matchDOM){
                return false;
            }

            oneWayDifferrentAreasList.forEach(function(elemsGroup, idx){
                elemsGroup.forEach(function(elem, ndx){
                    if(ndx === 0)
                        elem.classList[ elem.classList.contains(currentCssClass) ? "add" : "remove" ](css.control.border);
                    else
                        elem.classList[ elem.classList.contains(currentCssClass) ? "remove" : "add" ](css.control.hide);
                });
            });

            chooseFormat(stack);
            setSliderResultValue();
            setSlidersPosition();
        }

        function chooseFormat(stack){
            
            var index = waysOfGettingColorKeys.indexOf(startWayName);
            
            var isAnyFormatDOMElemInStack = false,
                isAnyFormatDOMElemEqualToStartColor = false;
            
            formatsDOMList[index].forEach(function(formatDOMElem){
               
                formatDOMElem.classList.remove(css.control.border);
                
                stack.forEach(function(stackDOMElem){
                    
                    if(formatDOMElem === stackDOMElem){
                        formatDOMElem.classList.add(css.control.border);
                        isAnyFormatDOMElemInStack = true;
                        colorFormat = getColorFormatKeyByCssClass(formatDOMElem);
                    }
                });
            });

            if(!isAnyFormatDOMElemInStack){
                
                isAnyFormatDOMElemEqualToStartColor = formatsDOMList[index].some(function(formatDOMElem){
                    
                    var colorFormatChoosen = getColorFormatKeyByCssClass(formatDOMElem),
                        isEqual = colorFormat === colorFormatChoosen;

                    if(isEqual){
                        colorFormat = colorFormatChoosen;
                        formatDOMElem.classList.add(css.control.border);
                    }

                    return isEqual;
                });
                
                if(!isAnyFormatDOMElemEqualToStartColor){
                    
                    colorFormatsKeysList.forEach(function(colorKey){
                        formatsDOMList[index].forEach(function(DOMElem){
                            if(colorKey === getColorFormatKeyByCssClass(DOMElem)){

                                if(!isAnyFormatDOMElemEqualToStartColor){
                                    //Эта проверка может показаться излишней, но в массиве colorFormatsKeysList
                                    //совпадения со значениями атрибута class в DOM-элементах может быть более одного
                                    
                                    //Также, для большего контроля можно использовать переменную со значением
                                    //того формат, который назначается по умолчанию в случае отсутствия у способа
                                    DOMElem.classList.add(css.control.border);
                                    colorFormat = colorKey;
                                    isAnyFormatDOMElemEqualToStartColor = true;
                                }
                            }
                        });
                    });
                }
            }
        }

        function getColorFormatKeyByCssClass(elem){
            
            var list = [].slice.call(elem.classList),
                key;
            
            list.forEach(function(cssClass){
                var obj = css.struct.formats;
                for(var prop in obj){
                    if(obj.hasOwnProperty(prop)){
                        if(obj[prop] === cssClass)
                            key = prop;
                    }
                }
            });

            return key;
        }

        function getValue(stack, eventType){
                        
            switch(eventType){
                case "mousedown": mousedown(stack); break;
                case "mouseup"  : mouseup(stack); break;
                default: click(stack);
            }
        }

        function mousedown(stack){

            stack.forEach(function(arr1DOMElem){
                slidersList.forEach(function(arr2DOMElem){
                    if(arr1DOMElem === arr2DOMElem.slider){
                        currentMousemoveElem = arr2DOMElem.slider;
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
            }
        }

        function mousemove(e){
           
            var t = currentMousemoveElem,
                parent = t.parentNode,
                geometryParent = parent.getBoundingClientRect(),
                geometryTarget = t.getBoundingClientRect();

            var deltaX = e.pageX - (pageXOffset + geometryParent.left);

            t.style.left = ((deltaX >= geometryParent.width - geometryTarget.width) ? 
                    geometryParent.width - geometryTarget.width : deltaX) + "px";

            setRGBThroughSlidersPosition();
            setSliderResultValue();
        }

        function click(stack){
            
            matchElements(stack, contentsDOMList, function(){
                var arg = [].slice.call(arguments)[0];
                contentAreaEventsHandlesFnList[arg.arrs[1].idx](stack);
            });
        }

        //Функции вызываемые на событие клик в области content
        //Эти функции ответственны за корректную передачу данных в savergb
        function handleClickOnContentSquare(stack){
                        
            var rgbMap = {};

            stack.forEach(function(item){
                var isContainColornameData = item.hasAttribute("data-colorname");
                if(isContainColornameData){
                    this.r = item.getAttribute("data-r");
                    this.g = item.getAttribute("data-g");
                    this.b = item.getAttribute("data-b");
                    this.colorname = item.getAttribute("data-colorname");
                }
            }, rgbMap);

            endupChoice(rgbMap);
        }

        function handleClickOnContentSlider(stack){
            
            var rgbMap = {};

            rgbInputsList.forEach(function(channel){
                this[getKeyByName(channel.name)] = channel.value;
            }, rgbMap);

            matchElements(stack, confirmButtonsList, function(){
                endupChoice(rgbMap);
            });
        }
        //Клик на элементе close
        function clickClose(){
            hideWidget();
        }

        function createOutputValueString(){

            var format = colorFormat;
            /**
             * Мне не особо нравится эта идея, но я на ней остановился. 
             * Возможно изначально неправильно продумана архитектура.
             */
            if(format === "webnames")
                return rgbMap.colorname.toLowerCase();
            
            var p = String.prototype; 

            var startOutputStringFrom = {
                hex: "#",
                rgb: "rgb(",
            };

            var endOutputString = {
                hex: "",
                rgb: ")",
            };

            var delimiter = {
                hex: "",
                rgb: ", ",
            }

            var register = {
                hex: p.toUpperCase,
                rgb: p.toLowerCase,
            }

            var useFnToBuildOutput = {
                hex: function(value){ return convertDecToHEX(value); },
                rgb: function(value){ return +value; },
            };

            var start = {
                returnValue: "",
                fns: useFnToBuildOutput,
                startStr: startOutputStringFrom,
                endStr: endOutputString,
                delimiter: delimiter,
            };

            var returnMap = 
                [rgbMap.r, rgbMap.g, rgbMap.b]
                .slice(0, format.length)
                .reduce(function(cur, next, idx, arr){
                    
                    cur.returnValue += (!idx ? cur.startStr[format] : "")
                        + cur.fns[format](next) 
                        + ((idx === arr.length - 1) ? "" : cur.delimiter[format])
                        + ((idx === arr.length - 1) ? cur.endStr[format] : "");

                    return cur;
                }, start);

            return register[format].call(returnMap.returnValue);
        }
        //Проверка, где сделан клик и если вне colorpicker, то закрывается colorpicker
        function clickOutOfWidget(e){
            
            var t = e.target;

            var isClickInInput = inputStackDOMList.some(function(input){
                return input === t;
            });

            var isInputOpen = inputStackDOMList.some(function(input){
                return input.hasAttribute("data-is-colorpicker-opened");
            });

            if(!isClickInInput && isInputOpen){

                var stack = goThroughDOMNodesUp(t, widgetDOM, []);

                var filteredStack = stack.filter(function(DOMElement){ return DOMElement === widgetDOM});

                if(!filteredStack.length)
                    hideWidget();
            }
        }

        function convertDecToHEX(value){
            return (+value < 10) ? "0" +value : (+value).toString(16);
        }

        function convertHexToDEC(value){
            
            value = ("" + value).toUpperCase(); 

            var valueList = typeof value === "string" ? value.split("") : ("" + value).split(""),
                alphabet = {"A": 10, "B": 11, "C": 12, "D": 13, "E": 14, "F": 15,
                    "1": 1, "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9, "0": 0
                },
                pow = function(num, pow){
                    
                    var origin = num; 

                    if(pow === 0)
                        return 1;

                    if(pow === 1)
                        return num;
                   
                    for(var i = 1; i < pow; i++){
                        origin *= num;
                    }
                    return origin;
                };
            
            valueList.reverse(); 

            var returnValue = valueList.reduce(function(cur, next, idx){
                return cur + alphabet[next] * pow(16, idx);
            }, 0);

            return returnValue;
        }

        function initRGB(){

            var value = currentInput.value,
                regexp = /(#|(?:rgb?))((?:[a-fA-F0-9]{3,6})|(?:\s*\((?:(?:\s*\d){1,3}\s*,?\s*){3}(?:\d?\.?\d+\s*)?\)))/;
            
            var result = value.match(regexp);

            if(!result){
                var valueTrimmed = value.trim();

                var isExists = colorNamesList.some(function(colorName){
                    return colorName === valueTrimmed;
                });

                if(isExists){
                    result = [null, "colorname", valueTrimmed];
                }
            }
                
            var componentsOfColor = {
                "#"   : function(value){
                    
                    var rgb = value.split("");

                    if(value.length === 3){
                        return {
                            r: convertHexToDEC(rgb[0]), g: convertHexToDEC(rgb[1]), b: convertHexToDEC(rgb[2])
                        };
                    }

                    else if(value.length === 6){
                        return {
                            r: convertHexToDEC(rgb[0] + rgb[1]),
                            g: convertHexToDEC(rgb[2] + rgb[3]),
                            b: convertHexToDEC(rgb[4] + rgb[5]),
                        }
                    }

                    else {
                        alert("Вы ввели неверное количество символов!");
                    }
                },
                "rgb" : function(value){

                    var rgb = value.match(/\d+/g);

                    return {
                        r: +rgb[0],
                        g: +rgb[1],
                        b: +rgb[2],
                    }
                },
                "colorname": function(value){

                    var valueTrimmed = value.trim();
                    var rgb = _colorNamesMap[valueTrimmed];

                    return {
                        r: rgb.r,
                        g: rgb.g,
                        b: rgb.b,
                        colorname: valueTrimmed
                    }
                }
            };
            
            if(result)
                saveRGB(componentsOfColor[result[1]](result[2]));
        }

        function setWebnameFocus(){

            webnamesDOMList.forEach(function(item){
                
                var isEqual = rgbMap.colorname
                    ? item.getAttribute("data-colorname") === rgbMap.colorname
                    : (+item.getAttribute("data-r") === rgbMap.r
                    && +item.getAttribute("data-g") === rgbMap.g
                    && +item.getAttribute("data-b") === rgbMap.b);

                if(isEqual){
                    item.classList.add(css.look.square.borderFocus);
                } else {
                    item.classList.remove(css.look.square.borderFocus);
                }
            });

            return false;
        }

        function setValueSliderInput(){
            rgbInputsList.forEach(function(item){
                var key = getKeyByName(item.getAttribute("name"));
                var value = rgbMap[key];
                item.value = value !== undefined ? value : "0";
            });
        }

        function setSlidersPosition(){
            slidersList.forEach(function(itemMap){
                var key = getKeyByName(itemMap.slider.getAttribute("data-channel"));
                if(rgbMap[key]){
                    var ratio = itemMap.parent.clientWidth/255;
                    itemMap.slider.style.left = 
                        ratio * rgbMap[key] - itemMap.slider.getBoundingClientRect().width + "px";
                }
            });
        }

        function setRGBThroughSlidersPosition(){
            slidersList.forEach(function(itemMap){
                var key = getKeyByName(itemMap.slider.getAttribute("data-channel"));

                rgbMap[key] = parseFloat(itemMap.slider.style.left || 0)
                    /(itemMap.parent.clientWidth - itemMap.slider.getBoundingClientRect().width) 
                    * 255;
            });

            rgbInputsList.forEach(function(input){
                var key = getKeyByName(input.getAttribute("name"));
                input.value = parseInt(rgbMap[key]);
            });
        }

        function setSliderResultValue(){

            var _rgb = {}, r, g, b;

            _rgb[ r = css.content.slider.r ] = undefined;
            _rgb[ g = css.content.slider.g ] = undefined;
            _rgb[ b = css.content.slider.b ] = undefined;
            
            rgbInputsList.forEach(function(input){
                _rgb[input.name] = rgbMap[getKeyByName(input.name)] || input.value;
            });

            sliderResultDOM.style.backgroundColor = 
                "rgb(" + _rgb[r] + ", " + _rgb[g] + ", "  + _rgb[b] + ")";
        }

        function getKeyByName(name){
            var obj = css.content.slider,
                returnKey;

            for(var key in obj){
                if(obj.hasOwnProperty(key)){
                    if(obj[key] === name){
                        returnKey = key;
                    }
                }
            }

            return returnKey;
        }

        function saveRGB(params){
            if(!params)
                params = {};
                
            rgbMap.r = params.r;
            rgbMap.g = params.g; 
            rgbMap.b = params.b;
            rgbMap.colorname = params.colorname; //undefined, если аргумент не передан при вызове
        }

        function hideWidget(){
            
            document.removeEventListener("click", clickOutOfWidget, false);
            widgetDOM.classList.add(css.control.hide);

            inputStackDOMList.forEach(function(input){
                input.removeAttribute("data-is-colorpicker-opened");
            });
        }

        function endupChoice(rgbMap){

            var hasFullData = {
                "webnames": !!rgbMap.colorname,
                "hex": !!(rgbMap.r && rgbMap.g && rgbMap.b),
                "rgb": !!(rgbMap.r && rgbMap.g && rgbMap.b),
            }[colorFormat];

            if(hasFullData){
                saveRGB(rgbMap);
                currentInput.value = createOutputValueString();
                hideWidget();
            } else 
                return false;
        }

        function displayWidget(){
            document.addEventListener("click", clickOutOfWidget, false);
            widgetDOM.classList.remove(css.control.hide);
        }
        
        function applyDefaultValues(){
            //1
            widgetDOM.classList.add(css.control.hide);
            //2
            waysDOMList.forEach(function(wayDOM){
                if(wayDOM.classList.contains(css.struct.ways[startWayName]))
                    wayDOM.classList.add(css.control.border);
            });
            //3
            contentsDOMList.forEach(function(contentDOM){
                if(!contentDOM.classList.contains(css.struct.ways[startWayName])){
                    contentDOM.classList.add(css.control.hide);
                }
            });

            formatsDOMByWayList.forEach(function(formatDOM){
                if(!formatDOM.classList.contains(css.struct.ways[startWayName])){
                    formatDOM.classList.add(css.control.hide);
                }
            });
            //4
            formatsDOMList.forEach(function(oneWayFormatsDOMList){
                oneWayFormatsDOMList.forEach(function(formatDOM){
                    if(formatDOM.classList.contains(css.struct.formats[colorFormat]))
                        formatDOM.classList.add(css.control.border);
                });
            });
        }

        function goThroughDOMNodesUp(DOMElement, targetElement, stack){
            
            stack.push(DOMElement);

            if(DOMElement === targetElement){
                return stack;
            }
           
            DOMElement = DOMElement.parentNode;

            if(!DOMElement)
                return stack;

            return goThroughDOMNodesUp(DOMElement, targetElement, stack);
        }

        return {inputStackDOMList: inputStackDOMList, widgetDOM: widgetDOM};
    }

    return colorPicker;
})();