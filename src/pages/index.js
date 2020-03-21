import React from "react"
import { Link } from "gatsby"
import styled from "styled-components"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Button from "../components/button"
import { theme } from "../theme/theme"

class IndexPage extends React.Component {
  render() {
    const siteTitle = ""

    return (

      <PageContainer>
        <Layout location={this.props.location} title={siteTitle}>
          <SEO
            title="Home"
            keywords={[`blog`, `gatsby`, `javascript`, `react`]}
          />
          {/* <img style={{ margin: 0 }} src="./GatsbyScene.svg" alt="Gatsby Scene" /> */}
          <Title>
            Camila Vilarinho
          </Title>
          <Link to="/blog/">
            <Button marginTop="35px">Go to Blog</Button>
          </Link>
        </Layout>
      </PageContainer>
    )
  }
}

const PageContainer = styled.div`
  background: ${theme.backgroundColor};
`
const Title = styled.h1`
  font-size: 50px;
  font-weight: 400;
`


export default IndexPage
