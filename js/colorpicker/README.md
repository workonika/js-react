JS. Виджет "Colorpicker"
========================
<./developer>

Структуры данных виджета
-------------------------
    wayOfGettingColor
    colorFormats
    matchFormatToMethod
    colorNames
    cssClasses

Функции виджета
---------------
    colorPicker - возвращаемая функция из модуля (IIFE)
    copyObject
    getInputSizeAndPosition
    createWidgetDOMElement
    buildSquare
    buildSlider
    createResult
    createSlide
    createInput
    restructurize
    bindEventListeners

Структуры данных функции colorPicker
------------------------------------
    inputStackDOM
    commonParams
    paramsOfcreateWidgetDOMElement
    paramsOfBindEventListeners

Структуры данных функции bindEventListeners
--------------------------
    rgba
    oneWayDifferrentAreas
    inputStackDOM
    getInputSizeAndPosition
    cssClassesForControl
    waysOfGettingColorKeys
    colorFormatsKeys
    colorNames
    colorNamesList
    squareDOMList
    rectDOMList
    sliderDOMList
    waysDOM
    formatsDOM
    contentDOM
    contentAreaEventsHandles
    stackOfElemsForMousemoveEvent
    rgbaInputsList
    slidersList

Функции определенные внутри bindEventListeners
--------------------------
    getDOM
    getNestedElems
    getDeepNestedElems
    matchingElements
    clickInput
    widgetEventsHandler
    switchWay
    chooseFormat
    getValue
    mousedown
    mouseup
    mousemove
    click
    squareFn
    rectFn
    sliderFn
    clickClose
    clickOutOfWidget
    decToHEX
    hexToDEC
    validation
    initRGBA
    saveRGBA
    hideWidget
    displayWidget
    traversalDOMUp
    createOutputValueString
    endupChoice
    setWebnameFocus
    setValueSliderInput
    setSlidersPosition
    setRGBThroughSlidersPosition
    getColorFormatKeyByCssClass
    applyDefaultValues
    getKeyByName


Идея заложенная в обработку событий клика в разных областях виджета colorpicker
-------------------------------------------------------------------------------

Полное описание процесса будет представлено примерно в первой декаде августа 2019г.
![DOM-дерево виджета](../../img/IMG_20190725_194412.jpg)