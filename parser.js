function clog(...args) { console.log(...args) }

// fix blank lines
let todoList = [];

function parse(theText) {
	let id = 0;
	const lines = theText.split("\n");
	lines.forEach(function(line) {
		let result;
		let regex = new RegExp();
		if( line !== '' ) {
			let task = {};
			task.id = ++id; // should id start at 1?
			line = line.trim();
			// if task is completed, the line will begin with a "x "
			regex = /x\s+/;
			if( result = regex.exec(line) ) {
				line = line.slice(result[0].length);
				task.completed = true;
			}
			// determine if marked with a priority. currently limited to one of A, B , or C
			regex = /\((A|B|C)\)\s+/;
			if( result = regex.exec(line) ) {
				line = line.slice(result[0].length);
				task.priority = result[1];
			}
			// creation and/or completion date
			regex = /^\d{4}-\d{1,2}-\d{1,2}\s+/;
				// if we find a date, check for another date
				// if second date, first is completion date and this is creation date
				// else date is creation date
			if( result = regex.exec(line) ) {
				task.createdDate = new Date(result[0].trim());
				line = line.slice(result[0].length);
				if( result = regex.exec(line) ) {
					task.completedDate = task.createdDate;
					task.createdDate = new Date(result[0].trim());
					line = line.slice(result[0].length);
				}
			}
			regex = /\@\w+/i;
			if( result = regex.exec(line) ) {
				task.context = result[0].slice(1);
				line = line.replace(regex, '');
			}
			regex = /\+\w+/i;
			if( result = regex.exec(line) ) {
				task.project = result[0].slice(1);
				line = line.replace(regex, '');
			}
			regex = /\w+:\d{4}-\d{1,2}-\d{1,2}|\w+:\w+/gi;
			 if ( result = line.match(regex) ) {
				 let key, value;
				 task.tags = {};
				 result.forEach(function(tag) {
					 [key, value] = tag.split(":");
					 task.tags[key] = value;
					 line = line.replace(tag,'').trim();
				 });
			 }
			task.description = line.trim();
			line = "";
			todoList.push(task);
		}
	}); // end lines.forEach
	// return todoList;
} // end parse()

function getFile(path) {
	return fetch(path)
    .then(function (response) {
      return response.text();
    })
    .then(function (text) {
			return text;
    });
}

getAndParse("todo.txt", parse);

function getAndParse(filePath, parseFctn) {
	// get the file - returns a promise
	const fileData = getFile(filePath);
	// process result of promise
	return fileData.then( data => parseFctn(data) );


}
