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
		document.getElementById(event.target.id.split('-')[0]).click();
	}
	document.getElementById('all-menu').addEventListener('click', onAllMenuClick, false);
	var el = document.getElementById('nav-tab');
	// document.getElementById('nav-tab')
	el.addEventListener('click', onTabClick, false);
})();

/*
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
*/
