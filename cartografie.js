let margin = 10,
width = window.innerWidth,
height = window.innerHeight;

let zoom = d3.zoom()
.scaleExtent([1, 8])
.on("zoom", zoomed);

let cartogramma = d3.select("#cartogramma")
.append("svg")
.attr("width", width)
.attr("height", height);

let gruppo = cartogramma.append("g");

gruppo.call(zoom)

let mappa = gruppo.append("g").classed("map", true);
let contourArea = gruppo.append("g").classed("contourArea", true);
let contourLine = gruppo.append("g").classed("contourLine", true);
let confini = gruppo.append("g").classed("confini", true);
let route = gruppo.append("g").classed("route", true);
let node = gruppo.append("g");
let cities = gruppo.append("g").classed("cities", true);

// gruppo.attr("transform","rotate(-45deg)");

let projection = d3.geoAzimuthalEquidistant()
.fitSize([width, height], cartogramma)
.scale(400)
.translate([width / 2, height / 2 + 400]);

let size = d3.scaleLinear()
.range([10,100]);

d3.tsv("banks.tsv", function(error, data) {
 if (error) throw error;

 size.domain(d3.extent(data, function(d) {
  return +d.deadmissing;
}));

 console.log(data)

 let nodes = data
 .map(d=> {
    let point = projection([d.lon, d.lat]);
    return {
        x: point[0], y: point[1],
        x0: point[0], y0: point[1],
        name: d.title,
    };
});

        // let extent = d3.extent(data, function(d) {
        //     return +d.dmis;
        // });

        // extent = extent.map(d=> {
        //     return {
        //         dmis: d,
        //         dead: null
        //     };
        // });

        let simulation = d3.forceSimulation()
        .force("cx", d3.forceX(function(d) { return d.x0;}))
        .force("cy", d3.forceY(function(d) { return d.y0; }))
        .force("collide", d3.forceCollide(1.5)
            .iterations(15))
        .alphaDecay(0)
        .alpha(0.5)
        .nodes(nodes)
        .on("tick", tick);

        let accidents = node.selectAll(".circle")
        .data(nodes)
        .enter()
        .append("circle")
        .classed("circle", true)
        .attr("r", 1)
        .attr("fill", "#FFFFFF");

        function tick(e) {
            accidents.attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
        }

        d3.selectAll(".circle").on("mouseenter", d=> { console.log(d.name); })

    });


let path = d3.geoPath().projection(projection);

let url = "https://gist.githubusercontent.com/mbostock/4090846/raw/d534aba169207548a8a3d670c9c2cc719ff05c47/world-50m.json";

d3.json(url, function(error, world) {
  if (error) throw error;

  mappa.selectAll("path")
  .data(topojson.feature(world, world.objects.countries).features)
  .enter().append("path")
  .attr("d", path)
  .attr("fill", "rgba(255,255,255,.05")
  .attr("stroke", "#3B3F59")
  .attr("stroke-width", .5)
  .classed("land", true)
});

function zoomed() {
    node.selectAll("circle")
    .attr("r", 1 / d3.event.transform.k )
    .attr("cx", function(d) { return d.x / d3.event.transform.k; })
    .attr("cy", function(d) { return d.y / d3.event.transform.k; });

    mappa.style("stroke-width", 1 / d3.event.transform.k + "px");

    gruppo.attr("transform", d3.event.transform);

    let simulation = d3.forceSimulation()
    .force("cx", d3.forceX(function(d) { return d.x0 / d3.event.transform.k;}))
    .force("cy", d3.forceY(function(d) { return d.y0 / d3.event.transform.k; }))
    .force("collide", d3.forceCollide(1.5 / d3.event.transform.k));
}
