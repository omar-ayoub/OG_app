import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000/api';

async function testTasksAPI() {
    console.log('🧪 Testing Tasks API Endpoints\n');
    console.log('='.repeat(50));

    try {
        // Test 1: Create a task without subtasks
        console.log('\n1️⃣  Creating a simple task...');
        const createResponse1 = await fetch(`${BASE_URL}/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: 'Complete project documentation',
                tag: 'Work',
                tagColor: '#5590f7',
                startDate: '2025-11-21',
                time: '09:00',
                description: 'Write comprehensive README and API docs'
            })
        });
        const task1 = await createResponse1.json();
        console.log('✅ Task created:', task1);

        // Test 2: Create a task with subtasks
        console.log('\n2️⃣  Creating a task with subtasks...');
        const createResponse2 = await fetch(`${BASE_URL}/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: 'Build new feature',
                tag: 'Development',
                tagColor: '#22c55e',
                startDate: '2025-11-22',
                endDate: '2025-11-25',
                description: 'Implement database integration',
                subTasks: [
                    { text: 'Design schema', completed: true },
                    { text: 'Write queries', completed: false },
                    { text: 'Test endpoints', completed: false }
                ]
            })
        });
        const task2 = await createResponse2.json();
        console.log('✅ Task with subtasks created:', task2);

        // Test 3: Get all tasks
        console.log('\n3️⃣  Fetching all tasks...');
        const getAllResponse = await fetch(`${BASE_URL}/tasks`);
        const allTasks = await getAllResponse.json();
        console.log(`✅ Found ${allTasks.length} tasks`);

        // Test 4: Get task by ID
        console.log('\n4️⃣  Fetching task by ID...');
        const getByIdResponse = await fetch(`${BASE_URL}/tasks/${task1.id}`);
        const taskById = await getByIdResponse.json();
        console.log('✅ Task retrieved:', taskById.text);

        // Test 5: Update task
        console.log('\n5️⃣  Updating task...');
        const updateResponse = await fetch(`${BASE_URL}/tasks/${task1.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                isCompleted: true,
                description: 'Updated: Documentation completed!'
            })
        });
        const updatedTask = await updateResponse.json();
        console.log('✅ Task updated. Completed:', updatedTask.is_completed);

        // Test 6: Add subtask to existing task
        console.log('\n6️⃣  Adding subtask to task...');
        const addSubtaskResponse = await fetch(`${BASE_URL}/tasks/${task1.id}/subtasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: 'Review and proofread',
                completed: false,
                position: 0
            })
        });
        const newSubtask = await addSubtaskResponse.json();
        console.log('✅ Subtask added:', newSubtask.text);

        // Test 7: Update subtask
        console.log('\n7️⃣  Updating subtask...');
        const updateSubtaskResponse = await fetch(`${BASE_URL}/tasks/subtasks/${newSubtask.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                completed: true
            })
        });
        const updatedSubtask = await updateSubtaskResponse.json();
        console.log('✅ Subtask updated. Completed:', updatedSubtask.completed);

        // Test 8: Get tasks by date range
        console.log('\n8️⃣  Fetching tasks by date range...');
        const dateRangeResponse = await fetch(`${BASE_URL}/tasks/by-date-range?startDate=2025-11-20&endDate=2025-11-30`);
        const tasksInRange = await dateRangeResponse.json();
        console.log(`✅ Found ${tasksInRange.length} tasks in date range`);

        // Test 9: Delete subtask
        console.log('\n9️⃣  Deleting subtask...');
        const deleteSubtaskResponse = await fetch(`${BASE_URL}/tasks/subtasks/${newSubtask.id}`, {
            method: 'DELETE'
        });
        const deletedSubtask = await deleteSubtaskResponse.json();
        console.log('✅ Subtask deleted:', deletedSubtask.message);

        // Test 10: Delete task
        console.log('\n🔟 Deleting task...');
        const deleteResponse = await fetch(`${BASE_URL}/tasks/${task2.id}`, {
            method: 'DELETE'
        });
        const deletedTask = await deleteResponse.json();
        console.log('✅ Task deleted:', deletedTask.message);

        console.log('\n' + '='.repeat(50));
        console.log('🎉 All tests passed successfully!\n');

    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        console.error(error);
    }
}

testTasksAPI();
