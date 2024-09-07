// 虚拟列表
// 模拟大量数据
const items = Array.from({ length: 10000 }, (_, index) => `Item ${index + 1}`);

// 配置
const itemHeight = 50; // 每个列表项的高度
const container = document.getElementById('container');
const list = document.getElementById('list');

// 设置列表的总高度
list.style.height = `${items.length * itemHeight}px`;

// 渲染可视区域内的元素
function renderVisibleItems() {
    const scrollTop = container.scrollTop;
    const containerHeight = container.clientHeight;

    // 计算可视区域的起始和结束索引
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
        items.length - 1,
        Math.floor((scrollTop + containerHeight) / itemHeight)
    );

    // 清空现有的子元素
    list.innerHTML = '';

    // 渲染可视区域内的元素
    for (let i = startIndex; i <= endIndex; i++) {
        const item = document.createElement('div');
        item.className = 'item';
        item.textContent = items[i];
        item.style.position = 'absolute';
        item.style.top = `${i * itemHeight}px`;
        list.appendChild(item);
    }
}

// 初始化时渲染
renderVisibleItems();

// 监听滚动事件
container.addEventListener('scroll', renderVisibleItems);