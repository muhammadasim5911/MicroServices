import{b3 as R,ar as k,aR as c,aQ as o,b4 as D,r as N,aU as w,aV as z,j as v,aZ as E,aX as U,b5 as F}from"./index-DL1Jt8Ad.js";const I=["className","color","disableShrink","size","style","thickness","value","variant"];let l=r=>r,b,P,S,$;const a=44,K=R(b||(b=l`
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
`)),V=R(P||(P=l`
  0% {
    stroke-dasharray: 1px, 200px;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 100px, 200px;
    stroke-dashoffset: -15px;
  }

  100% {
    stroke-dasharray: 100px, 200px;
    stroke-dashoffset: -125px;
  }
`)),W=r=>{const{classes:s,variant:e,color:t,disableShrink:d}=r,u={root:["root",e,`color${c(t)}`],svg:["svg"],circle:["circle",`circle${c(e)}`,d&&"circleDisableShrink"]};return U(u,F,s)},Z=k("span",{name:"MuiCircularProgress",slot:"Root",overridesResolver:(r,s)=>{const{ownerState:e}=r;return[s.root,s[e.variant],s[`color${c(e.color)}`]]}})(({ownerState:r,theme:s})=>o({display:"inline-block"},r.variant==="determinate"&&{transition:s.transitions.create("transform")},r.color!=="inherit"&&{color:(s.vars||s).palette[r.color].main}),({ownerState:r})=>r.variant==="indeterminate"&&D(S||(S=l`
      animation: ${0} 1.4s linear infinite;
    `),K)),B=k("svg",{name:"MuiCircularProgress",slot:"Svg",overridesResolver:(r,s)=>s.svg})({display:"block"}),G=k("circle",{name:"MuiCircularProgress",slot:"Circle",overridesResolver:(r,s)=>{const{ownerState:e}=r;return[s.circle,s[`circle${c(e.variant)}`],e.disableShrink&&s.circleDisableShrink]}})(({ownerState:r,theme:s})=>o({stroke:"currentColor"},r.variant==="determinate"&&{transition:s.transitions.create("stroke-dashoffset")},r.variant==="indeterminate"&&{strokeDasharray:"80px, 200px",strokeDashoffset:0}),({ownerState:r})=>r.variant==="indeterminate"&&!r.disableShrink&&D($||($=l`
      animation: ${0} 1.4s ease-in-out infinite;
    `),V)),Q=N.forwardRef(function(s,e){const t=w({props:s,name:"MuiCircularProgress"}),{className:d,color:u="primary",disableShrink:_=!1,size:p=40,style:j,thickness:i=3.6,value:f=0,variant:x="indeterminate"}=t,M=z(t,I),n=o({},t,{color:u,disableShrink:_,size:p,thickness:i,value:f,variant:x}),h=W(n),m={},g={},y={};if(x==="determinate"){const C=2*Math.PI*((a-i)/2);m.strokeDasharray=C.toFixed(3),y["aria-valuenow"]=Math.round(f),m.strokeDashoffset=`${((100-f)/100*C).toFixed(3)}px`,g.transform="rotate(-90deg)"}return v.jsx(Z,o({className:E(h.root,d),style:o({width:p,height:p},g,j),ownerState:n,ref:e,role:"progressbar"},y,M,{children:v.jsx(B,{className:h.svg,ownerState:n,viewBox:`${a/2} ${a/2} ${a} ${a}`,children:v.jsx(G,{className:h.circle,style:m,ownerState:n,cx:a,cy:a,r:(a-i)/2,fill:"none",strokeWidth:i})})}))});export{Q as C};
