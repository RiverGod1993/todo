// 任务管理应用的主要逻辑

// DOM元素
const addTaskForm = document.getElementById('add-task-form');
const newTaskInput = document.getElementById('new-task-input');
const taskPriority = document.getElementById('task-priority');
const taskDueDate = document.getElementById('task-due-date');
const tasksContainer = document.getElementById('tasks-container');
const emptyState = document.getElementById('empty-state');
const tasksFooter = document.getElementById('tasks-footer');
const totalTasksCount = document.getElementById('total-tasks-count');
const pendingTasksCount = document.getElementById('pending-tasks-count');
const clearCompletedBtn = document.getElementById('clear-completed-btn');
const filterBtns = document.querySelectorAll('.filter-btn');
const searchTasksInput = document.getElementById('search-tasks');
const taskSortSelect = document.getElementById('task-sort');
const currentDateElement = document.getElementById('current-date');
const quickAddBtn = document.getElementById('quick-add-btn');

// 视图相关元素
const listView = document.getElementById('list-view');
const calendarView = document.getElementById('calendar-view');
const statisticsView = document.getElementById('statistics-view');
const listViewBtn = document.getElementById('list-view-btn');
const calendarViewBtn = document.getElementById('calendar-view-btn');
const calendarViewBtnSecondary = document.getElementById('calendar-view-btn-secondary');
const statisticsBtn = document.getElementById('statistics-btn');

// 日历相关元素
const calendarGrid = document.getElementById('calendar-grid');
const currentMonthElement = document.getElementById('current-month');
const prevMonthBtn = document.getElementById('prev-month');
const nextMonthBtn = document.getElementById('next-month');
const todayTasksContainer = document.getElementById('today-tasks');

// 编辑模态框元素
const editModal = document.getElementById('edit-modal');
const modalContent = document.getElementById('modal-content');
const editTaskForm = document.getElementById('edit-task-form');
const editTaskIdInput = document.getElementById('edit-task-id');
const editTaskInput = document.getElementById('edit-task-input');
const editTaskPrioritySelect = document.getElementById('edit-task-priority');
const editTaskDueDate = document.getElementById('edit-task-due-date');
const closeModalBtn = document.getElementById('close-modal');
const cancelEditBtn = document.getElementById('cancel-edit-btn');

// 应用状态
let tasks = [];
let currentFilter = 'all';
let currentSearchTerm = '';
let currentSortBy = 'date-desc';
let currentView = 'calendar'; // 'list' 或 'calendar'
let currentCalendarDate = new Date();

// 初始化应用
function initApp() {
    // 从localStorage加载任务
    loadTasks();
    
    // 如果没有任务，添加一些示例任务
    if (tasks.length === 0) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        // 添加示例任务
        tasks = [
            {
                id: Date.now() + 1,
                text: '完成项目提案',
                completed: false,
                priority: 'high',
                createdAt: today.toISOString(),
                dueDate: today.toISOString()
            },
            {
                id: Date.now() + 2,
                text: '回复重要邮件',
                completed: false,
                priority: 'medium',
                createdAt: today.toISOString(),
                dueDate: today.toISOString()
            },
            {
                id: Date.now() + 3,
                text: '购买办公用品',
                completed: true,
                priority: 'low',
                createdAt: yesterday.toISOString(),
                dueDate: yesterday.toISOString()
            },
            {
                id: Date.now() + 4,
                text: '团队周会',
                completed: false,
                priority: 'high',
                createdAt: today.toISOString(),
                dueDate: tomorrow.toISOString()
            }
        ];
        
        // 保存示例任务到本地存储
        saveTasks();
    }
    
    // 更新当前日期
    updateCurrentDate();
    
    // 添加事件监听器
    addEventListeners();
    
    // 手动设置日历视图按钮的激活状态
    calendarViewBtn.classList.add('text-primary', 'font-medium');
    calendarViewBtn.classList.remove('text-gray-600');
    calendarViewBtnSecondary.classList.add('text-primary', 'font-medium');
    calendarViewBtnSecondary.classList.remove('text-gray-600');
    listViewBtn.classList.add('text-gray-600');
    listViewBtn.classList.remove('text-primary', 'font-medium');
    
    // 渲染当前视图
    renderCurrentView();
}

