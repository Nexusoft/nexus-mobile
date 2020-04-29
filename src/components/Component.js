import React from "react";
import { View } from "react-native";

export default ({ as: Component = View, ...props }) => <Component {...props} />;
