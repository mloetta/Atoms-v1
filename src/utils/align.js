const SortMethods = ["default", "header-a-z", "header-z-a", "content-a-z", "content-z-a", "header-0-9", "header-9-0", "content-0-9", "content-9-0"];
const AlignMethods = ["left", "center", "right"];

function width(tables) {
  let size = 0;

  tables.forEach(({ name }) => size = name.length > size ? name.length : size);

  return size;
}

function sort(tables, method) {
  switch (method) {
    case SortMethods[1]:
      return tables.sort((a, b) => a.name.localeCompare(b.name));
    case SortMethods[2]:
      return tables.sort((a, b) => b.name.localeCompare(a.name));
    case SortMethods[3]:
      return tables.sort((a, b) => a.content.localeCompare(b.content));
    case SortMethods[4]:
      return tables.sort((a, b) => b.content.localeCompare(a.content));
    case SortMethods[5]:
      return tables.sort((a, b) => b.name.length - a.name.length);
    case SortMethods[6]:
      return tables.sort((a, b) => a.name.length - b.name.length);
    case SortMethods[7]:
      return tables.sort((a, b) => b.content.length - a.content.length);
    case SortMethods[8]:
      return tables.sort((a, b) => a.content.length - b.content.length);
    default:
      return tables;
  }
}

function align({ sort: method, tables, headerAlign, leftChar, rightChar }) {
  tables = sort(tables, method);

  leftChar = leftChar || "";
  rightChar = rightChar || "";

  let size = width(tables);

  if (headerAlign == AlignMethods[1]) size = size % 2 == 1 ? size + 1 : size;

  return tables.map(({ name, content }) => {
    switch (headerAlign) {
      case AlignMethods[1]: {
        let half = Math.floor(size / 2 - name.length / 2);
        return `${leftChar}${" ".repeat(half)}${name}${" ".repeat(half - ((name.length % 2) == 1 ? 0 : 1))}${rightChar} ${content}`;
      }
      case AlignMethods[2]:
        return `${leftChar}${" ".repeat(size - name.length)}${name}${rightChar} ${content}`;
      default:
        return `${leftChar}${name}${" ".repeat(size - name.length)}${rightChar} ${content}`;
    }
  }).join("\n");
}

module.exports = align;