// 从localStorage加载任务
function loadTasks() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    }
}

// 保存任务到localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderCurrentView();
}

// 更新当前日期
function updateCurrentDate() {
    const now = new Date();
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    };
    currentDateElement.textContent = now.toLocaleDateString('zh-CN', options);
}

// 添加事件监听器
function addEventListeners() {
    // 添加任务表单提交
    addTaskForm.addEventListener('submit', handleAddTask);
    
    // 清除已完成任务
    clearCompletedBtn.addEventListener('click', handleClearCompleted);
    
    // 任务过滤器按钮
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => handleFilterChange(btn.dataset.filter));
    });
    
    // 搜索任务
    searchTasksInput.addEventListener('input', () => {
        currentSearchTerm = searchTasksInput.value.toLowerCase();
        renderCurrentView();
    });
    
    // 排序任务
    taskSortSelect.addEventListener('change', () => {
        currentSortBy = taskSortSelect.value;
        renderCurrentView();
    });
    
    // 快速添加按钮
    quickAddBtn.addEventListener('click', () => {
        const taskText = newTaskInput.value.trim();
        if (taskText) {
            // 如果输入框有内容，直接添加任务
            addTaskForm.dispatchEvent(new Event('submit'));
        } else {
            // 如果输入框为空，聚焦到输入框
            newTaskInput.focus();
        }
    });
    
    // 编辑模态框事件
    closeModalBtn.addEventListener('click', closeEditModal);
    cancelEditBtn.addEventListener('click', closeEditModal);
    editTaskForm.addEventListener('submit', handleEditTask);
    
    // 点击模态框外部关闭
    editModal.addEventListener('click', (e) => {
        if (e.target === editModal) {
            closeEditModal();
        }
    });
    
    // 阻止模态框内容传播点击事件
    modalContent.addEventListener('click', (e) => {
        e.stopPropagation();
    });
    
    // 视图切换按钮
    listViewBtn.addEventListener('click', () => switchView('list'));
    calendarViewBtn.addEventListener('click', () => switchView('calendar'));
    calendarViewBtnSecondary.addEventListener('click', () => switchView('calendar'));
    statisticsBtn.addEventListener('click', () => switchView('statistics'));
    
    // 日历导航按钮
    prevMonthBtn.addEventListener('click', goToPreviousMonth);
    nextMonthBtn.addEventListener('click', goToNextMonth);
}

// 处理添加任务
function handleAddTask(e) {
    e.preventDefault();
    
    const taskText = newTaskInput.value.trim();
    const priority = taskPriority.value;
    const dueDate = taskDueDate.value;
    
    if (taskText) {
        const newTask = {
            id: Date.now(),
            text: taskText,
            completed: false,
            priority: priority,
            createdAt: new Date().toISOString(),
            dueDate: dueDate ? new Date(dueDate).toISOString() : null
        };
        
        tasks.push(newTask);
        saveTasks();
        renderTasks();
        
        // 重置表单
        newTaskInput.value = '';
        taskPriority.value = 'medium';
        taskDueDate.value = '';
        newTaskInput.focus();
        
        // 添加成功动画
        showNotification('任务添加成功！', 'success');
    }
}

