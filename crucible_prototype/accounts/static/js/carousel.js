document.addEventListener('DOMContentLoaded', function() {
  const prev = document.getElementsByClassName('prev-btn');
  const next = document.getElementsByClassName('next-btn');
  const list = document.getElementsByClassName('item-list');

  const itemWidth = 400;
  const padding = 20;

  prev[0].addEventListener('click', () => {
    console.log('clicked');
    list[0].scrollLeft -= itemWidth + padding;
  });

  next[0].addEventListener('click', () => {
    console.log('clicked');
    list[0].scrollLeft += itemWidth + padding;
  });
});
