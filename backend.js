const input = document.getElementById('inputText');
const outputDisplay = document.querySelector('.outputText p');

input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault(); 
        
        const text = input.value.trim();
        if (text !== "") {
            outputDisplay.innerText = text;
            input.value = ""; 
        }
    }
});

outputDisplay.addEventListener('click', function(e) {
    const textToCopy = outputDisplay.innerText.trim();

    if (textToCopy.length > 0) {
        navigator.clipboard.writeText(textToCopy).then(() => {
            showPopup(e.pageX, e.pageY);
        });
    }
});

function showPopup(x, y) {
    const popup = document.createElement('div');
    popup.className = 'copy-popup';
    popup.innerText = 'Copied to clipboard!';
    
    popup.style.left = `${x + 10}px`; 
    popup.style.top = `${y - 20}px`;  
    
    document.body.appendChild(popup);
    
    setTimeout(() => {
        popup.remove();
    }, 1200);
}