// 切换视图
function switchView(view) {
    currentView = view;
    
    // 更新视图按钮状态
    if (view === 'list') {
        listViewBtn.classList.add('text-primary', 'font-medium');
        listViewBtn.classList.remove('text-gray-600');
        calendarViewBtn.classList.add('text-gray-600');
        calendarViewBtn.classList.remove('text-primary', 'font-medium');
        calendarViewBtnSecondary.classList.add('text-gray-600');
        calendarViewBtnSecondary.classList.remove('text-primary', 'font-medium');
        statisticsBtn.classList.add('text-gray-600');
        statisticsBtn.classList.remove('text-primary', 'font-medium');
        
        // 显示列表视图，隐藏其他视图
        listView.classList.remove('hidden');
        calendarView.classList.add('hidden');
        statisticsView.classList.add('hidden');
        
        // 显示任务过滤器和排序
        document.getElementById('task-filters').classList.remove('hidden');
        document.getElementById('task-sort-container').classList.remove('hidden');
    } else if (view === 'calendar') {
        calendarViewBtn.classList.add('text-primary', 'font-medium');
        calendarViewBtn.classList.remove('text-gray-600');
        calendarViewBtnSecondary.classList.add('text-primary', 'font-medium');
        calendarViewBtnSecondary.classList.remove('text-gray-600');
        listViewBtn.classList.add('text-gray-600');
        listViewBtn.classList.remove('text-primary', 'font-medium');
        statisticsBtn.classList.add('text-gray-600');
        statisticsBtn.classList.remove('text-primary', 'font-medium');
        
        // 显示日历视图，隐藏其他视图
        calendarView.classList.remove('hidden');
        listView.classList.add('hidden');
        statisticsView.classList.add('hidden');
        
        // 隐藏任务过滤器和排序
        document.getElementById('task-filters').classlist.add('hidden');
        document.getElementById('task-sort-container').classlist.add('hidden');
        
        // 渲染日历
        renderCalendar();
    } else if (view === 'statistics') {
        statisticsBtn.classList.add('text-primary', 'font-medium');
        statisticsBtn.classList.remove('text-gray-600');
        listViewBtn.classList.add('text-gray-600');
        listViewBtn.classList.remove('text-primary', 'font-medium');
        calendarViewBtn.classList.add('text-gray-600');
        calendarViewBtn.classList.remove('text-primary', 'font-medium');
        calendarViewBtnSecondary.classList.add('text-gray-600');
        calendarViewBtnSecondary.classList.remove('text-primary', 'font-medium');
        
        // 显示统计视图，隐藏其他视图
        statisticsView.classList.remove('hidden');
        listView.classList.add('hidden');
        calendarView.classList.add('hidden');
        
        // 隐藏任务过滤器和排序
        document.getElementById('task-filters').classlist.add('hidden');
        document.getElementById('task-sort-container').classlist.add('hidden');
        
        // 渲染统计
        renderStatistics();
    }
}

// 根据当前视图模式渲染内容
function renderCurrentView() {
    if (currentView === 'list') {
        renderTasks();
    } else if (currentView === 'calendar') {
        renderCalendar();
    } else if (currentView === 'statistics') {
        renderStatistics();
    }
}

// 处理编辑任务
function handleEditTask(e) {
    e.preventDefault();
    
    const taskId = parseInt(editTaskIdInput.value);
    const newText = editTaskInput.value.trim();
    const newPriority = editTaskPrioritySelect.value;
    
    if (newText) {
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            tasks[taskIndex].text = newText;
            tasks[taskIndex].priority = newPriority;
            
            // 更新截止日期
            if (editTaskDueDate.value) {
                tasks[taskIndex].dueDate = new Date(editTaskDueDate.value).toISOString();
            } else {
                tasks[taskIndex].dueDate = null;
            }
            
            saveTasks();
            renderTasks();
            closeEditModal();
            
            // 编辑成功通知
            showNotification('任务已更新！', 'success');
        }
    }
}

// 处理过滤改变
function handleFilterChange(filter) {
    currentFilter = filter;
    
    // 更新过滤按钮样式
    filterBtns.forEach(btn => {
        if (btn.dataset.filter === filter) {
            btn.classList.remove('bg-neutral-light', 'text-gray-600', 'hover:bg-gray-200');
            btn.classList.add('bg-primary', 'text-white');
        } else {
            btn.classList.remove('bg-primary', 'text-white');
            btn.classList.add('bg-neutral-light', 'text-gray-600', 'hover:bg-gray-200');
        }
    });
    
    renderTasks();
}

// 处理清除已完成任务
function handleClearCompleted() {
    const completedCount = tasks.filter(task => task.completed).length;
    
    if (completedCount > 0) {
        if (confirm(`确定要删除所有 ${completedCount} 个已完成的任务吗？`)) {
            tasks = tasks.filter(task => !task.completed);
            saveTasks();
            renderTasks();
            
            // 清除成功通知
            showNotification(`已删除 ${completedCount} 个任务！`, 'success');
        }
    } else {
        showNotification('没有已完成的任务可清除', 'info');
    }
}

