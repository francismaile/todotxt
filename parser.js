const todoFile = 'todo.txt';

const lines = [];
const todoList = [];
// refactor to handle line by line
// parse a line (todo task) and return task object

function parse( todoTxt ) {
	// parse the lines of the file and build the todoList
	const lines = todoTxt;
	let newTask;
	lines.forEach(function(line) {
		if(line !== '' ) {
			newTask = newTodoTask(line);
			// todoList.push( newTask );
			addItem(newTask); // indexedDB
		}
	});
}

function newTodoTask(todoTaskTxt) {
	let regex = new RegExp();
	let task = {};
	todoTaskTxt = todoTaskTxt.trim();
	todoTaskTxt = todoTaskTxt.replace(/^x\s+/, function(match) {
		task.completed = !!match; // !! converts result.match to boolean
		return '';
	});
	// determine if marked with a priority. currently limited to one of A, B , or C
	todoTaskTxt = todoTaskTxt.replace(/\([A-C]\)\s+/, match => {
		task.priority = match[1];
		return '';
	});
	// creation and/or completion date
	todoTaskTxt = todoTaskTxt.replace(/^\d{4}-\d{1,2}-\d{1,2}\s+/, match => {
		task.createdDate = match.trim();
		return '';
	});
	todoTaskTxt = todoTaskTxt.replace(/^\d{4}-\d{1,2}-\d{1,2}\s+/, match => {
		task.completeDate = task.createdDate;
		task.createdDate = match.trim();
		return '';
	});
	// get todo item's context
	todoTaskTxt = todoTaskTxt.replace(/@\w+/i, match => {
		task.context = match.slice(1);
		return '';
	});
	// get todo item's project connection
	todoTaskTxt = todoTaskTxt.replace(/\+\w+/i, match => {
		task.project = match.slice(1);
		return '';
	});
	// get all custom tags
	regex = /\w+:\d{4}-\d{1,2}-\d{1,2}|\w+:\w+/i;
	let resultArr = [];
	// task.tags = {};
	while( (resultArr = regex.exec(todoTaskTxt)) != null ) {
		if( !task.hasOwnProperty('tags') ) task.tags = {};
		let key, value;
		[key, value] = resultArr[0].split(':');
		task.tags[key] = value;
		todoTaskTxt = todoTaskTxt.replace(resultArr[0],'');
	}
	task.description = todoTaskTxt.trim();
	return task;
}


