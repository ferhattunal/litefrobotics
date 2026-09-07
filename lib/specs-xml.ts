export type SpecPair = { label: string; value: string };

function decodeEntities(value: string) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'");
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
  return tag.replace(/[-_]+/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function textOf(inner: string) {
  return decodeEntities(inner.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

function children(xml: string) {
  const items: { tag: string; inner: string }[] = [];
  const re = /<([A-Za-z_][\w.-]*)[^>]*>([\s\S]*?)<\/\1>/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(xml))) {
    items.push({ tag: match[1], inner: match[2] });
  }
  return items;
}

export function parseSpecsXml(xml: string): SpecPair[] | null {
  const clean = stripUnsafe(xml);
  if (!clean) return null;
  const root = children(clean);
  if (!root.length) return null;

  const body = root.length === 1 ? children(root[0].inner) : root;
  const source = body.length ? body : root;
  const pairs: SpecPair[] = [];

  for (const item of source) {
    const nested = children(item.inner);
    if (!nested.length) {
      const value = textOf(item.inner);
      if (value) pairs.push({ label: humanize(item.tag), value });
      continue;
    }
    const nameNode = nested.find((node) => /^(name|label|title|key)$/i.test(node.tag));
    const valueNode = nested.find((node) => /^(value|val|content|text)$/i.test(node.tag));
    if (nameNode && valueNode) {
      pairs.push({ label: textOf(nameNode.inner) || humanize(item.tag), value: textOf(valueNode.inner) });
      continue;
    }
    for (const node of nested) {
      const value = textOf(node.inner);
      if (value) pairs.push({ label: humanize(node.tag), value });
    }
  }

  return pairs.length ? pairs : null;
}
