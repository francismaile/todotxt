function displayAllTodoLists() {
	displayList('all', 'All');
	const projects = displayList('project', 'All');
	const contexts = displayList('context', 'All');
	const priorities = displayList('priority', 'All');
	createMenu('project', projects);
	createMenu('context', contexts);
	createMenu('priority', priorities);
}

function createTodoItem( task ) {
	listItem = document.createElement('li');
	listItem.id = 'task_' + task.id;
	listItem.textContent = task.description;
	listItem.className = 'task-item';
	listItem.addEventListener( 'click', function( event ) {
		const taskid = event.target.id.split('_')[1];
		editTask(taskid);
	});
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
	let listItem;

	if( category === 'all' ) {
		todoList.forEach( function( todo ) {
			listContainer.appendChild( createTodoItem(todo) );
		});
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
				thisTodoList[taskCat].forEach( function( todo ) {
					listBlock.appendChild(createTodoItem(todo));
					categoryHeader.appendChild(listBlock);
				});
				listContainer.appendChild(categoryHeader);
			}
		});
		return categoryList; 
	}
} // end displayList

