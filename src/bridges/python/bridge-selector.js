const updateBridgeSelection = () => {
    const selector = document.getElementById("bridge-selector")
    for (const elem of document.getElementsByClassName("bridge-type")) {
        elem.innerText = selector.value
    }

    for (const elem of document.getElementsByClassName("bridge-filter")) {
        const showItem = (selector.value === "$bridge" && !elem.hasAttribute("bridge-no-generic")) ||
            elem.getAttribute("bridges").split(",").includes(selector.value)
        if (elem.tagName === "SPAN") {
            if (showItem) {
                elem.parentElement.style.removeProperty("display")
                if (selector.value === "$bridge") {
                    elem.style.removeProperty("display")
                } else {
                    elem.style.display = "none"
                }
            } else {
                elem.parentElement.style.display = "none"
            }
        } else {
            console.log(showItem)
            if (showItem) {
                elem.style.removeProperty("display")
            } else {
                elem.style.display = "none"
            }
        }
    }
}

const selector = document.getElementById("bridge-selector")
if (selector) {
    selector.addEventListener("change", updateBridgeSelection)

    for (const node of document.getElementsByTagName("code")) {
        node.innerHTML = node.innerHTML.replaceAll("$bridge", `<span class="bridge-type">$bridge</span>`)
    }
    // TODO replace $bridge in non-code elements somehow

    updateBridgeSelection()
}
