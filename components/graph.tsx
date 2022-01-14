import {inject, observer} from "mobx-react";
import {GraphDashboardStore, edges, nodes, Edge, Node} from "../stores/GraphDashboardStore";
import React, {Component} from "react";
import * as d3 from "d3";
import {ForceLink} from "d3";
import {Colors} from "../styles/Colors";
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

    // Node functions
    getNodeColor(nodeID: string) {
        if (this.isNodeDisabled(nodeID)) return Colors.NODE_INACTIVE_COLOR;
        if (this.isNodeActive(nodeID)) return Colors.NODE_ACTIVE_COLOR;
        return 'gray'
    }

    getNodeRadius(node: Node){
        if(this.props.graphDashboardStore?.mode){
            return 10 + node.score * 12;
        }
        if(this.props.graphDashboardStore?.nodeRadiusType === 1){
            return 10 + (node.schadenhoehe / 400);
        }
        if(this.props.graphDashboardStore?.nodeRadiusType === 2){
            return 10 + (this.getNodeNeighborCount(node.id) * 4);
        }
        return 10;
    }

    getNodeNeighborCount(nodeID: string){
        let counter = 0;
        edges.forEach((edge:Edge)=>{
            if (typeof edge.source !== "string" && typeof edge.target !== "string") {
                if (((edge.target.id === nodeID && !this.isNodeDisabled(edge.source.id)) || (edge.source.id === nodeID && !this.isNodeDisabled(edge.target.id))) && this.isEdgeActive(edge.value)) {
                    counter++;
                }
            }
        })
        console.log(counter)
        return counter;
    }

    isNodeDisabled(nodeID: string){
        return this.props.graphDashboardStore!.disabledNodes.indexOf(nodeID) != -1;
    }

    isNodeActive(nodeID: string){
        let oneActiveEdge = true;
        if(this.props.graphDashboardStore?.disabledEdges.length != 0){
            oneActiveEdge = false;
            edges.forEach((edge:Edge)=>{
                if (typeof edge.source !== "string" && typeof edge.target !== "string") {
                    if (((edge.target.id === nodeID && !this.isNodeDisabled(edge.source.id))|| (edge.source.id === nodeID && !this.isNodeDisabled(edge.target.id))) && this.isEdgeActive(edge.value)) {
                        oneActiveEdge = true;
                    }
                }
            })
        }
        return (this.props.graphDashboardStore!.activeNodes.length === 0 || this.props.graphDashboardStore!.activeNodes!.indexOf(nodeID) > -1)
            && !this.isNodeDisabled(nodeID) && oneActiveEdge;

    }

    isNodeHighlight(nodeID: string){
        return nodeID === this.props.graphDashboardStore?.highlightNode && this.isNodeActive(nodeID);
    }

    shiftClickNode(nodeID: string) {
        const clickedNodesIdx = this.props.graphDashboardStore?.clickedNodes.indexOf(nodeID);
        const activeNodesIdx = this.props.graphDashboardStore?.activeNodes.indexOf(nodeID);

        if (activeNodesIdx == -1) {
            if (clickedNodesIdx == -1) {
                this.props.graphDashboardStore?.pushClickedNode(nodeID);
                this.props.graphDashboardStore?.pushActiveNode(nodeID);
            } else {
                if (typeof clickedNodesIdx === "number") {
                    this.props.graphDashboardStore?.removeClickedNode(clickedNodesIdx);
                }
            }
        } else {
            if (typeof activeNodesIdx === "number") {
                this.props.graphDashboardStore?.removeActiveNode(activeNodesIdx);
            }
        }
        this.redrawElements()
    }

    clickNode(node: Node) {
        if(!this.props.graphDashboardStore?.mode){
            this.props.graphDashboardStore?.resetEdgeNodeSettings();
            this.props.graphDashboardStore?.pushClickedNode(node.id);
            this.props.graphDashboardStore?.pushActiveNode(node.id);
            this.setNeighborsActive(node.id);
        }
        else{
            this.props.graphDashboardStore?.resetEdgeNodeSettings();
            this.props.graphDashboardStore?.pushActiveNode(node.id);
            this.props.graphDashboardStore?.setHighlightNode(node.id);
            if(node.importantNodes && node.importantNodes?.length > 0){
                node.importantNodes.forEach((nodeID:string)=>{
                    console.log(nodeID)
                    this.props.graphDashboardStore?.pushActiveNode(nodeID);
                });
            }
        }
        this.redrawElements()
    }

    resetClickNode() {
        this.props.graphDashboardStore?.resetClickedNodes();
        this.props.graphDashboardStore?.resetActiveNodes();
        this.redrawElements()
    }

    // Edge functions

    isEdgeDisabled(edgeID: string){
        return this.props.graphDashboardStore!.disabledEdges.indexOf(edgeID) != -1;
    }

    isEdgeActive(edgeID: string){
        return (this.props.graphDashboardStore!.activeEdges.length === 0 || this.props.graphDashboardStore!.activeEdges!.indexOf(edgeID) > -1)
            && !this.isEdgeDisabled(edgeID);

    }

    clickEdge(edgeID:string) {
        this.props.graphDashboardStore?.resetEdgeNodeSettings();
        this.props.graphDashboardStore?.pushActiveEdge(edgeID);
        edges.map((edge) => {
            if (edge.value === edgeID && typeof edge.source !== "string" && typeof edge.target !== "string") {
                this.props.graphDashboardStore?.pushActiveNode(edge.source.id);
                this.props.graphDashboardStore?.pushActiveNode(edge.target.id);
            }
        })
        this.redrawElements()
    }

    getEdgeColor(edge:Edge) {
        const color = this.props.graphDashboardStore?.edgeColors[edge.value]
        return this.isNeighborLink(edge) ? `rgba(${color}, 1)` : `rgba(${color},0.2)`
    }

    //Neighbors

    setNeighborsActive(nodeID: string) {
        edges.map((edge) => {
            if(typeof edge.target !== "string" && typeof edge.source !== "string"){
                if (edge.target.id === nodeID) {
                    this.props.graphDashboardStore?.pushActiveNode(edge.source.id)
                } else if (edge.source.id === nodeID) {
                    this.props.graphDashboardStore?.pushActiveNode(edge.target.id)
                }
            }
        })
    }

    isNeighborLink(edge: Edge) {
        let clickedNodes = this.props.graphDashboardStore?.clickedNodes!;
        if(typeof edge.target !== "string" && typeof edge.source !== "string"){
            return this.isNodeActive(edge.target.id) && this.isNodeActive(edge.source.id) && this.isEdgeActive(edge.value) && (clickedNodes.length === 0 ||
                    (clickedNodes.indexOf(edge.target.id) > -1 || clickedNodes.indexOf(edge.source.id) > -1)) && this.isEdgeActive(edge.value);
        }
        return false;
    };

    // Text functions
    getTextColor(nodeID:string) {
        if(this.isNodeDisabled(nodeID)){
            return Colors.TEXT_DISABLED;
        }
        else if (this.props.graphDashboardStore?.activeNodes.length === 0) {
            return Colors.TEXT_ACTIVE
        } else if (this.isNodeActive(nodeID)) {
            return Colors.TEXT_ACTIVE
        }
        return Colors.TEXT_INACTIVE
    }

    constructor(props:props) {
        super(props);
    }

    redrawElements() {
        this.nodeElements.attr("stroke-width", (node: Node) => {
            return this.isNodeHighlight(node.id) ? 3 : 0;
        })
        this.nodeElements.attr("r", (node:Node) => {
            return this.getNodeRadius(node)
        })
        this.nodeElements.attr('fill', (node: Node) => {
            return this.getNodeColor(node.id)
        })
        this.textElements.attr('fill', (node: Node) => {
            return this.getTextColor(node.id)
        }).attr("dx", (node: Node) => {
            return 15 + this.getNodeRadius(node) / 2!
        }).text((node: Node) => {
            if(this.props.graphDashboardStore?.nodeLabelType === 0){
                return node.id
            }
            return node.label
        })

        this.edgeElements.attr('stroke', (edge: Edge) => {
            return this.getEdgeColor(edge)
        })
    }

    componentDidMount() {
        let isNodeHighlightProxy = (nodeId:string) => this.isNodeHighlight(nodeId);
        let isNodeDisabledProxy = (nodeId:string) => this.isNodeDisabled(nodeId);
        let shiftClickNodeProxy = (nodeId:string) => this.shiftClickNode(nodeId);
        let clickNodeProxy = (node:Node) => this.clickNode(node);
        let getNodeRadiusProxy = (node:Node) => this.getNodeRadius(node);
        let predictionMode = ()=>this.props.graphDashboardStore?.mode === 1;
        let getNodeColorProxy = (nodeId:string)=> this.getNodeColor(nodeId)

        let width = 800;
        let height = 600;
        let svg = d3.select('#graph')
        svg.attr('width', width).attr('height', height).on('click', () => {
            if (this.props.graphDashboardStore?.clickedNodes.length! > 0 || this.props.graphDashboardStore?.mode || this.props.graphDashboardStore?.activeEdges!.length! > 0) {
                this.resetClickNode()
                this.props.graphDashboardStore?.resetActiveEdges();
                this.props.graphDashboardStore?.setHighlightNode(null);
                this.redrawElements();
            }});

        // simulation setup with all forces
        let linkForce = d3
            .forceLink()
            .id(function(link:any) {
                return link.id
            })
        let simulation = d3.forceSimulation(nodes)
            .force('link', linkForce)
            .force('charge', d3.forceManyBody().strength(-2800))
            .force('x', d3.forceX(width / 2).strength(0.3))
            .force('y', d3.forceY(height / 2).strength(0.3))

        simulation.force<ForceLink<any, any>>("link")?.links(edges);
        simulation.stop();
        simulation.tick(500);

        let dragDrop = d3.drag()
            .on('start', function(event, node:any) {
                if (isNodeHighlightProxy(node.id)){
                    tooltipMouseleave(node);
                }
                node.fx = node.x;
                node.fy = node.y;
            }).on('drag', function(event, node:any) {
                simulation.alphaTarget(0).restart()
                node.fx = event.x
                node.fy = event.y
            }).on('end', function(event, node:any) {
                if (isNodeHighlightProxy(node.id)) tooltipMouseover(node);
                if (event.active) {
                    simulation.alphaTarget(0)
                }
                node.fx = null
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
            .attr("stroke", (edge:Edge) => this.getEdgeColor(edge))
            .on('click', (event, edge)=> {
                this.clickEdge(edge.value);
                event.stopPropagation();
            })

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
            .attr("r", function(node:Node){
                return getNodeRadiusProxy(node);
            })
            .attr("fill", function(node:Node){
                return getNodeColorProxy(node.id)
            })
            .attr("stroke-width", 0)
            .attr("stroke", "#303030")
            // @ts-ignore
            .call(dragDrop)
            .on('click', function(event, node:Node) {
                event.stopPropagation();
                if(!predictionMode()){
                    if (isNodeDisabledProxy(node.id)) {
                        return;
                    }
                    if (event.shiftKey) {
                        shiftClickNodeProxy(node.id);
                    } else {
                        clickNodeProxy(node)
                    }
                }
                else{
                    clickNodeProxy(node)
                }
            })
            .on("mouseenter", (event, node:Node) => {
                if (this.isNodeActive(node.id) && !event.shiftKey) {
                    tooltipMouseover(node)
                }
                if (!this.props.graphDashboardStore?.mode || (this.props.graphDashboardStore?.mode && this.props.graphDashboardStore.activeNodes.length == 0)) this.props.graphDashboardStore?.setHighlightNode(node.id);
                this.redrawElements();
            })
            .on("mouseleave", (event,node:Node) => {
                tooltipMouseleave(node)
                if (!this.props.graphDashboardStore?.mode || (this.props.graphDashboardStore?.mode && this.props.graphDashboardStore.activeNodes.length == 0)) this.props.graphDashboardStore?.setHighlightNode(null);
                this.redrawElements();
            })

        this.textElements = svg.append("g")
            .attr("class", "texts")
            .selectAll("text")
            .data(nodes)
            .enter()
            .append("text")
            .text(function(node) {
                return node.id
            })
            .attr('x', function(node) {
                return node.x!
            })
            .attr('y', function(node) {
                return node.y!
            })
            .attr("font-size", 15)
            .attr("dx", function(node) {
                return 15 + getNodeRadiusProxy(node) / 2!
            })
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
                .html(`Schadenfall: ${node.id}  <br> Name: ${node.label} ${predictionMode()? ("<br> Score: " + node.score):""}`);
            Tooltip
                // @ts-ignore
                .style("left", ((node.x!) - (Tooltip._groups[0][0].offsetWidth / 2) + "px"))
                // @ts-ignore
                .style("top", (node.y! - getNodeRadiusProxy(node) - 10  - Tooltip._groups[0][0].offsetHeight) + "px");
        }
        let tooltipMouseleave = function(node:Node) {
            Tooltip
                .style("opacity", 0)
                .style("z-index", -100)
                .style("left", 0 + "px")
                .style("top", 0 + "px");
        }
    }

    componentDidUpdate() {
        this.redrawElements();
    }

    render(){
        let trigger = this.props.graphDashboardStore?.mode;
        let trigger2 = this.props.graphDashboardStore?.activeEdges;
        let trigger3 =this.props.graphDashboardStore?.disabledEdges;
        let trigger4 =this.props.graphDashboardStore?.nodeLabelType;
        let trigger5 =this.props.graphDashboardStore?.nodeRadiusType;
        let trigger6 =this.props.graphDashboardStore?.disabledNodes;
        return <div id="graphBackground">
            <svg id="graph"/>
        </div>
    }
}

export default Graph;