import React from 'react';
import data from '../k8sSettings.json'

const settings = data.spec.versions[0].schema.openAPIV3Schema.properties.spec.properties

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

const isURL = new RegExp('/(https:\/\/[^\s]+)/g')

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
                &nbsp;({
                    prop[1].type === "string" ?
                    <code>"string"</code>
                    : prop[1].type === "object" ?
                    <code>&#123;object&#125;</code>
                    : prop[1].type === "array" ?
                    <code>&#91;array&#93;</code>
                    : null
                })
            </li>

            {prop[1].description || ""}<br/>

            {prop[1].format || ""}<br/>

            {prop[1].properties ? recurseProps(prop[1].properties) : null}
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
                &nbsp;({
                    type === "string" ?
                    <code>"string"</code>
                    : type === "object" ?
                    <code>&#123;object&#125;</code>
                    : type === "array" ?
                    <code>&#91;array&#93;</code>
                    : null
                })
            </h3>
                {description}<br/>
                {entry[1].required ? <><strong>Required Values: </strong> + <code> {header}.{entry[1].required}</code> </>: ""}
                <br/>
                { properties ? recurseProps(properties) : null}
            </ul>
            </>
        )
    })
}

export default SettingsTable

