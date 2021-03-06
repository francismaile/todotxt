/* eslint-disable indent */

function newSection(headingText = 'unnamed') {
	const section = document.createElement('ul');
	section.id = 'list-' + headingText.toCamelCase(true).toLowerCase();
	let li = document.createElement('li');
	li.textContent = headingText;
	li.className = 'tag-heading';
	section.appendChild(li);
	return section;
}

let renderTag = 'all', renderWhich = '';
// thinking about making this an object
// const render = {	}

function renderTodoList(tag = 'all', which ) {
	renderTag = tag;
	renderWhich = which;
	const taskListDiv = document.getElementById('task-list');
	taskListDiv.innerHTML = '';
	taskEditForm.tag.value = tag;
	taskEditForm.whichTag.value = which;
	if(tag !== 'all') {
		if(which === 'All' || !which || which.startsWith('No ') ) {
			taskEditForm.description.placeholder = 'Add a new todo…';
		} else {
			taskEditForm.description.placeholder = 'Add new todo to ' + tag + ':' + which;
		}
	} else {
		taskEditForm.description.placeholder = 'Add a new todo…';
		
	}

	function insertCompleted(completedTodos) {
		const completedCount = completedTodos.getElementsByTagName("li").length - 1;
		if( completedCount > 0 ) {
			const completeLabel = completedTodos.getElementsByTagName("li").item(0);
			completeLabel.textContent = `${completedCount} ${completeLabel.textContent} To-Do${ completedCount > 1 ? 's' : ''}`;
			completeLabel.addEventListener('click', e => {
				e.target.parentNode.classList.toggle( 'show-completed' );
			});
			taskListDiv.appendChild(completedTodos);
		}
	}

let sortByPriority = false;

function render( todoList ) {
		const completedTodos = newSection('Completed');
		// sort tasks by priority - should this be optional
		if( sortByPriority ) {
			const tagTaskList = ['A','B','C'];
			tagTaskList.map( arr => tagTaskList[arr] = [] );
			todoList.forEach( task => {
				if( !tagTaskList[task.priority] ) tagTaskList[task.priority] = [];
				tagTaskList[task.priority].push(task);
			});
			todoList = [...tagTaskList['A'], ...tagTaskList['B'], ...tagTaskList['C'], ...tagTaskList[undefined]];
		}
		if( tag ==='text' ) {
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
		else if( tag ==='all' ) {
			const thisTodoList = newSection('Todo List');
			const	tagName = '';
			todoList.forEach( task => {
				if( task.completed ) {
					completedTodos.appendChild( createTodoItem(task) );
				} else {
					thisTodoList.appendChild( createTodoItem(task) );
				}
			});
			taskListDiv.appendChild(thisTodoList);
			insertCompleted(completedTodos);
		} else {
			if( which === undefined || which === 'All') {
				const noTagItems = [];
				const thisTodoList = todoList.reduce( function(taskList, task) {
					if(tag === 'priority' && !taskList['A']) {
						taskList['A'] = newSection('A');
						taskList['B'] = newSection('B');
						taskList['C'] = newSection('C');
					}
					// divide up todos by tag name
					if(task.completed) {
						// separate list for completed todos
						completedTodos.appendChild( createTodoItem(task, 'all') );
					} else {
						if( task[tag] === undefined ) {
							noTagItems.push(task);
						} else {
							const tagName = task[tag] ;
							if( ! taskList[tagName] ) {
								taskList[tagName] = newSection(tagName);
							}
							taskList[tagName].appendChild( createTodoItem(task, tag) );
						}
					}
					return taskList;
				}, [] );

				const noTagName = 'No ' + tag.charAt(0).toUpperCase() + tag.slice(1);
				thisTodoList[noTagName] = newSection(noTagName);
				noTagItems.forEach( item => {
					thisTodoList[noTagName].appendChild( createTodoItem(item, tag));
				});
	
				for( let catName in thisTodoList ) {
					taskListDiv.appendChild(thisTodoList[catName]);
				}
				insertCompleted(completedTodos); 
			} else {
				const thisTodoList = newSection(which);
				const tagTaskList = [];
				todoList.forEach( task => {
					if( !tagTaskList[task.priority] ) tagTaskList[task.priority] = [];
					tagTaskList[task.priority].push(task);
				});
				// todoList = [...tagTaskList['A'], ...tagTaskList['B'], ...tagTaskList['C'], ...tagTaskList[undefined]];
				// foreach to get only which from tag
				todoList.forEach( task => {
					if( task[tag] === which || ( which.slice(0,3) === 'No ' && task[tag] === undefined) ) {
						if( task.completed ) {
							completedTodos.appendChild( createTodoItem( task, tag ) );
						} else {
							thisTodoList.appendChild( createTodoItem( task, tag ) );
						}
					}
				});
				if(which) {
					// console.log( thisTodoList.childNodes );
				}
				taskListDiv.appendChild(thisTodoList);
				insertCompleted(completedTodos);
			}
		}
	}

	getAll().then( list => {
		render(list);
		createNavMenu(list, tag, which);
		populateSelectElems(list);
	});

}

function createTodoItem( task, tag ) {
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

	const priority_div = document.createElement('div');
	priority_div.id = `priority_${task.id}`;
	priority_div.className = 'task-meta-priority';
	if( task.priority && tag !== 'priority' ) {
		priority_div.textContent = `${ task.priority }`;
		priority_div.classList.add('priority-color-' + task.priority);
		priority_div.addEventListener('click', e => {
			const tag = e.target.textContent;
			renderTodoList('priority', tag);
			e.stopPropagation()
		}, false);
	}

	const div_description = document.createElement('div');
	div_description.id = `description_${task.id}`;
	div_description.className = 'task-description';

	const descriptionText = document.createTextNode(task.description);
	div_description.appendChild(checkbox);
	div_description.appendChild(label);
	div_description.appendChild( priority_div );
	div_description.appendChild(descriptionText);
	
	listItem.appendChild(div_description);

	const div_meta = document.createElement('div');
	div_meta.className = 'task-meta';

if( tag !== 'project' ) {
	const project_div = document.createElement('div');
	project_div.id = `project_${task.id}`;
	project_div.className = 'task-meta-project';
	if( task.project && tag !== 'project' ) {
		project_div.textContent = `+${ task.project }`;
		project_div.addEventListener('click', e => {
			const tag = e.target.textContent.slice(1);
			renderTodoList('project', tag);
			e.stopPropagation();
		}, false);
	}
	div_meta.appendChild( project_div );
}

	const context_div = document.createElement('div');
	context_div.id = `context_${task.id}`;
	context_div.className = 'task-meta-context';
	if( task.context && tag !== 'context' ) {
		context_div.textContent = `@${ task.context }`;
		context_div.addEventListener('click', e => {
			const tag = e.target.textContent.slice(1);
			renderTodoList('context', e.target.textContent.slice(1));
			e.stopPropagation();
		}, false);
	}
	div_meta.appendChild( context_div );

	// deal with custom tags
	if(task.tags ) {
		const duedate_div = document.createElement('div');
		
		const customtags_div = document.createElement('div');
		customtags_div.className = 'task-meta-custom-tags';
		let tagkey_span, tagvalue_span, customtag_span;
		for( const key in task.tags ) {
				// do other tags stuff
				tagkey_span = document.createElement('span');
				customtag_span = document.createElement('span');
				tagkey_span.className = 'custom-tag-key';
				tagkey_span.textContent = key;
				customtag_span.appendChild(tagkey_span);
				
				tagvalue_span = document.createElement('span');
				tagvalue_span.className = 'custom-tag-value';
				tagvalue_span.textContent = task.tags[key];
				customtag_span.appendChild(tagvalue_span);

			if( key === 'due' ) {
				duedate_div.className = 'task-meta-duedate';
				duedate_div.appendChild(customtag_span);
			} else {
				customtags_div.innerHTML += customtag_span.outerHTML;
			}
		}
	
		div_meta.appendChild( customtags_div );
		if( duedate_div !== null ) {
			div_meta.appendChild( duedate_div );
		}
	}

	listItem.appendChild(div_meta);
	
	listItem.addEventListener("click", function(event) {
		if( event.target.tagName !== 'INPUT' &&  event.target.tagName !== 'LABEL' ) {
			taskEditForm['task-options'].style.display = 'inline';
			taskEditForm['task-options'].style.visibility = 'visible';
			const taskId = event.currentTarget.id.split('_')[1];
			event.stopPropagation();
			editTask(taskId);	
		}
	}, false);

	return listItem;
}

function populateSelectElems( todoList ) {
	function createDatalistItem( item ) {
		let dataItem = document.createElement('option');
		dataItem.textContent = item;
		return dataItem;
	}

	// insert items in task edit form datalist
	let projectDataList = document.getElementById('projects');
	let contextDataList = document.getElementById('contexts');
	const dataListSelect = projectDataList.getElementsByTagName('select');
	// projectDataList.innerHTML = '';
	// contextDataList.innerHTML = '';

	let projects = [];
	let contexts = [];
	todoList.forEach( item => {
		console.log('forEach');
		if(item.project && ! projects.includes(item.project)) {
			console.log('Project');
			projects.push(item.project);
			dataListSelect[0].appendChild(createDatalistItem(item.project) );
		}
		if(item.context && !contexts.includes(item.context)) {
			contexts.push(item.context);
			contextDataList.appendChild(createDatalistItem(item.context) );
		}
	});
}

function createMenuItem( tag, currentTag ) {
	let menuItem = document.createElement('li');
	menuItem.textContent = tag;
	if( tag === currentTag ) {
		menuItem.classList.add('active');
	}
	menuItem.addEventListener('click', e => {
		const tagName = e.target.parentElement.parentElement.dataset.tagName;
		const tag = e.target.textContent;
		renderTodoList(tagName, tag);
		e.stopPropagation()
	}, false);
	return menuItem;
}

function createMenu( tagName, tags, currentTagName, currentTag) {
	const menu = document.createElement('li');
	menu.className = 'tag-name';
	if( tagName === currentTagName ) {
		menu.classList.add('active');
	}
	menu.textContent = tagName[0].toUpperCase() + tagName.substr(1);
	menu.dataset.tagName = tagName;
	menu.addEventListener( 'click', e => {
		renderTodoList(tagName);
	}, false );
	const menuList = document.createElement('ul');
	menuList.className = 'tag-list';
	tags.forEach( tag => {
		if( tag ) {
			menuList.appendChild( createMenuItem(tag, currentTag) );
		}
	});
	if( tags.length > 0 ) {
		menuList.appendChild( createMenuItem('No ' + tagName) );
	}
	menu.appendChild(menuList);
	return menu;
}

function createNavMenu( todoList, currentTagName, currentTag ) {
	// insert items into sidebar nav menu
	const nav = document.getElementsByTagName('nav')[0];
	const navMenu = document.createElement('ul');
	let tags = [];
	tags = todoList.reduce( function( tags, todo ) {
		if( !tags['project'] ) {
			tags['project'] = [];
		}
		if( !tags['project'].includes(todo.project) ) {
			tags['project'].push(todo.project)
		}
		if( !tags['context'] ) {
			tags['context'] = [];
		}
		if( !tags['context'].includes(todo.context) ) {
			tags['context'].push(todo.context)
		}
		
		return tags;
	}, []);
	tags['priority'] = ['A','B','C'];
	
	navMenu.appendChild( createMenu('all', []) );
	const tagNames = Object.keys(tags);
	tagNames.forEach(  tagName => { 
			navMenu.appendChild( createMenu(tagName, tags[tagName], currentTagName, currentTag) );
	});
	navMenu.appendChild( createMenu('text', []) );
	nav.innerHTML = '';
	nav.appendChild(navMenu);
}

document.getElementById('task-list').addEventListener( 'click', function( event ) {
	if(event.target.nodeName === 'INPUT' && event.target.type === 'checkbox') {
		const eventId = event.target.id.split('_');
		const taskId = eventId[eventId.length-1];
		const liElem = event.target.parentNode;
		getItem(parseInt(taskId, 10)).then( function(task) {
			task.completed = !task.completed;
			updateItem(task)
			renderTodoList(renderTag, renderWhich);
		});
	}
});

