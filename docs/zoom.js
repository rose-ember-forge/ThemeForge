const view = document.createElement('dialog');
view.className = 'zoom-view';
view.innerHTML = '<button type = "button" aria-label = "Close">&times;</button><img alt="x">';
document.body.append(view);
const bigImage = view.querySelector('img');

document.querySelectorAll('a.zoom').forEach(link => {
    link.addEventListener('click', event =>{
        event.preventDefault();
        bigImage.src = link.href;
        bigImage.alt = link.querySelector('img').alt;
        view.showModal();
    });
});

view.addEventListener('click', () => view.close());