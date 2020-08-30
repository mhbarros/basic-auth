import React from 'react';
import Head from 'next/head';

export default ({title}) => (
    <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400;900&display=swap" rel="stylesheet" />
    </Head>
)

