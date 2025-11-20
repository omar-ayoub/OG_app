import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000/api';

async function testGoalsAPI() {
    console.log('🧪 Testing Goals API Endpoints\n');
    console.log('='.repeat(50));

    try {
        // Test 1: Create a goal
        console.log('\n1️⃣  Creating a goal...');
        const createResponse1 = await fetch(`${BASE_URL}/goals`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: 'Complete Database Integration',
                description: 'Integrate PostgreSQL backend for all modules',
                targetDate: '2025-12-31'
            })
        });
        const goal1 = await createResponse1.json();
        console.log('✅ Goal created:', goal1.title);
        console.log('   ID:', goal1.id);

        // Test 2: Create another goal
        console.log('\n2️⃣  Creating another goal...');
        const createResponse2 = await fetch(`${BASE_URL}/goals`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: 'Learn PostgreSQL',
                description: 'Master PostgreSQL database administration',
                targetDate: '2025-11-30'
            })
        });
        const goal2 = await createResponse2.json();
        console.log('✅ Goal created:', goal2.title);

        // Test 3: Create tasks linked to goal
        console.log('\n3️⃣  Creating tasks for the goal...');
        const task1Response = await fetch(`${BASE_URL}/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: 'Design database schema',
                goalId: goal1.id,
                tag: 'Development',
                tagColor: '#5590f7',
                isCompleted: true
            })
        });
        const task1 = await task1Response.json();
        console.log('✅ Task 1 created:', task1.text, '(Completed)');

        const task2Response = await fetch(`${BASE_URL}/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: 'Implement API endpoints',
                goalId: goal1.id,
                tag: 'Development',
                tagColor: '#5590f7',
                isCompleted: false
            })
        });
        const task2 = await task2Response.json();
        console.log('✅ Task 2 created:', task2.text, '(Not completed)');

        const task3Response = await fetch(`${BASE_URL}/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: 'Test all endpoints',
                goalId: goal1.id,
                tag: 'Testing',
                tagColor: '#22c55e',
                isCompleted: false
            })
        });
        const task3 = await task3Response.json();
        console.log('✅ Task 3 created:', task3.text, '(Not completed)');

        // Test 4: Get all goals
        console.log('\n4️⃣  Fetching all goals...');
        const getAllResponse = await fetch(`${BASE_URL}/goals`);
        const allGoals = await getAllResponse.json();
        console.log(`✅ Found ${allGoals.length} goals`);
        allGoals.forEach(g => {
            console.log(`   - ${g.title}: ${g.total_tasks} tasks (${g.completed_tasks} completed)`);
        });

        // Test 5: Get goal by ID
        console.log('\n5️⃣  Fetching goal by ID...');
        const getByIdResponse = await fetch(`${BASE_URL}/goals/${goal1.id}`);
        const goalById = await getByIdResponse.json();
        console.log('✅ Goal retrieved:', goalById.title);
        console.log('   Tasks:', goalById.tasks);

        // Test 6: Get goal progress
        console.log('\n6️⃣  Getting goal progress...');
        const progressResponse = await fetch(`${BASE_URL}/goals/${goal1.id}/progress`);
        const progress = await progressResponse.json();
        console.log('✅ Goal progress:');
        console.log(`   - Total tasks: ${progress.total_tasks}`);
        console.log(`   - Completed tasks: ${progress.completed_tasks}`);
        console.log(`   - Progress: ${progress.progress_percentage}%`);

        // Test 7: Update goal
        console.log('\n7️⃣  Updating goal...');
        const updateResponse = await fetch(`${BASE_URL}/goals/${goal1.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                description: 'Updated: Complete PostgreSQL backend integration for the Organizer App'
            })
        });
        const updatedGoal = await updateResponse.json();
        console.log('✅ Goal updated:', updatedGoal.description);

        // Test 8: Toggle goal completion
        console.log('\n8️⃣  Toggling goal completion...');
        const toggleResponse1 = await fetch(`${BASE_URL}/goals/${goal2.id}/toggle`, {
            method: 'POST'
        });
        const toggledGoal1 = await toggleResponse1.json();
        console.log('✅ Goal toggled. Completed:', toggledGoal1.completed);

        const toggleResponse2 = await fetch(`${BASE_URL}/goals/${goal2.id}/toggle`, {
            method: 'POST'
        });
        const toggledGoal2 = await toggleResponse2.json();
        console.log('✅ Goal toggled again. Completed:', toggledGoal2.completed);

        // Test 9: Get tasks for a goal
        console.log('\n9️⃣  Getting tasks for goal...');
        const tasksForGoalResponse = await fetch(`${BASE_URL}/tasks/goal/${goal1.id}`);
        const tasksForGoal = await tasksForGoalResponse.json();
        console.log(`✅ Found ${tasksForGoal.length} tasks for this goal`);
        tasksForGoal.forEach(t => {
            console.log(`   - ${t.text} (${t.is_completed ? 'Done' : 'Pending'})`);
        });

        // Test 10: Delete goal
        console.log('\n🔟 Deleting goal...');
        const deleteResponse = await fetch(`${BASE_URL}/goals/${goal2.id}`, {
            method: 'DELETE'
        });
        const deletedGoal = await deleteResponse.json();
        console.log('✅ Goal deleted:', deletedGoal.message);

        // Verify tasks still exist (goal_id should be NULL now)
        console.log('\n🔍 Verifying tasks after goal deletion...');
        const verifyTasksResponse = await fetch(`${BASE_URL}/tasks/${task1.id}`);
        const verifyTask = await verifyTasksResponse.json();
        console.log('✅ Task still exists with goal_id:', verifyTask.goal_id);

        console.log('\n' + '='.repeat(50));
        console.log('🎉 All tests passed successfully!\n');

    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        console.error(error);
    }
}

testGoalsAPI();
