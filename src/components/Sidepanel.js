import React from 'react'
import {graphql, useStaticQuery} from 'gatsby';
import Img from 'gatsby-image';
import {Box, Divider, Flex, Heading, Text} from '@chakra-ui/core';
import DiseaseTracker from './DiseaseTracker';
import {lightFormat, isAfter} from 'date-fns';

export default function Sidepanel({points, samples}) {
    const logo = useStaticQuery(graphql`
  query LogoSidepanel {
    logo: file(relativePath: {eq: "assets/tambakpintar.png"}) {
      id
      childImageSharp {
        fluid(maxWidth: 80) {
          ...GatsbyImageSharpFluid
        }
      }
    }
  }
  `);
    return (
        <div>
            <Flex columns={2}>
            <Box p={4} m={5} mt={0} mb={0} mr={0} pb={0} w="100px">
          <Img fluid={logo.logo.childImageSharp.fluid} />
        </Box>
        <Box m={2} p={4} pb={0} flex="1">
        <Heading as="h3" size="md" mb={0}>Peta Persebaran</Heading>
                    <Heading as="h4" size="md" mb={2}>Penyakit Udang</Heading>
                    <Text>versi 0.0.2</Text>
        </Box>
            </Flex>
        
        <Divider orientation="horizontal" />
        <Box >
        <DiseaseTracker points={points} samples={samples}/>
        </Box>
        <LatestData samples={samples}/>
      </div>
    )

    function LatestData({samples}){
      // console.log('latest samples', samples);
      const latestData = samples[samples.length - 1];
      return(
        <div>
          <Box className="latest-data">
      <Text fontSize="sm" fontWeight={700} m={2} fontWeight={500}>Data diperbarui terakhir {lightFormat(new Date(latestData.fields.Tanggal), 'dd-MM-yyyy')}</Text>
          </Box>
        </div>
      )
    }
    
}




