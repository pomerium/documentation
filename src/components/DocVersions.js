import React from 'react';
import data from './docVersions.json';

const toParts = (id) => {
  if (id === 'vNext') {
    return [Number.POSITIVE_INFINITY];
  }

  return id
    .replace(/^v/, '')
    .replace(/\.x$/, '')
    .split('.')
    .map((part) => Number(part) || 0);
};

const compareVersions = (a, b) => {
  if (a.id === 'vNext') {
    return -1;
  }
  if (b.id === 'vNext') {
    return 1;
  }

  const aParts = toParts(a.id);
  const bParts = toParts(b.id);
  const maxLength = Math.max(aParts.length, bParts.length);

  for (let index = 0; index < maxLength; index += 1) {
    const diff = (bParts[index] || 0) - (aParts[index] || 0);
    if (diff) {
      return diff;
    }
  }

  return 0;
};

const versions = Object.values(data).sort(compareVersions);

const DocVersions = () => {
  return (
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
            return (
              <tr key={v.id}>
                <td>{v.id}</td>
                <td>
                  <a href={v.link}>Documentation</a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default DocVersions;
