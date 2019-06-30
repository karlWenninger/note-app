// note constructor
function Note(noteId, noteDate, noteText) {
    this.noteId = noteId;
    this.noteDate = noteDate;
    this.noteText = noteText;
};

// build UI
function makeNoteUI(noteId, noteDate, noteText) {
    // contains toolbar elements
    const toolbar = document.createElement('div');
    toolbar.classList = 'alert alert-primary d-flex justify-content-between';
    toolbar.style.margin = '2em 0 0 0';
    toolbar.style.padding = '.6em .5em .2em .5em';
    toolbar.style.fontFamily = 'monospace';

    const toolbarDate = document.createElement('span');
    toolbarDate.innerText = noteDate;

    const deleteBtn = document.createElement('i');
    deleteBtn.classList = "trash-btn far fa-trash-alt";
    deleteBtn.style.cursor = 'pointer';

    toolbar.appendChild(toolbarDate);
    toolbar.appendChild(deleteBtn);

    // contains note
    const note = document.createElement('div');
    note.classList = 'note-text alert-warning'
    note.style.padding = '.5em';
    note.setAttribute('contenteditable', 'true');
    note.id = noteId;
    note.innerText = noteText;

    // contains toolbar elements and note
    const noteContainer = document.createElement('div');
    noteContainer.appendChild(toolbar);
    noteContainer.appendChild(note);

    // prependNode: build new noteContainer at top of list
    const prependNode = document.querySelector('#prepend-node');
    prependNode.prepend(noteContainer);
};

const defaultText = 'click to enter note, click off to save';

// click, create id and date, new Note constr, push to noteArr, localStorage
const makeNoteBtn = document.querySelector('#make-note-btn');
makeNoteBtn.addEventListener('click', (e) => {
    const noteId = Date.now();
    const noteDate = Date().slice(0, Date().indexOf('GMT') - 4);

    let note = new Note(noteId, noteDate, defaultText);

    makeNoteUI(note.noteId, note.noteDate, note.noteText);

    noteArr.push(note);

    localStorage.setItem('noteArr', JSON.stringify(noteArr))
});

// click allNotesContainer, return target activeNote
const allNotesContainer = document.querySelector('#all-notes-container');
allNotesContainer.addEventListener('click', (e) => {
    let activeNote;
    if (e.target.classList.contains('note-text')) {
        activeNote = e.target;
        // activeNote.style.margin = '.5em 0 0 0';
        if (activeNote.innerText == defaultText) {
            activeNote.innerText = '';
            // activeNote.style.fontStyle = 'normal'
        };
        // blur, activeNote.innerText update noteArr, to localStorage
        activeNote.addEventListener('blur', () => {
            if (activeNote.innerText == '') {
                activeNote.innerText = defaultText;
                // activeNote.margin = '0';
                return;

            };
            for (let i of noteArr) {
                if (i.noteId == activeNote.id) {
                    i.noteText = activeNote.innerText;
                    localStorage.setItem('noteArr', JSON.stringify(noteArr))
                };
            };
        });
        // target trashNoteBtn, remove from UI, noteArr, localStorage
    } else if (e.target.classList.contains('trash-btn')) {
        const trashNote = e.target.parentElement.nextElementSibling;

        trashNote.parentElement.remove();

        for (let i in noteArr) {
            if (trashNote.id == noteArr[i].noteId) {
                noteArr.splice(i, 1);
            };
        };
        localStorage.setItem('noteArr', JSON.stringify(noteArr));
    };
});

// load from localStorage
let noteArr;
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('noteArr') == null) {
        noteArr = [];
    } else {
        noteArr = JSON.parse(localStorage.getItem('noteArr'));
        for (let i of noteArr) {
            makeNoteUI(i.noteId, i.noteDate, i.noteText)
        };
    };
    return noteArr;
});