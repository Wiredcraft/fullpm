console.log('loaded')
console.log(location.href);

setTimeout(function(){


if (location.href.startsWith('https://github.com/Wiredcraft/data.worldbank.org/issues')) {
  els = window.document.getElementsByClassName('subnav-links')

  if (els){
    buttonListEl = els[0];
    aEl = document.createElement('a');
    aEl.addEventListener('click', function(){
      alert('Show Kanban')
    })
    aEl.text = 'Kanban';
    aEl.classList = ['js-selected-navigation-item', 'subnav-item']
    buttonListEl.appendChild(aEl)
  }
}

}, 2000)
