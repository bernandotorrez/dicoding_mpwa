function hideLoading() {
  var loading = document.querySelector('.loading-content');
  loading.classList.add('hide');
}

function forceHttps(text) {
  return text.replace(/^http:\/\//i, 'https://');
}

function imgError($this) {
  $this.setAttribute('src', 'assets/images/default-team-badge.png');
}

function changeClassIcon(e) {
  let { innerText } = e;
  if (innerText == 'favorite') { innerText = 'favorite_border' } else { innerText = 'favorite' };
  e.innerText = innerText;
}