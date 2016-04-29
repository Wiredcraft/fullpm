console.log('loaded')
console.log(location.href);

if (location.href.startsWith('https://github.com/Wiredcraft/data.worldbank.org/issues')) {
  els = window.document.getElementsByClassName('js-repo-nav')

  if (els){
    buttonListEl = els[0];
    aEl = document.createElement('a');
    aEl.addEventListener('click', function(){
      var iframe = document.createElement('iframe');
      iframe.src = chrome.runtime.getURL('frame.html');
      iframe.style.cssText = 'background-color:pink; position:fixed;top:0;left:0;display:block;' +
                             'width:300px;height:100%;z-index:1000;';
      buttonListEl.appendChild(iframe);
    })
    aEl.text = 'Kanban';
    aEl.href = '#test';
    aEl.classList = ['js-selected-navigation-item reponav-item']
    buttonListEl.appendChild(aEl)


  }
}
