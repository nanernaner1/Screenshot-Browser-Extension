var scrip = document.createElement('script');
scrip.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
document.head.appendChild(scrip);

let modal = document.createElement('div');
// Assign necessary styles to modal in 'inactive' state
Object.assign(modal.style, {
    display: 'none',
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'white',
    padding: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    zIndex: '1000',
});

// create modal-overlay and set class
let modal_overlay = document.createElement('div');
modal_overlay.classList = 'modal-overlay';

// create modal-preview and set ID
let modal_preview = document.createElement('div');
modal_preview.id = 'modal-preview';

// Create Modal buttons
let screenCap_btn = document.createElement('button');
let closeModal_btn = document.createElement('button');

// Append Modal UI to base modal (modal_preview and buttons)
modal.appendChild(modal_preview);
modal.appendChild(screenCap_btn);
modal.appendChild(closeModal_btn);

// Assign margin styles to both buttons
modal.querySelectorAll('button').forEach((el) => {
    Object.assign(el.style, {
        marginTop: '10px'
    });
});

// Append Overlays to body
document.body.appendChild(modal_overlay);
document.body.appendChild(modal);

function findColorStyle(element) {
    if (!element) return null;
    // const font_color = element.style.color;
    const bg_color = element.style.backgroundColor;
    // TODO: need to change logic to include a check for both BGcolor and font_color
    if bg_color !== ''; {
	return bg_color;
    }
    return findColorStyle(element.parentElement);
}

function getElementPath(element) {
    let path = [];
    while (element) {
    let tagName = element.tagName.toLowerCase();
        if (element.id) {
            tagName += `#${element.id}`;
            path.unshift(tagName);
            break; // IDs are unique, no need to go further
        } else {
            let siblingIndex = Array.from(element.parentNode?.children || []).indexOf(element) + 1;
            tagName += `:nth-child(${siblingIndex})`;
        }
        path.unshift(tagName);
        element = element.parentElement;
    }
    return path.join(' > ');
}
                                                                                                        

// EventListener for ''PREVIEW'' of ScreenCap
document.addEventListener('dblclick', function(event) {
const element = event.target; // The clicked element
    const path = getElementPath(element);
    var target = path;
    
    let bgColor = findColorStyle(element);
	element.style.color = "white";
	element.style.backgroundColor = "black";

      html2canvas(element, {scale: '2', backgroundColor: null}).then(canvas => {
          modal_preview.appendChild(canvas);
          modal.style.display = 'block';
          modal_overlay.style.display = 'block';
          
          // EventListener for ''SAVING'' ScreenCap
          screenCap_btn.addEventListener('click', function() {
            let link = document.createElement('a');
            link.download = 'screencap.png';
            link.href = canvas.toDataURL();
            link.click();
        });
	  // EventListener for ''CLOSING'' Modal and removing canvas appendage
          closeModal_btn.addEventListener('click', function() {
              modal.style.display = 'none';
              modal_overlay.style.display = 'none';
              canvas.remove();
          });
      });
});
