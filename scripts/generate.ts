/// <reference types="node" />
import {capitalCase, kebabCase} from 'change-case';
import {readFile, writeFile} from 'node:fs/promises';
import {format} from 'prettier';

import config from '../deps/github.com/pomerium/sdk-go/proto/pomerium/config.pb.json';

const referencePath = `${__dirname}/../content/docs/reference/reference.json`;

type Message = {
  name: string;
  longName: string;
  fullName: string;
  description: string;
  hasExtensions: boolean;
  hasFields: boolean;
  hasOneofs: boolean;
  extensions: any[];
  fields: Field[];
};

type Field = {
  name: string;
  description: string;
  label: string;
  type: string;
  longType: string;
  fullType: string;
  ismap: boolean;
  isoneof: boolean;
  oneofdecl: string;
  defaultValue: string;
};

function getTypeName(msg: Message, field: Field): string {
  if (field.ismap) {
    const valueType = config.files
      .map((f) => f.messages)
      .flat()
      .find((m) => m.fullName === field.fullType)?.fields?.[1]?.type;
    return `map${valueType ? ` of ${valueType}` : ''}`;
  } else if (field.label === 'repeated') {
    return `array of ${field.type}`;
  }
  return field.type;
}

async function updateReference() {
  const src = await readFile(referencePath);
  const reference = JSON.parse(src.toString('utf8'));
  config.files.forEach((file) => {
    file.messages.forEach((msg) => {
      msg.fields.forEach((field) => {
        if (
          msg.fullName === 'pomerium.config.Settings' &&
          (field.name === 'auto_apply_changesets' ||
            field.name.startsWith('mcp_'))
        ) {
          reference[kebabCase(field.name)] = {
            ...reference[kebabCase(field.name)],
            id: kebabCase(field.name),
            description: field.description,
            type: getTypeName(msg, field),
          };
        }
      });
    });
  });

  const str = await format(
    JSON.stringify(
      Object.keys(reference)
        .sort()
        .reduce((o: Record<string, any>, k) => {
          o[k] = reference[k];
          return o;
        }, {}),
      null,
      2,
    ),
    {
      filepath: referencePath,
    },
  );
  const dst = Buffer.from(str, 'utf8');
  await writeFile(referencePath, dst);
}

async function main() {
  await updateReference();
}
main();
