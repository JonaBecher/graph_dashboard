import {GraphDashboardStore} from "../stores/GraphDashboardStore";
import {inject, observer} from "mobx-react";
import {Component} from "react";

type props = {
    graphDashboardStore?: GraphDashboardStore;
};

@inject('graphDashboardStore')
@observer
class SideBoard extends Component<props> {

    render(){
        return <div>

        </div>
    }
}