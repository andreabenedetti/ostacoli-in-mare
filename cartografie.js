
let margin = 10,
width = 1644*1.5,
height = 797*1.5;

let cartogramma = d3.select("#cartogramma")
.append("svg")
.attr("width", width)
.attr("height", height);

let gruppo = cartogramma.append("g");

let mappa = gruppo.append("g");
let contourArea = gruppo.append("g").classed("contourArea", true);
let contourLine = gruppo.append("g").classed("contourLine", true);
let confini = gruppo.append("g").classed("confini", true);
let route = gruppo.append("g").classed("route", true);
let node = gruppo.append("g")
let cities = gruppo.append("g").classed("cities", true);

// gruppo.attr("transform","rotate(-45deg)");

let projection = d3.geoAzimuthalEquidistant()
.fitSize([width, height], cartogramma)
.scale(1000)
.translate([width / 2 - 320, height / 2 + 400]);

let size = d3.scaleLinear()
.range([10,100]);

    let color2018 = d3.scalePow()
    .exponent(.4)
    .domain([0,1])
    .interpolate(d3.interpolateHsl)
    .range([d3.hsl("#60584d"), d3.hsl("#FFFFFF")]);

    let color2017 = d3.scalePow()
    .exponent(.4)
    .domain([0,1])
    .interpolate(d3.interpolateHsl)
    .range([d3.hsl("#ddbf92"), d3.hsl("#FFFFFF")]);

    let color2016 = d3.scalePow()
    .exponent(.4)
    .domain([0,1])
    .interpolate(d3.interpolateRgb)
    .range([d3.rgb("#b8e880"), d3.rgb("#74894a")]);

    let time = d3.scaleOrdinal()
    .domain(["2016", "2017", "2018"])
    .range(["#FFFFFF", "#7c7c7c", "#000000"])

    //  let color2018 = d3.scalePow()
    // .exponent(.4)
    // .domain([0,1])
    // .interpolate(d3.interpolateHsl)
    // .range([d3.hsl("#666666"), d3.hsl("#FFFFFF")]);

    // let color2017 = d3.scalePow()
    // .exponent(.4)
    // .domain([0,1])
    // .interpolate(d3.interpolateHsl)
    // .range([d3.hsl("#CCCCCC"), d3.hsl("#FFFFFF")]);

    // let color2016 = d3.scalePow()
    // .exponent(.4)
    // .domain([0,1])
    // .interpolate(d3.interpolateHsl)
    // .range([d3.hsl("#FFFFFF"), d3.hsl("#CCCCCC")]);

    d3.tsv("migrants.tsv", function(error, data) {
    	if (error) throw error;

        size.domain(d3.extent(data, function(d) {
          return +d.deadmissing;
      }));

        let defs = cartogramma.append("defs");

        let filter = defs.append("filter")
        .attr("id", "dropshadow")

        filter.append("feGaussianBlur")
        .attr("in", "SourceAlpha")
        .attr("stdDeviation", 2)
        .attr("result", "blur");
        filter.append("feOffset")
        .attr("in", "blur")
        .attr("dx", 5)
        .attr("dy", 5)
        .attr("result", "offsetBlur")
        filter.append("feFlood")
        .attr("in", "offsetBlur")
        .attr("flood-color", "#706653")
        .attr("flood-opacity", "0.1")
        .attr("result", "offsetColor");
        filter.append("feComposite")
        .attr("in", "offsetColor")
        .attr("in2", "offsetBlur")
        .attr("operator", "in")
        .attr("result", "offsetBlur");

        var feMerge = filter.append("feMerge");

        feMerge.append("feMergeNode")
        .attr("in", "offsetBlur")
        feMerge.append("feMergeNode")
        .attr("in", "SourceGraphic");


        let data2016 = data.filter(d=> { return d.year == 2016 } );
        let data2017 = data.filter(d=> { return d.year == 2017 } );
        let data2018 = data.filter(d=> { return d.year == 2018 } );
        let routeBorder = data.filter(d=> { return d.route === "Eastern Mediterranean" })

        console.log(data2016)

        // 2016

        let density2016 = d3.contourDensity()
        .x(function(d) { return projection([d.lon, d.lat])[0]; })
        .y(function(d) { return projection([d.lon, d.lat])[1]; })
        .size([width, height])
        .weight(d=> { return size(d.deadmissing) } ) 
        .thresholds(35)
        .bandwidth(15)
        (data2016)

        contourArea.selectAll("path")
        .data(density2016)
        .enter().append("path")
        .attr("d", d3.geoPath())
        .attr("fill", d=> { return color2016(d.value); })
        // .attr("filter", "url(#dropshadow)");

        contourLine.selectAll("path")
        .data(density2016)
        .enter().append("path")
        .attr("d", d3.geoPath())
        .attr("fill", "none")
        .attr("stroke", "brown")
        .attr("stroke-width", .4)
        .attr("stroke-dasharray", "2 2");

        // 2017
        let density2017 = d3.contourDensity()
        .x(function(d) { return projection([d.lon, d.lat])[0]; })
        .y(function(d) { return projection([d.lon, d.lat])[1]; })
        .size([width, height])
        .weight(d=> { return size(d.deadmissing) } ) 
        .thresholds(35)
        .bandwidth(15)
        (data2017)

        contourArea.append("g")
        .selectAll("path")
        .data(density2017)
        .enter().append("path")
        .attr("d", d3.geoPath())
        .attr("fill", d=> { return color2017(d.value); })
        // .attr("filter", "url(#dropshadow)");

        contourLine.append("g")
        .selectAll("path")
        .data(density2017)
        .enter().append("path")
        .attr("d", d3.geoPath())
        .attr("fill", "none")
        .attr("stroke", "brown")
        .attr("stroke-width", .4)
        .attr("stroke-dasharray", "2 2");

        // 2017
        let density2018 = d3.contourDensity()
        .x(function(d) { return projection([d.lon, d.lat])[0]; })
        .y(function(d) { return projection([d.lon, d.lat])[1]; })
        .size([width, height])
        .weight(d=> { return size(d.deadmissing) } ) 
        .thresholds(30)
        .bandwidth(10)
        (data2018)

        contourArea.append("g")
        .selectAll("path")
        .data(density2018)
        .enter().append("path")
        .attr("d", d3.geoPath())
        .attr("fill", d=> { return color2018(d.value); })
        // .attr("filter", "url(#dropshadow)");

        contourLine.append("g")
        .selectAll("path")
        .data(density2018)
        .enter().append("path")
        .attr("d", d3.geoPath())
        .attr("fill", "none")
        .attr("stroke", "brown")
        .attr("stroke-width", .4)
        .attr("stroke-dasharray", "2 2");

        let nodes = data
        .map(d=> {
            let point = projection([d.lon, d.lat]);
            let value = +d.survivors;
            return {
                x: point[0], y: point[1],
                x0: point[0], y0: point[1],
                name: d.region,
                missing: d.missing,
                dead: d.dead,
                survivors: d.survivors,
                year: d.year,
                r: size(value),
                value: value,
                route: d.route
            };
        });



        let extent = d3.extent(data, function(d) {
            return +d.dmis;
        });

        extent = extent.map(d=> {
            return {
                dmis: d,
                dead: null
            };
        });

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

        let missingDot = accidents.enter()
        .append("circle")
        .filter(d=> { return d.year !== "Central America to US" })
        .classed("circle", true)
        .attr("r", 1)
        .attr("fill", d=> { return time(d.year) });

        function tick(e) {
        missingDot.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y + size(+d.survivors); });
    }

});


