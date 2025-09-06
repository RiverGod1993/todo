// 简单的日历测试脚本

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM加载完成，开始测试日历功能...');
    
    // 检查必要的DOM元素是否存在
    const calendarView = document.getElementById('calendar-view');
    const calendarGrid = document.getElementById('calendar-grid');
    const currentMonthElement = document.getElementById('current-month');
    const todayTasksContainer = document.getElementById('today-tasks');
    
    console.log('日历视图元素检查:', {
        calendarView: !!calendarView,
        calendarGrid: !!calendarGrid,
        currentMonthElement: !!currentMonthElement,
        todayTasksContainer: !!todayTasksContainer
    });
    
    // 如果页面没有日历元素，可以尝试创建一些临时的测试数据
    if (window.tasks && Array.isArray(window.tasks) && window.tasks.length === 0) {
        console.log('没有任务数据，创建测试任务...');
        // 创建一些测试任务
        window.tasks = [
            {
                id: Date.now() + 1,
                text: '测试任务1 - 今天',
                completed: false,
                priority: 'high',
                createdAt: new Date().toISOString(),
                dueDate: new Date().toISOString()
            },
            {
                id: Date.now() + 2,
                text: '测试任务2 - 明天',
                completed: false,
                priority: 'medium',
                createdAt: new Date().toISOString(),
                dueDate: new Date(Date.now() + 86400000).toISOString()
            },
            {
                id: Date.now() + 3,
                text: '测试任务3 - 昨天',
                completed: true,
                priority: 'low',
                createdAt: new Date().toISOString(),
                dueDate: new Date(Date.now() - 86400000).toISOString()
            },
            {
                id: Date.now() + 4,
                text: '测试任务4 - 本月末',
                completed: false,
                priority: 'high',
                createdAt: new Date().toISOString(),
                dueDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString()
            }
        ];
        
        console.log('已创建测试任务:', window.tasks);
        
        // 如果saveTasks函数存在，保存任务
        if (typeof saveTasks === 'function') {
            saveTasks();
        }
    }
    
    // 如果renderCalendar函数存在，直接调用它
    if (typeof renderCalendar === 'function') {
        console.log('调用renderCalendar函数...');
        renderCalendar();
    }
    
    // 如果switchView函数存在，尝试切换到日历视图
    if (typeof switchView === 'function') {
        console.log('调用switchView函数切换到日历视图...');
        switchView('calendar');
    }
    
    console.log('日历测试脚本执行完成');
});