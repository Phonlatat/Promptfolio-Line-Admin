import { getAboutData } from "./actions";
import AdminAboutClient from "./about-client";

export default async function AdminAboutPage() {
  const { profile, skills, experience, photos } = await getAboutData();
  return (
    <AdminAboutClient
      initialProfile={profile}
      initialSkills={skills}
      initialExperience={experience}
      initialPhotos={photos}
    />
  );
}
