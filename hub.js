(() => {
  const grid = document.getElementById('game-grid');
  const template = document.getElementById('game-card-template');
  const cards = activities.map(activity => {
    const card = template.content.cloneNode(true);
    const heading = card.querySelector('h3');
    heading.id = 'game-' + activity.id;
    heading.textContent = activity.title;
    card.querySelector('article').setAttribute('aria-labelledby', heading.id);
    card.querySelector('.game-description').textContent = activity.description;
    const image = card.querySelector('img');
    image.src = activity.illustration.src;
    image.alt = activity.illustration.alt;
    card.querySelector('.game-type-label').textContent = activity.type;
    const subjects = activity.subjects.map(subject => {
      const tag = document.createElement('li');
      tag.textContent = subject;
      return tag;
    });
    card.querySelector('.subject-tags').replaceChildren(...subjects);
    card.querySelector('.game-duration').textContent = activity.duration;
    card.querySelector('.game-format').textContent = activity.format;
    const link = card.querySelector('a');
    link.href = activity.href;
    link.setAttribute('aria-describedby', heading.id);
    return card;
  });
  grid.replaceChildren(...cards);
})();
