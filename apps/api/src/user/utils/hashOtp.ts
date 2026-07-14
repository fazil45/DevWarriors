import crypto from "node:crypto";

export function hashOTP(otp:string){
    return crypto.createHash("sha256").update(otp).digest("hex");
}