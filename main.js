function guidGenerator() {
    /**
     * @return {string}
     */
    var S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return S4() + S4() + S4() + S4();
}

function addItem({top, left, key, value, id = null}) {
    if (id == null) {
        id = guidGenerator();
    }
    let parent = document.getElementById("inputManageArea");
    if (parent.children.length === 5) {
        console.log("you can add only 5 item");
        return;
    }

    parent.insertAdjacentHTML('beforeend', `
               <div class="input-box" id="input-parent-${id}">
                    <div class="remove-btn" id="remove-${id}" remove-id='${id}'>remove</div>
                    <input type='text' data-type="value" id="value-${id}" placeholder="value field:" value="${value}">
                    <input type='text' data-type="key" id="key-${id}" placeholder="key field:" value="${key}">
               </div>
            `);

    let card = document.getElementById("parent");
    card.insertAdjacentHTML('beforeend', `<div class='item-text' draggable="true" data-id="${id}" id='card-${id}'>
                                                            <p data-type="key">${key}</p>
                                                            <p data-type="value">${value}</p>
                                                        </div>`);

    var item = document.getElementById(`card-${id}`)
    item.style.top = top + "px";
    item.style.left = left + "px";

    let inputKey = document.getElementById(`key-${id}`);
    inputKey.addEventListener('input', function (event) {
        let element = document.getElementById(`card-${id}`);
        let index = getElementIndex(element)
        let top = element.style.top.replace('px', '');
        let left = element.style.left.replace('px', '');
        let data;
        let elemValue = element.children[1];
        let elemKey = element.children[0];
        elemKey.innerText = event.target.value;
        data = {
            left: left,
            top: top,
            key: elemKey.innerText,
            value: elemValue.innerText,
            id: element.getAttribute("data-id")
        }
        updateData(index, data)
    });

    let inputValue = document.getElementById(`value-${id}`);
    inputValue.addEventListener('input', function (event) {
        let element = document.getElementById(`card-${id}`);
        let index = getElementIndex(element)
        let top = element.style.top.replace('px', '');
        let left = element.style.left.replace('px', '');
        let data;
        let elemValue = element.children[1];
        let elemKey = element.children[0];
        elemValue.innerText = event.target.value;
        data = {
            left: left,
            top: top,
            key: elemKey.innerText,
            value: elemValue.innerText,
            id: element.getAttribute("data-id")
        }
        updateData(index, data)
    });

    //remove item
    document.getElementById("remove-" + id).addEventListener('click', function (event) {
        document.getElementById("card-" + id).remove();
        document.getElementById("input-parent-" + id).remove();
        removeItem(event.target)
    });


    //drag item event from card
    document.getElementById(`card-${id}`).addEventListener("dragstart", function (event) {
        event = event || window.event;
        var posX = event.clientX,
            posY = event.clientY,
            a = event.target,
            divTop = a.style.top,
            divLeft = a.style.left;
        divTop = divTop.replace('px', '');
        divLeft = divLeft.replace('px', '');
        var diffX = posX - divLeft,
            diffY = posY - divTop;
        document.ondrag = function (evt) {
            evt = evt || window.event;
            var posX = evt.clientX,
                posY = evt.clientY,
                aX = posX - diffX,
                aY = posY - diffY;
            var offsetWidth = evt.target.parentElement.offsetWidth - evt.target.offsetWidth;
            var offsetHeight = evt.target.parentElement.offsetHeight - evt.target.offsetHeight;
            if ((aX > 0) && (aX < offsetWidth) && (aY > 0) && (aY < offsetHeight)) {
                moveElement(a, aX, aY);
            }
        }
    })
    loadCardConfig(card);
}

function removeInput(id) {
    console.log(id);
}

document.getElementById("fontSize").addEventListener('input', function (event) {
    updateFontSize(event.target.value);
});
document.getElementById("textColor").addEventListener('input', function (event) {
    updateTextColor(event.target.value);
});
document.getElementById("widthSize").addEventListener('input', function (event) {
    updateCardWidthSize(event.target.value);
});
document.getElementById("heightSize").addEventListener('input', function (event) {
    updateCardHeightSize(event.target.value);
});
document.getElementById("backgroundCover").addEventListener('input', function (event) {
    if (event.target.files && event.target.files[0]) {
        updateCardBackground(event.target.files[0])
    }
})

function updateCardWidthSize(value) {
    document.getElementById("parent").style.width = `${value}cm`;
    document.getElementById("displayWidth").innerHTML = `width:${value}cm`
    document.getElementById("widthSize").value = value
    updateConfig({width: `${value}`})
}

function updateCardHeightSize(value) {
    document.getElementById("parent").style.height = `${value}cm`;
    document.getElementById("displayHeight").innerHTML = `height:${value}cm`;
    document.getElementById("heightSize").value = value
    updateConfig({height: `${value}`})
}


function updateFontSize(value) {
    let items = document.getElementsByClassName("item-text");
    for (let i = 0; i < items.length; i++) {
        items[i].style.fontSize = `${value}pt`
    }
    document.getElementById("fontSize").value = value
    updateConfig({fontSize: value})
}

