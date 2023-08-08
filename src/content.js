var isOpen = false;

$(document).ready(() => {
  // EMBED extension into webpage using shadow root
  $.get(chrome.runtime.getURL('/content.html'), (data) => {
    const container = document.createElement('div');
    container.setAttribute('id', 'extension-companion-mv3')
    const shadowRoot = container.attachShadow({ mode: 'open' });
    container.appendChild(shadowRoot)
    shadowRoot.innerHTML = data
    document.body.appendChild(container);
    // close button
    const closeButton = shadowRoot.querySelector('#extension-app #extension-close img')
    closeButton.setAttribute("src", chrome.runtime.getURL("assets/close.svg"))
    // style
    const styleElem = document.createElement('style')
    const styleLinkEl = document.createElement("link");
    styleLinkEl.setAttribute("rel", "stylesheet");
    styleLinkEl.setAttribute("href", chrome.runtime.getURL('/content.css'));
    styleElem.appendChild(styleLinkEl)
    shadowRoot.appendChild(styleElem);
    // end EMBED extension

    // METHOD - open/close extension
    function openExtension(open) {
      if (open) {
        $('body').css({ overflow: 'hidden' })
        isOpen = true;
        shadowRoot.querySelector('#extension-app').setAttribute('open', 'true')
      } else {
        $('body').css({ overflow: 'auto' })
        isOpen = false;
        shadowRoot.querySelector('#extension-app').removeAttribute('open')
      }
    }

    // close extension when overlay is clicked
    const overlay = shadowRoot.querySelector('#extension-app > #extension-overlay')
    overlay.addEventListener('click', function () {
      openExtension(false)
    })

    // close extension when x is clicked
    closeButton.addEventListener('click', function () {
      openExtension(false)
    })

    // listen on message to open/close extension
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.request == "open-extension") {
        if (isOpen) {
          openExtension(false);
        } else {
          openExtension(true);
        }
      } else if (message.request == "close-extension") {
        openExtension(false);
      }
    });

    // close extension on esc btn
    document.onkeyup = (e) => {
      if (e.key == "Escape" && isOpen) {
        chrome.runtime.sendMessage({ request: "close-extension" })
      }
    }
  });
});