let path = d3.geoPath().projection(projection);

let url = "https://gist.githubusercontent.com/mbostock/4090846/raw/d534aba169207548a8a3d670c9c2cc719ff05c47/world-50m.json";

d3.json(url, function(error, world) {
  if (error) throw error;

      // mappa.selectAll("path")
      // .data(topojson.feature(world, world.objects.countries).features)
      // .enter().append("path")
      // .attr("d", path)
      // .attr("fill", "#b0c48b")
      // .classed("land", true)

      confini.selectAll("path")
      .data(topojson.feature(world, world.objects.countries).features)
      .enter().append("path")
      .attr("d", path)
      .attr("fill", "none")
      .attr("stroke", "#D00000")
      .attr("stroke-width", .5)

  });

// d3.tsv("route-east.tsv", function(error, data) {
//     if (error) throw error;

//     let line = d3.line()
//     .x(function(d) { return projection([d.lon, d.lat])[0]; })  
//     .y(function(d) { return projection([d.lon, d.lat])[1]; })
//     .curve(d3.curveMonotoneX);

//     route.append("path")
//     .data([data])
//     .attr("d", line)
//         // .attr("d", line(data))
//         .attr("fill", "none")
//         .attr("stroke", "#000000")
//     });

    // d3.tsv("route-west-2.tsv", function(error, data) {
    //     if (error) throw error;

    //     let line = d3.line()
    //     .x(function(d) { return projection([d.lon, d.lat])[0]; })  
    //     .y(function(d) { return projection([d.lon, d.lat])[1]; })
    //     .curve(d3.curveLinear);

    //     route.append("path")
    //     .data([data])
    //     .attr("d", line)
    //     // .attr("d", line(data))
    //     .attr("fill", "none")
    //     .attr("stroke", "#000000");

    // });

    d3.csv("geo-towns.csv", function(error, data) {
        if (error) throw error;

        cities.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d=> { return projection([d.lon, d.lat])[0]; })
        .attr("cy", d=> { return projection([d.lon, d.lat])[1]; })
        .attr("r", 4)
        .attr("fill", "#FFFFFF")
        .attr("stroke", "#000000")

        cities.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr("x", d=> { return projection([d.lon, d.lat])[0]; })
        .attr("y", d=> { return projection([d.lon, d.lat])[1] + 6; })
        .text(d=> { return d.name; })
        .attr("fill", "black")
        .style("text-anchor", "middle")
        .style("alignment-baseline", "hanging")
        .classed("label", true)

    });

    d3.tsv("countries-centroids.tsv", function(error, data) {
        if (error) throw error;

        console.log(data)

        cities.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr("x", d=> { return projection([d.lon, d.lat])[0]; })
        .attr("y", d=> { return projection([d.lon, d.lat])[1]; })
        .text(d=> { return d.name; })
        .attr("fill", "#D00000")
        .style("text-anchor", "middle")
        .style("alignment-baseline", "middle")
        .style("font-size", "0.8rem")
        .style("text-transform", "uppercase")

    });
