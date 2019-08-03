JS. Виджет "Colorpicker"
========================
<./developer.md>
Функции виджета
---------------
    colorPicker - возвращаемая функция из модуля (IIFE)
    display
    border
    getInputSizeAndPosition
    createWidgetDOMElement
    buildSquare
    buildRect
    buildSlider
    createResult
    createSlide
    createInput
    restructurize
    bindEventListeners

Структуры данных colorPicker
-------------------------
    wayOfGettingColor
    colorFormats
    matchFormatToMethod
    colorNames
    inputStackDOM
    cssClassesForControl

Структуры данных bindEventListeners
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
    rgbaInputs

Функции определенные внутри bindEventListeners
--------------------------
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
    refreshCurrentInput
    hideWidget
    displayWidget
    traversalDOMUp


Идея заложенная в обработку событий клика в разных областях виджета colorpicker
-------------------------------------------------------------------------------

Полное описание процесса будет представлено примерно в первой декаде августа 2019г.
![DOM-дерево виджета](../../img/IMG_20190725_194412.jpg)