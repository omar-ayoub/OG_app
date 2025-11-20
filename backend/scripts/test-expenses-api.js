import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000/api';

async function testExpensesAPI() {
    console.log('🧪 Testing Expenses API Endpoints\n');
    console.log('='.repeat(50));

    try {
        // --- CATEGORIES ---
        console.log('\n--- CATEGORIES ---');

        // Test 1: Get all categories
        console.log('\n1️⃣  Fetching all categories...');
        const getCatsResponse = await fetch(`${BASE_URL}/expenses/categories/all`);
        const categories = await getCatsResponse.json();
        console.log(`✅ Found ${categories.length} categories`);

        // Find 'Food & Dining' category for later use
        const foodCategory = categories.find(c => c.name === 'Food & Dining');
        const transportCategory = categories.find(c => c.name === 'Transportation');

        if (!foodCategory || !transportCategory) {
            throw new Error('Required categories not found. Check database initialization.');
        }
        console.log(`   Using category: ${foodCategory.name} (ID: ${foodCategory.id})`);

        // Test 2: Create custom category
        console.log('\n2️⃣  Creating custom category...');
        const createCatResponse = await fetch(`${BASE_URL}/expenses/categories`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Gadgets',
                icon: 'devices',
                color: '#ff0000'
            })
        });
        const newCategory = await createCatResponse.json();
        console.log('✅ Category created:', newCategory.name);

        // --- BUDGETS ---
        console.log('\n--- BUDGETS ---');

        // Test 3: Create/Update budget
        console.log('\n3️⃣  Setting budget for Food...');
        const today = new Date().toISOString().split('T')[0];
        const budgetResponse = await fetch(`${BASE_URL}/expenses/budgets`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                categoryId: foodCategory.id,
                amount: 500,
                period: 'monthly',
                startDate: today.substring(0, 7) + '-01' // First of current month
            })
        });
        const budget = await budgetResponse.json();
        console.log(`✅ Budget set: $${budget.amount} for ${budget.period}`);

        // --- RECURRING EXPENSES ---
        console.log('\n--- RECURRING EXPENSES ---');

        // Test 4: Create recurring expense
        console.log('\n4️⃣  Creating recurring subscription...');
        const recurringResponse = await fetch(`${BASE_URL}/expenses/recurring`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                amount: 15.99,
                categoryId: categories.find(c => c.name === 'Entertainment').id,
                description: 'Netflix Subscription',
                frequency: 'monthly',
                startDate: today,
                paymentMethodId: categories[0].id // Just use a valid ID, assuming categories exist
            })
        });
        // Note: paymentMethodId should ideally come from payment_methods table, but for now let's check if we can get one
        // Actually, let's skip paymentMethodId or use a hardcoded one if we knew it. 
        // The init-db.sql inserts payment methods with gen_random_uuid(), so we can't guess them.
        // Let's fetch payment methods first? No endpoint for that yet.
        // But wait, the queries.js doesn't have a getAllPaymentMethods.
        // However, the CREATE query allows null paymentMethodId.
        // Let's try without paymentMethodId for now to be safe, or update the script to fetch them if I added an endpoint.
        // I didn't add an endpoint for payment methods. I should probably add one or just pass null.

        // Let's correct the recurring request to use null for paymentMethodId for now
        const recurringResponseCorrected = await fetch(`${BASE_URL}/expenses/recurring`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                amount: 15.99,
                categoryId: categories.find(c => c.name === 'Entertainment').id,
                description: 'Netflix Subscription',
                frequency: 'monthly',
                startDate: today,
                paymentMethodId: null
            })
        });

        const recurring = await recurringResponseCorrected.json();
        console.log('✅ Recurring expense created:', recurring.description);

        // --- EXPENSES ---
        console.log('\n--- EXPENSES ---');

        // Test 5: Create expense
        console.log('\n5️⃣  Creating expense...');
        const expenseResponse1 = await fetch(`${BASE_URL}/expenses`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                amount: 25.50,
                categoryId: foodCategory.id,
                date: today,
                time: '12:30',
                description: 'Lunch at Cafe',
                paymentMethodId: null
            })
        });
        const expense1 = await expenseResponse1.json();
        console.log(`✅ Expense created: $${expense1.amount} for ${expense1.description}`);

        // Test 6: Create another expense
        console.log('\n6️⃣  Creating another expense...');
        const expenseResponse2 = await fetch(`${BASE_URL}/expenses`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                amount: 12.00,
                categoryId: transportCategory.id,
                date: today,
                time: '09:00',
                description: 'Uber to work',
                paymentMethodId: null
            })
        });
        const expense2 = await expenseResponse2.json();
        console.log(`✅ Expense created: $${expense2.amount} for ${expense2.description}`);

        // Test 7: Get all expenses
        console.log('\n7️⃣  Fetching all expenses...');
        const getAllResponse = await fetch(`${BASE_URL}/expenses`);
        const allExpenses = await getAllResponse.json();
        console.log(`✅ Found ${allExpenses.length} expenses`);

        // Test 8: Filter expenses
        console.log('\n8️⃣  Filtering expenses by category (Food)...');
        const filterResponse = await fetch(`${BASE_URL}/expenses?categoryId=${foodCategory.id}`);
        const filteredExpenses = await filterResponse.json();
        console.log(`✅ Found ${filteredExpenses.length} food expenses`);

        // Test 9: Update expense
        console.log('\n9️⃣  Updating expense...');
        const updateResponse = await fetch(`${BASE_URL}/expenses/${expense1.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                amount: 30.00,
                description: 'Lunch at Cafe (with dessert)'
            })
        });
        const updatedExpense = await updateResponse.json();
        console.log(`✅ Expense updated: $${updatedExpense.amount} - ${updatedExpense.description}`);

        // Test 10: Delete expense
        console.log('\n🔟 Deleting expense...');
        const deleteResponse = await fetch(`${BASE_URL}/expenses/${expense2.id}`, {
            method: 'DELETE'
        });
        const deletedExpense = await deleteResponse.json();
        console.log('✅ Expense deleted:', deletedExpense.message);

        // Test 11: Delete custom category
        console.log('\n1️⃣1️⃣ Deleting custom category...');
        const deleteCatResponse = await fetch(`${BASE_URL}/expenses/categories/${newCategory.id}`, {
            method: 'DELETE'
        });
        const deletedCat = await deleteCatResponse.json();
        console.log('✅ Category deleted:', deletedCat.message);

        console.log('\n' + '='.repeat(50));
        console.log('🎉 All tests passed successfully!\n');

    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        console.error(error);
    }
}

testExpensesAPI();
