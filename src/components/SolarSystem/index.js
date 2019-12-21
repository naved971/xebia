import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import './style.css';
import * as d3 from "d3";
import CircularProgress from '@material-ui/core/CircularProgress';

const SolorSystem = ({ planets=[], onSelectPlanet }) => {
    React.useEffect(() => {
        function processPlanets() {
            var color = d3.scaleOrdinal(d3.schemeCategory10);
            planets.forEach(function (planet, key) {
                const { population } = planet;
                planet.gravity = parseInt(planet.gravity);
                planet.period = 1 / (parseInt(planet.rotation_period) || 24);
                planet.tilt = Math.floor(Math.random() * 180) + 1; //To make it look fancy add random tilt degree
                planet.key = planet.name.replace(" ", "");
                planet.name = planet.name.replace(" ", "");
                planet.colours = [color(key), color(key)];
                planet.radius = (parseInt(planet.diameter) || 10000) / 2;
                planet.population = population;
            });
            return planets;
        }
        var timers = [];
        function cleanTimers() {
            //clean old timers before drawing
            timers.forEach(function (timer) {
                timer.stop();
            });
            timers = [];
        }
        function drawPlanets() {
            cleanTimers();
            var solar = processPlanets();

            if (!solar.length) {
                return;
            }
            
            var margin = { top: 100, right: 50, bottom: 100, left: 50 };
            var dimension = {
                width: window.innerWidth,
                height: 300
            };
            var i;
            var width = dimension.width - margin.left - margin.right;
            var height = dimension.height - margin.top - margin.bottom;
            d3.select("#planetChartContainer svg").remove();
            var svg = d3.select("#planetChartContainer").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            var starArea = d3.select("svg").append("g");

            var config = {
                padding: 10,
                axisMultiplier: 1.4,
                velocity: [0.01, 0],
                starRadius: 1,
                glowRadius: 2
            };

            var definitions = d3.select("svg").append("defs");
            var filter = definitions.append("filter")
                .attr("id", "glow");
            filter.append("feGaussianBlur")
                .attr("class", "blur")
                .attr("stdDeviation", config.glowRadius)
                .attr("result", "coloredBlur");
            var feMerge = filter.append("feMerge");
            feMerge.append("feMergeNode")
                .attr("in", "coloredBlur");
            feMerge.append("feMergeNode")
                .attr("in", "SourceGraphic");

            function generateStars(number) {
                var stars = starArea.selectAll("circle")
                    .data(d3.range(number).map(d =>
                        i = { x: Math.random() * (width + margin.left + margin.right), y: Math.random() * (height + margin.top + margin.bottom), r: Math.random() * config.starRadius }
                    ))
                    .enter().append("circle")
                    .attr("class", "star")
                    .attr("cx", d => d.x)
                    .attr("cy", d => d.y)
                    .attr("r", d => d.r);
            }

            function displayPlanets(cfg, planets) {
                var boundingSize = Math.min((width / planets.length) - cfg.padding, dimension.height / 2);
                var boundingArea = svg.append("g")
                    .selectAll("g")
                    .data(planets)
                    .enter().append("g")
                    .attr("transform", (d, i) => "translate(" + [i * (boundingSize + cfg.padding), height / 2] + ")")
                    .on("mouseover", showInfo)
                    .on("mouseout", hideInfo)
                    .on("click", planetSelected);

                var boundingRect = boundingArea.append("rect")
                    .attr("class", "bounding-box")
                    .attr("y", -boundingSize / 2)
                    .attr("width", boundingSize)
                    .attr("height", boundingSize);

                var info = boundingArea.append("g")
                    .attr("transform", "translate(" + [0, (boundingSize / 2) + 18] + ")")
                    .attr("class", "info")
                    .style("opacity", 0);
                info.append("text")
                    .text(d => "Diameter: " + d.diameter + "km");
                info.append("text")
                    .attr("y", 12)
                    .text(d => "Population: " + d.population);
                info.append("text")
                    .attr("y", 24)
                    .text(d => "Rotaion: " + d.rotation_period);

                var labels = boundingArea.append("text")
                    .attr("class", "label")
                    .attr("y", -boundingSize / 2)
                    .attr("dy", -12)
                    .text(d => d.name);

                var radiusScale = d3.scaleLinear()
                    .domain([0, d3.max(planets, d => d.radius)])
                    .range([0, (boundingSize / 2) - 3]);

                var graticuleScale = d3.scaleLinear()
                    .domain(d3.extent(planets, d => d.radius))
                    .range([20, 10]);

                var planets = boundingArea.each(function (d) {
                    var x = d3.select(this);
                    drawPlanet(x, d);
                });

                function drawPlanet(element, data) {

                    var rotation = [0, 0, data.tilt];

                    var projection = d3.geoOrthographic()
                        .translate([0, 0])
                        .scale(radiusScale(data.radius))
                        .clipAngle(90)
                        .precision(0.1);

                    var path = d3.geoPath()
                        .projection(projection);

                    var graticule = d3.geoGraticule();

                    var planet = element.append("g")
                        .attr("class", "planet")
                        .attr("transform", "translate(" + [boundingSize / 2, 0] + ")");

                    var defs = d3.select("svg").select("defs");
                    var gradient = defs.append("radialGradient")
                        .attr("id", "gradient" + data.key)
                        .attr("cx", "25%")
                        .attr("cy", "25%");

                    // The offset at which the gradient starts
                    gradient.append("stop")
                        .attr("offset", "5%")
                        .attr("stop-color", data.colours[0]);

                    // The offset at which the gradient ends
                    gradient.append("stop")
                        .attr("offset", "100%")
                        .attr("stop-color", data.colours[1]);

                    var axis = planet.append("line")
                        .attr("class", "axis-line")
                        .attr("x1", -radiusScale(data.radius) * cfg.axisMultiplier)
                        .attr("x2", radiusScale(data.radius) * cfg.axisMultiplier)
                        .attr("transform", "rotate(" + (90 - data.tilt) + ")");

                    var fill = planet.append("circle")
                        .attr("r", radiusScale(data.radius))
                        .style("fill", "url(#gradient" + data.key + ")")
                        .style("filter", "url(#glow)");

                    var gridLines = planet.append("path")
                        .attr("class", "graticule")
                        .datum(graticule.step([graticuleScale(data.radius), graticuleScale(data.radius)]))
                        .attr("d", path);

                    var timer = d3.timer(function (elapsed) {
                        // Rotate projection
                        projection.rotate([rotation[0] + elapsed * cfg.velocity[0] / data.period, rotation[1] + elapsed * cfg.velocity[1] / data.period, rotation[2]]);
                        // Redraw gridlines
                        gridLines.attr("d", path);
                    });
                    timers.push(timer);
                }
            }

            function showInfo(d) {
                d3.select(this).select("g.info")
                    .transition()
                    .style("opacity", 1);
            }
            function planetSelected(d) {
                onSelectPlanet && onSelectPlanet(d);
            }
            function hideInfo(d) {
                d3.select(this).select("g.info")
                    .transition()
                    .style("opacity", 0);
            }

            generateStars(500);
            displayPlanets(config, solar);

            starArea.lower();
        }
        function refresh() {
            drawPlanets();
        };
        window.addEventListener("resize", drawPlanets);
        if (planets.length > 0) {
            refresh();
        }
        return ()=>{
            cleanTimers();
            window.removeEventListener("resize", drawPlanets);

        }
    }, [planets])

    return (
        <>
            <div id='planetChartContainer' className='svg-container'>
            </div>
        </>)

}
SolorSystem.propTypes = {
    suggestions: PropTypes.instanceOf(Array),
    onPlanetSelection: PropTypes.func
}

export default SolorSystem;