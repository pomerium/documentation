import React from 'react';
import data from '../k8sSettings.json'

const settings = data.spec.versions[0].schema.openAPIV3Schema.properties.spec.properties

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

const isURL = new RegExp('/(https:\/\/[^\s]+)/g')

function returnType(prop) {
    var thisType = ""
    prop[1].type === "string" ?
    thisType = <code>"string"</code>
    : prop[1].type === "object" ?
    thisType = <code>&#123;object&#125;</code>
    : prop[1].type === "array" ?
    thisType = <code>&#91;&#93;{prop[1].items.type}</code>
    : prop[1].type === "boolean" ?
    thisType = <code>boolean</code>
    : thisType = null
    return thisType
}

function recurseProps(header, properties, required) {
    return (
    <>
    {required ? <>
        <br/>Required Properties:
        <ul>
        {required.map((prop) => {
            return(
            <li>
            <code>{header}.{prop}</code><br/>
            </li>
            )
        })}
        </ul><br/>
    </>: ""}
    Properties:
    <ul>
    {Object.entries(properties || "").map((prop) => {
        //console.log("Properties: ", prop)
        return (
            <>
            <li key={prop}>
                <strong>{prop[0]}</strong>
                &nbsp;({returnType(prop)}) {prop[1].format ? <> - Format: {prop[1].format}</> : null} <br/>
                {prop[1].description? <>{prop[1].description}</> : null}
                {prop[1].properties ? <><br/>{recurseProps(header, prop[1].properties, prop[1].required)}</> : null}
            </li>
            </>
        )
    })}
    </ul>
    </>)
}

const SettingsTable = () => {
    return Object.entries(settings).map((entry, values) => {
        //console.log("Entry: " + JSON.stringify(entry))

        const header = entry[0]
        //console.log("header: ", header)
        const description = entry[1].description
        //console.log("Entry Description: " + JSON.stringify(entry[1].description))
        const properties = entry[1]?.properties || ""
        //console.log("properties: " + JSON.stringify(properties))

        return (
            <>
            <ul>
            <h3 key={header} style={{}}>
                <a id={header} className="k8s-settings-anchor" >
                    #
                </a>
                <a href={"#"+header}>
                    {capitalizeFirstLetter(header)}
                </a>
                &nbsp;({returnType(entry)})
            </h3>
                {description ? <>{description}</>: null}
                { properties ? <><br/>{recurseProps(header, properties, entry[1].required)}</> : null}
            </ul>
            </>
        )
    })
}

export default SettingsTable

