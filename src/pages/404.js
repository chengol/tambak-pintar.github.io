import React from 'react';
import Lottie from 'react-lottie';
import animationData from '../lotties/not-found.json';
import {Link, Flex, Heading, SimpleGrid, Button} from "@chakra-ui/react";

export default function EmptyPages() {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice"
        }
    };
    return (
        <div>
            <Flex
                bg="blue.50"
                boxSize="150px"
                align="center"
                justify="center"
                w="100%"
                h="100%"
                pos="absolute"
                top="0"
                left="0">
                
                <SimpleGrid columns={1} spacing={6} textAlign="center">
                
                <Heading as="h2" size="xl">
    Halaman tidak ditemukan
  </Heading>
                <Lottie options={defaultOptions} height={400} width={400}/>
                <Button borderRadius="10px" colorScheme="blue"><Link href="/" color="white">Kembali ke halaman utama</Link></Button>
                
                 
            </SimpleGrid>
            </Flex>

        </div>
    )
}
