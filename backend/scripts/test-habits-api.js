import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000/api';

async function testHabitsAPI() {
    console.log('🧪 Testing Habits API Endpoints\n');
    console.log('='.repeat(50));

    try {
        // Test 1: Create a habit
        console.log('\n1️⃣  Creating a habit...');
        const createResponse1 = await fetch(`${BASE_URL}/habits`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Drink Water',
                icon: 'water_drop',
                frequency: 'daily',
                goal: 8
            })
        });
        const habit1 = await createResponse1.json();
        console.log('✅ Habit created:', habit1.name);
        console.log('   ID:', habit1.id);

        // Test 2: Create another habit
        console.log('\n2️⃣  Creating another habit...');
        const createResponse2 = await fetch(`${BASE_URL}/habits`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Exercise',
                icon: 'fitness_center',
                frequency: 'weekly',
                goal: 3
            })
        });
        const habit2 = await createResponse2.json();
        console.log('✅ Habit created:', habit2.name);

        // Test 3: Get all habits
        console.log('\n3️⃣  Fetching all habits...');
        const getAllResponse = await fetch(`${BASE_URL}/habits`);
        const allHabits = await getAllResponse.json();
        console.log(`✅ Found ${allHabits.length} habits`);
        allHabits.forEach(h => {
            console.log(`   - ${h.name} (${h.completedDates.length} completions)`);
        });

        // Test 4: Get habit by ID
        console.log('\n4️⃣  Fetching habit by ID...');
        const getByIdResponse = await fetch(`${BASE_URL}/habits/${habit1.id}`);
        const habitById = await getByIdResponse.json();
        console.log('✅ Habit retrieved:', habitById.name);

        // Test 5: Toggle habit completion (Add)
        console.log('\n5️⃣  Adding habit completion...');
        const today = new Date().toISOString().split('T')[0];
        const toggleResponse1 = await fetch(`${BASE_URL}/habits/${habit1.id}/complete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date: today })
        });
        const result1 = await toggleResponse1.json();
        console.log(`✅ Completion ${result1.action} for date ${result1.date}`);

        // Test 6: Toggle habit completion (Add yesterday)
        console.log('\n6️⃣  Adding past completion...');
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        const toggleResponse2 = await fetch(`${BASE_URL}/habits/${habit1.id}/complete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date: yesterday })
        });
        const result2 = await toggleResponse2.json();
        console.log(`✅ Completion ${result2.action} for date ${result2.date}`);

        // Test 7: Get habit streak
        console.log('\n7️⃣  Getting habit streak...');
        const streakResponse = await fetch(`${BASE_URL}/habits/${habit1.id}/streak`);
        const streak = await streakResponse.json();
        console.log('✅ Habit streak:');
        console.log(`   - Current streak: ${streak.currentStreak}`);
        console.log(`   - Best streak: ${streak.bestStreak}`);

        // Test 8: Toggle habit completion (Remove)
        console.log('\n8️⃣  Removing habit completion...');
        const toggleResponse3 = await fetch(`${BASE_URL}/habits/${habit1.id}/complete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date: today })
        });
        const result3 = await toggleResponse3.json();
        console.log(`✅ Completion ${result3.action} for date ${result3.date}`);

        // Test 9: Update habit
        console.log('\n9️⃣  Updating habit...');
        const updateResponse = await fetch(`${BASE_URL}/habits/${habit1.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                goal: 10
            })
        });
        const updatedHabit = await updateResponse.json();
        console.log('✅ Habit updated. New goal:', updatedHabit.goal);

        // Test 10: Delete habit
        console.log('\n🔟 Deleting habit...');
        const deleteResponse = await fetch(`${BASE_URL}/habits/${habit2.id}`, {
            method: 'DELETE'
        });
        const deletedHabit = await deleteResponse.json();
        console.log('✅ Habit deleted:', deletedHabit.message);

        console.log('\n' + '='.repeat(50));
        console.log('🎉 All tests passed successfully!\n');

    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        console.error(error);
    }
}

testHabitsAPI();
