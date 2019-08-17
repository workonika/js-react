JS. Виджет "Colorpicker"
========================



Структуры данных виджета
-------------------------
    wayOfGettingColorMap
    colorFormatsMap
    matchFormatToMethodMap
    cssClassesMap
    colorNamesMap

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
    inputStackDOMList
    commonParamsMap
    paramsOfcreateWidgetDOMElement
    paramsOfBindEventListeners

Структуры данных функции bindEventListeners
--------------------------
    rgbMap
    oneWayDifferrentAreasList
    colorFormatsKeysList
    colorNamesList
    squareDOMList
    sliderDOMList
    waysDOMList
    formatsDOMList
    formatsDOMByWayList
    contentsDOMList
    contentAreaEventsHandlesFnList
    rgbInputsList
    slidersList
    webnamesDOMList

Функции определенные внутри bindEventListeners
--------------------------
    getDOM
    getElemsByWay
    getElemsByColorFormat
    matchElements
    clickInput
    handleAllWidgetEvents
    switchWay
    chooseFormat
    getValue
    mousedown
    mouseup
    mousemove
    click
    handleClickOnContentSquare
    handleClickOnContentSlider
    clickClose
    createOutputValueString
    clickOutOfWidget
    convertDecToHEX
    convertHexToDEC
    initRGB
    setWebnameFocus
    setValueSliderInput
    setSlidersPosition
    setRGBThroughSlidersPosition
    setSliderResultValue
    getKeyByName
    saveRGB
    hideWidget
    endupChoice
    displayWidget
    applyDefaultValues
    goThroughDOMNodesUp
    setWebnameFocus
    getColorFormatKeyByCssClass
    
    
Идея заложенная в обработку событий клика в разных областях виджета colorpicker
-------------------------------------------------------------------------------

Полное описание процесса будет представлено примерно в первой декаде августа 2019г.
![DOM-дерево виджета](../../img/IMG_20190725_194412.jpg)