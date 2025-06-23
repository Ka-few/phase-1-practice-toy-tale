document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyForm = document.getElementById('toy-form');
  const toyFormContainer = document.querySelector(".container");
  const toyCollection = document.getElementById('toy-collection');

  // Load existing toys
  fetch('http://localhost:3000/toys')
    .then(response => response.json())
    .then(toys => {
      toyCollection.innerHTML = '';
      toys.forEach(toy => renderToy(toy));
    })
    .catch(() => alert('Failed to load toys.'));

  // Toggle form
  addBtn.addEventListener("click", () => {
    toyFormContainer.style.display = toyFormContainer.style.display === 'block' ? 'none' : 'block';
  });

  // Submit form
  toyForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const newToy = {
      name: document.getElementById('name').value,
      image: document.getElementById('image').value,
      likes: 0
    };

    fetch('http://localhost:3000/toys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newToy)
    })
      .then(res => res.json())
      .then(addedToy => {
        renderToy(addedToy);
        toyForm.reset();
        toyFormContainer.style.display = 'none';
      })
      .catch(() => alert('Something went wrong while adding the toy.'));
  });

  // Like button handler (event delegation)
  toyCollection.addEventListener('click', (e) => {
    if (e.target.classList.contains('like-btn')) {
      const btn = e.target;
      const toyId = btn.dataset.id;
      const card = btn.closest('.toy-card');
      const likeCountEl = card.querySelector('.like-count');
      const currentLikes = parseInt(likeCountEl.textContent);
      const updatedLikes = currentLikes + 1;

      fetch(`http://localhost:3000/toys/${toyId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ likes: updatedLikes })
      })
        .then(res => res.json())
        .then(updatedToy => {
          likeCountEl.textContent = updatedToy.likes;
        })
        .catch(() => alert('Failed to update likes.'));
    }
  });

  // Render a single toy card
  function renderToy(toy) {
    const card = document.createElement('div');
    card.className = 'toy-card';
    card.innerHTML = `
      <h3>${toy.name}</h3>
      <img src="${toy.image}" alt="${toy.name}" style="width: 200px;">
      <p>Likes: <span class="like-count">${toy.likes || 0}</span></p>
      <button class="like-btn" data-id="${toy.id}">Like ❤️</button>
    `;
    toyCollection.appendChild(card);
  }
});
