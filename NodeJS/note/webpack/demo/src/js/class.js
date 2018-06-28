export function addClass () {
  let items = header.querySelectorAll('a')
  items.forEach(item => item.classList.add('item'))
}