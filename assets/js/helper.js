function forceHttps(text) {
    return text.replace(/^http:\/\//i, 'https://');
}


function imgError($this) {
    $this.setAttribute('src', 'assets/images/default-team-badge.png');
}
  
