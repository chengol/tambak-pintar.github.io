import React from 'react'
import {Box} from '@chakra-ui/react';
import DiseaseTracker from './DiseaseTracker';
import LatestData from '../components/LatestData';

export default function Bottompanel({statistics, region, chart, disease, persebaran}) {
    return (
        <Box id="bottompanel" pb={4}>
        <DiseaseTracker  statistics={statistics} region={region} chart={chart} disease={disease} persebaran={persebaran}/>
        <LatestData latestData={statistics} className="latest-bottompanel"/>
        </Box>       
    )
}
