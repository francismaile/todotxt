function displayAllTodoLists() {
	// displayList(category, which);
	displayList('all', 'all');
	displayList('project', 'all');
	displayList('context', 'all');
	displayList('priority', 'all');
	// displayList('tag', 'all');

}

function sortByCategory( todoList, category ) {
	return todoList.sort( function( taska, taskb ) {
		if( taska[category] === undefined  ) return 1;
		if( taskb[category] === undefined  ) return -1;
		if( taska[category] < taskb[category] ) return -1;
		if( taska[category] > taskb[category] ) return 1;
		return 0;
	});
}

/*

completed:true
context:"context"
createdDate:"2018-02-09"
description:"item no 1"
priority:"A"
project:"camelCaseTag"
tags:due:"2018-02-13"
key:"value"
*/
function displayTodoItem( taskId, task, listContainer ) {
	let li = document.createElement('li');
	li.id = 'task_' + taskId;
	li.textContent = task.description;
	li.addEventListener('click', function(event) {
		taskid = event.target.id.split('_')[1];
		// editTask(taskid); // in taskedit.js
	});
	listContainer.appendChild(li);
}

function insertDivider(category = 'Not Assigned', listContainer ) {
	let li = document.createElement('li');
	li.className = 'task-category-divider';
	li.textContent = category // || 'Not Assigned';
	listContainer.appendChild(li);
}

function displayList(category = 'all', which = 'all') {
	console.log('called with:', category, 'and', which);
	if( category !== 'all' ) {
		todoList = sortByCategory( todoList, category );
	}
	const listContainer = document.getElementById(category + '-pane').firstElementChild;
	listContainer.innerHTML = '';
	// if which is 'all'
	let currentCategory = '';
	// insert item to list all of category. call; displayList(category, 'all');
	for(var i=0; i < todoList.length; i++) {
		if(i === 0) console.log(todoList[0]);
		if( category !== 'all' && which === 'all' && currentCategory !== todoList[i][category] ) {
			// sort todos by -category-
			// insert divider with name of -category- before listing -category- todos
			// add clickable name of project to nave menu pane
			currentCategory = todoList[i][category];
			insertDivider( currentCategory, listContainer );
			const menuElem = document.getElementById(category + '-menu');
			li = document.createElement('li');
			li.className = '';
			li.textContent =  currentCategory || 'Not Assigned';
			li.onclick = function() { 
				const whichOne = this.textContent;
				displayList('project', whichOne);
			};
			menuElem.appendChild(li);
		}
		// called with: project and Health
		// else which is a specific item in category
		// display only todos in that item category
		displayTodoItem( i, todoList[i], listContainer );
	} // end for loop
} // end displayList

