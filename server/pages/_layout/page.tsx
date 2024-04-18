import React from "react";
import ReactDOMServer from "react_dom_server";
import type { RequestParams } from "../../types.ts";

export default (
  requestParams: RequestParams,
  headerContent: JSX.Element,
  mainContent: JSX.Element
): string =>
  ReactDOMServer.renderToString(
    <html>
      <Head />
      <Body requestParams={requestParams} headerContent={headerContent} mainContent={mainContent} />
    </html>
  );

const Head = (): JSX.Element => (
  <head>
    <meta charSet="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta
      name="keywords"
      content="turtle graphics, programming, coding, education, learn to code"
    />
    <meta
      name="description"
      content="The Turtle System is a free educational program developed at the University of Oxford, designed to support the Computer Science component of the UK National Curriculum."
    />
    <meta name="theme-color" content="#159d6b" />
    <link rel="icon" type="image/x-icon" href="/images/favicon.ico" />
    <link rel="apple-touch-icon" href="/images/turtle-152x152.png" />
    <script src="https://kit.fontawesome.com/03273b8e38.js" crossOrigin="anonymous"></script>
    <link href="/css/screen.css" rel="stylesheet" />
    <title>The Turtle System</title>
    <script defer src="/js/index.js"></script>
    <script src="/js/ga.js"></script>
  </head>
);

const Body = ({
  requestParams,
  headerContent,
  mainContent,
}: {
  requestParams: RequestParams;
  headerContent: JSX.Element;
  mainContent: JSX.Element;
}): JSX.Element => (
  <body className={requestParams.sections[0]}>
    <Nav requestParams={requestParams} />
    <div className="wrapper" data-send="closeSiteMenus">
      <div className="container">
        <header className="header">{headerContent}</header>
        <main className="main">{mainContent}</main>
        <Footer />
      </div>
    </div>
  </body>
);

const Nav = ({ requestParams }: { requestParams: RequestParams }): JSX.Element => (
  <nav className="site-nav">
    <div className="site-nav-left">
      <div className="site-menu">
        <a data-send="toggleMenu" data-value="site">
          <span className="icon logo">
            <img src="/images/turtle.png" alt="turtle logo" />
          </span>
          <span className="text">The Turtle System</span>
          <span className="icon">
            <i className="fa fa-caret-down"></i>
          </span>
        </a>
        <div className="site-sub-menu" data-menu="site">
          <a href="/" className={requestParams.sections[0] === "index" ? "active" : ""}>
            <span className="icon logo">
              <img src="/images/turtle.png" alt="turtle logo" />
            </span>
            <span className="text">The Turtle System</span>
          </a>
          <a href="/run" className={requestParams.sections[0] === "run" ? "active" : ""}>
            <span className="icon">
              <i className="fa fa-play"></i>
            </span>
            <span className="text">Run</span>
          </a>
          <div className="site-menu">
            <a
              className={requestParams.sections[0] === "documentation" ? "active" : ""}
              data-send="toggleMenu"
              data-value="documentation"
            >
              <span className="icon">
                <i className="fa fa-book"></i>
              </span>
              <span className="text">Documentation</span>
              <span className="icon">
                <i className="fa fa-caret-down"></i>
              </span>
            </a>
            <div className="site-sub-menu" data-menu="documentation">
              <a
                href="/documentation/programming"
                className={requestParams.page === "programming" ? "active" : ""}
              >
                Programming with the Turtle System
              </a>
              <a
                href="/documentation/system"
                className={requestParams.page === "system" ? "active" : ""}
              >
                Turtle System User Guides
              </a>
              <a
                href="/documentation/machine"
                className={requestParams.page === "machine" ? "active" : ""}
              >
                Turtle Machine Guides
              </a>
              <a
                href="/documentation/help"
                className={requestParams.page === "help" ? "active" : ""}
              >
                Turtle Languages Help
              </a>
              <a
                href="/documentation/reference"
                className={requestParams.page === "reference" ? "active" : ""}
              >
                Commands &amp; Constants Reference
              </a>
              {/* <a
                href="/documentation/exercises"
                className={requestParams.page === "exercises" ? "active" : ""}
              >
                Self-Teach Exercises
              </a>
              <a
                href="/documentation/languages"
                className={requestParams.page === "languages" ? "active" : ""}
              >
                Turtle Language Specifications
              </a> */}
              <a
                href="/documentation/csac"
                className={requestParams.page === "csac" ? "active" : ""}
              >
                Computer Science Across the Curriculum
              </a>
              <a
                href="/documentation/reading"
                className={requestParams.page === "reading" ? "active" : ""}
              >
                Further Reading
              </a>
            </div>
          </div>
          <a href="/about" className={requestParams.sections[0] === "about" ? "active" : ""}>
            <span className="icon">
              <i className="fa fa-info"></i>
            </span>
            <span className="text">About</span>
          </a>
          <a href="/contact" className={requestParams.sections[0] === "contact" ? "active" : ""}>
            <span className="icon">
              <i className="fa fa-at"></i>
            </span>
            <span className="text">Contact</span>
          </a>
        </div>
      </div>
    </div>
    <div className="site-nav-right">
      <UserNav requestParams={requestParams} />
    </div>
  </nav>
);

