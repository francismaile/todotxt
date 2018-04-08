	const todoListNodes = document.createElement('ul');

document.getElementById('task-list').addEventListener( 'click', function( event ) {
	console.log(event.target);
});
	
function renderTodoList(category = 'all') {
	const taskListDiv = document.getElementById('task-list');
	const activeTodos = document.createElement('ul');
	const completedTodos = document.createElement('ul');
	let i = 0;
	todoList.forEach( function( todo ) {
		todoListNodes.appendChild( createTodoItem(todo, category) );
	});

	todoNodes = [...todoListNodes.childNodes];

	switch( category ) {
		case 'project':
			break;
		default:
			todoListNodes.childNodes.forEach( function( todoNode ) {
				if(todoNode.classList.contains('task-completed') ) {
					completedTodos.appendChild(todoNode.cloneNode(true));
				} else {
					activeTodos.appendChild(todoNode.cloneNode(true));
				}
			});
			taskListDiv.appendChild(activeTodos);
			taskListDiv.appendChild(completedTodos);
	}
}

function displayAllTodoLists() {
	displayList('all', 'All');
	const projects = displayList('project', 'All');
	const contexts = displayList('context', 'All');
	const priorities = displayList('priority', 'All');
	createMenu('project', projects);
	createMenu('context', contexts);
	createMenu('priority', priorities);
}

function createTodoItem( task, category ) {
	const listItem = document.createElement('li');
	listItem.className = 'task-item';
	listItem.id = category + '_task_' + task.id;
	if( task.completed ) {
		listItem.classList.add( 'task-completed' );
	}

	const checkbox = document.createElement('input');
	checkbox.type = 'checkbox';
	checkbox.id = 'task_complete_' + task.id;
	checkbox.className = "css-checkbox";
	if( task.completed ) {
		checkbox.checked = true;
	}

	const label = document.createElement('label');
	label.htmlFor = 'task_complete_' + task.id;
	label.className = 'css-label';

	listItem.appendChild(checkbox);
	listItem.appendChild(label);

	const div_description = document.createElement('div');
	div_description.id = 'task_' + task.id;
	div_description.className = 'task-description';
	div_description.textContent = task.description;

	listItem.appendChild(div_description);

	const div_meta = document.createElement('div');

	const span_priority = document.createElement('span');
	span_priority.className = 'task-meta task-meta-priority';
	if( task.priority && category !== 'priority' ) {
		span_priority.textContent = `(${ task.priority })`;
	}
	div_meta.appendChild( span_priority );

	let span_category;
	if( task.context && category !== 'context' ) {
		span_category = document.createElement('span');
		span_category.className = 'task-meta';
		span_category.textContent = `@${ task.context }`;
		div_meta.appendChild( span_category );
	}

	if( task.project && category !== 'project' ) {
		span_category = document.createElement('span');
		span_category.className = 'task-meta';
		span_category.textContent = `+${ task.project }`;
		div_meta.appendChild( span_category );
	}

	div_description.addEventListener( 'click', function( event ) {
		const taskid = event.target.id.split('_')[2];
		editTask(taskid);
	});

	checkbox.addEventListener( 'click', function( event ) {
		const taskid = event.target.id.split('_')[2];
		toggleTaskComplete(taskid);
	});


	listItem.appendChild(div_meta);

	return listItem;
}

function createMenuItem( category, item ) {
	menuItem = document.createElement('li');
	menuItem.textContent = item;
	menuItem.className = 'menu-item';
	menuItem.onclick = function() { 
		displayList(category, this.textContent);
	};
	return menuItem;
}

function createDatalistItem( item ) {
	dataItem = document.createElement('option');
	dataItem.textContent = item;
	return dataItem;
}

function createMenu( category, itemList ) {
	// insert items into sidebar nav menu
	const categoryMenu = document.getElementById(category + '-menu');
	categoryMenu.innerHTML = '';
	categoryMenu.appendChild(createMenuItem(category, 'All') );

	itemList.forEach( item => 
		categoryMenu.appendChild(createMenuItem(category, item) ) );
	// insert items in task edit form datalist
	if( category === 'project' || category === 'context' ) {
		formDataList = document.getElementById(category + 's');
		formDataList.innerHTML = '';
		itemList.pop();
		itemList.forEach( item => 
			formDataList.appendChild(createDatalistItem(item) ) );
	}
}


function displayList(category = 'all', which = 'All') {
	// console.log('called with:', category, which);
	let thisTodoList = [];
	let categoryList = [];

	const listContainer = document.getElementById(category + '-pane').firstElementChild;
	listContainer.innerHTML = '';
	let completedList = [];
	let listItem;

	if( category === 'all' ) {
		todoList.forEach( function( todo ) {
			if( todo.completed ) {
				completedList.push( todo );
			} else {
				listContainer.appendChild( createTodoItem(todo, category) );
			}
		});
		completedList.forEach( todo => listContainer.appendChild(createTodoItem(todo, category)) );
	} else {

		thisTodoList = todoList.reduce(function ( taskList, task ) {
			if( !( task[category] in taskList) ) taskList[task[category]] = [];
			taskList[task[category]].push(task);
			return taskList;
		}, []);

		catList = Object.keys(thisTodoList);
		catList.push(catList.splice(catList.indexOf('undefined'), 1)[0]);
		if( category === 'priority' ) catList.sort();


		catList.forEach( function (taskCat, ind, arr) {
			let categoryTitleText = '';
			if(taskCat=== 'undefined' ) {
				if( category === 'project' || category === 'context' )
					categoryTitleText = 'No ' + category;
				else if(category === 'priority')
					categoryTitleText = 'Not prioritized';
			} else {
				categoryTitleText = taskCat;
			}
			categoryList.push(categoryTitleText);
			if(  which === 'All' || which === taskCat || which === categoryTitleText) {
				let categoryHeader = document.createElement('li');
				categoryHeader.className = 'category-header';
				let categoryTitle = document.createElement('h3');
				categoryTitle.textContent = categoryTitleText;
				categoryHeader.appendChild(categoryTitle);
				let listBlock = document.createElement('ul');
				listBlock.id = category + '-' + taskCat.toLowerCase();
				let listItem;
				let taskCount = 0;
				thisTodoList[taskCat].forEach( function( todo ) {
					if( todo.completed ) {
						completedList.push( todo );
					} else {
						listBlock.appendChild(createTodoItem(todo, category));
						categoryHeader.appendChild(listBlock);
						taskCount++;
					}
				});
				if( taskCount ) {
					listContainer.appendChild(categoryHeader);
				}
			}
		});
		completedList.forEach( todo => listContainer.appendChild(createTodoItem(todo, category)) );
		return categoryList; 
	}
} // end displayList