// 打开编辑模态框
function openEditModal(taskId) {
    const task = tasks.find(task => task.id === taskId);
    if (task) {
        editTaskIdInput.value = task.id;
        editTaskInput.value = task.text;
        editTaskPrioritySelect.value = task.priority;
        
        // 设置截止日期
        if (task.dueDate) {
            const date = new Date(task.dueDate);
            // 格式化日期为YYYY-MM-DD格式
            const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            editTaskDueDate.value = formattedDate;
        } else {
            editTaskDueDate.value = '';
        }
        
        // 显示模态框
        editModal.classList.remove('hidden');
        setTimeout(() => {
            modalContent.classList.remove('scale-95', 'opacity-0');
            modalContent.classList.add('scale-100', 'opacity-100');
        }, 10);
        
        // 聚焦到输入框
        editTaskInput.focus();
    }
}

// 关闭编辑模态框
function closeEditModal() {
    modalContent.classList.remove('scale-100', 'opacity-100');
    modalContent.classList.add('scale-95', 'opacity-0');
    
    setTimeout(() => {
        editModal.classList.add('hidden');
    }, 300);
}

// 切换任务完成状态
function toggleTaskCompletion(taskId) {
    const task = tasks.find(task => task.id === taskId);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
        
        // 显示状态改变通知
        const statusText = task.completed ? '已完成' : '未完成';
        showNotification(`任务标记为${statusText}`, 'success');
    }
}

// 删除任务
function deleteTask(taskId, taskText) {
    if (confirm(`确定要删除任务："${taskText}"吗？`)) {
        tasks = tasks.filter(task => task.id !== taskId);
        saveTasks();
        renderTasks();
        
        // 删除成功通知
        showNotification('任务已删除', 'success');
    }
}

