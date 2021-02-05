import React from 'react'
import {
    Box,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td
} from '@chakra-ui/react';
import _ from 'lodash';

export default function SampleTable(data) {
    const sampleData = data.disease;
    // console.log('sampel data', sampleData);

    return (
        <Box mt="2" mb="2">
            <Table size="sm">
                <Thead>
                    <Tr>
                        <Th>Lokasi</Th>
                        <Th>Sampel</Th>
                        <Th>Kolam</Th>
                    </Tr>
                </Thead>
                <Tbody>
                {sampleData
                        .map(d => {
                            return (
                                <Tr key={d.region_id}>
                                    <Td>{d.region.district_name? _.startCase(d.region.district_name.toLowerCase()) : ''}{d.region.regency_name ? `, `+_.startCase(d.region.regency_name.toLowerCase()):''}{d.region.province_name ? `, `+_.startCase(d.region.province_name.toLowerCase()) : ''}</Td>
                                    {/* <Td>{d.region.full_name}</Td> */}
                                    <Td isNumeric>{d.total}</Td>
                                    <Td isNumeric>{d.total_ponds}</Td>
                                </Tr>
                            )
                        })}
                </Tbody>
            </Table>
        </Box>
    )
}
