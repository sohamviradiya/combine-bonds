import { CronJob } from "cron";
import taskMain from "./tasks.main";

const job = new CronJob("*/2 * * * *",async () => {
	await taskMain();
});

export default function cronMain() {
	job.start();
}
