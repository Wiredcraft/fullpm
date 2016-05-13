console.log('loaded')
console.log(location.href);

// Append kanban button to page
function appendButtonToNav () {
  // Stop if button exists already
  if (document.getElementById('pmhub')) { return null }

  navElem = document.getElementsByClassName('js-repo-nav')
  if (navElem) {
    buttonListEl = navElem[0];
    aEl = document.createElement('a');
    aEl.addEventListener('click', function(){
      issuesEl = document.getElementsByClassName('repository-content')[0]
      issuesEl.style.display = 'none';

      var containerEl = document.getElementsByClassName('container experiment-repo-nav')[0]

      var iframe = document.createElement('iframe');
      iframe.src = chrome.runtime.getURL('frame.html');
      iframe.style.cssText = 'width:100%;height:100%;border:none';
      //buttonListEl.appendChild(iframe);

      var divEl = document.createElement('div');
      divEl.classList = ['repository-content']
      divEl.appendChild(iframe)

      containerEl.appendChild(divEl)

      var activeLinkEl = document.getElementsByClassName('selected reponav-item')[0]
      activeLinkEl.classList.remove("selected")

      aEl.classList.add('selected')
    })

    aEl.text = 'Kanban';
    aEl.id = 'pmhub';
    aEl.href = '#pmhub';
    aEl.classList = ['js-selected-navigation-item reponav-item']
    buttonListEl.appendChild(aEl)
  }
}

// Background script message listener
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  switch (request.type) {
    case 'complete':
      appendButtonToNav()
      break
    default:
      console.log('Message received:', request, sender)
      break
  }
})

// Append button on load
appendButtonToNav()
