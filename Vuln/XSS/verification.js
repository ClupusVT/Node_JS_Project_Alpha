function escapeHTML(data) {
    return data.replace(/[<>'"]/g, function(c){
        return '&#' + c.charCodeAt(0) + ';';
    })
}
function verifyInput() {
    // Get the user input
    const userInput = document.getElementById('userInput').value;

    // Simple verification example (you can replace this with your own verification logic)
    if (userInput.trim() === '') {
        displayVerificationResult('Input cannot be empty.', 'red');
    } else {
        displayVerificationResult(`Input: ${userInput}`, 'green');
    }
}

function displayVerificationResult(message, color) {
    const resultContainer = document.getElementById('verificationResult');
    resultContainer.innerText = message;
    resultContainer.style.color = color;
}

function verifysecondInput() {
    // Get the user input
    const userInput = document.getElementById('userInputsecond').value;
    const userInputImageLink = document.getElementById('imagelink').value;

    // Simple verification example (you can replace this with your own verification logic)
    if (userInput.trim() === '') {
        displayVerificationResult('Input cannot be empty.', 'red');
    } else {
        displayVerificationResult2(`Input: ${userInput}`, 'blue', userInputImageLink);
    }   
}

function displayVerificationResult2(message, color, imagelink) {
    // const resultContainer1 = document.getElementById('verificationResult2');
    // resultContainer1.innerText = message;
    // resultContainer1.style.color = color;
    ////////////////////////////////////////////
    const comment = {
        avatar: imagelink,
        body: message
    };
    ////resultContainer -> avatarParagraph (avatarImgHTML(defaultAvatar)) 
    const resultContainer = document.getElementById('verificationResult3');

        // Check if 'comment' is defined
        if (comment) {
            
            // Create an avatar paragraph
            let avatarParagraph = document.createElement("p");

            // Set up the default avatar image (fallback if no avatar is provided)
            let defaultAvatar = window.defaultAvatar || { avatar: 'avatarDefault.svg' };
            let avatarImgHTML = `<img class="avatar" src="${escapeHTML(comment.avatar || defaultAvatar.avatar)}">`;
            //resultContainer.innerText = avatarImgHTML; //this will consider the input as plain text so I will remove this item 
            let divImgContainer = document.createElement("div");
            divImgContainer.innerHTML = avatarImgHTML;

            // // Append the div with the avatar image to the avatar paragraph then append to the result container
            avatarParagraph.appendChild(divImgContainer);///this wil load the image form specific source
            resultContainer.appendChild(avatarParagraph)

           
            if (comment.body) {
                let commentBodyParagraph = document.createElement("p");
                commentBodyParagraph.innerHTML = comment.body;
                resultContainer.appendChild(commentBodyParagraph);
            }

            
        } else {
            // Handle the case where 'comment' is not defined
            console.error("Comment is not defined");
        }
}

function escapeHTMLencoded(str) {
    return str.replace(/[&<>"']/g, function (match) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      }[match];
    });
  }
  

function verifythirdInput() {
    // Get the user input
    const userInput_3 = document.getElementById('userInputthird').value;
    const resultContainer4 = document.getElementById('verificationResult4');
    // Simple verification example (you can replace this with your own verification logic)
    if (userInput_3.trim() === '') {
        displayVerificationResult('Input cannot be empty.', 'yellow');
    } else {        
        //let userInput_3 = "abcd";
        let commentBodyParagraph4 = document.createElement("p");
        commentBodyParagraph4.innerHTML = escapeHTMLencoded(userInput_3);
        resultContainer4.appendChild(commentBodyParagraph4);
    }   
}
  

function verify_4thinput() {
    // Get the user input
    const userInput = document.getElementById('userInput_4th').value;
    const resultContainer = document.getElementById('verificationResult_4th');
    let commentBodyParagraph = document.createElement("a");
    commentBodyParagraph.innerHTML = userInput;
    resultContainer.appendChild(commentBodyParagraph);
}