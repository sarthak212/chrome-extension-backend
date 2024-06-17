import Queue from "bee-queue";
import { Logs } from "../schema/logs";
import { notifyAllUsers } from "./mailer";
const queue = new Queue("update_database");

queue.process(async (job: any, done: any): Promise<any> => {
  const data = job.data;
  const docs = await Logs.findOne({
    location: data.location,
    ...data.foundCondition,
  });
  if (docs) {
    await Logs.updateOne(
      {
        location: data.location,
      },
      {
        $set: data.updateObject,
      },
      { upsert: true }
    );
    return done(null, { success: true });
  }
  await Logs.updateOne(
    {
      location: data.location,
    },
    {
      $set: data.updateObject,
    },
    { upsert: true }
  );
  const log = await Logs.findOne({ location: data.location });
  if (log && log.location) {
    console.log("update successful for location ", log.location);
    notifyAllUsers({
      location: log.location,
      date: data.availableDates.join(", "),
    });
  }
  // Do some database update
  done(null, { success: true });
});
export default queue;
