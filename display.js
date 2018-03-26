function displayAllTodoLists() {
	displayList('all', 'All');
	displayList('project', 'All');
	createCategoryMenu('project', 'All');
	displayList('context', 'All');
	createCategoryMenu('context', 'All');
	displayList('priority', 'All');
	createCategoryMenu('priority', 'All');
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
	
	if( category !== 'all' ) {
		// let thisTodoList = sortByCategory( category );
		// console.log(thisTodoList);
	}

	const listContainer = document.getElementById(category + '-pane').firstElementChild;
	// console.log(listContainer);
	listContainer.innerHTML = '';
	// if which is 'All'
	let currentCategory = '';

	let projectList = todoList.reduce(function ( projects, task ) {
		if( !( task.project in projects) ) projects[task.project] = [];
		projects[task.project].push(task);
		return projects;
	}, []);
	console.log(projectList);
} // end displayList

	// 1. create ul - top level
// 2. create li - to hold individual project list
// 3. create ul - begin list
// 4. create li per todo list item
// 5. create closing ul tag
// 6. close li tag
// 7. repeat from 2 for each category

