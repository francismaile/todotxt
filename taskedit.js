const taskEditForm = document.getElementById('task-edit');

taskEditForm.tags.addEventListener('keydown', function(event) {
	if( event.key === 'Enter' ) {
		taskEditForm.tags.rows += 1;
	} else if( event.key === 'Backspace' && taskEditForm.tags.rows > 1) {
		taskEditForm.tags.rows -= 1;
	}
});

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
			let numberOfTags = 0;
			let tagContent = '';
			for( const key in task.tags ) {
				if( key === 'due' ) {
					taskEditForm.due.value = task.tags['due'];
				} else {
					tagContent = tagContent + '\n' + key + ':' + task.tags[key];
					numberOfTags++;
				}
			}
			taskEditForm.tags.rows = numberOfTags || 1;
			if( tagContent !== '' ) {
				taskEditForm.tags.value = tagContent.trim();
			}
		}
		
		const deleteBtn = document.getElementById('deletebutton');
		// deleteBtn.dataset.taskId = task.id;
		deleteBtn.addEventListener('click', e => {
			// ask the user to confirm delete
			if( confirm('This cannot be undone. Are your sure your want to delete this task?') ) {
				// delete task from indexdb
				deleteItem(task.id);
				taskEditForm.reset();
				renderTodoList(renderTag, renderWhich);
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

// task edit form handler
taskEditForm.addEventListener('submit', event => event.preventDefault());
taskEditForm.onsubmit=function() {
// need to sanitize the input
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
			task.project = taskEditForm.project.value.toCamelCase(false);
		} else {
			delete task.project;
		}
		if( taskEditForm.context.value !== '' ) {
			task.context = taskEditForm.context.value.toCamelCase(false);
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
				if(tag === '') return;
				[key, value] = tag.split(':');
				if( key === '' || value === '') return;
				task.tags[key] = value;
			});
		}
		// console.log(task);
		updateItem(task);
	} else { 
		let newTask = taskEditForm.description.value
		if(taskEditForm.tag.value === 'project') {
			if(taskEditForm.whichTag.value !== 'All' && !taskEditForm.whichTag.value.startsWith('No') ) {
				newTask += ' +' + taskEditForm.whichTag.value;
			}
		} else if(taskEditForm.tag.value === 'context')  {
			if(taskEditForm.whichTag.value !== 'All' && !taskEditForm.whichTag.value.startsWith('No')) {
				newTask += ' @' + taskEditForm.whichTag.value;
			}
		} else if(taskEditForm.tag.value === 'priority')  {
			if(taskEditForm.whichTag.value !== 'All' && !taskEditForm.whichTag.value.startsWith('No')) {
				newTask = ' (' +  taskEditForm.whichTag.value + ') ' + newTask;
			}
		}
		taskEditForm.whichTag.value
		addItem( newTodoTask(newTask) );
	}

	taskEditForm.reset();
	renderTodoList(renderTag, renderWhich);

	return false;
};

taskEditForm.onreset = function() { 
	// taskEditForm['task-options'].style.display = 'none';
	taskEditForm['task-options'].style.visibility = 'hidden';
	taskEditForm['taskid'].value='';
	taskEditForm['tags'].rows = 1;
}

