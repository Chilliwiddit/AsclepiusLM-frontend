const input = document.getElementById('inputText');
const outputDisplay = document.querySelector('.outputText p');
const historyPanel = document.getElementById('historyPanel');
const toggleHistory = document.getElementById('toggleHistory');
const historyBar = document.querySelector('.historyBar');
const latencyText = document.querySelector('.stats p');


// async function query(data) {
// 	const response = await fetch(
// 		"",
// 		{
// 			headers: {
//                 "Accept" : "application/json",
//                 "Authorization": "Bearer",
//                 "Content-Type": "application/json"
//             },
// 			method: "POST",
// 			body: JSON.stringify(data),
// 		}
// 	);
// 	return await response.json();
// }


async function query(data) {
    const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
    });
    
    return await response.json();
}


let history = new Map();
renderHistoryBar();

function addToHistory(input, response) {
    let timestamp = new Date().toLocaleString();

    history.set(timestamp, [input, response]);

    while (history.size > 10) {
        let oldestKey = history.keys().next().value;
        history.delete(oldestKey);
    }
}

function renderHistoryBar() {
    historyBar.innerHTML = '';
    if (history.size === 0) {
        historyBar.innerHTML = '<p class="bellota-text-bold">NO HISTORY YET</p>';
    } else {
        for (let [timestamp, [input, response]] of history) {
            let pairDiv = document.createElement('div');
            pairDiv.className = 'pair';
            pairDiv.innerHTML = `
                <div class="request">
                    <p class="bellota-text-regular">${input}</p>
                </div>
                <div class="response"> 
                    <p class="bellota-text-regular">${response}</p>
                </div>
                <div class="misc">
                    <p class="bellota-text-light">${timestamp}</p>
                    <span class="material-symbols-outlined">
                        content_copy
                    </span>
                </div>
            `;
            historyBar.appendChild(pairDiv);
        }
    }
}


let prompt = "Below is an instruction that describes a task, paired with an input that provides further context. Write a response that appropriately completes the request.\n\n### Instruction:\nYou are an expert medical professional. Summarize the radiology report findings into an impression with minimal text\n\n### Input:\n{}\n\n### Response:"


input.addEventListener('keydown', async function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault(); 
        
        let text = input.value.trim();
        if (text !== "") {

            text = text.replace(/\n/g, ' ').replace(/\r/g, '');
            input.value = "";
            latencyText.innerText = "";
        
            let finalPrompt = prompt.replace("{}", text);

            let requestData = {
                inputs: finalPrompt,
            };

            console.log("generating text")

            let message = "Please wait..."

            outputDisplay.innerText = message;

            try {
                let startTime = performance.now();
                let data = await query(requestData)
                let endTime = performance.now();
                let latency = Math.round((endTime - startTime) * 10) / 10;
                outputDisplay.innerText = data[0].generated_text;
                latencyText.innerText = `Latency: ${latency} ms`;
                addToHistory(text, data[0].generated_text);
                renderHistoryBar();
            } catch (error) {
                console.error("Error fetching response:", error);
                const errorMessage = "An error occurred, please try again";
                outputDisplay.innerText = errorMessage;
            }

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
    
    popup.style.left = `${x - 140}px`; 
    popup.style.top = `${y - 20}px`;  
    
    document.body.appendChild(popup);
    
    setTimeout(() => {
        popup.remove();
    }, 1200);
}

toggleHistory.addEventListener('click', () => {
    historyPanel.classList.toggle('open');
});

historyBar.addEventListener('click', function(e) {
    if (e.target.classList.contains('material-symbols-outlined')) {
        
        const pair = e.target.closest('.pair');
        const responseText = pair.querySelector('.response p').innerText;

        if (responseText.trim().length > 0) {
            navigator.clipboard.writeText(responseText).then(() => {
                showPopup(e.pageX, e.pageY);
            });
        }
    }
});