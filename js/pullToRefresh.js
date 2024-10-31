let touchStart = 0;
let scrollStart = 0;

document.addEventListener('touchstart', e => {
    touchStart = e.touches[0].clientY;
    scrollStart = window.scrollY;
});

document.addEventListener('touchmove', e => {
    const touchY = e.touches[0].clientY;
    const touchDiff = touchY - touchStart;

    if (window.scrollY === 0 && touchDiff > 70) {
        document.querySelector('.pull-to-refresh').classList.add('visible');
    }
});

document.addEventListener('touchend', e => {
    const pullToRefresh = document.querySelector('.pull-to-refresh');
    if (pullToRefresh.classList.contains('visible')) {
        pullToRefresh.classList.remove('visible');
        location.reload();
    }
});