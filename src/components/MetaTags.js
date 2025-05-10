import React from 'react';
import { Helmet } from 'react-helmet';

const MetaTags = ({ title, description, image, url }) => {
    const defaultTitle = "Little Lemon Restaurant";
    const defaultDescription = "Experience authentic Mediterranean cuisine at Little Lemon. Book your table online for a memorable dining experience.";
    const defaultImage = "/images/restaurant.jpg";
    const defaultUrl = "https://littlelemon.com";

    return (
        <Helmet>
            <title>{title || defaultTitle}</title>
            <meta name="description" content={description || defaultDescription} />
            
            {/* Open Graph Protocol Tags */}
            <meta property="og:title" content={title || defaultTitle} />
            <meta property="og:description" content={description || defaultDescription} />
            <meta property="og:image" content={image || defaultImage} />
            <meta property="og:url" content={url || defaultUrl} />
            <meta property="og:type" content="website" />
            
            {/* Twitter Card Tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title || defaultTitle} />
            <meta name="twitter:description" content={description || defaultDescription} />
            <meta name="twitter:image" content={image || defaultImage} />
            
            {/* Additional Meta Tags */}
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta name="theme-color" content="#495E57" />
            <link rel="canonical" href={url || defaultUrl} />
        </Helmet>
    );
};

export default MetaTags; 