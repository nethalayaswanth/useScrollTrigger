import*as e from"react";import{useLayoutEffect as t,useEffect as n,useRef as r,useCallback as i,useState as o,useMemo as s}from"react";function c(){return c=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},c.apply(this,arguments)}function u(e,t){if(null==e)return{};var n,r,i={},o=Object.keys(e);for(r=0;r<o.length;r++)t.indexOf(n=o[r])>=0||(i[n]=e[n]);return i}var a=function(e,t,n){return Math.max(t,Math.min(e,n))};function l(){var e=arguments;return function(t){[].slice.call(e).forEach(function(e){"function"==typeof e?e(t):null!=e&&(e.current=t)})}}function d(e,t,n){return e[t]?e[t][0]?e[t][0][n]:e[t][n]:"contentBoxSize"===t?e.contentRect["inlineSize"===n?"width":"height"]:void 0}var f=["root"],h=["node"],v=/*#__PURE__*/function(){function e(){this.nodes=new Map,this.visibleNodes=new Map,this.animatingNodes=new Set,this.observer=null,this.scroller=null,this.direction=null,this.mounted=!1,this.prevYPosition=0,this.scroll=!0}var t=e.prototype;return t.setScrollDirection=function(e){this.direction=e<this.prevYPosition?"down":"up",this.prevYPosition=e},t.handleIntersecting=function(e){var t=e.target;if(e.isIntersecting)this.visibleNodes.set(t,e),t.classList.add("trigger");else{var n;if(!this.direction)return;var r="up"===this.direction;t.classList.remove("trigger"),t.style.setProperty("--trigger",r?" 1":" 0"),t.style.setProperty("--trigger-px",r&&null!=(n=t.dataset.end)?n:"0")}},t.updateEntries=function(e){var t=this;this.visibleNodes=new Map,e.forEach(function(e){t.handleIntersecting(e)})},t.caluclatePosition=function(e){if(!e)return[0,0];var t=e.boundingClientRect,n=t.top;if(!e.rootBounds)return[0,0];var r=e.rootBounds.height-40,i=0,o=r+t.height,s=e.target;s.dataset.start&&(i=parseInt(s.dataset.start,10)),s.dataset.end&&(o=parseInt(s.dataset.end,10));var c=o-i,u=r-n-i;return[a(u/c,0,1),a(u,0,c)]},t.update=function(){var e=this;this.visibleNodes.forEach(function(t,n){var r=n.style,i=e.caluclatePosition(t),o=i[0],s=i[1],c="up"===e.direction,u=e.nodes.get(n),a=u.onStart,l=u.onProgress,d=u.onEnd;o>0&&o<1?(e.animatingNodes.has(n)||(e.animatingNodes.add(n),c&&a({node:n,entry:t,scrollingUp:c,progress:o})),l({node:n,entry:t,scrollingUp:c,progress:o})):0!==o&&1!==o||e.animatingNodes.has(n)&&(1===o&&d({node:n,entry:t,scrollingUp:c,progress:o}),e.animatingNodes.delete(n)),r.setProperty("--trigger",""+o),r.setProperty("--trigger-px",""+s)})},t.initObserver=function(t){var n=this,r=t.root,i=u(t,f);this.scroller=r,this.observer=new IntersectionObserver(function(e,t){n.updateEntries(e),n.update()},c({root:r,rootMargin:e.ROOTMARGINEXT+"px 0px"},i))},t.init=function(e){return this.initObserver(e),this.observeAll(),this.onScroll(),this},t.add=function(e){var t=e.node,n=u(e,h);this.nodes.set(t,n),t.style.setProperty("--trigger","0"),t.style.setProperty("--trigger-px","0"),this.observe(t)},t.observe=function(e){this.observer&&this.observer.observe(e)},t.unobserve=function(e){this.observer&&this.observer.unobserve(e)},t.destroy=function(){this.observer&&this.observer.disconnect()},t.observeAll=function(){var e=this;this.nodes.forEach(function(t,n){e.observe(n)})},t.onScroll=function(e){var t=this;if(e&&this.mounted){if(!(e.target instanceof HTMLElement||e.target instanceof Window))return;var n=e.target instanceof HTMLElement?e.target.scrollTop:e.target instanceof Document?e.target.documentElement.scrollTop:e.target instanceof Window?e.target.scrollX:0;this.mounted=!0,this.setScrollDirection(n)}this.visibleNodes&&0!==this.visibleNodes.size&&this.visibleNodes.forEach(function(e,n){t.unobserve(n),t.observe(n)})},e}();v.ROOTMARGINEXT=0;var g="undefined"!=typeof window?t:n;function b(e,t){var n=r(null),o=r(null);o.current=t;var s=r(null),c=i(function(){var t=o.current,r=s.current||(t?t instanceof Element?t:t.current:null);n.current&&n.current.element===r&&n.current.subscriber===e||(n.current&&n.current.cleanup&&n.current.cleanup(),n.current={element:r,subscriber:e,cleanup:r?e(r):void 0})},[e]);return g(function(){c()}),g(function(){return function(){n.current&&n.current.cleanup&&(n.current.cleanup(),n.current=null)}},[]),i(function(e){s.current=e,c()},[c])}var p=["name","ref","style"],m=function(a){var f,h,g=a.root,m=a.onScroll,y=i(function(){return g?"string"==typeof g?document.getElementById(g):g instanceof HTMLElement?g:g.current:document.documentElement},[g]),x=o(function(){return new v})[0],w=(h=e.useRef(f=m),e.useEffect(function(){h.current=f}),h);t(function(){x.init({root:y()})},[y,x]);var E=b(function(e){var t=function(e){x.onScroll(e),null==w.current||w.current(e)};return e.addEventListener("scroll",t,{passive:!0}),function(){x.destroy(),e.removeEventListener("scroll",t,{passive:!0})}},y()),S=function(e){void 0===e&&(e={});var t=e.onResize,c=r(void 0);c.current=t;var u=e.round||Math.round,a=r(),l=o({width:void 0,height:void 0}),f=l[0],h=l[1],v=r(!1);n(function(){return v.current=!1,function(){v.current=!0}},[]);var g=r({width:void 0,height:void 0}),p=b(i(function(t){return a.current&&a.current.box===e.box&&a.current.round===u||(a.current={box:e.box,round:u,instance:new ResizeObserver(function(t){var n=t[0],r="border-box"===e.box?"borderBoxSize":"device-pixel-content-box"===e.box?"devicePixelContentBoxSize":"contentBoxSize",i=d(n,r,"inlineSize"),o=d(n,r,"blockSize"),s=i?u(i):void 0,a=o?u(o):void 0;if(g.current.width!==s||g.current.height!==a){var l={width:s,height:a};g.current.width=s,g.current.height=a,c.current?c.current(l):v.current||h(l)}})}),a.current.instance.observe(t,{box:e.box}),function(){a.current&&a.current.instance.unobserve(t)}},[e.box,u]),e.ref);return s(function(){return{ref:p,width:f.width,height:f.height}},[p,f.width,f.height])}({ref:y(),onResize:i(function(){x.observeAll()},[x])}).ref;return{register:function(e){var t=e.name,n=e.ref,r=e.style,i=u(e,p);return{id:""+t,ref:l(function(e){e&&function(e){var t=e.node,n=e.end;t.dataset.start=e.start,t.dataset.end=n,x.add(e)}(c({node:e,name:t},i))},n),style:c({},r)}},scrollerRef:s(function(){return l(E,S)},[E,S])}};export{m as default,m as useScrollTrigger};
//# sourceMappingURL=index.module.js.map
