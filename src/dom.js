
/**
 * 获取min-content的值
 */
export function getMinContent(node) {
    const oriStyle = node.getAttribute('style')
    node.style.width = '1px';
    node.style.display = 'table';
    node.style.tableLayout = 'auto'
    const minWidth = node.getBoundingClientRect().width;
    node.setAttribute('style',oriStyle)
    return minWidth
}

/**
 * 获取max-content的值
 */
export function getMaxContent(node) {
    const oriStyle = node.getAttribute('style');
    node.style.width = 'auto';
    node.style.display = 'inline-block';
    node.style.whiteSpace = 'no-wrap'
    const maxWidth = node.getBoundingClientRect().width;
    node.setAttribute('style',oriStyle)
    return maxWidth

}

export function objectToStyleText(obj) {
    let str='';
    Object.entries(obj).forEach(([key,value])=>{
        str+=`${key}: ${value}; `
    });
    return str;
}
