interface iFolderPermissions {
  id: number;
  folder_id: number;
  user_id: number;
  block_read: boolean;
  block_write: boolean;
  block_delete: boolean;
  allow_read_till: boolean;
  allow_write_till: boolean;
  allow_delete_till: boolean;
  access_till: Date;
  created_at: Date;
  updated_at: Date;
}

export default iFolderPermissions;
