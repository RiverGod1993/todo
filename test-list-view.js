// 列表视图测试脚本
console.log('开始测试列表视图功能...');

// 检查DOM元素是否存在
const listViewBtn = document.getElementById('list-view-btn');
const calendarViewBtnSecondary = document.getElementById('calendar-view-btn-secondary');
const statisticsBtn = document.getElementById('statistics-btn');
const listView = document.getElementById('list-view');
const calendarView = document.getElementById('calendar-view');
const statisticsView = document.getElementById('statistics-view');

console.log('DOM元素检查:');
console.log('- listViewBtn:', listViewBtn ? '存在' : '不存在');
console.log('- calendarViewBtnSecondary:', calendarViewBtnSecondary ? '存在' : '不存在');
console.log('- statisticsBtn:', statisticsBtn ? '存在' : '不存在');
console.log('- listView:', listView ? '存在' : '不存在');
console.log('- calendarView:', calendarView ? '存在' : '不存在');
console.log('- statisticsView:', statisticsView ? '存在' : '不存在');

// 如果所有元素都存在，进行视图切换测试
if (listViewBtn && calendarViewBtnSecondary && statisticsBtn && listView && calendarView && statisticsView) {
    console.log('\n开始视图切换测试:');
    
    // 获取当前视图状态
    const getCurrentViewState = () => {
        return {
            listViewVisible: !listView.classList.contains('hidden'),
            calendarViewVisible: !calendarView.classList.contains('hidden'),
            statisticsViewVisible: !statisticsView.classList.contains('hidden'),
            listViewBtnActive: listViewBtn.classList.contains('text-primary') && listViewBtn.classList.contains('font-medium'),
            calendarViewBtnActive: calendarViewBtnSecondary.classList.contains('text-primary') && calendarViewBtnSecondary.classList.contains('font-medium'),
            statisticsBtnActive: statisticsBtn.classList.contains('text-primary') && statisticsBtn.classList.contains('font-medium')
        };
    };
    
    // 显示当前视图状态
    const logViewState = (action) => {
        const state = getCurrentViewState();
        console.log(`\n${action}后的视图状态:`);
        console.log(`- 列表视图可见: ${state.listViewVisible}`);
        console.log(`- 日历视图可见: ${state.calendarViewVisible}`);
        console.log(`- 统计视图可见: ${state.statisticsViewVisible}`);
        console.log(`- 列表按钮激活: ${state.listViewBtnActive}`);
        console.log(`- 日历按钮激活: ${state.calendarViewBtnActive}`);
        console.log(`- 统计按钮激活: ${state.statisticsBtnActive}`);
    };
    
    // 记录初始状态
    logViewState('初始');
    
    // 模拟点击日历视图按钮
    console.log('\n点击日历视图按钮...');
    calendarViewBtnSecondary.click();
    setTimeout(() => {
        logViewState('点击日历视图按钮');
        
        // 模拟点击统计视图按钮
        console.log('\n点击统计视图按钮...');
        statisticsBtn.click();
        setTimeout(() => {
            logViewState('点击统计视图按钮');
            
            // 模拟点击列表视图按钮
            console.log('\n点击列表视图按钮...');
            listViewBtn.click();
            setTimeout(() => {
                logViewState('点击列表视图按钮');
                
                // 检查列表视图功能是否正常
                const tasksContainer = document.querySelector('#list-view .task-list');
                const tasks = tasksContainer.querySelectorAll('.task-item');
                console.log(`\n列表视图包含 ${tasks.length} 个任务项`);
                
                // 检查列表视图是否显示了任务过滤器和排序
                const taskFilters = document.getElementById('task-filters');
                const taskSortContainer = document.getElementById('task-sort-container');
                console.log(`任务过滤器可见: ${!taskFilters.classList.contains('hidden')}`);
                console.log(`任务排序容器可见: ${!taskSortContainer.classList.contains('hidden')}`);
                
                console.log('\n列表视图测试完成!');
            }, 500);
        }, 500);
    }, 500);
} else {
    console.error('无法找到所有必要的DOM元素，测试无法继续');
}

// 创建一个简单的UI通知来显示测试结果
function showTestResult(message) {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-3 rounded-lg shadow-lg z-50 max-w-sm';
    notification.innerHTML = `<p class="font-mono text-sm">${message}</p>`;
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 3秒后自动移除
    setTimeout(() => {
        notification.classList.add('opacity-0', 'transition-opacity', 'duration-500');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 5000);
}

// 延迟显示测试结果通知
setTimeout(() => {
    showTestResult('列表视图测试已执行，请查看控制台输出以获取详细信息');
}, 2000);