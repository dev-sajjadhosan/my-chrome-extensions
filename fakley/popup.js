const connectBtn = document.getElementById('connectBtn')
const mainUI = document.getElementById('mainUI')
const generateBtn = document.querySelectorAll('#generateBtn')
const output = document.getElementById('output')
const copyBtn = document.getElementById('copyBtn')
const copyBtn2 = document.getElementById('copyBtn2')
const downloadBtn = document.getElementById('downloadBtn')
const apiUrlsList = document.getElementById('apiUrls')
const showJsonBtn = document.getElementById('showBtn')
const closeJsonBtn = document.getElementById('json_popup_cl')
const jsonPopupModal = document.querySelector('.json_popup')
const container = document.querySelector('.container')

let c = false

connectBtn?.addEventListener('click', () => {
  container.style.display = 'none'
  mainUI.style.display = 'block'
})

// Extend with new types
const baseUrls = {
  users: (qty) => `https://fakerapi.it/api/v1/persons?_quantity=${qty}`,
  products: (qty) => `https://dummyjson.com/products?limit=${qty}`,
  images: (qty) => `https://picsum.photos/v2/list?limit=${qty}`,
  avatars: (qty) => `https://randomuser.me/api/?results=${qty}`,
  posts: (qty) => `https://jsonplaceholder.typicode.com/posts?_limit=${qty}`,
  comments: (qty) =>
    `https://jsonplaceholder.typicode.com/comments?_limit=${qty}`,
  todos: (qty) => `https://jsonplaceholder.typicode.com/todos?_limit=${qty}`,
  companies: (qty) => `https://fakerapi.it/api/v1/companies?_quantity=${qty}`,
  locations: (qty) => `https://fakerapi.it/api/v1/addresses?_quantity=${qty}`,
  transactions: (qty) =>
    `https://fakerapi.it/api/v1/custom?_quantity=${qty}&_locale=en_US&transaction=currency_code.price.date`,
  emails: (qty) =>
    `https://fakerapi.it/api/v1/custom?_quantity=${qty}&email=email`,
  phones: (qty) =>
    `https://fakerapi.it/api/v1/custom?_quantity=${qty}&phone=phone`,
  uuids: (qty) => `https://www.uuidtools.com/api/generate/v4/count/${qty}`,
  reviews: (qty) =>
    `https://fakerapi.it/api/v1/custom?_quantity=${qty}&title=word&rating=number.comment`,
  books: (qty) => `https://fakerapi.it/api/v1/books?_quantity=${qty}`,
  notifications: (qty) =>
    `https://fakerapi.it/api/v1/custom?_quantity=${qty}&title=word.message=date`,
}

for (const generate of generateBtn) {
  generate.addEventListener('click', async () => {
    apiUrlsList.style.display = 'flex'
    const selectedTypes = [
      ...document.querySelectorAll('input[type=checkbox]:checked'),
    ].map((cb) => cb.value)
    const qty = document.getElementById('quantity').value || 5
    output.textContent = ''
    apiUrlsList.innerHTML = ''

    if (!selectedTypes.length) {
      apiUrlsList.style.display = 'flex'
      apiUrlsList.innerHTML = `
    <li>
    <p>⚠️ Please select at least one data type. to Generate ⚡</p>
    </li>
    `
      output.style.display = 'block'
      // output.textContent = '⚠️ Please select at least one data type.'
      return
    }

    const combinedData = {}

    for (const type of selectedTypes) {
      const urlGenerator = baseUrls[type]

      if (!urlGenerator) {
        combinedData[type] = ['❌ No API available']
        continue
      }

      const url = urlGenerator(qty)
      const li = document.createElement('li')
      li.innerHTML = `
    <p>${url}</p>
    <p>Copy</p>
    `
      apiUrlsList.appendChild(li)

      li?.addEventListener('click', () => {
        navigator.clipboard.writeText(url)
        // Show the textContent of the second child (the "Copy" <p>)
        const aaa = li.children
        if (aaa[1]) {
          aaa[1].textContent = '✔️Copied'
          setTimeout(() => {
            aaa[1].textContent = 'Copy'
          }, 1500)
        }
      })

      try {
        const res = await fetch(url)
        const json = await res.json()

        combinedData[type] =
          json.data || json.results || json.products || json || []
      } catch (e) {
        combinedData[type] = ['❌ Failed to fetch']
      }
    }

    output.style.display = 'block'
    output.textContent = JSON.stringify(combinedData, null, 2)
  })
}

const handleError = (error) => {
  const li = document.createElement('li')
  apiUrlsList.innerHTML = ''
  li.innerHTML = `
    <p>${error}</p>
    `
  apiUrlsList.appendChild(li)
}

copyBtn.addEventListener('click', () => {
  if (output.textContent === '') {
    return handleError('❌ No code is here! Please Generate⚡to copy code.')
  }
  const data = output.textContent
  navigator.clipboard.writeText(data).then(() => {
    copyBtn.textContent = 'Copied!'
    setTimeout(
      () =>
        (copyBtn.innerHTML = ` <i class="fa-solid fa-clone"></i>
          Copy`),
      2000,
    )
  })
})
copyBtn2.addEventListener('click', () => {
  const data = output.textContent
  navigator.clipboard.writeText(data)
})

downloadBtn.addEventListener('click', () => {
  if (output.textContent === '') {
    return handleError(
      'No file 📁 is here! Please Generate⚡code to download ⬇️ file.',
    )
  }
  const blob = new Blob([output.textContent], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'fakley_data.json'
  a.click()
})

let d = false
const dropdownToggle = document.getElementById('dropdownToggle')
const dropdownMenu = document.getElementById('dropdownMenu')

// Toggle visibility
dropdownToggle.addEventListener('click', () => {
  d = !d
  dropdownMenu.classList.toggle('hidden')
  dropdownToggle.innerHTML = d
    ? `<i class="fa-solid fa-angle-up"></i>`
    : `<i class="fa-solid fa-angle-down"></i>`
})
document.querySelectorAll('#dropdownMenu .dropdown-item').forEach((item) => {
  item.addEventListener('click', () => {
    const input = item.querySelector('input[type="checkbox"]')
    input.checked = !input.checked
    item.classList.toggle('selected', input.checked)
  })
})

showJsonBtn?.addEventListener('click', () => {
  if (output.textContent === '') {
    return handleError('No code 👨‍💻 is here! Please Generate⚡code to see.')
  }
  jsonPopupModal.style.display = 'flex'
})
closeJsonBtn?.addEventListener('click', () => {
  jsonPopupModal.style.display = 'none'
})
