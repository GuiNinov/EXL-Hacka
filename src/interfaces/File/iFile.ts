interface iFile {
  id?: number;
  file_name?: string;
  url?: string;
  storaged_at?: string;
  folder?: number;
  created_at?: Date;
  updated_at?: Date;
  elapsed_time?: number;
  deleted?: boolean;
  user_id?: number;
  team_id?: number;
}

export type iStoragedFile = {
  valid?: boolean;
  data?: {
    url: string;
    file_name: string;
    original_name: string;
  };
};
export default iFile;
