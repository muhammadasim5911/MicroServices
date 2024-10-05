import{j as t,p as s,eU as a,H as n,C as o}from"./index-BaPXjGxN.js";import{M as e}from"./markdown-BMxcm5uO.js";import{C as l}from"./custom-breadcrumbs--HFs1NOs.js";import{C as h}from"./component-hero-SBnkOQPt.js";import{C as p,a as r}from"./component-block-D47r3CZ_.js";import"./html-to-markdown-doMESucG.js";import"./image-7JXEclsy.js";import"./index-CoKhcYPX.js";const i=a.image.cover(18),d=`
<h1>h1</h1>
<h2>h2</h2>
<p> <strong>Paragraph</strong> Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups</p>
<p>
  <a href='https://www.google.com/'>Link (https://www.google.com/)</a>
</p>

<h6>Lists</h6>
<ul>
  <li>
    <input type="checkbox" disabled="" checked=""> Write the press release
  </li>
  <li>
    <input type="checkbox" disabled=""> Update the website
  </li>
  <li>
    <input type="checkbox" disabled=""> Contact the media
  </li>
</ul>

<hr/>

<h6>A table:</h6>

<table>
  <thead>
    <tr>
      <th style="text-align: left;">Syntax</th>
      <th style="text-align: center;">Description</th>
      <th style="text-align: right;">Test Text</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="text-align: left;">Header</td>
      <td style="text-align: center;">Title</td>
      <td style="text-align: right;">Here's this</td>
    </tr>
    <tr>
      <td style="text-align: left;">Paragraph</td>
      <td style="text-align: center;">Text</td>
      <td style="text-align: right;">And more</td>
    </tr>
  </tbody>
</table>

<code>Code inline</code>

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

<p><img alt='cover' src=${i}></p>

<blockquote> <p>A block quote with <s>strikethrough</s> and a URL: <a href='https://reactjs.org'>https://reactjs.org</a>.</p> </blockquote>
`,c=`
# h1

## h2

**Paragraph** Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.

[Link (https://www.google.com/)](https://www.google.com/)

###### Lists
- [x] Write the press release
- [ ] Update the website
- [ ] Contact the media

---

###### A table:


| Syntax      | Description | Test Text     |
| :---        |    :----:   |          ---: |
| Header      | Title       | Here's this   |
| Paragraph   | Text        | And more      |

\`code inline\`

\`\`\`tsx
for (var i=1; i &#x3C;= 20; i++) {
  if (i % 15 == 0)
    return "FizzBuzz"
  else if (i % 3 == 0)
    return "Fizz"
  else if (i % 5 == 0)
    return "Buzz"
  else
    return i
  }
\`\`\`

![cover](${i})

> A block quote with ~~strikethrough~~ and a URL: [https://reactjs.org](https://reactjs.org).
`;function m(){return t.jsxs(t.Fragment,{children:[t.jsx(h,{children:t.jsx(l,{heading:"Markdown",links:[{name:"Components",href:s.components},{name:"Markdown"}],moreLink:["https://www.npmjs.com/package/react-markdown"]})}),t.jsxs(p,{sx:{rowGap:5,columnGap:3,display:"grid",gridTemplateColumns:{xs:"repeat(1, 1fr)",md:"repeat(2, 1fr)"}},children:[t.jsx(r,{title:"Html content",sx:{pt:0},children:t.jsx(e,{children:d})}),t.jsx(r,{title:"Mardown content",sx:{pt:0},children:t.jsx(e,{children:c})})]})]})}const g={title:`Markdown | Components - ${o.appName}`};function C(){return t.jsxs(t.Fragment,{children:[t.jsx(n,{children:t.jsxs("title",{children:[" ",g.title]})}),t.jsx(m,{})]})}export{C as default};
