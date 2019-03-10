let widthNet = d3.select("#rotte-cont").node().getBoundingClientRect().width;

let rotte = d3.select("#routes")
.append("svg")
.attr("width", widthNet)
.attr("height", height);

let color = d3.scaleOrdinal(d3.schemeCategory20);

let simulation = d3.forceSimulation()
.force("link", d3.forceLink().distance(25).strength(0.4))
.force("charge", d3.forceManyBody())
.force("center", d3.forceCenter(widthNet/2.5, height/2))
.force("collide", d3.forceCollide(10));

rotte.append("defs").append("marker")
.attr("id", "arrow")
.attr("viewBox", "0 -5 10 10")
.attr("refX", 10)
.attr("refY", 0)
.attr("markerWidth", 6)
.attr("markerHeight", 6)
.attr("orient", "auto")
.append("svg:path")
.attr("d", "M0,-5L10,0L0,5");

d3.json("miserables.json", function(error, graph) {
  if (error) throw error;

  let nodes = graph.nodes,
  nodeById = d3.map(nodes, function(d) { return d.id; }),
  // links = graph.links.filter(d=> { return d.route }),
  links = graph.links,

  bilinks = [];

  links.forEach(function(link) {
    let s = link.source = nodeById.get(link.source),
    t = link.target = nodeById.get(link.target),
        i = {}; // intermediate node
        nodes.push(i);
        links.push({source: s, target: i}, {source: i, target: t});
        bilinks.push([s, i, t]);
      });

  let isle = rotte.selectAll(".isle")
  .data(bilinks)
  .enter().append("path")
  .attr("class", "isle");

  let node = rotte.append("g")
  .attr("class", "nodes")
  .selectAll("g")
  .data(graph.nodes.filter(function(d) { return d.id; }))
  // .data(graph.links.filter(function(d) { return d.route === "africa est"; }))
  .enter().append("g")

  let circles = node.append("circle")
  .classed("node", true)
  .attr("r", 7)
  .call(d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended));

  let link = rotte.selectAll(".link")
  .data(bilinks)
  .enter().append("path")
  .attr("class", "link")
  .attr("marker-end", "url(#arrow)")
  .attr("stroke", d=> { console.log(links) });

  console.log(graph.links)

  let labels = node.append("text")
  .text(function(d) {
    return d.id;
  })
  .attr('x', 12)
  .attr('y', 6)
  // .attr("transform", "rotate(-45)");

  node.append("title")
  .text(function(d) { return d.id; });

  simulation
  .nodes(nodes)
  .on("tick", ticked);

  simulation.force("link")
  .links(links);

  function ticked() {
    link.attr("d", positionLink);
    isle.attr("d", positionLink)
    node.attr("transform", positionNode);
  }
});

function positionLink(d) {
  return "M" + d[0].x + "," + d[0].y
  + "S" + d[1].x + "," + d[1].y
  + " " + d[2].x + "," + d[2].y;
}

function positionNode(d) {
  return "translate(" + d.x + "," + d.y + ")";
}

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x, d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x, d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null, d.fy = null;
}