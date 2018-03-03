function saveTodo() {
// convert todoList to todo.txt format
	// console.log(todoList);
	let todoTxt = '';
	todoList.forEach( function(todo) {
		if( todo.completed ) todoTxt += 'x ';
		if( todo.priority ) todoTxt += '(' + todo.priority + ') ';
		if( todo.completeDate ) todoTxt +=  todo.completeDate + ' ';
		if( todo.createdDate ) todoTxt +=  todo.createdDate + ' ';
		todoTxt +=  todo.description + ' ';
		if( todo.project ) todoTxt +=  '+' + todo.project  + ' ';
		if( todo.context ) todoTxt +=  '@' + todo.context   + ' ';
		// if( todo.tags.due ) todoTxt += 'due:' +  todo.tags.due + ' ';
		if( todo.tags ) {
			if( todo.tags.due ) {
				todoTxt += 'due:' + todo.tags.due;
			}
			for( key in todo.tags ) {
				if( key !== 'due' ) {
					todoTxt += key + ':' + todo.tags[key] + ' ';
				}
			}
		}
		todoTxt += '\n';
	});
	console.log(todoTxt);
// use fetch to post data to php script
// php script saves file to server
}


// var request = new XMLHttpRequest();
// request.open('POST', '/my/url', true);
// request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
// request.send(data);

// Content-Type: text/plain
