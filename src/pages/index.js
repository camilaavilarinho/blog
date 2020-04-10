import React from "react";
import Helmet from "react-helmet";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import favicon from "../../static/assets/icon-48x48.png";
import {
  FaTwitter,
  FaLinkedinIn,
  FaGithub,
  FaRegEnvelope
} from "react-icons/fa";

const IndexPage = ({ data: { site } }) => {
  return (
    <Layout>
      <Helmet
        link={[
          {
            rel: "icon",
            type: "image/png",
            sizes: "16x16",
            href: `${favicon}`
          },
          { rel: "shortcut icon", type: "image/png", href: `${favicon}` }
        ]}
      >
        <title>{site.siteMetadata.title}</title>
        <meta name="description" content={site.siteMetadata.description} />
      </Helmet>
      <div className="main">
        <div className="profile-conainer">
          <img className="profile" src="/assets/perfil.jpg" alt="Camila"></img>
        </div>
        <div className="social">
          <a
            href="https://www.linkedin.com/in/camila-vilarinho/"
            target="_blank"
            rel="noopener noreferrer"
            className="social-container"
          >
            <FaLinkedinIn size="2em" className="social-icon" />
          </a>
          <a
            href="https://github.com/camilaavilarinho"
            target="_blank"
            rel="noopener noreferrer"
            className="social-container"
          >
            <FaGithub size="2em" className="social-icon" />
          </a>
          <a
            href="https://twitter.com/camilaavilarnho"
            target="_blank"
            rel="noopener noreferrer"
            className="social-container"
          >
            <FaTwitter size="2em" className="social-icon" />
          </a>
          <a
            href="mailto:camilaavilarinho@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="social-container"
          >
            <FaRegEnvelope size="2em" className="social-icon" />
          </a>
        </div>
      </div>
    </Layout>
  );
};
export default IndexPage;
export const pageQuery = graphql`
  query IndexPageQuery {
    site {
      siteMetadata {
        title
        description
      }
    }
  }
`;
