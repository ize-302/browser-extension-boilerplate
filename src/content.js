var isOpen = false;

// embed extension into webpage using shadow root
$(document).ready(() => {
  $.get(chrome.runtime.getURL('/content.html'), (data) => {
    const container = document.createElement('div');
    container.setAttribute('id', 'extension-companion-mv3')
    const shadowRoot = container.attachShadow({ mode: 'open' });
    container.appendChild(shadowRoot)
    shadowRoot.innerHTML = data
    document.body.appendChild(container);
    // style
    const styleElem = document.createElement('style')
    const styleLinkEl = document.createElement("link");
    styleLinkEl.setAttribute("rel", "stylesheet");
    styleLinkEl.setAttribute("href", chrome.runtime.getURL('/content.css'));
    styleElem.appendChild(styleLinkEl)
    shadowRoot.appendChild(styleElem);
  });
});

function openExtension() {
  const shadowElem = document.querySelector('#extension-companion-mv3').shadowRoot
  $('body').css({ overflow: 'hidden' })
  isOpen = true;
  shadowElem.querySelector('#extension-app').setAttribute('open', 'true')
}

function closeExtension() {
  const shadowElem = document.querySelector('#extension-companion-mv3').shadowRoot
  $('body').css({ overflow: 'auto' })
  isOpen = false;
  shadowElem.querySelector('#extension-app').removeAttribute('open')
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.request == "open-extension") {
    if (isOpen) {
      closeExtension();
    } else {
      openExtension();
    }
  } else if (message.request == "close-extension") {
    closeExtension();
  }
});

// close extension on esc btn
document.onkeyup = (e) => {
  if (e.key == "Escape" && isOpen) {
    chrome.runtime.sendMessage({ request: "close-extension" })
  }
}
