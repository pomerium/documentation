import React from "react";
import data from "./docVersions.json";

const versions = Object.values(data)

const DocVersions = () => {
  return(
    <>
      <table>
        <thead>
          <tr>
            <td>Version</td>
            <td>Documentation</td>
          </tr>
        </thead>
        <tbody>
       {versions.map((v) => {
         return(
          <tr key={v.id}>
            <td>{v.id}</td><td><a href={v.link}>Documentation</a></td>
          </tr>
         )
        })}
        </tbody>
      </table>
    </>
    
  )
}

export default DocVersions
