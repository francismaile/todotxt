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

function renderTodoList(category = 'all') {
	const taskListDiv = document.getElementById('task-list');
	const todoListNodes = document.createElement('ul');
	todoList.forEach( function( todo ) {
		todoListNodes.appendChild( createTodoItem(todo, category) );
		// set up menu and select datalist

	});

	let completedTodos = document.createElement('ul');
	switch( category ) {
		case 'project':
			taskListDiv.innerHTML = '';
			const projectList = [];
			const noProjectTodos = newSection('No Project');

			completedTodos = newSection('Completed Todos');

			todoListNodes.childNodes.forEach( function( todoNode ) {
				if(todoNode.classList.contains('task-completed') ) {
					completedTodos.appendChild(todoNode.cloneNode(true));
				} else {
					if( todoNode.dataset.project) {
						if( ! Object.keys(projectList).includes(todoNode.dataset.project) ) {
							projectList[todoNode.dataset.project] = newSection(todoNode.dataset.project);
						}
						projectList[todoNode.dataset.project].appendChild(todoNode.cloneNode(true));
					} else {
						noProjectTodos.appendChild(todoNode.cloneNode(true));
					}
				}
			});
			Object.keys(projectList).forEach( function(projectTask) {
				taskListDiv.appendChild(projectList[projectTask]);
			 });
			taskListDiv.appendChild(noProjectTodos);
			taskListDiv.appendChild(completedTodos);
			break;
		case 'context':
			taskListDiv.innerHTML = '';
			const contextList = [];
			noContextTodos = newSection('No Context');

			completedTodos = newSection('Completed Todos');

			todoListNodes.childNodes.forEach( function( todoNode ) {
				if(todoNode.classList.contains('task-completed') ) {
					completedTodos.appendChild(todoNode.cloneNode(true));
				} else {
					if( todoNode.dataset.context) {
						if( ! Object.keys(contextList).includes(todoNode.dataset.context) ) {
							contextList[todoNode.dataset.context] = newSection(todoNode.dataset.context);
						}
						contextList[todoNode.dataset.context].appendChild(todoNode.cloneNode(true));
					} else {
						noContextTodos.appendChild(todoNode.cloneNode(true));
					}
				}
			});
			Object.keys(contextList).forEach( function(contextTask) {
				taskListDiv.appendChild(contextList[contextTask]);
			 });
			taskListDiv.appendChild(noContextTodos);
			taskListDiv.appendChild(completedTodos);
			break;
		case 'priority':
			taskListDiv.innerHTML = '';
			const priorityList = [];
			noPriorityTodos = newSection('No Priority');

			completedTodos = newSection('Completed Todos');

			todoListNodes.childNodes.forEach( function( todoNode ) {
				if(todoNode.classList.contains('task-completed') ) {
					completedTodos.appendChild(todoNode.cloneNode(true));
				} else {
					if( todoNode.dataset.priority) {
						if( ! Object.keys(priorityList).includes(todoNode.dataset.priority) ) {
							priorityList[todoNode.dataset.priority] = newSection(todoNode.dataset.priority);
						}
						priorityList[todoNode.dataset.priority].appendChild(todoNode.cloneNode(true));
					} else {
						noPriorityTodos.appendChild(todoNode.cloneNode(true));
					}
				}
			});
			let priorities = Object.keys(priorityList);
			priorities.sort();
			priorities.forEach( function(priorityTask) {
				taskListDiv.appendChild(priorityList[priorityTask]);
			 });
			taskListDiv.appendChild(noPriorityTodos);
			taskListDiv.appendChild(completedTodos);
			break;
		default:
			taskListDiv.innerHTML = '';
			const activeTodos = document.createElement('ul');
			completedTodos = newSection('Completed Todos');
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
	dataItem = document.createElement('option');
	dataItem.textContent = item;
	return dataItem;
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

function createMenu( category, itemList ) {
	// insert items into sidebar nav menu
	const categoryMenu = document.getElementById(category + '-menu');
	categoryMenu.innerHTML = '';
	categoryMenu.appendChild(createMenuItem(category, 'All') );

	itemList.forEach( item => 
		categoryMenu.appendChild(createMenuItem(category, item) ) );
	// insert items in task edit form datalist
	if( category === 'project' || category === 'priority' ) {
		formDataList = document.getElementById(category + 's');
		formDataList.innerHTML = '';
		itemList.pop();
		itemList.forEach( item => 
			formDataList.appendChild(createDatalistItem(item) ) );
	}
}


