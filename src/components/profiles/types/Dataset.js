export default {
    metadata: {
        allowAdditionalProperties: true,
    },
    inputs: [
        {
            property: "name",
            "@type": "Text",
            required: true,
            multiple: false,
            group: "important",
        },
        {
            property: "description",
            "@type": "TextArea",
            multiple: false,
            group: "important",
        },
        {
            property: "license",
            "@type": "CreativeWork",
            multiple: false,
            group: "important",
        },
        {
            property: "hasPart",
            "@type": ["Dataset", "File"],
            group: "important",
        },
        { property: "keywords", "@type": "Text", multiple: false },
        { property: "dateCreated", "@type": "Date", multiple: false },
        { property: "dateModified", "@type": "Date", multiple: false },
        { property: "datePublished", "@type": "Date", multiple: false },
        { property: "alternativeHeadline", "@type": "Text", multiple: false },
        { property: "alternateName", "@type": "Text", multiple: false },
        {
            property: "author",
            "@type": ["Organization", "Person"],
            group: "important",
        },
        { property: "creator", "@type": ["Organization", "Person"] },
        {
            property: "publisher",
            "@type": ["Organization", "Person"],
            group: "important",
        },
        {
            property: "funder",
            "@type": ["Organization", "Person"],
            group: "important",
        },
        { property: "editor", "@type": "Person" },
        { property: "maintainer", "@type": ["Organization", "Person"] },
        { property: "identifier", "@type": ["PropertyValue"] },
        { property: "issn", "@type": "Text", multiple: false },
        { property: "copyrightHolder", "@type": ["Organization", "Person"] },
        { property: "copyrightYear", "@type": "Date" },
        { property: "isPartOf", "@type": "CreativeWork" },
        { property: "distribution", "@type": "DataDownload" },
        { property: "contentLocation", "@type": "Place" },
        { property: "locationCreated", "@type": "Place" },
    ],
};