// 过滤和排序任务
function getFilteredAndSortedTasks() {
    // 过滤任务
    let filteredTasks = tasks.filter(task => {
        // 应用搜索过滤
        const matchesSearch = task.text.toLowerCase().includes(currentSearchTerm);
        
        // 应用状态过滤
        let matchesFilter = true;
        if (currentFilter === 'pending') {
            matchesFilter = !task.completed;
        } else if (currentFilter === 'completed') {
            matchesFilter = task.completed;
        } else if (currentFilter === 'high') {
            matchesFilter = task.priority === 'high';
        }
        
        return matchesSearch && matchesFilter;
    });
    
    // 排序任务
    filteredTasks.sort((a, b) => {
        if (currentSortBy === 'date-desc') {
            return new Date(b.createdAt) - new Date(a.createdAt);
        } else if (currentSortBy === 'date-asc') {
            return new Date(a.createdAt) - new Date(b.createdAt);
        } else if (currentSortBy === 'priority') {
            // 优先级排序：high > medium > low
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        return 0;
    });
    
    return filteredTasks;
}

// 渲染任务列表
function renderTasks() {
    const filteredAndSortedTasks = getFilteredAndSortedTasks();
    const pendingCount = tasks.filter(task => !task.completed).length;
    
    // 更新计数器
    pendingTasksCount.textContent = pendingCount;
    totalTasksCount.textContent = tasks.length;
    
    // 清空任务容器
    tasksContainer.innerHTML = '';
    
    // 检查是否有任务
    if (tasks.length === 0) {
        // 显示空状态
        tasksContainer.appendChild(emptyState);
        tasksFooter.classList.add('hidden');
    } else {
        // 隐藏空状态
        if (emptyState.parentNode) {
            emptyState.parentNode.removeChild(emptyState);
        }
        
        // 显示任务列表
        tasksFooter.classList.remove('hidden');
        
        // 检查过滤后是否有任务
        if (filteredAndSortedTasks.length === 0) {
            // 显示无匹配任务
            const noMatchElement = document.createElement('div');
            noMatchElement.className = 'p-10 text-center';
            noMatchElement.innerHTML = `
                <div class="inline-flex items-center justify-center w-16 h-16 bg-neutral-light rounded-full mb-4">
                    <i class="fa fa-search text-2xl text-gray-400"></i>
                </div>
                <h4 class="text-lg font-medium text-gray-700 mb-1">未找到匹配的任务</h4>
                <p class="text-gray-500">尝试更改筛选条件或搜索关键词</p>
            `;
            tasksContainer.appendChild(noMatchElement);
        } else {
            // 渲染每个任务
            filteredAndSortedTasks.forEach(task => {
                const taskElement = createTaskElement(task);
                tasksContainer.appendChild(taskElement);
            });
        }
    }
}

// 渲染日历视图
function renderCalendar() {
    // 清空日历网格
    calendarGrid.innerHTML = '';
    todayTasksContainer.innerHTML = '';
    
    // 更新当前月份显示
    const options = { year: 'numeric', month: 'long' };
    currentMonthElement.textContent = currentCalendarDate.toLocaleDateString('zh-CN', options);
    
    // 获取当月第一天和最后一天
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // 获取当月第一天是星期几 (0-6, 0是星期日)
    const firstDayIndex = firstDay.getDay();
    // 获取当月的总天数
    const daysInMonth = lastDay.getDate();
    
    // 获取上个月的最后一天
    const prevLastDay = new Date(year, month, 0);
    const prevDaysInMonth = prevLastDay.getDate();
    

    
    // 渲染上个月的剩余天数
    for (let i = firstDayIndex; i > 0; i--) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day p-2 text-center border border-gray-100 bg-gray-50 text-gray-400';
        dayElement.textContent = prevDaysInMonth - i + 1;
        calendarGrid.appendChild(dayElement);
    }
    
    // 渲染当月的天数
    const today = new Date();
    const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year;
    
    for (let i = 1; i <= daysInMonth; i++) {
        const dayElement = document.createElement('div');
        const isToday = isCurrentMonth && today.getDate() === i;
        
        dayElement.className = `calendar-day p-2 border border-gray-100 relative transition-all cursor-pointer hover:bg-gray-50`;
        
        // 如果是今天，添加特殊样式
        if (isToday) {
            dayElement.classList.add('bg-primary/10', 'font-medium');
            dayElement.innerHTML = `<span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white">${i}</span>`;
        } else {
            dayElement.textContent = i;
        }
        
        // 获取当天的任务
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        
        // 修复：确保日期计算正确，特别是对于时区问题
        const dayTasks = tasks.filter(task => {
            const taskDate = task.dueDate ? new Date(task.dueDate) : new Date(task.createdAt);
            // 修复：使用toDateString()来比较日期，避免时区问题
            const taskDateOnly = new Date(taskDate.getFullYear(), taskDate.getMonth(), taskDate.getDate());
            const currentDateOnly = new Date(year, month, i);
            return taskDateOnly.toDateString() === currentDateOnly.toDateString();
        });
        
        // 如果当天有任务，添加任务指示器
        if (dayTasks.length > 0) {
            // 给日期添加特殊背景色表示有任务
            dayElement.classList.add('bg-blue-50');
            
            const tasksIndicator = document.createElement('div');
            tasksIndicator.className = 'flex gap-1 mt-1 justify-center flex-wrap';
            
            // 添加最多3个任务指示器
            const displayTasks = dayTasks.slice(0, 3);
            displayTasks.forEach(task => {
                const taskDot = document.createElement('div');
                // 根据优先级设置不同颜色
                let dotColor = 'bg-green-500'; // 低优先级
                if (task.priority === 'high') {
                    dotColor = 'bg-red-500';
                } else if (task.priority === 'medium') {
                    dotColor = 'bg-yellow-500';
                }
                taskDot.className = `w-2 h-2 rounded-full ${dotColor}`;
                tasksIndicator.appendChild(taskDot);
            });
            
            // 如果有更多任务，显示省略号
            if (dayTasks.length > 3) {
                const moreIndicator = document.createElement('div');
                moreIndicator.className = 'text-xs text-gray-500';
                moreIndicator.textContent = `+${dayTasks.length - 3}`;
                tasksIndicator.appendChild(moreIndicator);
            }
            
            dayElement.appendChild(tasksIndicator);
        }
        
        // 添加点击事件，显示当天任务
        dayElement.addEventListener('click', () => {
            showDayTasks(dateStr, i, dayTasks);
        });
        
        calendarGrid.appendChild(dayElement);
    }
    
    // 计算需要补充多少天才能填满日历网格
    const totalDaysRendered = firstDayIndex + daysInMonth;
    const remainingDays = 42 - totalDaysRendered; // 6行7列 = 42个格子
    
    // 渲染下个月的开始天数
    for (let i = 1; i <= remainingDays; i++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day p-2 text-center border border-gray-100 bg-gray-50 text-gray-400';
        dayElement.textContent = i;
        calendarGrid.appendChild(dayElement);
    }
    
    // 如果是今天，显示今天的任务
    if (isCurrentMonth) {
        const todayDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        const todayTasks = tasks.filter(task => {
            const taskDate = task.dueDate ? new Date(task.dueDate) : new Date(task.createdAt);
            return taskDate.toDateString() === today.toDateString();
        });
        showDayTasks(todayDateStr, today.getDate(), todayTasks);
    }
}

