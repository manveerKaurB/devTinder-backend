const cron = require("node-cron");
const {subDays, startOfDay, endOfDay} = require("date-fns");
const ConnectionRequest = require("../models/connectionRequest");
// cron.schedule("* * * * * *", () => {
//     console.log("hello world, " + new Date());
// })

// run every day at 8:00 am
cron.schedule("0 8 * * *", async () => {
    // send emails to all people who got requests the previous day
    try {
        const yesterday = subDays(new Date(), 1);

        const yesterdayStart = startOfDay(yesterday);
        const yesterdayEnd = endOfDay(yesterday);

        const pendingRequests = await ConnectionRequest.find({
            status: "interested",
            createdAt: {
                $gte: yesterdayStart,
                $lt: yesterdayEnd
            }
        }).populate("fromUserId toUserId");

        const listOfEmails = [...new Set(pendingRequests.map((req)=> req?.toUserId?.emailId))]
        console.log(listOfEmails);
    }
    catch (err) {
        console.error(err);
    }
})