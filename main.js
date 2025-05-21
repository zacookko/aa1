// main.js - YouTube风格视频播放器功能脚本
const videos = [
  {
    title: "示例视频1",
    desc: "这是第一个本地示例视频。",
    src: "videos/sample1.mp4",
    thumb: "videos/thumb1.jpg"
  },
  {
    title: "示例视频",
    desc: "这是本地示例视频。",
    src: "videos/sample3.mp4",
    thumb: "videos/thumb3.jpg"
  }
];

let lastSearch = '';

function renderVideoList(filter = "") {
  lastSearch = filter;
  const list = document.getElementById('videoList');
  list.innerHTML = "";
  let filtered = videos.filter(v => v.title.includes(filter) || v.desc.includes(filter));
  if (filtered.length === 0) {
    list.innerHTML = '<div class="no-result">没有找到相关视频</div>';
    return;
  }
  filtered.forEach((video, idx) => {
    const item = document.createElement('div');
    item.className = 'video-item';
    item.onclick = () => openPlayer(getVideoIndex(video));
    item.innerHTML = `
      <img class="video-thumb" src="${video.thumb}" alt="${video.title}">
      <div class="video-info">
        <div class="video-title">${video.title}</div>
        <div class="video-desc">${video.desc}</div>
      </div>
    `;
    list.appendChild(item);
  });
}

function getVideoIndex(video) {
  return videos.findIndex(v => v.src === video.src);
}

function openPlayer(idx) {
  const video = videos[idx];
  document.getElementById('mainContent').innerHTML = `
    <div class="player-page">
      <div class="player-main">
        <button class="btn" onclick="goHome()">← 返回主页</button>
        <video id="mainVideo" src="${video.src}" controls autoplay tabindex="0"></video>
        <div style="width:100%;display:flex;justify-content:space-between;align-items:center;margin-top:8px;">
          <span id="videoTime" style="font-size:14px;color:#888;"></span>
          <span style="font-size:13px;color:#aaa;">空格播放/暂停，←→快退/快进5秒</span>
        </div>
        <div class="player-title">${video.title}</div>
        <div class="player-desc">${video.desc}</div>
      </div>
      <div class="playlist">
        <div class="playlist-title">播放列表</div>
        <div id="playlistItems"></div>
      </div>
    </div>
  `;
  renderPlaylist(idx);
  setupPlayerEvents(idx);
}

function setupPlayerEvents(idx) {
  const video = document.getElementById('mainVideo');
  const timeLabel = document.getElementById('videoTime');
  function formatTime(sec) {
    if (isNaN(sec)) return '00:00';
    let m = Math.floor(sec/60), s = Math.floor(sec%60);
    return (m<10?'0':'')+m+":"+(s<10?'0':'')+s;
  }
  function updateTime() {
    timeLabel.textContent = formatTime(video.currentTime) + ' / ' + formatTime(video.duration);
  }
  video.addEventListener('timeupdate', updateTime);
  video.addEventListener('loadedmetadata', updateTime);
  video.addEventListener('ended', () => {
    if (idx+1 < videos.length) openPlayer(idx+1);
  });
  video.focus();
  video.addEventListener('keydown', e => {
    if (e.code === 'Space') {
      e.preventDefault();
      if (video.paused) video.play(); else video.pause();
    } else if (e.code === 'ArrowLeft') {
      video.currentTime = Math.max(0, video.currentTime-5);
    } else if (e.code === 'ArrowRight') {
      video.currentTime = Math.min(video.duration, video.currentTime+5);
    }
  });
}

function goHome() {
  document.getElementById('mainContent').innerHTML = `
    <div class="video-list" id="videoList"></div>
  `;
  renderVideoList(lastSearch);
}

function renderPlaylist(currentIdx) {
  const playlist = document.getElementById('playlistItems');
  playlist.innerHTML = "";
  videos.forEach((video, idx) => {
    const item = document.createElement('div');
    item.className = 'playlist-item' + (idx === currentIdx ? ' active' : '');
    item.onclick = () => openPlayer(idx);
    item.innerHTML = `
      <img class="playlist-thumb" src="${video.thumb}" alt="${video.title}">
      <div class="playlist-info">
        <div class="playlist-title-small">${video.title}</div>
        <div class="playlist-desc-small">${video.desc}</div>
      </div>
    `;
    playlist.appendChild(item);
  });
}

function searchVideos() {
  const val = document.getElementById('searchInput').value.trim();
  renderVideoList(val);
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('searchInput').addEventListener('keydown', function(e){
    if (e.key === 'Enter') searchVideos();
  });
  renderVideoList();
});
