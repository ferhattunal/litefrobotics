export type SpecPair = { label: string; value: string };

type Node = { tag: string; attrs: Record<string, string>; inner: string };

function decodeEntities(value: string) {
  return value
    .replaceAll("&nbsp;", " ")
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, num) => String.fromCharCode(Number(num)))
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&apos;", "'");
}

function stripUnsafe(xml: string) {
  return xml
    .replace(/<\?xml[^?]*\?>/i, "")
    .replace(/<!DOCTYPE[\s\S]*?>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .trim();
}

function humanize(tag: string) {
  return localName(tag).replace(/[-_]+/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function localName(tag: string) {
  return tag.includes(":") ? tag.slice(tag.lastIndexOf(":") + 1) : tag;
}

function norm(tag: string) {
  return localName(tag).replace(/[-_]/g, "").toLowerCase();
}

function parseAttrs(raw: string) {
  const attrs: Record<string, string> = {};
  const re = /([A-Za-z_:][\w:.-]*)\s*=\s*("([^"]*)"|'([^']*)')/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(raw))) {
    attrs[norm(match[1])] = decodeEntities(match[3] ?? match[4] ?? "");
  }
  return attrs;
}

function textOf(inner: string) {
  return decodeEntities(inner.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

function children(xml: string): Node[] {
  const items: Node[] = [];
  const re = /<([A-Za-z_][\w:.-]*)([^>]*)>([\s\S]*?)<\/\1>/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(xml))) {
    items.push({ tag: match[1], attrs: parseAttrs(match[2] ?? ""), inner: match[3] });
  }
  return items;
}

function isNameKey(key: string) {
  return /^(nametr|nameen|nameeng|name|label|title|key)$/.test(key);
}

function isValueKey(key: string) {
  return /^(value|val|content|text)$/.test(key);
}

function fieldMap(nodes: Node[]) {
  const map: Record<string, string> = {};
  for (const node of nodes) {
    const key = norm(node.tag);
    const value = textOf(node.inner);
    if (value) map[key] = value;
    for (const [attr, attrValue] of Object.entries(node.attrs)) {
      if (attrValue) map[attr] = attrValue;
    }
  }
  return map;
}

function pairFromMap(map: Record<string, string>): SpecPair | null {
  const label = map.nametr || map.name || map.label || map.title || map.key || map.nameen || map.nameeng || "";
  const value = map.value || map.val || map.content || map.text || "";
  if (label && value) return { label, value };
  return null;
}

function pairFromNode(node: Node): SpecPair | null {
  const nested = children(node.inner);
  if (nested.length) {
    const fromFields = pairFromMap({ ...node.attrs, ...fieldMap(nested) });
    if (fromFields) return fromFields;
  }
  const attrPair = pairFromMap(node.attrs);
  if (attrPair) return attrPair;
  const named = node.attrs.name || node.attrs.label || node.attrs.title || node.attrs.nametr || node.attrs.key;
  const text = textOf(node.inner);
  if (named && text) return { label: named, value: text };
  return null;
}

function groupFlatRecords(nodes: Node[]): SpecPair[] | null {
  const keys = nodes.map((node) => norm(node.tag));
  const looksLikeCatalog = keys.some((key) => key === "nametr" || key === "nameen" || key === "nameeng") && keys.some(isValueKey);
  if (!looksLikeCatalog) return null;

  const pairs: SpecPair[] = [];
  let current: Record<string, string> = {};

  function flush() {
    const pair = pairFromMap(current);
    if (pair) pairs.push(pair);
    current = {};
  }

  for (const node of nodes) {
    const key = norm(node.tag);
    if (isNameKey(key) && (current.value || (key === "nameen" && current.nametr) || (key === "nametr" && current.nameen))) {
      flush();
    }
    if (isNameKey(key) || isValueKey(key)) {
      current[key] = textOf(node.inner);
      continue;
    }
    flush();
  }
  flush();
  return pairs.length ? pairs : null;
}

export function parseSpecsXml(xml: string): SpecPair[] | null {
  const clean = stripUnsafe(xml);
  if (!clean) return null;
  const root = children(clean);
  if (!root.length) return null;

  const body = root.length === 1 ? children(root[0].inner) : root;
  const source = body.length ? body : root;
  const grouped = groupFlatRecords(source);
  if (grouped?.length) return grouped;

  const pairs: SpecPair[] = [];
  for (const item of source) {
    const record = pairFromNode(item);
    if (record) {
      pairs.push(record);
      continue;
    }
    const nested = children(item.inner);
    if (!nested.length) {
      const value = textOf(item.inner);
      if (value) pairs.push({ label: humanize(item.tag), value });
      continue;
    }
    const nestedGroup = groupFlatRecords(nested);
    if (nestedGroup?.length) {
      pairs.push(...nestedGroup);
      continue;
    }
    const nameNode = nested.find((node) => /^(name|label|title|key)$/i.test(localName(node.tag)));
    const valueNode = nested.find((node) => /^(value|val|content|text)$/i.test(localName(node.tag)));
    if (nameNode && valueNode) {
      pairs.push({ label: textOf(nameNode.inner) || humanize(item.tag), value: textOf(valueNode.inner) });
      continue;
    }
    for (const node of nested) {
      const inner = pairFromNode(node);
      if (inner) {
        pairs.push(inner);
        continue;
      }
      const value = textOf(node.inner);
      if (value && !isNameKey(norm(node.tag))) pairs.push({ label: humanize(node.tag), value });
    }
  }

  return pairs.length ? pairs : null;
}
