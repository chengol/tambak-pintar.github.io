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

export default function PositiveTable(diseaseData) {
    // const chartData = data.chart;
    const diseasesData = diseaseData.disease;

    return (
        <div>
            <Box mt="2" mb="2">
                <Table size="sm">
                    <Thead>
                        <Tr className="tr">
                            <Th className="th">Lokasi</Th>
                            <Th className="th" isNumeric>Total Positif</Th>
                            <Th className="th" isNumeric>AHPND</Th>
                            <Th className="th" isNumeric>EHP</Th>
                            <Th className="th" isNumeric>Myo</Th>
                            <Th className="th" isNumeric>Berak Putih</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {diseasesData.map(d => {
                            return (
                                <Tr key={d.region_id}>
                                    <Td>{d.region.district_name
                                            ? <strong>{_.startCase(d.region.district_name.toLowerCase())}</strong>
                                            : ''}{d.region.regency_name
                                            ? ` ` + _.startCase(d.region.regency_name.toLowerCase())
                                            : ''}{d.region.province_name
                                            ? `, ` + _.startCase(d.region.province_name.toLowerCase())
                                            : ''}</Td>
                                    <Td isNumeric>{d.total_positive}</Td>
                                    <Td isNumeric>{d.total_disease_id_1_positive}</Td>
                                    <Td isNumeric>{d.total_disease_id_6_positive}</Td>
                                    <Td isNumeric>{d.total_disease_id_8_positive}</Td>
                                    <Td isNumeric>{d.total_disease_id_11_positive}</Td>
                                </Tr>
                            )
                        })}
                    </Tbody>
                </Table>
            </Box>
        </div>

    )
}
