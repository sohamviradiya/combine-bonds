import MainStart from "@/server/main/start.main";

export function register() {
    console.log("Registering instrumentation at " + new Date().toUTCString());
    MainStart().then(() => {
        console.log("Instrumentation registered at " + new Date().toUTCString());
    });
}