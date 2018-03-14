function displayAllTodoLists() {
	displayList('all', 'all');
	displayList('project', 'all');
	createCategoryMenu('project', 'all');
	displayList('context', 'all');
	createCategoryMenu('context', 'all');
	displayList('priority', 'all');
	createCategoryMenu('priority', 'all');
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

function addMenuItem(category, currentCategory, menuElem) {
	li = document.createElement('li');
	li.className = '';
	li.textContent =  currentCategory || 'Not Assigned';
	li.onclick = function() { 
		displayList(category, this.textContent);
	};
	menuElem.appendChild(li);
}

function createCategoryMenu( category ) {
	let currentCategory = '';
	const menuElem = document.getElementById(category + '-menu');
	addMenuItem(category, 'All', menuElem );
	for(var i=0; i < todoList.length; i++) {
		if( category !== 'all' && currentCategory !== todoList[i][category] ) {
			currentCategory = todoList[i][category];
			addMenuItem(category, currentCategory, menuElem );
		}
	} // end for loop
}

function displayList(category = 'all', which = 'all') {
		console.log('called with:', category, 'and', which);
	if( category === 'project' ) {
		console.log(todoList[0]);
	}
	if( category !== 'all' ) {
		let thisTodoList = sortByCategory( todoList, category );
	}
	const listContainer = document.getElementById(category + '-pane').firstElementChild;
	listContainer.innerHTML = '';
	// if which is 'all'
	let currentCategory = '';

	// insert item to list all of category. call; displayList(category, 'all');
	for(var i=0; i < todoList.length; i++) {
		if( category !== 'all' && which === 'all' && currentCategory !== todoList[i][category] ) {
			currentCategory = todoList[i][category];
			insertDivider( currentCategory, listContainer );
		}
		displayTodoItem( i, todoList[i], listContainer );
	} // end for loop
} // end displayList

