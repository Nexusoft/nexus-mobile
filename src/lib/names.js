import { callAPI } from 'lib/api';
import { createGlobalNameFee, createLocalNameFee } from 'lib/fees';

const unknownName = -101;

export const nameFee = (global) =>
  global ? createGlobalNameFee : createLocalNameFee;

//what people type to send to it
export const fullName = (name, username) =>
  name.global ? name.name : `${name.user || username}:${name.name}`;

//names of this profile, global first
export async function fetchMyNames() {
  const list = (await callAPI('names/list/names', { limit: 100 })) || [];
  return list
    .filter((n) => n.mine !== false)
    .sort((a, b) => (b.global ? 1 : 0) - (a.global ? 1 : 0) || b.created - a.created);
}

//true = free, false = taken, null = could not tell
export async function nameIsFree(name, { global, username }) {
  try {
    const record = await callAPI('names/get/name', {
      name: global ? name : `${username}:${name}`,
    });
    return !(record?.register && record.register !== '0');
  } catch (err) {
    if (err?.code === unknownName) return true;
    return null;
  }
}

export function nameProblem(name) {
  if (!name) return 'Enter a name';
  if (name.includes(':')) return 'A name cannot contain ":"';
  if (name.length > 64) return 'At most 64 characters';
  return null;
}

export async function createName({ name, register, global, pin }) {
  const params = { name, register, pin };
  if (global) params.global = true;
  return await callAPI('names/create/name', params);
}
