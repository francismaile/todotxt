
document.getElementById('task-list').addEventListener( 'click', function( event ) {
	console.log(event.target);
});

function sectionHeading(headingText) {
	let li = document.createElement('li');
	li.textContent = headingText;
	li.className = 'category-heading';
	return li;
}

function renderTodoList(category = 'all') {
	const taskListDiv = document.getElementById('task-list');
	const todoListNodes = document.createElement('ul');
	todoList.forEach( function( todo ) {
		todoListNodes.appendChild( createTodoItem(todo, category) );
	});

	let completedTodos = document.createElement('ul');
	switch( category ) {
		case 'project':
			taskListDiv.innerHTML = '';
			const projectList = [];
			const noProjectTodos = document.createElement('ul');
			noProjectTodos.appendChild(sectionHeading('No Project'));

			completedTodos = document.createElement('ul');
			completedTodos.appendChild(sectionHeading('Completed Todos'));

			todoListNodes.childNodes.forEach( function( todoNode ) {
				if(todoNode.classList.contains('task-completed') ) {
					completedTodos.appendChild(todoNode.cloneNode(true));
				} else {
					if( todoNode.dataset.project) {
						if( ! Object.keys(projectList).includes(todoNode.dataset.project) ) {
							projectList[todoNode.dataset.project] = document.createElement('ul');
							projectList[todoNode.dataset.project].appendChild(sectionHeading(todoNode.dataset.project));
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
			const noContextTodos = document.createElement('ul');
			noContextTodos.appendChild(sectionHeading('No Context'));

			completedTodos = document.createElement('ul');
			completedTodos.appendChild(sectionHeading('Completed Todos'));

			todoListNodes.childNodes.forEach( function( todoNode ) {
				if(todoNode.classList.contains('task-completed') ) {
					completedTodos.appendChild(todoNode.cloneNode(true));
				} else {
					if( todoNode.dataset.context) {
						if( ! Object.keys(contextList).includes(todoNode.dataset.context) ) {
							contextList[todoNode.dataset.context] = document.createElement('ul');
							contextList[todoNode.dataset.context].appendChild(sectionHeading(todoNode.dataset.context));
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
			const noPriorityTodos = document.createElement('ul');
			noPriorityTodos.appendChild(sectionHeading('No Priority'));

			completedTodos = document.createElement('ul');
			completedTodos.appendChild(sectionHeading('Completed Todos'));

			todoListNodes.childNodes.forEach( function( todoNode ) {
				if(todoNode.classList.contains('task-completed') ) {
					completedTodos.appendChild(todoNode.cloneNode(true));
				} else {
					if( todoNode.dataset.priority) {
						if( ! Object.keys(priorityList).includes(todoNode.dataset.priority) ) {
							priorityList[todoNode.dataset.priority] = document.createElement('ul');
							priorityList[todoNode.dataset.priority].appendChild(sectionHeading(todoNode.dataset.priority));
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
			completedTodos = document.createElement('ul');
			completedTodos.appendChild(sectionHeading('Completed Todos'));
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
	const prioritys = displayList('priority', 'All');
	const priorities = displayList('priority', 'All');
	createMenu('project', projects);
	createMenu('priority', prioritys);
	createMenu('priority', priorities);
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
	div_description.className = 'task-description';
	div_description.textContent = task.description;

	listItem.appendChild(div_description);

	const div_meta = document.createElement('div');
	div_meta.className = 'task-meta';

	const span_priority = document.createElement('span');
	span_priority.className = 'task-meta-priority';
	if( task.priority && category !== 'priority' ) {
		span_priority.textContent = `(${ task.priority })`;
	}
	div_meta.appendChild( span_priority );

	let span_category;
	if( task.context && category !== 'context' ) {
		span_category = document.createElement('span');
		span_category.className = 'task-meta-context';
		span_category.textContent = `@${ task.context }`;
		div_meta.appendChild( span_category );
	}

	if( task.project && category !== 'project' ) {
		span_category = document.createElement('span');
		span_category.className = 'task-meta-project';
		span_category.textContent = `+${ task.project }`;
		div_meta.appendChild( span_category );
	}

	// div_description.addEventListener( 'click', function( event ) {
	// 	const taskid = event.target.id.split('_')[2];
	// 	editTask(taskid);
	// });

	// checkbox.addEventListener( 'click', function( event ) {
	// 	const taskid = event.target.id.split('_')[2];
	// 	toggleTaskComplete(taskid);
	// });


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
	if( category === 'project' || category === 'priority' ) {
		formDataList = document.getElementById(category + 's');
		formDataList.innerHTML = '';
		itemList.pop();
		itemList.forEach( item => 
			formDataList.appendChild(createDatalistItem(item) ) );
	}
}


function displayList(category = 'all', which = 'All') {
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
				if( category === 'project' || category === 'priority' )
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

