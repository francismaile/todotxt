/*

on startup
	check if todo list is in localstorage
		yes: load from localstorage
		no: load file

	load todoList from localStorage to todoList
	display todoList in DOM

*/


countItems().then( function( cnt ) { 
	if(cnt) {
	// we don't need to load todo.txt
	} else {
		getFile(todoFile);
	// ask user to choose todo.txt on local hd
	// read file
	// parse text
	// insert into indexedDB
	}
	// read todoList from indexedDB
	// insert into DOM - render()
});

