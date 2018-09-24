function getFile() {
	// insert file input element
	// https://www.richardkotze.com/top-tips/how-to-open-file-dialogue-just-using-javascript
	const fileSelector = document.createElement('input');
	fileSelector.setAttribute('type', 'file');

	const selectDialogue = document.createElement('dialog');
	selectDialogue.id = 'fileChoose';

	const selectDialogueText = document.createElement('p');
	selectDialogueText.textContent = 'There is no todo.txt loaded. Please click below to load the todo.txt file.';

	const selectDialogueLink = document.createElement('a');
	selectDialogueLink.setAttribute('href', '');
	selectDialogueLink.innerText = "Select File";

	selectDialogueLink.onclick = function () {
			 fileSelector.click();
			 selectDialogue.style.display = 'none';
			 return false;
	}
	
	selectDialogue.appendChild(selectDialogueText);
	selectDialogue.appendChild(selectDialogueLink);

	// ask user to choose todo.txt on local hd
	document.body.appendChild(selectDialogue);

	fileSelector.addEventListener( 'change', function() {
		const file = this.files[0];
		const reader = new FileReader();
		const lines = [];

		reader.onload = function(e) {
	// read file
			const text = e.target.result;
			lines.push(...text.split('\n'));
	// parse text
			parse(lines);
	// insert into indexedDB
			getAll().then( function(list) {
				// todoList.push(...list);
				// insert into DOM - render()
				renderTodoList();
			});
		}
		reader.readAsText(file);

	}, false );

}

function saveFile() {

// http://jsfiddle.net/UselessCode/qm5AG/
// http://jsfiddle.net/k56eezxp/

let textFile = null;
  makeTextFile = function (text) {
    var data = new Blob([text], {type: 'text/plain'});

    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (textFile !== null) {
      window.URL.revokeObjectURL(textFile);
    }

    textFile = window.URL.createObjectURL(data);

    return textFile;
  };

	function save( todoList ) {
		let todotxt = '';
		todoList.forEach( task => {
			let todoItem = '';
			if( task.completed ) todoItem += 'x ';
			if( task.priority ) todoItem += '(' + task.priority + ') ';
			if( task.completedDate ) todoItem += task.completedDate + ' ';
			if( task.createdDate ) todoItem += task.createdDate + ' ';
			if( task.description ) todoItem += task.description + ' ';
			if( task.project ) todoItem += '+' + task.project + ' ';
			if( task.context ) todoItem += '@' + task.context + ' ';
			if( task.tags ) {
				for ( const prop in task.tags ) {
					todoItem += ' ' + prop + ':' + task.tags[prop] + ' ';
				}
			}
			todotxt += todoItem + '\n';
		});
		// todotxt = document.getElementById('editor').innerText;

    var link = document.createElement('a');
    link.setAttribute('download', 'todo.txt');
    link.href = makeTextFile(todotxt);
    document.body.appendChild(link);

    // wait for the link to be added to the document
    window.requestAnimationFrame(function () {
      var event = new MouseEvent('click');
      link.dispatchEvent(event);
      document.body.removeChild(link);
		});
	}

	getAll().then( list => save(list) );
}

countItems().then( function( cnt ) { 
	if(cnt) {
	// we don't need to load todo.txt
		getAll().then( function(list) {
			todoList.push(...list);
			// insert into DOM - render()
			renderTodoList();
		});
	} else {
		getFile(todoFile);
	}
	// read todoList from indexedDB
});

function sortTodoList() {
	
}
// choose local todo.txt file
const fileSelector = document.createElement('input');
fileSelector.setAttribute('type', 'file');

const selectDialogueLink = document.createElement('a');
selectDialogueLink.setAttribute('href', '');
selectDialogueLink.innerText = "Select File";

selectDialogueLink.onclick = function () {
     fileSelector.click();
     return false;
}
// document.body.appendChild(selectDialogueLink);
     fileSelector.click(); // must be fired by user

document.getElementById('downloadbutton').addEventListener('click', saveFile);

