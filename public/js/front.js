let flechita = document.querySelector('#flechita')
let portada = document.querySelector('#portada')
flechita.addEventListener('click', () => scroll(0, portada.getClientRects()[0].height))

// Quitar el párrafo que envuelve a las img que vienen de md
let corregir_imagenes = () => {
  document.querySelectorAll('p img').forEach(i =>{
    i.parentElement.replaceWith(i)
    } )
}
window.addEventListener('load', corregir_imagenes)
