(function() {
  

const cards = document.querySelectorAll('.card');
const lists = document.querySelectorAll('.list');

cards.forEach(card => {
    card.addEventListener('dragstart', () => {
        card.classList.add('dragging');
  })

  card.addEventListener('dragend', () => {
    card.classList.remove('dragging');
  })
})

lists.forEach(list => {
  list.addEventListener('dragover', e => {
    e.preventDefault();
    const afterElement = getDragAfterElement(list, e.clientY)
    const card = document.querySelector('.dragging');
    if (afterElement == null) {
        list.appendChild(card);
    } else {
        list.insertBefore(card, afterElement);
    }
  })
})

function getDragAfterElement(list, y) {
  const draggableElements = [...list.querySelectorAll('.card:not(.dragging)')]

  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect()
    const offset = y - box.top - box.height / 2
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child }
    } else {
      return closest
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element
}

})();