/* eslint-disable indent */

function newSection(headingText = 'unnamed') {
	const section = document.createElement('ul');
	section.id = 'list-' + headingText.toCamelCase();
	let li = document.createElement('li');
	li.textContent = headingText;
	li.className = 'category-heading';
	section.appendChild(li);
	return section;
}

let renderCategory = 'all', renderWhich = '';
// thinking about making this an object
const render = {
	}

function renderTodoList(category = 'all', which ) {
	// console.log({category}, {which});
	renderCategory = category;
	renderWhich = which;
	const taskListDiv = document.getElementById('task-list');
	taskListDiv.innerHTML = '';

	function render( todoList ){
		const completedTodos = newSection('Completed');
// console.log(todoList);
		if( category ==='txt' ) {
			// reassemble the todo.txt file format
			const todoTxtEditor = document.createElement('div');
			todoTxtEditor.id = 'editor';
			todoTxtEditor.contentEditable = 'true';
			todoList.forEach( task => {
				let todotxt = '';
				todotxt += task.completed ? 'x' : '';
				todotxt += task.priority ? ' (' + task.priority + ')' : '';
				if( task.completedDate ) todotxt += ' ' + task.completedDate;
				if( task.createdDate ) todotxt += ' ' + task.createdDate;
				if( task.description ) todotxt += ' ' + task.description;
				if( task.project ) todotxt += ' +' + task.project;
				if( task.context ) todotxt += ' @' + task.context;
				if( task.tags ) {
					for ( const prop in task.tags ) {
						todotxt += ' ' + prop + ':' + task.tags[prop];
					}
				}
				const taskDiv = document.createElement('div');
				taskDiv.textContent = todotxt;
				todoTxtEditor.appendChild(taskDiv);
			});
			taskListDiv.appendChild(todoTxtEditor);
		}
		else if( category ==='all' ) {
			const thisTodoList = newSection('Todo List');
			const	categoryName = '';
			todoList.forEach( task => {
				if( task.completed ) {
					completedTodos.appendChild( createTodoItem(task) );
				} else {
					thisTodoList.appendChild( createTodoItem(task) );
				}
			});
			taskListDiv.appendChild(thisTodoList);
			taskListDiv.appendChild(completedTodos);
		} else {
			if( which === undefined || which === 'All') {
				const noCategoryItems = [];
				const thisTodoList = todoList.reduce( function(taskList, task) {
					if(category === 'priority' && !taskList['A']) {
					// this didn't work because it needs to be inside the reduce function
						taskList['A'] = newSection('A');
						taskList['B'] = newSection('B');
						taskList['C'] = newSection('C');
					}
					// divide up todos by category name
					if(task.completed) {
						// separate list for completed todos
						completedTodos.appendChild( createTodoItem(task, 'all') );
					} else {
						if( task[category] === undefined ) {
							noCategoryItems.push(task);
						} else {
							const categoryName = task[category] ;
							if( ! taskList[categoryName] ) {
								taskList[categoryName] = newSection(categoryName);
							}
							taskList[categoryName].appendChild( createTodoItem(task, category) );
						}
					}
					return taskList;
				}, [] );

				const noCategoryName = 'No ' + category.charAt(0).toUpperCase() + category.slice(1);
				thisTodoList[noCategoryName] = newSection(noCategoryName);
				noCategoryItems.forEach( item => {
					thisTodoList[noCategoryName].appendChild( createTodoItem(item, category));
				});
	
				for( let catName in thisTodoList ) {
					taskListDiv.appendChild(thisTodoList[catName]);
				}
				taskListDiv.appendChild(completedTodos);
				createMenu(category,  Object.keys(thisTodoList));
			} else {
				// const categoryName = task[category] !== undefined ? task[category] : 'No ' + category.charAt(0).toUpperCase() + category.slice(1);
				const thisTodoList = newSection(which);
				// foreach to get only which from category
				todoList.forEach( task => {
					if( task[category] === which || ( which.slice(0,2) === 'No' && task[category] === undefined) ) {
						if( task.completed ) {
							completedTodos.appendChild( createTodoItem( task, category ) );
						} else {
							thisTodoList.appendChild( createTodoItem( task, category ) );
						}
					}
				});
				taskListDiv.appendChild(thisTodoList);
				taskListDiv.appendChild(completedTodos);
			}
		}
	}

	getAll().then( list => {
		render(list);
		populateSelectElems(list);
	});

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

function populateSelectElems( todoList ) {
	// insert items in task edit form datalist
	let projectDataList = document.getElementById('projects');
	let contextDataList = document.getElementById('contexts');
	projectDataList.innerHTML = '';
	contextDataList.innerHTML = '';

	let projects = [];
	let contexts = [];
	todoList.forEach( item => {
		if(item.project && !projects.includes(item.project)) {
			projects.push(item.project);
			projectDataList.appendChild(createDatalistItem(item.project) );
		}
		if(item.context && !contexts.includes(item.context)) {
			contexts.push(item.context);
			contextDataList.appendChild(createDatalistItem(item.context) );
		}
	});
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
	// console.log({itemList});
	const categoryMenu = document.getElementById(category + '-menu');
	categoryMenu.innerHTML = '';
	categoryMenu.appendChild(createMenuItem(category, 'All') );

	itemList.forEach( item => {
		categoryMenu.appendChild(createMenuItem(category, item) )
	});
}

document.getElementById('task-list').addEventListener( 'click', function( event ) {
	if(event.target.nodeName === 'INPUT' && event.target.type === 'checkbox') {
		const eventId = event.target.id.split('_');
		const taskId = eventId[eventId.length-1];
		const liElem = event.target.parentNode;
		getItem(parseInt(taskId, 10)).then( function(task) {
			task.completed = !task.completed;
			updateItem(task)
			renderTodoList(renderCategory, renderWhich);
		});
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
