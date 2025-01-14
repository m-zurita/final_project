//*************************************************************************************************
// The dropdown for the random List movies

d3.select("#movies").on("change", function() {
    let itemString = d3.select("#movies").node().value
    console.log(itemString);
    d3.select("#cont").selectAll("svg").remove();
    d3.json("/api/genre/" + itemString, function(data) {
        var peliculas = data.data.slice(1, 20);
        createGraph(itemString, peliculas);
    })
});

function createGraph(itemString, peliculas) {
    /* Diagram */

    var treeData = [{
        "name": itemString,
        "parent": "null",
        "children": [{
                "name": peliculas.slice(0)[0]["Title"],
                "parent": "Top Level",
            },
            {
                "name": peliculas.slice(0)[1]["Title"],
                "parent": "Top Level"
            },
            {
                "name": peliculas.slice(0)[2]["Title"],
                "parent": "Top Level",
            },
            {
                "name": peliculas.slice(0)[3]["Title"],
                "parent": "Top Level",
            },
            {
                "name": peliculas.slice(0)[4]["Title"],
                "parent": "Top Level",
            },
            {
                "name": peliculas.slice(0)[5]["Title"],
                "parent": "Top Level",
            },
            {
                "name": peliculas.slice(0)[6]["Title"],
                "parent": "Top Level",
            },
            {
                "name": peliculas.slice(0)[7]["Title"],
                "parent": "Top Level",
            },
            {
                "name": peliculas.slice(0)[8]["Title"],
                "parent": "Top Level",
            },
            {
                "name": peliculas.slice(0)[9]["Title"],
                "parent": "Top Level",
            }
        ]
    }];


    // ***** Generate the tree diagram	 ******
    var margin = { top: 5, right: 120, bottom: 20, left: 200 },
        width = 960 - margin.right - margin.left,
        height = 700 - margin.top - margin.bottom;

    var i = 0,
        duration = 750,
        root;
    /*
    Creates a new tree layout with the default settings: the default sort order is null; 
    the default children accessor assumes each input data is an object with a children array; 
    the default separation function uses one node width for siblings, and two node widths for non-siblings; 
    the default size is 1×1.
    */
    var tree = d3.layout.tree()
        .size([height, width]);

    var diagonal = d3.svg.diagonal()
        .projection(function(d) { return [d.y, d.x]; });

    var svg = d3.select("#cont")
        .append("svg")
        .attr("id", "treeg")
        .attr("width", width + margin.right + margin.left)
        .attr("height", +height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    root = treeData[0];
    root.x0 = height / 2;
    root.y0 = 0;

    update(root);
    /*
    self: if not redefined (typically as copy of this) than it is window object which always points to window. 
    So they can be used interchangeably.
      
    window.frameElement: Returns the element (such as <iframe> or <object>) in which the window is embedded, 
      or null if the window is top-level.
    */
    d3.select(self.frameElement).style("height", "500px");

    function update(source) {

        // Compute the new tree layout.
        var nodes = tree.nodes(root).reverse(),
            links = tree.links(nodes);

        // Normalize for fixed-depth.
        nodes.forEach(function(d) { d.y = d.depth * 180; });

        // Update the nodes…
        var node = svg.selectAll("g.node")
            .data(nodes, function(d) { return d.id || (d.id = ++i); });

        // Enter any new nodes at the parent's previous position.
        var nodeEnter = node.enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
            .on("click", function() {
                click;
                var title = $(this).text();
                d3.json("/api/movieDescription/" + title, function(pelicula) {
                    console.log(pelicula.pelicula[0]);
                    document.getElementById("titupeli").innerHTML = title;
                    document.getElementById("director").innerHTML = "Director: " + pelicula.pelicula[0]["Director"];
                    document.getElementById("leadr").innerHTML = "Leading Role: " + pelicula.pelicula[0]["Leading_Role"];
                    document.getElementById("rating").innerHTML = "Rating: " + pelicula.pelicula[0]["Rating"];
                })
            })

        nodeEnter.append("circle")
            .attr("r", 1e-6)
            .style("fill", function(d) { return d._children ? "coral" : "#fff"; });

        nodeEnter.append("text")
            .attr("x", function(d) { return d.children || d._children ? -13 : 13; })
            .attr("dy", ".35em")
            .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
            .text(function(d) { return d.name })
            .style("fill-opacity", 1e-6);

        // Transition nodes to their new position.
        var nodeUpdate = node.transition()
            .duration(duration)
            .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

        nodeUpdate.select("circle")
            .attr("r", 10)
            .style("fill", function(d) { return d._children ? "coral" : "#fff"; });

        nodeUpdate.select("text")
            .style("fill-opacity", 1);

        // Transition exiting nodes to the parent's new position.
        var nodeExit = node.exit().transition()
            .duration(duration)
            .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
            .remove();

        nodeExit.select("circle")
            .attr("r", 1e-6);

        nodeExit.select("text")
            .style("fill-opacity", 1e-6);

        // Update the links…
        var link = svg.selectAll("path.link")
            .data(links, function(d) { return d.target.id; });

        // Enter any new links at the parent's previous position.
        link.enter().insert("path", "g")
            .attr("class", "link")
            .attr("d", function(d) {
                var o = { x: source.x0, y: source.y0 };
                return diagonal({ source: o, target: o });
            });

        // Transition links to their new position.
        link.transition()
            .duration(duration)
            .attr("d", diagonal);

        // Transition exiting nodes to the parent's new position.

        link.exit().transition()
            .duration(duration)
            .attr("d", function(d) {
                var o = { x: source.x, y: source.y };
                return diagonal({ source: o, target: o });
            })
            .remove();

        // Stash the old positions for transition.
        nodes.forEach(function(d) {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    }

    // Toggle children on click.
    function click(d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else {
            d.children = d._children;
            d._children = null;
        }
        update(d);
    }


}
//*************************************************************************************************

//*************************************************************************************************
//The listener to search Movies, Actor or Directors

var pelis = ["The Pianist", "Adrien Brody", "Leonardo DiCaprio", "Inception", "Roman Polansky"];
var actores = ["Leonardo", "Angie", "Jorge", "Mioguel"];
var directores = ["Juanita", "Lolita"];

function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false; }
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
            /*check if the item starts with the same letters as the text field value:*/
            if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].substr(val.length);
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function(e) {
                    /*insert the value for the autocomplete text field:*/
                    inp.value = this.getElementsByTagName("input")[0].value;
                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
            }
        }
    });

    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }

    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function(e) {
        closeAllLists(e.target);
    });
}


function appendArrays() {
    var arregloFinal = [];
    pelis.forEach(function(x, i) {
        console.log(x);
        console.log(i);
    });
    arregloFinal.push(pelis);
    arregloFinal.push(actores);
    arregloFinal.push(directores);
    console.log(arregloFinal)
    return arregloFinal;
}

autocomplete(document.getElementById("myInput"), pelis);

//******************************************************************************+*************** 

//******************************************************************************+*************** 
//Dashboard

datos = ["uno", "dos", "tres"];

let selector = d3.selectAll(".miRow").data(datos);

selector.enter()
    .append("div").attr("class", "col-3 p-2")
    .append("div").attr("class", "p-1 dashboard")
    .text(d => d.contenido);
//******************************************************************************+***************

//**********************************************************************************************
stringBusqueda = 'Avatar'

d3.json(`/api/movies/${stringBusqueda}`, {
    method: "POST",
    body: JSON.stringify({
        search: stringBusqueda,
    }),
    headers: {
        "Content-type": "aplication/json"
    }
}).then(datos => {

    let selector = d3.selectAll(".miRow").data(datos);

    selector.enter()
        .append("div").attr("class", "col-3 p-2")
        .append("div").attr("class", "p-1 dashboard")
        .text(d => d.contenido);

})