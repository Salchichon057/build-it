import { skillService } from "@/lib/skills/service/skillService";
import CompleteProfileClient from "./complete-profile-client";

export default async function CompleteProfile() {
  const initialSkills = await skillService.getAvailableSkills();
  return <CompleteProfileClient initialSkills={initialSkills} />;
}
