/* eslint-disable indent */

function newSection(headingText = 'main') {
	const section = document.createElement('ul');
	section.id = 'list-' + headingText.toCamelCase();
	let li = document.createElement('li');
	li.textContent = headingText;
	li.className = 'category-heading';
	section.appendChild(li);
	return section;
}
/*
document.getElementById('show-it').addEventListener("click", function() {
	editForm.style.display = 'inline';
}, false);

*/

function renderTodoList(category = 'all', which ) {
	const taskListDiv = document.getElementById('task-list');
	taskListDiv.innerHTML = '';

	let completedTodos = document.createElement('ul');
	let projectTodos, contextTodos, priorityTodos, activeTodos, priorities;
	let projectName = '', contextName = '', priorityName = '';
	switch( category ) {
		case 'project':

			completedTodos = newSection('Completed Todos');

			projectTodos = todoList.reduce( function( arr, todo ) {
				projectName = todo.project !== undefined ? todo.project : 'No Project';
				if( ! arr[projectName] ) {
					arr[projectName] = newSection(todo.project || 'No Project');
				}
				if( todo.completed ) {
					if( which === undefined || which === 'All' ) {
						completedTodos.appendChild( createTodoItem(todo, 'project') );
					} else if( which === projectName ) {
						completedTodos.appendChild( createTodoItem(todo, 'project') );
					}
				} else {
					arr[projectName].appendChild( createTodoItem(todo, 'project') );
				}
				return arr;
			}, [] );

			if( which === undefined || which === 'All' ) {
				for( let project in projectTodos ) {
					taskListDiv.appendChild(projectTodos[project]);
				}
			} else {
				taskListDiv.appendChild(projectTodos[which]);
			}
			if(completedTodos.childNodes.length > 1) taskListDiv.appendChild(completedTodos);

			createMenu('project',  Object.keys(projectTodos));

			break;
		case 'context':

			completedTodos = newSection('Completed Todos');

			contextTodos = todoList.reduce( function( arr, todo ) {
				contextName = todo.context !== undefined ? todo.context : 'No Context';
				if( ! arr[contextName] ) {
					arr[contextName] = newSection(todo.context || 'No Context');
				}
				if( todo.completed ) {
					if( which === undefined || which === 'All' ) {
						completedTodos.appendChild( createTodoItem(todo, 'context') );
					} else if( which === contextName ) {
						completedTodos.appendChild( createTodoItem(todo, 'context') );
					}
				} else {
					arr[contextName].appendChild( createTodoItem(todo, 'context') );
				}
				return arr;
			}, [] );

			if( which === undefined || which === 'All' ) {
				for( let context in contextTodos ) {
					taskListDiv.appendChild(contextTodos[context]);
				}
			} else {
				taskListDiv.appendChild(contextTodos[which]);
			}
			if(completedTodos.childNodes.length > 1) taskListDiv.appendChild(completedTodos);

			createMenu('context',  Object.keys(contextTodos));

			break;
		case 'priority':
			completedTodos = newSection('Completed Todos');

			priorityTodos = todoList.reduce( function( arr, todo ) {
			priorityName = todo.priority !== undefined ? todo.priority : 'No Priority';
				if( ! arr[priorityName] ) {
					arr[priorityName] = newSection(todo.priority || 'No Priority');
				}
				if( todo.completed ) {
					if( which === undefined || which === 'All' ) {
						completedTodos.appendChild( createTodoItem(todo, 'priority') );
					} else if( which === priorityName ) {
						completedTodos.appendChild( createTodoItem(todo, 'priority') );
					}
				} else {
					arr[priorityName].appendChild( createTodoItem(todo, 'priority') );
				}
				return arr;
			}, [] );

			priorities = Object.keys(priorityTodos).sort();

			if( which === undefined || which === 'All' ) {
				priorities.forEach( priority => {
					taskListDiv.appendChild(priorityTodos[priority]);
				});
			} else {
				taskListDiv.appendChild(priorityTodos[which]);
			}
			if(completedTodos.childNodes.length > 1) taskListDiv.appendChild(completedTodos);

			createMenu('priority',  priorities);

			break;
		default:
			activeTodos = newSection();
			completedTodos = newSection('Completed Todos');
			todoList.forEach( function( todo ) {
				if(todo.completed) {
					completedTodos.appendChild( createTodoItem( todo, 'all' ) );
				} else {
					activeTodos.appendChild(createTodoItem( todo, 'all' ));
				}
			});
			taskListDiv.appendChild(activeTodos);
			taskListDiv.appendChild(completedTodos);
	}
}

