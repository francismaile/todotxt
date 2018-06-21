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

function renderTodoList(category = 'all', which ) {
	console.log({category}, {which});
	const taskListDiv = document.getElementById('task-list');
	taskListDiv.innerHTML = '';

	function render( todoList ){
		const completedTodos = newSection('Completed');

		if( category ==='all' ) {
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
				const thisTodoList = todoList.reduce( function(taskList, task) {
					// divide up todos by category name
					const categoryName = task[category] !== undefined ? task[category] : 'No ' + category.charAt(0).toUpperCase() + category.slice(1);
					// console.log({categoryName}, {task});
					if( ! taskList[categoryName] ) {
						taskList[categoryName] = newSection(task[category] || 'No Project');
					}
					if(task.completed) {
						// separate list for completed todos
						completedTodos.appendChild( createTodoItem(task, 'all') );
					} else {
						taskList[categoryName].appendChild( createTodoItem(task, category) );
					}
					return taskList;
				}, [] );
	
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

	getAll().then( list => render(list) );

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
		if([taskId].completed) {
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

