const selectMenu = document.querySelector('.select-menu')
const selectSelected = document.querySelector('.select-selected')
const selectInput = document.querySelector('.select-input input')
const selectDropdown = document.querySelector('.select-dropdown')
const selectArea = document.querySelector('.select-area')

selectArea.addEventListener('click', function() {
    selectDropdown.classList.toggle('active')
})

document.addEventListener('click', function(e) {
    if(!e.target.matches('.select, .select *')) {
        selectDropdown.classList.remove('active')
    }
})

async function getData() {
    const resp = await fetch('https://github.com/country-regions/country-region-data/blob/master/data.json')
    const data = await resp.json()

    selectInput.addEventListener('input', function() {
        if(this.value) {
            const filteredData = data.map(item=> {
                return {
                    ...item,
                    regions: item.regions.filter(i=> {
                        return i.name.toLowerCase().includes(this.value.toLowerCase())
                    })
                    .map(text=> {
                        return {
                            ...text,
                            displayName: text.name.toLowerCase().replace(this.value.toLowerCase(), `<mark>${this.value.toLowerCase()}</mark>`)
                        }
                    })
                }
            })
            .filter(item=> {
                return item.regions.length > 0
            })
    
            renderData(filteredData, true)
            return
        }

        renderData(data)
    })

    renderData(data)
}

function renderData(data, filtered=false) {
    let template = ''

    if(filtered) {
        data.forEach(item=> {
            template += `
                <li>
                    <span>${item.countryName}</span>
                    <ul class="select-submenu" role="list">
                        ${item.regions.map(region=> `<li data-name="${region.name}" data-value="${region.shortCode ? region.shortCode : region.name}">${region.displayName}</li>`).join('')}
                    </ul>
                </li>
            `
        })
    } else {
        data.forEach(item=> {
            template += `
                <li>
                    <span>${item.countryName}</span>
                    <ul class="select-submenu" role="list">
                        ${item.regions.map(region=> `<li data-name="${region.name}" data-value="${region.shortCode ? region.shortCode : region.name}">${region.name}</li>`).join('')}
                    </ul>
                </li>
            `
        })
    }


    selectMenu.innerHTML = template

    const selectMenuItem = document.querySelectorAll('.select-submenu li')

    selectMenuItem.forEach(item=> {
        item.addEventListener('click', function() {
            selectSelected.textContent = this.dataset.name

            selectInput.value = ''

            selectDropdown.classList.remove('active')

            getData()
        })
    })
}

getData()