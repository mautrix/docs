// Allow clicking on summary headers to open the details
for (const item of document.querySelectorAll("summary > h3 > a")) {
    item.onclick = () => item.parentElement?.parentElement?.click()
}
