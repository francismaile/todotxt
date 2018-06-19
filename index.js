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
		console.log(file);
		const reader = new FileReader();
		const lines = [];

		reader.onload = function(e) {
			console.log(e.target.result);
	// read file
			const text = e.target.result;
			lines.push(...text.split('\n'));
	// parse text
			parse(lines);
	// insert into indexedDB
			getAll().then( function(list) {
				todoList.push(...list);
				// insert into DOM - render()
				console.log('render');
				renderTodoList();
			});
		}
		reader.readAsText(file);

	}, false );

}

countItems().then( function( cnt ) { 
	console.log(cnt);
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