// 显示当天的任务
function showDayTasks(dateStr, day, tasks) {
    todayTasksContainer.innerHTML = '';
    
    const dateHeader = document.createElement('div');
    dateHeader.className = 'flex justify-between items-center mb-4';
    dateHeader.innerHTML = `
        <h3 class="text-lg font-medium">${currentCalendarDate.getFullYear()}年${currentCalendarDate.getMonth() + 1}月${day}日 任务</h3>
        <span class="text-sm text-gray-500">共 ${tasks.length} 个任务</span>
    `;
    todayTasksContainer.appendChild(dateHeader);
    
    if (tasks.length === 0) {
        const noTasksElement = document.createElement('div');
        noTasksElement.className = 'text-center py-8 text-gray-500';
        noTasksElement.innerHTML = `
            <i class="fa fa-calendar-o text-3xl mb-2"></i>
            <p>当天没有任务</p>
        `;
        todayTasksContainer.appendChild(noTasksElement);
    } else {
        const tasksList = document.createElement('div');
        tasksList.className = 'space-y-2';
        
        tasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.className = `p-3 rounded-lg flex items-center gap-2 ${task.completed ? 'bg-gray-50' : 'bg-white shadow-sm'}`;
            
            const checkbox = document.createElement('button');
            checkbox.className = `w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${task.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'}`;
            if (task.completed) {
                checkbox.innerHTML = '<i class="fa fa-check text-white text-xs"></i>';
            }
            checkbox.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleTaskCompletion(task.id);
            });
            
            const taskContent = document.createElement('div');
            taskContent.className = 'flex-1 min-w-0';
            const taskText = document.createElement('p');
            taskText.className = `text-sm ${task.completed ? 'text-gray-400 line-through' : 'text-gray-800'}`;
            taskText.textContent = task.text;
            
            const taskMeta = document.createElement('div');
            taskMeta.className = 'flex items-center gap-2 mt-1';
            const priorityBadge = document.createElement('span');
            priorityBadge.className = `text-xs px-2 py-0.5 rounded-full ${getPriorityClass(task.priority)}`;
            priorityBadge.textContent = getPriorityText(task.priority);
            
            const taskActions = document.createElement('div');
            taskActions.className = 'flex items-center gap-1 ml-auto';
            const editBtn = document.createElement('button');
            editBtn.className = 'p-1 text-gray-500 hover:text-gray-700';
            editBtn.innerHTML = '<i class="fa fa-pencil"></i>';
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                openEditModal(task.id);
            });
            
            taskMeta.appendChild(priorityBadge);
            taskContent.appendChild(taskText);
            taskContent.appendChild(taskMeta);
            taskActions.appendChild(editBtn);
            taskElement.appendChild(checkbox);
            taskElement.appendChild(taskContent);
            taskElement.appendChild(taskActions);
            
            // 点击任务项切换完成状态
            taskElement.addEventListener('click', () => {
                toggleTaskCompletion(task.id);
            });
            
            tasksList.appendChild(taskElement);
        });
        
        todayTasksContainer.appendChild(tasksList);
    }
}

// 切换到上个月
function goToPreviousMonth() {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
    renderCalendar();
}

// 切换到下个月
function goToNextMonth() {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
    renderCalendar();
}

