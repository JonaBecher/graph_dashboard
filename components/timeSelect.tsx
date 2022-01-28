import {inject, observer} from "mobx-react";
import {GraphDashboardStore, edges, nodes, Edge, Node, parseDate} from "../stores/GraphDashboardStore";
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
class TimeSelect extends Component<props> {
    dateElements:any;

    componentDidMount() {
        let setSelectedDateProxy = (selectedDate:string)=>{
            this.props.graphDashboardStore?.setSelectedDate(selectedDate);
        }

        let margin = {
                top: 30,
                right: 0,
                bottom: 10,
                left: 0
            },
            widthCal = 370 - margin.left - margin.right,
            heightCal = 165 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        let cal = d3.select("#timeselect")
        cal
            .attr("width", widthCal + margin.left + margin.right)
            .attr("height", heightCal + margin.top + margin.bottom)
            .append("g")



        // Labels of row and columns
        let month = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"]
        let weeks = ["4", "3", "2", "1"]

        // Build X scales and axis:
        let x = d3.scaleBand()
            .range([0, widthCal])
            .domain(month)
            .padding(0.01);
        cal.append("g")
            .attr("transform", "translate(0," + heightCal + ")")
            .call(d3.axisBottom(x).tickSize(0))
            .select(".domain").remove()

        // Build X scales and axis:
        let y = d3.scaleBand()
            .range([heightCal, 0])
            .domain(weeks)
            .padding(0.01);
        cal.append("g")
            .call(d3.axisLeft(y).tickSize(0))
            .attr("margin", -20)
            .select(".domain").remove();

        // Build color scale
        let myColor = d3.scaleLinear()
            // @ts-ignore
            .range(["#a8c7ff", "#2F5496"])
            .domain([0, 1])

        function computeDate(datum:any) {
            let dateIndex = datum.getDate();
            let dateClass = "1";
            if (dateIndex > 7 && dateIndex < 15) {
                dateClass = "2"
            } else if (dateIndex > 14 && dateIndex < 22) {
                dateClass = "3"
            } else if (dateIndex > 21) {
                dateClass = "4"
            }
            return dateClass
        }

        function computeMonth(datum:any) {
            let monthIndex = datum.getMonth();
            return month[monthIndex]
        }

        month.forEach((month) => {
            weeks.forEach((week) => {
                cal.selectAll()
                    // @ts-ignore
                    .data([1], function(d:any) {
                        return d
                    })
                    .enter()
                    .append("rect")
                    // @ts-ignore
                    .attr("x", function(d) {
                        return x(month)
                    })
                    // @ts-ignore
                    .attr("y", function(d) {
                        return y(week)
                    })
                    .attr("stroke-width", 2)
                    .attr("stroke", "white")
                    .attr("width", x.bandwidth() - 2)
                    .attr("height", y.bandwidth() - 2)
                    .style("fill", "rgb(229,229,229)")
            });
        });

        this.dateElements = cal.selectAll()
            .data(nodes.filter((node)=>parseDate(node.date).getFullYear() == this.props.graphDashboardStore?.currentYear), function(d:any) {
                let day = computeDate(parseDate(d.date));
                let month = computeMonth(parseDate(d.date));
                d.day = day;
                d.month = month;
                d.year = parseDate(d.date).getFullYear();
                return d
            })
            .enter()
            .append("rect")
            // @ts-ignore
            .attr("x", function(d:any) {
                return x(d.month)
            })
            // @ts-ignore
            .attr("y", function(d:any) {
                return y(d.day)
            })
            .attr("stroke-width", 2)
            .attr("stroke", "white")
            .attr("width", x.bandwidth() - 2)
            .attr("height", y.bandwidth() - 2)
            .attr("overflow", "visible")
            .style("fill", function(d) {
                return myColor(d.score)
            })
            .on('click', function(event, calendarDate) {
                setSelectedDateProxy(calendarDate.date);
            })
    }

    redrawElements(){
        this.componentDidMount();
        this.dateElements.attr('stroke', (date: any) => {
            if (date.date === this.props.graphDashboardStore?.selectedDate) return "#080808"
            return "white";
        })
    }

    componentDidUpdate() {
        this.redrawElements();
    }

    render(){
        let trigger1 = this.props.graphDashboardStore?.selectedDate;
        let trigger2 = this.props.graphDashboardStore?.currentYear;
        return <div>
            <div className="flex flex-row-reverse items-center content-end -mt-8">
                <div className="text-4xl text-slate-700 h-full -mt-2 pl-2  cursor-pointer" onClick={()=>{
                    this.props.graphDashboardStore?.setCurrentYear( this.props.graphDashboardStore?.currentYear+1)
                }
                }>🢒</div>
                {this.props.graphDashboardStore?.currentYear}
                <div className="text-4xl text-slate-700 h-full -mt-2 pr-2  cursor-pointer"onClick={()=>{
                    this.props.graphDashboardStore?.setCurrentYear( this.props.graphDashboardStore?.currentYear-1)
                }}>{"🢐"}</div>
            </div>
            <svg className="overflow-visible ml-2 text-slate-500 txt-sm" id="timeselect"/>
        </div>
    }
}

export default TimeSelect;