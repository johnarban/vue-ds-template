/** minimal tracking data type */
export interface TrackingData {
  user_uuid: string;
  app_time_ms: number;
  [key: string]: string | number;
}

/** PUT body for the "/user-experience" endpoint - story_name is filled in server-side, don't send it */
export interface UserExperienceSubmission {
  uuid: string;
  question: string;
  rating?: string;
  comments?: string;
}