// 创建单个任务元素
function createTaskElement(task) {
    const taskElement = document.createElement('div');
    taskElement.className = 'p-4 flex items-center gap-3 transition-all duration-200 card-hover group';
    
    // 根据优先级添加边框
    if (task.priority === 'high') {
        taskElement.classList.add('border-l-4', 'border-l-red-500');
    } else if (task.priority === 'medium') {
        taskElement.classList.add('border-l-4', 'border-l-yellow-500');
    } else {
        taskElement.classList.add('border-l-4', 'border-l-green-500');
    }
    
    const createdAt = new Date(task.createdAt);
    const formattedDate = `${createdAt.getFullYear()}-${String(createdAt.getMonth() + 1).padStart(2, '0')}-${String(createdAt.getDate()).padStart(2, '0')}`;
    
    taskElement.innerHTML = `
        <button
            class="task-checkbox w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors"
            data-id="${task.id}"
        >
            ${task.completed ? 
                '<i class="fa fa-check text-white text-xs"></i>' : ''
            }
        </button>
        <div class="flex-1 min-w-0">
            <p class="task-text text-gray-800 ${task.completed ? 'task-completed' : ''}" data-id="${task.id}">
                ${escapeHTML(task.text)}
            </p>
            <div class="flex justify-between items-center mt-1">
                <div class="flex items-center gap-2">
                    <span class="text-xs text-gray-500">添加于 ${formattedDate}</span>
                    ${task.dueDate ? 
                        `<span class="text-xs text-blue-500">截止: ${formatDueDate(task.dueDate)}</span>` : 
                        ''
                    }
                </div>
                <span class="text-xs px-2 py-0.5 rounded-full ${getPriorityClass(task.priority)}">
                    ${getPriorityText(task.priority)}
                </span>
            </div>
        </div>
        <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
                class="edit-btn p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                data-id="${task.id}"
            >
                <i class="fa fa-pencil text-gray-600"></i>
            </button>
            <button
                class="delete-btn p-1.5 rounded-full hover:bg-red-50 transition-colors"
                data-id="${task.id}"
            >
                <i class="fa fa-trash text-red-500"></i>
            </button>
        </div>
    `;
    
    // 设置复选框样式
    const checkbox = taskElement.querySelector('.task-checkbox');
    if (task.completed) {
        checkbox.classList.add('bg-green-500', 'border-green-500');
    } else {
        checkbox.classList.add('border-gray-300', 'hover:border-gray-400');
    }
    
    // 添加事件监听器
    checkbox.addEventListener('click', () => toggleTaskCompletion(task.id));
    
    const taskTextElement = taskElement.querySelector('.task-text');
    taskTextElement.addEventListener('click', () => toggleTaskCompletion(task.id));
    
    const editBtn = taskElement.querySelector('.edit-btn');
    editBtn.addEventListener('click', () => openEditModal(task.id));
    
    const deleteBtn = taskElement.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => deleteTask(task.id, task.text));
    
    return taskElement;
}

// 获取优先级样式类
function getPriorityClass(priority) {
    switch (priority) {
        case 'high':
            return 'bg-red-50 text-red-600';
        case 'medium':
            return 'bg-yellow-50 text-yellow-600';
        case 'low':
            return 'bg-green-50 text-green-600';
        default:
            return 'bg-gray-50 text-gray-600';
    }
}

// 获取优先级文本
function getPriorityText(priority) {
    switch (priority) {
        case 'high':
            return '高优先级';
        case 'medium':
            return '中优先级';
        case 'low':
            return '低优先级';
        default:
            return '普通';
    }
}

