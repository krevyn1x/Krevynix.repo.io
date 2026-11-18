export function validateSource(value) {
  if (typeof value !== 'string' || !value) return null;
  try {
    const u = new URL(value);
    if (u.protocol !== 'https:' || u.username || u.password || u.search || u.hash) return null;
    return u.href;
  } catch { return null; }
}
export function managerLinks(value) {
  const source = validateSource(value);
  if (!source) return {};
  return {
    sileo: 'sileo://source/' + source,
    zebra: 'zbra://sources/add/' + source,
    installer: 'installer://add/repo=' + source,
    cydia: 'cydia://url/https://cydia.saurik.com/api/share#?source=' + encodeURIComponent(source)
  };
}
export function packageRows(records) {
  const groups = new Map();
  for (const r of records) {
    const key = r.Package + '\0' + r.Version;
    if (!groups.has(key)) groups.set(key, {id:r.Package, name:r.Name || r.Package, version:r.Version, description:r.Description || '', variants:[]});
    groups.get(key).variants.push(r);
  }
  return [...groups.values()];
}
