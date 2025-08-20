function setupMusicAdmonitions() {
    const musicAdmonitions = document.querySelectorAll('.md-typeset details.music');
    const audioPlayers = [];

    musicAdmonitions.forEach((admonition) => {  
        const audioElement = admonition.querySelector('[data-audio]');
        if (!audioElement) return;

        const audioPath = audioElement.dataset.audio;
        const audio = new Audio(audioPath);
        audioPlayers.push(audio);

        // 监听 toggle 事件，播放/暂停音乐
        admonition.addEventListener('toggle', function () {
            if (this.open) {
                audio.play();
            } else {
                audio.pause();
                audio.currentTime = 0;
            }
        });
    });

    // 监听 URL 变化，切换页面时停止播放音乐
    let lastUrl = location.href;
    const observer = new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            audioPlayers.forEach(audio => {
                audio.pause();
                audio.currentTime = 0;
            });
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return audioPlayers;
}

// 页面加载完毕时初始化
document.addEventListener('DOMContentLoaded', setupMusicAdmonitions);
