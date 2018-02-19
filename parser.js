// use replace
// fix blank lines
function parse(theText) {
	let todoList = [];
	let id = 0;
	const lines = theText.split("\n");
	lines.forEach(function(line) {
		let task = {};
		task.id = id++; // should id start at 1?
		let regResult;
		let regex = new RegExp();
		if( line !== '' ) {
			line = line.trim();
			// if task is completed, the line will begin with a "x "
			regex = /x\s/;
			if( result = regex.exec(line) ) {
				line = line.slice(result[0].length);
				task.completed = true;
			}
			// determine if marked with a priority. currently limited one of A, B , or C
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
				task.created = new Date(result[0].trim());
				line = line.slice(result[0].length);
				if( result = regex.exec(line) ) {
					task.completed = task.created;
					task.created = new Date(result[0].trim());
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
			// regex = /\w+:\w+/gi;
			regex = /\w+:\d{4}-\d{1,2}-\d{1,2}|\w+:\w+/gi;
			line.replace( regex, function(match) {
				console.log(match);
			});
			if ( result = line.match(regex) ) {
				let key, value;
				task.tags = {};
				result.forEach(function(tag) {
					[key, value] = tag.split(":");
					task.tags[key] = value;
					line = line.replace(tag,'').trim();
				});
			}
			task.description = line;
			line = "";
		}
		todoList.push(task);
	}); // end lines.forEach
	return todoList;
} // end parse()

// parse();

fetch("todo.txt") // Call the fetch function passing the url of the file
	.then(function(response) {
			console.log("fetching");
			// Your code for handling the data you get from the API
			let parsedList;
			response.text().then( function(text) { 
				parsedList = parse(text);
				console.log(parsedList);
			});
			  		// do something with the text response 
	})
	.catch(function() {
		// This is where you run code if the server returns any errors
		//console.log("something went wrong");
	});


