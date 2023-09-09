import MainStart from "@/server/main/start.main";

export async function register() {
    console.log("Registering instrumentation at " + new Date().toUTCString());
    await MainStart();
    console.log("Instrumentation registered at " + new Date().toUTCString());
}