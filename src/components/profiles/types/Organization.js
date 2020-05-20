export default {
    metadata: {
        allowAdditionalProperties: true,
    },
    inputs: [
        {
            property: "@id",
            "@type": "Text",
            multiple: false,
        },
        {
            property: "name",
            "@type": "Text",
            required: true,
            multiple: false,
            group: "important",
        },
        {
            property: "description",
            "@type": "Text",
            multiple: false,
            group: "important",
        },
        { property: "funder", "@type": ["Person", "Organization"] },
        { property: "email", "@type": "Text" },
        { property: "address", "@type": "Text" },
        { property: "contactPoint", "@type": "ContactPoint" },
        { property: "department", "@type": "Organization" },
    ],
};
