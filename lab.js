/* Recreate a math function that exists in Java but not JavaScript. */
Math.nextInt = function (number) {
	return Math.floor(Math.random() * number);
}
Math.nextInt1 = function () {
	randomNumber =Math.floor(Math.random() * 1000) ;

        if (randomNumber < 1) {
            // 20% di probabilità di ottenere 4 o 5
            return Math.floor(Math.random() * 2) + 4;
        } else {
            // 80% di probabilità di ottenere un numero tra 0 e 3
            return Math.floor(Math.random() * 4) ;
        }
	 Math.floor(Math.random() * number);
}
/* Define the bit masks */
var WALL_ABOVE = 1;
var WALL_BELOW = 2;
var WALL_LEFT = 4;
var WALL_RIGHT = 8;
var WALL_FRONT = 16;
var WALL_BACK = 32;
var QUEUED = 64;
var IN_MAZE = 128;

/* Construct a Maze with specified lenx, leny, and cell_width */
function Maze(lenx, leny, lenz, cell_width) {
	if (lenx)
		this.lenx = lenx;
	else
		this.lenx = 30;
	if (leny)
		this.leny = leny;
	else
		this.leny = 30;
	if (lenz)
		this.lenz = lenz;
	else
		this.lenz = 4;
	if (cell_width)
		this.cell_width = cell_width;
	else
		this.cell_width = 10;
	this.maze = [];

	/* The maze generation algorithm. */
	this.createMaze = function()  {
		var lenx = this.lenx;
		var leny = this.leny;
		var lenz = this.lenz;
		var maze = this.maze;
		var x, y, z, x_dx, y_dy, z_dz, n, d;
		var dx = [ 0, 0, -1, 1, 0, 0 ];
		var dy = [ -1, 1, 0, 0, 0, 0 ];
		var dz = [ 0, 0, 0, 0, -1, 1 ];

		var todo = new Array(leny * lenx * lenz);
		var todonum = 0;

		/* We want to create a maze on a grid. */
		/* We start with a grid full of walls. */
		/* Outer edges are blank and simply used to pad the image. */
		for (x = 0; x < lenx; ++x) {
			maze[x] = [];
			for (y = 0; y < leny; ++y) {
				maze[x][y] = [];
				for (z = 0; z < lenz; ++z) {
					maze[x][y][z] = WALL_ABOVE + WALL_BELOW + WALL_LEFT + WALL_RIGHT + WALL_FRONT + WALL_BACK + QUEUED + IN_MAZE;
				}
			}
		}

		/* Select random square of the grid, to start with. */
		x = Math.nextInt(lenx - 1);
		y = Math.nextInt(leny - 1);
		z = Math.nextInt(lenz - 1);

		/* Mark this square as connected to the maze. */
		maze[x][y][z] &= ~(QUEUED + IN_MAZE);

		/* Remember the surrounding squares, as we will... */
		for (d = 0; d < 6; ++d) {
			x_dx = x + dx[d];
			y_dy = y + dy[d];
			z_dz = z + dz[d];
			if (x_dx >= 0 && x_dx < lenx && y_dy >= 0 && y_dy < leny && z_dz >= 0 && z_dz < lenz) {
				if ((maze[x_dx][y_dy][z_dz] & QUEUED) != 0) {
					/* ...want to connect them to the maze. */              
					todo[todonum++] = [x_dx, y_dy, z_dz];
					maze[x_dx][y_dy][z_dz] &= ~QUEUED;
				}
			}
		}

		/* We won't be finished until all is connected. */
		while (todonum > 0) {
			/* We select one of the squares next to the maze. */
			n = Math.nextInt(todonum);
			x = todo[n][0];
			y = todo[n][1];
			z = todo[n][2];

			/* We will connect it, so remove it from the queue. */
			todo[n] = todo[--todonum];

			/* Select a random direction, which leads to the maze. */
			var passBool = 0;
			while (passBool == 0)
			{
				
				d = Math.nextInt1(6);	
				
				x_dx = x + dx[d];
				y_dy = y + dy[d];
				z_dz = z + dz[d];
				if (x_dx >= 0 && x_dx < lenx && y_dy >= 0 && y_dy < leny && z_dz >= 0 && z_dz < lenz) {
					if ((maze[x_dx][y_dy][z_dz] & IN_MAZE) == 0)
						passBool = 1;
				}
			}

			/* Connect this square to the maze. */
			maze[x][y][z] &= ~((1 << d) | IN_MAZE);
			maze[x + dx[d]][y + dy[d]][z + dz[d]] &= ~(1 << (d ^ 1));

			/* Remember the surrounding squares, which aren't... */
			for (d = 0; d < 6; ++d) {
				x_dx = x + dx[d];
				y_dy = y + dy[d];
				z_dz = z + dz[d];
				if (x_dx >= 0 && x_dx < lenx && y_dy >= 0 && y_dy < leny && z_dz >= 0 && z_dz < lenz) {
					if ((maze[x_dx][y_dy][z_dz] & QUEUED) != 0) {
						/* ...connected to the maze, and aren't yet queued. */
						todo[todonum++] = [x_dx, y_dy, z_dz];
						maze[x_dx][y_dy][z_dz] &= ~QUEUED;
					}
				}
			}
			/* Repeat until finished. */
		}

		/* Add an entrance and exit. */
		maze[0][Math.floor(leny/2)][0] &= ~WALL_LEFT;
		maze[lenx - 1][Math.floor(leny/2)][lenz - 1] &= ~WALL_RIGHT;
	}
	/* Called to write the maze to an SVG file. */
	this.printSVG = function () {
        var lenx = this.lenx;
        var leny = this.leny;
        var lenz = this.lenz;
        var cell_width = this.cell_width;
        var pics_xy = Math.ceil(Math.sqrt(lenz));
        var size_x = (lenx + 1) * pics_xy * cell_width + cell_width;
        var size_y = (leny + 1) * pics_xy * cell_width + cell_width;
    
        // Ottieni il riferimento all'elemento contenitore
        var container = document.getElementById("maze-container");
    
        // Costruisci il codice SVG e aggiungilo al contenitore
        container.innerHTML =
            "<svg width=\"" + size_x + "px\" height=\"" + size_y + "px\" viewBox=\"0 0 " + size_x + " " + size_y + "\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\">\n"
            + "  <title>SVG Maze</title>\n"
            + "  <desc>A 3D maze generated using a modified version of Prim's algorithm. Vertical layers are numbered starting from the bottom layer to the top. Stairs up are indicated with '/'; stairs down with '\\', and stairs up-and-down with 'x'. License is Cc-by-sa-3.0. See Wikimedia Commons for the algorithm used.</desc>\n"
            + "<!--\n"
            + "  <rect width=\"" + size_x + "px\" height=\"" + size_y + "px\" style=\"fill:blue;\" />\n"
            + "-->\n"
            + "  <g stroke=\"black\" stroke-width=\"1\" stroke-linecap=\"round\">\n"
            + this.drawMaze()
            + "  </g>\n"
            + "  <g fill=\"black\">\n"
            + this.drawLabels()
            + "  </g>\n"
            + "</svg>\n";
    }
    
	/* Main maze-drawing loop. */
	this.drawMaze = function () {
		var x, y, z;
		var lenx = this.lenx;
		var leny = this.leny;
		var lenz = this.lenz;
		var cell_width = this.cell_width;
		var pics_xy = Math.ceil(Math.sqrt(lenz));
		var outstring = "";
		for (z = 0; z < lenz; ++z) {
			var row_x = cell_width + cell_width * (lenx + 1) * (z % pics_xy);
			var row_y = cell_width + cell_width * (leny + 1) * Math.floor(z / pics_xy);
			for (y = 0; y < leny; ++y) {
				for (x = 0; x < lenx; ++x) {
					if ((this.maze[x][y][z] & WALL_ABOVE) != 0) {
						var x1_pos = row_x + cell_width * x;
						var y1_pos = row_y + cell_width * y;
						var x2_pos = row_x + cell_width * (x + 1);
						var y2_pos = row_y + cell_width * y;
						outstring += this.drawLine(x1_pos, y1_pos, x2_pos, y2_pos);
					}
					if ((this.maze[x][y][z] & WALL_BELOW) != 0) {
						var x1_pos = row_x + cell_width * x;
						var y1_pos = row_y + cell_width * (y + 1);
						var x2_pos = row_x + cell_width * (x + 1);
						var y2_pos = row_y + cell_width * (y + 1);
						outstring += this.drawLine(x1_pos, y1_pos, x2_pos, y2_pos);
					}
					if ((this.maze[x][y][z] & WALL_LEFT) != 0) {
						var x1_pos = row_x + cell_width * x;
						var y1_pos = row_y + cell_width * y;
						var x2_pos = row_x + cell_width * x;
						var y2_pos = row_y + cell_width * (y + 1);
						outstring += this.drawLine(x1_pos, y1_pos, x2_pos, y2_pos);
					}
					if ((this.maze[x][y][z] & WALL_RIGHT) != 0) {
						var x1_pos = row_x + cell_width * (x + 1);
						var y1_pos = row_y + cell_width * y;
						var x2_pos = row_x + cell_width * (x + 1);
						var y2_pos = row_y + cell_width * (y + 1);
						outstring += this.drawLine(x1_pos, y1_pos, x2_pos, y2_pos);
					}
					if ((this.maze[x][y][z] & WALL_FRONT) == 0) {
						var x1_pos = row_x + cell_width/3 + cell_width * x;
						var y1_pos = row_y + cell_width/3 + cell_width * y;
						var x2_pos = row_x - cell_width/3 + cell_width * (x + 1);
						var y2_pos = row_y - cell_width/3 + cell_width * (y + 1);
						outstring += this.drawLine(x1_pos, y1_pos, x2_pos, y2_pos);
					}
					if ((this.maze[x][y][z] & WALL_BACK) == 0) {
						var x1_pos = row_x + cell_width/3 + cell_width * x;
						var y1_pos = row_y - cell_width/3 + cell_width * (y + 1);
						var x2_pos = row_x - cell_width/3 + cell_width * (x + 1);
						var y2_pos = row_y + cell_width/3 + cell_width * y;
						outstring += this.drawLine(x1_pos, y1_pos, x2_pos, y2_pos);
					}
				}
			}
		}
		return outstring;
	}
	/* Draw a line, either in the SVG file or on the screen. */
	this.drawLine = function (x1, y1, x2, y2) {
		return "    <line x1=\"" + x1 + "\" y1=\"" + y1 + "\" x2=\"" + x2 + "\" y2=\"" + y2 + "\" />\n";
	}
	/* Text labels. */
	this.drawLabels = function () {
		var z;
		var lenx = this.lenx;
		var leny = this.leny;
		var lenz = this.lenz;
		var cell_width = this.cell_width;
		var pics_xy = Math.ceil(Math.sqrt(lenz));
		var outstring = "";
		for (z = 0; z < lenz; ++z) {
			var row_x = cell_width + cell_width * (lenx + 1) * (z % pics_xy);
			var row_y = cell_width + cell_width * (leny + 1) * Math.floor(z / pics_xy);
			outstring += this.drawText(row_x, row_y, z + 1);
		}
		return outstring;
	}
	/* Text labels. */
	this.drawText = function (x, y, label) {
		var cell_width = this.cell_width;
		y -= cell_width/10;
		return "    <text x=\"" + x + "\" y=\"" + y + "\" font-size=\"" + cell_width + "px\" font-family=\"LucidaTypewriter Sans\">" + label + ".</text>\n";
	}
}

/* Initialization method that will be called when the program is
* run from the command-line. Maze will be written as SVG file. */
function main(args) {
	var m = new Maze();
	m.createMaze();
	m.printSVG();
}

/* execute the program */
window.addEventListener('load', function() {
    main();
});