function editTask(task) {
	const taskEditForm = document.getElementById('task-edit-form');
	// console.log(task );
	const formElements = [...taskEditForm];
	taskEditForm.description.value = task.description;
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
		numberOfTags = task.tags.length;
		if( task.tags.hasOwnProperty('due') ) {
			numberOfTags = numberOfTags - 1;
		}
		taskEditForm.tags.rows = numberOfTags;
		for( const key in task.tags ) {
			console.log(key + ': ' + task.tags[key]);
			if( key === 'due' ) {
				taskEditForm.due.value = task.tags[key];
			} else {
				taskEditForm.tags.value = taskEditForm.tags.value + key + ': ' + task.tags[key];
			}
		}
	}
}

function processTaskEdit() {

}

function findPriority() {
	return ; //index of priority in option list
}

function findProjectIndex() {
	return ; //index of project in option list
}

function findContextIndex() {
	return ; //index of context in option list
}

/*

completeDate:Mon Feb 12 2018 16:00:00 GMT-0800 (PST) {}
completed:true
context:"context"
createdDate:Fri Feb 09 2018 16:00:00 GMT-0800 (PST)
description:"item description"
id:1
priority:"A"
project:"camelCaseTag"
tags:{key: "value", due: "2018-02-13"}

*/
// formElements.forEach( element => console.log(element, element.id));
// console.log('description field:', taskEditForm.description);
// console.log('description:', taskEditForm.description.value);
