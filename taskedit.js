const taskEditForm = document.getElementById('task-edit');
// const taskEditWrapper = document.getElementById('form-wrapper');

function toggleTaskComplete(taskid) {
	// get task by id
	const taskIndex = todoList.findIndex( task => task.id === parseInt(taskid) );
	const listItem = document.getElementById('task_' + todoList[taskIndex].id );
	// update completed flag
	if( todoList[taskIndex].completed ) {
		delete todoList[taskIndex].completed;
		delete todoList[taskIndex].completeDate;
		listItem.classList.remove('task-completed');
	} else {
		todoList[taskIndex].completed = true;
		const today = new Date();
		todoList[taskIndex].completeDate = today.toISOString().split('T')[0];
		listItem.classList.add('task-completed');
	}
}

function editTask(taskId) {

	function edit(task = {description: ''}) {
		taskEditForm.description.value = task.description;
		taskEditForm.taskid.value = task.id;
		// task project
		if( task.hasOwnProperty('project') )
			taskEditForm.project.value = task.project;
		else
			taskEditForm.project.value = '';
		// task context
		if( task.hasOwnProperty('context'))
			taskEditForm.context.value = task.context;
		else
			taskEditForm.context.value = '';
		// task priority
		if( task.hasOwnProperty('priority')) {
			for( let i=0; i<=taskEditForm.priority.length; i++ ) {
				if( taskEditForm.priority.options[i].value === task.priority ) {
					taskEditForm.priority.selectedIndex = i;
					break;
				}
			}
		} else {
			taskEditForm.priority.selectedIndex = 0;
		}
		// task created date
		if( task.hasOwnProperty('createdDate')) {
			taskEditForm.created.value = task.createdDate;
		}
		// task completed date
		if( task.hasOwnProperty('completeDate')) {
			taskEditForm.completeDate.value = task.completeDate;
		}
		// deal with tags
		if( task.hasOwnProperty('tags') ) {
			taskEditForm.tags.rows = 1;
			taskEditForm.tags.value = '';
			numberOfTags = task.tags.length;
			if( task.tags.hasOwnProperty('due') ) {
				numberOfTags = numberOfTags - 1;
			}
			let tagContent = '';
			numberOfTags = 0;
			for( const key in task.tags ) {
				if( key === 'due' ) {
					taskEditForm.due.value = task.tags[key];
				} else {
					tagContent = tagContent + '\n' + key + ':' + task.tags[key];
					numberOfTags++;
				}
			}
			taskEditForm.tags.rows = numberOfTags;
			taskEditForm.tags.value = tagContent.trim();
		} else {
			taskEditForm.tags.rows = 1;
			taskEditForm.tags.value = '';
		}
		
		const deleteBtn = document.getElementById('deletebutton');
		// deleteBtn.dataset.taskId = task.id;
		deleteBtn.addEventListener('click', e => {
			// ask the user to confirm delete
			if( confirm('This cannot be undone. Are your sure your want to delete this task?') ) {
				// delete task from indexdb
				deleteItem(task.id);
				taskEditForm.reset();
				renderTodoList(renderCategory, renderWhich);
			}
		});
	}

	// const task = todoList.find( todo => todo.id === parseInt(taskId));
	if(taskId) {
		// taskId = parseInt(taskId, 10);
		getItem(parseInt(taskId, 10)).then( task => edit(task) );
	} else {
		edit();
	}
}

/*
// new task input field handler
newTaskForm.addEventListener('submit', event => event.preventDefault());
newTaskForm.onsubmit=function(e) {
// need to sanitize the input
	if( this.newTask.value ) {
		// save changes to indexedDB
		addItem( newTodoTask(this.newTask.value) );
		this.newTask.value = '';
		// re-render list
		renderTodoList(renderCategory, renderWhich);
	} else {
		editTask();	
	}
	return false;
}
*/

// task edit form handler
taskEditForm.addEventListener('submit', event => event.preventDefault());
taskEditForm.onsubmit=function() {
// need to sanitize the input
	// taskEditForm['task-options'].style.display = 'none';
	taskEditForm['task-options'].style.visibility = 'hidden';

	if(taskEditForm.taskid.value) {
		const task ={};
		task.description = taskEditForm.description.value;

		if(taskEditForm.taskid.value !== 'undefined') {
			task.id = parseInt(taskEditForm.taskid.value); 
		}
		if( taskEditForm.priority.value !== '' ) {
			task.priority = taskEditForm.priority.value;
		} else {
			delete task.priority;
		}
		if( taskEditForm.project.value !== '' ) {
			task.project = taskEditForm.project.value.toCamelCase();
		} else {
			delete task.project;
		}
		if( taskEditForm.context.value !== '' ) {
			task.context = taskEditForm.context.value.toCamelCase();
		} else {
			delete task.context;
		}
		task.createdDate = taskEditForm.created.value;

		if(taskEditForm.due.value !== '' ) {
			task.tags = {};
			task.tags['due'] = taskEditForm.due.value;
		}

		task.completeDate = taskEditForm.completeDate.value;

		if( taskEditForm.tags.value !== '' ) {
			if( !task.hasOwnProperty('tags') ) task.tags = {};
			const tags = taskEditForm.tags.value.split('\n');
			tags.forEach( tag => {
				[key, value] = tag.split(':');
				task.tags[key] = value;
			});
		}
		// console.log(task);
		updateItem(task);
	} else { 
		let newTask = taskEditForm.description.value
		if(taskEditForm.category.value === 'project') {
			if(taskEditForm.whichCategory.value !== 'All' && !taskEditForm.whichCategory.value.startsWith('No') ) {
				newTask += ' +' + taskEditForm.whichCategory.value;
			}
		} else if(taskEditForm.category.value === 'context')  {
			if(taskEditForm.whichCategory.value !== 'All' && !taskEditForm.whichCategory.value.startsWith('No')) {
				newTask += ' @' + taskEditForm.whichCategory.value;
			}
		} else if(taskEditForm.category.value === 'priority')  {
			if(taskEditForm.whichCategory.value !== 'All' && !taskEditForm.whichCategory.value.startsWith('No')) {
				newTask = ' (' +  taskEditForm.whichCategory.value + ') ' + newTask;
			}
		}
		taskEditForm.whichCategory.value
		addItem( newTodoTask(newTask) );
	}

	taskEditForm.reset();
	renderTodoList(renderCategory, renderWhich);

	return false;
};

taskEditForm.onreset = function() { 
	// taskEditForm['task-options'].style.display = 'none';
	taskEditForm['task-options'].style.visibility = 'hidden';
	taskEditForm['taskid'].value='';
}

