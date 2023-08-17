import MainStart from "@/server/main/start.main";

export function register() {
    MainStart();
    console.log("Instrumentation registered at " + new Date().toUTCString());
}