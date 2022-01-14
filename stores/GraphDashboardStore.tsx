import {action, makeObservable, observable} from "mobx";
import {enableStaticRendering} from "mobx-react";
import React from "react";
import {GetColors} from "../helper/getColors";
import EdgeCheckBox from "../components/edgeCheckBox";

const isServer = typeof window === "undefined";

// eslint-disable-next-line react-hooks/rules-of-hooks
enableStaticRendering(isServer);

type d3NodeExtra = {
    vx?: number,
    vy?: number,
    x?: number,
    y?: number,
}

type Node = d3NodeExtra & {
    id: string,
    label: string,
    date: string,
    score: number,
    schadenhoehe: number,
    importantNodes?: string[]
}

type Edge = {
    target: string | Node,
    source: string | Node,
    value: string,
}
// @ts-ignore
export {Edge, Node};

let data = require('./data.json');

let nodes:Node[] = data.nodes;
export {nodes};

let edges:Edge[] = data.edges;
export {edges};

function parseDate(s:any) {
    let p = s.split('.');
    return new Date(p[2], parseInt(p[1]) - 1, p[0], 1);
}
export {parseDate}

export class GraphDashboardStore {

    @observable activeNodes: string[] = observable([]);
    @observable disabledNodes: string[] = observable([]);
    @observable clickedNodes: string[]  = observable([]); //toDo: selected Node

    @observable activeEdges: string[] = observable([]);
    @observable disabledEdges: string[] = observable([]);

    @observable highlightNode:string|null = null;
    @observable selectedDate:string|null = null;

    @observable mode:number = 0;
    @observable nodeLabelType:number = 0;
    @observable nodeRadiusType:number = 0;
    @observable searchStrings: string[] = observable([]);

    reasonDisabledNodes:[string[]] = [[]];
    reasonNotDisabledNodes:[string[]] = [[]];

    edgeColors:{ [Key: string] : string; } = {}

    edge_values:any = [];

    @action
    setSelectedDate(selectedDate:string){
        this.reasonDisabledNodes[0] = [];
        this.selectedDate = selectedDate;
        nodes.forEach((node) => {
            if (parseDate(node.date) > parseDate(selectedDate)) {
                this.reasonDisabledNodes[0].push(node.id)
            }
        });
        let toDisabledNodes:string[] = [];
        this.reasonDisabledNodes.forEach((list:string[])=>{
            list.forEach((item)=>{
                toDisabledNodes.push(item)
            });
        })
        let toNotDisabledNodes:string[] = [];
        this.reasonNotDisabledNodes.forEach((list:string[])=>{
            list.forEach((item)=>{
                toNotDisabledNodes.push(item)
            });
        })
        // @ts-ignore
        toDisabledNodes =  [...new Set(toDisabledNodes)]

        toDisabledNodes = toDisabledNodes.filter( (el:string)=>{
            return toNotDisabledNodes.indexOf( el ) < 0;
        } );

        this.disabledNodes = toDisabledNodes
    }

    @action
    pushSearchString(searchString:string){
        this.searchStrings.push(searchString);
        let toDisabledNodes:any = [];
        let toNotDisabledNodes:any = [];
        nodes.forEach((node)=>{
            if(node.id.toLowerCase().match(searchString.toLowerCase()) === null && node.label.toLowerCase().match(searchString.toLowerCase()) === null){
                toDisabledNodes.push(node.id);
            }
            else{
                toNotDisabledNodes.push(node.id);
            }
        })
        this.reasonDisabledNodes.push(toDisabledNodes);
        this.reasonNotDisabledNodes.push(toNotDisabledNodes);
        toDisabledNodes = [];
        this.reasonDisabledNodes.forEach((list:string[])=>{
            list.forEach((item)=>{
                toDisabledNodes.push(item)
            });
        })
        toNotDisabledNodes = [];
        this.reasonNotDisabledNodes.forEach((list:string[])=>{
            list.forEach((item)=>{
                toNotDisabledNodes.push(item)
            });
        })
        // @ts-ignore
        toDisabledNodes =  [...new Set(toDisabledNodes)]

        toDisabledNodes = toDisabledNodes.filter( (el:string)=>{
            return toNotDisabledNodes.indexOf( el ) < 0;
        } );

        this.disabledNodes = toDisabledNodes
    }

    @action
    removeSearchString(index:number){
        this.searchStrings.splice(index-1, 1);
        this.reasonDisabledNodes.splice(index, 1);
        this.reasonNotDisabledNodes.splice(index, 1);

        let toDisabledNodes:string[] = [];
        this.reasonDisabledNodes.forEach((list:string[])=>{
            list.forEach((item)=>{
                toDisabledNodes.push(item)
            });
        })
        let toNotDisabledNodes:string[] = [];
        this.reasonNotDisabledNodes.forEach((list:string[])=>{
            list.forEach((item)=>{
                toNotDisabledNodes.push(item)
            });
        })
        // @ts-ignore
        toDisabledNodes =  [...new Set(toDisabledNodes)]

        toDisabledNodes = toDisabledNodes.filter( (el:string)=>{
            return toNotDisabledNodes.indexOf( el ) < 0;
        } );

        this.disabledNodes = toDisabledNodes
    }

    @action
    setNodeRadiusType(nodeRadiusType: number){
        this.nodeRadiusType = nodeRadiusType;
    }

    @action
    setNodeLabelType(nodeLabelType: number){
        this.nodeLabelType = nodeLabelType;
    }

    @action
    setMode(mode: number){
        this.mode = mode;
    }

    @action
    pushClickedNode(nodeID:string){
        this.clickedNodes.push(nodeID);
    }

    @action
    removeClickedNode(index:number){
        this.clickedNodes.splice(index, 1);
    }

    @action
    resetClickedNodes(){
        this.clickedNodes = [];
    }

    @action
    pushActiveNode(nodeID:string){
        this.activeNodes.push(nodeID);
    }

    @action
    removeActiveNode(index:number){
        this.activeNodes.splice(index,1);
    }

    @action
    resetActiveNodes(){
        this.activeNodes = [];
    }

    @action
    setHighlightNode(nodeID:string|null){
        this.highlightNode = nodeID;
    }

    @action
    resetActiveEdges(){
        this.activeEdges = [];
    }

    @action
    removeActiveEdge(value:string){
        this.activeEdges = this.activeEdges.filter(function(item) {
            return item !== value
        })
    }

    @action
    pushActiveEdge(edgeId:string){
        this.activeEdges.push(edgeId);
    }

    @action
    resetDisabledEdges(){
        this.disabledEdges = [];
    }

    @action
    removeDisabledEdge(value:string){
        this.disabledEdges = this.disabledEdges.filter(function(item) {
            return item !== value
        })
    }

    @action
    pushDisabledEdge(edgeId:string){
        this.disabledEdges.push(edgeId);
    }

    @action
    resetEdgeNodeSettings() {
        this.activeNodes = [];
        this.clickedNodes = [];
        this.activeEdges = [];
    }

    constructor() {
        edges.forEach((edge)=>{
            // @ts-ignore
            this.edge_values.push(edge.value)
        });
        this.edge_values = new Set(this.edge_values);
        this.edge_values.forEach((edge:string)=>{
            this.edgeColors[edge] = GetColors.generate() as string;
        })
        makeObservable(this);
    }
}

