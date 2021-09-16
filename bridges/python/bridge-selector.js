const allowedBridges = ["$bridge", "telegram", "facebook", "hangouts", "googlechat", "twitter", "signal", "instagram"]

const bridgePorts = {
  "$bridge": "$bridgeport",
  "telegram": "29317",
  "facebook": "29319",
  "hangouts": "29320",
  "googlechat": "29320",
  "twitter": "29327",
  "signal": "29328",
  "instagram": "29330",
}

const updateBridgeSelection = () => {
    const selector = document.getElementById("bridge-selector")
    if (!allowedBridges.includes(selector.value)) {
        selector.value = "$bridge"
        return
    }

    for (const elem of document.getElementsByClassName("bridge-port")) {
        elem.innerText = bridgePorts[selector.value]
    }
    for (const elem of document.getElementsByClassName("bridge-type")) {
        elem.innerText = selector.value
    }

    const url = new URL(window.location)
    if (selector.value === "$bridge") {
        url.searchParams.delete("bridge")
    } else {
        url.searchParams.set("bridge", selector.value)
    }
    history.pushState({}, "", url)

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
    const url = new URL(window.location)
    if (url.searchParams.has("bridge")) {
        selector.value = url.searchParams.get("bridge")
        if (!allowedBridges.includes(selector.value)) {
            selector.value = "$bridge"
        }
    }
    selector.addEventListener("change", updateBridgeSelection)

    for (const node of document.getElementsByTagName("code")) {
        node.innerHTML = node.innerHTML.replaceAll("$bridgeport", `<span class="bridge-port">$bridgeport</span>`)
    }
    for (const node of document.getElementsByTagName("code")) {
        node.innerHTML = node.innerHTML.replaceAll("$bridge", `<span class="bridge-type">$bridge</span>`)
    }
    // TODO replace $bridge in non-code elements somehow

    updateBridgeSelection()
}
