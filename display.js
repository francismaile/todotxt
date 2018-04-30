document.getElementById('task-list').addEventListener( 'click', function( event ) {

	console.log(event.target);
	eventId = event.target.id.split('_');
	let taskId = eventId[eventId.length-1];
	let taskPart = eventId[0];
	// go to listing of that part (ex: project: +Novel)
	
	console.log({taskId}, {taskPart});
});

function newSection(headingText) {
	const section = document.createElement('ul');
	let li = document.createElement('li');
	li.textContent = headingText;
	li.className = 'category-heading';
	section.appendChild(li);
	return section;
}

function renderTodoList(category = 'all', which ) {
	const taskListDiv = document.getElementById('task-list');
	taskListDiv.innerHTML = '';
 
	let completedTodos = document.createElement('ul');
	switch( category ) {
		case 'project':
			let noProjectTodos;
			let projectName = '';

			completedTodos = newSection('Completed Todos');

			const projectTodos = todoList.reduce( function( arr, todo ) {
				projectName = todo.project !== undefined ? todo.project : 'No Project';
				if( ! arr[projectName] ) {
					arr[projectName] = newSection(todo.project || 'No Project');
				}
				if( todo.completed ) {
					if( which === undefined || which === "All" ) {
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
				for( project in projectTodos ) {
					taskListDiv.appendChild(projectTodos[project]);;
				}
			} else {
				taskListDiv.appendChild(projectTodos[which]);;
			}
			if(completedTodos.childNodes.length > 1) taskListDiv.appendChild(completedTodos);

			createMenu('project',  Object.keys(projectTodos));

			break;
		case 'context':
			let contextName = '';

			completedTodos = newSection('Completed Todos');

			const contextTodos = todoList.reduce( function( arr, todo ) {
				contextName = todo.context !== undefined ? todo.context : 'No Context';
				if( ! arr[contextName] ) {
					arr[contextName] = newSection(todo.context || 'No Context');
				}
				if( todo.completed ) {
					if( which === undefined || which === "All" ) {
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
				for( context in contextTodos ) {
					taskListDiv.appendChild(contextTodos[context]);;
				}
			} else {
				taskListDiv.appendChild(contextTodos[which]);;
			}
			if(completedTodos.childNodes.length > 1) taskListDiv.appendChild(completedTodos);

			createMenu('context',  Object.keys(contextTodos));

			break;
		case 'priority':
			let priorityName = '';

			completedTodos = newSection('Completed Todos');

			const priorityTodos = todoList.reduce( function( arr, todo ) {
				priorityName = todo.priority !== undefined ? todo.priority : 'No Priority';
				if( ! arr[priorityName] ) {
					arr[priorityName] = newSection(todo.priority || 'No Priority');
				}
				if( todo.completed ) {
					if( which === undefined || which === "All" ) {
						completedTodos.appendChild( createTodoItem(todo, 'priority') );
					} else if( which === priorityName ) {
						completedTodos.appendChild( createTodoItem(todo, 'priority') );
					}
				} else { 
					arr[priorityName].appendChild( createTodoItem(todo, 'priority') );
				}
				return arr;
			}, [] );

			priorityTodos.sort( (a, b)  => {
				console.log('todo:',a, b);
			});
			let priorities = Object.keys(priorityTodos).sort();;

			if( which === undefined || which === 'All' ) {
				priorities.forEach( priority => {
					taskListDiv.appendChild(priorityTodos[priority]);
				});
			} else {
				taskListDiv.appendChild(priorityTodos[which]);;
			}
			if(completedTodos.childNodes.length > 1) taskListDiv.appendChild(completedTodos);

			createMenu('priority',  priorities);

			break;
		default:
			const activeTodos = newSection('');
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
// console.log({task}, {category});
	const listItem = document.createElement('li');
	listItem.className = 'task-item';
	listItem.id = 'task_' + task.id;
	if(task.context) listItem.dataset.context = task.context;
	if(task.context) listItem.dataset.context = task.context;
	if(task.priority) listItem.dataset.priority = task.priority;
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
	div_description.id = `description_${task.id}`;
	div_description.className = 'task-description';
	div_description.textContent = task.description;

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

	if( task.context && category !== 'context' ) {
		span_category = document.createElement('span');
		span_category.id = `context_${task.id}`;
		span_category.className = 'task-meta-context';
		span_category.textContent = `+${ task.context }`;
		div_meta.appendChild( span_category );
	}

	listItem.appendChild(div_meta);
	return listItem;
}

function createDatalistItem( item ) {
	dataItem = document.createElement('option');
	dataItem.textContent = item;
	return dataItem;
}

function createMenuItem( category, item ) {
	menuItem = document.createElement('li');
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
		formDataList = document.getElementById(category + 's');
		formDataList.innerHTML = '';
		itemList.pop();
		itemList.forEach( item => 
			formDataList.appendChild(createDatalistItem(item) ) );
	}
}

