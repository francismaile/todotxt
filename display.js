function displayAllTodoLists() {
	displayList('all', 'All');
	displayList('project', 'All');
	createCategoryMenu('project', 'All');
	displayList('context', 'All');
	createCategoryMenu('context', 'All');
	displayList('priority', 'All');
	createCategoryMenu('priority', 'All');
}

function createTodoItem( task ) {
	// console.log(arguments);
	listItem = document.createElement('li');
	listItem.id = 'task_' + task.id;
	listItem.textContent = task.description;
	listItem.className = 'task-item';
	return listItem;
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
	// category = all, project, context or priority
	let thisTodoList = [];

	const listContainer = document.getElementById(category + '-pane').firstElementChild;
	listContainer.innerHTML = '';
	let listItem;

	if( category === 'all' ) {
		thisTodoList = Array.from(todoList);
		thisTodoList.forEach( function( todo ) {
			listContainer.appendChild( createTodoItem(todo) );
		});
	} else {
		thisTodoList = todoList.reduce(function ( taskList, task ) {
			if( !( task[category] in taskList) ) taskList[task[category]] = [];
			taskList[task[category]].push(task);
			return taskList;
		}, []);

// display just one project/context/priority
// undefined category needs to be pulled out until last and labeled:
	// No Project/Context, Not Prioritized
// priority needs to be sorted by priority letter

		Object.keys(thisTodoList).forEach( function ( element ) {
			let categoryHeader = document.createElement('li');
			categoryHeader.className = 'category-header';
			let categoryTitle = document.createElement('h3');
			categoryTitle.textContent = element;
			categoryHeader.appendChild(categoryTitle);
			let listBlock = document.createElement('ul');
			listBlock.id = category + '-' + element.toLowerCase();
			let listItem;
			thisTodoList[element].forEach( function( todo ) {
				listBlock.appendChild(createTodoItem(todo));
				categoryHeader.appendChild(listBlock);
			});
			listContainer.appendChild(categoryHeader);
		});
	}

} // end displayList

