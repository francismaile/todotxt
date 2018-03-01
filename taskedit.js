const taskEditForm = document.getElementById('taskEdit');

function editTask(taskIndex) {
	// console.log(task );
	const task = todoList[taskIndex];
	taskEditForm.reset();
	taskEditForm.description.value = task.description;
	taskEditForm.taskid.value = taskIndex;
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
		// console.log(task.tags);
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
				tagContent = tagContent + '\n' + key + ': ' + task.tags[key];
				numberOfTags++;
			}
		}
		taskEditForm.tags.rows = numberOfTags;
		taskEditForm.tags.value = tagContent.trim();
		// console.log(tagContent.trim());
	} else {
		taskEditForm.tags.rows = 1;
		taskEditForm.tags.value = '';
	}
}

 taskEditForm.addEventListener('submit', event => event.preventDefault());
 taskEditForm.onsubmit=function() {
	/* do what you want with the form */
	task = taskEditForm.taskid.value;
	todoList[task].completed = taskEditForm.completed.checked || taskEditForm.completeDate.value !== '';
	todoList[task].description = taskEditForm.description.value;	
	todoList[task].priority = taskEditForm.priority.value;	
	todoList[task].project = taskEditForm.project.value;
	todoList[task].context = taskEditForm.context.value;
	todoList[task].createdDate = taskEditForm.created.value;

	// this part does not work
	todoList[task].tags = {};
	todoList[task].tags['due'] = taskEditForm.due.value;
	todoList[task].completeDate = taskEditForm.completeDate.value;

	const tags = taskEditForm.tags.value.split('\n');
	tags.forEach( tag => {
		[key, value] = tag.split(':');
		todoList[task].tags[key] = value;
	});

	console.log('current task:', todoList[task]);

	return false;
}

/*

id: 2
priority: "A"
context: "Phone"
project: "Family"
description: "Call Mom"
tags: {
	due: "2018-02-17"
	about: "picnic"
	weather: "rain"
}

0:input#taskid
2:input#description
4:select#priority
5:input#project
7:input#context
9:input#created
10:input#due
11:input#completed
12:textarea#tags

completed:input#completed
context:input#context
created:input#created
creationDate:input#created
description:input#description
due:input#due
priority:select#priority
project:input#project
tags:textarea#tags
taskid:input#taskid


*/
