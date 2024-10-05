import{r as i,j as e,p as m,a0 as l,V as p,T as c,H as d,C as u}from"./index-BaPXjGxN.js";import{E as h}from"./editor-D_JLe7O5.js";import{M as x}from"./markdown-BMxcm5uO.js";import{C as f}from"./custom-breadcrumbs--HFs1NOs.js";import{C}from"./component-hero-SBnkOQPt.js";import{C as g}from"./component-block-D47r3CZ_.js";import{C as j}from"./Card-JHFo7qEm.js";import{F as k}from"./FormControlLabel-CK70AJ1o.js";import"./TextField-Drlo-FL6.js";import"./FormControl-BO4mCaBo.js";import"./InputLabel-CttRx1rL.js";import"./FormLabel-CN14N0LP.js";import"./Select-Sri7NYZU.js";import"./Menu-CzuX4Dtn.js";import"./FormHelperText-Bf7Bz5up.js";import"./index-CoKhcYPX.js";import"./html-to-markdown-doMESucG.js";import"./image-7JXEclsy.js";const z=`

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
