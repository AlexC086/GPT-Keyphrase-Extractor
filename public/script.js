const postBtn = document.getElementById('post')
const input = document.getElementById('input')
const output = document.getElementById('output')

const baseUrl = 'http://localhost:8383/'

postBtn.addEventListener('click', postInfo)

async function postInfo(e) {
    e.preventDefault()
    if (input.value === '') return

    const request = await fetch(baseUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            parcel: input.value
        })
    })

    // Get the response
    const response = await fetch(baseUrl + 'info', {
        method: 'GET'
    })

    const data = await response.json()
    output.textContent = data.info

}

input.addEventListener('input', resizeTextarea)
function resizeTextarea() {
    this.style.height = 'auto'
    this.style.height = this.scrollHeight + 'px'
}