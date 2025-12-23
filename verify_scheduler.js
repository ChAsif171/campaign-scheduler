
const BASE_URL = "http://localhost:3000/api/v1";

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function runTests() {
    console.log("Starting Scheduler API Verification...");

    // 1. Create Schedule
    console.log("1. Creating Schedule for 'test-campaign-1'...");
    try {
        const createRes = await fetch(`${BASE_URL}/schedule`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                campaignId: "test-campaign-1",
                cronExpression: "* * * * *",
                taskData: { message: "Hello World" }
            })
        });
        if (!createRes.ok) {
            console.error(`Failed to create schedule: ${createRes.status} ${createRes.statusText}`);
            const text = await createRes.text();
            console.error(text);
        } else {
            console.log("Schedule created successfully.");
        }
    } catch (e) {
        console.error("Error creating schedule:", e.message);
    }

    await sleep(1000);

    // 2. Fetch Schedules
    console.log("\n2. Fetching Schedules...");
    try {
        const fetchRes = await fetch(`${BASE_URL}/schedules`);
        if (!fetchRes.ok) {
            console.error(`Failed to fetch schedules: ${fetchRes.status}`);
        } else {
            const data = await fetchRes.json();
            console.log("Schedules:", JSON.stringify(data, null, 2));
            const exists = data.data.find(s => s.campaignId === "test-campaign-1");
            if (exists) {
                console.log("Verified 'test-campaign-1' exists.");
            } else {
                console.warn("'test-campaign-1' not found in list.");
            }
        }
    } catch (e) {
        console.error("Error fetching schedules:", e.message);
    }

    await sleep(1000);

    // 3. Update Schedule
    console.log("\n3. Updating Schedule for 'test-campaign-1'...");
    try {
        const updateRes = await fetch(`${BASE_URL}/schedule/test-campaign-1`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                cronExpression: "*/5 * * * *"
            })
        });
        if (!updateRes.ok) {
            const text = await updateRes.text();
            console.error(`Failed to update schedule: ${updateRes.status} - ${text}`);
        } else {
            console.log("Schedule updated successfully.");
        }
    } catch (e) {
        console.error("Error updating schedule:", e.message);
    }

    await sleep(1000);

    // 4. Verify Update
    console.log("\n4. Verifying Update...");
    try {
        const fetchRes = await fetch(`${BASE_URL}/schedules?campaignId=test-campaign-1`);
        const data = await fetchRes.json();
        const schedule = data.data.find(s => s.campaignId === "test-campaign-1");
        if (schedule && schedule.cronExpression === "*/5 * * * *") {
            console.log("Verified updated cron expression: */5 * * * *");
        } else {
            console.warn("Update verification failed. Current:", schedule);
        }
    } catch (e) {
        console.error("Error verifying update:", e.message);
    }

    await sleep(1000);

    // 5. Delete Schedule
    console.log("\n5. Deleting Schedule 'test-campaign-1'...");
    try {
        const delRes = await fetch(`${BASE_URL}/schedule/test-campaign-1`, {
            method: "DELETE"
        });
        if (!delRes.ok) {
            console.error("Failed to delete schedule");
        } else {
            console.log("Schedule deleted successfully.");
        }
    } catch (e) {
        console.error("Error deleting schedule:", e.message);
    }

    console.log("\nVerification Complete.");
}

runTests();
