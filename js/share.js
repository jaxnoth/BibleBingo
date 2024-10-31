async function shareBingoCard() {
    if (!navigator.share) {
        alert('Sharing is not supported on this browser');
        return;
    }

    try {
        await navigator.share({
            title: 'Bible Bingo Card',
            text: 'Check out my Bible Bingo card!',
            url: window.location.href
        });
    } catch (error) {
        console.log('Error sharing:', error);
    }
}