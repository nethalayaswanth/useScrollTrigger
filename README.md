
A React hook that allows you to trigger transitions based on scroll event (uses **Intersection observer**).

Written in **TypeScript**.

## Install

```sh
yarn add usescrolltrigger 
# or
npm install usescrolltrigger 
```

## Options

| Option   | Type                                                                                 | Description                                                                                                                   | Default        |
| -------- | ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- | -------------- |
| ref      | undefined &#124; RefObject &#124; HTMLElement                                        | A ref or element to observe.                                                                                                  | undefined      |
| onScroll     | (e:Event)=>void | undefined | call this handler on scroll
                                                              

## Response

| Name   | Type                    | Description                                    |
| ------ | ----------------------- | ---------------------------------------------- |
| containerRef    | RefCallback             | A callback to be passed to scroller "ref" prop. |
| register  | (Register)=>RegisterResponse | prop getter to  spread on component to register      |

## Register

| Name   | Type                    | Description                                    |
| ------ | ----------------------- | ---------------------------------------------- |
| name    | string(required)            | name for the component to register |
| start    | string | number           | offset from the bottom of scrollcontainer to trigger start  |
| end    | string | number              | offset from the bottom of scrollcontainer to trigger end|
| onStart  | (EventProps)=>void | call when  triggered on start      |
| onEnd  | (EventProps)=>void | call when reached the end      |
| onProgress  | (EventProps)=>void | call while progressing from start-end     |

## EventProps

| Name   | Type                    | Description                                    |
| ------ | ----------------------- | ---------------------------------------------- |
| node    | HTMLElement          | HTMLElement of the registered component |
| entry  | IntersectionObserverEntry | Intersection observer entry      |
| scrollingUp  | boolean | To indicate scrolling direction      |
| progress  | number | 0 to 1 from start-end     |

## Basic Usage


```tsx
import React from "react";
import useScrollTrigger from "usescrolltrigger ";

const App = () => {
  const { register } =useScrollTrigger<HTMLDivElement>();

  return (
    <div {...register({name,onProgress:({node,entry,scrollingUp,progress)=>{
    node.innerHtml=`${progress}`
    }})}>
<!--       component to track scrollposition in viewport -->
    </div>
  );
};
```


## License

MIT
