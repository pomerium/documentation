import React from 'react';
import data from '../k8sSettings.json'

const settings = data.spec.versions[0].schema.openAPIV3Schema.properties.spec.properties

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

const isURL = new RegExp('/(https:\/\/[^\s]+)/g')

function returnType(type) {
    var thisType = ""
    type === "string" ?
    thisType = <code>"string"</code>
    : type === "object" ?
    thisType = <code>&#123;object&#125;</code>
    : type === "array" ?
    thisType = <code>&#91;array&#93;</code>
    : type === "boolean" ?
    <code>boolean</code>
    : thisType = null
    return thisType
}

function recurseProps(properties) {
    return (
    <>
    <br/>
    Properties:
    <ul>
    {Object.entries(properties || "").map((prop) => {
        console.log("Properties: ", prop)
        return (
            <>
            <li key={prop}>
                <strong>{prop[0]}</strong>
                &nbsp;({returnType(prop[1].type)})<br/>
                {prop[1].description || null}
                <ul>
                {prop[1].format ? <><li>Format: {JSON.stringify(prop[1].format)}</li></> : null}
                {prop[1].properties ? <><li>{recurseProps(prop[1].properties)}</li></> : null}<br/>
                </ul>
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
        const type = entry[1].type || ""
        //console.log("Entry type: " + type)

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
                &nbsp;({returnType(type)})
            </h3>
                {description ? <>{description}<br/></>: null}
                {entry[1].required ? <><br/>Required Values: <code> {header}.{entry[1].required}</code><br/></>: ""}
                { properties ? recurseProps(properties) : null}
            </ul>
            </>
        )
    })
}

export default SettingsTable

