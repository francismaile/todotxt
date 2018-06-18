/*

on startup
	check if todo list is in localstorage
		yes: load from localstorage
		no: load file

	load todoList from localStorage to todoList
	display todoList in DOM

*/

function getFile() {
// insert file input element
	// https://www.richardkotze.com/top-tips/how-to-open-file-dialogue-just-using-javascript
	const fileSelector = document.createElement('input');
	fileSelector.setAttribute('type', 'file');

	const selectDialogue = document.createElement('div');
	selectDialogue.id = 'fileChoose';

	const selectDialogueText = document.createElement('p');
	selectDialogueText.textContent = 'There is no todo.txt loaded. Please click below to load the todo.txt file.';

	const selectDialogueLink = document.createElement('a');
	selectDialogueLink.setAttribute('href', '');
	selectDialogueLink.innerText = "Select File";

	selectDialogueLink.onclick = function () {
			 fileSelector.click();
			 return false;
	}
	
	selectDialogue.appendChild(selectDialogueText);
	selectDialogue.appendChild(selectDialogueLink);

	document.body.appendChild(selectDialogue);

}

countItems().then( function( cnt ) { 
	console.log(cnt);
	if(cnt) {
	// we don't need to load todo.txt
	} else {
	console.log('get file');
		// getFile(todoFile);
	// ask user to choose todo.txt on local hd
	// read file
	// parse text
	// insert into indexedDB
	}
	// read todoList from indexedDB
	// insert into DOM - render()
});

