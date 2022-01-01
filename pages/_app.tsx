import App from "next/app";
import React from "react";
import { Provider } from "mobx-react";
import 'tailwindcss/tailwind.css'
import '../styles/globals.css'
import {GraphDashboardStore} from "../stores/GraphDashboardStore";

class MyApp extends App {
  state = {
    dataStore: new GraphDashboardStore()
  };

  render() {
    const { Component, pageProps } = this.props;
    return (
        <Provider graphDashboardStore={this.state.dataStore}>
          <Component {...pageProps} />
        </Provider>
    );
  }
}
export default MyApp;
