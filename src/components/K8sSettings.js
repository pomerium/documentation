import React from 'react';
import data from '../k8sSettings.json';

const settings =
  data.spec.versions[0].schema.openAPIV3Schema.properties.spec.properties;
const statuses = data.spec.versions[0].schema.openAPIV3Schema.properties.status;

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const isURL = new RegExp('/(https://[^s]+)/g');

function returnType(prop) {
  var thisType = '';
  prop[1].type === 'string'
    ? (thisType = <code>"string"</code>)
    : prop[1].type === 'object'
    ? (thisType = <code>&#123;object&#125;</code>)
    : prop[1].type === 'array'
    ? (thisType = <code>&#91;&#93;{prop[1].items.type}</code>)
    : prop[1].type === 'boolean'
    ? (thisType = <code>boolean</code>)
    : (thisType = null);
  return thisType;
}

function recurseProps(header, properties, required) {
  return (
    <>
      {required ? (
        <>
          <br />
          Required Properties:
          <ul>
            {required.map((prop) => {
              return (
                <li key={prop}>
                  <code>
                    {header}.{prop}
                  </code>
                  <br />
                </li>
              );
            })}
          </ul>
          <br />
        </>
      ) : (
        ''
      )}
      Properties:
      <ul>
        {Object.entries(properties || '').map((prop) => {
          return (
            <>
              <li key={prop}>
                <strong>{prop[0]}</strong>
                &nbsp;({returnType(prop)}){' '}
                {prop[1].format ? <> - Format: {prop[1].format}</> : null}{' '}
                <br />
                {prop[1].description ? <>{prop[1].description}</> : null}
                {prop[1].enum
                  ? prop[1].enum.map((thisEnum) => {
                      return (
                        <>
                          <ul>
                            <li key={thisEnum}>
                              <code>{thisEnum}</code>
                            </li>
                          </ul>
                        </>
                      );
                    })
                  : null}
                {prop[1].properties ? (
                  <>
                    <br />
                    {recurseProps(header, prop[1].properties, prop[1].required)}
                  </>
                ) : null}
              </li>
            </>
          );
        })}
      </ul>
    </>
  );
}

const SettingsList = () => {
  return Object.entries(settings).map((entry, values) => {
    const header = entry[0];
    const description = entry[1].description;
    const properties = entry[1]?.properties || '';

    return (
      <>
        <ul>
          <h3 key={header}>
            <a id={header} className="k8s-settings-anchor">
              #
            </a>
            <a href={'#' + header}>{capitalizeFirstLetter(header)}</a>
            &nbsp;({returnType(entry)})
          </h3>
          {description ? <>{description}</> : null}
          {properties ? (
            <>
              <br />
              {recurseProps(header, properties, entry[1].required)}
            </>
          ) : null}
        </ul>
      </>
    );
  });
};

const Status = () => {
  const mainDescription = statuses.description;
  const theseStatuses = Object.entries(statuses.properties);

  return (
    <>
      <p>{mainDescription}</p>
      {theseStatuses.map((thing) => {
        const name = thing[0];
        const props = thing[1].additionalProperties
          ? thing[1].additionalProperties.properties
          : thing[1].properties;
        const messages = Object.entries(props) || 'no properties';
        return (
          <>
            <h3 key={name}>
              <a id={name} className="k8s-settings-anchor">
                #
              </a>
              <a href={'#' + name}>{capitalizeFirstLetter(name)}</a>
            </h3>
            {props.description}
            <ul key={`${name}-list`}>
              {messages.map((msg) => {
                return (
                  <li key={msg[0]}>
                    {msg[0]}
                    <br />
                    {msg[1].description}
                  </li>
                );
              })}
            </ul>
          </>
        );
      })}
    </>
  );
};

export {SettingsList, Status};