const UserNav = ({ requestParams }: { requestParams: RequestParams }): JSX.Element =>
  requestParams.user ? (
    <LoggedInNav requestParams={requestParams} username={requestParams.user.username} />
  ) : (
    <LoggedOutNav requestParams={requestParams} />
  );

const LoggedInNav = ({
  requestParams,
  username,
}: {
  requestParams: RequestParams;
  username: string;
}): JSX.Element => (
  <div className="site-menu">
    <a
      className={requestParams.sections[0] === "account" ? "active" : ""}
      data-send="toggleMenu"
      data-value="user"
    >
      <span className="icon">
        <i className="fa fa-user" aria-hidden="true"></i>
      </span>
      <span className="text">{username}</span>
      <span className="icon">
        <i className="fa fa-caret-down" aria-hidden="true"></i>
      </span>
    </a>
    <div className="site-sub-menu" data-menu="user">
      <a href="/account" className={requestParams.page === "account" ? "active" : ""}>
        My Account
      </a>
      <a href="/account/files" className={requestParams.page === "files" ? "active" : ""}>
        My Files
      </a>
      <a href="/logout" className="">
        Logout
      </a>
    </div>
  </div>
);

const LoggedOutNav = ({ requestParams }: { requestParams: RequestParams }): JSX.Element => (
  <>
    <a href="/register" className={requestParams.sections[0] === "register" ? "active" : ""}>
      <span className="icon">
        <i className="fa fa-user-plus"></i>
      </span>
      <span className="text">Register</span>
    </a>
    <a href="/login" className={requestParams.sections[0] === "login" ? "active" : ""}>
      <span className="icon">
        <i className="fa fa-sign-in-alt"></i>
      </span>
      <span className="text">Sign In</span>
    </a>
  </>
);

const Footer = (): JSX.Element => (
  <footer className="footer">
    <div className="logos-list">
      <a
        href="http://www.cs.ox.ac.uk/"
        target="blank"
        title="Department of Computer Science, University of Oxford"
      >
        <img
          src="/images/computer-science-logo.png"
          alt="Department of Computer Science Logo, University of Oxford"
        />
      </a>
      <a
        href="http://www.philosophy.ox.ac.uk/"
        target="blank"
        title="Philosophy Faculty, University of Oxford"
      >
        <img
          src="/images/philosophy-logo.jpg"
          alt="Philosophy Faculty Logo, University of Oxford"
        />
      </a>
      <a
        href="https://www.gov.uk/government/organisations/department-for-education"
        target="blank"
        title="The Department for Education"
      >
        <img src="/images/government-logo.png" alt="The Department for Education Crest" />
      </a>
      <a href="http://www.hertford.ox.ac.uk/" target="blank" title="Hertford College">
        <img src="/images/hertford-logo.png" alt="Hertford College Crest" />
      </a>
    </div>
    <p className="acknowledgements">
      The Oxford Turtle Project is funded by the{" "}
      <a href="https://www.gov.uk/government/organisations/department-for-education" target="blank">
        UK Department for Education
      </a>
      , with matched funding from various sources within the University of Oxford (the{" "}
      <a href="http://www.cs.ox.ac.uk/" target="blank">
        Department of Computer Science
      </a>
      , the{" "}
      <a href="http://www.admin.ox.ac.uk/councilsec/trusts/applying/vanhoutenfund/" target="blank">
        Van Houten Fund
      </a>
      , and a private donor at{" "}
      <a href="http://www.hertford.ox.ac.uk/" target="blank">
        Hertford College
      </a>
      ). It is housed in the University of Oxford&rsquo;s{" "}
      <a href="http://www.philosophy.ox.ac.uk/" target="blank">
        Faculty of Philosophy
      </a>
      .
    </p>
  </footer>
);
