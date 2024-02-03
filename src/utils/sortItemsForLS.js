export function sortItemsForLS(items) {
  items.sort((a, b) => {
    if (a.type === 'Directory' && b.type === 'File') {
      return -1;
    } else if (a.type === 'File' && b.type === 'Directory') {
      return 1;
    } else {
      return a.item.localeCompare(b.item)
    }
  })
}