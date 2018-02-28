// get and parse the todo file
// populate the metadata and todo list divs
// make the metadata clickable
// make the list items clickable for editing











// start date - set with php
const startDateControl = document.getElementById("start_date");
const theDate = new Date;
const today =  theDate.getFullYear() + "-" +( 1 + theDate.getMonth() ).toString().padStart(2, "0") + "-" +  theDate.getDate();
// startDateControl.value = today;
startDateControl.min = today;

startDateControl.addEventListener("input", function(e){
	const value = new Date(e.target.value);
	const minimum = new Date(e.target.min);
	if( value < minimum ) {
		e.target.value = e.target.min;
		alert("A task cannot begin before today.");
	}
});

// due date  - set with php
const dueDateControl = document.getElementById("due_date");
dueDateControl.value = startDateControl.value; 
dueDateControl.min = startDateControl.value;

// completed  date - set with php
const completedDateControl = document.getElementById("completed_date");
completedDateControl.value = startDateControl.value; 
completedDateControl.min = startDateControl.value;