// 格式化截止日期
function formatDueDate(dueDate) {
    const date = new Date(dueDate);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

// 显示通知
function showNotification(message, type = 'info') {
    // 检查是否已有通知，如果有则移除
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification fixed top-4 right-4 p-4 rounded-lg shadow-lg max-w-xs transform transition-all duration-500 translate-x-full z-50 flex items-center gap-2`;
    
    // 设置通知类型样式
    if (type === 'success') {
        notification.classList.add('bg-green-50', 'text-green-800', 'border-l-4', 'border-l-green-500');
        notification.innerHTML = '<i class="fa fa-check-circle text-green-500"></i>';
    } else if (type === 'error') {
        notification.classList.add('bg-red-50', 'text-red-800', 'border-l-4', 'border-l-red-500');
        notification.innerHTML = '<i class="fa fa-exclamation-circle text-red-500"></i>';
    } else {
        notification.classList.add('bg-blue-50', 'text-blue-800', 'border-l-4', 'border-l-blue-500');
        notification.innerHTML = '<i class="fa fa-info-circle text-blue-500"></i>';
    }
    
    // 添加消息文本
    const messageSpan = document.createElement('span');
    messageSpan.textContent = message;
    notification.appendChild(messageSpan);
    
    // 添加关闭按钮
    const closeBtn = document.createElement('button');
    closeBtn.className = 'ml-auto text-gray-400 hover:text-gray-600';
    closeBtn.innerHTML = '<i class="fa fa-times"></i>';
    closeBtn.addEventListener('click', () => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            notification.remove();
        }, 500);
    });
    notification.appendChild(closeBtn);
    
    // 添加到文档
    document.body.appendChild(notification);
    
    // 显示通知
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 10);
    
    // 自动关闭
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 3000);
}

// HTML转义函数
function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 添加键盘快捷键
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl+Enter 添加任务
        if (e.ctrlKey && e.key === 'Enter') {
            const activeElement = document.activeElement;
            if (activeElement !== newTaskInput) {
                newTaskInput.focus();
            } else if (newTaskInput.value.trim()) {
                addTaskForm.dispatchEvent(new Event('submit'));
            }
        }
        
        // Escape 关闭模态框
        if (e.key === 'Escape' && !editModal.classList.contains('hidden')) {
            closeEditModal();
        }
    });
}

// 初始化应用
initApp();

// 设置键盘快捷键
setupKeyboardShortcuts();

// 渲染统计视图
function renderStatistics() {
    const tasks = loadTasks();
    
    // 计算统计数据
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    // 按优先级统计
    const priorityStats = {
        high: tasks.filter(task => task.priority === 'high').length,
        medium: tasks.filter(task => task.priority === 'medium').length,
        low: tasks.filter(task => task.priority === 'low').length
    };
    
    // 更新统计视图
    document.getElementById('total-tasks-count').textContent = totalTasks;
    document.getElementById('completed-tasks-count').textContent = completedTasks;
    document.getElementById('pending-tasks-count').textContent = pendingTasks;
    document.getElementById('completion-rate').textContent = `${completionRate}%`;
    
    // 更新优先级分布
    document.getElementById('high-priority-count').textContent = priorityStats.high;
    document.getElementById('medium-priority-count').textContent = priorityStats.medium;
    document.getElementById('low-priority-count').textContent = priorityStats.low;
    
    // 更新进度条
    const completionBar = document.getElementById('completion-bar');
    completionBar.style.width = `${completionRate}%`;
    
    // 渲染最近活动（最近7天创建的任务）
    const recentActivityList = document.getElementById('recent-activity-list');
    recentActivityList.innerHTML = '';
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentTasks = tasks
        .filter(task => new Date(task.createdAt) >= sevenDaysAgo)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
    
    if (recentTasks.length === 0) {
        recentActivityList.innerHTML = `
            <div class="text-center py-8 text-gray-500">
                <i class="fa fa-inbox text-3xl mb-2"></i>
                <p>最近7天没有活动</p>
            </div>
        `;
    } else {
        recentTasks.forEach(task => {
            const createdAt = new Date(task.createdAt);
            const formattedDate = `${createdAt.getFullYear()}-${String(createdAt.getMonth() + 1).padStart(2, '0')}-${String(createdAt.getDate()).padStart(2, '0')}`;
            const formattedTime = `${String(createdAt.getHours()).padStart(2, '0')}:${String(createdAt.getMinutes()).padStart(2, '0')}`;
            
            const activityItem = document.createElement('div');
            activityItem.className = 'flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors';
            activityItem.innerHTML = `
                <div class="w-8 h-8 rounded-full flex items-center justify-center ${
                    task.completed ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                }">
                    <i class="fa ${task.completed ? 'fa-check' : 'fa-plus'} text-xs"></i>
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-800 truncate">${escapeHTML(task.text)}</p>
                    <p class="text-xs text-gray-500">${formattedDate} ${formattedTime}</p>
                </div>
                <span class="text-xs px-2 py-1 rounded-full ${getPriorityClass(task.priority)}">
                    ${getPriorityText(task.priority)}
                </span>
            `;
            recentActivityList.appendChild(activityItem);
        });
    }
}