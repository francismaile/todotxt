const todoFile = "todo.txt";
const lines = [];
let todoList = [];
getFile(todoFile);

function getFile(filePath) {
	fetch(todoFile)
		.then(response => response.text())
		.then(text => {
			lines.push(...text.split('\n') );
			parse(lines);
			displayAllTodoLists();
		});
}

function parse(todo) {
	 const lines = todo;
	 let taskid = 0;
	 lines.forEach(function(line) {
		 let result;
		 let regex = new RegExp();
		 if( line !== '' ) {
			 let task = {};
			 // task.id = ++id; // should id start at 1?
			 // use index of todoList array instead of assigning an id
			 line = line.trim();
			 line = line.replace(/^x\s+/, function(match) {

				 task.completed = !!match; // !! converts result.match to boolean
				 return '';
			 });
			 // determine if marked with a priority. currently limited to one of A, B , or C
			 line = line.replace(/\([A-C]\)\s+/, match => {
				 task.priority = match[1];
				 return '';
			 });
			 // creation and/or completion date
			 line = line.replace(/^\d{4}-\d{1,2}-\d{1,2}\s+/, match => {
				 task.createdDate = match.trim();
				 return '';
			 });
			 line = line.replace(/^\d{4}-\d{1,2}-\d{1,2}\s+/, match => {
				 task.completeDate = task.createdDate;
				 task.createdDate = match.trim();
				 return '';
			 });
			 // get todo item's context
			 line = line.replace(/\@\w+/i, match => {
				 task.context = match.slice(1);
				 return '';
			 });
			 // get todo item's project connection
			 line = line.replace(/\+\w+/i, match => {
				 task.project = match.slice(1);
				 return '';
			 });
			 // get all custom tags
			 const regex = /\w+:\d{4}-\d{1,2}-\d{1,2}|\w+:\w+/i;
			 let resultArr = [];
			 // task.tags = {};
			 while( (resultArr = regex.exec(line)) != null ) {
				 if( !task.hasOwnProperty('tags') ) task.tags = {};
				 [key, value] = resultArr[0].split(':');
				 task.tags[key] = value;
				 line = line.replace(resultArr[0],'');
			 }
			 if( task.tags !== undefined ) {
			 }
			 task.description = line.trim();
			 task.id = taskid++;
			 todoList.push(task);
		} // end if
	});
}
