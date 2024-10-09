const pythonBridges = ["telegram", "facebook", "googlechat", "twitter", "instagram"]
const goBridges = ["whatsapp", "discord", "slack", "gmessages", "signal", "meta", "gvoice"]
let allowedBridges = ["$bridge"]

const bridgePorts = {
    "$bridge": "$bridgeport",
    "telegram": "29317",
    "whatsapp": "29318",
    "facebook": "29319",
    "meta": "29319",
    "googlechat": "29320",
    "twitter": "29327",
    "signal": "29328",
    "instagram": "29330",
    "discord": "29334",
    "slack": "29335",
    "gmessages": "29336",
    "gvoice": "29338",
}

const mainBranch = {
    "$bridge": "$main_branch",
    "telegram": "master",
    "whatsapp": "main",
    "facebook": "master",
    "instagram": "master",
    "googlechat": "master",
    "twitter": "master",
    "signal": "main",
    "discord": "main",
    "slack": "main",
    "gmessages": "main",
    "gvoice": "main",
    "meta": "main",
}

if (window.location.pathname.endsWith("docker-setup.html")) {
    allowedBridges = allowedBridges.concat(pythonBridges, goBridges)
} else if (window.location.pathname.includes("/python/")) {
    allowedBridges = allowedBridges.concat(pythonBridges)
    document.querySelectorAll("#bridge-selector > .language-go").forEach(elem => elem.remove())
} else if (window.location.pathname.includes("/go/")) {
    allowedBridges = allowedBridges.concat(goBridges)
    document.querySelectorAll("#bridge-selector > .language-python").forEach(elem => elem.remove())
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
    for (const elem of document.getElementsByClassName("bridge-main-branch")) {
        elem.innerText = mainBranch[selector.value]
    }
    for (const elem of document.getElementsByClassName("bridge-link")) {
        elem.href = elem.getAttribute("data-href-template").
            replace("$bridge", selector.value).
            replace("$main_branch", mainBranch[selector.value])
    }

    const url = new URL(window.location)
    if (selector.value === "$bridge") {
        url.searchParams.delete("bridge")
    } else {
        url.searchParams.set("bridge", selector.value)
    }
    history.pushState({}, "", url)

    for (const elem of document.getElementsByClassName("bridge-filter")) {
        const filterBridgeList = elem.getAttribute("bridges")?.split(",") ?? []
        const showItem = ((selector.value === "$bridge" && !elem.hasAttribute("bridge-no-generic")) ||
            (selector.value !== "$bridge" && filterBridgeList.includes("all")) ||
            filterBridgeList.includes(selector.value)) && !filterBridgeList.includes(`!${selector.value}`)
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
        node.innerHTML = node.innerHTML
            .replaceAll("$bridgeport", `<span class="bridge-port">$bridgeport</span>`)
            .replaceAll("$bridge", `<span class="bridge-type">$bridge</span>`)
            .replaceAll("$main_branch", `<span class="bridge-main-branch">$main_branch</span>`)
    }
    for (const node of document.getElementsByTagName("a")) {
        if (node.href.includes("$bridge")) {
            node.setAttribute("data-href-template", node.href)
            node.classList.add("bridge-link")
            node.innerHTML = node.innerHTML
                .replaceAll("$bridge", `<span class="bridge-type">$bridge</span>`)
                .replaceAll("$main_branch", `<span class="bridge-main-branch">$main_branch</span>`)
        }
    }
    // TODO replace $bridge in non-code elements somehow

    updateBridgeSelection()
}

const sheet = new CSSStyleSheet()
sheet.replaceSync(".noscript { display: none; }")
document.adoptedStyleSheets.push(sheet)
