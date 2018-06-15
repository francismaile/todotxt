// set up database
let dbPromise = (function() {
  'use strict';

  //check for support
  if (!('indexedDB' in window)) {
    console.log('This browser doesn\'t support IndexedDB');
    return;
  }

  const dbPromise = idb.open('todo-db', 1, function(upgradeDb) {
		if(!upgradeDb.objectStoreNames.contains('todoList')) {
			upgradeDb.createObjectStore('todoList', {keyPath: 'id', autoIncrement: true});
		}
	});

	return dbPromise;

})();

// add item to db
function addItem( item ) {
	dbPromise.then( function(db) {
		const tx = db.transaction('todoList', 'readwrite');
		const todoList = tx.objectStore('todoList');
		todoList.add(item);
		return tx.completed;
	}).then(function(result) {
		console.log('added item to todo list', result);
	});
}

function getItem(key) {
	// get and display item
	return dbPromise.then(function(db) {
		const tx = db.transaction('todoList', 'readonly');
		const todoList = tx.objectStore('todoList');
		return todoList.get(key);
	})
}

// update existing item
function updateItem(item) {
	dbPromise.then( function(db) {
		const tx = db.transaction('todoList', 'readwrite');
		const todoList = tx.objectStore('todoList');
		todoList.put(item);
		return tx.complete;
	}).then( function() {
		console.log('item updated');
	});
}

// delete one item
function deleteItem( key ) {
	dbPromise.then( function(db) {
		const tx = db.transaction('todoList', 'readwrite');
		const todoList = tx.objectStore('todoList');
		todoList.delete(key);
		return tx.complete;
	}).then( function() {
		console.log('item deleted');
	});
}

let item = {
	task: 'do something',
	context: 'home',
	project: 'tinyHouse'
};
addItem(item);

item = {
	task: 'do something else',
	context: 'home',
	project: 'cleanUpBasement'
};
addItem(item);

item = {
	id: 1,
	task: 'buy something',
	context: 'lowes',
	project: 'tinyHouse'
};
updateItem(item);

getItem(1).then(function(val) {
		console.log(val);
});

deleteItem(1);

// get and display all items in db
dbPromise.then( function(db) {
	const tx = db.transaction('todoList', 'readonly');
	const todoList = tx.objectStore('todoList');
	return todoList.getAll();
}).then( function(items) {
	console.log('items:', items);
});

getItem(1).then(function(val) {
		console.log(val);
});
