import React from 'react';
import { StackActions } from '@react-navigation/native';

export const navContainerRef = React.createRef();

export const navReadyRef = React.createRef();

export function navigate(...args) {
  navContainerRef.current?.navigate(...args);
}

export function push(...args) {
  navContainerRef.current?.dispatch(StackActions.push(...args));
}

export function goBack(...args) {
  navContainerRef.current?.goBack(...args);
}

// export function addNavListener(...args) {
//   navContainerRef.current?.addListener(...args);
// }

//navigate to an existing stack route pops back to it
export function resetToBase() {
  navContainerRef.current?.navigate('Base');
}
