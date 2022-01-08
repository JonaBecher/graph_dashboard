import {action, makeObservable, observable} from "mobx";
import {enableStaticRendering} from "mobx-react";
import React from "react";

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
    score: number
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

export class GraphDashboardStore {

    @observable activeNodes: string[] = observable([]);
    @observable disabledNodes: string[] = observable([]);
    @observable clickedNodes: string[]  = observable([]); //toDo: selected Node

    @observable clickedEdge:string|null = null;

    @observable highlightNode:string|null = null;
    @observable selectedDate:string|null = null;

    @observable mode:number = 0;

    @action
    setPredictionMode(mode: number){
        console.log(mode)
        this.mode = mode;
        console.log(this.mode)
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
    setClickedEdge(edgeId:string|null){
        this.clickedEdge = edgeId;
    }

    @action
    resetEdgeNodeSettings() {
        this.activeNodes = [];
        this.clickedEdge = null;
        this.clickedNodes = [];
    }

    constructor() {
        makeObservable(this);
    }
}

