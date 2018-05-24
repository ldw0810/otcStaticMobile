/**
 * @description 光标设置到节点的末尾
 * @param {element} 节点
 */
export function setCursorPosition(el) {
    el.focus();
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
}
/**
 * @description 添加文本到指定光标的位置
 * @param：
 * {element} 节点
 * {value} 添加的文本
 * {lastEditRange} 最后的光标位置
 */
export function showRange(el, value) {
    el.focus();
  // 获取选定对象
    let selection = getSelection();
  // 判断是否有最后光标对象存在
    if (this.lastEditRange) {
    // 存在最后光标对象，选定对象清除所有光标并添加最后光标还原之前的状态
        selection.removeAllRanges();
        selection.addRange(this.lastEditRange);
    }
  // 判断选定对象范围是编辑框还是文本节点
    if (selection.anchorNode.nodeName !== '#text') {
        if (el.childNodes.length > 0) {
      // 如果文本框的子元素大于0，则表示有其他元素，则按照位置插入节点
            for (let i in el.childNodes) {
                if (i === selection.anchorOffset) {
                    el.insertBefore(value, el.childNodes[i]);
                }
            }
        } else {
      // 否则直接插入一个元素
            el.appendChild(value);
        }
    // 创建新的光标对象
        let range = document.createRange();
    // 光标对象的范围界定为新建的节点
        range.selectNodeContents(value);
    // 光标位置定位在节点的最大长度
        range.setStart(value, value.length);
    // 使光标开始和光标结束重叠
        range.collapse(true);
    // 清除选定对象的所有光标对象
        selection.removeAllRanges();
    // 插入新的光标对象
        selection.addRange(range);
    } else {
    // 如果是文本节点则先获取光标对象
        let range = selection.getRangeAt(0);
    // 获取光标对象的范围界定对象，一般就是textNode对象
        let textNode = range.startContainer;
    // 获取光标位置
        let rangeStartOffset = range.startOffset;
    // 文本节点在光标位置处插入新的内容
        textNode.insertData(rangeStartOffset, value);
    // 光标移动到到原来的位置加上新内容的长度
        range.setStart(textNode, rangeStartOffset + value.length);
    // 光标开始和光标结束重叠
        range.collapse(true);
    // 清除选定对象的所有光标对象
        selection.removeAllRanges();
    // 插入新的光标对象
        selection.addRange(range);
    }
  // 无论如何都要记录最后光标对象
    this.lastEditRange = selection.getRangeAt(0);
}

export function interceptEmail(emailStr) {
    let newEmail = '';
    let str = emailStr.slice(0, emailStr.indexOf('@'));
    let suffix = emailStr.slice(emailStr.indexOf('@'));
    if(str.length > 2) {
        newEmail = str.slice(0, 1) + '****' + str.slice(str.length - 1) + suffix;
    } else {
        newEmail = emailStr;
    }
    return newEmail;
}