function createTodoItem( task, category ) {
	const listItem = document.createElement('li');
	listItem.className = 'task-item';
	listItem.id = 'task_' + task.id;
	if(task.project) listItem.dataset.project = task.project;
	if(task.context) listItem.dataset.context = task.context;
	if(task.priority) listItem.dataset.priority = task.priority;
	if( task.completed ) {
		listItem.classList.add( 'task-completed' );
	}

	const checkbox = document.createElement('input');
	checkbox.type = 'checkbox';
	checkbox.id = 'task_complete_' + task.id;
	checkbox.className = 'css-checkbox';
	if( task.completed ) {
		checkbox.checked = true;
	}

	const label = document.createElement('label');
	label.htmlFor = 'task_complete_' + task.id;
	label.className = 'css-label';

	listItem.appendChild(checkbox);
	listItem.appendChild(label);

	const div_description = document.createElement('div');
	div_description.id = `description_${task.id}`;
	div_description.className = 'task-description';
	div_description.textContent = task.description;

	div_description.addEventListener("click", function(event) {
		editForm.style.display = 'inline';
		const taskId = event.target.id.split('_')[1];
		editTask(taskId);	
	}, false);

	listItem.appendChild(div_description);

	const div_meta = document.createElement('div');
	div_meta.className = 'task-meta';

	const span_priority = document.createElement('span');
	span_priority.id = `priority_${task.id}`;
	span_priority.className = 'task-meta-priority';
	if( task.priority && category !== 'priority' ) {
		span_priority.textContent = `(${ task.priority })`;
	}
	div_meta.appendChild( span_priority );

	let span_category;
	if( task.context && category !== 'context' ) {
		span_category = document.createElement('span');
		span_category.id = `context_${task.id}`;
		span_category.className = 'task-meta-context';
		span_category.textContent = `@${ task.context }`;
		div_meta.appendChild( span_category );
	}

	if( task.project && category !== 'project' ) {
		span_category = document.createElement('span');
		span_category.id = `project_${task.id}`;
		span_category.className = 'task-meta-project';
		span_category.textContent = `+${ task.project }`;
		div_meta.appendChild( span_category );
	}

	listItem.appendChild(div_meta);
	return listItem;
}

function createDatalistItem( item ) {
	let dataItem = document.createElement('option');
	dataItem.textContent = item;
	return dataItem;
}

function createMenuItem( category, item ) {
	let menuItem = document.createElement('li');
	menuItem.textContent = item;
	menuItem.className = 'menu-item';
	menuItem.onclick = function() {
		renderTodoList(category, this.textContent);
	};
	return menuItem;
}

function createMenu( category, itemList ) {
	// insert items into sidebar nav menu
	const categoryMenu = document.getElementById(category + '-menu');
	categoryMenu.innerHTML = '';
	categoryMenu.appendChild(createMenuItem(category, 'All') );

	itemList.forEach( item =>
		categoryMenu.appendChild(createMenuItem(category, item) ) );
	// insert items in task edit form datalist
	if( category === 'context' || category === 'project' ) {
		let formDataList = document.getElementById(category + 's');
		formDataList.innerHTML = '';
		itemList.pop();
		itemList.forEach( item =>
			formDataList.appendChild(createDatalistItem(item) ) );
	}
}

document.getElementById('task-list').addEventListener( 'click', function( event ) {
	if(event.target.nodeName === 'INPUT' && event.target.type === 'checkbox') {
		const eventId = event.target.id.split('_');
		const taskId = eventId[eventId.length-1];
		const liElem = event.target.parentNode;
		if(todoList[taskId].completed) {
			todoList[taskId].completed = false;
			liElem.classList.remove('task-completed');
			// figure out where it goes
			const currentList = document.getElementsByClassName('tab-pane active')[0].id.split('-')[0];
			document.getElementById('list-completedTodos').appendChild(liElem);
			const myList = document.getElementById('list-' + liElem.dataset[currentList]);
			myList.appendChild(liElem);
		} else {
			todoList[taskId].completed = true;
			liElem.classList.add('task-completed');
			document.getElementById('list-completedTodos').appendChild(liElem);
		}
	}
});

// ***************  tabbed menu  ******************
(function(){
	function onTabClick(event){
		var actives = document.querySelectorAll('.active');
		// deactivate existing active tab and panel
		actives.forEach( activeElem => {
			activeElem.classList.remove('active');
		});

		// activate new tab and panel
		event.target.classList.add('active');
		renderTodoList(event.target.id);
		const activeMenu = event.target.id;
		document.getElementById(activeMenu + '-tab').classList.add('active');
		// document.getElementById(activeMenu + '-pane').classList.add('active');
	}

	function onAllMenuClick(event) {
	// remove this function once we're sure it works	
	}
	
	document.getElementById('all-menu').addEventListener('click', (event) => {
		document.getElementById(event.target.id.split('-')[0]).click();
	}, false);
	var el = document.getElementById('nav-tab');
	// document.getElementById('nav-tab')
	el.addEventListener('click', onTabClick, false);
})();

