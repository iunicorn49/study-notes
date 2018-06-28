
export function create () {
  let header = document.getElementById('header')
  for (let i = 0; i < 5; i++) {
    let a = document.createElement('a')
    a.innerText = `Title-0${i + 1}`
    header.appendChild(a)
  }
}