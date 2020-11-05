import React from 'react'
import {graphql, useStaticQuery} from 'gatsby';
import Img from 'gatsby-image';
import {Box, Divider, Flex, Heading, Text} from '@chakra-ui/core';
import DiseaseTracker from './DiseaseTracker';

export default function Sidepanel({points}) {
    const logo = useStaticQuery(graphql`
  query LogoSidepanel {
    logo: file(relativePath: {eq: "assets/tambakpintar.png"}) {
      id
      childImageSharp {
        fixed(width: 70, height: 70) {
          ...GatsbyImageSharpFixed
        }
      }
    }
  }
  `);
    return (
        <div>
            <Flex columns={2}>
            <Box p={4} m={5} mt={0} mb={0} mr={0} pb={0} w="100px">
          <Img fixed={logo.logo.childImageSharp.fixed} />
        </Box>
        <Box m={2} p={4} pb={0} flex="1">
        <Heading as="h3" size="md" mb={0}>Peta Distribusi</Heading>
                    <Heading as="h4" size="md" mb={2}>Penyakit Udang</Heading>
                    <Text>versi 0.0.1</Text>
        </Box>
            </Flex>
        
        <Divider orientation="horizontal" />
        <Box >
        <DiseaseTracker points={points}/>
        </Box>
        
              
      </div>
    )
}
