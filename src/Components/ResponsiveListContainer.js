import React, { Children } from 'react'
import useWindowDimensions from '../Utils/WindowUtils';
import CollapsibleList from './CollapsibleList';

export default function ResponsiveListContainer({ children }) {
  // const arrayChildren = Children.toArray(children)
  const { height, width } = useWindowDimensions();

  function isMobileBrowser() {
    // TODO implement a shared function, perhaps in window utils
    return true;
  }
  
  // TODO implement horizontal container for desktop
  return (
    <>
      {  isMobileBrowser()  ? (
          <CollapsibleList>
            { children } 
          </CollapsibleList>
        ) : (
          <div>
            { children }
          </div>
        )      
      }
    </>
  );
}
