document.addEventListener("DOMContentLoaded", function () {

	let messagesName = document.querySelectorAll('.messages__name')
	let messagesText = document.querySelectorAll('.messages__text')
	let paginationElem = document.querySelectorAll('.pagination__elem')

	messagesName.forEach(el => {
		let text = el.textContent
		if (text.length > 15) el.textContent = text.slice(0, 14) + '...'
	})

	messagesText.forEach(el => {
		let text = el.textContent
		if (text.length > 47) el.textContent = text.slice(0, 47)
	})

	let isEnd = true

	function removePaginationElems() {
		if (isEnd) {
			paginationElem.forEach((el, i) => {
				if (i > 3 && i < 10 && window.innerWidth < 510) el.classList.add('d-none')
				else el.classList.remove('d-none')
			})
		}
		isEnd = false
		setTimeout(() => isEnd = true, 1000)
	}

	removePaginationElems()

	window.addEventListener('resize', removePaginationElems)
})
