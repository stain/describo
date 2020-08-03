const { readJson, writeFile, ensureDir } = require("fs-extra");
const { flattenDeep, orderBy, has } = require("lodash");
const path = require("path");

const schema = "schema.org.jsonld";
const classes = {};
const properties = [];
const simpleDataTypes = ["Text", "Date"];
const selectDataTypes = ["Boolean"];

Object(async () => {
    await ensureDir("./types");
    const jsonld = await readJson(schema);

    // separate classes and properties
    jsonld["@graph"].forEach((entry) => {
        if (entry["@type"] === "rdf:Property") {
            properties.push(entry);
        } else if (entry["@type"] === "rdfs:Class") {
            classes[stripSchemaPath(entry["@id"])] = {
                metadata: {
                    allowAdditionalProperties: false,
                    help: entry["rdfs:comment"],
                    "@id": entry["@id"],
                    name: entry["rdfs:label"],
                    subClassOf: entry["rdfs:subClassOf"],
                },
                inputs: [],
                linksTo: [],
            };
        }
    });

    // map properties back in to classes
    properties.forEach((property) => {
        const foundIn = flattenDeep([
            property["http://schema.org/domainIncludes"],
        ]);
        foundIn.forEach((target) => {
            if (target) {
                target = stripSchemaPath(target["@id"]);

                const allowedTypes = flattenDeep([
                    property["http://schema.org/rangeIncludes"],
                ]).map((t) => stripSchemaPath(t["@id"]));

                const complexTypes = allowedTypes.filter((type) =>
                    has(classes, type)
                );
                const simpleTypes = allowedTypes
                    .filter((type) => !has(classes, type))
                    .filter((type) => simpleDataTypes.includes(type));

                const selectTypes = allowedTypes
                    .filter((type) => !has(classes, type))
                    .filter((type) => selectDataTypes.includes(type));

                // console.log(
                //     property["rdfs:label"],
                //     simpleTypes,
                //     selectTypes,
                //     complexTypes
                // );

                // link this property to the relevant class
                const definition = {
                    property: property["rdfs:label"],
                    help: property["rdfs:comment"],
                };

                // if property can take a complex type then map to that
                if (complexTypes.length) {
                    classes[target].inputs.push({
                        ...definition,
                        multiple: true,
                        "@type": complexTypes,
                    });

                    // otherwise map a boolean to true / false
                } else if (selectTypes.length) {
                    classes[target].inputs.push({
                        ...definition,
                        "@type": "Select",
                        options: [true, false],
                    });
                    // otherwise map to simple types like date, text
                } else if (simpleTypes.length) {
                    classes[target].inputs.push({
                        ...definition,
                        multiple: true,
                        "@type": simpleTypes,
                    });
                    // and finally - just a simple text value
                } else {
                    classes[target].inputs.push({
                        ...definition,
                        multiple: true,
                        "@type": "Text",
                    });
                }

                // use the acceptable types for this property
                //  to link the class reverse
                complexTypes.forEach((type) =>
                    classes[type].linksTo.push(target)
                );
            }
        });
    });

    // order class inputs and write to file
    let index = {};
    Object.keys(classes).forEach(async (c) => {
        const item = classes[c];
        item.inputs = orderBy(item.inputs, "property");

        const typeDefinition = path.join(
            "types",
            stripSchemaPath(item.metadata["@id"])
        );
        index[stripSchemaPath(item.metadata["@id"])] = item;
        // await writeFile(
        //     `${typeDefinition}.json`,
        //     JSON.stringify(item, null, 2)
        // );
    });
    await writeFile(
        path.join("types", "index.json"),
        JSON.stringify(index, null, 2)
    );
    // console.log(JSON.stringify(index, null, 2));
})();

function stripSchemaPath(text) {
    return text.replace("http://schema.org/", "");
}
