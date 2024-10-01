import{r as i,j as e,p as m,a0 as l,V as p,T as c,H as d,C as u}from"./index-DL1Jt8Ad.js";import{E as h}from"./editor-kC7tMTVT.js";import{M as x}from"./markdown--6Fb_v5k.js";import{C as f}from"./custom-breadcrumbs-BnRAtXEh.js";import{C}from"./component-hero-Dnp2-7pN.js";import{C as g}from"./component-block-Yk10evpN.js";import{C as j}from"./Card-D34WoXxi.js";import{F as k}from"./FormControlLabel-DO_7mapf.js";import"./TextField-prTTCh1h.js";import"./FormControl-u1hJPkcW.js";import"./InputLabel-BV_hI8Sk.js";import"./FormLabel-CGHS3xCN.js";import"./Select-BW0ewmGC.js";import"./Menu-CXRKD-Bk.js";import"./FormHelperText-CTilPwLt.js";import"./index-C-fod-cp.js";import"./html-to-markdown-V0C04--V.js";import"./image-DNiYRyc2.js";const z=`

<h4>This is Heading 4</h4>
<code>This is code</code>

<pre><code class="language-javascript">for (var i=1; i &#x3C;= 20; i++) {
  if (i % 15 == 0)
    return "FizzBuzz"
  else if (i % 3 == 0)
    return "Fizz"
  else if (i % 5 == 0)
    return "Buzz"
  else
    return i
  }</code></pre>
`;function E(){const[r,s]=i.useState(!0),[o,a]=i.useState(z),n=t=>{s(t.target.checked)};return e.jsxs(e.Fragment,{children:[e.jsx(C,{children:e.jsx(f,{heading:"Editor",links:[{name:"Components",href:m.components},{name:"Editor"}],moreLink:["https://tiptap.dev/docs/editor/introduction"]})}),e.jsxs(g,{maxWidth:!1,sx:{rowGap:5,columnGap:3,display:"grid",gridTemplateColumns:{xs:"repeat(1, 1fr)",md:"repeat(2, 1fr)"}},children:[e.jsxs(j,{sx:{p:3,gap:2,flexShrink:0,display:"flex",flexDirection:"column"},children:[e.jsx(k,{control:e.jsx(l,{name:"fullItem",checked:r,onChange:n}),label:"Full item",labelPlacement:"start",sx:{ml:"auto"}}),e.jsx(h,{fullItem:r,value:o,onChange:t=>a(t),sx:{maxHeight:720}})]}),e.jsxs(p,{spacing:1,sx:{p:3,borderRadius:2,overflowX:"auto",bgcolor:"background.neutral"},children:[e.jsx(c,{variant:"h6",children:"Preview"}),e.jsx(x,{children:o})]})]})]})}const F={title:`Editor | Components - ${u.appName}`};function W(){return e.jsxs(e.Fragment,{children:[e.jsx(d,{children:e.jsxs("title",{children:[" ",F.title]})}),e.jsx(E,{})]})}export{W as default};
