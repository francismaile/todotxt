function displayAllTodoLists() {
	displayList('all', 'All');
	displayList('project', 'All');
	createCategoryMenu('project', 'All');
	displayList('context', 'All');
	createCategoryMenu('context', 'All');
	displayList('priority', 'All');
	createCategoryMenu('priority', 'All');
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

function displayTodoItem( task, listContainer ) {
	// console.log(arguments);
	let li = document.createElement('li');
	li.id = 'task_' + task.id;
	li.textContent = task.description;
	li.addEventListener('click', function(event) {
		taskid = event.target.id.split('_')[1];
		editTask(taskid); // in taskedit.js
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
	menuElem.innerHTML = '';
	addMenuItem(category, 'All', menuElem );
	for(var i=0; i < todoList.length; i++) {
		if( category !== 'All' && currentCategory !== todoList[i][category] ) {
			currentCategory = todoList[i][category];
			addMenuItem(category, currentCategory, menuElem );
		}
	} // end for loop
}

function displayList(category = 'all', which = 'All') {
	if( category !== 'all' ) {
		let thisTodoList = sortByCategory( todoList, category );
		// console.log(thisTodoList);
	}
	const listContainer = document.getElementById(category + '-pane').firstElementChild;
	listContainer.innerHTML = '';
	// if which is 'All'
	let currentCategory = '';

	// insert item to list All of category. call; displayList(category, 'all');
	for(var i=0; i < todoList.length; i++) {
		if( which === 'All' ) {
			if( category !== 'all' && currentCategory !== todoList[i][category] ) {
				currentCategory = todoList[i][category];
				insertDivider( currentCategory, listContainer );
			}
			displayTodoItem( todoList[i], listContainer );
		} else if( which === 'Not Assigned' ) {
			if( !todoList[i][category] ) {
				displayTodoItem( todoList[i], listContainer );
			}
		} else {
			if( todoList[i][category] === which ) {
				displayTodoItem( todoList[i], listContainer );
			}
		}
	} // end for loop
} // end displayList

