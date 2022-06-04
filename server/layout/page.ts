import { type ParsedRequest } from "../request.ts"

export default (request: ParsedRequest, headerContent: string, mainContent: string): string =>
  `<!doctype html>
<html>
  ${head()}
  ${body(request, headerContent, mainContent)}
</html>`

const head = (): string =>
  `<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="keywords" content="turtle graphics, programming, coding, education, learn to code">
  <meta name="description" content="The Turtle System is a free educational program developed at the University of Oxford, designed to support the Computer Science component of the UK National Curriculum.">
  <meta name="theme-color" content="#159d6b">
  <link rel="icon" type="image/x-icon" href="/images/favicon.ico">
  <link rel="apple-touch-icon" href="/images/turtle-152x152.png">
  <link rel="manifest" href="/js/manifest.json">
  <script src="https://kit.fontawesome.com/03273b8e38.js" crossorigin="anonymous"></script>
  <link href="/css/screen.css" rel="stylesheet">
  <title>The Turtle System</title>
  <script defer src="/js/index.js"></script>
  <script>(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','//www.google-analytics.com/analytics.js','ga');ga('create', 'UA-54853004-1', 'auto');ga('send', 'pageview');</script>
</head>`

const body = (request: ParsedRequest, headerContent: string, bodyContent: string): string =>
  `<body class="${request.sections[0]}">
  ${nav(request)}
  <div class="wrapper" data-action="closeSiteMenus">
    <div class="container">
      ${header(headerContent)}
      ${main(bodyContent)}
      ${footer()}
    </div>
  </div>
</body>`

const nav = (request: ParsedRequest): string =>
  `<nav class="site-nav">
  <div class="site-nav-left">
    <div class="site-menu">
      <a data-action="toggleMenu" data-arg="site">
        <span class="icon logo"><img src="/images/turtle.png" alt="turtle logo"></img></span>
        <span class="text">The Turtle System</span>
        <span class="icon"><i class="fa fa-caret-down"></i></span>
      </a>
      <div class="site-sub-menu" data-menu="site">
        <a href="/" class="${sectionId(request) === "index" ? "active" : ""}">
          <span class="icon logo"><img src="/images/turtle.png" alt="turtle logo"></img></span>
          <span class="text">The Turtle System</span>
        </a>
        <a href="/run" class="${sectionId(request) === "run" ? "active" : ""}">
          <span class="icon"><i class="fa fa-play"></i></span>
          <span class="text">Run</span>
        </a>
        <div class="site-menu">
          <a class="" data-action="toggleMenu" data-arg="documentation">
            <span class="icon"><i class="fa fa-book"></i></span>
            <span class="text">Documentation</span>
            <span class="icon"><i class="fa fa-caret-down"></i></span>
          </a>
          <div class="site-sub-menu" data-menu="documentation">
            <a href="/documentation/system" class="${pageId(request) === "system" ? "active" : ""}">Turtle System User Guide</a>
            <a href="/documentation/help" class="${pageId(request) === "help" ? "active" : ""}">Turtle Languages Help</a>
            <a href="/documentation/reference" class="${
              pageId(request) === "reference" ? "active" : ""
            }">Commands &amp; Constants Reference</a>
            <a href="/documentation/exercises" class="${pageId(request) === "exercises" ? "active" : ""}">Self-Teach Exercises</a>
            <a href="/documentation/machine" class="${
              pageId(request) === "machine" ? "active" : ""
            }">Turtle Machine Specification</a>
            <a href="/documentation/languages" class="${
              pageId(request) === "languages" ? "active" : ""
            }">Turtle Language Specifications</a>
            <a href="/documentation/csac" class="${
              pageId(request) === "csac" ? "active" : ""
            }">Computer Science Across the Curriculum</a>
            <a href="/documentation/reading" class="${pageId(request) === "reading" ? "active" : ""}">Further Reading</a>
          </div>
        </div>
        <a href="/about" class="${sectionId(request) === "about" ? "active" : ""}">
          <span class="icon"><i class="fa fa-info"></i></span>
          <span class="text">About</span>
        </a>
        <a href="/contact" class="${sectionId(request) === "contact" ? "active" : ""}">
          <span class="icon"><i class="fa fa-at"></i></span>
          <span class="text">Contact</span>
        </a>
      </div>
    </div>
  </div>
  <div class="site-nav-right">
    <a href="/register" class="${sectionId(request) === "register" ? "active" : ""}">
      <span class="icon"><i class="fa fa-user-plus"></i></span>
      <span class="text">Register</span>
    </a>
    <a href="/login" class="${sectionId(request) === "login" ? "active" : ""}">
      <span class="icon"><i class="fa fa-sign-in-alt"></i></span>
      <span class="text">Sign In</span>
    </a>
  </div>
</nav>`

const sectionId = (request: ParsedRequest) => request.sections[0]

const pageId = (request: ParsedRequest) => request.sections[1] ?? sectionId(request)

const header = (content: string): string => `<header class="header">${content}</header>`

const main = (content: string): string => `<main class="main">${content}</main>`

const footer = (): string =>
  `<footer class="footer">
  <div class="logos-list">
    <a href="http://www.cs.ox.ac.uk/" target="blank" title="Department of Computer Science, University of Oxford"><img src="/images/computer-science-logo.png" alt="Department of Computer Science Logo, University of Oxford"></a>
    <a href="http://www.philosophy.ox.ac.uk/" target="blank" title="Philosophy Faculty, University of Oxford"><img src="/images/philosophy-logo.jpg" alt="Philosophy Faculty Logo, University of Oxford"></a>
    <a href="https://www.gov.uk/government/organisations/department-for-education" target="blank" title="The Department for Education"><img src="/images/government-logo.png" alt="The Department for Education Crest"></a>
    <a href="http://www.hertford.ox.ac.uk/" target="blank" title="Hertford College"><img src="/images/hertford-logo.png" alt="Hertford College Crest"></a>
  </div>
  <p class="acknowledgements">The Oxford Turtle Project is funded by the <a href="https://www.gov.uk/government/organisations/department-for-education" target="blank">UK Department for Education</a>, with matched funding from various sources within the University of Oxford (the <a href="http://www.cs.ox.ac.uk/" target="blank">Department of Computer Science</a>, the <a href="http://www.admin.ox.ac.uk/councilsec/trusts/applying/vanhoutenfund/" target="blank">Van Houten Fund</a>, and a private donor at <a href="http://www.hertford.ox.ac.uk/" target="blank">Hertford College</a>). It is housed in the University of Oxford&rsquo;s <a href="http://www.philosophy.ox.ac.uk/" target="blank">Faculty of Philosophy</a>.</p>
</footer>`
