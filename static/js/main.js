const ITEM_MAP = new Map();

window.onload = function () {
	paper.install(window);
	var canvas = document.getElementById("canvas");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	paper.setup(canvas);
	drawField();
	window.onresize = function () {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		paper.view.viewSize = new paper.Size(canvas.width, canvas.height);
		project.clear();
	};
};
