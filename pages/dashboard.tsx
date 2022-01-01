import {inject} from "mobx-react";
import {observer} from "mobx-react-lite";
import {GraphDashboardStore} from "../stores/GraphDashboardStore";
import React, {ReactElement} from "react";
import Graph from "../components/graph";
React.useLayoutEffect = React.useEffect

type props = {
    graphDashboardStore?: GraphDashboardStore;
};

const Dashboard = inject("graphDashboardStore")(
    observer((props: props) => {
        return <Graph/>
    })
)

export default Dashboard;