function updateCardBackground(file) {
    let reader = new FileReader();
    reader.readAsDataURL(file); // convert to base64
    reader.onload = function (e) {
        let card = document.getElementById("parent");
        card.style.background = `url(${e.target.result})`;
        card.style.backgroundPosition = `center`;
        card.style.backgroundRepeat = `no-repeat`;
        card.style.backgroundSize = `cover`;
        updateConfig({background: e.target.result})
    };
}

function updateTextColor(color) {
    let items = document.getElementsByClassName("item-text");
    for (let i = 0; i < items.length; i++) {
        items[i].style.color = `${color}`
    }
    document.getElementById("textColor").value = color
    updateConfig({textColor: color})
}


function getElementIndex(element) {
    return Array.from(element.parentNode.children).indexOf(element);
}

function displaySampleCard() {
    let container = document.getElementById("displayCards");
    let cardConfig = JSON.parse(localStorage.getItem("cardConfig"))
    let getData = JSON.parse(localStorage.getItem("cardPosition"))
    let html = ``;
    for (let j = 0; j < getData.length; j++) {
        html += `<div class='item-text' style="position:absolute;top: ${getData[j].top + 'px'}; left: ${getData[j].left + 'px'}; ">
        <p data-type="key">${getData[j].key}</p>
        <p data-type="value">${getData[j].value}</p>
        </div>`
    }
    for (let i = 0; i <= 6; i++) {
        container.insertAdjacentHTML('beforeend', `
                <div style="width:${cardConfig.width+'cm'};height:${cardConfig.height+'cm'};background:${cardConfig.background};color:${cardConfig.textColor};font-size:${cardConfig.fontSize + 'pt'}" class="card">${html}</div>
             `);
    }

}

var loadData = function () {
    let parentElement = document.getElementById("parent");
    let getData = JSON.parse(localStorage.getItem("cardPosition"))
    if (getData === undefined || getData === null) {
        loadCardConfig(parentElement);
        return;
    }

    let loadData = []
    for (let i = 0; i < getData.length; i++) {
        addItem(getData[i])
        loadData[i] = {
            left: getData[i].left,
            top: getData[i].top,
            key: getData[i].key,
            value: getData[i].value,
            id: getData[i].id
        }
    }
    localStorage.setItem("cardPosition", JSON.stringify(loadData))
    loadCardConfig(parentElement);
    displaySampleCard()
}();

function updateData(index, nodeData) {
    let data = JSON.parse(localStorage.getItem("cardPosition"))
    if (data === undefined || data === null) {
        data = [nodeData]
    } else {
        data[index] = nodeData
    }
    localStorage.setItem("cardPosition", JSON.stringify(data))
}

function moveElement(elm, xPosition, yPosition) {
    let index = getElementIndex(elm)
    elm.style.left = xPosition + 'px';
    elm.style.top = yPosition + 'px';
    // update element position data
    updateData(index, {
        left: xPosition,
        top: yPosition,
        key: elm.children[0].innerText,
        value: elm.children[1].innerText,
        id: elm.getAttribute("data-id")
    })
}

function removeItem(element) {
    let index = getElementIndex(element)
    let data = JSON.parse(localStorage.getItem("cardPosition"))
    data[index].remove()
    localStorage.setItem("cardPosition", JSON.stringify(data))
}


function updateConfig({width = null, height = null, fontSize = null, textColor = null, background = null}) {
    let cardConfig = JSON.parse(localStorage.getItem("cardConfig"))
    if (width === null) width = cardConfig.width;
    if (height === null) height = cardConfig.height;
    if (fontSize === null) fontSize = cardConfig.fontSize;
    if (textColor === null) textColor = cardConfig.textColor;
    if (background === null) background = cardConfig.background;
    localStorage.setItem("cardConfig", JSON.stringify({width, height, fontSize, textColor, background}))
}

function loadCardConfig(parentElement) {
    let cardConfig = JSON.parse(localStorage.getItem("cardConfig"))
    if (cardConfig === null) {
        cardConfig = {width: 13, height: 8, fontSize: 15, textColor: "#ffffff", background: "blueviolet"}
        localStorage.setItem("cardConfig", JSON.stringify(cardConfig))
    } else {
        if (cardConfig.width === null) cardConfig.width = 13;
        if (cardConfig.height === null) cardConfig.height = 8;
        if (cardConfig.fontSize === null) cardConfig.fontSize = 15;
        if (cardConfig.textColor === null) cardConfig.textColor = "#ffffff";
        if (cardConfig.background === null) cardConfig.background = "blueviolet";
        localStorage.setItem("cardConfig", JSON.stringify(cardConfig))
    }
    parentElement.style.background = cardConfig.background;
    parentElement.style.backgroundImage = `url("${cardConfig.background}")`;
    parentElement.style.backgroundPosition = `center`;
    parentElement.style.backgroundRepeat = `no-repeat`;
    parentElement.style.backgroundSize = `cover`;
    updateCardWidthSize(cardConfig.width)
    updateCardHeightSize(cardConfig.height)
    updateTextColor(cardConfig.textColor)
    updateFontSize(cardConfig.fontSize)
    for (let i = 0; i < parentElement.children.length; i++) {
        parentElement.children[i].style.color = cardConfig.textColor
        parentElement.children[i].style.fontSize = cardConfig.fontSize + "pt"
    }
}