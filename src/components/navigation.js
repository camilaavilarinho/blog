import React from "react";
import { Link } from "gatsby";

export default props => (
  <nav className="navigation">
    <Link to="/">Home</Link>
    <Link to="/blog">Blog</Link>
  </nav>
);
