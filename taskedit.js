const taskEditForm = document.getElementById('taskEdit');

function editTask(taskId) {
	const task = todoList.find( todo => todo.id === parseInt(taskId));
	// taskEditForm.reset();
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
		taskEditForm.completed.value = task.completeDate;
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
	taskEditForm['task-options'].style.display = 'inline';
}

// if a completed date is set, the completed flag should be true
// if the completed checkbox is checked, the current date should be set as date of completion
// do I care if there are empty properties? should I?

// process the form
// add new projects to project dropdown
// add new contexts to project dropdown
 taskEditForm.addEventListener('submit', event => event.preventDefault());
taskEditForm.onsubmit=function() {
	this['task-options'].style.display = 'none';
	task = todoList.findIndex( task => task.id === parseInt(taskEditForm.taskid.value) );
	todoList[task].completed = taskEditForm.completed.checked || taskEditForm.completeDate.value !== '';
	todoList[task].description = taskEditForm.description.value;
	// todoList[task].priority = taskEditForm.priority.value;
	if( taskEditForm.priority.value !== '' ) {
		todoList[task].priority = taskEditForm.priority.value;
	} else {
	 	delete todoList[task].priority;
	}
	if( taskEditForm.project.value !== '' ) {
		todoList[task].project = taskEditForm.project.value.toCamelCase();
	} else {
	 	delete todoList[task].project;
	}
	if( taskEditForm.context.value !== '' ) {
		todoList[task].context = taskEditForm.context.value.toCamelCase();
	} else {
	 	delete todoList[task].context;
	}
	todoList[task].createdDate = taskEditForm.created.value;

	if(taskEditForm.due.value !== '' ) {
		todoList[task].tags = {};
		todoList[task].tags['due'] = taskEditForm.due.value;
	}

	todoList[task].completeDate = taskEditForm.completeDate.value;

	if( taskEditForm.tags.value !== '' ) {
		if( !todoList[task].hasOwnProperty('tags') ) todoList[task].tags = {};
		const tags = taskEditForm.tags.value.split('\n');
		tags.forEach( tag => {
			[key, value] = tag.split(':');
			todoList[task].tags[key] = value;
		});
	}

	this.description.value = '';
	displayAllTodoLists();

	return false;
};

taskEditForm.onreset = function() { 
	taskEditForm['task-options'].style.display = 'none';
}

