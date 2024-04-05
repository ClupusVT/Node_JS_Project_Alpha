// note-taking.js

function expandTextarea() {
    const textarea = document.getElementById('noteTextarea');
    textarea.style.height = 'auto';
    textarea.style.height = (textarea.scrollHeight) + 'px';
  }
  
  function saveNote() {
    const textarea = document.getElementById('noteTextarea');
    const noteContentContainer = document.getElementById('noteContent');
    const noteContent = textarea.value.trim();
  
    if (noteContent) {
      noteContentContainer.textContent = noteContent;
      // You can save the note to a database or perform any other necessary actions.
    } else {
      noteContentContainer.textContent = 'Please enter a note.';
    }
  }
  
  function clearNote() {
    const textarea = document.getElementById('noteTextarea');
    const noteContentContainer = document.getElementById('noteContent');
  
    textarea.value = '';
    noteContentContainer.textContent = '';
  }
  