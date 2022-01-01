import {inject, observer} from "mobx-react";
import {GraphDashboardStore, edges, nodes, Edge, Node} from "../stores/GraphDashboardStore";
import React, {Component, ReactElement, useEffect} from "react";
import * as d3 from "d3";
import {ForceLink} from "d3";
import {render} from "react-dom";
React.useLayoutEffect = React.useEffect

type props = {
    graphDashboardStore?: GraphDashboardStore;
};

@inject('graphDashboardStore')
@observer
class Graph extends Component<props> {

    edgeElements: any;
    nodeElements: any;
    textElements: any;

    constructor(props:props) {
        super(props);
    }

    redrawElements() {
        this.nodeElements.attr("stroke-width", function(node:Node) {
            //return isNodeHighlight(d.id) ? 3 : 0;
            return 0;
        })
        this.nodeElements.attr('fill', function(node:Node) {
            return "black";
            //return getNodeColor(node.id)
        })
        this.textElements.attr('fill', function(node:Node) {
            return "black";
            //return getTextColor(node.id)
        })
        this.edgeElements.attr('stroke', function(edge:Edge) {
            return "black";
            //return getLinkColor(edge)
        })
        //dateElements.attr('stroke', function(date:Date) {
            //if (date.date === selectedDate) return "#080808"
            //return "white";
        //    return "#080808"
        //})
    }

    componentDidMount() {
        let width = 600;
        let height = 600;
        let svg = d3.select('#graph')
        svg.attr('width', width).attr('height', height)

        // simulation setup with all forces
        let linkForce = d3
            .forceLink()
            .id(function(link) {
                // @ts-ignore
                return link.id
            })
        let simulation = d3.forceSimulation(nodes)
            .force('link', linkForce)
            .force('charge', d3.forceManyBody().strength(-2800))
            .force('x', d3.forceX(width / 2).strength(0.3))
            .force('y', d3.forceY(height / 2).strength(0.3))

        simulation.force<ForceLink<any, any>>("link")?.links(edges);
        simulation.stop();
        simulation.tick(300);

        let dragDrop = d3.drag().on('start', function(node) {
            //if (isNodeHighlight(node.id)) tooltipMouseleave(node);
            node.fx = node.x
            node.fy = node.y
        }).on('drag', function(event, node) {
            simulation.alphaTarget(0).restart()
            // @ts-ignore
            node.fx = event.x
            // @ts-ignore
            node.fy = event.y
        }).on('end', function(event, node) {
            //if (isNodeHighlight(node.id)) tooltipMouseover(node);
            if (event.active) {
                simulation.alphaTarget(0)
            }
            // @ts-ignore
            node.fx = null
            // @ts-ignore
            node.fy = null
        })

        this.edgeElements = svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(edges)
            .enter().append("line")
            .attr("x1", function(d) {
                return typeof d.source !== "string" && d.source.x ? d.source.x : 0;
            })
            .attr("y1", function(d) {
                return typeof d.source !== "string" && d.source.y ? d.source.y : 0;
            })
            .attr("x2", function(d) {
                return typeof d.target !== "string" && d.target.x ? d.target.x : 0;
            })
            .attr("y2", function(d) {
                return typeof d.target !== "string" && d.target.y ? d.target.y : 0;
            })
            .attr("stroke-width", 4)
            .attr("stroke", "blue")

        this.nodeElements = svg.append("g")
            .attr("class", "nodes")
            .attr("class", "animation")
            .selectAll("circle")
            .data(nodes)
            .enter()
            .append("circle")
            .attr("cx", function(d) {
                return d.x!;
            })
            .attr("cy", function(d) {
                return d.y!;
            })
            .attr("r", 10)
            .attr("fill", "red")
            .attr("stroke-width", 0)
            .attr("stroke", "#303030")
            // @ts-ignore
            .call(dragDrop)
            .on("mouseenter", (event, node:Node) => {
                //if (isNodeActive(node.id) && !d3.event.shiftKey) {
                    tooltipMouseover(node)
                //}
                //highlightNode = node.id;
                this.redrawElements();
            })
            .on("mouseleave", (event,node:Node) => {
                tooltipMouseleave(node)
                //highlightNode = null;
                this.redrawElements();
            })

        this.textElements = svg.append("g")
            .attr("class", "texts")
            .selectAll("text")
            .data(nodes)
            .enter()
            .append("text")
            .text(function(node) {
                return node.label
            })
            .attr('x', function(node) {
                return node.x!
            })
            .attr('y', function(node) {
                return node.y!
            })
            .attr("font-size", 15)
            .attr("dx", 15)
            .attr("dy", 4)
            .style("background-color", "white")

        simulation.nodes(nodes).on('tick', () => {
            simulateElements();
        })
        let simulateElements = () => {
            nodeSimulation();
            textSimulation();
            linkSimulation();
        }
        let nodeSimulation = () => {
            this.nodeElements!
                .attr('cx', function(node: Node) {
                    return node.x
                })
                .attr('cy', function(node: Node) {
                    return node.y!
                })
        }
        let textSimulation = () => {
            this.textElements!
                .attr('x', function(node: Node) {
                    return node.x!
                })
                .attr('y', function(node: Node) {
                    return node.y!
                })
        }
        let linkSimulation = () => {
            this.edgeElements!
                .attr('x1', function(edge:Edge) {
                    return typeof edge.source !== "string" && edge.source.x ? edge.source.x : 0;
                })
                .attr('y1', function(edge:Edge) {
                    return typeof edge.source !== "string" && edge.source.y ? edge.source.y : 0;
                })
                .attr('x2', function(edge:Edge) {
                    return typeof edge.target !== "string" && edge.target.x ? edge.target.x : 0;
                })
                .attr('y2', function(edge:Edge) {
                    return typeof edge.target !== "string" && edge.target.y ? edge.target.y : 0;
                })
        }
        simulation!.force<ForceLink<any, any>>("link")!.links(edges)

        let Tooltip = d3.select("#graphBackground")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")
            .style("position", "absolute")


        let tooltipMouseover = function(node:Node) {
            Tooltip
                .style("opacity", 1)
                .style("stroke", "black")
                .style("opacity", 1)
                .style("z-index", 10)
                .html(`Schadenfall: ${node.id}  <br> Name: ${node.label}`);
            Tooltip
                // @ts-ignore
                .style("left", ((node.x!) - (Tooltip._groups[0][0].offsetWidth / 2) + "px"))
                // @ts-ignore
                .style("top", (node.y! - 20 - Tooltip._groups[0][0].offsetHeight) + "px");
        }
        let tooltipMouseleave = function(node:Node) {
            Tooltip
                .style("opacity", 0)
                .style("z-index", -100)
                .style("left", 0 + "px")
                .style("top", 0 + "px");
        }
    }

    render(){
        return <div id="graphBackground">
            <svg id="graph"></svg>
        </div>
    }
}

export default Graph;
