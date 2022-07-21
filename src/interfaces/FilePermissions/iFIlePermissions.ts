interface iFilePermissions {
  id: number;
  file_id: number;
  user_id: number;
  block_read: boolean;
  block_update: boolean;
  block_delete: boolean;
  allow_read_till: boolean;
  allow_update_till: boolean;
  allow_delete_till: boolean;
  access_till: Date;
  created_at: Date;
  updated_at: Date;
  team_id: number;
}

export default iFilePermissions;
