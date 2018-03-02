const todoFile = "todo.txt";
const lines = [];
const todoList = [];
getFile(todoFile);

function getFile(filePath) {
	fetch(todoFile)
		.then(response => response.text())
		.then(text => {
			lines.push(...text.split('\n') );
			parse(lines);
			displayList(todoList); 
		});
}

function displayList(todos) {
	// const taskListElem = document.getElementById('task-list');
	const activeTodoList = document.getElementById('active-todos');
	activeTodoList.addEventListener('click', function(event) {
		// console.log(event.target.id.split('_')[1]);
		taskid = event.target.id.split('_')[1];
		editTask(taskid); // in taskedit.js
	});
	const completedTodoList = document.getElementById('completed-todos');
	completedTodoList.addEventListener('click', function(event) {
		// console.log(event.target.id.split('_')[1]);
		editTask(event.target.id.split('_')[1]); // in taskedit.js
	});
	let  span = document.createElement('span');
	for(var i=0; i < todos.length; i++) {
		let li = document.createElement('li');
		li.id = 'task_' + i;
 		li.textContent = todos[i].description;
		let div = document.createElement('div');
		if( todos[i].tags !== undefined && todos[i].tags['due'] !== undefined ) {
			if( todos[i].tags['due'] !== undefined ) {
				let span = document.createElement('span');
				span.textContent = todos[i].tags['due'];
				span.className = 'task-due';
				div.appendChild(span);
			}
		}
		if( todos[i].priority !== undefined ) {
			let span = document.createElement('span');
			span.textContent = "Priority: " + todos[i].priority;
			span.className = 'task-priority';
			div.appendChild(span);
		}
		li.appendChild(div);
		let spanPriority = document.createElement('span');
		if( todos[i].completed ) {
			completedTodoList.appendChild(li);
		} else {
			activeTodoList.appendChild(li);
		}
	} // end for loop
} // end displayList

function parse(todo) {
	 // let id = 0;
	 const lines = todo;
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
			 todoList.push(task);
		} // end if 
	});
			 console.log(todoList);
}
