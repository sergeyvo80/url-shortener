let saveLink = () => {

  let url = document.querySelector('.url-shortener__url');
  let shortUrl = document.querySelector('.url-shortener__result');
  let urlValue = url ? url.value : '';
  if (!urlValue) {
    return;
  }

  let body = 'url=' + encodeURIComponent(urlValue);

  let xhr = new XMLHttpRequest();
  xhr.open("POST", '/', true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

  xhr.onreadystatechange = () => {
    if (xhr.readyState != 4) return;
    let html = '<a href="'+xhr.responseText+'" target="_blank">'+xhr.responseText+'</a>';//xhr.responseText;
    shortUrl.innerHTML = html;
  };

  xhr.send(body);

  url.onkeyup = (ev) => {
    if (ev.target.value == '') {
      shortUrl.innerHTML = '';
    }
  }

};

